import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import { aboutAssets } from '../config/about';
import Icon from '../components/Icon';
import Image from '../components/Image';
import SceneBackdrop from '../components/SceneBackdrop';
import CrewSection from '../components/about/CrewSection';
import MissionVision from '../components/about/MissionVision';
import OurValues from '../components/about/OurValues';
import '../styles/about.css';

function AboutHero() {
  const { t } = useI18n();
  const c = t.about.hero;
  return (
    <section className="about-hero-section" aria-labelledby="about-heading" data-section-snap>
      <SceneBackdrop src={aboutAssets.observation} variant="observatory"/>
      <div className="container about-hero-grid">
        <div className="about-hero-copy">
          <span className="about-label">{c.label}</span>
          <h1 id="about-heading">{c.title}</h1>
          <p className="about-hero-subtitle">{c.subtitle}</p><p>{c.intro}</p>
        </div>
        <figure className="about-observation">
          <Image src={aboutAssets.observation} alt={c.observation} width={1672} height={941} loading="eager" fetchPriority="high"/>
        </figure>
      </div>
    </section>
  );
}

function JoinJourney() {
  const { t } = useI18n();
  const c = t.about.closing;
  return (
    <section className="about-join" aria-labelledby="about-join-title" data-section-snap>
      <Image src={aboutAssets.closing} className="about-join-earth" alt="" width={2200} height={162}/>
      <div className="container about-join-content">
        <span className="about-label">{c.label}</span>
        <h2 id="about-join-title">{c.title}</h2><p>{c.intro}</p>
        <Link className="button primary about-contact-link" to="/contact?from=about">{c.contact}<Icon name="arrow" size={17}/></Link>
      </div>
    </section>
  );
}

export default function About() {
  return <><AboutHero/><CrewSection/><MissionVision/><OurValues/><JoinJourney/></>;
}
