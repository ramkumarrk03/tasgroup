// Demo-only estimate logic for the Quote Calculator.
// It returns a relative cost BAND and an indicative transit window computed from
// distance. It never returns a currency amount; outputs are clearly labelled as a demo.

import { PORT_BY_ID, type Mode, type LonLat } from "./ports";

export type CargoType = "fcl" | "lcl" | "general" | "dg" | "project";

export const CARGO_TYPES: { id: CargoType; label: string; hint: string; modes: Mode[] }[] = [
  { id: "fcl", label: "FCL", hint: "Full container load", modes: ["ocean", "land"] },
  { id: "lcl", label: "LCL", hint: "Shared container, by volume", modes: ["ocean"] },
  { id: "general", label: "General", hint: "Loose or palletised cargo", modes: ["ocean", "air", "land"] },
  { id: "dg", label: "Dangerous goods", hint: "IMDG / IATA classed", modes: ["ocean", "air", "land"] },
  { id: "project", label: "Project cargo", hint: "Heavy lift, out of gauge", modes: ["ocean", "land"] },
];

export const EXTRAS = [
  { id: "customs", label: "Customs clearance", hint: "Under TAS's own licence" },
  { id: "warehouse", label: "Warehousing", hint: "Bonded or non-bonded" },
  { id: "door", label: "Door-to-door", hint: "Pickup and final delivery" },
] as const;
export type ExtraId = (typeof EXTRAS)[number]["id"];

export type QuoteInput = {
  origin: string;
  destination: string;
  mode: Mode;
  cargo: CargoType;
  containers: number; // FCL
  weightKg: number;
  volumeCbm: number;
  extras: ExtraId[];
};

export type QuoteResult = {
  ref: string;
  distanceKm: number;
  chargeable: string;
  band: number; // 1..5
  bandLabel: string;
  etaDays: [number, number];
  handling: string[];
  feasible: boolean;
  note?: string;
};

const R = 6371;
export function haversineKm(a: LonLat, b: LonLat) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLon = toRad(b[0] - a[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const BAND_LABELS = ["", "Light", "Moderate", "Standard", "Heavy", "Specialist"];
const ROUTE_FACTOR: Record<Mode, number> = { ocean: 1.3, air: 1.05, land: 1.25 };

export function estimate(input: QuoteInput): QuoteResult {
  const o = PORT_BY_ID[input.origin];
  const d = PORT_BY_ID[input.destination];
  const straight = haversineKm(o.coords, d.coords);
  const distanceKm = Math.round(straight * ROUTE_FACTOR[input.mode]);

  // Land is only offered within the peninsula, Singapore and the Karachi–Afghanistan leg.
  const landOk = (p: typeof o) => p.region === "sea" && p.id !== "langkawi";
  const landPairOk =
    (landOk(o) && landOk(d)) ||
    [o.id, d.id].sort().join() === ["afghanistan", "karachi"].sort().join();
  const feasible = input.mode !== "land" || landPairOk;

  // Chargeable quantity (demo rules of thumb)
  let units: number;
  let chargeable: string;
  if (input.cargo === "fcl") {
    units = input.containers * 12;
    chargeable = `${input.containers} × 40' container${input.containers > 1 ? "s" : ""}`;
  } else if (input.mode === "air") {
    const volW = input.volumeCbm * 167;
    const cw = Math.max(input.weightKg, volW);
    units = cw / 250;
    chargeable = `${Math.round(cw).toLocaleString("en-MY")} kg chargeable`;
  } else {
    const wm = Math.max(input.weightKg / 1000, input.volumeCbm);
    units = wm;
    chargeable = `${wm.toFixed(1)} W/M`;
  }

  const modeWeight: Record<Mode, number> = { ocean: 0.6, air: 2.4, land: 1.1 };
  let score = Math.log10(1 + units) * 1.4 + Math.log10(1 + distanceKm / 400) * modeWeight[input.mode];
  if (input.cargo === "dg") score += 0.8;
  if (input.cargo === "project") score += 1.4;
  score += input.extras.length * 0.25;
  const band = Math.max(1, Math.min(5, Math.round(score)));

  // Indicative window (demo): speed per mode + fixed handling days
  const speed: Record<Mode, number> = { ocean: 520, air: 6000, land: 550 }; // km/day
  const base: Record<Mode, number> = { ocean: 4, air: 1, land: 1 };
  const t = distanceKm / speed[input.mode] + base[input.mode];
  const lo = Math.max(1, Math.round(t));
  const hi = Math.round(t * 1.45 + (input.extras.includes("customs") ? 1 : 0) + (input.cargo === "project" ? 4 : 0));

  const handling: string[] = [];
  if (input.cargo === "dg") handling.push("DG declaration and segregation");
  if (input.cargo === "project") handling.push("Lift plan, route survey and permits");
  if (input.extras.includes("customs")) handling.push("Customs clearance under TAS licence");
  if (input.extras.includes("warehouse")) handling.push("Bonded or non-bonded storage");
  if (input.extras.includes("door")) handling.push("Pickup and final-mile delivery");
  if (handling.length === 0) handling.push("Port-to-port handling");

  const ref =
    "TAS-" +
    o.code.slice(-3) +
    d.code.slice(-3) +
    "-" +
    input.mode.slice(0, 1).toUpperCase() +
    String(Math.abs(hash(JSON.stringify(input))) % 10000).padStart(4, "0");

  return {
    ref,
    distanceKm,
    chargeable,
    band,
    bandLabel: BAND_LABELS[band],
    etaDays: [lo, Math.max(hi, lo + 1)],
    handling,
    feasible,
    note: feasible ? undefined : "Road freight runs within Peninsular Malaysia, to Singapore, and inland from Karachi. Try Ocean or Air for this route.",
  };
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}
