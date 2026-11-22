import { writeFile } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:5173';
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1.5, reducedMotion: 'reduce' });
  await page.goto(`${base}/product?render-poster`);
  await page.locator('[data-model-status="ready"][data-camera-position]').waitFor();
  const canvas = page.locator('.cora-3d-stage canvas');
  async function capture() {
    return canvas.evaluate(source => {
      const surface = document.createElement('canvas'); surface.width = source.width; surface.height = source.height;
      const ctx = surface.getContext('2d', { willReadFrequently: true }); ctx.drawImage(source, 0, 0);
      const { width, height } = surface, pixels = ctx.getImageData(0, 0, width, height).data;
      let x0 = width, y0 = height, x1 = 0, y1 = 0;
      for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
        if (pixels[(y * width + x) * 4 + 3] <= 9) continue;
        x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
      }
      if (x1 <= x0 || y1 <= y0) throw new Error('No rendered pixels. Use the Vite development server.');
      const crop = document.createElement('canvas'), w = x1 - x0 + 1, h = y1 - y0 + 1;
      crop.width = w + 40; crop.height = h + 40;
      crop.getContext('2d').drawImage(surface, x0, y0, w, h, 20, 20, w, h);
      return crop.toDataURL('image/png').split(',')[1];
    });
  }
  const overview = await capture();
  await page.close();
  await writeFile(new URL('../public/images/cora-matte-white-overview.png', import.meta.url), Buffer.from(overview, 'base64'));
  console.log('Exported the Product poster from the matte-white Cora model.');
} finally { await browser.close(); }
