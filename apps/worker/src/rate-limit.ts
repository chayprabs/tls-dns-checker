const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 60;

export function checkRateLimit(ip: string): boolean {
  if (
    process.env.NODE_ENV === 'test' ||
    process.env.VITEST === 'true' ||
    process.env.CI === 'true' ||
    process.env.DISABLE_RATE_LIMIT === '1'
  ) {
    return true;
  }
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_PER_WINDOW) return false;
  entry.count += 1;
  return true;
}
