export const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
export const MAX_TEAR_ANGLE = Math.PI / 6;
export type Point = { x: number; y: number };
export type Orientation = 'horizontal' | 'vertical';
export type TicketGeometry = {
  width: number; height: number; mainWidth: number; mainHeight: number;
  stubWidth: number; stubHeight: number; offset: Point; vertical: boolean;
  cross: number; mainPath: string; stubPath: string; bridges: Point[];
};
/** Real cutouts in both pieces form the perforation line; the media itself is never distorted. */
function paperPath(width: number, height: number, seam: 'right' | 'left', radius = 13, holes = 13) {
  const notch = 5, hole = 2.6;
  const positions = Array.from({ length: holes }, (_, i) => (i + 1) * height / (holes + 1));
  if (seam === 'right') {
    let path = `M${radius} 0H${width-notch}A${notch} ${notch} 0 0 0 ${width} ${notch}`;
    for (const y of positions) path += `V${y-hole}A${hole} ${hole} 0 0 0 ${width} ${y+hole}`;
    return path + `V${height-notch}A${notch} ${notch} 0 0 0 ${width-notch} ${height}H${radius}Q0 ${height} 0 ${height-radius}V${radius}Q0 0 ${radius} 0Z`;
  }
  let path = `M${notch} 0H${width-radius}Q${width} 0 ${width} ${radius}V${height-radius}Q${width} ${height} ${width-radius} ${height}H${notch}A${notch} ${notch} 0 0 0 0 ${height-notch}`;
  for (const y of [...positions].reverse()) path += `V${y+hole}A${hole} ${hole} 0 0 0 0 ${y-hole}`;
  return path + `V${notch}A${notch} ${notch} 0 0 0 ${notch} 0Z`;
}
export function makeTicketGeometry(width: number, height: number, stubSize: number, orientation: Orientation): TicketGeometry {
  const vertical = orientation === 'vertical';
  const cross = vertical ? width : height;
  const body = (vertical ? height : width) - stubSize;
  if (body < 40 || stubSize < 40 || cross < 40) throw new Error('Ticket pieces must be at least 40px.');
  const count = 14;
  return {
    width, height, vertical, cross,
    mainWidth: vertical ? width : body, mainHeight: vertical ? body : height,
    stubWidth: vertical ? width : stubSize, stubHeight: vertical ? stubSize : height,
    offset: vertical ? { x: 0, y: body } : { x: body, y: 0 },
    // Vertical paths use an SVG coordinate swap in the component, retaining circular holes.
    mainPath: paperPath(body, cross, 'right'), stubPath: paperPath(stubSize, cross, 'left'),
    bridges: Array.from({length:count},(_,i) => vertical ? { x:(i+.5)*cross/count,y:body } : { x:body,y:(i+.5)*cross/count }),
  };
}
/** Combine the hinge angle with outward tension, so straight pulls also feel natural. */
export function tearTarget(start: Point, current: Point, hinge: Point, sign: number, vertical: boolean, resistance: number) {
  let delta = Math.atan2(current.y-hinge.y,current.x-hinge.x) - Math.atan2(start.y-hinge.y,start.x-hinge.x);
  while (delta > Math.PI) delta -= Math.PI*2;
  while (delta < -Math.PI) delta += Math.PI*2;
  const outward = vertical ? current.y-start.y : current.x-start.x;
  const angular = delta*sign*(1-clamp(resistance,0,.9));
  const tension = Math.max(0,outward)/(92+clamp(resistance,0,.9)*150)*MAX_TEAR_ANGLE;
  return clamp(Math.max(angular,tension),0,MAX_TEAR_ANGLE+.07);
}
export function rotatePoint(point: Point, hinge: Point, angle: number, shift: Point): Point {
  const x=point.x-hinge.x,y=point.y-hinge.y;
  return { x:hinge.x+x*Math.cos(angle)-y*Math.sin(angle)+shift.x, y:hinge.y+x*Math.sin(angle)+y*Math.cos(angle)+shift.y };
}
