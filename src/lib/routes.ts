import { PORTS, PORT_BY_ID, HUB_ID, type Mode, type Port } from "@/data/ports";
import { MAP, makeProjection, smoothPath, arcPath } from "./geo";

export type Route = {
  id: string;
  portId: string;
  mode: Mode;
  d: string;
  length: number; // approximate, in viewBox units
};

const proj = makeProjection(MAP);
/** Projected point, rounded so server and client render identical attributes. */
export const project = (c: [number, number]): [number, number] => {
  const [x, y] = proj(c) as [number, number];
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
};

const polyLen = (pts: [number, number][]) =>
  pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

export const PROJECTED: Record<string, [number, number]> = Object.fromEntries(PORTS.map((p) => [p.id, project(p.coords)]));

function build(p: Port): Route[] {
  const out: Route[] = [];
  const hub = PORT_BY_ID[HUB_ID];
  if (p.id === HUB_ID) return out;

  if (p.modes.includes("ocean")) {
    const pts = [hub.coords, ...(p.via ?? []), p.coords].map(project);
    out.push({ id: `${p.id}-ocean`, portId: p.id, mode: "ocean", d: smoothPath(pts), length: polyLen(pts) });
  }
  if (p.modes.includes("air") && p.id !== "klia") {
    const a = PROJECTED.klia;
    const b = PROJECTED[p.id];
    out.push({ id: `${p.id}-air`, portId: p.id, mode: "air", d: arcPath(a, b, p.region === "sea" ? 0.5 : 0.18), length: Math.hypot(b[0] - a[0], b[1] - a[1]) * 1.1 });
  }
  if (p.modes.includes("land")) {
    const from = PORT_BY_ID[p.landFrom ?? HUB_ID];
    const pts = [from.coords, ...(p.landVia ?? []), p.coords].map(project);
    out.push({ id: `${p.id}-land`, portId: p.id, mode: "land", d: smoothPath(pts), length: polyLen(pts) });
  }
  return out;
}

export const ROUTES: Route[] = PORTS.flatMap(build);

export const MODE_STYLE: Record<Mode, { color: string; label: string; dash?: string; width: number }> = {
  ocean: { color: "#ff5a1f", label: "Ocean", width: 1.6 },
  air: { color: "#f2c230", label: "Air", dash: "2 5", width: 1.3 },
  land: { color: "#eef1f0", label: "Land", width: 1.8 },
};
