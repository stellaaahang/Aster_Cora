import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';
import { clamp, makeTicketGeometry, MAX_TEAR_ANGLE, rotatePoint, tearTarget } from './ticketGeometry';
import type { Orientation, Point } from './ticketGeometry';
export type TicketPhase = 'idle' | 'holding' | 'returning' | 'detached' | 'flying' | 'complete';
type Props = {
  children: ReactNode; stub: ReactNode; width: number; height: number; stubSize: number;
  orientation: Orientation; ariaLabel: string; resistance?: number; tilt?: boolean; recenter?: boolean;
  disabled?: boolean; onTear: () => void; onPhaseChange?: (phase: TicketPhase) => void;
};
type Physics = {
  phase: TicketPhase; pointerId: number | null; start: Point; point: Point; hinge: Point; sign: number;
  theta: number; shift: Point; velocity: Point; lastPoint: Point; lastMove: number;
  age: number; lastFrame: number; spin: number; snapped: number[];
};
const freshPhysics = (): Physics => ({ phase:'idle',pointerId:null,start:{x:0,y:0},point:{x:0,y:0},hinge:{x:0,y:0},sign:1,theta:0,shift:{x:0,y:0},velocity:{x:0,y:0},lastPoint:{x:0,y:0},lastMove:0,age:0,lastFrame:0,spin:0,snapped:[] });
export default function TearTicket({ children, stub, width, height, stubSize, orientation, ariaLabel, resistance=.15, tilt=true, recenter=true, disabled=false, onTear, onPhaseChange }: Props) {
  const reduced=useMediaQuery('(prefers-reduced-motion: reduce)');
  const geometry=useMemo(()=>makeTicketGeometry(width,height,stubSize,orientation),[width,height,stubSize,orientation]);
  const id=useId().replace(/:/g,'');
  const root=useRef<HTMLDivElement>(null),plane=useRef<HTMLDivElement>(null),stubElement=useRef<HTMLDivElement>(null),body=useRef<HTMLDivElement>(null);
  const fibers=useRef<(SVGPathElement|null)[]>([]);
  const physics=useRef(freshPhysics()),frame=useRef(0),done=useRef(false);
  const latest=useRef({geometry,resistance,reduced,disabled,onTear,onPhaseChange});
  latest.current={geometry,resistance,reduced,disabled,onTear,onPhaseChange};
  const [fit,setFit]=useState(1),[used,setUsed]=useState(false);
  const tickRef=useRef<(time:number)=>void>(()=>{});
  function phase(next: TicketPhase) {
    const p=physics.current;if(p.phase===next)return;
    p.phase=next;root.current?.setAttribute('data-phase',next);latest.current.onPhaseChange?.(next);
  }
  function startFrame() { if(!frame.current)frame.current=requestAnimationFrame(time=>tickRef.current(time)); }
  function paint(time: number) {
    const p=physics.current,g=latest.current.geometry;
    if(stubElement.current){stubElement.current.style.transform=`translate(${p.shift.x.toFixed(2)}px,${p.shift.y.toFixed(2)}px) rotate(${(p.theta*p.sign*180/Math.PI).toFixed(2)}deg)`;}
    if(body.current){const bend=latest.current.reduced?0:Math.min(p.theta*.08,.018);body.current.style.transform=`rotate(${-p.sign*bend}rad)`;}
    g.bridges.forEach((point,i)=>{
      const path=fibers.current[i];if(!path)return;
      const moved=rotatePoint(point,p.hinge,p.theta*p.sign,p.shift);
      const length=Math.hypot(moved.x-point.x,moved.y-point.y);
      if(length<.5||p.phase==='idle'){path.style.opacity='0';return;}
      const at=p.snapped[i];
      if(at){
        const fade=clamp(1-(time-at)/180,0,1),r=.35*fade;
        path.setAttribute('d',`M${point.x},${point.y}l${(moved.x-point.x)*r},${(moved.y-point.y)*r}M${moved.x},${moved.y}l${(point.x-moved.x)*r},${(point.y-moved.y)*r}`);
        path.style.opacity=String(fade*.7);
      }else{
        const middleX=(point.x+moved.x)/2,middleY=(point.y+moved.y)/2;
        path.setAttribute('d',`M${point.x},${point.y}Q${middleX+Math.min(length*.1,3)},${middleY+2} ${moved.x},${moved.y}`);
        path.style.opacity='.65';
      }
    });
  }
  function finish() {
    if(done.current)return;done.current=true;
    cancelAnimationFrame(frame.current);frame.current=0;
    physics.current.pointerId=null;phase('complete');
    if(stubElement.current)stubElement.current.style.opacity='0';
    if(body.current)body.current.style.transform='';
    setUsed(true);latest.current.onTear();
  }
  tickRef.current=(time:number)=>{
    frame.current=0;
    const p=physics.current,opts=latest.current,g=opts.geometry;
    const dt=p.lastFrame?clamp((time-p.lastFrame)/1000,.001,.035):.016;p.lastFrame=time;
    if(opts.reduced&&(p.phase==='holding'||p.phase==='detached')){
      p.theta=0;p.shift={x:0,y:0};
    }else if(p.phase==='holding'){
      const target=tearTarget(p.start,p.point,p.hinge,p.sign,g.vertical,opts.resistance);
      p.theta+=(target-p.theta)*(1-Math.exp(-dt/.035));
      const dx=clamp((p.point.x-p.start.x)*.035,-4,5),dy=clamp((p.point.y-p.start.y)*.035,-4,5);
      p.shift.x+=(dx-p.shift.x)*(1-Math.exp(-dt/.045));p.shift.y+=(dy-p.shift.y)*(1-Math.exp(-dt/.045));
      let remaining=0;
      g.bridges.forEach((point,i)=>{
        if(p.snapped[i])return;
        const moved=rotatePoint(point,p.hinge,p.theta*p.sign,p.shift);
        if(Math.hypot(moved.x-point.x,moved.y-point.y)>24||p.theta>=MAX_TEAR_ANGLE-.015)p.snapped[i]=time;
        else remaining++;
      });
      if(!remaining)phase('detached');
    }else if(p.phase==='detached'){
      const rotated=rotatePoint(p.start,p.hinge,p.theta*p.sign,{x:0,y:0});
      p.shift.x+=(p.point.x-rotated.x-p.shift.x)*(1-Math.exp(-dt/.045));
      p.shift.y+=(p.point.y-rotated.y-p.shift.y)*(1-Math.exp(-dt/.045));
    }else if(p.phase==='returning'){
      const ratio=Math.exp(-dt/.055);p.theta*=ratio;p.shift.x*=ratio;p.shift.y*=ratio;
      if(p.theta<.001&&Math.hypot(p.shift.x,p.shift.y)<.08){p.theta=0;p.shift={x:0,y:0};p.snapped=[];phase('idle');}
    }else if(p.phase==='flying'){
      p.age+=dt;
      if(!opts.reduced){p.velocity.y+=1050*dt;p.shift.x+=p.velocity.x*dt;p.shift.y+=p.velocity.y*dt;p.theta+=p.spin*dt;}
      const duration=opts.reduced ? .12 : .58;
      if(stubElement.current)stubElement.current.style.opacity=String(clamp(1-p.age/duration,0,1));
      if(p.age>=duration){finish();return;}
    }
    paint(time);
    if(p.phase!=='idle'&&p.phase!=='complete')startFrame();
  };
  useLayoutEffect(()=>{
    const element=root.current;if(!element)return;
    const resize=()=>setFit(Math.min(1,element.clientWidth/width));resize();
    const observer=new ResizeObserver(resize);observer.observe(element);return()=>observer.disconnect();
  },[width]);
  useEffect(()=>{
    if(done.current)return;
    cancelAnimationFrame(frame.current);frame.current=0;physics.current=freshPhysics();
    root.current?.setAttribute('data-phase','idle');
    if(stubElement.current){stubElement.current.style.transform='';stubElement.current.style.opacity='1';}
    if(plane.current){plane.current.style.setProperty('--tilt-x','0deg');plane.current.style.setProperty('--tilt-y','0deg');}
    fibers.current.forEach(path=>{if(path)path.style.opacity='0';});
    latest.current.onPhaseChange?.('idle');
  },[orientation]);
  useEffect(()=>()=>{cancelAnimationFrame(frame.current);},[]);
  useEffect(()=>{if(disabled){cancelAnimationFrame(frame.current);frame.current=0;physics.current.pointerId=null;}},[disabled]);
  function local(event: PointerEvent): Point {
    const rect=root.current!.getBoundingClientRect();const scale=rect.width/width;
    return {x:(event.clientX-rect.left)/scale,y:(event.clientY-rect.top)/scale};
  }
  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if(disabled||done.current||event.button!==0||physics.current.pointerId!==null||physics.current.phase==='flying')return;
    event.preventDefault();
    const p=physics.current,g=geometry,point=local(event);
    const firstHalf=(g.vertical?point.x:point.y)<g.cross/2;
    const hingeCross=firstHalf?g.cross:0;
    p.hinge=g.vertical?{x:hingeCross,y:g.offset.y}:{x:g.offset.x,y:hingeCross};
    p.sign=(firstHalf?1:-1)*(g.vertical?-1:1);p.start=point;p.point=point;p.lastPoint=point;p.lastMove=performance.now();
    p.velocity={x:0,y:0};p.pointerId=event.pointerId;p.lastFrame=0;
    event.currentTarget.style.transformOrigin=g.vertical?`${hingeCross}px 0px`:`0px ${hingeCross}px`;
    try{event.currentTarget.setPointerCapture(event.pointerId);}catch{/* Pointer events still work while over the stub. */}
    if(plane.current){plane.current.style.setProperty('--tilt-x','0deg');plane.current.style.setProperty('--tilt-y','0deg');}
    phase('holding');startFrame();
  }
  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const p=physics.current;if(p.pointerId!==event.pointerId||disabled)return;
    const point=local(event),now=performance.now(),dt=Math.max((now-p.lastMove)/1000,.008);
    p.velocity.x=p.velocity.x*.5+(point.x-p.lastPoint.x)/dt*.5;p.velocity.y=p.velocity.y*.5+(point.y-p.lastPoint.y)/dt*.5;
    p.lastPoint=point;p.point=point;p.lastMove=now;
    if(reduced&&Math.hypot(point.x-p.start.x,point.y-p.start.y)>36){p.snapped=geometry.bridges.map(()=>now);phase('detached');}
    startFrame();
  }
  function pointerUp(event: PointerEvent<HTMLDivElement>,cancelled=false) {
    const p=physics.current;if(p.pointerId!==event.pointerId)return;
    p.pointerId=null;
    // A quick, decisive pull should not have to wait for the following spring frame.
    if(!cancelled&&p.phase==='holding'&&tearTarget(p.start,p.point,p.hinge,p.sign,geometry.vertical,resistance)>=MAX_TEAR_ANGLE-.015){
      p.theta=Math.max(p.theta,MAX_TEAR_ANGLE);p.snapped=geometry.bridges.map(()=>performance.now());phase('detached');
    }
    if(p.phase==='detached'&&!cancelled){
      p.velocity={x:clamp(p.velocity.x,-650,650),y:clamp(p.velocity.y,-200,450)};p.spin=.9;p.age=0;phase('flying');
    }else if(!done.current)phase('returning');
    try{if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);}catch{/* Capture may already have been cancelled by the browser. */}
    startFrame();
  }
  function keyDown(event: KeyboardEvent<HTMLDivElement>) {
    if(disabled||done.current||event.repeat||physics.current.phase==='flying'||!['Enter',' '].includes(event.key))return;
    event.preventDefault();const p=physics.current;
    const captured=p.pointerId;p.pointerId=null;
    if(captured!==null){try{stubElement.current?.releasePointerCapture(captured);}catch{/* The pointer may already have been released. */}}
    p.hinge={...geometry.offset};p.sign=1;p.theta=reduced?0:.18;p.shift={x:0,y:0};p.snapped=geometry.bridges.map(()=>performance.now());
    p.velocity={x:geometry.vertical?45:150,y:30};p.spin=.8;p.age=0;p.lastFrame=0;
    if(stubElement.current)stubElement.current.style.transformOrigin='0px 0px';phase('flying');startFrame();
  }
  function tiltMove(event: PointerEvent<HTMLDivElement>) {
    if(!tilt||reduced||event.pointerType==='touch'||physics.current.phase!=='idle'||disabled)return;
    const rect=event.currentTarget.getBoundingClientRect();
    plane.current?.style.setProperty('--tilt-x',`${clamp((.5-(event.clientY-rect.top)/rect.height)*8,-4,4)}deg`);
    plane.current?.style.setProperty('--tilt-y',`${clamp(((event.clientX-rect.left)/rect.width-.5)*8,-4,4)}deg`);
    plane.current?.style.setProperty('--art-x',`${clamp(((event.clientX-rect.left)/rect.width-.5)*7,-3.5,3.5)}px`);
    plane.current?.style.setProperty('--art-y',`${clamp(((event.clientY-rect.top)/rect.height-.5)*5,-2.5,2.5)}px`);
  }
  const style={maxWidth:width,height:height*fit,'--ticket-width':`${width}px`,'--ticket-height':`${height}px`,'--stub-size':`${stubSize}px`,'--recentering':`${stubSize/2}px`} as CSSProperties;
  const pathTransform=geometry.vertical?'matrix(0 1 1 0 0 0)':undefined;
  return <div ref={root} className="tear-ticket" data-orientation={orientation} data-used={used||undefined} data-recenter={recenter||undefined} style={style} onPointerMove={tiltMove} onPointerLeave={()=>{plane.current?.style.setProperty('--tilt-x','0deg');plane.current?.style.setProperty('--tilt-y','0deg');plane.current?.style.setProperty('--art-x','0px');plane.current?.style.setProperty('--art-y','0px');}}>
    <svg width="0" height="0" className="ticket-definitions" aria-hidden="true"><defs><clipPath id={`${id}-main`} clipPathUnits="userSpaceOnUse"><path d={geometry.mainPath} transform={pathTransform}/></clipPath><clipPath id={`${id}-stub`} clipPathUnits="userSpaceOnUse"><path d={geometry.stubPath} transform={pathTransform}/></clipPath></defs></svg>
    <div className="ticket-scale" style={{width,height,transform:`scale(${fit})`}}><div ref={plane} className="ticket-plane">
      <div className="ticket-main" style={{width:geometry.mainWidth,height:geometry.mainHeight}}><div ref={body} className="ticket-main-counter"><div className="ticket-main-paper" style={{clipPath:`url(#${id}-main)`}}>{children}</div></div></div>
      <svg className="ticket-fibers" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">{geometry.bridges.map((_,i)=><path key={i} ref={el=>{fibers.current[i]=el;}} fill="none" stroke="#8399b6" strokeWidth=".8"/>)}</svg>
      <div ref={stubElement} className="ticket-stub-piece" role="button" tabIndex={used||disabled?-1:0} aria-label={ariaLabel} aria-disabled={disabled||used||undefined} aria-hidden={used||undefined} data-ticket-stub="" style={{left:geometry.offset.x,top:geometry.offset.y,width:geometry.stubWidth,height:geometry.stubHeight}} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={event=>pointerUp(event)} onPointerCancel={event=>pointerUp(event,true)} onLostPointerCapture={event=>pointerUp(event,true)} onKeyDown={keyDown} onDragStart={event=>event.preventDefault()}><div className="ticket-stub-paper" style={{clipPath:`url(#${id}-stub)`}}>{stub}</div></div>
    </div></div>
  </div>;
}
