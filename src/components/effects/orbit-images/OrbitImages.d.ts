import type { ReactElement } from 'react';

export default function OrbitImages(props: {
  images: { src: string; alt: string; subtitle?: string }[];
  className?: string;
  height?: string;
  radiusX?: number;
  radiusY?: number;
  rotation?: number;
  duration?: number;
  itemSize?: number;
  itemRadius?: number;
  depth?: number;
  showPath?: boolean;
  pathColor?: string;
  pathWidth?: number;
  shadow?: number;
  hoverScale?: number;
  hoverSpeed?: number;
  intro?: boolean;
  paused?: boolean;
  showLabels?: boolean;
  selectedIndex?: number;
  itemControls?: string;
  onItemClick?: (index: number, source: string) => void;
}): ReactElement;
