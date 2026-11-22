import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nProvider';
import { meetCoraBackground } from '../../config/home';
import useMotionVisibility from '../../hooks/useMotionVisibility';
import CoraVisual from './CoraVisual';
import Icon from '../Icon';
export default function MeetCora() {
  const { t } = useI18n(), c = t.home.meetCora;
  const { ref, running } = useMotionVisibility<HTMLElement>();
  return <section ref={ref} className="section meet-cora-section" id="meet-cora" aria-labelledby="meet-cora-title" data-section-snap data-motion={running ? 'running' : 'paused'}>
    <img className="meet-cora-stars" src={meetCoraBackground} alt="" width="1600" height="1236" loading="lazy" decoding="async"/>
    <div className="container meet-cora-layout">
    <div className="meet-cora-copy" data-section-intro><h2 id="meet-cora-title">{c.title}</h2><p className="meet-cora-subtitle">{c.subtitle}</p>
      <Link className="button primary" to="/product">{c.action}<Icon name="arrow" size={19}/></Link>
    </div><div className="meet-cora-visual"><CoraVisual smiling/></div>
  </div></section>;
}
