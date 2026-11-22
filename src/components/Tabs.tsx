import { useRef } from 'react';
import Icon from './Icon';
import type { IconName } from './Icon';
export default function Tabs({ id, label, items, active, onChange, className = '', icons }: { id: string; label: string; items: string[]; active: number; onChange: (index: number) => void; className?: string; icons?: IconName[] }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return <div className={`tabs ${className}`} role="tablist" aria-label={label}>{items.map((item, index) => <button key={index} ref={el => { refs.current[index] = el; }} id={`${id}-tab-${index}`} type="button" role="tab" aria-selected={index === active} aria-controls={`${id}-panel`} tabIndex={index === active ? 0 : -1} onClick={() => onChange(index)} onKeyDown={event => {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;
    event.preventDefault();
    onChange(next);
    const tab = refs.current[next], list = event.currentTarget.parentElement;
    tab?.focus({ preventScroll: true });
    // On narrow screens, bring the selected tab into view within its own strip.
    if (tab && list && list.scrollWidth > list.clientWidth) {
      const item = tab.getBoundingClientRect(), strip = list.getBoundingClientRect();
      const inset = 8;
      const offset = item.left < strip.left + inset
        ? item.left - strip.left - inset
        : Math.max(0, item.right - strip.right + inset);
      if (offset) list.scrollBy({ left: offset });
    }
  }}>{icons && <Icon name={icons[index]} size={23}/>}<span>{item}</span></button>)}</div>;
}
