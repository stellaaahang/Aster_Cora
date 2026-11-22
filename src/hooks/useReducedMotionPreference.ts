import { useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';
function subscribe(changed: () => void) {
  const media = matchMedia(query);
  media.addEventListener('change', changed);
  return () => media.removeEventListener('change', changed);
}
function snapshot() { return matchMedia(query).matches; }

/** Subscribe so an in-session system preference change also updates Motion variants. */
export default function useReducedMotionPreference() {
  return useSyncExternalStore(subscribe, snapshot, () => true);
}
