import { useEffect } from 'react';
export default function useReveal(path: string) {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.setAttribute('data-visible', 'true'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('[data-reveal], [data-section-intro]').forEach(el => {
      if (el.hasAttribute('data-reveal')) el.setAttribute('data-visible', 'false');
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, [path]);
}
