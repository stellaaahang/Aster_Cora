import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { mockCoraAudio } from './cora-audio-mock.mjs';
import { coraVoice } from '../src/config/coraVoice.ts';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel:'chrome', headless:true, args:['--enable-unsafe-swiftshader','--use-angle=swiftshader'] });
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:5173';
const context = await browser.newContext({ viewport:{width:1440,height:1000} });
await context.addInitScript(() => {
  localStorage.setItem('aster.exploration-pass.v1','entered');
});
await mockCoraAudio(context);
const page = await context.newPage(), errors=[], passed=[];
page.on('pageerror',e=>errors.push(String(e)));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
async function check(name,run){await run();passed.push(name);console.log('PASS',name);}
async function frame(){await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));}
try {
  await mkdir('test-results/home',{recursive:true});
  await check('Neutral screen, exact Drift parameters, larger navigation and no automatic voice',async()=>{
    await page.goto(base+'/#home-heading');await page.evaluate(()=>document.fonts.ready);
    await page.waitForFunction(()=>document.querySelector('.home-galaxy-window canvas')?.width>300);
    assert.match(await page.locator('h1').innerText(),/Welcome Aboard/);
    assert.equal(await page.locator('.home-cora-button .cora-product-media').getAttribute('data-face'),'neutral');
    assert.equal(await page.locator('.cora-guide').isVisible(),false);
    assert.equal(await page.locator('.cora-screen').first().evaluate(n=>getComputedStyle(n).opacity),'0');
    const gl=await page.locator('canvas').evaluate(c=>{const g=c.getContext('webgl2'),p=g.getParameter(g.CURRENT_PROGRAM);return{program:!!p,error:g.getError(),glow:g.getUniform(p,g.getUniformLocation(p,'uStarGlow'))};});
    assert.equal(gl.program,true);assert.equal(gl.error,0);assert.ok(Math.abs(gl.glow-(.05*.35*1))<.001);
    assert.equal(await page.evaluate(()=>voiceCalls.filter(c=>c.type==='play').length),0);
    assert.equal(await page.locator('header nav a').count(),4);
    assert.ok(await page.locator('header nav a').first().evaluate(n=>parseFloat(getComputedStyle(n).fontSize))>=16);
    assert.ok(await page.getByRole('button',{name:'EN',exact:true}).evaluate(n=>parseFloat(getComputedStyle(n).fontSize))>=14);
    assert.ok((await page.locator('header .brand-logo').boundingBox()).width<=128);
    const nav = page.locator('header .header-inner'), logo = page.locator('header .brand-logo');
    const normalWidth = (await nav.boundingBox()).width, logoWidth = (await logo.boundingBox()).width;
    await page.setViewportSize({width:1920,height:1080});
    const wide = await nav.boundingBox();
    assert.ok(wide.width > normalWidth + 380 && Math.abs(wide.x * 2 + wide.width - 1920) < 2);
    assert.equal((await logo.boundingBox()).width,logoWidth);
    await page.setViewportSize({width:1440,height:1000});
    await page.screenshot({path:'test-results/home/hero-default.png'});
  });
  await check('Cora smiles and keeps both guide messages in place; keyboard, the selected voice and Chinese work',async()=>{
    const url=page.url(),robot=page.locator('.home-cora-button');
    await robot.click({force:true});await page.locator('.cora-guide').waitFor();
    assert.equal(await page.locator('#cora-guide-copy').textContent(),"Hi, I'm Cora, your guide today!");
    assert.equal(await robot.locator('.cora-product-media').getAttribute('data-face'),'smiling');
    assert.equal(page.url(),url);
    const voice=page.locator('.cora-voice-button');await voice.click({force:true});
    await page.waitForFunction(()=>voiceCalls.at(-1)?.type==='play');
    assert.equal(await page.evaluate(()=>voiceCalls.at(-1).voice),coraVoice.voiceId);
    await robot.focus();await page.keyboard.press('Space');
    assert.equal(await page.locator('#cora-guide-copy').textContent(),"Welcome aboard. Let's explore the future of space robotics together.");
    await page.waitForFunction(()=>voiceCalls.at(-1).type==='cancel');
    await robot.click({force:true});assert.match(await page.locator('#cora-guide-copy').textContent(),/^Welcome aboard/);
    await page.getByRole('button',{name:'中文',exact:true}).click();
    assert.match(await page.locator('#cora-guide-copy').textContent(),/欢迎登舱/);
    await voice.click({force:true});await page.waitForFunction(()=>voiceCalls.at(-1)?.type==='play');
    assert.equal(await page.evaluate(()=>voiceCalls.at(-1).voice),coraVoice.voiceId);
    assert.equal(await page.evaluate(()=>voiceCalls.at(-1).lang),'zh-CN');
    assert.equal(await page.evaluate(()=>voiceCalls.at(-1).rate),1);
    await page.getByRole('button',{name:'EN',exact:true}).click();
    await page.waitForFunction(()=>voiceCalls.at(-1).type==='cancel');
    await page.screenshot({path:'test-results/home/hero-smiling.png'});
  });
  await check('Why Cora has one image, a paragraph and a CTA that reveals the Journey heading',async()=>{
    const why=page.locator('#possibilities');
    assert.equal(await why.getByRole('heading').textContent(),'Why Cora?');
    assert.equal(await why.locator('img').count(),1);
    assert.equal(await why.locator('p').count(),1);
    assert.equal(await why.locator('a').count(),1);
    const link=why.getByRole('link',{name:'Explore Our Journey'});
    await link.click();
    await page.waitForURL('**/#journey');
    await page.waitForFunction(()=>{
      const title=document.getElementById('journey-title').getBoundingClientRect();
      const header=document.querySelector('header .header-inner').getBoundingClientRect();
      return title.top>=header.bottom && title.bottom<innerHeight;
    });
    assert.equal(await page.locator('.meet-cora-copy .button').getAttribute('href'),'/product');
    const stars=page.locator('.meet-cora-stars');
    await stars.evaluate(image=>{image.loading='eager';return image.decode();});
    assert.ok(await stars.evaluate(image=>Number(getComputedStyle(image).opacity)<.3));
  });
  await check('Six Journey stops update one detail panel, align below the header, and preserve the reading position',async()=>{
    await page.goto(base+'/?check=journey#home-heading');
    await frame();
    const detail=page.locator('#journey-detail'), nodes=page.locator('.journey-orbit .orbit-item');
    const previous=detail.getByRole('button',{name:'Previous',exact:true});
    const next=detail.getByRole('button',{name:'Next',exact:true});
    await detail.waitFor();
    assert.ok(await page.evaluate(()=>scrollY<2),'Earth is selected without jumping down the page');
    assert.equal(await detail.getAttribute('data-stage'),'earth');
    assert.equal(await previous.isDisabled(),true);
    assert.equal(await next.isDisabled(),false);
    for (const arrow of [previous, next]) {
      assert.equal(await arrow.textContent(),'');
      assert.equal(await arrow.locator('svg').count(),1);
    }
    assert.deepEqual(await nodes.evaluateAll(items=>items.map(item=>item.getAttribute('aria-label')?.split(' · ')[0])),
      ['Earth','Launch','Orbit','Station','Moon','Mars']);
    await page.locator('#journey .journey-orbit').scrollIntoViewIfNeeded();
    const firstPosition=await nodes.first().evaluate(node=>node.style.transform);
    await page.waitForFunction(position=>document.querySelector('.journey-orbit .orbit-item').style.transform!==position,firstPosition);
    await page.getByRole('button',{name:'Pause orbit',exact:true}).click();
    assert.match(await page.locator('.journey-orbit [data-orbit-path]').getAttribute('transform'),/^rotate\(-13 /);
    assert.match(await page.locator('.journey-orbit [data-orbit-path]').getAttribute('d'),/A 420 86 /);
    assert.equal(await page.locator('.journey-orbit').evaluate(node=>node.style.getPropertyValue('--orbit-hover-scale')),'1.06');
    const stages=[
      ['earth','Ground Prototype','Where Cora Began','/images/cora-official-overview.png'],
      ['launch','Validation Plan','Preparing for Mission Testing','/images/home/journey-detail-launch.webp'],
      ['orbit','Validation Plan','Learning to Move in Orbit','/images/scene-inventory.webp'],
      ['station','Application Concept','Supporting Daily Station Work','/images/scene-environment.webp'],
      ['moon','Future Upgrade','Supporting a Lunar Base','/images/home/journey-detail-moon.webp'],
      ['mars','Long-Term Vision','Supporting Long Stays on Mars','/images/home/journey-detail-mars.webp'],
    ];
    for(const [index,[stage,phase,title,src]] of stages.entries()){
      await page.locator('#journey').evaluate(section=>section.scrollIntoView({block:'start',behavior:'instant'}));
      await nodes.nth(index).click();
      assert.equal(await page.locator('.journey-orbit [aria-pressed="true"]').count(),1);
      assert.equal(await nodes.nth(index).getAttribute('aria-pressed'),'true');
      assert.equal(await detail.getAttribute('data-stage'),stage);
      assert.equal(await detail.locator('#journey-detail-title').textContent(),title);
      assert.equal(await detail.locator('.journey-detail-text[aria-hidden="false"] .journey-phase').textContent(),phase);
      const image=detail.locator('img');
      assert.equal(await image.getAttribute('src'),src);
      await image.evaluate(image=>{image.loading='eager';return image.decode();});
      await page.waitForFunction(()=>{
        const padding=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
        return Math.abs(document.getElementById('journey-detail').getBoundingClientRect().top-padding)<1;
      });
    }
    assert.equal(await next.isDisabled(),true);
    await frame();
    const top=await page.evaluate(()=>scrollY);
    await previous.click();
    assert.equal(await detail.getAttribute('data-stage'),'moon');
    assert.ok(Math.abs(await page.evaluate(()=>scrollY)-top)<3);
    await next.click();
    assert.equal(await detail.getAttribute('data-stage'),'mars');
    assert.ok(Math.abs(await page.evaluate(()=>scrollY)-top)<3);
    await page.getByRole('button',{name:'中文',exact:true}).click();
    assert.equal(await detail.getAttribute('data-stage'),'mars');
    assert.equal(await detail.getByRole('heading',{name:'支援火星长期驻留'}).count(),1);
    assert.equal(await detail.locator('img').getAttribute('alt'),'火星地表上栖息舱模块的概念图');
    assert.equal(await detail.getByRole('button',{name:'下一站',exact:true}).isDisabled(),true);
    assert.equal(await nodes.nth(5).locator('.orbit-item-label small').textContent(),'长期愿景');
    await page.getByRole('button',{name:'EN',exact:true}).click();
    await nodes.nth(5).press('Home');
    assert.equal(await nodes.first().evaluate(node=>node===document.activeElement),true);
    await page.keyboard.press('Enter');
    assert.equal(await detail.getAttribute('data-stage'),'earth');
    assert.equal(await previous.isDisabled(),true);
  });
  await check('Cora stays centered on the actual platform through live viewport resizing',async()=>{
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto(base+'/#home-heading');
    for(const [width,height] of [[1440,900],[1920,800],[2560,1080],[768,1000],[601,900],[600,900],[390,844],[320,844],[1440,900]]){
      await page.setViewportSize({width,height});
      await page.locator('.home-cabin-background').evaluate(image=>image.decode());
      await frame();
      const offset=await page.evaluate(()=>{
        const cabin=document.querySelector('.home-cabin-background');
        const cabinBox=cabin.getBoundingClientRect();
        const robot=document.querySelector('.home-cora-button img').getBoundingClientRect();
        const plinth=document.querySelector('.home-product-plinth');
        const platform=plinth.getBoundingClientRect();
        let x, y;
        if (platform.width) {
          const face=Number.parseFloat(getComputedStyle(plinth,'::before').bottom);
          x=platform.left+platform.width/2;
          y=platform.top+(platform.height-face)/2;
        } else {
          const scale=Math.max(cabinBox.width/cabin.naturalWidth,cabinBox.height/cabin.naturalHeight);
          const [left,top]=getComputedStyle(cabin).objectPosition.split(' ').map(Number.parseFloat);
          x=cabinBox.left+left+1027*scale;
          y=cabinBox.top+top+873*scale;
        }
        return [robot.left+robot.width/2-x,robot.top+robot.height*.955-y];
      });
      assert.ok(offset.every(value=>Math.abs(value)<2),`Centered at ${width}×${height}, offset ${offset}`);
    }
    await page.setViewportSize({width:1440,height:1000});
  });
  await check('Home fits both languages at desktop, tablet and small mobile; reduced motion stops its loops',async()=>{
    await page.emulateMedia({reducedMotion:'reduce'});
    for(const width of [1440,1024,768,390,320]){
      await page.setViewportSize({width,height:width>600?1000:844});await page.goto(base+'/#home-heading');await frame();
      for(const lang of ['EN','中文']){
        await page.getByRole('button',{name:lang,exact:true}).click();
        await page.locator('.home-cora-button').click();await page.locator('.home-cora-button').click();
        const guide=await page.locator('.cora-guide').boundingBox(),robot=await page.locator('.home-cora-button').boundingBox();
        assert.ok(guide.width<=320&&guide.x>=0&&guide.x+guide.width<=width);
        assert.ok(guide.y+guide.height<robot.y,`Guide clears product at ${width}/${lang}`);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`No overflow at ${width}/${lang}`);
        assert.equal(await page.locator('.cora-float-group').evaluate(n=>getComputedStyle(n).animationName),'none');
        const nav=await page.locator('header .header-inner').evaluate(n=>({width:n.clientWidth,scroll:n.scrollWidth}));assert.ok(nav.scroll<=nav.width+1);
        if(width===390||width===1440){await page.evaluate(async()=>{document.querySelectorAll('img').forEach(n=>n.loading='eager');await Promise.all([...document.images].map(n=>n.decode().catch(()=>{})));});await page.screenshot({path:`test-results/home/full-${width}-${lang}.png`,fullPage:true});}
      }
    }
  });
  await check('Mobile touch selects a journey stop and navigation still opens and closes',async()=>{
    const mobile=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});const p=await mobile.newPage();
    await p.goto(base+'/#home-heading');await p.locator('.home-cora-button').tap();assert.equal(await p.locator('.home-cora-button .cora-product-media[data-face="smiling"]').count(),1);
    await p.goto(base+'/#journey');
    const nodes=p.locator('.journey-orbit .orbit-item');
    assert.equal(await nodes.count(),6);
    assert.equal(await p.locator('.journey-pause').count(),0);
    const position=await nodes.first().evaluate(node=>node.style.transform);
    await p.waitForTimeout(140);
    assert.equal(await nodes.first().evaluate(node=>node.style.transform),position);
    await nodes.nth(2).tap();
    assert.equal(await nodes.nth(2).getAttribute('aria-pressed'),'true');
    const detail=p.locator('#journey-detail');
    await detail.getByRole('button',{name:'Next',exact:true}).tap();
    assert.equal(await nodes.nth(3).getAttribute('aria-pressed'),'true');
    assert.ok(await nodes.evaluateAll(items=>items.every(node=>{
      const item=node.getBoundingClientRect();
      return item.left>=-1 && item.right<=innerWidth+1;
    })),'All six orbit tiles fit on mobile');
    const image=await detail.locator('.journey-detail-image').boundingBox();
    const copy=await detail.locator('.journey-detail-copy').boundingBox();
    assert.ok(image.y+image.height<copy.y);
    await p.locator('.menu-button').tap();assert.equal(await p.locator('.menu-button').getAttribute('aria-expanded'),'true');await p.locator('header nav a[href="/product"]').tap();await p.waitForURL('**/product');await mobile.close();
  });
  assert.deepEqual(errors,[]);await writeFile('test-results/home/report.json',JSON.stringify({passed,errors},null,2));
} finally {await browser.close();}
