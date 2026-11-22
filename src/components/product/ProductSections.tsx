import { useI18n } from '../../i18n/I18nProvider';
import { modelHotspots } from '../../config/coraModel';
import type { DisplayMode, HotspotId } from '../../config/coraModel';
import Icon from '../Icon';
import Image from '../Image';
import { possibilityArtwork } from '../../config/product';
const modes: DisplayMode[] = ['standby', 'working', 'companion'];

export function HotspotInfo({ selected, onClose }: { selected: HotspotId | null; onClose: () => void }) {
  const { t } = useI18n(), c = t.product3d.structure;
  const index = modelHotspots.findIndex(point => point.id === selected), details = c.items[index];
  return <div id="model-hotspot-info" className={`product-hotspot-info ${selected ? 'is-selected' : ''}`} aria-live="polite" aria-atomic="true">
    {details ? <><button className="icon-button" onClick={onClose} aria-label={t.common.close}><Icon name="close" size={18}/></button><h3>{details.title}</h3><p>{details.text}</p></> : <><h3>{c.select}</h3><p>{c.prompt}</p></>}
  </div>;
}
export function DisplayModes({ active, screenAwake, onChange }: { active: DisplayMode | null; screenAwake: boolean; onChange: (mode: DisplayMode) => void }) {
  const { t } = useI18n(), c = t.product3d.display;
  const description = active ? c.descriptions[modes.indexOf(active)] : screenAwake ? c.awake : c.original;
  return <div className="product-display-modes"><h2>{c.title}</h2><div role="group" aria-label={c.label}>{modes.map((mode, i) => <button key={mode} aria-pressed={(active ?? (screenAwake ? null : 'standby')) === mode} onClick={() => onChange(mode)} data-mode={mode}>{c.modes[i]}</button>)}</div><p className="display-description" aria-live="polite">{description}</p></div>;
}
export function MorePossibilities() {
  const { t } = useI18n();
  const copy = t.product3d.possibilities;
  return (
    <section className="product-modules section" id="modules" aria-labelledby="possibilities-title" data-section-snap>
      <div className="container">
        <div className="section-heading product-possibilities-heading">
          <h2 id="possibilities-title">{copy.title}</h2>
        </div>
        <div className="product-possibilities-grid">
          {(['modular', 'collaboration'] as const).map(kind => {
            const item = copy[kind];
            const image = possibilityArtwork[kind];
            return (
              <article className="product-possibility" key={kind}>
                <div className="product-possibility-visual">
                  <Image {...image} alt={item.artworkAlt}/>
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
