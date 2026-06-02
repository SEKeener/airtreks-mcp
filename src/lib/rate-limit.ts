/**
 * Simple in-memory rate limiter.
 * Tracks requests per IP per day. Resets at midnight UTC.
 *
 * Free tier: 100 queries/day (tool calls, not initialize/list).
 * No API key yet — rate limit by IP. API keys come in Phase 1b.
 */

const DEFAULT_LIMIT = parseInt(process.env.RATE_LIMIT_PER_DAY || "100", 10);

interface BucketEntry {
  count: number;
  resetAt: number; // epoch ms
}

const buckets = new Map<string, BucketEntry>();

// Clean up expired buckets every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of buckets) {
    if (now >= entry.resetAt) {
      buckets.delete(key);
    }
  }
}, 10 * 60 * 1000);

function getResetTime(): number {
  const now = new Date();
  const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  return tomorrow.getTime();
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  let entry = buckets.get(ip);

  // Reset if expired
  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: getResetTime() };
    buckets.set(ip, entry);
  }

  entry.count++;

  return {
    allowed: entry.count <= DEFAULT_LIMIT,
    remaining: Math.max(0, DEFAULT_LIMIT - entry.count),
    limit: DEFAULT_LIMIT,
    resetAt: entry.resetAt,
  };
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": new Date(result.resetAt).toISOString(),
  };
}
