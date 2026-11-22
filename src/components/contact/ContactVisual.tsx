import { useI18n } from '../../i18n/I18nProvider';
import Image from '../Image';

/** A calm photographic counterpart to the contact form. */
export default function ContactVisual() {
  const { t } = useI18n();
  return (
    <figure className="aster-contact-visual">
      <Image className="aster-contact-artwork" src="/images/contact-earth-orbit.jpg"
        alt={t.contact.visualAlt} width={1920} height={1277} loading="eager"/>
      <figcaption><p>{t.contact.visualTitle}</p></figcaption>
    </figure>
  );
}
