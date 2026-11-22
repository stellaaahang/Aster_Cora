export type VoiceLanguage = 'en' | 'zh';

/** Public voice settings. The API key belongs only in the local generation script. */
export const coraVoice = {
  voiceId: 'cgSgspJ2msm6clMCkdW9', // Jessica: playful, bright, warm; account-listed premade voice.
  modelId: 'eleven_multilingual_v2',
  manifest: '/audio/cora/manifest.json',
  directory: '/audio/cora/',
} as const;

export interface VoiceLine { key: string; language: VoiceLanguage; text: string }
export interface VoiceClip extends VoiceLine { src: string }
export interface VoiceManifest { version: 1; voiceId: string; modelId: string; clips: VoiceClip[] }

type VoiceCopy = {
  home: { hero: { guideMessages: readonly string[] } };
  technology: {
    companion: { greeting: string; moods: Record<string, { reply: string }> };
    voice: { commands: Record<string, { reply: string }> };
  };
};

/** Every spoken line is read from the existing bilingual dictionaries. */
export function collectCoraVoiceLines(copy: VoiceCopy, language: VoiceLanguage): VoiceLine[] {
  return [
    ...copy.home.hero.guideMessages.map((text, index) => ({ key: `home-guide-${index + 1}`, language, text })),
    { key: 'companion-greeting', language, text: copy.technology.companion.greeting },
    ...Object.entries(copy.technology.companion.moods).map(([key, value]) => ({ key: `companion-${key}`, language, text: value.reply })),
    ...Object.entries(copy.technology.voice.commands).map(([key, value]) => ({ key: `command-${key}`, language, text: value.reply })),
  ];
}

/** Reject stale voices, stale translations, and non-local audio paths. */
export function findCoraVoiceClip(manifest: unknown, text: string, language: VoiceLanguage): VoiceClip | undefined {
  if (!manifest || typeof manifest !== 'object') return;
  const value = manifest as Partial<VoiceManifest>;
  if (value.version !== 1 || value.voiceId !== coraVoice.voiceId || value.modelId !== coraVoice.modelId || !Array.isArray(value.clips)) return;
  return value.clips.find(clip => clip && clip.text === text && clip.language === language
    && typeof clip.key === 'string' && typeof clip.src === 'string' && /^\/audio\/cora\/[a-z0-9-]+\.mp3$/.test(clip.src));
}
