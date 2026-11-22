import { createHash } from 'node:crypto';
import { readFile, mkdir, stat, writeFile, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import en from '../src/i18n/en.ts';
import zh from '../src/i18n/zh.ts';
import { coraVoice, collectCoraVoiceLines, findCoraVoiceClip } from '../src/config/coraVoice.ts';

const directory = new URL('../public/audio/cora/', import.meta.url);
const indexFile = new URL('manifest.json', directory);
const lines = [...collectCoraVoiceLines(en, 'en'), ...collectCoraVoiceLines(zh, 'zh')];
const script = lines.map(line => {
  const digest = createHash('sha256').update(JSON.stringify([coraVoice.voiceId, coraVoice.modelId, line.language, line.text])).digest('hex').slice(0, 16);
  return { ...line, src: `${coraVoice.directory}${line.language}-${line.key}-${digest}.mp3` };
});
const fileFor = clip => new URL(`../public${clip.src}`, import.meta.url);
async function hasAudio(clip) { try { return (await stat(fileFor(clip))).size > 64; } catch { return false; } }

async function run() {
  console.log(`Cora voice: ${coraVoice.voiceId} · ${coraVoice.modelId}`);
  console.log(`${lines.length} clips · English ${lines.filter(line => line.language === 'en').length} · 中文 ${lines.filter(line => line.language === 'zh').length}`);
  if (process.argv.includes('--dry-run')) {
    console.log(`${lines.reduce((sum, line) => sum + line.text.length, 0)} text characters; no API requests made.`);
    return;
  }
  if (process.argv.includes('--check')) {
    let manifest;
    try { manifest = JSON.parse(await readFile(indexFile, 'utf8')); } catch { /* Report all missing clips below. */ }
    const missing = [];
    for (const line of script) {
      const clip = findCoraVoiceClip(manifest, line.text, line.language);
      if (!clip || clip.src !== line.src || !await hasAudio(clip)) missing.push(`${line.language}/${line.key}`);
    }
    if (missing.length) throw new Error(`${missing.length} clips need generation: ${missing.join(', ')}. Run npm run voice:generate with a valid ELEVENLABS_API_KEY and account access to the requested voice.`);
    console.log('All voice files match the requested voice and current bilingual copy.');
    return;
  }
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key?.trim()) throw new Error('ELEVENLABS_API_KEY is missing. Fill it in .env.local; do not put it in a VITE_ variable or send it in chat. No audio was generated.');
  if (!key.trim().startsWith('sk_')) throw new Error('ELEVENLABS_API_KEY contains a key ID rather than the full secret. Create a new ElevenLabs key and copy the complete sk_ value shown at creation into .env.local. No API request was made.');
  const client = new ElevenLabsClient();
  const sample = process.argv.includes('--sample');
  const selected = sample ? script.filter(clip => clip.key === 'home-guide-1') : script;
  await mkdir(directory, { recursive: true });
  for (const [index, clip] of selected.entries()) {
    if (await hasAudio(clip)) {
      console.log(`${index + 1}/${selected.length} cached ${clip.language}/${clip.key}`);
      continue;
    }
    let audio;
    try {
      audio = await client.textToSpeech.convert(coraVoice.voiceId, {
        text: clip.text,
        modelId: coraVoice.modelId,
        outputFormat: 'mp3_44100_128',
      }, { timeoutInSeconds: 60, maxRetries: 0 });
    } catch (error) {
      const detail = error.body?.detail;
      const reason = [detail?.status, detail?.message].filter(value => typeof value === 'string').join(': ').replaceAll(key.trim(), '[redacted]').slice(0, 1200);
      throw new Error(`ElevenLabs request failed${error.statusCode ? ` with HTTP ${error.statusCode}` : ''} for ${clip.language}/${clip.key}${reason ? ` (${reason})` : ''}. The published manifest was left unchanged.`);
    }
    const bytes = Buffer.from(await new Response(audio).arrayBuffer());
    if (bytes.length <= 64) throw new Error('Audio was empty; the manifest was left unchanged.');
    const file = fileFor(clip), temporary = fileURLToPath(file) + '.tmp';
    await writeFile(temporary, bytes);
    await rename(temporary, file);
    console.log(`${index + 1}/${selected.length} generated ${clip.language}/${clip.key}`);
  }
  if (sample) {
    console.log('English and Chinese samples are ready. The published manifest was left unchanged.');
    for (const clip of selected) console.log(fileURLToPath(fileFor(clip)));
    return;
  }
  const manifest = { version: 1, voiceId: coraVoice.voiceId, modelId: coraVoice.modelId, clips: script };
  const temporary = fileURLToPath(indexFile) + '.tmp';
  await writeFile(temporary, JSON.stringify(manifest, null, 2) + '\n');
  await rename(temporary, indexFile);
  console.log('Published the complete bilingual audio set. Reload the website to listen.');
}

run().catch(error => { console.error(error.message); process.exitCode = 1; });
