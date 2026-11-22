import assert from 'node:assert/strict';
import { INTRO_STORAGE_KEY, INTRO_SEEN_VALUE } from '../src/config/intro.ts';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:5173';
const viewport = { width: 1440, height: 900 };
const errors = [];

async function newPage(options = {}) {
  const page = await browser.newPage({ viewport, ...options });
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, value),
    { key: INTRO_STORAGE_KEY, value: INTRO_SEEN_VALUE });
  page.on('pageerror', error => errors.push(error.message));
  return page;
}

async function goto(page, path) {
  await page.goto(new URL(path, base).href);
  await page.locator('main h1').waitFor();
  await page.evaluate(() => document.fonts.ready);
}

const scrollY = page => page.evaluate(() => window.scrollY);
const snapType = page => page.locator('html').evaluate(element => getComputedStyle(element).scrollSnapType);

async function aligned(page, id) {
  try {
    await page.waitForFunction(id => Math.abs(document.getElementById(id).getBoundingClientRect().top
      - parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)) < 3, id, { timeout: 6000 });
  } catch (error) {
    const top = await page.locator('#' + id).evaluate(node => node.getBoundingClientRect().top);
    throw new Error(`Expected ${id} to align at ${page.url()}, but its top is ${top}px`, { cause: error });
  }
}

async function stable(page, action) {
  const before = await scrollY(page);
  await action();
  // Include the browser's wheel/snap settling time after the control updates.
  await page.waitForTimeout(350);
  assert.ok(Math.abs(await scrollY(page) - before) < 3, 'Interaction preserves page position');
}

async function wheelBothWays(page) {
  await page.mouse.move(20, 460);
  const start = await scrollY(page);
  await page.mouse.wheel(0, 380);
  await page.waitForFunction(start => scrollY > start + 250, start);
  await page.mouse.wheel(0, -380);
  await page.waitForFunction(start => scrollY < start + 130, start);
}

try {
  const page = await newPage();
  await goto(page, '/');
  assert.equal(await snapType(page), 'y');
  const chapters = page.locator('main > [data-section-snap]');
  assert.equal(await chapters.count(), 5);
  assert.ok(await chapters.evaluateAll(nodes => nodes.every(node => node.offsetHeight >= innerHeight - 111)));
  const dots = page.locator('.home-section-nav a');
  await dots.nth(0).and(page.locator('[aria-current="location"]')).waitFor();

  const target = await page.locator('#possibilities').evaluate(section => section.offsetTop
    - parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop));
  await page.mouse.move(20, 450);
  await page.mouse.wheel(0, target - 65);
  await aligned(page, 'possibilities');
  await dots.nth(1).and(page.locator('[aria-current="location"]')).waitFor();
  const photo = await page.locator('.why-cora-image').boundingBox();
  const copy = await page.locator('.why-cora-copy').boundingBox();
  assert.ok(photo.x + photo.width < copy.x && photo.y > 88 && photo.y + photo.height <= viewport.height);

  await dots.nth(2).press('Enter');
  await aligned(page, 'journey');
  await dots.nth(2).and(page.locator('[aria-current="location"]')).waitFor();
  await page.getByRole('button', { name: 'Pause orbit', exact: true }).click();
  const station = page.getByRole('button', { name: 'Station · Application Concept', exact: true });
  await station.click();
  await aligned(page, 'journey-detail');
  assert.equal(await station.getAttribute('aria-pressed'), 'true');
  await page.waitForFunction(() => Math.abs(document.getElementById('journey-detail').getBoundingClientRect().top
    - parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)) < 1);
  await stable(page, () => page.locator('#journey-detail').getByRole('button', { name: 'Next', exact: true }).click());
  await dots.nth(3).and(page.locator('[aria-current="location"]')).waitFor();
  await dots.nth(4).click();
  await aligned(page, 'meet-cora');
  await page.goBack();
  await aligned(page, 'journey-detail');
  await page.goForward();
  await aligned(page, 'meet-cora');
  await page.locator('header nav a[href="/about"]').click();
  await page.waitForURL('**/about');
  await page.locator('#about-heading').waitFor();
  assert.ok(await scrollY(page) < 3);
  await page.goBack();
  await aligned(page, 'meet-cora');
  await page.getByRole('button', { name: '中文', exact: true }).click();
  assert.equal(await page.locator('.home-section-nav').getAttribute('aria-label'), '首页章节');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.mouse.move(20, 450);
  const last = await scrollY(page);
  await page.mouse.wheel(0, -600);
  await page.waitForFunction(before => scrollY < before - 200, last);
  await page.keyboard.press('End');
  await page.waitForFunction(() => scrollY + innerHeight >= document.documentElement.scrollHeight - 3);
  console.log('PASS Home proximity, Why Cora layout, Journey detail, native wheel and route/anchor history');

  await goto(page, '/product#modules');
  await aligned(page, 'modules');
  assert.equal(await page.locator('#structure').evaluate(node => getComputedStyle(node).scrollSnapAlign), 'none');
  assert.equal(await page.locator('#modules .product-possibility').count(), 2);
  await page.mouse.wheel(0, 330);
  await page.waitForFunction(() => document.getElementById('modules').getBoundingClientRect().top < -40);
  assert.equal(await page.locator('#modules a').count(), 0);
  await goto(page, '/product');
  await wheelBothWays(page);
  console.log('PASS Product natural structure scrolling and More Possibilities with snap enabled');

  await goto(page, '/applications#try-cora');
  await aligned(page, 'try-cora');
  const labTabs = page.locator('.tech-lab-tabs button');
  assert.equal(await labTabs.count(), 6);
  for (const tab of await labTabs.all()) await stable(page, () => tab.click());
  await stable(page, () => labTabs.last().press('Home'));
  await goto(page, '/applications#mission-scenarios');
  await page.locator('[data-scenario="3"]').click();
  assert.equal(await labTabs.first().getAttribute('aria-selected'),'true');
  await aligned(page, 'try-cora');
  await goto(page, '/applications');
  await wheelBothWays(page);
  console.log('PASS Try Cora stage stays in place and scenario buttons return to the lab');

  await goto(page, '/about#team');
  await aligned(page, 'team');
  const crew = page.locator('.crew-card');
  assert.equal(await crew.count(), 5);
  await stable(page, () => crew.first().click());
  assert.equal(await crew.first().getAttribute('aria-pressed'), 'true');
  await page.locator('.crew-hatch button[aria-controls]').click();
  assert.ok(await page.locator('.crew-hatch-photo').isVisible());
  await goto(page, '/about#vision');
  await aligned(page, 'vision');
  assert.ok(await page.getByRole('heading', { name: 'Our Vision', exact:true }).isVisible());
  assert.ok(await page.getByRole('heading', { name: 'Our Mission', exact:true }).isVisible());
  await goto(page, '/about');
  await wheelBothWays(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await snapType(page), 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 768, height: 1000 });
  assert.equal(await snapType(page), 'none');
  console.log('PASS About flip, hatch, purpose layout, reduced motion and tablet scrolling');
  await page.close();

  const phone = await newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  for (const path of ['/', '/product', '/applications', '/about']) {
    await goto(phone, path);
    assert.equal(await snapType(phone), 'none');
    assert.equal(await phone.locator('.home-section-nav').isVisible(), false);
    await phone.getByRole('button', { name: '中文', exact: true }).tap();
    assert.ok(await phone.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await phone.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await phone.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await phone.waitForFunction(() => scrollY + innerHeight >= document.documentElement.scrollHeight - 3);
    await phone.getByRole('button', { name: 'EN', exact: true }).tap();
    assert.ok(await phone.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  await phone.close();
  assert.deepEqual(errors, []);
  console.log('PASS all four mobile pages reach the footer in natural flow with both languages');
} finally {
  await browser.close();
}
