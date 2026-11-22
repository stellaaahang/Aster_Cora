import { Component, lazy, Suspense, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { hasSeenIntro, rememberIntro, shouldShowIntro } from '../../config/intro';
import { useI18n } from '../../i18n/I18nProvider';
const OpeningPass = lazy(()=>import('./OpeningPass'));
class OptionalIntro extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?null:this.props.children;}
}
function storage() { try{return window.localStorage;}catch{return null;} }
/** Only first-time Home visitors load the interaction. Product deep links remain direct. */
export default function IntroGate({children}:{children:ReactNode}) {
  const location=useLocation(),navigate=useNavigate();
  const {setLanguage}=useI18n();
  const [seen,setSeen]=useState(()=>hasSeenIntro(storage()));
  const [previewClosed,setPreviewClosed]=useState(false);
  const preview=new URLSearchParams(location.search).get('intro')==='preview'&&!previewClosed;
  const show=shouldShowIntro(location.pathname,location.hash,seen,preview);
  const opened=useRef(false);
  useLayoutEffect(()=>{
    if(!show){opened.current=false;return;}
    // Start each opening in English before paint; later manual choices stay in effect.
    if(!opened.current){opened.current=true;setLanguage('en');}
  },[show,setLanguage]);
  function complete() {
    rememberIntro(storage());setSeen(true);setPreviewClosed(true);
    if(location.search||location.hash){const params=new URLSearchParams(location.search);params.delete('intro');const search=params.toString();navigate('/'+(search?'?'+search:''),{replace:true});}
    requestAnimationFrame(()=>{window.scrollTo({top:0,behavior:'instant'});document.getElementById('main')?.focus({preventScroll:true});});
  }
  return <>{children}{show&&<OptionalIntro><Suspense fallback={null}><OpeningPass onComplete={complete}/></Suspense></OptionalIntro>}</>;
}
