import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { modelConfig } from '../src/config/product.ts';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:5173';
const out = fileURLToPath(new URL('../test-results/product/', import.meta.url));
const reports = [];
await mkdir(out, { recursive: true });
async function check(name, action) { await action(); reports.push(name); console.log('PASS', name); }
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'zh-CN' });
const page = await context.newPage();
const errors = [], glbRequests = [];
page.on('pageerror', error => errors.push(String(error)));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
page.on('request', request => { if (new URL(request.url()).pathname === modelConfig.src) glbRequests.push(request.url()); });
const viewer = page.locator('.cora-model-viewer');
const stage = page.locator('.cora-3d-stage');
const pose = async () => (await viewer.getAttribute('data-camera-position')).split(',').map(Number);
const ready = p => p.locator('[data-model-status="ready"][data-camera-position]').waitFor({ timeout: 20000 });
const vectors = { front: [0,0,1], left: [-1,0,0], right: [1,0,0], back: [0,0,-1], top: [0,1,0], bottom: [0,-1,0] };
async function awaitDirection(name) {
  await page.waitForFunction(direction => {
    const { cameraPosition, cameraTarget } = document.querySelector('.cora-model-viewer').dataset;
    if (!cameraPosition || !cameraTarget) return false;
    const target = cameraTarget.split(',').map(Number);
    const offset = cameraPosition.split(',').map((value, i) => Number(value) - target[i]);
    return offset.reduce((sum, value, i) => sum + value * direction[i], 0) / Math.hypot(...offset) > .9995;
  }, vectors[name]);
}
async function preset(name) { await page.locator(`[data-view="${name}"]`).first().click(); await awaitDirection(name); }
const marker = title => page.getByRole('button', { name: `Explore ${title}`, exact: true });
try {
  await check('Official model loads once, with a stable three-quarter view and English copy', async () => {
    await page.goto(`${base}/product`); await ready(page);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.equal(await page.locator('h1').textContent(), 'Meet Cora');
    assert.equal(await viewer.locator('canvas').count(), 1);
    const start = await pose(); await page.waitForTimeout(680); assert.deepEqual(await pose(), start);
    assert.ok(start[0] > 0 && start[1] > 0 && start[2] > start[0]);
    await page.screenshot({ path: `${out}overview-en.png` });
    assert.equal(glbRequests.length, 1);
  });
  await check('The overview and 3D panel expand on wide displays while retaining separate surfaces', async () => {
    const grid = page.locator('.product-overview-grid');
    const initial = await grid.boundingBox();
    const initialViewer = await viewer.boundingBox();
    await page.setViewportSize({ width: 2544, height: 1386 });
    const wide = await grid.boundingBox();
    const wideViewer = await viewer.boundingBox();
    assert.ok(wide.width > 2544 * .9 && wide.width > initial.width * 1.5);
    assert.ok(wideViewer.width > initialViewer.width && wideViewer.height > initialViewer.height);
    const [outer, inner] = await page.evaluate(() => ['.product-overview-grid', '.cora-model-viewer'].map(selector => {
      const color = getComputedStyle(document.querySelector(selector)).backgroundColor;
      return Number(color.match(/, ([.\d]+)\)$/)?.[1]);
    }));
    assert.ok(outer < .25 && inner > .7);
    await page.setViewportSize({ width: 1440, height: 1000 });
  });
  await check('Six real camera presets face the correct axes and hide obscured parts', async () => {
    for (const name of Object.keys(vectors)) {
      await preset(name);
      await stage.screenshot({ path: `${out}view-${name}.png` });
      if (name === 'front') assert.ok(await marker('Vision & Sensing').isVisible());
      if (name === 'left' || name === 'right') assert.ok(await marker('Modular Interfaces').isVisible());
      if (name === 'back') assert.ok(await marker('Control & Internal Design').isVisible());
      if (name !== 'front') assert.ok(!await marker('Interactive Display').isVisible());
      assert.equal(await page.locator(`.cora-camera-presets [data-view="${name}"]`).getAttribute('aria-pressed'), 'true');
    }
  });
  await check('Orbit, wheel, keyboard and bounded zoom operate on the same camera', async () => {
    await page.getByRole('button', { name: 'Reset view', exact: true }).click();
    await page.waitForTimeout(650);
    const start = await pose(), box = await viewer.locator('canvas').boundingBox();
    const pageStart = await page.evaluate(() => scrollY);
    await page.mouse.move(box.x + box.width * .23, box.y + box.height * .5);
    await page.mouse.down(); await page.mouse.move(box.x + box.width * .23 + 95, box.y + box.height * .5 + 40, { steps: 12 }); await page.mouse.up();
    await page.waitForTimeout(220);
    assert.notDeepEqual(await pose(), start);
    assert.equal(await viewer.getAttribute('data-camera-view'), 'free');
    const beforeWheel = Math.hypot(...await pose());
    await page.mouse.wheel(0, -220);
    await page.waitForFunction(previous => Math.hypot(...document.querySelector('.cora-model-viewer').dataset.cameraPosition.split(',').map(Number)) < previous * .99, beforeWheel);
    const zoomed = Math.hypot(...await pose());
    await page.mouse.wheel(0, 240);
    await page.waitForFunction(previous => Math.hypot(...document.querySelector('.cora-model-viewer').dataset.cameraPosition.split(',').map(Number)) > previous * 1.01, zoomed);
    assert.ok(Math.abs(await page.evaluate(() => scrollY) - pageStart) < 3, 'Orbit and wheel zoom preserve the page position');
    await preset('front');
    await marker('Interactive Display').click();
    await page.waitForFunction(() => Number(document.querySelector('.cora-model-viewer').dataset.cameraMagnification) > 1.5);
    assert.ok(Math.abs(await page.evaluate(() => scrollY) - pageStart) < 3, 'Hotspot selection preserves the page position with snap enabled');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.getByRole('button', { name: 'Reset view', exact: true }).click();
    await preset('front');
    const keyboardStart = await pose();
    await viewer.locator('.cora-3d-canvas').press('ArrowRight');
    await page.waitForFunction(previous => document.querySelector('.cora-model-viewer').dataset.cameraPosition !== previous, keyboardStart.map(n => n.toFixed(4)).join(','));
    const beforeZoom = Math.hypot(...await pose());
    await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
    await page.waitForFunction(previous => Math.hypot(...document.querySelector('.cora-model-viewer').dataset.cameraPosition.split(',').map(Number)) < previous * .99, beforeZoom);
    const zoomIn = page.getByRole('button', { name: 'Zoom in', exact: true });
    for (let i=0;i<12;i++) await zoomIn.click();
    const closest = Math.hypot(...await pose());
    await zoomIn.click();
    assert.ok(closest > Math.sqrt(3)*3.2/2 && Math.abs(Math.hypot(...await pose())-closest) < .01, 'Closest orbit stays outside the shell');
    await page.getByRole('button', { name: 'Reset view', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('.cora-model-viewer output').textContent === '100%');
  });
  await check('Each component has one detail panel, including both side interfaces', async () => {
    const pairs = [['sensing','Vision & Sensing','front'], ['display','Interactive Display','front'], ['interfaces','Modular Interfaces','right'], ['structure','Mechanical Structure','reset'], ['control','Control & Internal Design','back']];
    for (const [,title,direction] of pairs) {
      if (direction === 'reset') {
        await page.getByRole('button', { name: 'Reset view', exact: true }).click();
        await page.waitForTimeout(650);
      } else await preset(direction);
      await marker(title).click();
      if (direction !== 'reset') await awaitDirection(direction);
      assert.equal(await page.locator('#model-hotspot-info h3').textContent(), title);
      assert.equal(await viewer.locator('.model-hotspot.is-selected').count(), 1);
    }
    await preset('left'); await marker('Modular Interfaces').click(); await awaitDirection('left');
    assert.equal(await page.locator('#model-hotspot-info h3').textContent(), 'Modular Interfaces');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#model-hotspot-info.is-selected').count(), 0);
  });
  await check('Front hotspots frame their components, wake the display, and zoom out to centered rotation', async () => {
    const zooms = [];
    for (const [title, key] of [['Mechanical Structure', 'fan'], ['Vision & Sensing', 'sensor'], ['Interactive Display', 'display']]) {
      await page.getByRole('button', { name: 'Reset view', exact: true }).click();
      await page.waitForFunction(() => document.querySelector('.cora-model-viewer').dataset.cameraMagnification === '1.000');
      const pageStart = await page.evaluate(() => scrollY);
      await marker(title).click();
      await page.waitForFunction(() => Number(document.querySelector('.cora-model-viewer').dataset.cameraMagnification) > 1.5);
      assert.ok(Math.abs(await page.evaluate(() => scrollY) - pageStart) < 3, 'Hotspot selection preserves the page position');
      const target = (await viewer.getAttribute('data-camera-target')).split(',').map(Number);
      assert.ok(Math.hypot(...target) > 1, 'The camera targets the component rather than the model center');
      zooms.push(Number(await viewer.getAttribute('data-camera-magnification')));
      const frame = await stage.screenshot({ path: `${out}close-up-${key}.png` });
      if (key === 'display') {
        await awaitDirection('front');
        const pixel = await page.evaluate(async source => {
          const img = new Image(); img.src = source; await img.decode();
          const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, Math.floor(img.width / 2), Math.floor(img.height / 2), 1, 1, 0, 0, 1, 1);
          return Array.from(ctx.getImageData(0, 0, 1, 1).data).slice(0, 3);
        }, `data:image/png;base64,${frame.toString('base64')}`);
        assert.ok(pixel.every(channel => channel >= 248), `Display center should be white: ${pixel}`);
      }
      if (key === 'sensor') await viewer.locator('.cora-3d-canvas').press('-');
      else await page.getByRole('button', { name: 'Zoom out', exact: true }).click();
      await page.waitForFunction(() => {
        const { cameraTarget, cameraMagnification } = document.querySelector('.cora-model-viewer').dataset;
        return cameraMagnification === '1.000' && cameraTarget.split(',').every(value => Number(value) === 0);
      });
      if (key !== 'fan') await awaitDirection('front');
      assert.equal(await page.locator('#model-hotspot-info h3').textContent(), title);
      assert.ok(Math.abs(await page.evaluate(() => scrollY) - pageStart) < 3, 'Zoom out preserves the page position');
      const centeredPose = await pose();
      await viewer.locator('.cora-3d-canvas').press('ArrowRight');
      await page.waitForFunction(previous => document.querySelector('.cora-model-viewer').dataset.cameraPosition !== previous,
        centeredPose.map(value => value.toFixed(4)).join(','));
    }
    assert.ok(zooms[0] > zooms[1] * 1.5 && zooms[0] > zooms[2] * 1.5, 'Fan framing is the tightest');
    await page.getByRole('button', { name: 'Reset view', exact: true }).click();
  });
  await check('All three expressions change only the real display area and preserve the camera', async () => {
    await preset('front');
    const start = await pose();
    const capture = () => stage.screenshot();
    const frames = [await capture()];
    for (const mode of ['standby','working','companion']) {
      const pageStart = await page.evaluate(() => scrollY);
      await page.locator(`[data-mode="${mode}"]`).click();
      assert.ok(Math.abs(await page.evaluate(() => scrollY) - pageStart) < 3, 'Display selection preserves the page position');
      assert.equal(await viewer.getAttribute('data-display-mode'), mode);
      assert.deepEqual(await pose(), start);
      frames.push(await capture());
      await writeFile(`${out}screen-${mode}.png`, frames.at(-1));
    }
    const changes = await page.evaluate(async sources => {
      const imgs = await Promise.all(sources.map(async source => { const image = new Image(); image.src = source; await image.decode(); return image; }));
      const surface = document.createElement('canvas'); surface.width = imgs[0].width; surface.height = imgs[0].height;
      const ctx = surface.getContext('2d', { willReadFrequently: true }), { width, height } = surface;
      const pixels = imgs.map(image => { ctx.clearRect(0, 0, width, height); ctx.drawImage(image, 0, 0); return ctx.getImageData(0, 0, width, height).data; });
      return pixels.slice(1).map(frame => {
        let x0=width, x1=0, y0=height, y1=0, total=0;
        for (let y=0;y<height;y++) for (let x=0;x<width;x++) {
          const i=4*(y*width+x);
          if (Math.max(...[0,1,2].map(channel=>Math.abs(frame[i+channel]-pixels[0][i+channel]))) <= 12) continue;
          x0=Math.min(x0,x); x1=Math.max(x1,x); y0=Math.min(y0,y); y1=Math.max(y1,y); total++;
        }
        return { total, x0:x0/width, x1:x1/width, y0:y0/height, y1:y1/height };
      });
    }, frames.map(frame => `data:image/png;base64,${frame.toString('base64')}`));
    for (const diff of changes) assert.ok(diff.total > 500 && diff.x0 > .28 && diff.x1 < .72 && diff.y0 > .3 && diff.y1 < .78, JSON.stringify(diff));
    assert.ok(!frames[1].equals(frames[2]) && !frames[2].equals(frames[3]) && !frames[1].equals(frames[3]), 'Each mode has a distinct expression');
  });
  await check('Native fullscreen and keyboard-trapped fallback preserve the camera', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await preset('right');
    const start = await pose();
    await page.getByRole('button', { name: 'Enter fullscreen', exact: true }).click();
    await viewer.locator('.cora-viewer-topbar button[aria-label="Exit fullscreen"]').waitFor();
    assert.equal(await page.evaluate(() => document.fullscreenElement?.matches('.cora-model-viewer')), true);
    await awaitDirection('right');
    await page.getByRole('button', { name: 'Exit fullscreen', exact: true }).click();
    await viewer.locator('.cora-viewer-topbar button[aria-label="Enter fullscreen"]').waitFor();
    await awaitDirection('right');
    assert.ok(Math.abs(Math.hypot(...await pose()) - Math.hypot(...start)) < .08);
    await page.evaluate(() => Object.defineProperty(document, 'fullscreenEnabled', { configurable:true, value:false }));
    await page.getByRole('button', { name: 'Enter fullscreen', exact: true }).click();
    await page.getByRole('dialog', { name: 'Interactive Cora 3D viewer' }).waitFor();
    assert.equal(await page.locator('header').evaluate(node => node.inert), true);
    assert.ok(await page.evaluate(() => !!document.elementFromPoint(110, 35)?.closest('.cora-model-viewer')));
    for (let i=0;i<16;i++) { await page.keyboard.press('Tab'); assert.ok(await viewer.evaluate(node => node.contains(document.activeElement))); }
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('dialog').count(),0);
    assert.equal(await page.locator('header').evaluate(node => node.inert), false);
    assert.ok(await page.getByRole('button', { name: 'Enter fullscreen', exact: true }).evaluate(node => document.activeElement===node));
  });
  await check('Core Design uses five icon-and-text controls linked to the model', async () => {
    const section = page.locator('#structure');
    assert.equal(await section.getByRole('heading', { level: 2 }).textContent(), "Cora's Core Design");
    assert.equal(await section.locator('img, canvas, .circular-gallery, .core-gallery-help, .core-gallery-navigation').count(), 0);
    const controls = section.locator('[data-component]');
    const names = ['Vision & Sensing', 'Interactive Display', 'Modular Interfaces', 'Mechanical Structure', 'Control & Internal Design'];
    assert.equal(await controls.count(),5);
    for (const [index, name] of names.entries()) {
      await controls.nth(index).click();
      assert.equal(await controls.nth(index).getAttribute('aria-pressed'),'true');
      assert.equal(await page.locator('#model-hotspot-info h3').textContent(),name);
    }
    await page.getByRole('button', { name: '中文', exact: true }).click();
    assert.equal(await section.getByRole('heading', { level: 2 }).textContent(), 'Cora 的核心设计');
    assert.equal(await controls.last().getAttribute('aria-pressed'),'true');
    assert.equal(await page.locator('#model-hotspot-info h3').textContent(),'控制与内部设计');
    await controls.nth(1).press('Enter');
    assert.equal(await page.locator('#model-hotspot-info h3').textContent(),'交互式显示屏');
    await page.getByRole('button', { name: 'EN', exact: true }).click();
    assert.equal(await page.locator('#model-hotspot-info h3').textContent(),'Interactive Display');
  });
  await check('More Possibilities shows two localized illustrations without navigation buttons', async () => {
    const possibilities = page.locator('#modules');
    assert.deepEqual(await possibilities.getByRole('heading', { level: 3 }).allTextContents(), ['Modular Expansion', 'Multi-Robot Collaboration']);
    assert.equal(await viewer.locator('canvas').count(),1);
    await possibilities.scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => scrollY);
    await page.getByRole('button', { name: '中文', exact: true }).click();
    assert.deepEqual(await possibilities.getByRole('heading', { level: 3 }).allTextContents(), ['模块化拓展', '多机协作']);
    assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN');
    assert.ok(Math.abs(await page.evaluate(() => scrollY)-before)<3);
    await possibilities.screenshot({ path: `${out}possibilities-zh.png` });
    await page.getByRole('button', { name: 'EN', exact: true }).click();
    assert.equal(await possibilities.getByRole('link').count(), 0);
    assert.equal(await possibilities.locator('.product-possibilities-heading p').count(), 0);
  });
  await check('The Product poster comes from the matte-white model, and the closing link still works', async () => {
    await page.getByRole('button', { name: 'Static view', exact: true }).click();
    assert.equal(await viewer.locator('canvas').count(),0);
    await viewer.locator('.cora-model-poster').waitFor();
    assert.equal(await viewer.locator('.cora-model-poster').getAttribute('src'), modelConfig.viewerPoster);
    assert.ok(await viewer.locator('.cora-model-poster').evaluate(image => image.naturalWidth > 0));
    await page.getByRole('button', { name: 'Return to 3D', exact: true }).click(); await ready(page);
    assert.equal(glbRequests.length, 1);
    await page.getByRole('link', { name: "Explore Cora's Technology", exact: true }).click();
    await page.waitForURL('**/applications#technology');
    await page.locator('#technology-title').waitFor();
  });
  await check('Mobile page scrolling and opt-in touch rotation both work in Chinese', async () => {
    const mobile = await browser.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:1, isMobile:true, hasTouch:true, reducedMotion:'reduce' });
    const p = await mobile.newPage(), cdp = await mobile.newCDPSession(p);
    await p.goto(`${base}/product`); await ready(p);
    const canvas = p.locator('.cora-3d-stage canvas');
    await canvas.scrollIntoViewIfNeeded();
    const action = () => canvas.evaluate(node => getComputedStyle(node).touchAction);
    assert.equal(await action(), 'pan-y');
    async function swipe(dx, dy) {
      const rect = await canvas.boundingBox(), x = rect.x + rect.width * .20, y = Math.min(680, Math.max(180, rect.y + rect.height * .70));
      await cdp.send('Input.dispatchTouchEvent', { type:'touchStart', touchPoints:[{x,y}] });
      for (let i=1;i<=6;i++) await cdp.send('Input.dispatchTouchEvent', { type:'touchMove', touchPoints:[{x:x+dx*i/6,y:y+dy*i/6}] });
      await cdp.send('Input.dispatchTouchEvent', { type:'touchEnd', touchPoints:[] });
    }
    const scrollStart = await p.evaluate(() => scrollY);
    await swipe(0,-128);
    await p.waitForFunction(start=>scrollY>start+18, scrollStart);
    await p.getByRole('button',{name:'Enable rotation',exact:true}).tap();
    await canvas.scrollIntoViewIfNeeded();
    assert.equal(await action(), 'none');
    const start = await p.locator('.cora-model-viewer').getAttribute('data-camera-position');
    await swipe(88,-20);
    await p.waitForFunction(start=>document.querySelector('.cora-model-viewer').dataset.cameraPosition!==start,start);
    const rect = await canvas.boundingBox(), centerX = rect.x+rect.width*.5, centerY = rect.y+rect.height*.5;
    const distance = () => p.locator('.cora-model-viewer').evaluate(node=>Math.hypot(...node.dataset.cameraPosition.split(',').map(Number)));
    const beforePinch = await distance();
    for (const radius of [24, 30, 36, 43, 50]) {
      await cdp.send('Input.dispatchTouchEvent', { type:radius===24?'touchStart':'touchMove', touchPoints:[{x:centerX-radius,y:centerY,id:1},{x:centerX+radius,y:centerY,id:2}] });
    }
    await cdp.send('Input.dispatchTouchEvent', { type:'touchEnd', touchPoints:[] });
    assert.ok(await distance() < beforePinch*.99, 'Pinching out zooms in');
    await p.getByRole('button',{name:'Enable page scrolling',exact:true}).tap();
    assert.equal(await action(), 'pan-y');
    await p.getByRole('button',{name:'中文',exact:true}).tap();
    await p.locator('.cora-camera-presets [data-view="front"]').tap();
    await p.getByRole('button',{name:'探索 交互式显示屏',exact:true}).tap();
    assert.equal(await p.locator('#model-hotspot-info h3').textContent(),'交互式显示屏');
    await p.evaluate(()=>scrollTo(0,0));
    await p.screenshot({ path:`${out}mobile-zh.png`, fullPage:true });
    for (const width of [768,320]) {
      await p.setViewportSize({width,height:900});
      assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1), `overflow at ${width}px`);
    }
    await mobile.close();
  });
  await check('A failed model fetch shows the real poster and retries successfully', async () => {
    const failing = await browser.newContext({ reducedMotion:'reduce' });
    let attempts=0;
    await failing.route(`**${modelConfig.src}`,route=>++attempts===1?route.abort('failed'):route.continue());
    const p=await failing.newPage(); await p.goto(`${base}/product`);
    await p.locator('[data-model-status="error"]').waitFor();
    assert.ok(await p.locator('.cora-model-poster').evaluate(image=>image.naturalWidth>0));
    assert.ok(await p.getByRole('heading',{name:"Designed for What's Next",exact:true}).isVisible());
    await p.getByRole('button',{name:'Retry 3D model',exact:true}).click(); await ready(p);
    assert.equal(attempts,2);
    await failing.close();
  });
  await check('WebGL-unavailable browsers retain the static product and page content', async () => {
    const unsupported = await browser.newContext({ reducedMotion:'reduce' });
    await unsupported.addInitScript(()=>{
      const native = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext=function(type,...options){ return /webgl/.test(type)?null:native.call(this,type,...options); };
    });
    const p=await unsupported.newPage(); await p.goto(`${base}/product`);
    await p.locator('[data-model-status="error"]').waitFor();
    await p.getByRole('button',{name:'Static view',exact:true}).click();
    assert.ok(await p.locator('.cora-model-poster').isVisible());
    assert.ok(await p.getByRole('link',{name:"Explore Cora's Technology",exact:true}).isVisible());
    await unsupported.close();
  });
  assert.deepEqual(errors, [], 'No runtime errors in the normal model path');
  await writeFile(`${out}report.json`, JSON.stringify({ checked:reports, glbRequests:glbRequests.length, errors },null,2));
} finally { await browser.close(); }
