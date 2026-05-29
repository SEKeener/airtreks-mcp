// Region-to-region connection intelligence — "how do you get from A to B?"
// This is the consultant heuristic layer.

export interface RegionBridge {
  from: string;
  to: string;
  carriers: BridgeCarrier[];
  notes: string;
}

export interface BridgeCarrier {
  code: string;
  name: string;
  via?: string;      // hub city if connecting
  type: string;      // "direct" | "connecting" | "lcc"
  tier: string;      // "primary" | "alternative" | "budget"
  why: string;
}

// Airport-to-region mapping for classification
export const airportRegions: Record<string, string> = {
  // Americas
  LAX: "americas", SFO: "americas", JFK: "americas", EWR: "americas", ORD: "americas",
  ATL: "americas", DFW: "americas", MIA: "americas", IAH: "americas", SEA: "americas",
  YVR: "americas", YYZ: "americas", YUL: "americas", YYC: "americas",
  MEX: "americas", CUN: "americas", GDL: "americas", PTY: "americas",
  // South America
  EZE: "south-america", GRU: "south-america", SCL: "south-america", BOG: "south-america",
  LIM: "south-america", UIO: "south-america", GIG: "south-america", MVD: "south-america",
  CUZ: "south-america", MDE: "south-america",
  // Europe
  LHR: "europe", LGW: "europe", CDG: "europe", FRA: "europe", AMS: "europe",
  FCO: "europe", MAD: "europe", BCN: "europe", MUC: "europe", ZRH: "europe",
  VIE: "europe", CPH: "europe", OSL: "europe", ARN: "europe", HEL: "europe",
  LIS: "europe", ATH: "europe", PRG: "europe", WAW: "europe", BUD: "europe",
  DUB: "europe", EDI: "europe", IST: "europe",
  // Asia
  NRT: "asia", HND: "asia", KIX: "asia", HKG: "asia", PEK: "asia", PVG: "asia",
  BKK: "asia", DMK: "asia", SIN: "asia", KUL: "asia", SGN: "asia", HAN: "asia",
  ICN: "asia", TPE: "asia", MNL: "asia", CGK: "asia", DPS: "asia",
  DEL: "asia", BOM: "asia", CCU: "asia", CMB: "asia", KTM: "asia",
  REP: "asia", RGN: "asia", VTE: "asia", PNH: "asia",
  // Oceania
  SYD: "oceania", MEL: "oceania", BNE: "oceania", PER: "oceania",
  AKL: "oceania", CHC: "oceania", NAN: "oceania", PPT: "oceania",
  // Middle East
  DXB: "middle-east", DOH: "middle-east", AUH: "middle-east", AMM: "middle-east",
  TLV: "middle-east", JED: "middle-east", RUH: "middle-east", MCT: "middle-east",
  BAH: "middle-east",
  // Africa
  JNB: "africa", CPT: "africa", NBO: "africa", DAR: "africa", ADD: "africa",
  CMN: "africa", CAI: "africa", LOS: "africa", ACC: "africa", DSS: "africa",
  ZNZ: "africa", SEZ: "africa", MRU: "africa", TNR: "africa",
  // Maldives / Indian Ocean (grouped with asia for routing)
  MLE: "asia",
};

export function getAirportRegion(code: string): string {
  return airportRegions[code.toUpperCase()] || "unknown";
}

// Region bridge data — the consultant's mental model of "how to connect X to Y"
export const regionBridges: RegionBridge[] = [
  // Americas <-> Asia (Transpacific)
  {
    from: "americas", to: "asia",
    notes: "Direct transpacific from west coast. Route east coast via LAX/SFO/YVR or via Europe.",
    carriers: [
      { code: "NH", name: "ANA", type: "direct", tier: "primary", why: "Best transpacific availability. LAX/SFO/SEA-NRT direct." },
      { code: "JL", name: "Japan Airlines", type: "direct", tier: "primary", why: "Strong LAX-NRT/HND. Great J class." },
      { code: "SQ", name: "Singapore Airlines", type: "direct", tier: "primary", why: "LAX/SFO-SIN. Premium product." },
      { code: "CX", name: "Cathay Pacific", type: "direct", tier: "primary", why: "LAX/SFO/JFK-HKG. Asia gateway." },
      { code: "KE", name: "Korean Air", type: "direct", tier: "alternative", why: "LAX/SFO/JFK-ICN. SkyTeam option." },
      { code: "BR", name: "EVA Air", type: "direct", tier: "alternative", why: "LAX/SFO-TPE. Great J class, underrated." },
      { code: "UA", name: "United", type: "direct", tier: "alternative", why: "SFO/LAX/IAH-NRT/HKG/SIN. US carrier option." },
      { code: "DL", name: "Delta", type: "direct", tier: "alternative", why: "SEA/LAX/DTW-NRT/ICN. SkyTeam." },
    ],
  },
  // Americas <-> Europe (Transatlantic)
  {
    from: "americas", to: "europe",
    notes: "Tons of competition = good fares. JFK/BOS/MIA/ORD are major gateways.",
    carriers: [
      { code: "BA", name: "British Airways", type: "direct", tier: "primary", why: "JFK/MIA/LAX-LHR. Massive transatlantic network." },
      { code: "AA", name: "American Airlines", type: "direct", tier: "primary", why: "All major US cities to LHR/MAD/CDG." },
      { code: "UA", name: "United", type: "direct", tier: "primary", why: "EWR/IAH/SFO to major European cities." },
      { code: "DL", name: "Delta", type: "direct", tier: "primary", why: "JFK/ATL/BOS to AMS/CDG/LHR. SkyTeam." },
      { code: "LH", name: "Lufthansa", type: "direct", tier: "primary", why: "FRA hub connects everywhere in Europe." },
      { code: "VS", name: "Virgin Atlantic", type: "direct", tier: "alternative", why: "Good premium product LHR-US." },
      { code: "AF", name: "Air France", type: "direct", tier: "alternative", why: "CDG hub. Good to Africa from CDG." },
      { code: "IB", name: "Iberia", type: "direct", tier: "alternative", why: "MAD hub. Good to South America." },
      { code: "TP", name: "TAP Portugal", type: "direct", tier: "alternative", why: "LIS hub. Good to Brazil/Africa." },
      { code: "TK", name: "Turkish Airlines", type: "connecting", via: "IST", tier: "alternative", why: "Often cheapest. IST connects to everywhere." },
      { code: "DY", name: "Norwegian", type: "direct", tier: "budget", why: "Budget transatlantic. Seasonal." },
    ],
  },
  // Americas <-> Oceania (Transpac South)
  {
    from: "americas", to: "oceania",
    notes: "Limited direct options. LAX/SFO are the gateways.",
    carriers: [
      { code: "QF", name: "Qantas", type: "direct", tier: "primary", why: "LAX/SFO-SYD direct. The classic route." },
      { code: "NZ", name: "Air New Zealand", type: "direct", tier: "primary", why: "LAX/SFO-AKL direct. Great product." },
      { code: "HA", name: "Hawaiian Airlines", type: "connecting", via: "HNL", tier: "alternative", why: "Via Honolulu. Adds Hawaii stopover." },
      { code: "FJ", name: "Fiji Airways", type: "connecting", via: "NAN", tier: "alternative", why: "LAX-NAN-SYD/AKL. Adds Fiji stopover." },
      { code: "LA", name: "LATAM", type: "connecting", via: "SCL", tier: "alternative", why: "LAX-SCL-SYD/AKL. Adds South America." },
      { code: "UA", name: "United", type: "direct", tier: "alternative", why: "SFO-SYD direct. Star Alliance option." },
    ],
  },
  // Americas <-> Africa
  {
    from: "americas", to: "africa",
    notes: "No real direct options. Route via Europe or Gulf. Ethiopian via ADD is usually best value.",
    carriers: [
      { code: "ET", name: "Ethiopian", type: "connecting", via: "ADD", tier: "primary", why: "Best value to Africa. ADD connects to 60+ African cities." },
      { code: "EK", name: "Emirates", type: "connecting", via: "DXB", tier: "primary", why: "JFK-DXB-NBO/JNB/CPT. Premium but more expensive." },
      { code: "TK", name: "Turkish Airlines", type: "connecting", via: "IST", tier: "primary", why: "JFK-IST-anywhere in Africa. Best value after ET." },
      { code: "BA", name: "British Airways", type: "connecting", via: "LHR", tier: "alternative", why: "Via London. BA flies to major African cities." },
      { code: "KL", name: "KLM", type: "connecting", via: "AMS", tier: "alternative", why: "AMS-Africa network is excellent. Good to West Africa." },
      { code: "AF", name: "Air France", type: "connecting", via: "CDG", tier: "alternative", why: "CDG-Africa. Strong to francophone Africa." },
    ],
  },
  // Americas <-> South America
  {
    from: "americas", to: "south-america",
    notes: "AA and LA dominate. Copa via PTY for Central/Colombia.",
    carriers: [
      { code: "AA", name: "American", type: "direct", tier: "primary", why: "MIA/DFW-EZE/GRU/SCL/BOG/LIM. Dominant." },
      { code: "LA", name: "LATAM", type: "direct", tier: "primary", why: "Best SA domestic network. MIA/JFK/LAX-SCL/GRU." },
      { code: "CM", name: "Copa", type: "connecting", via: "PTY", tier: "primary", why: "PTY hub connects all of Central/South America." },
      { code: "AV", name: "Avianca", type: "direct", tier: "alternative", why: "BOG hub. Good to Colombia/Central America." },
      { code: "UA", name: "United", type: "direct", tier: "alternative", why: "IAH/EWR-GRU/EZE/SCL/BOG." },
      { code: "DL", name: "Delta", type: "direct", tier: "alternative", why: "ATL-GRU/EZE/BOG/SCL." },
    ],
  },
  // Asia <-> Europe
  {
    from: "asia", to: "europe",
    notes: "Gulf carriers are often cheapest. Direct options exist on SQ, TG, CX, BA, LH.",
    carriers: [
      { code: "TK", name: "Turkish Airlines", type: "connecting", via: "IST", tier: "primary", why: "Cheapest Asia-Europe usually. IST connects everywhere." },
      { code: "EK", name: "Emirates", type: "connecting", via: "DXB", tier: "primary", why: "DXB-anywhere. Premium product." },
      { code: "QR", name: "Qatar Airways", type: "connecting", via: "DOH", tier: "primary", why: "DOH-BKK/SIN/HKG-LHR/CDG/FRA." },
      { code: "SQ", name: "Singapore Airlines", type: "direct", tier: "primary", why: "SIN-LHR/FRA/CDG direct. Best product." },
      { code: "TG", name: "Thai Airways", type: "direct", tier: "alternative", why: "BKK-LHR/FRA/CDG. Star Alliance." },
      { code: "CX", name: "Cathay Pacific", type: "direct", tier: "alternative", why: "HKG-LHR/CDG/AMS. Oneworld." },
      { code: "BA", name: "British Airways", type: "direct", tier: "alternative", why: "LHR-HKG/SIN/BKK/NRT. Oneworld." },
      { code: "LH", name: "Lufthansa", type: "direct", tier: "alternative", why: "FRA-NRT/HKG/SIN/BKK/DEL. Star Alliance." },
      { code: "EY", name: "Etihad", type: "connecting", via: "AUH", tier: "alternative", why: "Often cheapest Gulf option." },
      { code: "AK", name: "AirAsia X", type: "direct", tier: "budget", why: "KUL-LHR budget. Long-haul LCC." },
    ],
  },
  // Asia <-> Africa
  {
    from: "asia", to: "africa",
    notes: "No direct. Gulf bridge or Ethiopian. ET via ADD is usually cheapest.",
    carriers: [
      { code: "ET", name: "Ethiopian", type: "connecting", via: "ADD", tier: "primary", why: "ADD is the Africa gateway. BKK/DEL/HKG-ADD-anywhere in Africa." },
      { code: "EK", name: "Emirates", type: "connecting", via: "DXB", tier: "primary", why: "BKK/SIN/HKG-DXB-NBO/JNB/CPT." },
      { code: "QR", name: "Qatar Airways", type: "connecting", via: "DOH", tier: "primary", why: "BKK/SIN/HKG-DOH-NBO/JNB/DAR." },
      { code: "TK", name: "Turkish Airlines", type: "connecting", via: "IST", tier: "alternative", why: "IST-Africa network is growing fast." },
      { code: "KE", name: "Korean Air", type: "connecting", via: "ICN", tier: "alternative", why: "ICN-NBO. Seasonal but exists." },
    ],
  },
  // Asia <-> Oceania
  {
    from: "asia", to: "oceania",
    notes: "SIN is the natural hub. Lots of direct options from SE Asia to Australia.",
    carriers: [
      { code: "SQ", name: "Singapore Airlines", type: "direct", tier: "primary", why: "SIN-SYD/MEL/PER. Best product." },
      { code: "QF", name: "Qantas", type: "direct", tier: "primary", why: "SYD-SIN/HKG/NRT. Oneworld." },
      { code: "CX", name: "Cathay Pacific", type: "direct", tier: "primary", why: "HKG-SYD/MEL. Oneworld." },
      { code: "MH", name: "Malaysia Airlines", type: "direct", tier: "alternative", why: "KUL-SYD/MEL. Oneworld." },
      { code: "GA", name: "Garuda", type: "direct", tier: "alternative", why: "CGK-SYD. Indonesia specialist." },
      { code: "JQ", name: "Jetstar", type: "direct", tier: "budget", why: "Cheap SIN/BKK/DPS-SYD/MEL." },
      { code: "TR", name: "Scoot", type: "direct", tier: "budget", why: "SIN-SYD/MEL/PER budget." },
    ],
  },
  // Europe <-> Africa
  {
    from: "europe", to: "africa",
    notes: "KLM and Air France have the best Africa networks from Europe. BA/TK also strong.",
    carriers: [
      { code: "KL", name: "KLM", type: "direct", tier: "primary", why: "AMS-NBO/JNB/CPT/DAR/ACC/LOS. Best European Africa network." },
      { code: "AF", name: "Air France", type: "direct", tier: "primary", why: "CDG-everywhere in francophone Africa." },
      { code: "ET", name: "Ethiopian", type: "connecting", via: "ADD", tier: "primary", why: "Often cheapest Europe-Africa via ADD." },
      { code: "TK", name: "Turkish Airlines", type: "connecting", via: "IST", tier: "primary", why: "IST-50+ African cities. Massive and growing." },
      { code: "BA", name: "British Airways", type: "direct", tier: "alternative", why: "LHR-NBO/JNB/CPT/ACC/LOS." },
      { code: "EK", name: "Emirates", type: "connecting", via: "DXB", tier: "alternative", why: "Via Dubai. Premium." },
      { code: "RW", name: "Royal Air Maroc", type: "direct", tier: "alternative", why: "CMN hub for West Africa from Europe." },
    ],
  },
  // Europe <-> Oceania (Kangaroo Route)
  {
    from: "europe", to: "oceania",
    notes: "No nonstop. Route via SIN, HKG, DXB, or DOH. Never try direct SYD-LHR on alliance fares.",
    carriers: [
      { code: "SQ", name: "Singapore Airlines", type: "connecting", via: "SIN", tier: "primary", why: "LHR-SIN-SYD. Classic kangaroo. Best product." },
      { code: "QF", name: "Qantas", type: "connecting", via: "SIN", tier: "primary", why: "LHR-SIN-SYD on QF metal. Nonstop PER-LHR exists (17hrs)." },
      { code: "EK", name: "Emirates", type: "connecting", via: "DXB", tier: "primary", why: "LHR-DXB-SYD/MEL. Strong availability." },
      { code: "CX", name: "Cathay Pacific", type: "connecting", via: "HKG", tier: "alternative", why: "LHR-HKG-SYD/MEL. Oneworld." },
      { code: "QR", name: "Qatar Airways", type: "connecting", via: "DOH", tier: "alternative", why: "LHR-DOH-SYD/MEL/PER." },
      { code: "EY", name: "Etihad", type: "connecting", via: "AUH", tier: "alternative", why: "Often cheapest kangaroo route option." },
      { code: "TK", name: "Turkish Airlines", type: "connecting", via: "IST", tier: "budget", why: "IST is far north for kangaroo but TK fares are cheap." },
    ],
  },
  // Intra-Asia
  {
    from: "asia", to: "asia",
    notes: "LCCs dominate short-haul. Full-service for longer routes or premium. HKG, SIN, BKK are the hubs.",
    carriers: [
      { code: "AK", name: "AirAsia", type: "direct", tier: "budget", why: "Cheapest SE Asia. KUL hub." },
      { code: "FD", name: "Thai AirAsia", type: "direct", tier: "budget", why: "BKK-everywhere in SE Asia. $30-80." },
      { code: "TR", name: "Scoot", type: "direct", tier: "budget", why: "SIN hub budget option." },
      { code: "VJ", name: "VietJet", type: "direct", tier: "budget", why: "Vietnam + SE Asia regional." },
      { code: "CX", name: "Cathay Pacific", type: "direct", tier: "primary", why: "HKG hub. Premium intra-Asia." },
      { code: "SQ", name: "Singapore Airlines", type: "direct", tier: "primary", why: "SIN hub. Premium intra-Asia." },
      { code: "TG", name: "Thai Airways", type: "direct", tier: "primary", why: "BKK hub. Star Alliance." },
      { code: "MH", name: "Malaysia Airlines", type: "direct", tier: "alternative", why: "KUL hub. Oneworld." },
    ],
  },
  // Intra-Europe
  {
    from: "europe", to: "europe",
    notes: "LCCs dominate short-haul Europe. Full-service only makes sense for connections or premium.",
    carriers: [
      { code: "FR", name: "Ryanair", type: "direct", tier: "budget", why: "Cheapest. Secondary airports. Check which airport." },
      { code: "U2", name: "easyJet", type: "direct", tier: "budget", why: "Better airports than Ryanair. Good network." },
      { code: "W6", name: "Wizz Air", type: "direct", tier: "budget", why: "Central/Eastern Europe specialist." },
      { code: "VY", name: "Vueling", type: "direct", tier: "budget", why: "Spain/Med. BCN base." },
      { code: "LH", name: "Lufthansa", type: "direct", tier: "primary", why: "FRA/MUC hub. Star Alliance connections." },
      { code: "BA", name: "British Airways", type: "direct", tier: "primary", why: "LHR hub. Oneworld connections." },
      { code: "AF", name: "Air France", type: "direct", tier: "alternative", why: "CDG hub. SkyTeam connections." },
    ],
  },
  // Middle East <-> Americas
  {
    from: "middle-east", to: "americas",
    notes: "Gulf carriers fly direct to major US cities. EK and QR have the most US routes.",
    carriers: [
      { code: "EK", name: "Emirates", type: "direct", tier: "primary", why: "DXB-JFK/LAX/SFO/IAH/ORD/BOS/DFW/SEA direct." },
      { code: "QR", name: "Qatar Airways", type: "direct", tier: "primary", why: "DOH-JFK/LAX/ORD/IAH/MIA/DFW direct." },
      { code: "EY", name: "Etihad", type: "direct", tier: "alternative", why: "AUH-JFK/ORD. Fewer routes but competitive pricing." },
      { code: "TK", name: "Turkish Airlines", type: "connecting", via: "IST", tier: "alternative", why: "IST-JFK/LAX/ORD/MIA + many more. Often cheapest." },
    ],
  },
  // Oceania <-> Africa
  {
    from: "oceania", to: "africa",
    notes: "Very limited. Route via Gulf or via JNB on QF codeshare. No good direct options.",
    carriers: [
      { code: "EK", name: "Emirates", type: "connecting", via: "DXB", tier: "primary", why: "SYD-DXB-JNB/NBO/CPT. Most reliable." },
      { code: "QR", name: "Qatar Airways", type: "connecting", via: "DOH", tier: "primary", why: "SYD/MEL-DOH-Africa." },
      { code: "QF", name: "Qantas", type: "direct", tier: "alternative", why: "SYD-JNB direct (codeshare). Only direct AU-Africa option." },
      { code: "ET", name: "Ethiopian", type: "connecting", via: "ADD", tier: "alternative", why: "If routing via Asia first, ADD connects to all of Africa." },
    ],
  },
  // South America <-> Europe
  {
    from: "south-america", to: "europe",
    notes: "IB MAD hub is the gateway. TP LIS for Brazil. AF CDG for GRU.",
    carriers: [
      { code: "IB", name: "Iberia", type: "direct", tier: "primary", why: "MAD-EZE/GRU/SCL/BOG/LIM. Best SA-Europe connectivity." },
      { code: "TP", name: "TAP Portugal", type: "direct", tier: "primary", why: "LIS-GRU/EZE/REC/SSA/FOR. Strong Brazil network." },
      { code: "AF", name: "Air France", type: "direct", tier: "primary", why: "CDG-GRU/EZE/BOG. SkyTeam." },
      { code: "LA", name: "LATAM", type: "direct", tier: "primary", why: "SCL-MAD/CDG/FCO. Best from Chile/Peru." },
      { code: "BA", name: "British Airways", type: "direct", tier: "alternative", why: "LHR-GRU/EZE. Oneworld." },
      { code: "AA", name: "American", type: "connecting", via: "MIA", tier: "alternative", why: "Via Miami. Adds a US stop." },
    ],
  },
  // South America <-> Asia
  {
    from: "south-america", to: "asia",
    notes: "No direct. Route via LAX/SFO or via Gulf. Longest connections on the planet.",
    carriers: [
      { code: "LA", name: "LATAM", type: "connecting", via: "SCL", tier: "primary", why: "SCL-AKL/SYD exists, then onward. Or SCL-LAX-Asia." },
      { code: "EK", name: "Emirates", type: "connecting", via: "DXB", tier: "primary", why: "GRU-DXB-BKK/SIN/HKG. Long but one-stop." },
      { code: "QR", name: "Qatar Airways", type: "connecting", via: "DOH", tier: "primary", why: "GRU-DOH-Asia." },
      { code: "AA", name: "American", type: "connecting", via: "LAX", tier: "alternative", why: "EZE/GRU-MIA-LAX-NRT. Via US." },
      { code: "TK", name: "Turkish Airlines", type: "connecting", via: "IST", tier: "alternative", why: "GRU-IST-BKK/DEL/SIN." },
    ],
  },
];

export function findBridge(from: string, to: string): RegionBridge | null {
  const fromRegion = getAirportRegion(from);
  const toRegion = getAirportRegion(to);

  if (fromRegion === "unknown" || toRegion === "unknown") return null;

  // Try exact match first
  let bridge = regionBridges.find(
    (b) => b.from === fromRegion && b.to === toRegion
  );
  if (bridge) return bridge;

  // Try reverse
  bridge = regionBridges.find(
    (b) => b.from === toRegion && b.to === fromRegion
  );
  if (bridge) return bridge;

  // Same region
  if (fromRegion === toRegion) {
    bridge = regionBridges.find(
      (b) => b.from === fromRegion && b.to === toRegion
    );
  }

  return bridge || null;
}
