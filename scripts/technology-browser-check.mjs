import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { INTRO_STORAGE_KEY, INTRO_SEEN_VALUE } from '../src/config/intro.ts';
import { mockCoraAudio } from './cora-audio-mock.mjs';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:5173';
const output = fileURLToPath(new URL('../test-results/technology/', import.meta.url));
await mkdir(output, { recursive: true });
const checks = [];
const errors = [];
async function check(name, work) {
  await work();
  checks.push(name);
  console.log('PASS', name);
}
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
await context.addInitScript(({ key, value }) => {
  localStorage.setItem(key, value);
}, { key: INTRO_STORAGE_KEY, value: INTRO_SEEN_VALUE });
await mockCoraAudio(context, { cancelAsString: true });
const page = await context.newPage();
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
const requestPaths = [];
page.on('request', request => requestPaths.push(new URL(request.url()).pathname));
const lab = page.locator('#try-cora-panel');
const tab = index => page.locator(`#try-cora-tab-${index}`);
const select = index => tab(index).click();
const button = name => lab.getByRole('button', { name, exact: true });
const lastVoiceCall = () => page.evaluate(() => window.voiceCalls.at(-1));
async function language(name) { await page.locator('header').getByRole('button', { name, exact: true }).click(); }
async function loadImages(locator) {
  await locator.locator('img').evaluateAll(async images => {
    for (const image of images) image.loading = 'eager';
    await Promise.all(images.map(image => image.decode()));
  });
}
try {
  await check('Preview replays the original pass and leads into the five-section page', async () => {
    await page.goto(`${base}/?intro=preview`);
    await page.locator('.opening-pass[open] .opening-enter').click();
    await page.getByRole('heading', { name: 'Welcome Aboard', exact: true }).waitFor();
    await page.locator('header nav a[href="/applications"]').click();
    await page.getByRole('heading', { name: 'Cora in Action', exact: true }).waitFor();
    assert.equal(await page.locator('main > section').count(), 5);
    assert.equal(await page.locator('[data-core]').count(), 6);
    assert.equal(await page.locator('[data-scenario-card]').count(), 4);
    assert.equal(await page.locator('#multi-robot-collaboration').count(), 0);
    await loadImages(page.locator('.tech-hero'));
    await page.screenshot({ path: output + 'desktop-hero.png' });
    await page.locator('.tech-hero').getByRole('link', { name: 'Try Cora', exact: true }).click();
    await loadImages(lab);
    await page.locator('.tech-lab').screenshot({ path: output + 'desktop-companion.png' });
  });
  await check('Original pixel frames, four moods, silent default, and bilingual voice cleanup', async () => {
    assert.equal(await lab.locator('.tech-pixel:visible').getAttribute('data-expression'), 'idle');
    assert.equal(await lab.locator('.tech-moods [aria-pressed="true"]').count(), 0);
    for (const [mood, expression] of [['happy','happy'], ['down','down'], ['tired','standby'], ['worried','worried']]) {
      await lab.locator(`button[data-mood="${mood}"]`).click();
      assert.equal(await lab.locator('.tech-pixel:visible').getAttribute('data-expression'), expression);
      assert.equal(await lab.locator(`button[data-mood="${mood}"]`).getAttribute('aria-pressed'), 'true');
    }
    assert.equal(await page.evaluate(() => window.voiceCalls.length), 0);
    await button('Play voice').click();
    await page.waitForFunction(() => window.voiceCalls.at(-1)?.type === 'play');
    assert.equal((await lastVoiceCall()).lang, 'en-US');
    await language('中文');
    assert.equal(await lastVoiceCall(), 'cancel');
    assert.match(await lab.locator('.tech-response:visible').innerText(), /一步一步来/);
    assert.equal(await lab.locator('button[data-mood="worried"]').getAttribute('aria-pressed'), 'true');
    await button('播放语音').click();
    await page.waitForFunction(() => window.voiceCalls.at(-1)?.type === 'play');
    assert.equal((await lastVoiceCall()).lang, 'zh-CN');
    await select(1);
    assert.equal(await lastVoiceCall(), 'cancel');
    await language('EN');
  });
  await check('Real QR decoding distinguishes matched, unknown, unreadable and invalid files', async () => {
    await button('Scan Sample Code').click();
    const result = lab.locator('[data-qr-status="decoded"]');
    await result.waitFor();
    assert.match(await result.innerText(), /ASTER-DEMO-001[\s\S]*Sample Cargo Box[\s\S]*Rack A-02/);
    const upload = lab.locator('input[type="file"]');
    await upload.setInputFiles(fileURLToPath(new URL('../tests/fixtures/unknown-equipment-qr.png', import.meta.url)));
    await lab.getByText('https://example.com/aster-sample', { exact: true }).waitFor();
    assert.match(await result.innerText(), /no matching equipment record/);
    assert.doesNotMatch(await result.innerText(), /Sample Cargo Box/);
    await upload.setInputFiles({ name: 'invalid.png', mimeType: 'image/png', buffer: Buffer.from('invalid image') });
    await lab.locator('[data-qr-status="unreadable"]').waitFor();
    await upload.setInputFiles({ name: 'invalid.txt', mimeType: 'text/plain', buffer: Buffer.from('invalid file') });
    await lab.locator('[data-qr-status="invalidFile"]').waitFor();
    await upload.setInputFiles(fileURLToPath(new URL('../public/images/tech/sample-equipment-qr.png', import.meta.url)));
    await result.waitFor();
    await select(0);
    assert.equal(await lab.locator('button[data-mood="worried"]').getAttribute('aria-pressed'), 'true');
    await select(1);
    assert.match(await result.innerText(), /ASTER-DEMO-001/);
    await language('中文');
    assert.match(await result.innerText(), /示例载物箱/);
    assert.match(await result.innerText(), /ASTER-DEMO-001/);
    await language('EN');
    await button('Reset').click();
    await lab.locator('[data-qr-status="idle"]').waitFor({ state: 'attached' });
  });
  await check('Voice tasks share one feedback flow and photo command opens Photo Logging', async () => {
    await select(2);
    for (const [command, expected] of [['locate','Rack B-04'], ['inventory','Sample inventory'], ['photo','Photo task ready']]) {
      await lab.locator(`button[data-command="${command}"]`).click();
      await lab.getByText(expected, { exact: true }).first().waitFor();
    }
    await button('Open Photo Logging').click();
    assert.equal(await tab(4).getAttribute('aria-selected'), 'true');
  });
  await check('Modules attach and remove; photo scenes remember positions and capture matching pixels; motion still runs', async () => {
    await select(3);
    const options = lab.locator('[data-tech-module]');
    const order = ['cargo','temperature','arm','pump'];
    assert.deepEqual(await options.evaluateAll(nodes => nodes.map(node => node.dataset.techModule)), order);
    for (const module of order) {
      await lab.locator(`[data-tech-module="${module}"]`).click();
      await button('Attach Module').click();
      await lab.locator(`.assembly-stage[data-attached="${module}"]`).waitFor();
    }
    await language('中文');
    await lab.getByText('模块已连接 · 泵阀模块', { exact: true }).waitFor();
    await language('EN');
    await button('Remove Module').click();
    await lab.locator('.assembly-stage[data-attached=""]').waitFor();
    await select(4);
    const frame = lab.locator('.photo-frame');
    for (const [scene, name] of ['Experiment Log','Equipment Maintenance','Crew Photo'].entries()) {
      await lab.getByRole('button', { name, exact: false }).click();
      await button('Astronaut 1').click();
      await frame.press('Enter');
      await frame.press(scene === 1 ? 'ArrowLeft' : 'ArrowRight');
      await button('Astronaut 2').click();
      await frame.press('Enter');
      await page.waitForFunction(() => Array.from(document.querySelectorAll('.photo-actions button')).some(button=>!button.disabled&&button.textContent.includes('Take Photo')));
    }
    await lab.getByRole('button', { name: 'Equipment Maintenance', exact: false }).click();
    const positions = await frame.getAttribute('data-positions');
    assert.equal(JSON.parse(positions)[0].x,121);
    const composition = await frame.locator('canvas').evaluate(canvas => canvas.toDataURL('image/png'));
    await button('Take Photo').click();
    await select(1);
    await select(4);
    assert.equal(await frame.getAttribute('data-positions'), positions);
    assert.equal(await lab.locator('.photo-countdown').count(),0);
    await button('Take Photo').click();
    await lab.locator('.photo-result time').waitFor();
    assert.equal(await lab.locator('.photo-result img').getAttribute('src'), composition);
    await button('Retake').click();
    assert.equal(await frame.getAttribute('data-positions'), positions);
    await select(5);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    for (let index = 0; index < 3; index += 1) {
      await lab.locator(`button[data-destination="${index}"]`).click();
      await lab.locator('animateMotion').waitFor({ state: 'attached' });
      const movingCora = lab.locator('.tech-motion-stage g:has(animateMotion)');
      const origin = await movingCora.evaluate(node => node.getCTM().e);
      await page.waitForFunction(previous => {
        const current = document.querySelector('.tech-motion-stage g:has(animateMotion)')?.getCTM();
        return current && Math.abs(current.e - previous) > 2;
      }, origin, { timeout: 1400 });
      await lab.getByText('Destination Reached', { exact: true }).waitFor();
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.ok(requestPaths.every(path => !path.includes('/models/')), 'Technology should not load the 3D scene');
  });
  await check('Technology and mission actions select the correct demo; Vision opens in About', async () => {
    const cards = ['qr','voice','motion','companion','photo','modules'];
    const tabOrder = [1,2,5,0,4,3];
    for (let index = 0; index < cards.length; index += 1) {
      await page.locator(`[data-core="${cards[index]}"]`).click();
      assert.equal(await tab(tabOrder[index]).getAttribute('aria-selected'), 'true');
      assert.ok(await tab(tabOrder[index]).evaluate(node => node === document.activeElement));
    }
    for (let index = 0; index < 4; index += 1) {
      await page.locator(`[data-scenario-card="${index}"]`).click();
      await page.getByRole('dialog').waitFor();
      await page.locator(`[data-scenario="${index}"]`).click();
      await page.waitForFunction(selected => document.querySelector(`#try-cora-tab-${selected}`).getAttribute('aria-selected') === 'true', [1,3,4,0][index]);
      await page.getByRole('dialog').waitFor({ state: 'hidden' });
      if (index === 1) assert.equal(await lab.locator('[data-tech-module="temperature"]').getAttribute('aria-pressed'),'true');
    }
    await loadImages(page.locator('.tech-scenarios-section'));
    await page.locator('[data-apple-carousel]').screenshot({ path: output + 'desktop-scenarios.png' });
    await page.getByRole('link', { name: 'Discover Our Vision', exact: true }).click();
    await page.waitForURL('**/about#vision');
    await page.locator('#vision').waitFor();
  });
  await check('Both languages fit desktop, tablet and phone, with keyboard-operable scrolling tabs', async () => {
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${base}/applications`);
      for (const lang of ['EN','中文']) {
        await language(lang);
        for (let i = 0; i < 6; i += 1) {
          await select(i);
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}px ${lang} tab ${i} overflow`);
        }
      }
      await select(0);
      await tab(0).press('ArrowRight');
      assert.equal(await tab(1).getAttribute('aria-selected'), 'true');
      assert.ok(await tab(1).evaluate(node => node === document.activeElement));
      if (width === 390) {
        await select(0);
        await loadImages(page.locator('.tech-lab'));
        await page.locator('.tech-lab').screenshot({ path: output + 'mobile-companion-zh.png' });
      }
    }
  });
  assert.deepEqual(errors, []);
  await writeFile(output + 'report.json', JSON.stringify({ checks, errors }, null, 2));
} finally { await browser.close(); }
