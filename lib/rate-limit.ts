// Basic in-memory, per-IP rate limiter. Good enough as a first line of
// defense against scripted abuse on auth and Claude-backed grading/matching
// routes. This resets if the server process restarts and is per-instance
// (not shared across multiple server instances) — if Tundemy scales to
// multiple instances behind a load balancer, swap this for a shared store
// (e.g. Upstash Redis) so limits are enforced globally.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Periodically clear stale buckets so this Map doesn't grow forever.
let lastSweep = Date.now();
function sweep() {
  const now = Date.now();
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

/**
 * Returns { limited: true } if this key has exceeded `max` requests within
 * `windowMs`. Otherwise records the request and returns { limited: false }.
 */
export function checkRateLimit(
  key: string,
  max: number,
  windowMs: number = 60_000
): { limited: boolean; remaining: number; resetAt: number } {
  sweep();
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { limited: false, remaining: max - 1, resetAt };
  }

  if (existing.count >= max) {
    return { limited: true, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { limited: false, remaining: max - existing.count, resetAt: existing.resetAt };
}

/** Convenience helper: 429 response with Retry-After header if rate limited. */
export function rateLimitResponse(resetAt: number) {
  const retryAfterSec = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
  return new Response(
    JSON.stringify({ error: "Too many requests. Please slow down and try again shortly." }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSec),
      },
    }
  );
}
