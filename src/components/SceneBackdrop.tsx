/** Independent scene, readability wash and bottom fade layers. */
export default function SceneBackdrop({ src, variant }: { src: string; variant: 'product' | 'work' | 'observatory' }) {
  return <div className={`scene-backdrop scene-backdrop-${variant}`} aria-hidden="true">
    <img src={src} alt="" decoding="async"/>
    <div className="scene-soften"/>
    <div className="scene-fade"/>
  </div>;
}
