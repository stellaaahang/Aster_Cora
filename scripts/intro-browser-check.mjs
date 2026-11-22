import assert from 'node:assert/strict';
import { mkdir,writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { INTRO_STORAGE_KEY,INTRO_SEEN_VALUE } from '../src/config/intro.ts';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({channel:'chrome',headless:true});
const base=process.env.PREVIEW_URL||'http://127.0.0.1:5173';
const out=fileURLToPath(new URL('../test-results/intro/',import.meta.url));await mkdir(out,{recursive:true});
const passed=[],errors=[];
async function test(name,run){await run();passed.push(name);console.log('PASS',name);}
async function fresh(options={}){
 const context=await browser.newContext({viewport:{width:1440,height:1000},locale:'zh-CN',reducedMotion:'no-preference',...options});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));return{context,page};
}
async function open(page,path='/'){await page.goto(base+path);await page.locator('.opening-pass[open]').waitFor();await page.evaluate(()=>document.fonts.ready);await page.locator('.pass-space-art').evaluate(img=>img.decode());}
async function entered(page){await page.locator('.opening-pass').waitFor({state:'hidden',timeout:4000});assert.equal(await page.evaluate(key=>localStorage.getItem(key),INTRO_STORAGE_KEY),INTRO_SEEN_VALUE);assert.match(await page.locator('h1').first().innerText(), /Welcome Aboard|欢迎登舱/);}
async function grab(page,dx,dy,{hold=0,cancel=false}={}){
 const stub=page.locator('[data-ticket-stub]');let b=await stub.boundingBox();
 const x=b.x+b.width*.7,y=b.y+b.height*.28;
 await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+dx,y+dy,{steps:18});
 if(hold)await page.waitForTimeout(hold);
 if(cancel)await stub.dispatchEvent('pointercancel',{pointerId:1,pointerType:'mouse'});
 await page.mouse.up();
}
try{
 await test('First Home visit shows English pass; native dialog traps focus and Skip persists',async()=>{
  const{context,page}=await fresh();await context.addInitScript(()=>localStorage.setItem('aster.language.v1','zh'));await open(page);
  assert.equal(await page.locator('html').getAttribute('lang'),'en');assert.equal(await page.locator('.tear-ticket').getAttribute('data-orientation'),'horizontal');
  for(let i=0;i<14;i++){await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>document.querySelector('.opening-pass').contains(document.activeElement)));}
  await page.locator('.opening-pass').focus();await page.screenshot({path:out+'desktop-en.png'});
  await page.locator('.opening-skip').click();await entered(page);
  assert.equal(await page.evaluate(()=>document.documentElement.style.overflow),'');
  await page.reload();assert.equal(await page.locator('.opening-pass').count(),0);
  await page.locator('header nav a[href="/product"]').click();await page.locator('#overview').waitFor();await page.locator('header nav a[href="/"]').click();await page.locator('.reference-home').waitFor();assert.equal(await page.locator('.opening-pass').count(),0);
  await context.close();
 });
 await test('Small pull springs back; a decisive drag tears and enters Home once',async()=>{
  const{context,page}=await fresh();await open(page);
  await grab(page,20,4,{hold:120});await page.waitForFunction(()=>document.querySelector('.tear-ticket')?.getAttribute('data-phase')==='idle');
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),INTRO_STORAGE_KEY),null);
  const stub=page.locator('[data-ticket-stub]'),b=await stub.boundingBox();const x=b.x+b.width*.7,y=b.y+b.height*.25;
  await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+65,y+15,{steps:12});await page.waitForTimeout(100);
  const fibers=await page.locator('.ticket-fibers path').evaluateAll(ns=>ns.some(n=>Number(n.style.opacity)>0));assert.ok(fibers,'paper fibers stretch during the pull');
  await page.screenshot({path:out+'paper-fibers.png'});await page.mouse.up();await page.waitForFunction(()=>document.querySelector('.tear-ticket')?.getAttribute('data-phase')==='idle');
  await grab(page,165,45);await entered(page);
  assert.equal(new URL(page.url()).pathname,'/');await context.close();
 });
 await test('Product deep links stay direct; Home opens the pass and Direct entry works',async()=>{
  const{context,page}=await fresh();const requests=[];page.on('request',r=>requests.push(r.url()));
  await context.addInitScript(()=>localStorage.setItem('aster.language.v1','zh'));
  await page.goto(base+'/product#overview');await page.locator('#overview').waitFor();assert.equal(await page.locator('.opening-pass').count(),0);assert.ok(!requests.some(url=>url.includes('/intro/OpeningPass')));
  assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN');
  await page.locator('header nav a[href="/"]').click();await page.locator('.opening-pass[open]').waitFor();assert.equal(await page.locator('html').getAttribute('lang'),'en');await page.locator('.opening-enter').click();await entered(page);await context.close();
 });
 await test('Enter, Space and Escape all provide complete keyboard paths',async()=>{
  for(const key of ['Enter','Space','Escape']){
   const{context,page}=await fresh({reducedMotion:'reduce'});await open(page);
   if(key!=='Escape')await page.locator('[data-ticket-stub]').focus();await page.keyboard.press(key);
   await entered(page);await context.close();
  }
 });
 await test('Reduced-motion drag keeps the paper still and confirms entry without a flight',async()=>{
  const{context,page}=await fresh({reducedMotion:'reduce'});await open(page);
  const stub=page.locator('[data-ticket-stub]'),before=await stub.boundingBox();const x=before.x+before.width*.7,y=before.y+before.height*.25;
  await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+20,y,{steps:8});await page.waitForTimeout(130);
  const held=await stub.boundingBox();assert.ok(Math.abs(held.x-before.x)<1&&Math.abs(held.y-before.y)<1,'reduced motion has no bending or translation');
  await page.mouse.move(x+65,y,{steps:8});await page.mouse.up();await entered(page);await context.close();
 });
 await test('Chinese mobile pass is touch-operated and keeps its language',async()=>{
  const{context,page}=await fresh({viewport:{width:390,height:844},hasTouch:true,isMobile:true});await open(page);
  await page.locator('.opening-header button[lang="zh-CN"]').click();assert.equal(await page.locator('#opening-title').textContent(),'探索，从这里开始。');
  assert.equal(await page.locator('.tear-ticket').getAttribute('data-orientation'),'horizontal');await page.locator('.opening-pass').focus();await page.screenshot({path:out+'mobile-zh.png',animations:'disabled'});
  const b=await page.locator('[data-ticket-stub]').boundingBox(),x=b.x+b.width*.4,y=b.y+b.height*.3;
  const cdp=await context.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for(let i=1;i<=15;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+75*i/15,y:y+20*i/15}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.locator('.opening-pass').waitFor({state:'hidden',timeout:4000});assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN');assert.equal(await page.evaluate(key=>localStorage.getItem(key),INTRO_STORAGE_KEY),INTRO_SEEN_VALUE);await context.close();
 });
 await test('Preview deliberately replays; language switching preserves the ticket; all sizes fit',async()=>{
  for(const width of [1440,768,390,320]){
   const{context,page}=await fresh({viewport:{width,height:900}});
   await context.addInitScript(({key,value})=>{localStorage.setItem(key,value);localStorage.setItem('aster.language.v1','zh');},{key:INTRO_STORAGE_KEY,value:INTRO_SEEN_VALUE});
   await open(page,'/?intro=preview&source=review');
   assert.equal(await page.locator('html').getAttribute('lang'),'en','opening starts in English even after an earlier Chinese choice');
   for(const lang of ['zh','en']){
    await page.locator(`.opening-header button[lang="${lang==='zh'?'zh-CN':'en'}"]`).click();
    assert.equal(await page.locator('.tear-ticket').getAttribute('data-phase'),'idle');
    const size=await page.locator('.opening-pass').evaluate(e=>({width:e.clientWidth,scroll:e.scrollWidth}));assert.ok(size.scroll<=size.width+1,`${width}/${lang} fits`);
    assert.equal(await page.locator('.tear-ticket').getAttribute('data-orientation'),'horizontal');
    assert.equal(await page.locator('.pass-stub-message strong').textContent(),lang==='zh'?'欢迎来到Aster太空。':'Welcome to Aster Space');
    assert.equal(await page.locator('.pass-stub-message strong').getAttribute('lang'),lang==='zh'?'zh-CN':'en');
    assert.equal(await page.locator('.pass-stub-top > span').textContent(),lang==='zh'?'探索通行证':'Exploration Pass');
    assert.equal(await page.locator('.pass-issuer > span, .opening-keyboard-hint, .opening-footer').count(),0);
    assert.doesNotMatch(await page.locator('.opening-pass').innerText(),/Digital exploration pass|数字探索通行证|You can also press|也可以聚焦票根/);
    assert.equal(await page.locator('.pass-space-art').getAttribute('src'),'/images/aster-space-line-art.webp');
    assert.equal(await page.locator('.opening-pass img[src*="cora-white"]').count(),0);
    assert.doesNotMatch(await page.locator('.pass-main-bottom').innerText(),/prototype|原型/i);
    const heading=await page.locator('.pass-heading').boundingBox(),art=await page.locator('.pass-space-art').boundingBox();
    assert.ok(heading.x+heading.width<art.x,`${width}/${lang}: title and illustration do not overlap`);
    const cora = page.locator('.pass-cora-art');
    await cora.evaluate(img => img.decode());
    const robot = await cora.boundingBox();
    assert.ok(robot.width < art.width / 3 && robot.x > heading.x + heading.width
      && robot.x + robot.width < art.x + art.width / 2 && robot.y + robot.height < art.y + art.height / 2,
      `${width}/${lang}: the small Cora drawing fits in the upper left of the artwork`);
    const stubFits=await page.locator('.pass-stub-content').evaluate(n=>{const message=n.querySelector('.pass-stub-message'),barcode=n.querySelector('.pass-stub-bottom');return message.offsetTop+message.offsetHeight<barcode.offsetTop&&barcode.offsetTop+barcode.offsetHeight<n.clientHeight;});
    assert.ok(stubFits,`${width}/${lang}: stub message and barcode fit before the paper tilt`);
    await page.screenshot({path:out+`landscape-${width}-${lang}.png`,animations:'disabled'});
   }
   await page.locator('.opening-enter').click();await page.locator('.opening-pass').waitFor({state:'hidden'});assert.equal(new URL(page.url()).search,'?source=review');await context.close();
  }
 });
 await test('Unavailable storage still allows entry and does not repeat during navigation',async()=>{
  const{context,page}=await fresh({reducedMotion:'reduce'});await context.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('Storage disabled');}}));await open(page);await page.locator('.opening-enter').click();await page.locator('.opening-pass').waitFor({state:'hidden'});
  await page.locator('header nav a[href="/product"]').click();await page.locator('#overview').waitFor();await page.locator('header nav a[href="/"]').click();await page.locator('.reference-home').waitFor();assert.equal(await page.locator('.opening-pass').count(),0);await context.close();
 });
 assert.deepEqual(errors,[],'No browser runtime errors');await writeFile(out+'report.json',JSON.stringify({passed,errors},null,2));
 console.log('Completed',passed.length,'intro browser checks.');
}finally{await browser.close();}
