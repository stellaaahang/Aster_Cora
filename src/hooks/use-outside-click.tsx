import { useEffect } from 'react';
import type { RefObject } from 'react';

export function useOutsideClick<T extends HTMLElement>(ref: RefObject<T | null>, callback: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    function listener(event: PointerEvent) {
      if (event.target instanceof Node && ref.current && !ref.current.contains(event.target)) callback();
    }
    document.addEventListener('pointerdown', listener);
    return () => document.removeEventListener('pointerdown', listener);
  }, [ref, callback, enabled]);
}
