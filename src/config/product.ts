/** Asset and model configuration: copy new media into public/ and update only this file. */
export const assets = {
  logo: '/images/aster-logo.png', brandLogo: '/images/aster-logo-mono.png', mark: '/images/aster-mark.png', hero: '/images/cora-white-hero.webp', original: '/images/cora-original.webp',
  homeCabin: '/images/home-reference-cabin.webp', homeMobileCabin: '/images/home-orbital-cabin.webp', homeProduct: '/images/cora-reference.webp',
  team: '/images/team.webp', orbit: '/images/iss-orbit.webp', earth: '/images/earth-mission.webp',
  interior: '/images/station-interior.webp', cabin: '/images/cabin-background.webp', earthSurface: '/images/earth-surface.webp',
  details: ['display', 'sensor', 'propulsion', 'interface', 'ventilation'].map(id => `/images/cora-detail-${id}.webp`),
  scenes: ['/images/scene-inspection.webp', '/images/scene-environment.webp', '/images/scene-inventory.webp', '/images/scene-assistance.webp'],
  modules: ['/images/module-cargo.webp', '/images/module-temperature.webp', '/images/module-arm.webp', '/images/module-pump.webp'],
};
/** Product loads the matte-white GLB. Other pages retain their existing image assets. */
export const modelConfig = {
  src: '/models/cora-matte-white.glb',
  viewerPoster: '/images/cora-matte-white-overview.png',
  poster: '/images/cora-official-overview.png',
  sidePoster: '/images/cora-official-side.png',
} as const;

export const possibilityImages = {
  upper: '/images/cora-matte-white-upper.webp',
  lower: '/images/cora-matte-white-lower.webp',
  cargo: '/images/tech/assembly-cargo-part.webp',
  arm: '/images/tech/assembly-arm-part.webp',
  temperature: '/images/tech/assembly-temperature-part.webp',
} as const;

/** Supplied Product-page artwork; the Tech scene keeps its existing layers. */
export const possibilityArtwork = {
  modular: { src: '/images/product-modular-expansion.png', width: 1546, height: 1017 },
  collaboration: { src: '/images/product-multi-robot-collaboration.png', width: 1624, height: 969 },
} as const;

export const capabilityImages = {
  qr: assets.scenes[2],
  voice: '/images/product-capability-voice.webp',
  motion: '/images/product-capability-motion.webp',
  photo: '/images/product-capability-photo.webp',
  companion: '/images/product-capability-companion.webp',
} as const;

export const capabilityQrImages = {
  en: '/images/product-capability-qr-en.webp',
  zh: '/images/product-capability-qr-zh.webp',
} as const;
