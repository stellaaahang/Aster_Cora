import type { ReactElement } from 'react';

export interface GalleryItem {
  image: string;
  text: string;
  description: string;
  alt: string;
  accessibleLabel: string;
  imageFit?: 'cover' | 'contain';
  background?: string;
}

export default function CircularGallery(props: {
  items: GalleryItem[];
  selectedIndex: number;
  onActiveChange: (index: number) => void;
  onError: () => void;
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
  itemAspect?: number;
  itemSize?: number;
  gap?: number;
  wave?: number;
  shadow?: number;
  fadeEdges?: number;
  intro?: boolean;
  autoScroll?: number;
  openOnClick?: boolean;
  dpr?: number;
  tabIndex?: number;
  'aria-label'?: string;
  'aria-roledescription'?: string;
  'aria-describedby'?: string;
}): ReactElement;
