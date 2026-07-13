// IATA metropolitan-area codes -> the primary international airport AirTreks
// would ticket through. AI agents frequently pass metro codes (TYO, LON, NYC);
// every downstream lookup (regions, longitudes, hubs, bridges) keys on airport
// codes, so unmapped metro codes silently degrade routing output (AIR-496).
export const metroToAirport: Record<string, string> = {
  TYO: "NRT", // Tokyo
  OSA: "KIX", // Osaka
  SEL: "ICN", // Seoul
  BJS: "PEK", // Beijing
  SHA: "PVG", // Shanghai
  JKT: "CGK", // Jakarta
  LON: "LHR", // London
  PAR: "CDG", // Paris
  ROM: "FCO", // Rome
  MIL: "MXP", // Milan
  STO: "ARN", // Stockholm
  MOW: "SVO", // Moscow
  NYC: "JFK", // New York
  CHI: "ORD", // Chicago
  WAS: "IAD", // Washington DC
  HOU: "IAH", // Houston
  YTO: "YYZ", // Toronto
  YMQ: "YUL", // Montreal
  SAO: "GRU", // Sao Paulo
  RIO: "GIG", // Rio de Janeiro
  BUE: "EZE", // Buenos Aires
};

/** Uppercase/trim a city code and resolve IATA metro codes to their primary airport. */
export function normalizeCode(code: string): string {
  const c = code.trim().toUpperCase();
  return metroToAirport[c] || c;
}
