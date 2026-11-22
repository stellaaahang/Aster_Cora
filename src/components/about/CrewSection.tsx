import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nProvider';
import { aboutAssets, crewPortraits } from '../../config/about';
import type { CrewPortrait } from '../../config/about';
import Icon from '../Icon';
import Image from '../Image';

function Portrait({ src, alt, placeholder, pixel = false }: { src?: string; alt: string; placeholder: string; pixel?: boolean }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className={`crew-portrait${pixel ? ' crew-pixel' : ''}`}>
      {src && !failed ? <img src={src} alt={alt} width={408} height={416} loading="lazy" decoding="async" onError={() => setFailed(true)}/>
        : <span className="crew-portrait-placeholder"><Icon name="people" size={37}/><span>{placeholder}</span></span>}
    </span>
  );
}

function CrewMemberCard({ portrait }: { portrait: CrewPortrait }) {
  const { t, lang } = useI18n();
  const { crew, members } = t.about;
  const member = members.find(item => item.id === portrait.memberId);
  const name = member ? lang === 'zh' ? member.chineseName : member.name : `${crew.member} ${portrait.id}`;
  const [flipped, setFlipped] = useState(false);
  const bioId = `crew-bio-${portrait.id}`;
  return (
    <li className="crew-grid-item">
      <button type="button" className="crew-card" data-crew={portrait.id} aria-pressed={flipped}
        aria-label={[name, member?.role, flipped ? crew.showPixel : crew.showProfile].filter(Boolean).join(' · ')}
        aria-describedby={flipped ? bioId : undefined} onClick={() => setFlipped(value => !value)}>
        <span className="crew-card-turn">
          <span className="crew-card-face crew-card-front" aria-hidden={flipped}>
            <Portrait src={portrait.pixel} alt={`${crew.pixel} · ${name}`} placeholder={crew.pixelPending} pixel/>
            <span className="crew-card-name">{name}</span>
            {member && <span className="crew-card-role">{member.role}</span>}
            <span className="crew-card-action">{crew.reveal}<Icon name="reset" size={15}/></span>
          </span>
          <span className="crew-card-face crew-card-back" aria-hidden={!flipped}>
            <Portrait src={portrait.photo} alt={`${crew.portrait} · ${name}`} placeholder={crew.photoPending}/>
            <span className="crew-card-name">{name}</span>
            {member && <span className="crew-card-role">{member.role}</span>}
            <span id={bioId} className="crew-card-bio">{member?.text ?? crew.profilePending}</span>
            <span className="crew-card-action">{crew.showPixel}<Icon name="reset" size={15}/></span>
          </span>
        </span>
      </button>
    </li>
  );
}

function CrewPhotoHatch() {
  const { t } = useI18n();
  const c = t.about.hatch;
  const [hatch, setHatch] = useState<'unopened' | 'open' | 'closed'>('unopened');
  const open = hatch === 'open';
  return (
    <div className="crew-hatch" aria-labelledby="crew-hatch-title" data-open={open}>
      <div className="crew-hatch-copy">
        <h3 id="crew-hatch-title">{c.title}</h3>
        {open ? <div className="crew-hatch-reveal" role="status"><strong>{c.team}</strong><p>{c.intro}</p></div> : <p>{c.prompt}</p>}
        <div className="crew-hatch-actions">
          <button className={`button ${open ? 'secondary' : 'primary'}`} type="button" aria-controls="crew-hatch-window" aria-expanded={open} onClick={() => setHatch(open ? 'closed' : 'open')}>
            {open ? c.close : c.open}<Icon name={open ? 'close' : 'arrow'} size={17}/>
          </button>
          {open && <Link to="#team" className="crew-members-link">{c.members}<Icon name="arrow" size={16}/></Link>}
        </div>
      </div>
      <div className="crew-hatch-frame" id="crew-hatch-window">
        {hatch !== 'unopened' && <div aria-hidden={!open} inert={!open}><Image className="crew-hatch-photo" src={aboutAssets.group} alt={t.common.teamAlt} width={1448} height={1086} loading="eager"/></div>}
        <div className="crew-hatch-panel crew-hatch-left" aria-hidden="true"/>
        <div className="crew-hatch-panel crew-hatch-right" aria-hidden="true"/>
        <span className="crew-hatch-handle" aria-hidden="true"><Icon name="orbit" size={24}/></span>
      </div>
    </div>
  );
}

export default function CrewSection() {
  const { t, lang } = useI18n();
  const { crew, members } = t.about;
  const needsRoster = members.some(member => !crewPortraits.some(portrait => portrait.memberId === member.id));
  return (
    <section id="team" className="about-section about-crew" aria-labelledby="crew-title" data-section-snap>
      <div className="container">
        <header className="about-section-heading"><h2 id="crew-title">{crew.title}</h2><p className="about-section-subtitle">{crew.subtitle}</p><p>{crew.intro}</p></header>
        <ul className="crew-grid">{crewPortraits.map(portrait => <CrewMemberCard key={portrait.id} portrait={portrait}/>)}</ul>
        {needsRoster && <details className="crew-roster">
          <summary>{crew.roster}<Icon name="down" size={18}/></summary>
          <dl>{members.map(member => <div key={member.id}><dt>{lang === 'zh' ? member.chineseName : member.name}<span>{member.role}</span></dt><dd>{member.text}</dd></div>)}</dl>
        </details>}
        <CrewPhotoHatch/>
      </div>
    </section>
  );
}
