import { publicAssets, publicUrl } from './publicAssets.ts';
import { assets, modelConfig } from './product';

export const journeyStages = publicAssets([
  { id: 'earth', image: modelConfig.poster, width: 597, height: 512 },
  { id: 'launch', image: '/images/home/journey-detail-launch.webp', width: 1280, height: 853 },
  { id: 'orbit', image: assets.scenes[2], width: 1600, height: 900 },
  { id: 'station', image: assets.scenes[1], width: 1600, height: 900 },
  { id: 'moon', image: '/images/home/journey-detail-moon.webp', width: 1041, height: 494 },
  { id: 'mars', image: '/images/home/journey-detail-mars.webp', width: 1280, height: 644 },
] as const);
export const meetCoraBackground = publicUrl('/images/home/meet-cora-stars.webp');
/** User-selected Drift motion with pale blue/white light. */
export const galaxyDrift = {
  glowIntensity: 0.35, starSpeed: 0.3, rotationSpeed: 0.03,
  direction: 'backward' as const, clickWarp: false,
  density: 1, starSize: 1, flareIntensity: 1, twinkleIntensity: 0.3, speed: 1,
  mouseRepulsion: true, repulsionStrength: 2,
  starColors: ['#eaf7ff', '#cceaff', '#ffffff'],
};
