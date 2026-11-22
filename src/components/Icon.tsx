import type { CSSProperties } from 'react';
export type IconName = 'arrow' | 'chevron' | 'down' | 'plus' | 'minus' | 'reset' | 'close' | 'menu' | 'chip' | 'cube' | 'scan' | 'people' | 'orbit' | 'camera' | 'mic' | 'layers' | 'cargo' | 'temperature' | 'arm' | 'pump' | 'check' | 'record' | 'eye' | 'rocket' | 'wave' | 'stop' | 'fullscreen';
const paths: Record<IconName, React.ReactNode> = {
  fullscreen: <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>,
  wave: <path d="M3 10v4m4-7v10m5-14v18m5-14v10m4-7v4"/>,
  stop: <rect x="6" y="6" width="12" height="12" rx="2"/>,
  arrow: <><path d="M4 12h15m-6-6 6 6-6 6"/></>,
  chevron: <path d="m9 5 7 7-7 7"/>, down: <path d="m5 9 7 7 7-7"/>, plus: <path d="M5 12h14M12 5v14"/>, minus: <path d="M5 12h14"/>,
  reset: <><path d="M4 8a8 8 0 1 1-1 6M4 3v5h5"/></>, close: <path d="m6 6 12 12M6 18 18 6"/>, menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
  chip: <><rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4"/></>,
  cube: <><path d="m12 2 9 5v10l-9 5-9-5V7zM3 7l9 5 9-5M12 12v10M7.5 4.5l9 5"/></>,
  scan: <><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/><circle cx="12" cy="12" r="4"/><path d="M12 7v2m0 6v2M7 12h2m6 0h2"/></>,
  people: <><circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v3"/></>,
  orbit: <><circle cx="12" cy="12" r="6"/><ellipse cx="12" cy="12" rx="12" ry="4" transform="rotate(-30 12 12)"/></>,
  camera: <><path d="M8 5 6 8H3v12h18V8h-3l-2-3z"/><circle cx="12" cy="13" r="4"/></>,
  mic: <><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/></>,
  layers: <><path d="m12 2 10 5-10 5L2 7zm-10 10 10 5 10-5M2 17l10 5 10-5"/></>,
  cargo: <><rect x="3" y="6" width="18" height="15" rx="2"/><path d="M8 6V3h8v3M3 11h18M8 9v4m8-4v4"/></>,
  temperature: <><path d="M9 14V5a3 3 0 0 1 6 0v9a5 5 0 1 1-6 0Z"/><path d="M12 8v10"/><circle cx="12" cy="18" r="1"/></>,
  arm: <><path d="M4 22h12M6 22v-5l4-5-2-5 7-4 4 3-4 4-3-1M10 12l6 3 4-5M18 4l3-2m-2 4 3 1"/><circle cx="8" cy="7" r="2"/><circle cx="10" cy="14" r="2"/></>,
  pump: <><rect x="7" y="7" width="10" height="13" rx="2"/><path d="M12 7V3M8 3h8M7 13H3v7m14-7h4v-3M10 11h4"/></>,
  check: <path d="m5 12 4 4L19 6"/>, record: <><path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7m-7 4h7"/></>,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
  rocket: <><path d="M9 15 4 20m3-11L3 10l-1 5 6-1m6 2-1 6 5-1 1-4M7 12C8 6 14 2 22 2c0 8-4 14-10 15z"/><circle cx="16" cy="8" r="2"/></>,
};
export default function Icon({ name, size = 24, className = '', style }: { name: IconName; size?: number; className?: string; style?: CSSProperties }) {
  return <svg className={className} style={style} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
