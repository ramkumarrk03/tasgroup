// Offices and contact details, from tasgroup.com.my/about-the-company.

export type Office = {
  id: string;
  name: string;
  code: string;
  hq?: boolean;
  address: string[];
  tel: string;
  telHref: string;
  timezone: string;
  coords: [number, number];
  focus: string;
};

export const EMAIL = "enquiry@tasgroup.com.my";

export const OFFICES: Office[] = [
  {
    id: "penang",
    name: "Penang",
    code: "PEN",
    hq: true,
    address: ["No. 6 & 8, Lengkok Kapal,", "Off Jalan Chain Ferry,", "12100 Butterworth, Penang"],
    tel: "+604-331 2922",
    telHref: "tel:+6043312922",
    timezone: "Asia/Kuala_Lumpur",
    coords: [100.364, 5.405],
    focus: "Head office · port operations",
  },
  {
    id: "klang",
    name: "Port Klang",
    code: "PKG",
    address: ["B-3-10, Boulevard BBT One,", "Lebuh Batu Nilam 2, Bandar Bukit Tinggi,", "41200 Klang, Selangor"],
    tel: "+603-3319 5922",
    telHref: "tel:+60333195922",
    timezone: "Asia/Kuala_Lumpur",
    coords: [101.43, 3.0],
    focus: "Forwarding · customs · warehousing",
  },
  {
    id: "klia",
    name: "KLIA",
    code: "KUL",
    address: ["Room 03, Mezzanine Floor CS1,", "Cainiao Aeropolis eWTP Hub,", "FCZ KLIA Cargo Village, 64000 Sepang"],
    tel: "+603-8703 3039",
    telHref: "tel:+60387033039",
    timezone: "Asia/Kuala_Lumpur",
    coords: [101.71, 2.745],
    focus: "Air freight · air cargo warehousing",
  },
  {
    id: "langkawi",
    name: "Langkawi",
    code: "LGK",
    address: ["No. 45, Persiaran Mutiara,", "Kelana Mas,", "07000 Kuah, Langkawi"],
    tel: "+604-966 8833",
    telHref: "tel:+6049668833",
    timezone: "Asia/Kuala_Lumpur",
    coords: [99.85, 6.32],
    focus: "Island shipping & customs agency",
  },
  {
    id: "singapore",
    name: "Singapore",
    code: "SIN",
    address: ["119 Neythal Road,", "Singapore 628605"],
    tel: "+65 9357 7822",
    telHref: "tel:+6593577822",
    timezone: "Asia/Singapore",
    coords: [103.7, 1.32],
    focus: "10,000 sq ft warehouse · long-haul trucking end point",
  },
];
