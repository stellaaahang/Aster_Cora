import { useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { aboutAssets } from '../../config/about';
import useMediaQuery from '../../hooks/useMediaQuery';
import Icon from '../Icon';
import Image from '../Image';

export default function JourneyTimeline() {
  const { t } = useI18n();
  const c = t.about.journey;
  const [active, setActive] = useState(0);
  const stacked = useMediaQuery('(max-width: 700px)');
  const stage = c.milestones[active];
  const picture = <figure className={`about-journey-picture about-journey-picture-${active}`} key={active}>
    <Image src={aboutAssets.milestones[active]} alt={stage.image} width={640} height={420}/>
    <figcaption>{stage.image}</figcaption>
  </figure>;
  return (
    <section id="why-cora" className="about-section about-journey" aria-labelledby="about-journey-title" data-section-snap>
      <div className="container">
        <header className="about-section-heading"><h2 id="about-journey-title">{c.title}</h2><p>{c.subtitle}</p></header>
        <div className="about-journey-layout">
          <ol className="about-milestones">
            {c.milestones.map((milestone, index) => (
              <li key={index} className="about-milestone" data-active={active === index} data-reveal>
                <button type="button" aria-expanded={active === index} aria-controls={`milestone-detail-${index}`} onClick={() => setActive(index)}>
                  <span><strong>{milestone.title}</strong><span>{milestone.subtitle}</span></span>
                  <Icon name={active === index ? 'minus' : 'plus'} size={17}/>
                </button>
                <div className="about-milestone-detail" id={`milestone-detail-${index}`} hidden={active !== index}>
                  <p>{milestone.detail}</p>
                  {stacked && active === index && picture}
                </div>
              </li>
            ))}
          </ol>
          {!stacked && picture}
        </div>
      </div>
    </section>
  );
}
