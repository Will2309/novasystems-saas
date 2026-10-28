/**
 * In-Memory Token Bucket / Sliding Window Rate Limiter
 * Protects public endpoints (contact, auth, admin) against brute-force and DDoS
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const cache = new Map<string, RateLimitRecord>();

export interface RateLimitOptions {
  intervalMs?: number; // default: 60 seconds
  maxRequests?: number; // default: 10 requests per interval
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { success: boolean; remaining: number; resetInSec: number } {
  const intervalMs = options.intervalMs || 60 * 1000;
  const maxRequests = options.maxRequests || 10;
  const now = Date.now();

  const record = cache.get(identifier);

  if (!record || now > record.resetAt) {
    cache.set(identifier, {
      count: 1,
      resetAt: now + intervalMs,
    });
    return {
      success: true,
      remaining: maxRequests - 1,
      resetInSec: Math.ceil(intervalMs / 1000),
    };
  }

  if (record.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetInSec: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: maxRequests - record.count,
    resetInSec: Math.ceil((record.resetAt - now) / 1000),
  };
}
