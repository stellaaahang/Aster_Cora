import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import { assets } from '../config/product';
import type { AssemblyModule, Feature } from '../config/technology';
import SceneBackdrop from '../components/SceneBackdrop';
import Icon from '../components/Icon';
import Image from '../components/Image';
import TryCora from '../components/technology/TryCora';
import type { LabHandle } from '../components/technology/TryCora';
import { CoreTechnologies, MissionScenarios, NextMission } from '../components/technology/TechnicalSections';
import '../styles/tech-scenarios.css';
import '../styles/tech-interactions.css';

export default function Applications() {
  const { t } = useI18n();
  const c = t.technology;
  const lab = useRef<LabHandle>(null);
  const hero = useRef<HTMLElement>(null);
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const node = hero.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.dataset.entered = 'true';
        observer.disconnect();
      }
    }, { threshold: .24 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  function openDemo(feature: Feature, module?: AssemblyModule) { lab.current?.open(feature, module); }
  return (
    <>
      <section ref={hero} className="tech-hero" aria-labelledby="tech-page-title" data-section-snap>
        <SceneBackdrop src={assets.interior} variant="work"/>
        <div className="container tech-hero-grid">
          <div className="tech-hero-copy">
            <h1 id="tech-page-title">{c.hero.title}</h1>
            <Link to="#try-cora" className="button primary tech-hero-cta">{c.lab.title}<Icon name="down" size={21}/></Link>
          </div>
          <div className="tech-hero-product">
            <div className="tech-front-cora">
              <Image src="/images/tech/cora-front-white.webp" alt={t.common.imageAlt} width={740} height={676} loading="eager" fetchPriority="high"/>
              <svg className="tech-front-screen" viewBox="0 0 542 341" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                <rect width="542" height="341" rx="12" fill="#0b1b2c"/>
                <path d="M3 6H258L70 338H3Z" fill="#dcefff" opacity=".035"/>
                <g className="tech-front-face-light">
                  <g className="tech-front-eyes"><ellipse cx="194" cy="134" rx="21" ry="30"/><ellipse cx="352" cy="134" rx="21" ry="30"/></g>
                  <path d="M196 220Q273 283 350 220" fill="none" stroke="currentColor" strokeWidth="11" strokeLinecap="round"/>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>
      <TryCora ref={lab} initialFeature={searchParams.get('demo') === 'modules' ? 'modules' : 'companion'}/>
      <CoreTechnologies onSelect={openDemo}/>
      <MissionScenarios onSelect={openDemo}/>
      <NextMission/>
    </>
  );
}
