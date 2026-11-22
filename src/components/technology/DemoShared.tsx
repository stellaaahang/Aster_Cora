import { useI18n } from '../../i18n/I18nProvider';
import { pixelFrames } from '../../config/technology';
import type { PixelFrame } from '../../config/technology';
import useCoraVoice from '../../hooks/useCoraVoice';
import Icon from '../Icon';
import Image from '../Image';

export function PixelCora({ frame = 'idle', animated = false, blink = false }: {
  frame?: PixelFrame; animated?: boolean; blink?: boolean;
}) {
  const { t } = useI18n();
  return (
    <div className={`tech-pixel ${animated ? 'tech-pixel-floating' : ''}`} data-expression={frame}>
      <Image key={frame} src={pixelFrames[frame]} alt={t.technology.pixel[frame]} width={355} height={378}/>
      {blink && <span className="tech-pixel-blink" aria-hidden="true"/>}
    </div>
  );
}

export function VoicePlayback({ message }: { message: string }) {
  const { t } = useI18n();
  const { supported, speaking, status, preview } = useCoraVoice(message);
  const copy = t.technology.speech;
  return (
    <div className="tech-voice-playback">
      <button className="tech-voice-button" type="button" disabled={!supported} onClick={preview}>
        <Icon name={speaking ? 'stop' : 'wave'} size={16}/>{speaking ? copy.stop : copy.play}
      </button>
      <span className={status === t.home.hero.voiceError || status === t.home.hero.voiceNotReady ? 'tech-voice-status' : 'tech-sr-only'} role="status">{status}</span>
      {!supported && <small>{copy.unavailable}</small>}
    </div>
  );
}

export function DemoHeading({ title, intro, badge }: { title: string; intro: string; badge?: string }) {
  return (
    <header className="tech-demo-heading">
      <h3>{title}</h3>
      <p>{intro}</p>
      {badge && <span className="tech-demo-tag">{badge}</span>}
    </header>
  );
}
