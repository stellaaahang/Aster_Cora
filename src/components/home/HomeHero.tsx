import { Link } from 'react-router-dom';
import { useLayoutEffect, useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { assets } from '../../config/product';
import useMotionVisibility from '../../hooks/useMotionVisibility';
import Icon from '../Icon';
import CoraVisual from './CoraVisual';
import CoraGuide from './CoraGuide';
import GalaxyWindow from './GalaxyWindow';
export default function HomeHero() {
  const { t } = useI18n(), c = t.home.hero;
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const { ref, running } = useMotionVisibility<HTMLElement>();
  useLayoutEffect(() => {
    const hero = ref.current;
    if (!hero) return;

    const mobile = matchMedia('(max-width: 600px)');

    function alignToPlatform() {
      if (!hero || mobile.matches) return;
      const { clientWidth: width, clientHeight: height } = hero;
      // Center of the platform's top ellipse in the desktop cabin artwork.
      const scale = Math.max(width / 1495, height / 1052);
      const imageWidth = 1495 * scale, imageHeight = 1052 * scale;
      const platformX = 1027 * scale, platformY = 873 * scale;
      const floorClearance = Math.min(118, height * .12);
      // Keep the platform visible when the cover crop becomes unusually wide or tall.
      const left = Math.max(width - imageWidth, Math.min((width - imageWidth) / 2, width * .75 - platformX));
      const top = Math.max(height - imageHeight, Math.min((height - imageHeight) / 2, height - floorClearance - platformY));
      hero.style.setProperty('--cabin-x', `${left}px`);
      hero.style.setProperty('--cabin-y', `${top}px`);
      hero.style.setProperty('--platform-x', `${left + platformX}px`);
      hero.style.setProperty('--platform-y', `${top + platformY}px`);
    }

    alignToPlatform();
    const observer = new ResizeObserver(alignToPlatform);
    observer.observe(hero);
    return () => observer.disconnect();
  }, [ref]);
  return <section ref={ref} id="home-heading" className="home-orbit-hero reference-home" aria-labelledby="home-title" data-section-snap data-motion={running ? 'running' : 'paused'}>
    <picture><source media="(max-width: 600px)" srcSet={assets.homeMobileCabin}/><img className="home-cabin-background" src={assets.homeCabin} alt="" width="1495" height="1052" fetchPriority="high" decoding="async"/></picture>
    <GalaxyWindow/>
    <div className="home-cabin-shade" aria-hidden="true"/>
    <div className="home-cabin-transition" aria-hidden="true"/>
    <div className="container home-orbit-grid">
      <div className="home-orbit-copy">
        <h1 id="home-title">{c.title}</h1><p className="home-hero-subheading">{c.subtitle}</p><p className="home-hero-body">{c.description}</p>
        <div className="button-row"><Link className="button primary" to="#journey">{c.start}<Icon name="arrow" size={18}/></Link><Link className="button secondary" to="/product#overview">{c.meet}</Link></div>
      </div>
      <figure className="home-cora-stage reference-home-visual">
        <div className="home-product-plinth" aria-hidden="true"/>
        <div className="home-cora-placement">
          <div className="cora-float-group">
            {step === 0 && <p className="cora-click-hint" id="cora-click-hint">{c.clickHint}<Icon name="plus" size={16}/></p>}
            <button type="button" className="home-cora-button" onClick={() => setStep(value => value === 0 ? 1 : 2)} aria-label={step === 0 ? c.greetCora : c.continueGuide} aria-pressed={step > 0} aria-controls="cora-guide-copy" aria-describedby={step === 0 ? 'cora-click-hint' : undefined}>
              <CoraVisual smiling={step > 0} eager/>
            </button>
            <CoraGuide step={step}/>
          </div>
        </div>
      </figure>
    </div>
    <Link className="home-orbit-scroll" to="#possibilities"><Icon name="down" size={18}/><span>{t.home.scroll}</span></Link>
  </section>;
}
