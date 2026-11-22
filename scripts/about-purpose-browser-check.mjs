import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:5173';
const errors = [];
async function loaded(page, id) {
  await page.locator(id).scrollIntoViewIfNeeded();
  await page.locator(`${id} img`).evaluateAll(images => Promise.all(images.map(image => image.decode())));
}
async function opaque(locator) {
  await locator.evaluate(element => new Promise(resolve => {
    function check() { if (Number(getComputedStyle(element).opacity) > .99) resolve(); else requestAnimationFrame(check); }
    check();
  }));
}
try {
  for (const mobile of [false, true]) {
    const page = await browser.newPage({ viewport: { width: mobile ? 390 : 1440, height: 1000 }, isMobile: mobile, hasTouch: mobile });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/about#vision`);
    await page.evaluate(() => document.fonts.ready);
    await loaded(page, '#vision');
    assert.equal(await page.locator('main > section[data-section-snap]').count(), 5);
    assert.equal(await page.locator('#vision').getByRole('heading', { name: 'Our Mission & Vision', exact: true }).count(), 1);
    assert.ok((await page.locator('#vision img').first().getAttribute('src')).endsWith('about-mission-earth.jpg'));
    const mission = page.getByRole('group', { name: 'Our Mission', exact: true });
    const text = mission.locator('h3').locator('..');
    const start = await page.evaluate(() => scrollY);
    if (!mobile) {
      const r = await mission.boundingBox();
      for (const [direction, x, y, toX, toY] of [
        ['top',r.x+r.width/2,r.y-8,r.x+r.width/2,r.y+2],
        ['right',r.x+r.width+8,r.y+r.height/2,r.x+r.width-2,r.y+r.height/2],
        ['bottom',r.x+r.width/2,r.y+r.height+8,r.x+r.width/2,r.y+r.height-2],
        ['left',r.x-8,r.y+r.height/2,r.x+2,r.y+r.height/2],
      ]) {
        await page.mouse.move(x,y); await page.mouse.move(toX,toY);
        assert.equal(await mission.getAttribute('data-direction'),direction);
        await opaque(text);
      }
      await page.mouse.move(5, 110); await mission.focus(); await opaque(text);
    } else { await opaque(text); }
    assert.ok(Math.abs(await page.evaluate(() => scrollY)-start)<4);
    await page.locator('#vision').screenshot({ path: `/tmp/aster-purpose-final-${mobile ? 'mobile' : 'desktop'}.png` });
    await loaded(page, '#values');
    const cards = page.locator('[data-value-card]');
    assert.equal(await cards.count(), 4);
    assert.equal(await page.locator('#values img').count(), 4);
    for (let id = 1; id <= 4; id++) {
      const trigger = page.locator(`[data-value-card="${id}"]`);
      const label = await trigger.getAttribute('aria-label');
      const top = await page.evaluate(() => scrollY);
      await trigger.press('Enter');
      const expanded = page.locator(`[data-value-expanded="${id}"]`);
      await expanded.waitFor();
      assert.equal(await expanded.locator('h3').innerText(), label);
      assert.ok(Math.abs(await page.evaluate(() => scrollY)-top)<4);
      if (id === 2) {
        await page.locator('header').getByRole('button',{ name:'中文',exact:true }).click();
        assert.equal(await expanded.locator('h3').innerText(),'关注每一位探索者');
        await page.locator('header').getByRole('button',{ name:'EN',exact:true }).click();
      }
      await expanded.getByRole('button',{ name:'Close details',exact:true }).focus();
      await page.keyboard.press('Escape');
      await expanded.waitFor({ state:'hidden' });
      assert.equal(await page.locator(`[data-value-card="${id}"]`).evaluate(el=>el===document.activeElement),true);
    }
    await page.locator('[data-value-card="1"]').click();
    await page.waitForTimeout(550); // Wait for the expanded image to clear its original tile bounds.
    const bounds = await page.locator('[data-value-grid]').boundingBox();
    await page.mouse.click(bounds.x+2,bounds.y+2);
    await page.locator('[data-value-expanded]').waitFor({state:'hidden'});
    await page.locator('#values').screenshot({ path:`/tmp/aster-values-final-${mobile ? 'mobile' : 'desktop'}.png` });
    await page.emulateMedia({ reducedMotion:'reduce', colorScheme:'dark' });
    await loaded(page, '#vision'); await mission.focus(); await opaque(text);
    await page.waitForFunction(()=>{
      const image=document.querySelector('#vision img');
      const m=new DOMMatrixReadOnly(getComputedStyle(image.parentElement).transform);
      return Math.abs(m.m41)<.1 && Math.abs(m.m42)<.1;
    });
    await page.locator('header').getByRole('button',{name:'中文',exact:true}).click();
    assert.equal(await page.locator('#about-purpose-title').innerText(),'我们的使命与愿景');
    assert.equal(await page.locator('#about-values-title').innerText(),'我们的价值');
    assert.ok(await page.locator('body').evaluate(el=>el.scrollWidth<=innerWidth));
    await page.goto(`${base}/about/value`); await page.locator('[data-value-grid]').waitFor();
    assert.equal(await page.locator('[data-value-card]').count(),4);
    console.log('PASS',mobile?'mobile':'desktop','separate chapters, hover/touch/keyboard, all four expansions, locale retention, focus return, reduced motion/dark preference, legacy link');
    await page.close();
  }
  assert.deepEqual(errors,[]);
} finally { await browser.close(); }
