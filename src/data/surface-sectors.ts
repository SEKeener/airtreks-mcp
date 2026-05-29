// Known surface sector opportunities — where overland travel saves money and adds destinations

export interface SurfaceSector {
  from: string;
  to: string;
  method: string;           // "bus", "train", "ferry", "drive", "multiple"
  duration: string;         // "6hrs", "overnight", etc.
  description: string;
  savings: string;          // "Saves ~$100-300"
  addedValue: string;       // "Adds Malaysia as a destination"
  region: string;
}

export const surfaceSectors: SurfaceSector[] = [
  // Southeast Asia
  {
    from: "BKK", to: "KUL",
    method: "multiple",
    duration: "Overnight bus/train or 2hr flight on LCC ($30-60)",
    description: "Bangkok to Kuala Lumpur overland through southern Thailand and Malaysia. Or cheap AirAsia flight.",
    savings: "Saves $100-200 vs routing this as a ticketed flight leg",
    addedValue: "Adds Malaysia. Stop in Penang, KL, or Langkawi.",
    region: "asia",
  },
  {
    from: "BKK", to: "SIN",
    method: "multiple",
    duration: "2-3 days overland or 2.5hr LCC flight ($50-80)",
    description: "Bangkok to Singapore through Malaysia. Train, bus, or ultra-cheap LCC.",
    savings: "Saves $100-250",
    addedValue: "Adds Malaysia and possibly Penang, KL, Melaka.",
    region: "asia",
  },
  {
    from: "BKK", to: "CMB",
    method: "multiple",
    duration: "Fly AirAsia BKK-KUL ($40-60) + AirAsia KUL-CMB ($60-100), or direct UL/FD",
    description: "No premium direct BKK-CMB. Best budget: cheap LCC via KUL. Best full-service: UL SriLankan direct.",
    savings: "LCC via KUL saves ~$100-250 vs full-service direct",
    addedValue: "Adding KUL stop gives you Malaysia. Or fly direct UL if time matters.",
    region: "asia",
  },
  {
    from: "BKK", to: "SGN",
    method: "bus",
    duration: "12-14hrs direct bus or fly LCC ($40-70)",
    description: "Bangkok to Ho Chi Minh City via Cambodia or direct.",
    savings: "Saves $50-150",
    addedValue: "Can stop in Siem Reap (Angkor Wat) or Phnom Penh en route.",
    region: "asia",
  },
  {
    from: "HAN", to: "SGN",
    method: "train",
    duration: "30hrs Reunification Express or 2hr LCC flight ($30-50)",
    description: "Hanoi to Ho Chi Minh City. The Reunification Express train is a classic Vietnam experience.",
    savings: "Saves $50-100",
    addedValue: "Stop in Hue, Hoi An, Da Nang. The train itself is the experience.",
    region: "asia",
  },
  {
    from: "SIN", to: "KUL",
    method: "bus",
    duration: "5-6hrs by bus or 1hr flight ($20-40 LCC)",
    description: "Singapore to Kuala Lumpur. Easy bus or ultra-cheap flight.",
    savings: "Saves $50-100",
    addedValue: "Natural combination — most travelers do both cities.",
    region: "asia",
  },
  {
    from: "HKG", to: "MFM",
    method: "ferry",
    duration: "1hr ferry",
    description: "Hong Kong to Macau by TurboJet ferry. No flights needed.",
    savings: "Ferry is $20-30",
    addedValue: "Easy day trip or overnight. Casinos, Portuguese architecture.",
    region: "asia",
  },
  // Japan
  {
    from: "NRT", to: "KIX",
    method: "train",
    duration: "2.5hrs Shinkansen (Tokyo-Osaka)",
    description: "Tokyo to Osaka by bullet train. Faster than flying when you count airport time.",
    savings: "Shinkansen ~$100, comparable to domestic flight",
    addedValue: "JR Pass makes this free if buying one. Stop in Kyoto, Nagoya.",
    region: "asia",
  },
  // India
  {
    from: "DEL", to: "BOM",
    method: "train",
    duration: "16hrs Rajdhani Express or 2hr flight ($50-80)",
    description: "Delhi to Mumbai by train or cheap domestic flight.",
    savings: "Saves $50-150 if surface vs ticketed leg",
    addedValue: "Rajasthan stops (Jaipur, Udaipur) if overland.",
    region: "asia",
  },
  // Europe
  {
    from: "LHR", to: "CDG",
    method: "train",
    duration: "2.5hrs Eurostar",
    description: "London to Paris by Eurostar. Faster than flying.",
    savings: "Eurostar ~$60-150. Saves a flight leg.",
    addedValue: "City center to city center. No airport hassle.",
    region: "europe",
  },
  {
    from: "CDG", to: "AMS",
    method: "train",
    duration: "3.5hrs Thalys/Eurostar",
    description: "Paris to Amsterdam by high-speed train.",
    savings: "Train ~$40-100. Saves a flight leg.",
    addedValue: "Stop in Brussels or Bruges en route.",
    region: "europe",
  },
  {
    from: "BCN", to: "MAD",
    method: "train",
    duration: "2.5hrs AVE high-speed",
    description: "Barcelona to Madrid by AVE. Faster than flying.",
    savings: "AVE ~$30-80",
    addedValue: "City center to city center.",
    region: "europe",
  },
  {
    from: "FCO", to: "NAP",
    method: "train",
    duration: "1hr Frecciarossa",
    description: "Rome to Naples by high-speed train.",
    savings: "Train ~$20-40",
    addedValue: "Pompeii, Amalfi Coast from Naples.",
    region: "europe",
  },
  {
    from: "VIE", to: "BUD",
    method: "train",
    duration: "2.5hrs direct train",
    description: "Vienna to Budapest by train along the Danube.",
    savings: "Train ~$20-40",
    addedValue: "Easy Central European combination.",
    region: "europe",
  },
  {
    from: "PRG", to: "VIE",
    method: "train",
    duration: "4hrs direct train",
    description: "Prague to Vienna by train.",
    savings: "Train ~$20-40",
    addedValue: "Classic Central Europe route.",
    region: "europe",
  },
  // Oceania
  {
    from: "SYD", to: "MEL",
    method: "drive",
    duration: "9hrs coastal drive or 1.5hr flight ($50-80)",
    description: "Sydney to Melbourne. Great Ocean Road if driving.",
    savings: "Saves a flight leg if part of bigger itinerary",
    addedValue: "Great Ocean Road, coastal NSW/VIC.",
    region: "oceania",
  },
  {
    from: "AKL", to: "CHC",
    method: "drive",
    duration: "Flight recommended (1.5hrs, $40-80) — driving is 12hrs+",
    description: "Auckland to Christchurch. Inter-island ferry + drive or cheap domestic flight.",
    savings: "Saves a ticketed international leg",
    addedValue: "Drive the South Island instead of flying.",
    region: "oceania",
  },
  // South America
  {
    from: "EZE", to: "MVD",
    method: "ferry",
    duration: "2.5hrs Buquebus ferry",
    description: "Buenos Aires to Montevideo by fast ferry across the Rio de la Plata.",
    savings: "Ferry ~$40-80. Saves a flight.",
    addedValue: "Classic BA-Montevideo combo. Colonia del Sacramento stop.",
    region: "south-america",
  },
  {
    from: "CUZ", to: "LIM",
    method: "bus",
    duration: "20hrs bus or 1.5hr flight ($50-100)",
    description: "Cusco to Lima. Most people fly but overland goes through Arequipa.",
    savings: "Bus ~$20-40",
    addedValue: "Arequipa, Colca Canyon en route.",
    region: "south-america",
  },
  // Africa
  {
    from: "NBO", to: "DAR",
    method: "bus",
    duration: "8-10hrs bus or 1.5hr flight ($80-150)",
    description: "Nairobi to Dar es Salaam overland through Arusha.",
    savings: "Saves $50-100 vs flight leg",
    addedValue: "Stop in Arusha (Kilimanjaro base) or Moshi.",
    region: "africa",
  },
  {
    from: "CPT", to: "JNB",
    method: "train",
    duration: "27hrs Blue Train (luxury) or 2hr flight ($60-100)",
    description: "Cape Town to Johannesburg. The Blue Train is a bucket-list experience.",
    savings: "Blue Train is expensive ($500+). Budget: fly.",
    addedValue: "The train itself is the attraction.",
    region: "africa",
  },
  // Morocco
  {
    from: "CMN", to: "RAK",
    method: "train",
    duration: "3.5hrs train",
    description: "Casablanca to Marrakech by train.",
    savings: "Train ~$10-20",
    addedValue: "Easy Morocco combination. Fly into one, out the other.",
    region: "africa",
  },
];

// Check if a surface sector exists between two airports
export function findSurfaceSector(from: string, to: string): SurfaceSector | null {
  const f = from.toUpperCase();
  const t = to.toUpperCase();
  return (
    surfaceSectors.find((s) => s.from === f && s.to === t) ||
    surfaceSectors.find((s) => s.from === t && s.to === f) ||
    null
  );
}

// Find all surface sectors in a region
export function surfaceSectorsByRegion(region: string): SurfaceSector[] {
  return surfaceSectors.filter((s) => s.region === region.toLowerCase());
}

// Check a full route for surface sector opportunities
export function findSurfaceOpportunities(cities: string[]): { leg: number; from: string; to: string; sector: SurfaceSector }[] {
  const results: { leg: number; from: string; to: string; sector: SurfaceSector }[] = [];
  for (let i = 0; i < cities.length - 1; i++) {
    const sector = findSurfaceSector(cities[i], cities[i + 1]);
    if (sector) {
      results.push({ leg: i + 1, from: cities[i].toUpperCase(), to: cities[i + 1].toUpperCase(), sector });
    }
  }
  return results;
}
