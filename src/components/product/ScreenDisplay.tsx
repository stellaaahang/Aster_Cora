import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { CanvasTexture, Shape, ShapeGeometry, SRGBColorSpace } from 'three';
import type { DisplayMode } from '../../config/coraModel';
import type { PreparedModel } from './modelAsset';

export type ScreenMode = DisplayMode | 'awake' | null;

export default function ScreenDisplay({ model, mode, animate, workingLabel }: { model: PreparedModel; mode: ScreenMode; animate: boolean; workingLabel: string }) {
  const invalidate = useThree(state => state.invalidate);
  const screen = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 640; canvas.height = 400;
    const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace;
    const { width: w, height: h } = model.screen, r = .003;
    const shape = new Shape();
    shape.moveTo(-w / 2 + r, -h / 2); shape.lineTo(w / 2 - r, -h / 2); shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    shape.lineTo(w / 2, h / 2 - r); shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    shape.lineTo(-w / 2 + r, h / 2); shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    shape.lineTo(-w / 2, -h / 2 + r); shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    const geometry = new ShapeGeometry(shape, 12), uv = geometry.attributes.uv, position = geometry.attributes.position;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, position.getX(i) / w + .5, position.getY(i) / h + .5);
    return { canvas, texture, geometry };
  }, [model]);
  function draw(time: number) {
    const ctx = screen.canvas.getContext('2d'); if (!ctx) return;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 640, 400);
    ctx.fillStyle = '#173b62'; ctx.strokeStyle = '#173b62';
    if (mode === 'companion') {
      const phase = time % 4.6, blink = !animate || phase < 2.0 || phase > 2.16 ? 1 : .12;
      ctx.beginPath(); ctx.ellipse(225, 155, 22, 34 * blink, 0, 0, Math.PI * 2); ctx.ellipse(415, 155, 22, 34 * blink, 0, 0, Math.PI * 2); ctx.fill();
      ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(220, 255); ctx.quadraticCurveTo(320, 325, 420, 255); ctx.stroke();
    } else if (mode === 'working') {
      ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath();
      ctx.moveTo(190, 115); ctx.lineTo(250, 132); ctx.moveTo(390, 132); ctx.lineTo(450, 115); ctx.stroke();
      ctx.font = '500 38px "Inter Variable", sans-serif'; ctx.textAlign = 'center'; ctx.fillText(workingLabel, 320, 224);
      ctx.fillStyle = '#dbeaf7'; ctx.fillRect(180, 264, 280, 6);
      ctx.fillStyle = '#397fbb'; ctx.fillRect(180, 264, 160, 6);
      ctx.globalAlpha = .2; ctx.fillRect(85, animate ? 321 + Math.sin(time * 1.3) * 19 : 321, 470, 2); ctx.globalAlpha = 1;
    } else if (mode === 'standby') {
      ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath();
      ctx.moveTo(193, 155); ctx.lineTo(255, 155); ctx.moveTo(385, 155); ctx.lineTo(447, 155);
      ctx.moveTo(292, 245); ctx.lineTo(348, 245); ctx.stroke();
    }
    screen.texture.needsUpdate = true;
  }
  useEffect(() => {
    const render = (time: number) => { draw(time); invalidate(); };
    render(0);
    if (!animate || (mode !== 'working' && mode !== 'companion')) return;
    if (mode === 'working') {
      const start = performance.now();
      const timer = window.setInterval(() => render((performance.now() - start) / 1000), 1000 / 24);
      return () => clearInterval(timer);
    }
    let next: number, reopen: number;
    const blink = () => {
      render(2.08);
      reopen = window.setTimeout(() => render(0), 145);
      next = window.setTimeout(blink, 4600);
    };
    next = window.setTimeout(blink, 2100);
    return () => { clearTimeout(next); clearTimeout(reopen); };
  }, [mode, workingLabel, animate, screen, invalidate]);
  useEffect(() => () => { screen.texture.dispose(); screen.geometry.dispose(); }, [screen]);
  if (!mode) return null;
  return <mesh position={model.screen.position} geometry={screen.geometry} raycast={() => {}}><meshBasicMaterial map={screen.texture} toneMapped={false}/></mesh>;
}
