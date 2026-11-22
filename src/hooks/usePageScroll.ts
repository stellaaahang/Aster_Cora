import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/** The document remains the scroller, including when navigating browser history. */
export default function usePageScroll() {
  const { pathname, search, hash, key } = useLocation();
  const navigation = useNavigationType();
  const positions = useRef(new Map<string, number>());
  const previousPath = useRef<string | null>(null);
  const lastScroll = useRef(-Infinity);

  useLayoutEffect(() => {
    const previous = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    return () => { history.scrollRestoration = previous; };
  }, []);

  useLayoutEffect(() => {
    const samePage = previousPath.current === pathname;
    previousPath.current = pathname;
    // Native fragment navigation can use React Router's default history key.
    const entry = `${key}:${pathname}${search}${hash}`;
    const restored = navigation === 'POP' ? positions.current.get(entry) : undefined;
    const main = document.getElementById('main');
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    const smooth = samePage && navigation !== 'POP' && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    let anchorTimer: number | undefined;
    function cancelPendingAnchor() {
      document.removeEventListener('scrollend', scrollToAnchor);
      window.clearTimeout(anchorTimer);
    }
    function scrollToAnchor() {
      cancelPendingAnchor();
      if (!target) return;
      if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : 'instant' });
    }

    if (restored !== undefined) {
      window.scrollTo({ top: restored, behavior: 'instant' });
      if (!samePage) main?.focus({ preventScroll: true });
    } else if (target) {
      // A pending native wheel snap can otherwise cancel the explicit anchor animation.
      if (smooth && performance.now() - lastScroll.current < 100) {
        document.addEventListener('scrollend', scrollToAnchor, { once: true });
        anchorTimer = window.setTimeout(scrollToAnchor, 220);
      } else scrollToAnchor();
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
      main?.focus({ preventScroll: true });
    }

    positions.current.set(entry, window.scrollY);
    const remember = () => {
      lastScroll.current = performance.now();
      positions.current.set(entry, window.scrollY);
    };
    window.addEventListener('scroll', remember, { passive: true });
    return () => {
      cancelPendingAnchor();
      window.removeEventListener('scroll', remember);
    };
  }, [pathname, search, hash, key, navigation]);
}
