import { useEffect, useMemo, useRef } from 'react';
import type { RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { CanvasTexture, PerspectiveCamera, PMREMGenerator, Raycaster, Spherical, Vector3 } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { cameraDirections, hotspotCloseUps } from '../../config/coraModel';
import type { HotspotId, ModelCommand } from '../../config/coraModel';
import type { PreparedModel } from './modelAsset';
import { angleDelta, fitDistance } from './cameraMath';
import ScreenDisplay from './ScreenDisplay';
import type { ScreenMode } from './ScreenDisplay';

interface CameraPose {
  spherical: Spherical;
  target: Vector3;
  magnification: number;
}

export interface RigProps {
  model: PreparedModel; command: ModelCommand; selected: HotspotId | null; mode: ScreenMode;
  animate: boolean; reduced: boolean; gestures: boolean; workingLabel: string;
  markers: RefObject<(HTMLButtonElement | null)[]>;
  onCamera: (position: number[], zoom: number, target: number[], magnification: number) => void;
  onFreeView: () => void;
}
export default function ModelRig(props: RigProps) {
  const { model, command, selected, mode, animate, reduced, gestures, workingLabel, markers } = props;
  const latest = useRef(props); latest.current = props;
  const { camera, gl, size, invalidate, scene } = useThree();
  const controls = useRef<OrbitControls | null>(null);
  const initialFit = useRef(0), oldFit = useRef(0);
  const tween = useRef<{ start: number; from: CameraPose; to: CameraPose } | null>(null);
  const closeUpSize = useRef<Vector3 | null>(null);
  const projection = useMemo(() => new Vector3(), []), ray = useMemo(() => new Raycaster(), []), direction = useMemo(() => new Vector3(), []);
  const lastCamera = useRef('');
  const contactShadow = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 128;
    const context = canvas.getContext('2d')!;
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(31,55,82,.40)'); gradient.addColorStop(.55, 'rgba(31,55,82,.2)'); gradient.addColorStop(1, 'rgba(31,55,82,0)');
    context.fillStyle = gradient; context.fillRect(0, 0, 128, 128);
    return new CanvasTexture(canvas);
  }, []);
  function minimumDistance(target: Vector3) {
    return model.size.length() * .6 + target.length();
  }
  function applyPose(orbit: OrbitControls, perspective: PerspectiveCamera, pose: CameraPose) {
    orbit.target.copy(pose.target);
    orbit.minDistance = minimumDistance(pose.target);
    perspective.position.setFromSpherical(pose.spherical).add(pose.target);
    if (perspective.zoom !== pose.magnification) {
      perspective.zoom = pose.magnification;
      perspective.updateProjectionMatrix();
    }
    orbit.update();
  }
  useEffect(() => () => contactShadow.dispose(), [contactShadow]);
  useEffect(() => {
    const orbit = new OrbitControls(camera, gl.domElement); controls.current = orbit;
    orbit.enablePan = false; orbit.enableDamping = true; orbit.dampingFactor = .1;
    orbit.minPolarAngle = .012; orbit.maxPolarAngle = Math.PI - .012;
    orbit.minDistance = model.size.length() * .6; orbit.maxDistance = 30;
    const changed = () => invalidate();
    const started = () => { tween.current = null; orbit.enableDamping = !latest.current.reduced; latest.current.onFreeView(); };
    orbit.addEventListener('change', changed); orbit.addEventListener('start', started);
    const generator = new PMREMGenerator(gl), room = new RoomEnvironment();
    const environment = generator.fromScene(room, .04);
    scene.environment = environment.texture; scene.environmentIntensity = .3; room.dispose(); generator.dispose();
    gl.shadowMap.autoUpdate = false; gl.shadowMap.needsUpdate = true;
    return () => {
      orbit.removeEventListener('change', changed); orbit.removeEventListener('start', started); orbit.dispose(); controls.current = null;
      scene.environment = null; environment.dispose();
    };
  }, [camera, gl, model, scene, invalidate]);
  useEffect(() => {
    if (!controls.current) return;
    controls.current.enabled = gestures;
    gl.domElement.style.touchAction = gestures ? 'none' : 'pan-y';
  }, [gestures, gl]);
  useEffect(() => {
    const orbit = controls.current; if (!orbit || !(camera instanceof PerspectiveCamera)) return;
    const pending = tween.current?.to;
    tween.current = null;
    const target = pending?.target ?? orbit.target.clone();
    const offset = pending ? new Vector3().setFromSpherical(pending.spherical) : camera.position.clone().sub(target);
    const direction = oldFit.current ? offset.clone().normalize() : new Vector3(...cameraDirections.reset).normalize();
    const aspect = size.width / size.height;
    const nextFit = Math.max(minimumDistance(target), fitDistance(model.size, direction, aspect, camera.fov));
    const ratio = oldFit.current ? offset.length() / oldFit.current : 1;
    const magnification = closeUpSize.current ? nextFit / fitDistance(closeUpSize.current, direction, aspect, camera.fov) : 1;
    orbit.maxDistance = nextFit * 1.65;
    applyPose(orbit, camera, { spherical: new Spherical().setFromVector3(direction.multiplyScalar(nextFit * ratio)), target, magnification });
    initialFit.current = fitDistance(model.size, new Vector3(...cameraDirections.reset), aspect, camera.fov);
    oldFit.current = nextFit; invalidate();
  }, [model, camera, size.width, size.height, invalidate]);
  useEffect(() => {
    const orbit = controls.current; if (!orbit || !(camera instanceof PerspectiveCamera)) return;
    orbit.enableDamping = false; orbit.update();
    const from: CameraPose = {
      spherical: new Spherical().setFromVector3(camera.position.clone().sub(orbit.target)),
      target: orbit.target.clone(), magnification: camera.zoom,
    };
    // Accumulate zoom steps from the pending destination when a click interrupts the animation.
    const destination = command.zoom ? tween.current?.to ?? from : from;
    const to: CameraPose = { spherical: destination.spherical.clone(), target: destination.target.clone(), magnification: destination.magnification };
    const exitCloseUp = command.zoom !== undefined && command.zoom > 1
      && (destination.magnification !== 1 || destination.target.lengthSq() > 0);
    if (command.view || exitCloseUp) {
      const closeUp = command.view && command.focus ? hotspotCloseUps[command.focus] : undefined;
      const anchor = closeUp ? model.hotspots.find(point => point.id === command.focus) : undefined;
      const direction = command.view
        ? new Vector3(...(closeUp?.direction ?? cameraDirections[command.view])).normalize()
        : new Vector3().setFromSpherical(destination.spherical).normalize();
      const aspect = size.width / size.height;
      to.target.copy(anchor?.center ?? new Vector3());
      closeUpSize.current = anchor && closeUp ? anchor.size.clone().multiplyScalar(closeUp.padding) : null;
      to.spherical.setFromVector3(direction);
      const fit = Math.max(minimumDistance(to.target), fitDistance(model.size, direction, aspect, camera.fov));
      to.spherical.radius = exitCloseUp ? Math.max(fit, initialFit.current) : fit;
      to.magnification = closeUpSize.current ? to.spherical.radius / fitDistance(closeUpSize.current, direction, aspect, camera.fov) : 1;
      oldFit.current = fit;
      orbit.maxDistance = Math.max(from.spherical.radius, to.spherical.radius * 1.65);
    } else if (command.zoom) to.spherical.radius *= command.zoom;
    else if (command.nudge) { to.spherical.theta += command.nudge[0]; to.spherical.phi += command.nudge[1]; }
    to.spherical.radius = Math.max(minimumDistance(to.target), Math.min(orbit.maxDistance, to.spherical.radius));
    to.spherical.phi = Math.max(.012, Math.min(Math.PI - .012, to.spherical.phi));
    to.spherical.theta = from.spherical.theta + angleDelta(from.spherical.theta, to.spherical.theta);
    if (reduced) { tween.current = null; applyPose(orbit, camera, to); }
    else tween.current = { start: performance.now(), from, to };
    invalidate();
  }, [command.sequence, model, camera, reduced, invalidate]);
  useFrame(() => {
    const orbit = controls.current; if (!orbit) return;
    if (tween.current && camera instanceof PerspectiveCamera) {
      const { start, from, to } = tween.current, t = Math.min(1, (performance.now() - start) / 600), eased = 1 - Math.pow(1 - t, 3);
      const lerp = (a: number, b: number) => a + (b - a) * eased;
      applyPose(orbit, camera, {
        spherical: new Spherical(lerp(from.spherical.radius, to.spherical.radius), lerp(from.spherical.phi, to.spherical.phi), lerp(from.spherical.theta, to.spherical.theta)),
        target: from.target.clone().lerp(to.target, eased),
        magnification: lerp(from.magnification, to.magnification),
      });
      if (t === 1) { tween.current = null; orbit.enableDamping = !reduced; }
      invalidate();
    }
    orbit.update();
    const magnification = camera instanceof PerspectiveCamera ? camera.zoom : 1;
    const signature = `${camera.position.toArray().map(n => n.toFixed(4)).join(',')}/${orbit.target.toArray()}/${magnification}/${size.width}/${size.height}/${selected}`;
    if (signature === lastCamera.current) return;
    lastCamera.current = signature;
    camera.updateMatrixWorld();
    latest.current.onCamera(camera.position.toArray(), Math.round(initialFit.current / camera.position.distanceTo(orbit.target) * magnification * 100), orbit.target.toArray(), magnification);
    model.scene.updateWorldMatrix(true, true);
    model.hotspots.forEach((spot, index) => {
      const button = markers.current[index]; if (!button) return;
      const anchor = spot.opposite && camera.position.x < 0 ? spot.opposite : spot;
      direction.copy(camera.position).sub(anchor.position).normalize();
      projection.copy(anchor.position).project(camera);
      let visible = direction.dot(anchor.normal) > .02 && Math.abs(projection.z) < 1 && Math.abs(projection.x) < 1 && Math.abs(projection.y) < 1;
      if (visible) {
        direction.copy(anchor.position).sub(camera.position);
        const distance = direction.length(); ray.set(camera.position, direction.normalize());
        const hit = ray.intersectObjects(model.meshes, false)[0];
        if (hit && hit.distance < distance - .003 * model.scale) visible = false;
      }
      button.hidden = !visible;
      button.dataset.preset = anchor.view;
      button.style.left = `${(projection.x * .5 + .5) * size.width}px`;
      button.style.top = `${(-projection.y * .5 + .5) * size.height}px`;
    });
  });
  return <>
    <hemisphereLight args={['#ffffff', '#b9cde5', .63]}/>
    <directionalLight position={[-3, 5, 4]} intensity={1.95} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-bias={-.0003}/>
    <directionalLight position={[5, 3, -4]} intensity={.92}/>
    <group scale={model.scale} position={model.center.clone().multiplyScalar(-model.scale)} dispose={null}>
      <primitive object={model.scene}/><ScreenDisplay model={model} mode={mode} animate={animate && !reduced} workingLabel={workingLabel}/>
    </group>
    <mesh position={[0, -model.size.y / 2 - .04, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[5.4, 4.2]}/><meshBasicMaterial map={contactShadow} transparent opacity={.68} depthWrite={false} toneMapped={false}/></mesh>
  </>;
}
