import { assets, possibilityImages } from '../config/product';
import Image from './Image';
import '../styles/possibility-scene.css';

export default function PossibilityScene({ kind, label }: {
  kind: 'modular' | 'collaboration';
  label: string;
}) {
  const modular = kind === 'modular';
  return (
    <div className={`possibility-scene possibility-scene--${kind}`} role="img" aria-label={label}>
      <div className="possibility-scene-layers" aria-hidden="true">
        <Image className="possibility-scene-cabin" src={modular ? assets.cabin : assets.interior} alt=""/>
        <Image className="possibility-scene-lead" src={possibilityImages.upper} alt="" width={900} height={900}/>
        {modular ? (
          <>
            <Image className="possibility-scene-module possibility-scene-module--cargo" src={possibilityImages.cargo} alt="" width={500} height={500}/>
            <Image className="possibility-scene-module possibility-scene-module--arm" src={possibilityImages.arm} alt="" width={500} height={500}/>
            <Image className="possibility-scene-module possibility-scene-module--temperature" src={possibilityImages.temperature} alt="" width={500} height={500}/>
          </>
        ) : <Image className="possibility-scene-partner" src={possibilityImages.lower} alt="" width={900} height={900}/>}
        <svg className="possibility-scene-lines" viewBox="0 0 640 400" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {modular ? (
            <g strokeWidth="2.5">
              <path d="M435 127C421 160 411 194 395 221M464 254C439 242 420 226 395 221M354 304C365 274 382 247 395 221" opacity=".75"/>
              <path d="M395 221 286 217m14-9-14 9 13 11"/>
            </g>
          ) : (
            <>
              <path className="possibility-scene-route" d="M243 325C353 320 397 304 479 269L535 243M524 241l11 2-5 10"/>
              <path d="M309 194C336 154 368 143 404 143" strokeDasharray="3 8" strokeWidth="2.5"/>
              <circle cx="309" cy="194" r="3.5" fill="currentColor"/>
              <circle cx="404" cy="143" r="3.5" fill="currentColor"/>
              <path d="M138 222 106 204" strokeDasharray="3 5" strokeWidth="2"/>
              <g transform="translate(73 186)" strokeWidth="2">
                <path d="M0 8V0h8M23 0h8v8m0 15v8h-8M8 31H0v-8"/>
                <path d="M8 8h4v4H8zm11 0h4v4h-4zM8 19h4v4H8zm11 0h4v4h-4z" fill="currentColor" stroke="none"/>
              </g>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
