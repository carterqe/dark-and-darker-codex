// In-memory sliding-window rate limiter.
// Each Vercel serverless cold start gets a fresh Map, so this is a
// best-effort first layer of defense — not a hard global limit.

// Map of IP -> array of request timestamps
const hits = new Map<string, number[]>();

// Periodically prune stale entries to prevent unbounded memory growth
const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  const cutoff = now - windowMs;
  for (const [key, timestamps] of hits) {
    const valid = timestamps.filter((t) => t > cutoff);
    if (valid.length === 0) hits.delete(key);
    else hits.set(key, valid);
  }
}

export function rateLimit(
  ip: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): { ok: boolean; remaining: number } {
  cleanup(windowMs);

  const now = Date.now();
  const cutoff = now - windowMs;
  const timestamps = (hits.get(ip) ?? []).filter((t) => t > cutoff);

  if (timestamps.length >= limit) {
    return { ok: false, remaining: 0 };
  }

  timestamps.push(now);
  hits.set(ip, timestamps);
  return { ok: true, remaining: limit - timestamps.length };
}
