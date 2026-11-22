import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { featureIcons, features } from '../../config/technology';
import type { AssemblyModule, Feature } from '../../config/technology';
import Tabs from '../Tabs';
import { CompanionDemo } from './DialogueDemos';
import VoiceDemo from './VoiceDemo';
import ModuleDemo from './ModuleDemo';
import type { ModuleSelection } from './ModuleDemo';
import PhotoDemo from './PhotoDemo';
import QrDemo from './QrDemo';
import { MotionDemo } from './TaskDemos';

export interface LabHandle { open: (feature: Feature, module?: AssemblyModule) => void }

export default forwardRef<LabHandle, { initialFeature: Feature }>(function TryCora({ initialFeature }, ref) {
  const { t } = useI18n();
  const c = t.technology;
  const [active, setActive] = useState(() => features.indexOf(initialFeature));
  const [visited, setVisited] = useState<Feature[]>(() => [initialFeature]);
  const section = useRef<HTMLElement>(null);
  const [moduleSelection, setModuleSelection] = useState<ModuleSelection | null>(null);
  function select(index: number) {
    setActive(index);
    const feature = features[index];
    setVisited(previous => previous.includes(feature) ? previous : [...previous, feature]);
  }
  function focusTab(index: number) {
    document.getElementById(`try-cora-tab-${index}`)?.focus({ preventScroll: true });
  }
  useImperativeHandle(ref, () => ({
    open(feature, module) {
      if (module) setModuleSelection(previous => ({ module, revision: (previous?.revision ?? 0) + 1 }));
      const index = features.indexOf(feature);
      select(index);
      section.current?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      focusTab(index);
    },
  }));
  const feature = features[active];
  return (
    <section ref={section} id="try-cora" className="tech-section tech-lab-section" aria-labelledby="try-cora-title" data-section-snap>
      <div className="container">
        <div className="tech-section-heading">
          <div><h2 id="try-cora-title">{c.lab.title}</h2><p>{c.lab.intro}</p></div>
          <span className="tech-demo-tag">{c.lab.demo}</span>
        </div>
        <div className="tech-lab">
          <Tabs id="try-cora" className="tech-lab-tabs" label={c.lab.select} items={features.map(id => c.features[id])} icons={features.map(id => featureIcons[id])} active={active} onChange={select}/>
          <div className="tech-lab-panel" id="try-cora-panel" role="tabpanel" aria-labelledby={`try-cora-tab-${active}`} tabIndex={0}>
            <div hidden={feature !== 'companion'}><CompanionDemo active={feature === 'companion'}/></div>
            {visited.includes('qr') && <div hidden={feature !== 'qr'}><QrDemo/></div>}
            {visited.includes('voice') && <div hidden={feature !== 'voice'}><VoiceDemo active={feature === 'voice'} openPhoto={() => {
              const index = features.indexOf('photo');
              select(index);
              focusTab(index);
            }}/></div>}
            {visited.includes('modules') && <div hidden={feature !== 'modules'}><ModuleDemo selection={moduleSelection} active={feature === 'modules'}/></div>}
            {visited.includes('photo') && <div hidden={feature !== 'photo'}><PhotoDemo active={feature === 'photo'}/></div>}
            {visited.includes('motion') && <div hidden={feature !== 'motion'}><MotionDemo/></div>}
          </div>
        </div>
      </div>
    </section>
  );
});
