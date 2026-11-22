import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { destinations, motionJunction, motionStart, pixelFrames } from '../../config/technology';
import useMediaQuery from '../../hooks/useMediaQuery';
import { DemoHeading } from './DemoShared';
import Icon from '../Icon';

function route(from: { x: number; y: number }, to: { x: number; y: number }) {
  return `M ${from.x} ${from.y} H ${motionJunction.x} V ${to.y} H ${to.x}`;
}

export function MotionDemo() {
  const { t } = useI18n();
  const c = t.technology.motion;
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [reached, setReached] = useState<number | null>(null);
  const [destination, setDestination] = useState<number | null>(null);
  const [path, setPath] = useState('');
  const animation = useRef<SVGAnimationElement>(null);
  const moving = destination !== reached;
  const target = destination === null ? motionStart : destinations[destination];
  useEffect(() => {
    if (!moving) return;
    if (!reduced) animation.current?.beginElement();
    const timer = window.setTimeout(() => setReached(destination), reduced ? 0 : 1500);
    return () => window.clearTimeout(timer);
  }, [destination, moving, reduced]);
  function select(index: number) {
    if (index === reached) return;
    const start = reached === null ? motionStart : destinations[reached];
    setPath(route(start, destinations[index]));
    setDestination(index);
  }
  return (
    <div className="tech-demo-grid">
      <figure className="tech-demo-stage tech-motion-stage">
        <svg viewBox="0 0 355 310" role="img" aria-label={c.map}>
          <rect className="tech-map-outline" x="21" y="20" width="313" height="269" rx="28"/>
          <path className="tech-map-corridor" d="M 85 75 H 270 M 176 75 V 237 H 270 M 71 157 H 176"/>
          <path className="tech-map-centerline" d="M 85 75 H 270 M 176 75 V 237 H 270 M 71 157 H 176"/>
          {path && <path className="tech-map-route" d={path}/>}
          <circle className="tech-map-point" cx={motionStart.x} cy={motionStart.y} r="8"/>
          <text x={motionStart.x} y={motionStart.y + 32}>{c.start}</text>
          {destinations.map(({ x, y }, index) => <g key={index} className={destination === index ? 'tech-map-selected' : ''}>
            <circle className="tech-map-point" cx={x} cy={y} r="10"/>
            <text x={x} y={y + 34}>{c.destinations[index]}</text>
          </g>)}
          <g key={destination} transform={moving && !reduced ? undefined : `translate(${target.x} ${target.y})`}>
            <image href={pixelFrames.idle} x="-16" y="-18" width="32" height="34"/>
            {moving && !reduced && <animateMotion ref={animation} begin="indefinite" dur="1.5s" path={path} fill="freeze"/>}
          </g>
        </svg>
        <figcaption>{c.map}</figcaption>
      </figure>
      <div className="tech-demo-controls">
        <DemoHeading title={t.technology.features.motion} intro={c.intro} badge={c.concept}/>
        <div className="tech-command-options" role="group" aria-label={c.choose}>
          {c.destinations.map((name, index) => <button type="button" data-destination={index} key={index} disabled={moving} aria-pressed={destination === index} onClick={() => select(index)}><span>{name}</span><Icon name="arrow" size={16}/></button>)}
        </div>
        {destination !== null && <div className="tech-task-result tech-motion-result" role="status"><Icon name={moving ? 'orbit' : 'check'} size={22}/><div><strong>{moving ? c.moving : c.reached}</strong><p>{c.destinations[destination]}</p></div></div>}
      </div>
    </div>
  );
}
