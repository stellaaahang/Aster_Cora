import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { astronautImages, keepInFrame, photoSize, renderPhoto } from './photoScene';
import type { PhotoPoint, PhotoPositions } from './photoScene';
import Icon from '../Icon';

type Astronaut = 0 | 1;
type Shot = { scene: number; positions: PhotoPositions; started: number };
const emptyPositions = (): PhotoPositions => [null, null];

export function PhotoSceneArt({ scene, label }: { scene: number; label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => { if (ref.current) renderPhoto(ref.current, scene, emptyPositions(), []); }, [scene]);
  return <canvas ref={ref} width={photoSize.width} height={photoSize.height} role="img" aria-label={label}/>;
}

export default function PhotoDemo({ active }: { active: boolean }) {
  const { t, lang } = useI18n();
  const c = t.technology.photo;
  const [scene, setScene] = useState(0);
  const [scenes, setScenes] = useState<PhotoPositions[]>(() => Array.from({ length: 3 }, emptyPositions));
  const [selected, setSelected] = useState<Astronaut>(0);
  const [sprites, setSprites] = useState<HTMLImageElement[]>([]);
  const [imageFailed, setImageFailed] = useState(false);
  const [shot, setShot] = useState<Shot | null>(null);
  const [remaining, setRemaining] = useState(3);
  const [result, setResult] = useState<{ image: string; scene: number; time: number } | null>(null);
  const [ghost, setGhost] = useState<{ actor: Astronaut; x: number; y: number } | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ actor: Astronaut; id: number; x: number; y: number; moved: boolean; fromFrame: boolean; offset?: PhotoPoint } | null>(null);
  const positions = scenes[scene];
  const ready = sprites.length === 2 && positions.every(Boolean);
  const locked = shot !== null || result !== null;

  useEffect(() => {
    let current = true;
    Promise.all(astronautImages.map(async src => {
      const image = new Image();
      image.src = src;
      await image.decode();
      return image;
    })).then(images => { if (current) setSprites(images); }, () => { if (current) setImageFailed(true); });
    return () => { current = false; };
  }, []);
  useLayoutEffect(() => {
    if (canvas.current) renderPhoto(canvas.current, scene, positions, sprites);
  }, [scene, positions, sprites, result]);
  useEffect(() => {
    if (active) return;
    drag.current = null;
    setGhost(null);
    setShot(null);
  }, [active]);
  useEffect(() => {
    if (!shot || !active) return;
    const timer = window.setInterval(() => setRemaining(Math.max(1, 3 - Math.floor((performance.now() - shot.started) / 1000))), 100);
    const shutter = window.setTimeout(() => {
      const image = document.createElement('canvas');
      image.width = photoSize.width;
      image.height = photoSize.height;
      renderPhoto(image, shot.scene, shot.positions, sprites);
      setResult({ image: image.toDataURL('image/png'), scene: shot.scene, time: Date.now() });
      setShot(null);
    }, 3000);
    return () => { clearInterval(timer); clearTimeout(shutter); };
  }, [shot, active, sprites]);

  function place(actor: Astronaut, point: PhotoPoint) {
    setScenes(previous => previous.map((row, index) => {
      if (index !== scene) return row;
      const next: PhotoPositions = [...row];
      next[actor] = point;
      return next;
    }));
  }
  function at(x: number, y: number) {
    const box = canvas.current?.getBoundingClientRect();
    if (!box?.width || !box.height) return null;
    return { x: (x - box.left) / box.width * photoSize.width, y: (y - box.top) / box.height * photoSize.height };
  }
  function start(event: PointerEvent<HTMLElement>, actor: Astronaut, fromFrame: boolean, offset?: PhotoPoint) {
    if (locked || drag.current || event.button !== 0) return;
    setSelected(actor);
    drag.current = { actor, id: event.pointerId, x: event.clientX, y: event.clientY, moved: false, fromFrame, offset };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function move(event: PointerEvent<HTMLElement>) {
    const pointer = drag.current;
    if (!pointer || pointer.id !== event.pointerId) return;
    if (Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) < 4 && !pointer.moved) return;
    pointer.moved = true;
    const point = at(event.clientX, event.clientY);
    if (pointer.fromFrame && point) place(pointer.actor, keepInFrame(point.x + (pointer.offset?.x ?? 0), point.y + (pointer.offset?.y ?? 0)));
    else setGhost({ actor: pointer.actor, x: event.clientX, y: event.clientY });
  }
  function finish(event: PointerEvent<HTMLElement>) {
    const pointer = drag.current;
    if (!pointer || pointer.id !== event.pointerId) return;
    const point = at(event.clientX, event.clientY);
    if (point && (pointer.fromFrame || (pointer.moved && point.x >= 0 && point.x <= 320 && point.y >= 0 && point.y <= 180))) {
      place(pointer.actor, keepInFrame(point.x + (pointer.offset?.x ?? 0), point.y + (pointer.offset?.y ?? 0)));
    }
    cancelDrag();
  }
  function cancelDrag() {
    drag.current = null;
    setGhost(null);
  }
  function frameStart(event: PointerEvent<HTMLDivElement>) {
    const point = at(event.clientX, event.clientY);
    if (!point) return;
    const hit = ([1, 0] as const).filter(index => {
      const current = positions[index];
      return current && Math.abs(current.x - point.x) < 17 && point.y <= current.y + 4 && point.y >= current.y - 66;
    }).sort((a, b) => positions[b]!.y - positions[a]!.y)[0];
    const person = hit === undefined ? null : positions[hit];
    start(event, hit ?? selected, true, person ? { x: person.x - point.x, y: person.y - point.y } : undefined);
  }
  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (locked) return;
    const directions: Record<string, [number, number]> = { ArrowLeft: [-3, 0], ArrowRight: [3, 0], ArrowUp: [0, -3], ArrowDown: [0, 3], Enter: [0, 0], ' ': [0, 0] };
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    const origin = positions[selected] ?? { x: 124 + selected * 65, y: 140 };
    place(selected, keepInFrame(origin.x + direction[0], origin.y + direction[1]));
  }
  const point = positions[selected];
  return (
    <div className="photo-demo" onPointerMove={move} onPointerUp={finish} onPointerCancel={cancelDrag} onLostPointerCapture={cancelDrag}>
      <header className="tech-demo-heading"><h3>{t.technology.features.photo}</h3><p>{c.intro}</p></header>
      <div className="photo-scenes" role="group" aria-label={c.backgrounds}>
        {c.scenes.map((label, index) => (
          <button type="button" key={index} aria-pressed={index === scene} disabled={locked} onClick={() => setScene(index)}>
            <PhotoSceneArt scene={index} label={label}/><span>{label}</span>
          </button>
        ))}
      </div>
      {result ? (
        <figure className="photo-result">
          <img src={result.image} width={320} height={180} alt={c.result}/>
          <figcaption><strong>{c.scenes[result.scene]}</strong><p>{c.time} · <time dateTime={new Date(result.time).toISOString()}>
            {new Date(result.time).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en', { dateStyle: 'medium', timeStyle: 'medium' })}
          </time></p></figcaption>
          <span className="photo-shutter" aria-hidden="true"/><span className="tech-sr-only" role="status">{c.shutter}</span>
          <button type="button" className="button secondary" onClick={() => setResult(null)}>{c.retake}</button>
        </figure>
      ) : (
        <div className="photo-studio">
          <div>
            <div className="photo-frame" role="group" tabIndex={0} aria-label={c.frame} aria-describedby="photo-placement" onPointerDown={frameStart} onKeyDown={keyboard}
              data-scene={scene} data-positions={JSON.stringify(positions)}>
              <canvas ref={canvas} width={320} height={180} aria-hidden="true"/>
              {point && !shot && <span className="photo-selection" style={{ left: `${point.x / 3.2}%`, top: `${(point.y - 66) / 1.8}%` }} aria-hidden="true"/>}
              {shot && <span className="photo-countdown" role="status">{remaining}</span>}
            </div>
            <p id="photo-placement" className="photo-instructions">{c.placement}</p>
          </div>
          <div className="photo-tray">
            <h4>{c.tray}</h4>
            <div className="photo-actors" role="group" aria-label={c.tray}>
              {astronautImages.map((src, index) => (
                <button type="button" key={src} aria-label={`${c.astronaut} ${index + 1}`} aria-pressed={index === selected} disabled={locked}
                  onPointerDown={event => start(event, index as Astronaut, false)} onClick={() => setSelected(index as Astronaut)}>
                  <img src={src} alt="" draggable={false}/><span>{index + 1}{positions[index] ? <Icon name="check" size={15}/> : null}</span>
                </button>
              ))}
            </div>
            <p role="status">{imageFailed ? c.failed : sprites.length < 2 ? c.loading : ready ? c.ready : c.pending}</p>
            <div className="photo-actions">
              <button type="button" className="button primary" disabled={!ready || locked} onClick={() => {
                setRemaining(3);
                setShot({ scene, positions: [...positions], started: performance.now() });
              }}><Icon name="camera" size={18}/>{c.capture}</button>
              <button type="button" className="button secondary" disabled={locked} onClick={() => setScenes(previous => previous.map((row, index) => index === scene ? emptyPositions() : row))}>{c.reset}</button>
            </div>
          </div>
        </div>
      )}
      {ghost && <img className="photo-drag-ghost" src={astronautImages[ghost.actor]} alt="" style={{ left: ghost.x, top: ghost.y }} draggable={false}/>}
    </div>
  );
}
