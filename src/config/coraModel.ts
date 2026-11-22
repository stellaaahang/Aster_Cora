export type Vec3 = [number, number, number];
export type CameraView = 'reset' | 'front' | 'left' | 'right' | 'back' | 'top' | 'bottom';
export type DisplayMode = 'standby' | 'working' | 'companion';
export type HotspotId = 'sensing' | 'display' | 'interfaces' | 'structure' | 'control';
export const cameraViews: CameraView[] = ['front', 'left', 'right', 'back', 'top', 'bottom'];
/** Camera directions in the matte-white source model's world space. */
export const cameraDirections: Record<CameraView, Vec3> = {
  reset: [.5, .25, 1], front: [0, 0, 1], left: [-1, 0, 0], right: [1, 0, 0],
  back: [0, 0, -1], top: [0, 1, .015], bottom: [0, -1, .015],
};
export interface GeometryAnchor { node: number; normal: Vec3; fraction?: Vec3; view: CameraView }
export const displayNode = 53;
export const modelHotspots: (GeometryAnchor & { id: HotspotId; opposite?: GeometryAnchor })[] = [
  { id: 'sensing', node: 34, normal: [0, 0, 1], view: 'front' },
  { id: 'display', node: displayNode, normal: [0, 0, 1], fraction: [.82, .23, .5], view: 'front' },
  { id: 'interfaces', node: 51, normal: [1, 0, 0], view: 'right', opposite: { node: 50, normal: [-1, 0, 0], view: 'left' } },
  { id: 'structure', node: 36, normal: [.45, .4, 1], view: 'reset' },
  { id: 'control', node: 47, normal: [0, 0, -1], view: 'back' },
];
export const hotspotCloseUps: Partial<Record<HotspotId, { direction: Vec3; padding: number }>> = {
  structure: { direction: [.5, .38, 1], padding: .7 },
  sensing: { direction: [0, 0, 1], padding: 3.15 },
  display: { direction: [0, 0, 1], padding: 1.32 },
};
/** User-provided concept IMAGES. No validated add-on GLB geometry has been supplied. */
export const missionModules = [
  { id: 'arm', image: '/images/module-arm.webp', icon: 'arm' },
  { id: 'cargo', image: '/images/module-cargo.webp', icon: 'cargo' },
  { id: 'temperature', image: '/images/module-temperature.webp', icon: 'temperature' },
  { id: 'pump', image: '/images/module-pump.webp', icon: 'pump' },
] as const;
export interface ModelCommand {
  sequence: number;
  view?: CameraView;
  focus?: HotspotId;
  zoom?: number;
  nudge?: [number, number];
}
