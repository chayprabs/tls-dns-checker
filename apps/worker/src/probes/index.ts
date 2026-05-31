import type { ProbeRequest, ProbeResult } from '@tls-dns-checker/shared-types';
import { parseTarget } from '../lib/target.js';
import { probeDns } from './dns.js';
import { probeRdap } from './rdap.js';
import { probeAsn } from './asn.js';
import { probeHttp } from './http.js';
import { probeTls } from './tls.js';
import { probeCert } from './cert.js';
import { probeSocket } from './socket.js';

async function safeProbe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

const emptyDns = (mode: 'recursive' | 'authoritative'): Awaited<ReturnType<typeof probeDns>> => ({
  records: [],
  dnssec: { validated: false, error: 'Probe failed' },
  mode,
});

export async function runFullProbe(req: ProbeRequest): Promise<ProbeResult> {
  const start = Date.now();
  const parsed = parseTarget(req.target);
  const host = parsed.host;
  const tlsPort = parsed.port ?? 443;
  const socketPort = req.socketPort ?? 80;
  const dnsMode = req.dnsMode ?? 'recursive';

  const [dns, rdap, http, tlsResult, cert, socket] = await Promise.all([
    safeProbe(() => probeDns(host, dnsMode, parsed.isIp), emptyDns(dnsMode)),
    safeProbe(() => probeRdap(host, parsed.isIp), { statuses: ['error'] }),
    safeProbe(() => probeHttp(req.target, tlsPort), {
      finalUrl: '',
      hops: [],
      totalTimingMs: 0,
    }),
    safeProbe(() => probeTls(host, tlsPort, parsed.isIp), { sni: host }),
    safeProbe(() => probeCert(host, tlsPort, parsed.isIp), { chain: [], hostname: host }),
    safeProbe(() => probeSocket(host, socketPort), { port: socketPort, timingMs: 0 }),
  ]);

  const firstA = dns.records.find((r) => r.type === 'A')?.value;
  const asn = await safeProbe(
    () => probeAsn(host, parsed.isIp ? host : firstA, parsed.isIp),
    { ip: host, org: 'ASN lookup failed' },
  );

  return {
    target: req.target,
    dns,
    rdap,
    asn,
    http,
    tls: tlsResult,
    cert,
    socket,
    timestamp: new Date().toISOString(),
    probeDurationMs: Date.now() - start,
  };
}

export { probeDns, probeRdap, probeAsn, probeHttp, probeTls, probeCert, probeSocket };
