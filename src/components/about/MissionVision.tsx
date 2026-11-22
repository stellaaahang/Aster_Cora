import { useI18n } from '../../i18n/I18nProvider';
import DirectionAwareHoverDemo from '../direction-aware-hover-demo';

export default function MissionVision() {
  const { t } = useI18n();
  const c = t.about.purpose;
  return (
    <section id="vision" className="about-section about-purpose" aria-labelledby="about-purpose-title" data-section-snap>
      <div className="container">
        <header className="about-section-heading"><h2 id="about-purpose-title">{c.title}</h2></header>
        <div className="about-purpose-pair">
          {c.principles.map((_, index) => (
            <article key={index}>
              <DirectionAwareHoverDemo index={index}/>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
