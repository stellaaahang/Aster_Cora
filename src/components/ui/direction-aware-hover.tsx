import { useEffect, useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../../lib/utils';
import useReducedMotionPreference from '../../hooks/useReducedMotionPreference';
import '../../styles/aceternity.css';

export const DirectionAwareHover = ({
  imageUrl, children, childrenClassName, imageClassName, overlayClassName, className, imageAlt, label,
}: {
  imageUrl: string;
  children: ReactNode | string;
  childrenClassName?: string;
  imageClassName?: string;
  overlayClassName?: string;
  className?: string;
  imageAlt: string;
  label: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState('left');
  const [focused, setFocused] = useState(false);
  const [touch, setTouch] = useState(false);
  const reduced = useReducedMotionPreference();
  useEffect(() => {
    const query = matchMedia('(hover: none)');
    const update = () => setTouch(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const handleMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { width: w, height: h, left, top } = ref.current.getBoundingClientRect();
    const x = event.clientX - left - (w / 2) * (w > h ? h / w : 1);
    const y = event.clientY - top - (h / 2) * (h > w ? w / h : 1);
    const d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;
    setDirection(['top', 'right', 'bottom', 'left'][d]);
  };
  const active = focused || touch;
  return (
    <motion.div onMouseEnter={handleMouseEnter} ref={ref} tabIndex={0} role="group" aria-label={label}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} data-direction={direction}
      className={cn('md:h-96 w-60 h-60 md:w-96 bg-transparent rounded-lg overflow-hidden group/card relative', className)}>
      <AnimatePresence mode="wait">
        <motion.div className="relative h-full w-full" initial="initial"
          animate={active ? direction : 'initial'} whileHover={direction} exit="exit">
          <motion.div className={cn('group-hover/card:block hidden absolute inset-0 w-full h-full bg-black/40 z-10 transition duration-500', overlayClassName, active && 'block')}/>
          <motion.div variants={reduced ? stillImage : variants} className="h-full w-full relative bg-gray-50 dark:bg-black"
            transition={{ duration: reduced ? 0 : 0.2, ease: 'easeOut' }}>
            <img alt={imageAlt} className={cn('h-full w-full object-cover scale-[1.15]', imageClassName)}
              width="1000" height="1000" src={imageUrl} loading="lazy" decoding="async"/>
          </motion.div>
          <motion.div variants={reduced ? stillText : textVariants}
            transition={{ duration: reduced ? 0 : 0.5, ease: 'easeOut' }}
            className={cn('text-white absolute bottom-4 left-4 z-40', childrenClassName)}>
            {children}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

const variants = { initial: { x: 0 }, exit: { x: 0, y: 0 }, top: { y: 20 }, bottom: { y: -20 }, left: { x: 20 }, right: { x: -20 } };
const textVariants = {
  initial: { y: 0, x: 0, opacity: 0 }, exit: { y: 0, x: 0, opacity: 0 },
  top: { y: -20, opacity: 1 }, bottom: { y: 2, opacity: 1 },
  left: { x: -2, opacity: 1 }, right: { x: 20, opacity: 1 },
};
const stillImage = Object.fromEntries(Object.keys(variants).map(key => [key, { x: 0, y: 0 }]));
const stillText = Object.fromEntries(Object.keys(textVariants).map(key => [key, { x: 0, y: 0, opacity: key === 'initial' || key === 'exit' ? 0 : 1 }]));
