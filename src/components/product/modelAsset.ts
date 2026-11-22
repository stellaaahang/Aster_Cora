import { Box3, Mesh, Raycaster, Vector3 } from 'three';
import type { Object3D } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { displayNode, modelHotspots } from '../../config/coraModel';
import type { GeometryAnchor } from '../../config/coraModel';
import { modelConfig } from '../../config/product';

let cached: Promise<GLTF> | undefined;
const listeners = new Set<(progress: number) => void>();
export function loadOfficialModel(onProgress: (progress: number) => void) {
  listeners.add(onProgress);
  if (!cached) cached = new GLTFLoader().loadAsync(modelConfig.src, event => {
    const progress = event.total ? event.loaded / event.total : 0;
    listeners.forEach(listener => listener(progress));
  }).catch(error => { cached = undefined; throw error; });
  return { promise: cached, unsubscribe: () => listeners.delete(onProgress) };
}
export function prepareModel(gltf: GLTF) {
  const scene = gltf.scene.clone(true);
  const nodes = new Map<number, Object3D>();
  function map(source: Object3D, copy: Object3D) {
    const index = gltf.parser.associations.get(source)?.nodes;
    if (index !== undefined) nodes.set(index, copy);
    if (copy instanceof Mesh) { copy.castShadow = true; copy.receiveShadow = true; }
    source.children.forEach((child, i) => map(child, copy.children[i]));
  }
  map(gltf.scene, scene); scene.updateMatrixWorld(true);
  const bounds = new Box3().setFromObject(scene, true), size = bounds.getSize(new Vector3()), center = bounds.getCenter(new Vector3());
  const scale = 3.2 / Math.max(size.x, size.y, size.z);
  const normalize = (point: Vector3) => point.clone().sub(center).multiplyScalar(scale);
  const ray = new Raycaster();
  function anchor(item: GeometryAnchor) {
    const object = nodes.get(item.node);
    if (!object) throw new Error(`Missing source model node ${item.node}`);
    const box = new Box3().setFromObject(object, true), point = box.getCenter(new Vector3());
    if (item.fraction) point.copy(box.min).add(box.getSize(new Vector3()).multiply(new Vector3(...item.fraction)));
    const normal = new Vector3(...item.normal).normalize();
    ray.set(point.clone().addScaledVector(normal, 2), normal.clone().negate());
    const hit = ray.intersectObject(object, true)[0];
    if (hit) point.copy(hit.point);
    else if (normal.z > .9) point.z = box.max.z;
    else if (normal.z < -.9) point.z = box.min.z;
    else point.x = normal.x > 0 ? box.max.x : box.min.x;
    point.addScaledVector(normal, .0007);
    return {
      ...item, sourcePosition: point, position: normalize(point), normal,
      center: normalize(box.getCenter(new Vector3())),
      size: box.getSize(new Vector3()).multiplyScalar(scale),
    };
  }
  const hotspots = modelHotspots.map(item => ({ ...anchor(item), id: item.id, opposite: item.opposite ? anchor(item.opposite) : undefined }));
  const display = nodes.get(displayNode);
  if (!display) throw new Error('Display geometry missing');
  const screen = new Box3().setFromObject(display, true);
  return { scene, nodes, bounds, center, scale, size: size.multiplyScalar(scale), hotspots,
    screen: { position: [screen.getCenter(new Vector3()).x, screen.getCenter(new Vector3()).y, screen.max.z + .0003] as [number, number, number], width: screen.max.x - screen.min.x - .005, height: screen.max.y - screen.min.y - .005 },
    meshes: (() => { const all: Mesh[] = []; scene.traverse(node => { if (node instanceof Mesh) all.push(node); }); return all; })(),
  };
}
export type PreparedModel = ReturnType<typeof prepareModel>;
