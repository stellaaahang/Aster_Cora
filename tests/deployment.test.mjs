import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publicUrl, publicAssets } from '../src/config/publicAssets.ts';

test('Public assets support repository subpaths without changing root-hosted URLs', () => {
  assert.equal(publicUrl('/images/cora.webp', '/'), '/images/cora.webp');
  assert.equal(publicUrl('/images/cora.webp', '/Aster_Cora/'), '/Aster_Cora/images/cora.webp');
  assert.equal(publicUrl('/Aster_Cora/images/cora.webp', '/Aster_Cora/'), '/Aster_Cora/images/cora.webp');
  for (const path of ['https://example.com/image.png', '//example.com/image.png', 'blob:test', 'data:image/png;base64,AA']) {
    assert.equal(publicUrl(path, '/Aster_Cora/'), path);
  }
  assert.deepEqual(publicAssets({ id: 'earth', image: '/images/earth.webp', size: [320, 180] }),
    { id: 'earth', image: '/images/earth.webp', size: [320, 180] });
});
