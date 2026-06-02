/**
 * Rate limiter keyed by API key.
 * Each key has its own daily limit (from api-keys.ts tier).
 * Resets at midnight UTC.
 */

interface BucketEntry {
  count: number;
  resetAt: number;
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

export function checkRateLimit(bucketKey: string, dailyLimit: number): RateLimitResult {
  const now = Date.now();
  let entry = buckets.get(bucketKey);

  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: getResetTime() };
    buckets.set(bucketKey, entry);
  }

  entry.count++;

  return {
    allowed: entry.count <= dailyLimit,
    remaining: Math.max(0, dailyLimit - entry.count),
    limit: dailyLimit,
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
