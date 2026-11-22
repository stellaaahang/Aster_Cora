import { createContext, useContext, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import en from './en';
import zh from './zh';
import type { Dictionary } from './en';
export type Language = 'en' | 'zh';
const STORAGE_KEY = 'aster.language.v1';
const I18nContext = createContext<{ lang: Language; t: Dictionary; setLanguage: (lang: Language) => void } | null>(null);
function initialLanguage(): Language {
  try { return localStorage.getItem(STORAGE_KEY) === 'zh' ? 'zh' : 'en'; } catch { return 'en'; }
}
export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(initialLanguage);
  const scrollPosition = useRef<number | null>(null);
  function setLanguage(next: Language) {
    if (next === lang) return;
    scrollPosition.current = window.scrollY;
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* Language still works without storage. */ }
    setLang(next);
  }
  useLayoutEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    if (scrollPosition.current !== null) {
      const top = scrollPosition.current;
      window.scrollTo({ top, behavior: 'instant' });
      scrollPosition.current = null;
      // Restore after the translated layout is committed, including browser anchoring.
      const frame = requestAnimationFrame(() => window.scrollTo({ top, behavior: 'instant' }));
      return () => cancelAnimationFrame(frame);
    }
  }, [lang]);
  return <I18nContext value={{ lang, t: lang === 'zh' ? zh : en, setLanguage }}>{children}</I18nContext>;
}
export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('I18nProvider is required');
  return ctx;
}
