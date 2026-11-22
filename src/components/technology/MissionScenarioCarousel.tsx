import { Card, Carousel } from '../ui/apple-cards-carousel';
import { capabilityImages, capabilityQrImages } from '../../config/product';
import { assemblyView } from '../../config/technology';
import type { AssemblyModule, Feature } from '../../config/technology';
import { useI18n } from '../../i18n/I18nProvider';

const scenarios = [
  { feature: 'qr' },
  { feature: 'modules', module: 'temperature' },
  { feature: 'photo' },
  { feature: 'companion' },
] as const;

/** Aster content for Aceternity's image-led Apple Cards Carousel. */
export default function MissionScenarioCarousel({ onSelect }: { onSelect: (feature: Feature, module?: AssemblyModule) => void }) {
  const { t, lang } = useI18n();
  const copy = t.technology.scenarios;
  const images = [capabilityQrImages[lang], assemblyView('temperature'), capabilityImages.photo, capabilityImages.companion];
  return <Carousel label={copy.title} previousLabel={copy.previous} nextLabel={copy.next}
    items={scenarios.map((scenario, index) => {
      const item = copy.items[index];
      return <Card key={scenario.feature} index={index} layout closeLabel={t.common.close} card={{
        title: item.title,
        category: copy.status,
        src: images[index],
        alt: item.alt,
        content: <>
          <img src={images[index]} alt={item.alt} width={960} height={600} loading="lazy" decoding="async"
            className="mb-6 aspect-[16/10] w-full rounded-2xl object-cover"/>
          <p className="m-0 max-w-3xl text-base leading-relaxed text-[#3f5474] md:text-xl dark:text-neutral-300">{item.text}</p>
        </>,
        actionLabel: item.action,
        onAction: () => onSelect(scenario.feature, 'module' in scenario ? scenario.module : undefined),
      }}/>;
    })}/>;
}
