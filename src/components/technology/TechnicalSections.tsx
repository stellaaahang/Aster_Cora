import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nProvider';
import { assets, capabilityImages } from '../../config/product';
import { assemblyView } from '../../config/technology';
import type { AssemblyModule, Feature } from '../../config/technology';
import Icon from '../Icon';
import Image from '../Image';
import MissionScenarioCarousel from './MissionScenarioCarousel';

type OpenDemo = (feature: Feature, module?: AssemblyModule) => void;
const groups = [
  { features: ['qr', 'voice'], image: assets.scenes[2] },
  { features: ['motion', 'photo'], image: capabilityImages.motion },
  { features: ['companion', 'modules'], image: assemblyView('arm') },
] as const;
const prototypeFeatures = new Set<Feature>(['qr', 'motion']);

export function CoreTechnologies({ onSelect }: { onSelect: OpenDemo }) {
  const { t } = useI18n();
  const c = t.technology.core;
  return (
    <section id="technology" className="tech-section tech-core-section" aria-labelledby="technology-title" data-section-snap>
      <div className="container">
        <div className="tech-section-heading"><div><h2 id="technology-title">{c.title}</h2><p>{c.intro}</p></div></div>
        <div className="tech-stories">
          {groups.map((group, index) => (
            <article className="tech-story" key={group.features[0]}>
              <div className={`tech-story-visual${index === 2 ? ' tech-story-product' : ''}`}><Image src={group.image} alt="" width={960} height={600}/></div>
              <div className="tech-story-copy">
                <h3>{c.groups[index]}</h3>
                {group.features.map(feature => (
                  <div className="tech-story-feature" key={feature}>
                    <button type="button" data-core={feature} onClick={() => onSelect(feature)}>
                      {t.technology.features[feature]}<Icon name="arrow" size={16}/>
                    </button>
                    <p>{c.items[feature]}</p>
                    <small>{prototypeFeatures.has(feature) ? t.common.prototype : feature === 'modules' ? t.common.planned : t.technology.lab.concept}</small>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MissionScenarios({ onSelect }: { onSelect: OpenDemo }) {
  const { t } = useI18n();
  const c = t.technology.scenarios;
  return (
    <section id="mission-scenarios" className="tech-section tech-scenarios-section" aria-labelledby="scenarios-title" data-section-snap>
      <div className="container">
        <div className="tech-section-heading"><div><h2 id="scenarios-title">{c.title}</h2><p>{c.intro}</p></div></div>
        <MissionScenarioCarousel onSelect={onSelect}/>
      </div>
    </section>
  );
}

export function NextMission() {
  const { t } = useI18n();
  const c = t.technology.next;
  return (
    <section className="tech-next" aria-labelledby="next-mission-title" data-section-snap>
      <Image className="tech-next-earth" src={assets.earthSurface} alt="" width={1600} height={750}/>
      <div className="container tech-next-copy">
        <span className="tech-hero-label">{c.label}</span>
        <h2 id="next-mission-title">{c.title}</h2><p>{c.intro}</p>
        <Link to="/about#vision" className="button primary">{c.link}<Icon name="arrow" size={18}/></Link>
      </div>
    </section>
  );
}
