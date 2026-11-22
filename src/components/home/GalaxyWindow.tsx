import { Component, lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';
import { galaxyDrift } from '../../config/home';
const Galaxy = lazy(() => import('../effects/galaxy/Galaxy.jsx'));
class OptionalGalaxy extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed ? null : this.props.children;}
}
export default function GalaxyWindow() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const mobile = useMediaQuery('(max-width: 600px)');
  return <div className="home-galaxy-window" aria-hidden="true">
    <OptionalGalaxy><Suspense fallback={null}><Galaxy {...galaxyDrift} transparent intro={false}
      layers={mobile ? 2 : 4} opacity={1} dpr={mobile ? 1 : 1.25}
      disableAnimation={reduced} mouseInteraction={!reduced && !mobile}/></Suspense></OptionalGalaxy>
  </div>;
}
