import { useEffect, useState } from 'react';

/** Observe the hero boundary rather than re-rendering on each scroll event. */
export default function useHeaderTone(pathname: string) {
  const [light, setLight] = useState(false);
  useEffect(() => {
    setLight(false);
    const hero = document.querySelector('#main > section');
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => {
      setLight(entry.boundingClientRect.bottom <= 128);
    }, { rootMargin: '-128px 0px 0px 0px' });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);
  return light;
}
