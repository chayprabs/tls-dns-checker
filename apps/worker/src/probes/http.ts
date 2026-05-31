import { Agent, fetch as undiciFetch } from 'undici';
import type { HttpResult, HttpHop } from '@tls-dns-checker/shared-types';

const MAX_HOPS = 10;
const insecureAgent = new Agent({ connect: { rejectUnauthorized: false } });

export async function probeHttp(targetInput: string, port = 443): Promise<HttpResult> {
  const trimmed = targetInput.trim();
  const useHttp = /^http:\/\//i.test(trimmed);
  const host =
    trimmed.replace(/^https?:\/\//i, '').split('/')[0]?.split(':')[0] ?? trimmed;
  const explicitPort = trimmed.match(/:(\d+)(?:\/|$)/)?.[1];
  const effectivePort = explicitPort ? Number(explicitPort) : port;

  let url = useHttp ? `http://${host}` : `https://${host}`;
  if (effectivePort !== 80 && effectivePort !== 443) {
    url = `${useHttp ? 'http' : 'https'}://${host}:${effectivePort}`;
  }

  const hops: HttpHop[] = [];
  let totalTimingMs = 0;
  let serverHeader: string | undefined;

  for (let i = 0; i < MAX_HOPS; i++) {
    const start = Date.now();
    try {
      const response = await undiciFetch(url, {
        method: 'GET',
        redirect: 'manual',
        signal: AbortSignal.timeout(8000),
        dispatcher: insecureAgent,
        headers: {
          'User-Agent': 'DomainTLSProbe/1.0 (+https://github.com/chayprabs/tls-dns-checker)',
        },
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
      const timingMs = Date.now() - start;
      totalTimingMs += timingMs;
      hops.push({
        url,
        status: 0,
        statusText: err instanceof Error ? err.message : 'Request failed',
        headers: {},
        timingMs,
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
