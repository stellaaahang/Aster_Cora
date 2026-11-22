import { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';
import { loadOfficialModel, prepareModel } from './modelAsset';
import type { PreparedModel } from './modelAsset';
import ModelRig from './ModelRig';
import type { RigProps } from './ModelRig';

export interface CoraSceneProps extends Omit<RigProps, 'model'> {
  onProgress: (value: number) => void;
  onReady: () => void;
  onError: () => void;
}
function LoadedModel(props: CoraSceneProps) {
  const [model, setModel] = useState<PreparedModel | null>(null);
  const callbacks = useRef(props); callbacks.current = props;
  const canvas = useThree(state => state.gl.domElement);
  useEffect(() => {
    let active = true;
    const lost = (event: Event) => { event.preventDefault(); callbacks.current.onError(); };
    canvas.addEventListener('webglcontextlost', lost);
    const request = loadOfficialModel(value => { if (active) callbacks.current.onProgress(value); });
    request.promise.then(gltf => {
      if (!active) return;
      setModel(prepareModel(gltf)); callbacks.current.onReady();
    }).catch(() => { if (active) callbacks.current.onError(); });
    return () => { active = false; request.unsubscribe(); canvas.removeEventListener('webglcontextlost', lost); };
  }, [canvas]);
  return model ? <ModelRig {...props} model={model}/> : null;
}
export default function CoraScene(props: CoraSceneProps) {
  // The dev-only poster exporter reads real rendered pixels. Normal visitors use a disposable framebuffer.
  const exportPoster = import.meta.env.DEV && new URLSearchParams(window.location.search).has('render-poster');
  return <Canvas shadows frameloop="demand" dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 36, near: .1, far: 100 }}
    gl={{ antialias: true, alpha: true, preserveDrawingBuffer: exportPoster }}
    onCreated={({ gl }) => { gl.outputColorSpace = SRGBColorSpace; gl.toneMapping = ACESFilmicToneMapping; gl.toneMappingExposure = 1; }}>
    <LoadedModel {...props}/>
  </Canvas>;
}
