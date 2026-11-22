import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import Icon from './Icon';
import useReveal from '../hooks/useReveal';
import IntroGate from './intro/IntroGate';
import BrandLogo from './BrandLogo';
import useHeaderTone from '../hooks/useHeaderTone';
import usePageScroll from '../hooks/usePageScroll';
const routes = ['/', '/product', '/applications', '/about'];
export default function Layout() {
  const { lang, t, setLanguage } = useI18n();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const home = location.pathname === '/';
  const lightHeader = useHeaderTone(location.pathname);
  const menuButton = useRef<HTMLButtonElement>(null);
  const navigation = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => navigation.current?.querySelector('a')?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);
  const labels = [t.nav.home, t.nav.product, t.nav.applications, t.nav.about];
  useReveal(location.pathname);
  usePageScroll();
  useEffect(() => {
    setOpen(false);
  }, [location.key]);
  useEffect(() => {
    const index = Math.max(0, routes.indexOf(location.pathname));
    const title = location.pathname === '/contact' ? t.contact.title
      : location.pathname === '/about/value' ? t.about.valuePage.title : labels[index];
    document.title = `Aster — ${title} | Cora`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.home.intro);
  }, [lang, location.pathname, labels, t]);
  function closeMenu() { setOpen(false); menuButton.current?.focus(); }
  return <IntroGate>
    <Link className="skip-link" to="#main">{t.nav.skip}</Link>
    <header className={`site-header site-header-orbital ${home ? 'is-home' : 'is-inner'} ${lightHeader || location.pathname === '/product' ? 'is-light' : ''}`}><div className="container header-inner">
      <Link to="/" aria-label="Aster" className="brand"><BrandLogo/></Link>
      <nav ref={navigation} id="primary-navigation" aria-label={t.nav.menu} className={open ? 'main-nav is-open' : 'main-nav'} onKeyDown={e => { if (e.key === 'Escape') closeMenu(); }}>{routes.map((route, i) => <NavLink key={route} to={route} end={route !== '/about'}>{labels[i]}</NavLink>)}</nav>
      <div className="header-actions"><div className="language-switch" role="group" aria-label={t.nav.language}><button lang="en" aria-pressed={lang === 'en'} onClick={() => setLanguage('en')}>EN</button><span aria-hidden="true"/><button lang="zh-CN" aria-pressed={lang === 'zh'} onClick={() => setLanguage('zh')}>中文</button></div>
      <button ref={menuButton} className="menu-button icon-button" aria-label={open ? t.nav.closeMenu : t.nav.menu} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(v => !v)}><Icon name={open ? 'close' : 'menu'}/></button></div>
    </div></header>
    {open && <button className="menu-backdrop" tabIndex={-1} aria-label={t.nav.closeMenu} onClick={closeMenu}/>}
    <main id="main" tabIndex={-1}><Outlet/></main>
    <footer className="site-footer"><div className="container"><div className="footer-main"><div><Link to="/" aria-label="Aster" className="brand"><BrandLogo/></Link><p className="footer-headline">{t.footer.line}</p><p className="muted">{t.footer.description}</p></div><nav aria-label={t.footer.line}>{routes.map((route,i) => <Link key={route} to={route}>{labels[i]}</Link>)}</nav><button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>{t.footer.top}<Icon name="arrow" style={{transform:'rotate(-90deg)'}}/></button></div><div className="footer-bottom"><span>{t.footer.copyright}</span></div></div></footer>
  </IntroGate>;
}
