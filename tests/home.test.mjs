import { test } from 'node:test';
import assert from 'node:assert/strict';
import en from '../src/i18n/en.ts';
import zh from '../src/i18n/zh.ts';
import { coraVoice, collectCoraVoiceLines, findCoraVoiceClip } from '../src/config/coraVoice.ts';

test('Every Cora voice entry uses the requested voice and the current bilingual copy', () => {
  assert.equal(coraVoice.voiceId, 'cgSgspJ2msm6clMCkdW9');
  const lines = [...collectCoraVoiceLines(en, 'en'), ...collectCoraVoiceLines(zh, 'zh')];
  assert.equal(lines.length, 20);
  assert.equal(new Set(lines.map(line => line.language + '/' + line.key)).size, 20);
  for (const language of ['en', 'zh']) {
    const scripts = lines.filter(line => line.language === language);
    assert.equal(scripts.filter(line => line.key.startsWith('home-guide-')).length, 2);
    assert.equal(scripts.filter(line => line.key.startsWith('companion-')).length, 5);
    assert.equal(scripts.filter(line => line.key.startsWith('command-')).length, 3);
    assert.ok(scripts.every(line => line.text.length > 0));
  }
});

test('Audio resolution rejects the wrong voice, language, stale copy and external paths', () => {
  const line = collectCoraVoiceLines(en, 'en')[0];
  const clip = { ...line, src: '/audio/cora/en-home-guide-1-example.mp3' };
  const manifest = { version: 1, voiceId: coraVoice.voiceId, modelId: coraVoice.modelId, clips: [clip] };
  assert.deepEqual(findCoraVoiceClip(manifest, line.text, 'en'), clip);
  assert.equal(findCoraVoiceClip(manifest, line.text, 'zh'), undefined);
  assert.equal(findCoraVoiceClip(manifest, 'Outdated greeting', 'en'), undefined);
  assert.equal(findCoraVoiceClip({ ...manifest, voiceId: 'old-voice' }, line.text, 'en'), undefined);
  assert.equal(findCoraVoiceClip({ ...manifest, modelId: 'old-model' }, line.text, 'en'), undefined);
  for (const src of ['https://example.com/voice.mp3', '/audio/cora/../private.mp3', '/other/voice.mp3']) {
    assert.equal(findCoraVoiceClip({ ...manifest, clips: [{ ...clip, src }] }, line.text, 'en'), undefined);
  }
});
