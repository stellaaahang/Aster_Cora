import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { DemoHeading, PixelCora, VoicePlayback } from './DemoShared';
import Icon from '../Icon';

const commands = ['locate', 'photo', 'inventory'] as const;
type Command = typeof commands[number];
type Notice = 'listening' | 'recognizing' | 'denied' | 'missed' | 'unavailable';

interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

function matchCommand(text: string): Command | undefined {
  if (/图|照|取景|photo|picture|snapshot/i.test(text)) return 'photo';
  if (/清单|库存|inventory|supplies list/i.test(text)) return 'inventory';
  if (/工具|tool.?kit|tools/i.test(text)) return 'locate';
}

export default function VoiceDemo({ active, openPhoto }: { active: boolean; openPhoto: () => void }) {
  const { t, lang } = useI18n();
  const c = t.technology.voice;
  const [task, setTask] = useState<{ command: Command; transcript?: string; id: number } | null>(null);
  const [finished, setFinished] = useState<number | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [unmatched, setUnmatched] = useState('');
  const capture = useRef<{ recognition: Recognition; started: boolean; released: boolean } | null>(null);
  const ready = active && !!task && task.id === finished;
  const command = task?.command;
  const lastLanguage = useRef(lang);

  function cancel() {
    const current = capture.current;
    if (!current) return;
    capture.current = null;
    current.recognition.abort();
  }
  useEffect(() => () => cancel(), []);
  useEffect(() => {
    if (active && lastLanguage.current === lang) return;
    lastLanguage.current = lang;
    cancel();
    setNotice(null);
  }, [active, lang]);
  useEffect(() => {
    if (!active || !task || task.id === finished) return;
    const timer = window.setTimeout(() => setFinished(task.id), 480);
    return () => clearTimeout(timer);
  }, [active, task, finished]);

  function execute(command: Command, transcript?: string) {
    cancel();
    setNotice(null);
    setUnmatched('');
    setTask(previous => ({ command, transcript, id: (previous?.id ?? 0) + 1 }));
  }
  function start() {
    if (capture.current) return;
    const speech = window as Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
    const Recognizer = speech.SpeechRecognition ?? speech.webkitSpeechRecognition;
    setUnmatched('');
    if (!Recognizer) { setNotice('unavailable'); return; }
    const recognition = new Recognizer();
    const request = { recognition, started: false, released: false };
    capture.current = request;
    recognition.lang = lang === 'zh' ? 'zh-CN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    setNotice('listening');
    recognition.onstart = () => {
      if (capture.current !== request) return;
      request.started = true;
      if (request.released) recognition.stop();
    };
    recognition.onresult = event => {
      if (capture.current !== request) return;
      const transcript = event.results[0]?.[0]?.transcript.trim();
      const command = transcript && matchCommand(transcript);
      if (command) execute(command, transcript);
      else { capture.current = null; setUnmatched(transcript ?? ''); setNotice('missed'); }
    };
    recognition.onerror = event => {
      if (capture.current !== request) return;
      capture.current = null;
      setNotice(['not-allowed', 'service-not-allowed'].includes(event.error) ? 'denied' : event.error === 'audio-capture' ? 'unavailable' : 'missed');
    };
    recognition.onend = () => {
      if (capture.current !== request) return;
      capture.current = null;
      setNotice('missed');
    };
    try { recognition.start(); } catch { capture.current = null; setNotice('unavailable'); }
  }
  function release() {
    const current = capture.current;
    if (!current || current.released) return;
    current.released = true;
    setNotice('recognizing');
    if (current.started) current.recognition.stop();
  }

  return (
    <div className="tech-demo-grid">
      <div className="tech-demo-stage voice-stage" data-task={ready ? command : undefined}>
        <PixelCora frame={command ? 'working' : 'idle'}/>
        {ready && command === 'locate' && <div className="voice-rack"><Icon name="cargo" size={30}/><strong>{c.tool}</strong><span>{c.toolRack}</span></div>}
        {ready && command === 'photo' && <div className="voice-frame"><Icon name="camera" size={24}/>{c.viewfinder}</div>}
      </div>
      <div className="tech-demo-controls">
        <DemoHeading title={t.technology.features.voice} intro={c.intro}/>
        <button className="button primary voice-hold" type="button" aria-pressed={notice === 'listening'}
          onPointerDown={event => { if (event.button === 0) { event.currentTarget.setPointerCapture(event.pointerId); start(); } }}
          onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}
          onKeyDown={event => {
            if (event.key !== ' ' && event.key !== 'Enter') return;
            event.preventDefault();
            if (!event.repeat) start();
          }}
          onKeyUp={event => { if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); release(); } }}
          onBlur={release}><Icon name="mic" size={17}/>{c.hold}</button>
        {(notice || task) && <div className="voice-status" role="status">
          {unmatched && <p>{unmatched}</p>}
          {task && !unmatched && <p>{task.transcript ?? c.commands[task.command].text}</p>}
          {notice ? <p>{c[notice]}</p> : !ready ? <p>{c.executing}</p> : null}
        </div>}
        <div className="tech-command-options" role="group" aria-label={c.choose}>
          {commands.map(id => <button key={id} type="button" data-command={id} aria-pressed={command === id} onClick={() => execute(id)}>
            <span>{c.commands[id].text}</span><Icon name="arrow" size={16}/>
          </button>)}
        </div>
        {ready && command && <div className="tech-reply" aria-live="polite">
          <div className="tech-reply-heading"><span>{c.reply}</span><VoicePlayback key={task.id} message={c.commands[command].reply}/></div>
          <p className="tech-response">{c.commands[command].reply}</p>
          {command === 'photo' && <button type="button" className="button secondary" onClick={openPhoto}>{c.photoLink}<Icon name="arrow" size={16}/></button>}
          {command === 'inventory' && <table className="voice-inventory">
            <caption>{c.inventory}</caption>
            <thead><tr><th>{c.name}</th><th>{c.location}</th><th>{c.status}</th></tr></thead>
            <tbody>
              <tr><td>{c.tool}</td><td>{c.toolRack}</td><td>{c.current}</td></tr>
              <tr><td>{t.technology.qr.record.name}</td><td>{t.technology.qr.record.location}</td><td>{c.current}</td></tr>
            </tbody>
          </table>}
        </div>}
      </div>
    </div>
  );
}
