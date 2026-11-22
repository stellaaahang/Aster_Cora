import { publicAssets } from './publicAssets.ts';
/** Increment only when the site intentionally wants every visitor to see a new intro. */
export const INTRO_STORAGE_KEY = 'aster.exploration-pass.v1';
export const INTRO_SEEN_VALUE = 'entered';
export const passConfig = publicAssets({
  desktop: { width: 720, height: 340, stubSize: 215 },
  mobile: { width: 560, height: 300, stubSize: 188 },
  illustration: '/images/aster-space-line-art.webp',
  resistance: 0.15,
  serial: 'CORA-001',
});
type IntroStorage = Pick<Storage, 'getItem' | 'setItem'>;
export function hasSeenIntro(storage: IntroStorage | null): boolean {
  try { return storage?.getItem(INTRO_STORAGE_KEY) === INTRO_SEEN_VALUE; } catch { return false; }
}
export function rememberIntro(storage: IntroStorage | null): void {
  try { storage?.setItem(INTRO_STORAGE_KEY, INTRO_SEEN_VALUE); } catch { /* The mounted gate remembers this visit. */ }
}
export function shouldShowIntro(pathname: string, hash: string, seen: boolean, preview = false): boolean {
  return pathname === '/' && (preview || (!hash && !seen));
}
