import type { HttpResult, HttpHop } from '@tls-dns-checker/shared-types';

const MAX_HOPS = 10;

export async function probeHttp(target: string, port = 443): Promise<HttpResult> {
  const host = target.replace(/^https?:\/\//i, '').split('/')[0] ?? target;
  let url = `https://${host}`;
  if (port !== 443) url = `https://${host}:${port}`;

  const hops: HttpHop[] = [];
  let totalTimingMs = 0;
  let serverHeader: string | undefined;

  for (let i = 0; i < MAX_HOPS; i++) {
    const start = Date.now();
    try {
      const response = await fetch(url, {
        method: 'GET',
        redirect: 'manual',
        signal: AbortSignal.timeout(8000),
        headers: { 'User-Agent': 'DomainTLSProbe/1.0 (+https://github.com/chayprabs/tls-dns-checker)' },
      });

      const timingMs = Date.now() - start;
      totalTimingMs += timingMs;

      const headers: Record<string, string> = {};
      response.headers.forEach((v, k) => {
        headers[k] = v;
      });
      if (headers['server']) serverHeader = headers['server'];

      hops.push({
        url,
        status: response.status,
        statusText: response.statusText,
        headers,
        timingMs,
      });

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        if (!location) break;
        url = new URL(location, url).href;
        continue;
      }
      break;
    } catch (err) {
      hops.push({
        url,
        status: 0,
        statusText: err instanceof Error ? err.message : 'Request failed',
        headers: {},
        timingMs: Date.now() - start,
      });
      break;
    }
  }

  return {
    finalUrl: hops[hops.length - 1]?.url ?? url,
    hops,
    totalTimingMs,
    serverHeader,
  };
}
