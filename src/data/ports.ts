// Ports and offices shown on the Trade Route Map.
// WINWIN Lines ports are taken from the port list on tasgroup.com.my/our-services.
// Coordinates are approximate port/town positions (lon, lat) for display only.

export type Region = "sea" | "isc" | "me" | "af";
export type Mode = "ocean" | "air" | "land";
export type LonLat = [number, number];

export type Port = {
  id: string;
  code: string; // UN/LOCODE-style label for display
  name: string;
  country: string;
  region: Region;
  coords: LonLat;
  kind: "office" | "port" | "inland";
  modes: Mode[];
  /** What TAS does here (kept general and factual). */
  role: string;
  /** Sea-lane waypoints from Penang so drawn routes stay on water. Excludes start and end. */
  via?: LonLat[];
  /** Land-route waypoints (for trucking / inland legs). Excludes start and end. */
  landVia?: LonLat[];
  /** Where a land route starts if not Penang. */
  landFrom?: string;
};

export const REGIONS: { id: Region; label: string; short: string }[] = [
  { id: "sea", label: "Southeast Asia", short: "SE ASIA" },
  { id: "isc", label: "Indian Subcontinent", short: "SUBCONT." },
  { id: "me", label: "Middle East", short: "MID. EAST" },
  { id: "af", label: "Africa", short: "AFRICA" },
];

export const HUB_ID = "penang";

// Shared sea-lane waypoints
const MALACCA_N: LonLat = [96.2, 6.4];
const SRI_LANKA_S: LonLat = [80.6, 5.4];
const COMORIN: LonLat = [76.6, 7.0];
const ARABIAN_SEA: LonLat = [62.0, 22.6];
const HORMUZ: LonLat = [56.6, 26.5];
const GULF_INNER: LonLat = [53.0, 26.8];
const ADEN_GULF: LonLat = [52.5, 12.9];
const BAB_EL_MANDEB: LonLat = [43.4, 12.6];
const RED_SEA_S: LonLat = [41.9, 15.2];
const RED_SEA_N: LonLat = [34.2, 27.6];
const MALACCA_MID: LonLat = [100.1, 3.6];

const WINWIN = "Container line agency for WINWIN Lines";

export const PORTS: Port[] = [
  // ── TAS offices ─────────────────────────────────────────────
  {
    id: "penang",
    code: "MYPEN",
    name: "Penang · Butterworth",
    country: "Malaysia",
    region: "sea",
    coords: [100.364, 5.405],
    kind: "office",
    modes: ["ocean", "air", "land"],
    role: "Group HQ. Stevedoring, tugs and barges, ship agency, customs clearance and bonded warehousing at Penang Port.",
  },
  {
    id: "langkawi",
    code: "MYLGK",
    name: "Langkawi",
    country: "Malaysia",
    region: "sea",
    coords: [99.85, 6.32],
    kind: "office",
    modes: ["ocean", "air"],
    role: "Office in Kuah. Shipping and customs agency for the island.",
    via: [[100.05, 5.95]],
  },
  {
    id: "klang",
    code: "MYPKG",
    name: "Port Klang",
    country: "Malaysia",
    region: "sea",
    coords: [101.39, 3.0],
    kind: "office",
    modes: ["ocean", "land"],
    role: "Office and warehousing at Malaysia's main container port. Forwarding and customs clearance.",
    via: [[100.15, 5.0], MALACCA_MID],
    landVia: [[101.08, 4.6]],
  },
  {
    id: "klia",
    code: "MYKUL",
    name: "KLIA Cargo",
    country: "Malaysia",
    region: "sea",
    coords: [101.71, 2.745],
    kind: "office",
    modes: ["air", "land"],
    role: "Air cargo office at the Cainiao Aeropolis eWTP Hub, KLIA Free Commercial Zone. Air freight and warehousing.",
    landVia: [[101.08, 4.6], [101.55, 3.1]],
  },
  {
    id: "singapore",
    code: "SGSIN",
    name: "Singapore",
    country: "Singapore",
    region: "sea",
    coords: [103.7, 1.32],
    kind: "office",
    modes: ["ocean", "air", "land"],
    role: "Office and a 10,000 sq ft warehouse. End point of the Bexxbay long-haul trucking run from Malaysia.",
    via: [[100.15, 5.0], MALACCA_MID, [102.6, 1.6]],
    landVia: [[101.08, 4.6], [101.55, 3.1], [102.25, 2.2], [103.76, 1.48]],
  },

  // ── Indian Subcontinent ─────────────────────────────────────
  { id: "chennai", code: "INMAA", name: "Chennai", country: "India", region: "isc", coords: [80.3, 13.1], kind: "port", modes: ["ocean", "air"], role: WINWIN, via: [MALACCA_N] },
  { id: "kattupalli", code: "INKAT", name: "Kattupalli", country: "India", region: "isc", coords: [80.35, 13.3], kind: "port", modes: ["ocean"], role: WINWIN, via: [MALACCA_N] },
  { id: "vizag", code: "INVTZ", name: "Visakhapatnam", country: "India", region: "isc", coords: [83.29, 17.69], kind: "port", modes: ["ocean"], role: WINWIN, via: [MALACCA_N] },
  { id: "kolkata", code: "INCCU", name: "Kolkata", country: "India", region: "isc", coords: [88.32, 22.55], kind: "port", modes: ["ocean", "air"], role: WINWIN, via: [MALACCA_N, [88.6, 20.6]] },
  { id: "chittagong", code: "BDCGP", name: "Chittagong", country: "Bangladesh", region: "isc", coords: [91.8, 22.31], kind: "port", modes: ["ocean", "air"], role: WINWIN, via: [MALACCA_N, [91.2, 20.2]] },
  { id: "tuticorin", code: "INTUT", name: "Tuticorin", country: "India", region: "isc", coords: [78.2, 8.76], kind: "port", modes: ["ocean"], role: WINWIN, via: [MALACCA_N, SRI_LANKA_S, [78.9, 7.6]] },
  { id: "cochin", code: "INCOK", name: "Cochin", country: "India", region: "isc", coords: [76.27, 9.97], kind: "port", modes: ["ocean"], role: WINWIN, via: [MALACCA_N, SRI_LANKA_S, COMORIN] },
  { id: "nhavasheva", code: "INNSA", name: "Nhava Sheva", country: "India", region: "isc", coords: [72.95, 18.95], kind: "port", modes: ["ocean", "air"], role: WINWIN, via: [MALACCA_N, SRI_LANKA_S, COMORIN, [72.3, 15.5]] },
  { id: "hazira", code: "INHZA", name: "Hazira", country: "India", region: "isc", coords: [72.63, 21.1], kind: "port", modes: ["ocean"], role: WINWIN, via: [MALACCA_N, SRI_LANKA_S, COMORIN, [71.6, 18.2]] },
  { id: "pipavav", code: "INPAV", name: "Pipavav", country: "India", region: "isc", coords: [71.51, 20.92], kind: "port", modes: ["ocean"], role: WINWIN, via: [MALACCA_N, SRI_LANKA_S, COMORIN, [71.4, 18.2]] },
  { id: "mundra", code: "INMUN", name: "Mundra", country: "India", region: "isc", coords: [69.7, 22.74], kind: "port", modes: ["ocean"], role: WINWIN, via: [MALACCA_N, SRI_LANKA_S, COMORIN, [69.6, 19.5], [68.6, 22.2]] },
  { id: "karachi", code: "PKKHI", name: "Karachi", country: "Pakistan", region: "isc", coords: [66.98, 24.84], kind: "port", modes: ["ocean", "air"], role: WINWIN, via: [MALACCA_N, SRI_LANKA_S, COMORIN, [68.0, 20.0], [66.8, 24.2]] },
  { id: "portqasim", code: "PKBQM", name: "Port Qasim", country: "Pakistan", region: "isc", coords: [67.35, 24.77], kind: "port", modes: ["ocean"], role: WINWIN, via: [MALACCA_N, SRI_LANKA_S, COMORIN, [68.0, 20.0], [67.1, 24.3]] },
  {
    id: "afghanistan",
    code: "AF·INL",
    name: "Afghanistan (inland)",
    country: "Afghanistan",
    region: "isc",
    coords: [69.17, 34.53],
    kind: "inland",
    modes: ["land"],
    role: "Inland cargo for Afghanistan, landed at Karachi under the WINWIN Lines network.",
    landFrom: "karachi",
    landVia: [[67.0, 30.2], [65.7, 31.6]],
  },

  // ── Middle East ─────────────────────────────────────────────
  { id: "sohar", code: "OMSOH", name: "Sohar", country: "Oman", region: "me", coords: [56.63, 24.5], kind: "port", modes: ["ocean"], role: WINWIN, via: [MALACCA_N, SRI_LANKA_S, COMORIN, ARABIAN_SEA, [58.0, 24.2]] },
  { id: "bandarabbas", code: "IRBND", name: "Bandar Abbas", country: "Iran", region: "me", coords: [56.06, 27.14], kind: "port", modes: ["ocean"], role: WINWIN, via: [MALACCA_N, SRI_LANKA_S, COMORIN, ARABIAN_SEA, HORMUZ] },
  { id: "jebelali", code: "AEJEA", name: "Jebel Ali", country: "UAE", region: "me", coords: [55.06, 25.01], kind: "port", modes: ["ocean", "air"], role: WINWIN, via: [MALACCA_N, SRI_LANKA_S, COMORIN, ARABIAN_SEA, HORMUZ, [55.7, 26.0]] },
  { id: "hamad", code: "QAHMD", name: "Hamad", country: "Qatar", region: "me", coords: [51.6, 25.01], kind: "port", modes: ["ocean", "air"], role: WINWIN, via: [MALACCA_N, SRI_LANKA_S, COMORIN, ARABIAN_SEA, HORMUZ, GULF_INNER, [52.1, 25.6]] },
  { id: "bahrain", code: "BHKBS", name: "Bahrain", country: "Bahrain", region: "me", coords: [50.72, 26.2], kind: "port", modes: ["ocean"], role: WINWIN, via: [MALACCA_N, SRI_LANKA_S, COMORIN, ARABIAN_SEA, HORMUZ, GULF_INNER, [51.4, 26.6]] },
  { id: "dammam", code: "SADMM", name: "Dammam", country: "Saudi Arabia", region: "me", coords: [50.2, 26.5], kind: "port", modes: ["ocean", "air"], role: WINWIN, via: [MALACCA_N, SRI_LANKA_S, COMORIN, ARABIAN_SEA, HORMUZ, GULF_INNER, [51.0, 27.0]] },
  { id: "shuaiba", code: "KWSAA", name: "Shuaiba", country: "Kuwait", region: "me", coords: [48.16, 29.03], kind: "port", modes: ["ocean"], role: WINWIN, via: [MALACCA_N, SRI_LANKA_S, COMORIN, ARABIAN_SEA, HORMUZ, GULF_INNER, [49.6, 28.3]] },
  { id: "shuwaikh", code: "KWSWK", name: "Shuwaikh", country: "Kuwait", region: "me", coords: [47.93, 29.35], kind: "port", modes: ["ocean"], role: WINWIN, via: [MALACCA_N, SRI_LANKA_S, COMORIN, ARABIAN_SEA, HORMUZ, GULF_INNER, [49.6, 28.6]] },
  { id: "aden", code: "YEADE", name: "Aden", country: "Yemen", region: "me", coords: [44.95, 12.8], kind: "port", modes: ["ocean"], role: WINWIN, via: [MALACCA_N, SRI_LANKA_S, COMORIN, ADEN_GULF] },
  { id: "hodeidah", code: "YEHOD", name: "Hodeidah", country: "Yemen", region: "me", coords: [42.93, 14.83], kind: "port", modes: ["ocean"], role: WINWIN, via: [MALACCA_N, SRI_LANKA_S, COMORIN, ADEN_GULF, BAB_EL_MANDEB] },
  { id: "jeddah", code: "SAJED", name: "Jeddah", country: "Saudi Arabia", region: "me", coords: [39.17, 21.47], kind: "port", modes: ["ocean", "air"], role: WINWIN, via: [MALACCA_N, SRI_LANKA_S, COMORIN, ADEN_GULF, BAB_EL_MANDEB, RED_SEA_S] },
  { id: "aqaba", code: "JOAQJ", name: "Aqaba", country: "Jordan", region: "me", coords: [35.0, 29.5], kind: "port", modes: ["ocean"], role: WINWIN, via: [MALACCA_N, SRI_LANKA_S, COMORIN, ADEN_GULF, BAB_EL_MANDEB, RED_SEA_S, RED_SEA_N, [34.6, 28.4]] },

  // ── Africa ──────────────────────────────────────────────────
  { id: "djibouti", code: "DJJIB", name: "Djibouti", country: "Djibouti", region: "af", coords: [43.13, 11.6], kind: "port", modes: ["ocean", "air"], role: WINWIN, via: [MALACCA_N, SRI_LANKA_S, COMORIN, ADEN_GULF, [44.5, 12.0]] },
  { id: "portsudan", code: "SDPZU", name: "Port Sudan", country: "Sudan", region: "af", coords: [37.22, 19.61], kind: "port", modes: ["ocean"], role: WINWIN, via: [MALACCA_N, SRI_LANKA_S, COMORIN, ADEN_GULF, BAB_EL_MANDEB, RED_SEA_S] },
  { id: "sokhna", code: "EGSOK", name: "Sokhna", country: "Egypt", region: "af", coords: [32.36, 29.63], kind: "port", modes: ["ocean"], role: WINWIN, via: [MALACCA_N, SRI_LANKA_S, COMORIN, ADEN_GULF, BAB_EL_MANDEB, RED_SEA_S, RED_SEA_N, [33.2, 28.6]] },
  { id: "mombasa", code: "KEMBA", name: "Mombasa", country: "Kenya", region: "af", coords: [39.66, -4.06], kind: "port", modes: ["ocean", "air"], role: WINWIN, via: [MALACCA_N, SRI_LANKA_S, [50.0, -3.2]] },
  { id: "dar", code: "TZDAR", name: "Dar es Salaam", country: "Tanzania", region: "af", coords: [39.29, -6.83], kind: "port", modes: ["ocean"], role: WINWIN, via: [MALACCA_N, SRI_LANKA_S, [50.0, -4.5], [40.2, -6.3]] },
];

export const PORT_BY_ID: Record<string, Port> = Object.fromEntries(PORTS.map((p) => [p.id, p]));

export const OFFICE_PORTS = PORTS.filter((p) => p.kind === "office");
export const NETWORK_PORTS = PORTS.filter((p) => p.kind !== "office");
