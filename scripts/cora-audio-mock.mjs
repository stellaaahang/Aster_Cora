import en from '../src/i18n/en.ts';
import zh from '../src/i18n/zh.ts';
import { coraVoice, collectCoraVoiceLines } from '../src/config/coraVoice.ts';

/** Isolate browser checks from ElevenLabs, API keys, account credits and audio hardware. */
export async function mockCoraAudio(context, { cancelAsString = false } = {}) {
  const clips = [...collectCoraVoiceLines(en, 'en'), ...collectCoraVoiceLines(zh, 'zh')]
    .map(line => ({ ...line, src: `/audio/cora/${line.language}-${line.key}-mock.mp3` }));
  const manifest = { version: 1, voiceId: coraVoice.voiceId, modelId: coraVoice.modelId, clips };
  await context.route('**/audio/cora/manifest.json', route => route.fulfill({ json: manifest }));
  await context.addInitScript(({ clips, voiceId, cancelAsString }) => {
    window.voiceCalls = [];
    Object.defineProperty(window, 'Audio', { value: class {
      constructor(src) { this.src = src; this.playing = false; }
      play() {
        this.playing = true;
        const clip = clips.find(clip => clip.src === this.src);
        window.voiceCalls.push({ type: 'play', src: this.src, voice: voiceId, lang: clip?.language === 'zh' ? 'zh-CN' : 'en-US', text: clip?.text, rate: this.playbackRate });
        return Promise.resolve();
      }
      pause() {
        if (this.playing) window.voiceCalls.push(cancelAsString ? 'cancel' : { type: 'cancel' });
        this.playing = false;
      }
      load() {}
      removeAttribute(name) { if (name === 'src') this.src = ''; }
    } });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: class { constructor() { throw new Error('Browser TTS must not replace the selected ElevenLabs voice'); } } });
  }, { clips, voiceId: coraVoice.voiceId, cancelAsString });
}
