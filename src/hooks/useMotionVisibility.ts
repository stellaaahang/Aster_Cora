import { useEffect, useRef, useState } from 'react';
/** Pause the hero loops outside the viewport and in a hidden tab. */
export default function useMotionVisibility<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    let visible = false;
    const update = () => setRunning(visible && document.visibilityState === 'visible');
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    if (ref.current) observer.observe(ref.current);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  return { ref, running };
}
