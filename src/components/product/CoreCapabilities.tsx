import { modelHotspots } from '../../config/coraModel';
import type { HotspotId } from '../../config/coraModel';
import { useI18n } from '../../i18n/I18nProvider';
import Icon from '../Icon';
import type { IconName } from '../Icon';
import '../../styles/product-capabilities.css';

const icons: IconName[] = ['eye', 'record', 'cube', 'layers', 'chip'];

export default function CoreCapabilities({ selected, onSelect }: {
  selected: HotspotId | null;
  onSelect: (id: HotspotId) => void;
}) {
  const { t } = useI18n();
  const copy = t.product3d;
  return (
    <section id="structure" className="section product-core-design" aria-labelledby="core-design-title">
      <div className="container">
        <div className="section-heading core-design-heading">
          <h2 id="core-design-title">{copy.capabilities.title}</h2>
          <p>{copy.structure.intro}</p>
        </div>
        <div id="capabilities" className="product-component-list" role="group" aria-label={copy.structure.select}>
          {modelHotspots.map((point, index) => (
            <button type="button" key={point.id} data-component={point.id}
              aria-pressed={selected === point.id} aria-controls="model-hotspot-info" onClick={() => onSelect(point.id)}>
              <Icon name={icons[index]} size={30}/>
              <span>{copy.structure.items[index].title}</span>
              <Icon name="arrow" size={18}/>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
