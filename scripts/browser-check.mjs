import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { INTRO_STORAGE_KEY, INTRO_SEEN_VALUE } from '../src/config/intro.ts';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless:true, channel:'chrome', args:['--enable-unsafe-swiftshader','--use-angle=swiftshader'], ...(process.env.BROWSER_EXECUTABLE ? {executablePath:process.env.BROWSER_EXECUTABLE} : {}) });
const context = await browser.newContext({ viewport:{width:1440,height:1000}, locale:'zh-CN', reducedMotion:'reduce' });
await context.addInitScript(({key,value})=>localStorage.setItem(key,value),{key:INTRO_STORAGE_KEY,value:INTRO_SEEN_VALUE});
const page = await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(String(e)));
page.on('console',m=>{if(m.type()==='error') errors.push(m.text());});
const base=process.env.PREVIEW_URL || 'http://127.0.0.1:5173';
const results=[];
const out = fileURLToPath(new URL('../test-results/',import.meta.url));
await mkdir(out,{recursive:true});
async function check(name,fn){await fn();results.push(name);console.log('PASS',name);}
async function loadImages(){await page.evaluate(async()=>{document.querySelectorAll('img').forEach(img=>{img.loading='eager';});await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});}
async function clickTab(id,index){await page.locator(`#${id}-tab-${index}`).click();assert.equal(await page.locator(`#${id}-tab-${index}`).getAttribute('aria-selected'),'true');}
await check('English is the first-visit default, independent of browser locale',async()=>{
 await page.goto(base);await page.waitForSelector('.reference-home-visual img');await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('html').getAttribute('lang'),'en');
 await loadImages();await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:out+'home-desktop.png',fullPage:true});
});
await check('Product navigation opens the official model and preserves its state on language switch',async()=>{
 await page.locator('header nav a[href="/product"]').click();await page.waitForURL('**/product');
 await page.locator('[data-model-status="ready"][data-camera-position]').waitFor();
 await page.locator('[data-view="front"]').click();
 await page.getByRole('button',{name:'Explore Vision & Sensing',exact:true}).click();
 assert.equal(await page.locator('#model-hotspot-info h3').textContent(),'Vision & Sensing');
 await page.locator('[data-mode="working"]').click();
 await page.getByRole('button',{name:'中文',exact:true}).click();
 assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN');
 assert.equal(await page.locator('#model-hotspot-info h3').textContent(),'视觉与感知');
 assert.equal(await page.locator('.cora-model-viewer').getAttribute('data-display-mode'),'working');
 assert.equal(new URL(page.url()).pathname,'/product');
 await loadImages();await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:out+'product-desktop.png',fullPage:true});
});
await check('Language persists across navigation and refresh',async()=>{
 await page.locator('header nav a[href="/applications"]').click();await page.locator('.tech-hero-copy').waitFor();assert.equal(await page.locator('h1').textContent(),'体验 Cora');
 await page.reload();assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN');
 for(let i=0;i<6;i++)await clickTab('try-cora',i);
 await page.getByRole('button',{name:'EN',exact:true}).click();
 assert.equal(await page.locator('#try-cora-tab-5').getAttribute('aria-selected'),'true');
 await loadImages();await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:out+'applications-desktop.png',fullPage:true});
 await page.goto(base+'/about');await loadImages();await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:out+'about-desktop.png',fullPage:true});
});
await check('Every page loads all images and fits desktop/tablet/mobile in both languages',async()=>{
 for(const width of [1440,768,390,320]){
   await page.setViewportSize({width,height:900});
   for(const lang of ['en','zh']){
     await page.getByRole('button',{name:lang==='en'?'EN':'中文',exact:true}).click();
     for(const route of ['/','/product','/applications','/about']){
       await page.goto(base+route);await page.evaluate(()=>document.fonts.ready);
       // Force native-lazy images to load before validating.
       await page.evaluate(async()=>{document.querySelectorAll('img').forEach(img=>{img.loading='eager';});await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
       if(route==='/product') await page.locator('[data-model-status="ready"][data-camera-position]').waitFor();
       assert.equal(await page.locator('h1').count(),1,route);
       const dims=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
       assert.ok(dims.scroll<=dims.width+1,`${route} ${lang} ${width}: overflow ${dims.scroll}`);
       assert.equal(await page.locator('.image-error').count(),0,`${route}: images`);
       if(width===390){await loadImages();await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:out+`${route==='/'?'home':route.slice(1)}-${lang}-mobile.png`,fullPage:true});}
     }
   }
 }
});
await check('Mobile navigation opens, navigates and closes with Escape',async()=>{
 await page.setViewportSize({width:390,height:844});await page.goto(base);
 const menu=page.locator('.menu-button');await menu.click();assert.equal(await menu.getAttribute('aria-expanded'),'true');
 await page.locator('header nav a[href="/product"]').click();await page.waitForURL('**/product');await page.locator('.menu-button[aria-expanded="false"]').waitFor();assert.equal(await menu.getAttribute('aria-expanded'),'false');
 await menu.click();await page.locator('header nav a').first().focus();await page.keyboard.press('Escape');await page.locator('.menu-button[aria-expanded="false"]').waitFor();assert.equal(await menu.getAttribute('aria-expanded'),'false');
 await page.locator('[data-model-status="ready"][data-camera-position]').waitFor();
 await page.locator('.model-hotspot:not([hidden])').first().click();assert.equal(await page.locator('#model-hotspot-info.is-selected').count(),1);
 await loadImages();await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:out+'hotspot-zh-mobile.png',fullPage:false});
});
assert.deepEqual(errors,[],'No browser runtime errors');
await writeFile(out+'browser-report.json',JSON.stringify({passed:results,errors},null,2));
await browser.close();
console.log(`Completed ${results.length} browser checks. Screenshots in ${out}`);
