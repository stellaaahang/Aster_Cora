import { Vector3 } from 'three';
/** Fit every actual bounds corner against both camera axes, including narrow screens. */
export function fitDistance(size: Vector3, direction: Vector3, aspect: number, fov: number) {
  const forward = direction.clone().normalize();
  const right = new Vector3().crossVectors(new Vector3(0, 1, 0), forward).normalize();
  const up = new Vector3().crossVectors(forward, right).normalize();
  const vertical = Math.tan(fov * Math.PI / 360), horizontal = vertical * Math.max(.35, aspect);
  let distance = 0;
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) {
    const corner = new Vector3(size.x * x / 2, size.y * y / 2, size.z * z / 2);
    distance = Math.max(distance, corner.dot(forward) + Math.abs(corner.dot(right)) / horizontal, corner.dot(forward) + Math.abs(corner.dot(up)) / vertical);
  }
  return distance * 1.1;
}
export function angleDelta(from: number, to: number) { return Math.atan2(Math.sin(to - from), Math.cos(to - from)); }
