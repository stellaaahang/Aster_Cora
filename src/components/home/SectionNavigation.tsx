import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nProvider';

const sections = ['home-heading', 'possibilities', 'journey', 'journey-detail', 'meet-cora'] as const;

export default function SectionNavigation() {
  const { t } = useI18n();
  const [active, setActive] = useState<string | null>(sections[0]);
  const labels = [t.home.hero.title, t.home.whyCora.title, t.home.journey.title, t.home.journey.detailNav, t.home.meetCora.title];

  useEffect(() => {
    let observer: IntersectionObserver;
    function observe() {
      observer?.disconnect();
      // Observe the same reading line as the rail, independent of section height.
      const line = Math.floor(window.innerHeight / 2);
      observer = new IntersectionObserver(entries => {
        const current = entries.find(entry => entry.isIntersecting);
        if (current) setActive(current.target.id);
        else setActive(previous => entries.some(entry => entry.target.id === previous) ? null : previous);
      }, { rootMargin: `-${line}px 0px -${window.innerHeight - line - 1}px 0px` });
      sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
      });
    }
    observe();
    window.addEventListener('resize', observe);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', observe);
    };
  }, []);

  return (
    <nav className="home-section-nav" aria-label={t.home.sectionNavigation}
      data-hero={active === sections[0]} data-outside={active === null}>
      {sections.map((id, index) => (
        <Link key={id} to={`#${id}`} aria-current={active === id ? 'location' : undefined}>
          <span>{labels[index]}</span>
        </Link>
      ))}
    </nav>
  );
}
