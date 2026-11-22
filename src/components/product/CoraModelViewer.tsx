import { Component, lazy, Suspense, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode, Ref } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import useMediaQuery from '../../hooks/useMediaQuery';
import useMotionVisibility from '../../hooks/useMotionVisibility';
import { cameraViews, modelHotspots } from '../../config/coraModel';
import type { CameraView, DisplayMode, HotspotId, ModelCommand } from '../../config/coraModel';
import { modelConfig } from '../../config/product';
import Icon from '../Icon';
const CoraScene = lazy(() => import('./CoraScene'));

class ModelBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}
export interface ModelViewerHandle { view: (view: CameraView, scroll?: boolean) => void; hotspot: (id: HotspotId, scroll?: boolean) => void; }
export interface ViewerProps { ref?: Ref<ModelViewerHandle>; selected: HotspotId | null; onSelect: (id: HotspotId | null) => void; mode: DisplayMode | null; }

export default function CoraModelViewer({ ref, selected, onSelect, mode }: ViewerProps) {
  const { t } = useI18n(), c = t.product3d.viewer;
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)'), touch = useMediaQuery('(pointer: coarse), (max-width: 700px)');
  const { ref: visibilityRef, running } = useMotionVisibility<HTMLDivElement>();
  const host = useRef<HTMLDivElement>(null), markerRefs = useRef<(HTMLButtonElement | null)[]>([]), exitButton = useRef<HTMLButtonElement>(null);
  const [command, setCommand] = useState<ModelCommand>({ sequence: 0, view: 'reset' });
  const [view, setView] = useState<CameraView | 'free'>('reset'), [zoom, setZoom] = useState(100);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading'), [progress, setProgress] = useState(0), [attempt, setAttempt] = useState(0);
  const [staticView, setStaticView] = useState(false), [touchRotation, setTouchRotation] = useState(false);
  const [fullscreen, setFullscreen] = useState(false), [fallback, setFallback] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  function move(next: Omit<ModelCommand, 'sequence'>) { setCommand(previous => ({ ...next, sequence: previous.sequence + 1 })); }
  function scrollToViewer(scroll: boolean) {
    if (!scroll) return;
    host.current?.scrollIntoView({ block: 'center', behavior: reduced ? 'instant' : 'smooth' });
    host.current?.querySelector<HTMLElement>('.cora-3d-canvas.is-ready')?.focus({ preventScroll: true });
  }
  function showView(next: CameraView, scroll = false) { setView(next); move({ view: next }); scrollToViewer(scroll); }
  function selectHotspot(id: HotspotId, scroll = false, preferred?: CameraView) {
    const nextView = preferred ?? modelHotspots.find(point => point.id === id)!.view;
    onSelect(id);
    setView(nextView);
    move({ view: nextView, focus: id });
    scrollToViewer(scroll);
  }
  function toggleStatic() {
    if (staticView) { setStatus('loading'); setProgress(0); onSelect(null); showView('reset'); }
    setStaticView(!staticView);
  }
  useImperativeHandle(ref, () => ({ view: showView, hotspot: selectHotspot }));
  useEffect(() => {
    const changed = () => setFullscreen(document.fullscreenElement === host.current);
    document.addEventListener('fullscreenchange', changed);
    return () => document.removeEventListener('fullscreenchange', changed);
  }, []);
  useEffect(() => {
    if (!fallback || !host.current) return;
    const oldOverflow = document.documentElement.style.overflow, isolated: [HTMLElement, boolean][] = [];
    let current: HTMLElement = host.current;
    while (current.parentElement) {
      for (const sibling of current.parentElement.children) if (sibling !== current && sibling instanceof HTMLElement) { isolated.push([sibling, sibling.inert]); sibling.inert = true; }
      current = current.parentElement; if (current === document.body) break;
    }
    document.documentElement.style.overflow = 'hidden'; exitButton.current?.focus({ preventScroll: true });
    return () => { isolated.forEach(([element, wasInert]) => { element.inert = wasInert; }); document.documentElement.style.overflow = oldOverflow; returnFocus.current?.focus({ preventScroll: true }); };
  }, [fallback]);
  async function toggleFullscreen() {
    if (fallback) { setFallback(false); return; }
    if (document.fullscreenElement === host.current) { await document.exitFullscreen(); return; }
    returnFocus.current = document.activeElement as HTMLElement;
    try { if (!host.current?.requestFullscreen || !document.fullscreenEnabled) throw new Error(); await host.current.requestFullscreen(); }
    catch { setFallback(true); }
  }
  function keyControls(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      if (fullscreen || fallback) { event.preventDefault(); void toggleFullscreen(); }
      else if (selected) onSelect(null);
    }
    if (fallback && event.key === 'Tab' && host.current) {
      const targets = [...host.current.querySelectorAll<HTMLElement>('button:not(:disabled),[tabindex="0"]')].filter(node => node.getClientRects().length > 0 && !node.hidden);
      const index = targets.indexOf(document.activeElement as HTMLElement), next = event.shiftKey ? (index - 1 + targets.length) % targets.length : (index + 1) % targets.length;
      event.preventDefault(); targets[next]?.focus();
    }
    if (event.target !== event.currentTarget.querySelector('.cora-3d-canvas')) return;
    const nudges: Record<string, [number, number]> = { ArrowLeft: [-.16, 0], ArrowRight: [.16, 0], ArrowUp: [0, -.12], ArrowDown: [0, .12] };
    if (nudges[event.key]) { event.preventDefault(); setView('free'); move({ nudge: nudges[event.key] }); }
    else if (['+', '='].includes(event.key)) { event.preventDefault(); move({ zoom: .85 }); }
    else if (event.key === '-') { event.preventDefault(); move({ zoom: 1.18 }); }
  }
  const expanded = fullscreen || fallback;
  const interactive = status === 'ready' && !staticView;
  const index = modelHotspots.findIndex(spot => spot.id === selected), details = t.product3d.structure.items[index];
  const screenMode = mode ?? (selected === 'display' ? 'awake' : null);
  return <div ref={visibilityRef} className="cora-viewer-visibility"><div ref={host} className={`cora-model-viewer ${expanded ? 'is-fullscreen' : ''}`} role={fallback ? 'dialog' : 'region'} aria-modal={fallback || undefined} aria-label={c.label} onKeyDown={keyControls} data-model-status={status} data-camera-view={view} data-display-mode={mode ?? 'standby'}>
    <div className="cora-viewer-topbar"><span>{c.official}</span><button ref={exitButton} className="icon-button" onClick={() => void toggleFullscreen()} aria-label={expanded ? c.exitFullscreen : c.fullscreen}><Icon name={expanded ? 'close' : 'fullscreen'} size={20}/></button></div>
    <div className="cora-3d-stage">
      <img className="cora-model-poster" src={modelConfig.viewerPoster} alt={t.common.imageAlt} hidden={interactive}/>
      {!staticView && status !== 'error' && <div className={`cora-3d-canvas ${interactive ? 'is-ready' : ''}`} tabIndex={interactive ? 0 : -1} role="img" aria-label={c.description} aria-describedby="model-help">
        <ModelBoundary key={attempt} onError={() => setStatus('error')}><Suspense fallback={null}><CoraScene command={command} selected={selected} mode={screenMode} animate={running || expanded} reduced={reduced} gestures={!touch || touchRotation || expanded} workingLabel={t.product3d.display.working}
          markers={markerRefs} onProgress={setProgress} onReady={() => setStatus('ready')} onError={() => setStatus('error')} onFreeView={() => setView('free')}
          onCamera={(position, amount, target, magnification) => {
            if (host.current) {
              host.current.dataset.cameraPosition = position.map(n => n.toFixed(4)).join(',');
              host.current.dataset.cameraTarget = target.map(n => n.toFixed(4)).join(',');
              host.current.dataset.cameraMagnification = magnification.toFixed(3);
            }
            setZoom(amount);
          }}/></Suspense></ModelBoundary>
      </div>}
      {interactive && <div className="model-hotspot-layer">{modelHotspots.map((spot, i) => <button className={`model-hotspot ${selected === spot.id ? 'is-selected' : ''}`} type="button" key={spot.id} ref={node => { markerRefs.current[i] = node; }} aria-label={`${c.hotspotPrefix} ${t.product3d.structure.items[i].title}`} aria-expanded={selected === spot.id} aria-controls={expanded && selected === spot.id ? 'fullscreen-hotspot-info' : 'model-hotspot-info'} onClick={event => selectHotspot(spot.id, false, event.currentTarget.dataset.preset as CameraView | undefined)}><Icon name="plus" size={15}/><span>{t.product3d.structure.items[i].title}</span></button>)}</div>}
      {status !== 'ready' && !staticView && <div className="model-loading" role="status"><p>{status === 'error' ? c.error : c.loading}</p>{status === 'loading' ? <progress value={progress} max="1" aria-label={c.loading}/> : <button className="button secondary" onClick={() => { setStatus('loading'); setProgress(0); setAttempt(n => n + 1); }}>{c.retry}</button>}</div>}
      {expanded && selected && details && <aside id="fullscreen-hotspot-info" className="fullscreen-hotspot-info" aria-live="polite"><button className="icon-button" onClick={() => onSelect(null)} aria-label={t.common.close}><Icon name="close" size={17}/></button><h3>{details.title}</h3><p>{details.text}</p></aside>}
    </div>
    <div className="cora-camera-controls"><button className="icon-button" disabled={status !== 'ready' || staticView} onClick={() => move({ zoom: 1.18 })} aria-label={c.zoomOut}><Icon name="minus" size={18}/></button><output aria-label={c.zoom}>{zoom}%</output><button className="icon-button" disabled={status !== 'ready' || staticView} onClick={() => move({ zoom: .85 })} aria-label={c.zoomIn}><Icon name="plus" size={18}/></button><span/><button className="camera-reset" disabled={status !== 'ready' || staticView} onClick={() => { onSelect(null); showView('reset'); }}><Icon name="reset" size={17}/>{c.reset}</button></div>
    <div className="cora-camera-presets" role="group" aria-label={c.viewsLabel}>{cameraViews.map((pose, i) => <button type="button" key={pose} disabled={status !== 'ready' || staticView} aria-pressed={view === pose} data-view={pose} onClick={() => showView(pose)}>{c.views[i]}</button>)}</div>
    <div className="cora-viewer-footer">{interactive && <p id="model-help">{touch ? touchRotation || expanded ? c.touchActive : c.touchHint : c.dragHint}</p>}{interactive && touch && !expanded && <button className="viewer-text-button" onClick={() => setTouchRotation(value => !value)} aria-pressed={touchRotation}>{touchRotation ? c.scroll : c.rotate}</button>}<button className="viewer-text-button" onClick={toggleStatic}>{staticView ? c.return3d : c.static}</button></div>
  </div></div>;
}
