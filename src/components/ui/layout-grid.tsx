import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { cn } from '../../lib/utils';
import Icon from '../Icon';
import useReducedMotionPreference from '../../hooks/useReducedMotionPreference';
import '../../styles/aceternity.css';

export type LayoutCard = { id: number; title: string; text: string; thumbnail: string; alt: string; className: string };

/** Shared-image expansion adapted from Aceternity's Layout Grid. */
export function LayoutGrid({ cards, closeLabel, label }: { cards: LayoutCard[]; closeLabel: string; label: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const active = cards.find(card => card.id === selected);
  const buttons = useRef(new Map<number, HTMLButtonElement>());
  const closeButton = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotionPreference();
  const group = useId();
  useEffect(() => { if (selected !== null) closeButton.current?.focus({ preventScroll: true }); }, [selected]);
  function close() {
    const previous = selected;
    setSelected(null);
    requestAnimationFrame(() => { if (previous !== null) buttons.current.get(previous)?.focus({ preventScroll: true }); });
  }
  const transition = { duration: reduced ? 0 : .4, ease: 'easeInOut' as const };
  return (
    <LayoutGroup id={group}>
      <div className="relative grid h-[32rem] w-full grid-cols-2 grid-rows-2 gap-3 md:h-[34rem] md:grid-cols-3 md:gap-4"
        role="group" aria-label={label} data-value-grid
        onKeyDown={event => { if (event.key === 'Escape' && active) { event.stopPropagation(); close(); } }}>
        {cards.map(card => active?.id === card.id ? <div key={card.id} className={card.className}/> : (
          <motion.button key={card.id} type="button" ref={node => { if (node) buttons.current.set(card.id, node); }}
            layoutId={`value-card-${card.id}`} transition={transition} data-value-card={card.id}
            aria-label={card.title} aria-expanded={false} disabled={!!active}
            onClick={() => setSelected(card.id)}
            className={cn('relative h-full w-full cursor-pointer overflow-hidden rounded-xl bg-slate-100 p-0 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#286aa5]', card.className)}>
            <motion.img layoutId={`value-image-${card.id}`} src={card.thumbnail} alt={card.alt} loading="lazy" decoding="async"
              width={1000} height={700} className="absolute inset-0 h-full w-full object-cover"/>
            <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent"/>
            <span className="absolute right-4 bottom-4 left-4 z-10 font-[Manrope_Variable] text-lg leading-snug font-semibold text-white md:text-2xl">{card.title}</span>
          </motion.button>
        ))}
        <AnimatePresence>
          {active && (
            <motion.div className="absolute inset-0 z-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
              <button type="button" tabIndex={-1} onClick={close} aria-label={closeLabel}
                className="absolute -inset-4 h-auto w-auto rounded-2xl bg-[#163051]/30 backdrop-blur-sm"/>
              <motion.div layoutId={`value-card-${active.id}`} transition={transition} role="region" aria-labelledby={`${group}-title`}
                className="absolute inset-0 z-30 m-auto h-[90%] w-[92%] overflow-hidden rounded-xl bg-[#163051] md:w-[78%]" data-value-expanded={active.id}>
                <motion.img layoutId={`value-image-${active.id}`} src={active.thumbnail} alt={active.alt}
                  width={1000} height={700} className="absolute inset-0 h-full w-full object-cover"/>
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-black/10"/>
                <motion.div initial={{ opacity: 0, y: reduced ? 0 : 40 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0 : .3, ease: 'easeInOut' }}
                  className="absolute right-6 bottom-6 left-6 z-40 md:right-10 md:bottom-10 md:left-10">
                  <h3 id={`${group}-title`} className="m-0 max-w-2xl text-2xl leading-tight font-semibold text-white md:text-4xl">{active.title}</h3>
                  <p className="mt-4 mb-0 max-w-2xl text-base leading-relaxed text-white">{active.text}</p>
                </motion.div>
                <button ref={closeButton} type="button" onClick={close} aria-label={closeLabel}
                  className="absolute top-4 right-4 z-50 flex size-11 items-center justify-center rounded-full border border-white/60 bg-[#163051]/70 text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  <Icon name="close" size={20}/>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
