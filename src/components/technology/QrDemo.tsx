import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { sampleEquipmentId, sampleQrImage } from '../../config/technology';
import useMediaQuery from '../../hooks/useMediaQuery';
import Icon from '../Icon';
import { DemoHeading } from './DemoShared';

type DecodeState =
  | { kind: 'idle' | 'unreadable' | 'invalidFile' }
  | { kind: 'scanning'; uploaded: boolean }
  | { kind: 'decoded'; text: string };
const acceptedTypes = ['image/png', 'image/jpeg', 'image/webp'];

async function decodeImage(source: string) {
  const image = new window.Image();
  image.src = source;
  const [{ default: jsQR }] = await Promise.all([import('jsqr'), image.decode()]);
  const scale = Math.min(1, 1800 / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return jsQR(pixels.data, pixels.width, pixels.height)?.data ?? null;
}

export default function QrDemo() {
  const { t } = useI18n();
  const c = t.technology.qr;
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [state, setState] = useState<DecodeState>({ kind: 'idle' });
  const upload = useRef<HTMLInputElement>(null);
  const request = useRef(0);
  useEffect(() => () => { request.current += 1; }, []);

  async function scan(file?: File) {
    if (file && (!acceptedTypes.includes(file.type) || !file.size || file.size > 5 * 1024 * 1024)) {
      setState({ kind: 'invalidFile' });
      return;
    }
    const attempt = ++request.current;
    setState({ kind: 'scanning', uploaded: Boolean(file) });
    const source = file ? URL.createObjectURL(file) : sampleQrImage;
    let decoded: string | null = null;
    try {
      const [result] = await Promise.all([
        decodeImage(source).catch(() => null),
        new Promise<void>(resolve => window.setTimeout(resolve, reducedMotion ? 0 : 800)),
      ]);
      decoded = result;
    } finally {
      if (file) URL.revokeObjectURL(source);
    }
    if (request.current === attempt) setState(decoded === null ? { kind: 'unreadable' } : { kind: 'decoded', text: decoded });
  }

  const scanning = state.kind === 'scanning';
  const matched = state.kind === 'decoded' && state.text === sampleEquipmentId;
  return (
    <div className="tech-demo-grid">
      <div className="tech-demo-stage tech-qr-stage">
        <figure>
          <div className="tech-qr-frame">
            <img src={sampleQrImage} width={348} height={348} alt={`${c.sample} · ${sampleEquipmentId}`}/>
            {scanning && !state.uploaded && <div className="tech-scan-line" aria-hidden="true"/>}
          </div>
          <figcaption>{c.sample}<code>{sampleEquipmentId}</code></figcaption>
        </figure>
      </div>
      <div className="tech-demo-controls">
        <DemoHeading title={t.technology.features.qr} intro={c.intro} badge={t.technology.lab.demo}/>
        <div className="tech-demo-actions">
          <button className="button primary" type="button" disabled={scanning} onClick={() => void scan()}><Icon name="scan" size={17}/>{c.scan}</button>
          <button className="button secondary" type="button" disabled={scanning} onClick={() => upload.current?.click()}>{c.upload}</button>
          <input ref={upload} aria-label={c.upload} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={event => {
            const file = event.currentTarget.files?.[0];
            event.currentTarget.value = '';
            if (file) void scan(file);
          }}/>
        </div>
        <p className="tech-input-note">{c.fileHint}</p>
        <div className="tech-qr-results" role="status" data-qr-status={state.kind}>
          {scanning && <p>{c.scanning}</p>}
          {(state.kind === 'unreadable' || state.kind === 'invalidFile') && <p>{c[state.kind]}</p>}
          {state.kind === 'decoded' && (
            <>
              <h4>{c.result}</h4>
              {matched ? <dl className="tech-result-fields">
                <div><dt>{c.id}</dt><dd><code>{state.text}</code></dd></div>
                <div><dt>{c.equipment}</dt><dd>{c.record.name}</dd></div>
                <div><dt>{c.location}</dt><dd>{c.record.location}</dd></div>
                <div><dt>{c.status}</dt><dd>{c.record.status}</dd></div>
              </dl> : <><p>{c.noMatch}</p><dl className="tech-result-fields"><div><dt>{c.raw}</dt><dd><code>{state.text}</code></dd></div></dl></>}
            </>
          )}
        </div>
        {state.kind !== 'idle' && !scanning && <button className="tech-text-button" type="button" onClick={() => setState({ kind: 'idle' })}>{c.reset}</button>}
      </div>
    </div>
  );
}
