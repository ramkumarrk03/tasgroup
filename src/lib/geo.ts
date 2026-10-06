import { geoMercator, type GeoProjection } from "d3-geo";
import type { LonLat } from "@/data/ports";

/** Main network map: Africa's east coast to the South China Sea. */
export const MAP = { w: 1200, h: 720, bounds: [[24, -15], [126, 40]] as [LonLat, LonLat] };
/** Mini map for offices: Peninsular Malaysia and Singapore. */
export const MINI = { w: 600, h: 720, bounds: [[98.6, 0.9], [104.6, 6.9]] as [LonLat, LonLat] };

export function makeProjection(cfg: { w: number; h: number; bounds: [LonLat, LonLat] }, pad = 0): GeoProjection {
  const [[x0, y0], [x1, y1]] = cfg.bounds;
  return geoMercator().fitExtent(
    [
      [pad, pad],
      [cfg.w - pad, cfg.h - pad],
    ],
    { type: "MultiPoint", coordinates: [[x0, y0], [x1, y1], [x0, y1], [x1, y0]] },
  );
}

/** Polyline through projected points, smoothed with quadratic midpoints (Chaikin-like). */
export function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  if (pts.length === 2) return `M${f(pts[0])}L${f(pts[1])}`;
  let d = `M${f(pts[0])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const m: [number, number] = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2];
    d += `Q${f(pts[i])} ${f(m)}`;
  }
  d += `L${f(pts[pts.length - 1])}`;
  return d;
}

/** Curved arc between two projected points (used for air routes). */
export function arcPath(a: [number, number], b: [number, number], bend = 0.22): string {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const c: [number, number] = [mx + dy * bend, my - dx * bend];
  return `M${f(a)}Q${f(c)} ${f(b)}`;
}

const f = (p: [number, number]) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
