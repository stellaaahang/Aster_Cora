import assert from 'node:assert/strict';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:5173';
const names = ['Alexis Liu', 'Angelina Chen', 'Lucas Liu', 'Austin Huang', 'Daniel Wang'];
const errors = [];

async function openAbout(page, path = '/about') {
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(new URL(path, base).href);
  if (path.startsWith('/?')) {
    await page.locator('.opening-pass[open]').waitFor();
    await page.locator('.opening-enter').click();
    await page.locator('.opening-pass').waitFor({ state: 'hidden' });
    await page.locator('header nav a[href="/about"]').click();
  }
  await page.locator('#about-heading').waitFor();
  assert.equal(await page.locator('main > section').count(), 5);
  assert.equal(await page.locator('header nav a[href="/about"]').getAttribute('aria-current'), 'page');
}

async function verifyWidth(page) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'Page fits viewport');
}

async function verifyImage(locator, path) {
  await locator.evaluate(image => {
    image.loading = 'eager';
    return image.decode();
  });
  assert.ok((await locator.getAttribute('src')).endsWith(path), 'Expected image ' + path);
}

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await openAbout(desktop, '/?intro=preview');
  assert.equal(await desktop.locator('html').getAttribute('lang'), 'en');
  const heroTop = await desktop.locator('.about-hero-grid').boundingBox();
  const nav = await desktop.locator('header .header-inner').boundingBox();
  assert.ok(heroTop.y > nav.y + nav.height, 'Hero clears the navigation bar');

  const cards = desktop.locator('.crew-card');
  assert.deepEqual(await cards.locator('.crew-card-front .crew-card-name').allTextContents(), names);
  assert.equal(await cards.locator('.crew-card-front[aria-hidden="false"]').count(), names.length);
  const first = cards.first();
  await first.hover();
  await desktop.waitForFunction(() => getComputedStyle(document.querySelector('.crew-card')).transform !== 'none');
  assert.equal(await first.getAttribute('aria-pressed'), 'false');
  await first.press('Enter');
  await desktop.waitForFunction(() => {
    const turn = document.querySelector('.crew-card-turn');
    const matrix = new DOMMatrixReadOnly(getComputedStyle(turn).transform);
    return matrix.m11 < -.99;
  });

  for (const [index, name] of names.entries()) {
    const card = cards.nth(index);
    if (index > 0) await card.click();
    assert.equal(await card.getAttribute('aria-pressed'), 'true');
    assert.equal(await card.locator('.crew-card-back .crew-card-name').textContent(), name);
    const number = String(index + 1).padStart(2, '0');
    await verifyImage(card.locator('.crew-card-front img'), '/crew-' + number + '-pixel.webp');
    await verifyImage(card.locator('.crew-card-back img'), '/crew-' + number + '-photo.webp');
  }
  await first.press('Space');
  assert.equal(await first.getAttribute('aria-pressed'), 'false');
  assert.equal(await cards.nth(1).getAttribute('aria-pressed'), 'true');

  const hatchButton = desktop.locator('.crew-hatch button[aria-controls]');
  const groupPhoto = desktop.locator('img.crew-hatch-photo');
  assert.equal(await groupPhoto.count(), 0);
  await hatchButton.press('Enter');
  assert.equal(await hatchButton.getAttribute('aria-expanded'), 'true');
  await verifyImage(groupPhoto, '/team.webp');
  await desktop.waitForFunction(() => {
    const left = document.querySelector('.crew-hatch-left');
    const right = document.querySelector('.crew-hatch-right');
    const translation = el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41;
    return translation(left) < -left.offsetWidth && translation(right) > right.offsetWidth
      && Number(getComputedStyle(document.querySelector('.crew-hatch-photo')).opacity) === 1;
  });
  await desktop.getByRole('link', { name: 'View Team Members' }).click();
  assert.equal(new URL(desktop.url()).hash, '#team');

  assert.equal(await desktop.locator('.about-journey').count(), 0);

  for (const name of ['Our Mission','Our Vision']) {
    assert.ok(await desktop.locator('#vision').getByRole('heading',{name,exact:true}).isVisible());
  }
  assert.equal(await desktop.locator('#values').getByRole('heading',{name:'Our Value',exact:true}).count(),1);
  assert.equal(await desktop.locator('#values [data-value-card]').count(),4);
  assert.equal(await desktop.getByRole('link',{name:'Contact Us'}).getAttribute('href'),'/contact?from=about');

  await desktop.getByRole('button', { name: '中文', exact: true }).click();
  assert.equal(await desktop.locator('html').getAttribute('lang'), 'zh-CN');
  assert.equal(await cards.nth(1).getAttribute('aria-pressed'), 'true');
  assert.equal(await cards.nth(1).locator('.crew-card-back .crew-card-name').textContent(), '陈奕帆');
  assert.equal(await hatchButton.getAttribute('aria-expanded'), 'true');
  assert.equal(await desktop.getByRole('heading', { name: '我们的愿景', exact:true }).isVisible(), true);
  await hatchButton.click();
  assert.equal(await hatchButton.getAttribute('aria-expanded'), 'false');
  assert.equal(await groupPhoto.locator('..').getAttribute('aria-hidden'), 'true');

  for (const width of [1440, 768]) {
    await desktop.setViewportSize({ width, height: 900 });
    await verifyWidth(desktop);
    await desktop.getByRole('button', { name: 'EN', exact: true }).click();
    await verifyWidth(desktop);
    await desktop.getByRole('button', { name: '中文', exact: true }).click();
  }
  await desktop.goto(new URL('/about#vision', base).href);
  await desktop.waitForFunction(() => {
    const section = document.getElementById('vision');
    return section && section.getBoundingClientRect().top < 180;
  });
  await desktop.close();
  console.log('PASS opening pass, desktop/team card animations, photo hatch, purpose and language state');

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce',
  });
  await openAbout(mobile);
  const mobileCard = mobile.locator('.crew-card').first();
  await mobileCard.tap();
  assert.equal(await mobileCard.getAttribute('aria-pressed'), 'true');
  assert.equal(await mobileCard.locator('.crew-card-turn').evaluate(el => getComputedStyle(el).transform), 'none');
  assert.equal(await mobileCard.locator('.crew-card-front').evaluate(el => getComputedStyle(el).visibility), 'hidden');
  await mobileCard.tap();
  assert.equal(await mobileCard.getAttribute('aria-pressed'), 'false');
  await mobile.getByRole('button', { name: 'Open the Crew Hatch' }).tap();
  await verifyImage(mobile.locator('img.crew-hatch-photo'), '/team.webp');
  for (const width of [390, 320]) {
    await mobile.setViewportSize({ width, height: 844 });
    await verifyWidth(mobile);
    await mobile.getByRole('button', { name: '中文', exact: true }).tap();
    await verifyWidth(mobile);
    await mobile.getByRole('button', { name: 'EN', exact: true }).tap();
  }
  await mobile.close();
  console.log('PASS mobile touch, reduced motion and responsive layout in both languages');
  assert.deepEqual(errors, [], 'No browser runtime errors');
} finally {
  await browser.close();
}
