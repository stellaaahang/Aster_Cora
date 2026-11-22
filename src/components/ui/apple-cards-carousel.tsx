import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from 'react';
import type { ImgHTMLAttributes, ReactElement, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { IconArrowNarrowLeft, IconArrowNarrowRight, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useOutsideClick } from '../../hooks/use-outside-click';
import useReducedMotionPreference from '../../hooks/useReducedMotionPreference';
import '../../styles/aceternity.css';

type CarouselCard = {
  src: string;
  title: string;
  category: string;
  content: ReactNode;
  alt?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({ onCardClose: () => {}, currentIndex: 0 });

/** Aceternity Apple Cards Carousel, with localized controls and native page scrolling. */
export function Carousel({ items, initialScroll = 0, label, previousLabel, nextLabel }: {
  items: ReactElement[];
  initialScroll?: number;
  label: string;
  previousLabel: string;
  nextLabel: string;
}) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const reduced = useReducedMotionPreference();

  function checkScrollability() {
    const node = carouselRef.current;
    if (!node) return;
    setCanScrollLeft(node.scrollLeft > 1);
    setCanScrollRight(node.scrollLeft < node.scrollWidth - node.clientWidth - 1);
  }
  useEffect(() => {
    const node = carouselRef.current;
    if (!node) return;
    node.scrollLeft = initialScroll;
    const observer = new ResizeObserver(checkScrollability);
    observer.observe(node);
    if (trackRef.current) observer.observe(trackRef.current);
    checkScrollability();
    return () => observer.disconnect();
  }, [initialScroll]);

  function scroll(amount: number) {
    carouselRef.current?.scrollBy({ left: amount, behavior: reduced ? 'instant' : 'smooth' });
  }
  const handleCardClose = useCallback((index: number) => {
    const node = carouselRef.current;
    const card = trackRef.current?.children[index] as HTMLElement | undefined;
    if (node && card) {
      const left = card.getBoundingClientRect().left - node.getBoundingClientRect().left + node.scrollLeft - 16;
      node.scrollTo({ left, behavior: reduced ? 'instant' : 'smooth' });
    }
    setCurrentIndex(index);
  }, [reduced]);

  return <CarouselContext value={{ onCardClose: handleCardClose, currentIndex }}>
    <div className="relative w-full" data-apple-carousel>
      <div ref={carouselRef} role="region" aria-label={label} tabIndex={0} data-carousel-track
        onScroll={checkScrollability}
        onKeyDown={event => {
          if (event.target !== event.currentTarget || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          if (event.key === 'Home' || event.key === 'End') carouselRef.current?.scrollTo({ left: event.key === 'Home' ? 0 : event.currentTarget.scrollWidth, behavior: reduced ? 'instant' : 'smooth' });
          else scroll(event.key === 'ArrowLeft' ? -300 : 300);
        }}
        className={cn('flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-10 [scrollbar-width:none] md:py-20',
          'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#286aa5]', reduced && 'scroll-auto')}>
        <div className="absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l"/>
        <div ref={trackRef} className="mx-auto flex max-w-7xl flex-row justify-start gap-4 pl-4">
          {items.map((item, index) => <motion.div key={item.key ?? index} data-carousel-item
            initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }}
            transition={{ duration: reduced ? 0 : .5, delay: reduced ? 0 : .2 * index, ease: 'easeOut' }}
            className="rounded-3xl last:pr-[5%] md:last:pr-[33%]">
            {item}
          </motion.div>)}
        </div>
      </div>
      <div className="mr-10 flex justify-end gap-2">
        <button type="button" aria-label={previousLabel} onClick={() => scroll(-300)} disabled={!canScrollLeft}
          className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50">
          <IconArrowNarrowLeft className="h-6 w-6 text-gray-500" aria-hidden="true"/>
        </button>
        <button type="button" aria-label={nextLabel} onClick={() => scroll(300)} disabled={!canScrollRight}
          className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50">
          <IconArrowNarrowRight className="h-6 w-6 text-gray-500" aria-hidden="true"/>
        </button>
      </div>
    </div>
  </CarouselContext>;
}

export function Card({ card, index, layout = false, closeLabel }: {
  card: CarouselCard;
  index: number;
  layout?: boolean;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { onCardClose } = useContext(CarouselContext);
  const reduced = useReducedMotionPreference();
  const id = useId();
  const handleClose = useCallback(() => { setOpen(false); onCardClose(index); }, [index, onCardClose]);
  useOutsideClick(containerRef, handleClose, open);

  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    const app = document.getElementById('root');
    const wasInert = app?.inert ?? false;
    document.body.style.overflow = 'hidden';
    if (app) app.inert = true;
    closeRef.current?.focus({ preventScroll: true });
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') { event.preventDefault(); handleClose(); }
      if (event.key !== 'Tab') return;
      const focusable = containerRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [tabindex="0"]');
      if (!focusable?.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      if (app) app.inert = wasInert;
      window.removeEventListener('keydown', onKeyDown);
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [open, handleClose]);

  return <>
    {createPortal(<AnimatePresence>
      {open && <div className="fixed inset-0 z-[200] h-screen overflow-auto" data-scenario-overlay>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .2 }}
          className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-lg"/>
        <motion.div ref={containerRef} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} id={`${id}-detail`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .2 }}
          layoutId={layout && !reduced ? `card-${id}` : undefined}
          className="relative z-[60] mx-auto my-10 h-fit max-w-5xl rounded-3xl bg-white p-4 font-sans md:p-10 dark:bg-neutral-900">
          <button type="button" ref={closeRef} aria-label={closeLabel} onClick={handleClose}
            className="sticky top-4 right-0 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-black dark:bg-white">
            <IconX className="h-6 w-6 text-neutral-100 dark:text-neutral-900" aria-hidden="true"/>
          </button>
          <motion.p layoutId={layout && !reduced ? `category-${id}` : undefined} className="text-base font-medium text-black dark:text-white">{card.category}</motion.p>
          <motion.h3 id={`${id}-title`} layoutId={layout && !reduced ? `title-${id}` : undefined}
            className="mt-4 text-2xl font-semibold text-neutral-700 md:text-5xl dark:text-white">{card.title}</motion.h3>
          <div className="py-10">
            {card.content}
            {card.actionLabel && <button type="button" data-scenario={index} className="button primary mt-6" onClick={() => {
              handleClose();
              requestAnimationFrame(() => card.onAction?.());
            }}>{card.actionLabel}<IconArrowNarrowRight size={20} aria-hidden="true"/></button>}
          </div>
        </motion.div>
      </div>}
    </AnimatePresence>, document.body)}
    <motion.button ref={triggerRef} type="button" aria-label={card.title} aria-haspopup="dialog" aria-expanded={open} aria-controls={`${id}-detail`}
      data-scenario-card={index} layoutId={layout && !reduced ? `card-${id}` : undefined} onClick={() => setOpen(true)}
      className="relative z-10 flex h-80 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-gray-100 md:h-[40rem] md:w-96 dark:bg-neutral-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/50 via-transparent to-transparent"/>
      <div className="relative z-40 p-8">
        <motion.p layoutId={layout && !reduced ? `category-${id}` : undefined} className="text-left font-sans text-sm font-medium text-white md:text-base">{card.category}</motion.p>
        <motion.p role="heading" aria-level={3} layoutId={layout && !reduced ? `title-${id}` : undefined}
          className="mt-2 max-w-xs text-left font-sans text-xl font-semibold text-white [text-wrap:balance] md:text-3xl">{card.title}</motion.p>
      </div>
      <BlurImage src={card.src} alt={card.alt ?? card.title} width={800} height={1200} className="absolute inset-0 z-10 object-cover"/>
    </motion.button>
  </>;
}

export function BlurImage({ src, className, alt, onLoad, ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  const [isLoading, setLoading] = useState(true);
  return <img {...rest} src={src} alt={alt ?? ''} loading="lazy" decoding="async"
    className={cn('h-full w-full transition duration-300', isLoading ? 'blur-sm' : 'blur-0', className)}
    onLoad={event => { setLoading(false); onLoad?.(event); }}/>;
}
