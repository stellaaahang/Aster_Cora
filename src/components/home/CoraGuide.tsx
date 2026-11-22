import { useI18n } from '../../i18n/I18nProvider';
import useCoraVoice from '../../hooks/useCoraVoice';
import Icon from '../Icon';
export default function CoraGuide({ step }: { step: 0 | 1 | 2 }) {
  const { t } = useI18n(), c = t.home.hero;
  const message = c.guideMessages[Math.max(0, step - 1)];
  const { supported, speaking, status, preview } = useCoraVoice(message);
  return <aside className="cora-guide" aria-label={c.guideLabel} hidden={step === 0}>
    <button type="button" className="cora-voice-button" onClick={preview} disabled={!supported}
      aria-label={supported ? speaking ? c.stop : c.listen : c.voiceUnavailable} aria-pressed={speaking}
      title={supported ? speaking ? c.stop : c.listen : c.voiceUnavailable}>
      <Icon name={speaking ? 'stop' : 'wave'} size={26}/>
    </button>
    <p id="cora-guide-copy" role="status" aria-live="polite" aria-atomic="true"><span className="cora-guide-message" key={step}>{message}</span></p>
    <span className={status === c.voiceError || status === c.voiceNotReady ? 'cora-voice-status' : 'sr-only'} role="status">{status}</span>
  </aside>;
}
