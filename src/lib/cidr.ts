/**
 * Platform egress ranges for AI connector directories.
 * All of a platform's users share a handful of egress IPs, so per-IP
 * limits would starve them; give each platform one shared daily bucket.
 */

export interface PlatformRange {
  name: string;
  cidr: string;
  dailyLimit: number;
}

// Anthropic egress for Claude connectors: https://claude.com/docs (160.79.104.0/21)
export const PLATFORM_RANGES: PlatformRange[] = [
  { name: "anthropic", cidr: "160.79.104.0/21", dailyLimit: parseInt(process.env.ANTHROPIC_DAILY_LIMIT || "5000", 10) },
];

function ipv4ToInt(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let out = 0;
  for (const p of parts) {
    const n = Number(p);
    if (!Number.isInteger(n) || n < 0 || n > 255 || p !== String(n)) return null;
    out = out * 256 + n;
  }
  return out;
}

export function ipInCidr(ip: string, cidr: string): boolean {
  // Normalize IPv4-mapped IPv6 (::ffff:1.2.3.4); other IPv6 never matches our v4 ranges
  const v4 = ip.startsWith("::ffff:") ? ip.slice(7) : ip;
  const [base, bitsStr] = cidr.split("/");
  const bits = Number(bitsStr);
  const ipInt = ipv4ToInt(v4);
  const baseInt = ipv4ToInt(base);
  if (ipInt === null || baseInt === null || !Number.isInteger(bits) || bits < 0 || bits > 32) return false;
  if (bits === 0) return true;
  const mask = (0xffffffff << (32 - bits)) >>> 0;
  return ((ipInt & mask) >>> 0) === ((baseInt & mask) >>> 0);
}

export function matchPlatform(ip: string): PlatformRange | null {
  for (const range of PLATFORM_RANGES) {
    if (ipInCidr(ip, range.cidr)) return range;
  }
  return null;
}
