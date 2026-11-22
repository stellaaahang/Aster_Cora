import { useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import type { PixelFrame } from '../../config/technology';
import { DemoHeading, PixelCora, VoicePlayback } from './DemoShared';

const moods = [
  { id: 'happy', emoji: '😊', frame: 'happy' },
  { id: 'down', emoji: '😔', frame: 'down' },
  { id: 'tired', emoji: '😴', frame: 'standby' },
  { id: 'worried', emoji: '😟', frame: 'worried' },
] as const satisfies readonly { id: string; emoji: string; frame: PixelFrame }[];

export function CompanionDemo({ active }: { active: boolean }) {
  const { t } = useI18n();
  const c = t.technology.companion;
  const [mood, setMood] = useState<typeof moods[number] | null>(null);
  const reply = mood ? c.moods[mood.id].reply : c.greeting;
  return (
    <div className="tech-demo-grid">
      <div className="tech-demo-stage tech-companion-stage">
        <div className="tech-pixel-platform" aria-hidden="true"/>
        <div className={mood?.id === 'happy' ? 'tech-happy-reaction' : 'tech-expression'} key={mood?.id || 'idle'} data-mood={mood?.id}>
          <PixelCora frame={mood?.frame} animated={active}/>
        </div>
      </div>
      <div className="tech-demo-controls">
        <DemoHeading title={c.title} intro={c.intro} badge={t.technology.lab.concept}/>
        <div className="tech-moods" role="group" aria-label={c.choose}>
          {moods.map(option => (
            <button key={option.id} type="button" data-mood={option.id} aria-pressed={mood?.id === option.id} onClick={() => setMood(option)}>
              <span aria-hidden="true">{option.emoji}</span>{c.moods[option.id].label}
            </button>
          ))}
        </div>
        <div className="tech-reply">
          <div className="tech-reply-heading"><span>Cora</span>{active && <VoicePlayback key={mood?.id || 'greeting'} message={reply}/>}</div>
          <div aria-live="polite"><p className="tech-response" key={mood?.id || 'greeting'}>{reply}</p></div>
        </div>
      </div>
    </div>
  );
}
