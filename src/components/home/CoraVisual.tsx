import { assets } from '../../config/product';
import { useI18n } from '../../i18n/I18nProvider';
import Image from '../Image';
/** Screen UI aligned to the supplied image; body and default display stay original. */
export default function CoraVisual({ smiling = false, eager = false }: { smiling?: boolean; eager?: boolean }) {
  const { t } = useI18n();
  return <div className="cora-product-media" data-face={smiling ? 'smiling' : 'neutral'}>
    <Image src={assets.homeProduct} alt={smiling ? t.home.hero.smilingAlt : t.common.imageAlt} width="1495" height="1052" loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} draggable={false}/>
    <svg className="cora-screen" viewBox="0 0 1495 1052" aria-hidden="true" focusable="false">
      <rect x="354" y="414" width="542" height="341" rx="12" fill="#0b1b2c"/>
      <path d="M357 420H612L424 752H357Z" fill="#dcefff" opacity=".035"/>
      <g className="cora-face-light">
        <g className="cora-eyes"><ellipse cx="548" cy="548" rx="21" ry="30"/><ellipse cx="706" cy="548" rx="21" ry="30"/></g>
        <path d="M550 634Q627 697 704 634" fill="none" stroke="currentColor" strokeWidth="11" strokeLinecap="round"/>
      </g>
    </svg>
  </div>;
}
