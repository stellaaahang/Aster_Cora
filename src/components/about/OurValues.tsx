import { useI18n } from '../../i18n/I18nProvider';
import { valueImages } from '../../config/about';
import { LayoutGrid } from '../ui/layout-grid';

export function ValuesGallery() {
  const { t } = useI18n();
  const c = t.about.valuePage;
  return <LayoutGrid label={c.title} closeLabel={t.common.close} cards={c.items.map((item, index) => ({
    id: index + 1, title: item.title, text: item.text, alt: item.image, thumbnail: valueImages[index],
    className: index === 0 || index === 3 ? 'md:col-span-2' : 'md:col-span-1',
  }))}/>;
}

export default function OurValues() {
  const { t } = useI18n();
  const c = t.about.valuePage;
  return (
    <section id="values" className="about-section about-values" aria-labelledby="about-values-title" data-section-snap>
      <div className="container">
        <header className="about-section-heading"><h2 id="about-values-title">{c.title}</h2><p>{c.intro}</p></header>
        <ValuesGallery/>
      </div>
    </section>
  );
}
