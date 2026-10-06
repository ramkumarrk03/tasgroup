// Services, credentials and group companies, from tasgroup.com.my
// (about-the-company and our-services). Wording is paraphrased.

import type { Mode } from "./ports";

export type Credential = {
  id: string;
  code: string;
  title: string;
  issuer: string;
  meaning: string;
};

export const CREDENTIALS: Credential[] = [
  {
    id: "mto",
    code: "MTO",
    title: "Multimodal Transport Operator",
    issuer: "Certified",
    meaning: "One operator, one contract for a shipment that changes from sea to road to air.",
  },
  {
    id: "ppc",
    code: "PPC",
    title: "Cargo & Stevedore Licence",
    issuer: "Penang Port Commission",
    meaning: "One of a select few companies licensed to handle cargo and supply stevedores at Penang Port.",
  },
  {
    id: "customs",
    code: "JKDM",
    title: "Customs Clearance Licence",
    issuer: "Royal Malaysian Customs",
    meaning: "TAS clears your cargo under its own licence at every port in Malaysia.",
  },
  {
    id: "shipping",
    code: "SHIP",
    title: "Shipping Licence",
    issuer: "Own licence",
    meaning: "TAS acts as shipping agent directly, with no third-party agent in between.",
  },
  {
    id: "mof",
    code: "MOF",
    title: "Bumiputera Contractor",
    issuer: "Ministry of Finance",
    meaning: "Registered to supply logistics services to Malaysian government projects.",
  },
];

export type ModeInfo = {
  id: Mode;
  label: string;
  order: string; // engine-telegraph style label
  headline: string;
  intro: string;
  services: string[];
  credentials: string[];
  offices: string[];
  steps: { title: string; text: string }[];
  image: { src: string; alt: string } | null;
};

export const MODES: ModeInfo[] = [
  {
    id: "ocean",
    label: "Ocean",
    order: "FULL AHEAD",
    headline: "From Penang to dozens of ports",
    intro:
      "Sea freight starts at Penang and Port Klang. TAS books it, clears it and moves it through its agency for WINWIN Lines, which serves India, the Middle East and East Africa.",
    services: [
      "FCL and LCL sea freight",
      "Container line agency for WINWIN Lines",
      "Dangerous goods and high-value cargo",
      "Project cargo and heavy lift, door to job site",
      "Ship agency, chartering and brokerage",
    ],
    credentials: ["Shipping licence", "MTO certified", "PPC cargo & stevedore licence"],
    offices: ["Penang (HQ)", "Port Klang", "Langkawi"],
    steps: [
      { title: "Book", text: "Booking with the line, container release and export documents." },
      { title: "Clear", text: "Customs export clearance under TAS's own licence." },
      { title: "Load", text: "TAS stevedores and lashing gangs work the cargo onto the vessel." },
      { title: "Sail", text: "Tracked to the port of discharge, with delivery onward." },
    ],
    image: { src: "/images/project-cargo.webp", alt: "Heavy-lift project cargo being lifted from a ship onto a multi-axle trailer at the quay" },
  },
  {
    id: "air",
    label: "Air",
    order: "HALF AHEAD",
    headline: "Air cargo booked from KLIA",
    intro:
      "Urgent and high-value cargo goes by air. The KLIA office sits in the Cainiao Aeropolis eWTP Hub, inside the airport's Free Commercial Zone.",
    services: [
      "Air freight, import and export",
      "Courier and hand-carry services",
      "Door-to-door delivery",
      "High-value and sensitive cargo",
      "Bonded air-cargo warehousing at KLIA",
    ],
    credentials: ["Customs clearance licence", "MTO certified"],
    offices: ["KLIA Cargo Village", "Penang (HQ)", "Singapore"],
    steps: [
      { title: "Collect", text: "Pickup from your door to the KLIA cargo terminal." },
      { title: "Clear", text: "Export clearance and airway bill." },
      { title: "Fly", text: "Booked on the next suitable flight." },
      { title: "Deliver", text: "Import clearance and delivery at the destination." },
    ],
    image: null,
  },
  {
    id: "land",
    label: "Land",
    order: "SLOW AHEAD",
    headline: "20+ trucks, Penang to Singapore",
    intro:
      "Bexxbay Express runs the group's road fleet. It handles local haulage around the ports and long-haul runs down the peninsula to Singapore.",
    services: [
      "20+ bonded and non-bonded trucks",
      "Container haulage, tippers and low-loaders",
      "Full and loose truckload to Singapore",
      "Warehousing in Penang, Butterworth, Klang, KLIA and Singapore",
      "Pick-and-pack, repacking and assembly",
    ],
    credentials: ["Bonded transport", "Customs clearance licence", "MTO certified"],
    offices: ["Penang (HQ)", "Port Klang", "Singapore"],
    steps: [
      { title: "Load", text: "Loaded at the port, warehouse or factory gate." },
      { title: "Seal", text: "Bonded seal applied and documents cleared." },
      { title: "Haul", text: "North–South run down the peninsula." },
      { title: "Hand over", text: "Delivery to the consignee or the Singapore warehouse." },
    ],
    image: { src: "/images/trucks.webp", alt: "Two TAS group trucks parked at a logistics yard" },
  },
];

export type HarbourHotspot = {
  id: string;
  label: string;
  title: string;
  items: string[];
};

export const HARBOUR_HOTSPOTS: HarbourHotspot[] = [
  {
    id: "stevedoring",
    label: "Stevedoring",
    title: "Stevedoring crews & gear",
    items: [
      "Supervisors, foremen and winchmen",
      "Tele-clerks and lashing gangs",
      "Forklifts and shore cranes",
      "Heavy-lift slings, grabbers and hoppers",
      "Licensed by the Penang Port Commission",
    ],
  },
  {
    id: "tugs",
    label: "Tugs & barges",
    title: "Tug & barge owner",
    items: [
      "TAS's own tugs and barges at Penang Port",
      "Dry bulk cargo by barge",
      "Tug and barge hire",
      "Passenger boats within the port area",
    ],
  },
  {
    id: "agency",
    label: "Ship agency",
    title: "Ship agency & brokerage",
    items: [
      "Port agency for calling vessels",
      "Ship brokerage and chartering",
      "Crew change and medical assistance",
      "Crew and passenger boat hire",
    ],
  },
  {
    id: "supplies",
    label: "Vessel services",
    title: "Vessel supply & repair",
    items: [
      "Ship chandling and vessel supplies",
      "Bunkering inside and outside port limits",
      "Ship spares delivered just in time",
      "Ship and boat repair",
      "Sludge removal",
    ],
  },
  {
    id: "survey",
    label: "Survey & equipment",
    title: "Cargo survey & equipment rental",
    items: [
      "Cargo survey",
      "Forklift rental",
      "Crane and shovel rental",
      "Customs clearance at all Malaysian ports",
    ],
  },
  {
    id: "warehouse",
    label: "Warehousing",
    title: "Bonded warehousing",
    items: [
      "Penang, Butterworth, Klang, KLIA and Singapore",
      "Bonded and non-bonded",
      "24-hour security and CCTV",
      "Pick-and-pack, repacking and assembly",
    ],
  },
];

export type Company = {
  id: string;
  name: string;
  short: string;
  reg: string;
  role: string;
  since?: string;
};

export const COMPANIES: Company[] = [
  { id: "holdings", name: "TAS Management Holdings Sdn Bhd", short: "TAS HOLDINGS", reg: "1282566-A", role: "Group holding company" },
  { id: "agency", name: "TAS Agency Sdn Bhd", short: "TAS AGENCY", reg: "474887-T", role: "Customs and shipping agency", since: "1998" },
  { id: "maritime", name: "TAS Maritime Sdn Bhd", short: "TAS MARITIME", reg: "871757-T", role: "Ship agency and marine services", since: "2006" },
  { id: "freight", name: "TAS Freight Services Sdn Bhd", short: "TAS FREIGHT", reg: "660925-A", role: "Freight forwarding, sea and air" },
  { id: "bexxbay", name: "Bexxbay Express Sdn Bhd", short: "BEXXBAY EXPRESS", reg: "913945-W", role: "Trucking and land transport", since: "2003" },
  { id: "ganujaya", name: "Ganu Jaya Sdn Bhd", short: "GANU JAYA", reg: "0043580-T", role: "Stevedoring, the 1978 origin", since: "1978" },
];
