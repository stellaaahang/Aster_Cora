import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';
import { useI18n } from '../i18n/I18nProvider';
export default function Image(props: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);
  const { t } = useI18n();
  return failed ? <div className={`image-error ${props.className || ''}`} role="status"><p>{t.common.imageError}</p><button onClick={() => setFailed(false)}>{t.common.imageRetry}</button></div> : <img loading="lazy" decoding="async" {...props} onError={() => setFailed(true)} />;
}
