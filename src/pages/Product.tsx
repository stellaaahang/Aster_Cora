import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import type { DisplayMode, HotspotId } from '../config/coraModel';
import CoraModelViewer from '../components/product/CoraModelViewer';
import type { ModelViewerHandle } from '../components/product/CoraModelViewer';
import CoreCapabilities from '../components/product/CoreCapabilities';
import { HotspotInfo, DisplayModes, MorePossibilities } from '../components/product/ProductSections';
import Icon from '../components/Icon';
import type { IconName } from '../components/Icon';
const valueIcons: IconName[] = ['orbit', 'cube', 'people'];
export default function Product() {
  const { t } = useI18n(), c = t.product3d;
  const [selected, setSelected] = useState<HotspotId | null>(null), [mode, setMode] = useState<DisplayMode | null>(null);
  const viewer = useRef<ModelViewerHandle>(null);
  return <>
    <section id="overview" className="product-overview" data-section-snap><div className="container product-overview-grid">
      <div className="product-overview-visual"><CoraModelViewer ref={viewer} selected={selected} onSelect={setSelected} mode={mode}/></div>
      <div className="product-overview-copy"><div className="product-introduction"><h1>{c.overview.title}</h1><p className="product-subtitle">{c.overview.subtitle}</p></div><div className="product-inspector"><DisplayModes active={mode} screenAwake={selected === 'display'} onChange={setMode}/><HotspotInfo selected={selected} onClose={() => setSelected(null)}/></div></div>
    </div></section>
    <CoreCapabilities selected={selected} onSelect={id => viewer.current?.hotspot(id, true)}/>
    <MorePossibilities/>
    <section id="value" className="product-finale" aria-labelledby="product-value-title" data-section-snap>
      <div className="product-value section container">
        <div className="section-heading"><h2 id="product-value-title">{c.value.title}</h2></div>
        <div className="product-value-grid">{c.value.items.map((item, i) => <article key={i}><Icon name={valueIcons[i]} size={31}/><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      </div>
      <div id="explore-technology" className="product-technology-cta section">
        <div className="container">
          <div><h2>{c.closing.title}</h2><p>{c.closing.text}</p></div>
          <Link className="button primary" to="/applications#technology">{c.closing.cta}<Icon name="arrow" size={20}/></Link>
        </div>
      </div>
    </section>
  </>;
}
