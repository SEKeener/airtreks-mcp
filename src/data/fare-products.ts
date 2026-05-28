export interface FareProduct {
  name: string;
  code: string;
  description: string;
  alliances: string[];
  minStops: number;
  maxStops: number;
  directionRule: string;
  typicalPriceRange: string;
  bestFor: string;
}

export const fareProducts: FareProduct[] = [
  {
    name: "Round the World",
    code: "RTW",
    description:
      "Must travel in one global direction (eastbound or westbound), crossing both the Atlantic and Pacific. Start and end at the same city.",
    alliances: ["Star Alliance", "oneworld"],
    minStops: 3,
    maxStops: 16,
    directionRule: "Must travel continuously east OR west. No backtracking across oceans.",
    typicalPriceRange: "$2,500–$8,000 economy, $6,000–$15,000 business",
    bestFor: "Classic multi-continent trips hitting 3+ regions in one direction",
  },
  {
    name: "Circle Pacific",
    code: "CP",
    description:
      "Travel around the Pacific Rim — Americas, Asia, Oceania. Does not cross the Atlantic.",
    alliances: ["Star Alliance", "oneworld"],
    minStops: 2,
    maxStops: 10,
    directionRule: "Must stay within the Pacific Rim. No transatlantic segments.",
    typicalPriceRange: "$2,000–$5,000 economy, $4,000–$10,000 business",
    bestFor: "US/Canada + Asia/Oceania combinations without Europe",
  },
  {
    name: "Circle Atlantic",
    code: "CA",
    description:
      "Travel around the Atlantic — Americas, Europe, Africa, Middle East. No transpacific segments.",
    alliances: ["Star Alliance", "oneworld"],
    minStops: 2,
    maxStops: 10,
    directionRule: "Must stay within the Atlantic basin. No transpacific segments.",
    typicalPriceRange: "$1,800–$4,500 economy",
    bestFor: "US/Canada + Europe/Africa without Asia",
  },
  {
    name: "Open Jaw",
    code: "OJ",
    description:
      "Fly into one city, out of another. One-way with a gap (surface sector) in the middle.",
    alliances: ["Any"],
    minStops: 0,
    maxStops: 5,
    directionRule: "No direction restriction. The gap between arrival and departure cities is a surface sector.",
    typicalPriceRange: "Varies widely — often cheaper than 2 one-ways",
    bestFor: "When you want to travel overland between two cities (e.g., fly into Bangkok, out of Singapore)",
  },
  {
    name: "Multi-City / Custom",
    code: "MC",
    description:
      "Custom itinerary with multiple segments. Not tied to alliance fare rules. AirTreks builds from individual fare components.",
    alliances: ["Any — mixed carrier"],
    minStops: 2,
    maxStops: 20,
    directionRule: "No restrictions. Can backtrack, zigzag, or combine regions freely.",
    typicalPriceRange: "Varies — typically $3,000–$12,000+",
    bestFor: "Complex routes that don't fit RTW/circle fare rules, 7+ stops, or mixing alliances",
  },
];

export interface FareRecommendation {
  product: FareProduct;
  confidence: "high" | "medium" | "low";
  reason: string;
  warnings: string[];
}

const REGIONS: Record<string, string[]> = {
  americas: ["US", "CA", "MX", "BR", "AR", "CL", "CO", "PE", "EC"],
  europe: ["GB", "FR", "DE", "IT", "ES", "PT", "NL", "GR", "TR", "SE", "NO", "DK", "CH", "AT", "CZ", "PL", "IE", "IS", "HR", "HU", "RO", "BG"],
  asia: ["JP", "CN", "TH", "VN", "KH", "LA", "MM", "MY", "SG", "ID", "PH", "IN", "LK", "NP", "KR", "TW", "HK", "MO"],
  oceania: ["AU", "NZ", "FJ", "PG"],
  africa: ["ZA", "KE", "TZ", "ET", "MA", "EG", "GH", "NG", "SN"],
  middleeast: ["AE", "QA", "OM", "JO", "IL", "SA", "BH", "KW"],
};

export function getRegion(countryOrCity: string): string | null {
  const u = countryOrCity.toUpperCase();
  for (const [region, codes] of Object.entries(REGIONS)) {
    if (codes.includes(u)) return region;
  }
  return null;
}

export function recommendFareProduct(cities: string[], isOneDirection: boolean): FareRecommendation[] {
  const stopCount = cities.length - 1;
  const results: FareRecommendation[] = [];

  // Always recommend custom for 7+ stops
  if (stopCount >= 7) {
    const custom = fareProducts.find((f) => f.code === "MC")!;
    results.push({
      product: custom,
      confidence: "high",
      reason: `${stopCount} stops exceeds the sweet spot for alliance fares (<6% bookability at 7+ legs). AirTreks custom fare construction recommended.`,
      warnings: [],
    });
  }

  // RTW: one direction, crosses Atlantic + Pacific
  if (isOneDirection && stopCount >= 3) {
    const rtw = fareProducts.find((f) => f.code === "RTW")!;
    results.push({
      product: rtw,
      confidence: stopCount <= 6 ? "high" : "medium",
      reason: `${stopCount} stops traveling one direction — classic RTW fare territory.`,
      warnings: stopCount >= 7 ? ["7+ legs drops bookability below 6% — consider AirTreks custom"] : [],
    });
  }

  // Open jaw for 2-city trips
  if (stopCount <= 2) {
    const oj = fareProducts.find((f) => f.code === "OJ")!;
    results.push({
      product: oj,
      confidence: "medium",
      reason: "Simple route — open jaw may be cheaper than RTW if no ocean-crossing required.",
      warnings: [],
    });
  }

  if (results.length === 0) {
    const mc = fareProducts.find((f) => f.code === "MC")!;
    results.push({
      product: mc,
      confidence: "medium",
      reason: "Route doesn't clearly match alliance fare patterns. AirTreks custom fare construction gives most flexibility.",
      warnings: [],
    });
  }

  return results;
}
