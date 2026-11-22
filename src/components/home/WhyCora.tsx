import { Link } from 'react-router-dom';
import { assets } from '../../config/product';
import { useI18n } from '../../i18n/I18nProvider';
import Icon from '../Icon';
import Image from '../Image';

export default function WhyCora() {
  const { t } = useI18n();
  const copy = t.home.whyCora;

  return (
    <section id="possibilities" className="section why-cora-section" aria-labelledby="why-cora-title" data-section-snap>
      <div className="container why-cora-layout">
        <div className="why-cora-image">
          <Image src={assets.interior} alt={copy.imageAlt} width="1280" height="720"/>
        </div>
        <div className="why-cora-copy" data-section-intro>
          <h2 id="why-cora-title">{copy.title}</h2>
          <p>{copy.description}</p>
          <Link to="#journey" className="button primary">{copy.action}<Icon name="down" size={18}/></Link>
        </div>
      </div>
    </section>
  );
}
