import { coraVoice, findCoraVoiceClip } from '../config/coraVoice';
import type { VoiceClip, VoiceLanguage } from '../config/coraVoice';

let manifest: unknown;
let pending: Promise<unknown> | undefined;

export function prepareCoraAudio(refresh = false): Promise<unknown> {
  if (!refresh && manifest) return Promise.resolve(manifest);
  if (pending) return pending;
  pending = fetch(coraVoice.manifest, { cache: 'no-cache' })
    .then(response => {
      if (!response.ok) throw new Error('Cora audio manifest unavailable');
      return response.json() as Promise<unknown>;
    })
    .then(value => { manifest = value; return value; })
    .finally(() => { pending = undefined; });
  return pending;
}

export async function resolveCoraAudio(text: string, language: VoiceLanguage): Promise<VoiceClip | undefined> {
  const value = await prepareCoraAudio();
  const clip = findCoraVoiceClip(value, text, language);
  if (clip) return clip;
  // A generation run may have finished since the first page visit.
  return findCoraVoiceClip(await prepareCoraAudio(true), text, language);
}
