export interface Carrier {
  code: string;
  name: string;
  region: string;
}

export interface Alliance {
  name: string;
  carriers: Carrier[];
  poisonCarriers: string[]; // codes with <10% RTW bookability
}

export const starAlliance: Alliance = {
  name: "Star Alliance",
  carriers: [
    { code: "AC", name: "Air Canada", region: "Americas" },
    { code: "CM", name: "Copa", region: "Americas" },
    { code: "UA", name: "United", region: "Americas" },
    { code: "AV", name: "Avianca", region: "Americas" },
    { code: "A3", name: "Aegean", region: "Europe" },
    { code: "OS", name: "Austrian", region: "Europe" },
    { code: "SN", name: "Brussels", region: "Europe" },
    { code: "OU", name: "Croatia", region: "Europe" },
    { code: "LH", name: "Lufthansa", region: "Europe" },
    { code: "SK", name: "SAS", region: "Europe" },
    { code: "LX", name: "SWISS", region: "Europe" },
    { code: "TP", name: "TAP Portugal", region: "Europe" },
    { code: "TK", name: "Turkish", region: "Europe/ME" },
    { code: "LO", name: "LOT Polish", region: "Europe" },
    { code: "CA", name: "Air China", region: "Asia" },
    { code: "AI", name: "Air India", region: "Asia" },
    { code: "NH", name: "ANA", region: "Asia" },
    { code: "OZ", name: "Asiana", region: "Asia" },
    { code: "BR", name: "EVA Air", region: "Asia" },
    { code: "ZH", name: "Shenzhen", region: "Asia" },
    { code: "SQ", name: "Singapore", region: "Asia" },
    { code: "TG", name: "Thai", region: "Asia" },
    { code: "NZ", name: "Air New Zealand", region: "Oceania" },
    { code: "ET", name: "Ethiopian", region: "Africa" },
    { code: "MS", name: "EgyptAir", region: "Africa/ME" },
    { code: "SA", name: "South African", region: "Africa" },
  ],
  poisonCarriers: ["AI", "SA"],
};

export const oneworld: Alliance = {
  name: "oneworld",
  carriers: [
    { code: "AS", name: "Alaska", region: "Americas" },
    { code: "AA", name: "American", region: "Americas" },
    { code: "BA", name: "British Airways", region: "Europe" },
    { code: "AY", name: "Finnair", region: "Europe" },
    { code: "IB", name: "Iberia", region: "Europe" },
    { code: "CX", name: "Cathay Pacific", region: "Asia" },
    { code: "JL", name: "Japan Airlines", region: "Asia" },
    { code: "MH", name: "Malaysia", region: "Asia" },
    { code: "QF", name: "Qantas", region: "Oceania" },
    { code: "QR", name: "Qatar", region: "Middle East" },
    { code: "AT", name: "Royal Air Maroc", region: "Africa" },
    { code: "RJ", name: "Royal Jordanian", region: "Middle East" },
    { code: "UL", name: "SriLankan", region: "Asia" },
    { code: "WY", name: "Oman Air", region: "Middle East" },
  ],
  poisonCarriers: ["AI", "SA", "AT", "MH", "IB"],
};

export const allAlliances = [starAlliance, oneworld];

// LATAM left oneworld in 2020 — zero RTW availability
export const excludedCarriers = [
  { code: "LA", name: "LATAM", reason: "Left oneworld 2020. Zero RTW class availability." },
];

export function findCarrier(code: string): { carrier: Carrier; alliance: Alliance } | null {
  for (const alliance of allAlliances) {
    const carrier = alliance.carriers.find((c) => c.code === code.toUpperCase());
    if (carrier) return { carrier, alliance };
  }
  return null;
}

export function getAllianceByName(name: string): Alliance | null {
  const n = name.toLowerCase();
  if (n.includes("star")) return starAlliance;
  if (n.includes("one") || n.includes("ow")) return oneworld;
  return null;
}
