import { assets, modelConfig } from './product';

export interface CrewPortrait {
  id: string;
  pixel: string;
  memberId?: string;
  photo?: string;
}

// Portrait filenames follow the confirmed crew order.
export const crewPortraits: CrewPortrait[] = ['alexis', 'angelina', 'lucas', 'austin', 'daniel'].map((memberId, index) => {
  const id = String(index + 1).padStart(2, '0');
  return { id, memberId, pixel: `/images/team/crew-${id}-pixel.webp`, photo: `/images/team/crew-${id}-photo.webp` };
});

// These stills come from Aster's ground demonstration video.
export const prototypeDemonstration = '/images/team/prototype-demonstration.webp';

export const aboutAssets: {
  observation: string;
  group: string;
  milestones: readonly string[];
  purpose: readonly string[];
  closing: string;
} = {
  observation: assets.homeMobileCabin,
  group: assets.team,
  milestones: ['/images/cora-six-views.webp', modelConfig.poster, assets.modules[2]],
  purpose: ['/images/about-mission-earth.jpg', assets.orbit],
  closing: assets.earthSurface,
};

/** The four Value backgrounds deliberately contain no Cora product imagery. */
export const valueImages = [assets.interior, assets.earth, '/images/home/journey-detail-mars.webp', '/images/about-value-launch.jpg'] as const;
