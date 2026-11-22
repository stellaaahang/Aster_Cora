import { publicAssets, publicUrl } from './publicAssets.ts';
import type { IconName } from '../components/Icon';

export const features = ['companion', 'qr', 'voice', 'modules', 'photo', 'motion'] as const;
export type Feature = typeof features[number];
export const featureIcons: Record<Feature, IconName> = {
  companion: 'people', qr: 'scan', voice: 'wave', modules: 'cube', photo: 'camera', motion: 'orbit',
};
export const sampleEquipmentId = 'ASTER-DEMO-001';
export const sampleQrImage = publicUrl('/images/tech/sample-equipment-qr.png');
export const pixelFrames = publicAssets({
  idle: '/images/tech/cora-idle.png', happy: '/images/tech/cora-happy.png',
  down: '/images/tech/cora-down.png', standby: '/images/tech/cora-standby.png', worried: '/images/tech/cora-worried.png',
  calm: '/images/tech/cora-calm.png', working: '/images/tech/cora-working.png',
});
export type PixelFrame = keyof typeof pixelFrames;

export const motionStart = { x: 71, y: 157 };
export const motionJunction = { x: 176, y: 157 };
export const destinations = [{ x: 85, y: 75 }, { x: 270, y: 75 }, { x: 270, y: 237 }];

export const assemblyModules = ['cargo', 'temperature', 'arm', 'pump'] as const;
export type AssemblyModule = typeof assemblyModules[number];
export const assemblyBare = publicUrl('/images/tech/assembly-bare.webp');
export const assemblyPart = (module: AssemblyModule) => publicUrl(`/images/tech/assembly-${module}-part.webp`);
export const assemblyView = (module: AssemblyModule | null) => module ? publicUrl(`/images/tech/assembly-${module}-attached.webp`) : assemblyBare;
export const moduleContact = '/contact?from=modules';
export const moduleReturn = '/applications?demo=modules#try-cora';
