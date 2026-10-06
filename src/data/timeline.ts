// Milestones, from tasgroup.com.my/about-the-company unless noted.

export type Milestone = {
  year: string;
  code: string;
  title: string;
  text: string;
  note?: string;
};

export const TIMELINE: Milestone[] = [
  {
    year: "1978",
    code: "GNJ 1978",
    title: "Ganu Jaya on the quay",
    text: "The group begins at Penang Port. Ganu Jaya, its first licensed stevedoring company, supplies skilled dock labour.",
  },
  {
    year: "1998",
    code: "TAG 1998",
    title: "TAS Agency opens",
    text: "Licensed customs and shipping agent in Butterworth, serving local small and medium industries.",
  },
  {
    year: "2003",
    code: "BXB 2003",
    title: "Bexxbay Express",
    text: "The transport arm starts trucking. It now runs 20+ bonded and non-bonded trucks.",
  },
  {
    year: "2006",
    code: "TMS 2006",
    title: "TAS Maritime",
    text: "Ship agency and marine services join the group.",
    note: "Year from the MarineTraffic company directory (single source).",
  },
  {
    year: "→",
    code: "MYS NET",
    title: "Offices nationwide",
    text: "Offices open in Port Klang, KLIA and Langkawi, plus warehousing in Penang, Butterworth, Klang and KLIA.",
  },
  {
    year: "→",
    code: "SGP WHS",
    title: "Singapore",
    text: "An office and a 10,000 sq ft warehouse in Singapore, served by long-haul trucks from Malaysia.",
  },
  {
    year: "NOW",
    code: "TAS GRP",
    title: "A multimodal group",
    text: "Sea, air and land under one MTO-certified group, with an agency network reaching the Middle East and Africa.",
  },
];
