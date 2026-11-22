import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import en from '../src/i18n/en.ts';
import zh from '../src/i18n/zh.ts';
import { assets, capabilityImages, capabilityQrImages, modelConfig, possibilityImages } from '../src/config/product.ts';
import { cameraViews, missionModules, modelHotspots } from '../src/config/coraModel.ts';
function shape(value, path='root') {
  if (typeof value === 'string') { assert.ok(value.trim().length, `${path} is empty`); return 'string'; }
  if (Array.isArray(value)) return value.map((v,i)=>shape(v,`${path}[${i}]`));
  return Object.fromEntries(Object.entries(value).map(([key,v])=>[key,shape(v,`${path}.${key}`)]));
}
test('Every English resource has a nonempty matching Chinese resource',()=>assert.deepEqual(shape(en),shape(zh)));
test('Every configured image exists in the self-contained project',()=>{
  const values=Object.values(assets).flat().concat(modelConfig.poster, modelConfig.sidePoster, modelConfig.viewerPoster,
    Object.values(possibilityImages), Object.values(capabilityImages), Object.values(capabilityQrImages), missionModules.map(module => module.image));
  for (const file of values) assert.ok(existsSync(new URL(`../public${file}`,import.meta.url)),file);
});
test('The shipped GLB matches the supplied file and its calibrated component nodes exist', () => {
  const bytes = readFileSync(new URL(`../public${modelConfig.src}`, import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), '35dba3437c5f5681a7f2f01f93ad8326646153950d83783a3cb6496e2fe95a6e');
  assert.equal(bytes.subarray(0, 4).toString(), 'glTF');
  const scene = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString());
  assert.equal(scene.nodes.length, 61);
  assert.equal(scene.meshes.length, 34);
  assert.equal(scene.materials.length, 15);
  for (const hotspot of modelHotspots) {
    assert.ok(scene.nodes[hotspot.node]?.mesh !== undefined, hotspot.id);
    if (hotspot.opposite) assert.ok(scene.nodes[hotspot.opposite.node]?.mesh !== undefined);
  }
  assert.equal(cameraViews.length, en.product3d.viewer.views.length);
  assert.equal(modelHotspots.length, en.product3d.structure.items.length);
  assert.deepEqual(missionModules.map(module => module.id), ['arm', 'cargo', 'temperature', 'pump']);
  assert.equal(missionModules.length, en.product3d.modules.items.length);
});
test('Every interactive collection has a complete content set',()=>{
  assert.equal(en.product.functions.tabs.length,6);assert.equal(en.product.technology.nodes.length,5);
  assert.equal(en.product.modules.items.length,assets.modules.length);
  assert.equal(en.applications.scenarios.length,assets.scenes.length);
  assert.equal(en.applications.workflow.length,4);assert.equal(en.about.members.length,5);
});
