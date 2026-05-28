// Top 20 AirTreks routing templates — the most commonly booked RTW/multi-stop patterns

export interface RouteTemplate {
  name: string;
  direction: "eastbound" | "westbound" | "either";
  regions: string[];
  cities: string[];
  alliance: string;
  legs: number;
  bookability: string;
  notes: string;
}

export const routeTemplates: RouteTemplate[] = [
  {
    name: "Classic Eastbound RTW",
    direction: "eastbound",
    regions: ["Americas", "Europe", "Asia", "Oceania"],
    cities: ["LAX", "LHR", "BKK", "SYD", "LAX"],
    alliance: "oneworld",
    legs: 4,
    bookability: "High (4 legs)",
    notes: "The bread-and-butter RTW. Add stops in each region as desired.",
  },
  {
    name: "Classic Westbound RTW",
    direction: "westbound",
    regions: ["Americas", "Oceania", "Asia", "Europe"],
    cities: ["LAX", "SYD", "BKK", "LHR", "LAX"],
    alliance: "oneworld",
    legs: 4,
    bookability: "High (4 legs)",
    notes: "Same route reversed. Westbound often has better Pacific availability.",
  },
  {
    name: "Star Alliance World Tour",
    direction: "eastbound",
    regions: ["Americas", "Europe", "Middle East", "Asia"],
    cities: ["SFO", "FRA", "IST", "BKK", "NRT", "SFO"],
    alliance: "Star Alliance",
    legs: 5,
    bookability: "Good (5 legs)",
    notes: "TK IST hub is strong. Route NRT-SFO via NH or UA direct.",
  },
  {
    name: "Southeast Asia Explorer",
    direction: "westbound",
    regions: ["Americas", "Asia", "Europe"],
    cities: ["LAX", "NRT", "BKK", "SIN", "HKG", "LHR", "LAX"],
    alliance: "oneworld",
    legs: 6,
    bookability: "Good (6 legs)",
    notes: "Route via HKG hub for intra-Asia. CX strong HKG-LHR.",
  },
  {
    name: "South America + Europe",
    direction: "eastbound",
    regions: ["Americas", "South America", "Europe"],
    cities: ["JFK", "EZE", "MAD", "LHR", "JFK"],
    alliance: "oneworld",
    legs: 4,
    bookability: "High (4 legs)",
    notes: "AA JFK-EZE strong. IB EZE-MAD. Circle Atlantic fare may apply.",
  },
  {
    name: "Africa RTW",
    direction: "eastbound",
    regions: ["Americas", "Europe", "Africa", "Asia"],
    cities: ["JFK", "LHR", "NBO", "JNB", "BKK", "NRT", "LAX"],
    alliance: "Star Alliance",
    legs: 6,
    bookability: "Moderate (6 legs, Africa adds complexity)",
    notes: "ET strong for Africa segments. Route JNB-BKK via DOH or ADD.",
  },
  {
    name: "India + SE Asia",
    direction: "westbound",
    regions: ["Americas", "Asia"],
    cities: ["SFO", "NRT", "BKK", "DEL", "IST", "LHR", "SFO"],
    alliance: "Star Alliance",
    legs: 6,
    bookability: "Good (6 legs)",
    notes: "TK DEL-IST strong. Avoid AI for India segments (0% RTW bookability).",
  },
  {
    name: "Australia + New Zealand",
    direction: "westbound",
    regions: ["Americas", "Oceania"],
    cities: ["LAX", "AKL", "SYD", "SIN", "LHR", "LAX"],
    alliance: "Star Alliance",
    legs: 5,
    bookability: "Good (5 legs)",
    notes: "NZ LAX-AKL. SQ SYD-SIN-LHR for kangaroo. Never direct SYD-LHR.",
  },
  {
    name: "Europe Grand Tour",
    direction: "either",
    regions: ["Americas", "Europe"],
    cities: ["JFK", "LHR", "CDG", "FCO", "IST", "JFK"],
    alliance: "Star Alliance",
    legs: 5,
    bookability: "High (intra-Europe easy)",
    notes: "Circle Atlantic fare. TK IST-JFK or LH via FRA. Intra-Europe legs are cheap adds.",
  },
  {
    name: "Japan + Korea Focus",
    direction: "westbound",
    regions: ["Americas", "Asia"],
    cities: ["LAX", "NRT", "ICN", "HKG", "LHR", "LAX"],
    alliance: "oneworld",
    legs: 5,
    bookability: "Good (5 legs)",
    notes: "JL LAX-NRT. CX HKG hub. Add Taipei or Bangkok as stops.",
  },
  {
    name: "Pacific Islands + Oceania",
    direction: "westbound",
    regions: ["Americas", "Oceania", "Asia"],
    cities: ["LAX", "AKL", "SYD", "BKK", "NRT", "LAX"],
    alliance: "Star Alliance",
    legs: 5,
    bookability: "Good (5 legs)",
    notes: "NZ for Pacific. TG BKK-SYD if needed. NH NRT-LAX direct.",
  },
  {
    name: "Middle East + India",
    direction: "eastbound",
    regions: ["Americas", "Europe", "Middle East", "Asia"],
    cities: ["JFK", "LHR", "DOH", "DEL", "BKK", "NRT", "LAX"],
    alliance: "oneworld",
    legs: 6,
    bookability: "Moderate (6 legs)",
    notes: "QR DOH hub. Route QR via LHR not direct to US. BA LHR-JFK return.",
  },
  {
    name: "South Pacific Circle",
    direction: "either",
    regions: ["Americas", "Oceania", "Asia"],
    cities: ["LAX", "NRT", "SYD", "AKL", "LAX"],
    alliance: "Star Alliance",
    legs: 4,
    bookability: "High (4 legs)",
    notes: "Circle Pacific fare. NH LAX-NRT. NZ AKL-LAX.",
  },
  {
    name: "Quick RTW — 3 Stops",
    direction: "eastbound",
    regions: ["Americas", "Europe", "Asia"],
    cities: ["LAX", "LHR", "BKK", "LAX"],
    alliance: "oneworld",
    legs: 3,
    bookability: "Very High (3 legs, 91%)",
    notes: "Minimum viable RTW. 3-4 legs = 91% bookability.",
  },
  {
    name: "Central America + Europe",
    direction: "eastbound",
    regions: ["Americas", "Europe"],
    cities: ["LAX", "PTY", "BOG", "MAD", "LHR", "LAX"],
    alliance: "Star Alliance",
    legs: 5,
    bookability: "Good (5 legs)",
    notes: "CM PTY hub for Central/South America. TP or IB to Europe.",
  },
  {
    name: "Full Asia Loop",
    direction: "westbound",
    regions: ["Americas", "Asia", "Europe"],
    cities: ["SFO", "NRT", "HKG", "BKK", "SIN", "DEL", "IST", "SFO"],
    alliance: "Star Alliance",
    legs: 7,
    bookability: "Low (7 legs — consider custom)",
    notes: "7 legs drops below 6% bookability on alliance fares. AirTreks custom recommended.",
  },
  {
    name: "Morocco + Europe",
    direction: "eastbound",
    regions: ["Americas", "Africa", "Europe"],
    cities: ["JFK", "CMN", "MAD", "FCO", "JFK"],
    alliance: "oneworld",
    legs: 4,
    bookability: "Moderate (AT Royal Air Maroc is a poison carrier)",
    notes: "AT has only 4% RTW bookability. Consider IB JFK-MAD + surface to Morocco instead.",
  },
  {
    name: "Honeymoon RTW",
    direction: "eastbound",
    regions: ["Americas", "Europe", "Asia", "Oceania"],
    cities: ["LAX", "LHR", "MLE", "BKK", "SYD", "LAX"],
    alliance: "oneworld",
    legs: 5,
    bookability: "Good (5 legs)",
    notes: "Maldives (MLE) via Colombo (UL) or Doha (QR). Classic honeymoon route.",
  },
  {
    name: "Business Class RTW",
    direction: "eastbound",
    regions: ["Americas", "Europe", "Middle East", "Asia"],
    cities: ["JFK", "DOH", "BKK", "NRT", "JFK"],
    alliance: "oneworld",
    legs: 4,
    bookability: "Moderate (biz class availability is tighter)",
    notes: "QR J class DOH is strong. Route DOH via LHR not direct to US. Book early for J availability.",
  },
  {
    name: "Gap Year Special",
    direction: "westbound",
    regions: ["Americas", "Oceania", "Asia", "Europe"],
    cities: ["LAX", "AKL", "SYD", "BKK", "DEL", "IST", "LHR", "LAX"],
    alliance: "Star Alliance",
    legs: 7,
    bookability: "Low (7 legs — custom recommended)",
    notes: "Classic backpacker route but 7 legs = poor alliance bookability. AirTreks custom lets you add surface sectors freely.",
  },
];

export function searchTemplates(query: {
  regions?: string[];
  direction?: string;
  alliance?: string;
  maxLegs?: number;
}): RouteTemplate[] {
  return routeTemplates.filter((t) => {
    if (query.regions && query.regions.length > 0) {
      const tRegions = t.regions.map((r) => r.toLowerCase());
      const match = query.regions.some((r) => tRegions.some((tr) => tr.includes(r.toLowerCase())));
      if (!match) return false;
    }
    if (query.direction && query.direction !== "either" && t.direction !== "either") {
      if (t.direction !== query.direction) return false;
    }
    if (query.alliance) {
      const qa = query.alliance.toLowerCase();
      if (!t.alliance.toLowerCase().includes(qa)) return false;
    }
    if (query.maxLegs && t.legs > query.maxLegs) return false;
    return true;
  });
}
