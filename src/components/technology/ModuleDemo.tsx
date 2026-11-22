import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { assemblyModules, assemblyPart, assemblyView, moduleContact } from '../../config/technology';
import type { AssemblyModule } from '../../config/technology';
import { missionModules } from '../../config/coraModel';
import { useI18n } from '../../i18n/I18nProvider';
import { DemoHeading } from './DemoShared';
import Icon from '../Icon';

export type ModuleSelection = { module: AssemblyModule; revision: number };
type Preview = { module: AssemblyModule; x: number; y: number; over: boolean; back?: [number, number] };
type Pointer = { module: AssemblyModule; id: number; startX: number; startY: number; moved: boolean };

export default function ModuleDemo({ selection, active }: { selection: ModuleSelection | null; active: boolean }) {
  const { t } = useI18n();
  const c = t.technology.modules;
  const [localChoice, setChoice] = useState<{ module: AssemblyModule | null; revision?: number }>({ module: null });
  const selected = selection && selection.revision !== localChoice.revision ? selection.module : localChoice.module;
  const [view, setView] = useState<{ module: AssemblyModule | null; previous: AssemblyModule | null; revision: number }>({ module: null, previous: null, revision: 0 });
  const [preview, setPreview] = useState<Preview | null>(null);
  const [failed, setFailed] = useState(false);
  const revision = useRef(0);
  const pointer = useRef<Pointer | null>(null);
  const target = useRef<HTMLSpanElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const names = Object.fromEntries(missionModules.map((entry, index) => [entry.id, t.product3d.modules.items[index].title]));
  useEffect(() => () => { revision.current++; clearTimeout(timer.current); }, []);
  useEffect(() => {
    if (!active) { pointer.current = null; setPreview(null); }
  }, [active]);

  function choose(module: AssemblyModule) {
    setChoice({ module, revision: selection?.revision });
  }
  function attach(module: AssemblyModule | null) {
    const request = ++revision.current;
    setFailed(false);
    const image = new Image();
    image.src = assemblyView(module);
    image.decode().then(() => {
      if (revision.current !== request) return;
      setView(previous => ({ module, previous: previous.module, revision: request }));
    }, () => {
      if (revision.current === request) setFailed(true);
    });
  }
  function isOver(x: number, y: number) {
    const box = target.current?.getBoundingClientRect();
    return !!box && x >= box.left && x <= box.right && y >= box.top && y <= box.bottom;
  }
  function start(event: PointerEvent<HTMLButtonElement>, module: AssemblyModule) {
    if (pointer.current || event.button !== 0) return;
    clearTimeout(timer.current);
    setPreview(null);
    pointer.current = { module, id: event.pointerId, startX: event.clientX, startY: event.clientY, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function move(event: PointerEvent<HTMLButtonElement>) {
    const drag = pointer.current;
    if (!drag || drag.id !== event.pointerId) return;
    if (!drag.moved && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 5) return;
    drag.moved = true;
    setPreview({ module: drag.module, x: event.clientX, y: event.clientY, over: isOver(event.clientX, event.clientY) });
  }
  function finish(event: PointerEvent<HTMLButtonElement>) {
    const drag = pointer.current;
    if (!drag || drag.id !== event.pointerId) return;
    pointer.current = null;
    if (!drag.moved) return;
    if (isOver(event.clientX, event.clientY)) {
      choose(drag.module);
      attach(drag.module);
      setPreview(null);
    } else {
      setPreview({ module: drag.module, x: event.clientX, y: event.clientY, over: false,
        back: [drag.startX - event.clientX, drag.startY - event.clientY] });
      timer.current = window.setTimeout(() => setPreview(null), 230);
    }
  }
  function cancel() { if (pointer.current) { pointer.current = null; setPreview(null); } }
  const moving = preview && !preview.back;
  return (
    <div className="assembly-demo">
      <DemoHeading title={c.title} intro={c.intro}/>
      <div className="assembly-layout">
        <div>
          <figure className="assembly-stage" data-attached={view.module ?? ''}>
            {view.revision > 0 && <img src={assemblyView(view.previous)} alt="" aria-hidden="true"/>}
            <img key={`view-${view.revision}`} className={view.revision ? 'assembly-arrival' : ''} src={assemblyView(view.module)} alt={view.module ? `Cora · ${names[view.module]}` : t.common.imageAlt}/>
            <span ref={target} className="assembly-target" data-visible={!view.module || !!moving} data-over={!!preview?.over} data-dragging={!!moving}>
              <i aria-hidden="true"/><span>{preview?.over ? c.release : c.hotspot}</span>
            </span>
            {view.module && <span key={`pulse-${view.revision}`} className="assembly-pulse" aria-hidden="true"/>}
          </figure>
          <p className="assembly-status" role="status">{failed ? c.failed : view.module ? `${c.attached} · ${names[view.module]}` : c.hotspot}</p>
        </div>
        <div className="assembly-controls">
          <div className="assembly-options" role="group" aria-label={c.choose}>
            {assemblyModules.map(module => (
              <button key={module} type="button" data-tech-module={module} aria-pressed={selected === module}
                onPointerDown={event => start(event, module)} onPointerMove={move} onPointerUp={finish}
                onPointerCancel={cancel} onLostPointerCapture={cancel} onClick={() => choose(module)}>
                <img src={assemblyPart(module)} alt="" draggable={false}/>
                <span>{names[module]}</span><small>{c.uses[module]}</small>
              </button>
            ))}
          </div>
          <div className="assembly-actions">
            <button type="button" className="button primary" disabled={!selected} onClick={() => selected && attach(selected)}>{c.attach}<Icon name="plus" size={16}/></button>
            <button type="button" className="button secondary" disabled={!view.module && !selected} onClick={() => attach(null)}>{c.remove}</button>
          </div>
        </div>
      </div>
      <aside className="assembly-contact"><div><h4>{c.contact.title}</h4><p>{c.contact.text}</p></div>
        <Link to={moduleContact} className="button secondary">{c.contact.link}<Icon name="arrow" size={17}/></Link></aside>
      {preview && <img className={`assembly-ghost${preview.back ? ' assembly-return' : ''}`} src={assemblyPart(preview.module)} alt="" draggable={false}
        style={{ left: preview.x, top: preview.y, '--return-x': `${preview.back?.[0] ?? 0}px`, '--return-y': `${preview.back?.[1] ?? 0}px` } as CSSProperties}/>}
    </div>
  );
}
