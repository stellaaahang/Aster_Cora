import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import Icon from '../components/Icon';
import { ValuesGallery } from '../components/about/OurValues';
import '../styles/aster-detail.css';

export default function Value() {
  const { t } = useI18n();
  const c = t.about.valuePage;
  return (
    <section className="aster-detail">
      <div className="container">
        <Link className="aster-back" to="/about#values"><Icon name="arrow" size={17}/>{c.back}</Link>
        <header className="aster-detail-heading"><h1>{c.title}</h1><p>{c.intro}</p></header>
        <ValuesGallery/>
      </div>
    </section>
  );
}
