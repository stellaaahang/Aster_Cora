import { publicUrl } from '../../config/publicAssets.ts';
import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { assets } from '../../config/product';
import { passConfig } from '../../config/intro';
import { useI18n } from '../../i18n/I18nProvider';
import useMediaQuery from '../../hooks/useMediaQuery';
import Icon from '../Icon';
import Image from '../Image';
import TearTicket from './TearTicket';
import type { TicketPhase } from './TearTicket';
import '../../styles/opening-pass.css';
export default function OpeningPass({onComplete}:{onComplete:()=>void}) {
  const {t,lang,setLanguage}=useI18n(),c=t.intro;
  const mobile=useMediaQuery('(max-width: 600px)'),reduced=useMediaQuery('(prefers-reduced-motion: reduce)');
  const dimensions=mobile?passConfig.mobile:passConfig.desktop;
  const dialog=useRef<HTMLDialogElement>(null),timers=useRef<ReturnType<typeof setTimeout>[]>([]),entering=useRef(false);
  const completeRef=useRef(onComplete);completeRef.current=onComplete;
  const [phase,setPhase]=useState<TicketPhase>('idle');
  const [leaving,setLeaving]=useState(false);
  useEffect(()=>{
    const element=dialog.current;if(!element)return;
    if(!element.open)element.showModal();
    const oldOverflow=document.documentElement.style.overflow,oldBodyOverflow=document.body.style.overflow,oldPadding=document.body.style.paddingRight;
    const scrollbar=window.innerWidth-document.documentElement.clientWidth;
    if(scrollbar>0)document.body.style.paddingRight=`${parseFloat(getComputedStyle(document.body).paddingRight)+scrollbar}px`;
    document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden';
    const focus=requestAnimationFrame(()=>element.focus({preventScroll:true}));
    return ()=>{
      cancelAnimationFrame(focus);timers.current.forEach(clearTimeout);
      document.documentElement.style.overflow=oldOverflow;document.body.style.overflow=oldBodyOverflow;document.body.style.paddingRight=oldPadding;
      if(element.open)element.close();
    };
  },[]);
  function enterSite(quick=false) {
    if(entering.current)return;entering.current=true;
    timers.current.forEach(clearTimeout);timers.current=[];setLeaving(true);
    timers.current.push(setTimeout(()=>completeRef.current(),reduced?100:quick?170:420));
  }
  function torn() {
    setPhase('complete');
    dialog.current?.querySelector<HTMLElement>('.opening-enter')?.focus({preventScroll:true});
    timers.current.push(setTimeout(()=>enterSite(),reduced?80:300));
  }
  function containFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if(event.key!=='Tab'||!dialog.current)return;
    const controls=[...dialog.current.querySelectorAll<HTMLElement>('button:not([disabled]),[href],[tabindex]:not([tabindex="-1"])')].filter(element=>!element.closest('[aria-hidden="true"]')&&element.getAttribute('aria-disabled')!=='true'&&element.getClientRects().length>0);
    const first=controls[0],last=controls[controls.length-1];
    if(!first)return;
    if(event.shiftKey&&(document.activeElement===first||document.activeElement===dialog.current)){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&(document.activeElement===last||document.activeElement===dialog.current)){event.preventDefault();first.focus();}
  }
  const hint=phase==='complete'?c.ready:phase==='detached'?c.release:phase==='flying'?c.opening:phase==='holding'?c.keepPulling:c.dragHorizontal;
  return <dialog ref={dialog} className="opening-pass" tabIndex={-1} data-stage={leaving?'leaving':phase==='complete'?'complete':'active'} data-quick-exit={leaving&&phase!=='complete'||undefined} aria-labelledby="opening-title" aria-describedby="opening-description" onKeyDown={containFocus} onCancel={event=>{event.preventDefault();enterSite(true);}}>
    <div className="opening-canvas">
      <header className="opening-header"><img className="opening-brand" src={assets.logo} alt="Aster" width="118" height="38"/><div className="opening-header-actions"><div className="language-switch" role="group" aria-label={t.nav.language}><button type="button" lang="en" aria-pressed={lang==='en'} onClick={()=>setLanguage('en')}>EN</button><button type="button" lang="zh-CN" aria-pressed={lang==='zh'} onClick={()=>setLanguage('zh')}>中文</button></div><button className="opening-skip" type="button" onClick={()=>enterSite(true)}>{c.skip}<Icon name="arrow" size={17}/></button></div></header>
      <div className="opening-main"><div className="opening-invitation"><h2 id="opening-title">{c.title}</h2><p id="opening-description">{c.description}</p></div>
        <div className="opening-ticket-area"><div className="opening-orbit" aria-hidden="true"/>
          <TearTicket {...dimensions} orientation="horizontal" ariaLabel={c.stubAria} resistance={passConfig.resistance} recenter tilt disabled={leaving} onTear={torn} onPhaseChange={setPhase}
            stub={<div className="pass-stub-content"><div className="pass-stub-top"><Icon name="orbit" size={25}/><span>{c.passType}</span></div><div className="pass-stub-message"><strong lang={lang==='zh'?'zh-CN':'en'}>{c.stubTitle}</strong><span>{c.pullOutward}</span><Icon className="pass-pull-arrow" name="arrow" size={27}/></div><div className="pass-stub-bottom"><span className="pass-barcode" aria-hidden="true"/><span>{passConfig.serial}</span></div></div>}>
            <div className="pass-main-content">
              <div className="pass-issuer"><img src={assets.logo} alt="Aster" width="87" height="28"/></div>
              <div className="pass-artwork">
                <Image className="pass-space-art" src={passConfig.illustration} alt={c.imageAlt} width="700" height="700" loading="eager" fetchPriority="high" draggable={false}/>
                <img className="pass-cora-art" src={publicUrl("/images/cora-ticket-line-art.svg")} alt="" width="128" height="112" draggable={false}/>
              </div>
              <div className="pass-heading"><h3>Cora</h3><p>{c.tagline}</p></div>
              <div className="pass-main-bottom"><span>{c.issuedBy}</span></div>
            </div>
          </TearTicket>
        </div>
        <div className="opening-controls"><p className="opening-gesture-hint" role="status" aria-live="polite">{phase==='complete'?<Icon name="check" size={18}/>:<Icon name="arrow" size={18}/>}<span>{hint}</span></p><button type="button" className="opening-enter" onClick={()=>enterSite(true)}>{c.enter}<Icon name="arrow" size={17}/></button></div>
      </div>
    </div>
  </dialog>;
}
