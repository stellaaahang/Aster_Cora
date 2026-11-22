import { publicUrl } from '../../config/publicAssets.ts';
import { useMemo, useRef, useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { journeyStages } from '../../config/home';
import useMediaQuery from '../../hooks/useMediaQuery';
import OrbitImages from '../effects/orbit-images/OrbitImages.jsx';
import Icon from '../Icon';
import Image from '../Image';

const lastStage = journeyStages.length - 1;

export default function Journey() {
  const { t } = useI18n();
  const copy = t.home.journey;
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const compact = useMediaQuery('(max-width: 600px)');
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const detail = useRef<HTMLElement>(null);
  const stage = journeyStages[selected];
  const active = copy.stages[selected];
  const images = useMemo(() => journeyStages.map(({ id }, index) => ({
    src: publicUrl(`/images/home/journey-${id}.webp`),
    alt: copy.stages[index].label,
    subtitle: copy.stages[index].phase,
  })), [copy.stages]);

  function showStage(index: number) {
    setSelected(index);
    requestAnimationFrame(() => {
      detail.current?.focus({ preventScroll: true });
      detail.current?.scrollIntoView({ block: 'start', behavior: reduced ? 'instant' : 'smooth' });
    });
  }

  return (
    <>
      <section className="section journey-section" id="journey" aria-labelledby="journey-title" data-section-snap>
        <div className="container">
          <div className="section-heading journey-heading">
            <div data-section-intro>
              <h2 id="journey-title">{copy.title}</h2>
              <p>{copy.subtitle}</p>
            </div>
            {!reduced && (
              <button className="journey-pause button secondary" type="button" onClick={() => setPaused(value => !value)}>
                {paused ? copy.resume : copy.pause}
              </button>
            )}
          </div>
          <OrbitImages
            images={images}
            className="journey-orbit"
            radiusX={compact ? 320 : 420}
            radiusY={compact ? 113 : 86}
            rotation={-13}
            itemSize={150}
            itemRadius={15}
            height="var(--journey-orbit-height)"
            duration={48}
            depth={0.35}
            shadow={0.12}
            showPath
            pathWidth={1.25}
            pathColor="rgba(53, 87, 121, 0.27)"
            showLabels
            intro={false}
            paused={paused || reduced}
            hoverScale={1.06}
            hoverSpeed={0.15}
            selectedIndex={selected}
            itemControls="journey-detail"
            onItemClick={showStage}
          />
        </div>
      </section>
      <section ref={detail} className="section journey-detail-section" id="journey-detail" data-stage={stage.id}
        tabIndex={-1} aria-labelledby="journey-detail-title" data-section-snap>
        <div className="container">
          <div className="journey-detail">
            <figure className="journey-detail-figure">
              <div className="journey-detail-image">
                <Image key={stage.id} src={stage.image} alt={active.imageAlt} width={stage.width} height={stage.height}/>
              </div>
              <figcaption>{active.caption}</figcaption>
            </figure>
            <div className="journey-detail-content">
              <div className="journey-detail-copy" aria-live="polite" aria-atomic="true">
                {/* Reserve the tallest copy so changing stops keeps the reading position. */}
                {copy.stages.map((item, index) => (
                  <div className="journey-detail-text" aria-hidden={index !== selected} key={journeyStages[index].id}>
                    <span className="journey-phase">{item.phase}</span>
                    <h2 id={index === selected ? 'journey-detail-title' : undefined}>{item.title}</h2>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
              <div className="journey-detail-actions">
                <button type="button" className="icon-button journey-detail-arrow" aria-label={copy.previous}
                  disabled={selected === 0} onClick={() => setSelected(selected - 1)}>
                  <Icon className="journey-previous-icon" name="arrow" size={18}/>
                </button>
                <button type="button" className="icon-button journey-detail-arrow" aria-label={copy.next}
                  disabled={selected === lastStage} onClick={() => setSelected(selected + 1)}>
                  <Icon name="arrow" size={18}/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
