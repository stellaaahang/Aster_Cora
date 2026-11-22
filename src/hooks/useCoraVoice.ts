import { useEffect, useRef, useState } from 'react';
import { resolveCoraAudio } from '../lib/coraAudio';
import { useI18n } from '../i18n/I18nProvider';

let activePlayback: { owner: symbol; stop: () => void } | undefined;

/** One shared, explicitly triggered ElevenLabs voice across Home and every demo. */
export default function useCoraVoice(message: string) {
  const { t, lang } = useI18n(), c = t.home.hero;
  const [speaking, setSpeaking] = useState(false), [status, setStatus] = useState('');
  const audio = useRef<HTMLAudioElement | null>(null);
  const owner = useRef(Symbol('Cora voice'));
  const revision = useRef(0);
  const supported = typeof Audio !== 'undefined';

  function cancel(release = true) {
    revision.current += 1;
    const player = audio.current;
    if (player) {
      player.onended = null;
      player.onerror = null;
      player.pause();
      if (release) {
        audio.current = null;
        player.removeAttribute('src');
        player.load();
      } else {
        player.currentTime = 0;
      }
    }
    if (activePlayback?.owner === owner.current) activePlayback = undefined;
  }
  function createPlayer(src: string) {
    const player = new Audio(src);
    player.preload = 'auto';
    player.volume = .9;
    player.playbackRate = 1;
    return player;
  }
  useEffect(() => {
    cancel(); setSpeaking(false); setStatus('');
    const current = revision.current;
    // Warm only the current reply, silently, before its play button is pressed.
    // Reuse the buffered file for replay instead of synthesizing or streaming speech.
    if (supported) void resolveCoraAudio(message, lang).then(clip => {
      if (!clip || revision.current !== current || audio.current) return;
      audio.current = createPlayer(clip.src);
      audio.current.load();
    }).catch(() => {});
    return () => cancel();
  }, [message, lang]);

  async function preview() {
    if (!supported) return;
    if (speaking) { cancel(false); setSpeaking(false); setStatus(c.voiceStopped); return; }
    activePlayback?.stop();
    cancel(false);
    const current = revision.current;
    activePlayback = { owner: owner.current, stop: () => { cancel(); setSpeaking(false); setStatus(c.voiceStopped); } };
    setSpeaking(true); setStatus(c.voiceLoading);
    try {
      const clip = await resolveCoraAudio(message, lang);
      if (revision.current !== current) return;
      if (!clip) {
        cancel(); setSpeaking(false); setStatus(c.voiceNotReady);
        return;
      }
      const buffered = audio.current;
      const player = buffered && buffered.src.endsWith(clip.src) && !buffered.error ? buffered : createPlayer(clip.src);
      audio.current = player;
      player.onended = () => {
        if (revision.current !== current) return;
        cancel(false); setSpeaking(false); setStatus(c.voiceStopped);
      };
      player.onerror = () => {
        if (revision.current !== current) return;
        cancel(); setSpeaking(false); setStatus(c.voiceError);
      };
      await player.play();
      if (revision.current === current) setStatus(c.voicePlaying);
    } catch {
      if (revision.current !== current) return;
      cancel(); setSpeaking(false); setStatus(c.voiceError);
    }
  }
  return { supported, speaking, status, preview };
}
