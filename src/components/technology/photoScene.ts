import { publicUrl } from '../../config/publicAssets.ts';
export const photoSize = { width: 320, height: 180 };
export const astronautImages = [1, 2].map(index => publicUrl(`/images/tech/photo-astronaut-${index}.png`));
export type PhotoPoint = { x: number; y: number };
export type PhotoPositions = [PhotoPoint | null, PhotoPoint | null];

export function keepInFrame(x: number, y: number): PhotoPoint {
  return { x: Math.round(Math.max(20, Math.min(300, x))), y: Math.round(Math.max(75, Math.min(167, y))) };
}

export function renderPhoto(canvas: HTMLCanvasElement, scene: number, positions: PhotoPositions, sprites: HTMLImageElement[]) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.imageSmoothingEnabled = false;
  function rect(x: number, y: number, w: number, h: number, color: string) {
    ctx!.fillStyle = color;
    ctx!.fillRect(x, y, w, h);
  }
  const navy = '#294866', steel = '#7594ae', white = '#f4f8fc', blue = '#a9c9e2', shadow = '#597b98';
  rect(0, 0, 320, 180, '#dcecf8');
  rect(0, 0, 320, 18, navy);
  rect(0, 18, 320, 8, steel);
  rect(102, 6, 116, 6, '#d8f4ff');
  rect(0, 123, 320, 57, '#a0bcd3');
  rect(0, 125, 320, 3, white);
  rect(0, 145, 320, 2, '#c8dded');
  rect(0, 162, 320, 2, '#c8dded');

  for (const x of [10, 63, 207, 260]) {
    rect(x, 34, 49, 84, '#b2cde1');
    rect(x + 2, 36, 45, 79, white);
    rect(x + 5, 42, 38, 30, '#d3e5f1');
    rect(x + 5, 83, 38, 23, '#c4dced');
    rect(x + 10, 86, 23, 2, steel);
    rect(x + 36, 75, 5, 4, shadow);
  }

  const zone = scene === 0 ? { x: 122, y: 111 } : { x: 250, y: 108 };
  const near = positions.some(point => point && Math.abs(point.x - zone.x) < 43 && Math.abs(point.y - zone.y) < 35);
  const status = near ? '#94f1dc' : '#79c6f1';
  if (scene === 0) {
    rect(85, 97, 130, 9, navy);
    rect(89, 106, 9, 26, steel);
    rect(201, 106, 9, 26, steel);
    rect(103, 59, 53, 34, navy);
    rect(107, 63, 45, 26, near ? '#275f72' : '#234761');
    for (let n = 0; n < 5; n++) rect(111 + n * 7, 85 - (n * 6 % 15 + 4), 4, n * 6 % 15 + 4, status);
    rect(100, 93, 60, 4, steel);
    rect(170, 83, 31, 14, blue);
    for (let n = 0; n < 3; n++) rect(174 + n * 9, 73, 5, 16, white);
  } else if (scene === 1) {
    rect(79, 32, 117, 83, steel);
    rect(84, 37, 107, 72, white);
    rect(97, 48, 83, 51, navy);
    for (let n = 0; n < 4; n++) {
      rect(106 + n * 17, 60, 11, 22, shadow);
      rect(108 + n * 17, 63, 7, 4, '#e3f5ff');
    }
    rect(220, 55, 70, 65, navy);
    rect(225, 60, 60, 56, blue);
    rect(229, 64, 52, 26, near ? '#2c6d76' : '#466988');
    rect(235, 71, 26, 3, status);
    rect(265, 71, 9, 6, status);
    rect(232, 98, 47, 7, shadow);
    rect(239, 95, 4, 14, white);
    rect(255, 95, 8, 14, white);
  } else {
    rect(83, 28, 154, 91, navy);
    rect(88, 32, 144, 82, steel);
    rect(94, 38, 132, 70, '#193750');
    for (const [x, y] of [[108, 46], [122, 55], [152, 46], [181, 52], [215, 47], [203, 65]]) rect(x, y, 2, 2, white);
    ctx.fillStyle = '#73bcf0';
    ctx.beginPath();
    ctx.moveTo(94, 82);
    ctx.lineTo(110, 72);
    ctx.lineTo(135, 64);
    ctx.lineTo(161, 63);
    ctx.lineTo(188, 70);
    ctx.lineTo(211, 81);
    ctx.lineTo(226, 93);
    ctx.lineTo(226, 108);
    ctx.lineTo(94, 108);
    ctx.fill();
    rect(110, 84, 32, 4, '#d1eeff');
    rect(146, 72, 25, 4, '#e1f5ff');
    rect(173, 91, 35, 4, '#bbddef');
    rect(103, 97, 42, 3, '#8bc7f2');
  }

  positions.map((point, index) => ({ point, index }))
    .sort((a, b) => (a.point?.y ?? 0) - (b.point?.y ?? 0))
    .forEach(({ point, index }) => {
      const sprite = sprites[index];
      if (!point || !sprite) return;
      const width = Math.round(66 * sprite.naturalWidth / sprite.naturalHeight);
      rect(point.x - 13, point.y - 1, 26, 3, shadow);
      ctx.drawImage(sprite, Math.round(point.x - width / 2), point.y - 66, width, 66);
    });
  rect(0, 174, 320, 6, steel);
  rect(0, 174, 320, 2, white);
}
