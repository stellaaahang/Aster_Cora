import { assets } from '../config/product';

/** The supplied Aster lockup, framed to its existing transparent bounds. */
export default function BrandLogo({ className = '' }: { className?: string }) {
  return <svg className={`brand-logo ${className}`} viewBox="42 28 403 126" width="161" height="50" role="img" aria-label="Aster" focusable="false">
    <image href={assets.brandLogo} width="492" height="177"/>
  </svg>;
}
