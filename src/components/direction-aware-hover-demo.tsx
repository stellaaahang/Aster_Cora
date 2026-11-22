import { DirectionAwareHover } from './ui/direction-aware-hover';
import { useI18n } from '../i18n/I18nProvider';
import { aboutAssets } from '../config/about';

/** The supplied demo, using Aster's actual Mission / Vision content. */
export default function DirectionAwareHoverDemo({ index = 0 }: { index?: number }) {
  const { t } = useI18n();
  const item = t.about.purpose.principles[index];
  return (
    <DirectionAwareHover imageUrl={aboutAssets.purpose[index]} imageAlt={item.image} label={item.title}
      className="h-[24rem] w-full rounded-2xl bg-black md:h-[30rem] md:w-full"
      imageClassName={index === 0 ? 'object-contain scale-100 bg-black' : undefined}
      overlayClassName="bg-linear-to-t from-black/80 via-black/30 to-black/10"
      childrenClassName="right-6 bottom-6 left-6 md:right-8 md:bottom-8 md:left-8">
      <h3 className="m-0 text-3xl font-semibold text-white">{item.title}</h3>
      <p className="mt-3 mb-0 text-base leading-relaxed text-white">{item.text}</p>
    </DirectionAwareHover>
  );
}
