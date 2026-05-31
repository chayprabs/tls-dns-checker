import type { ProbeRequest, ProbeResult } from '@tls-dns-checker/shared-types';
import { parseTarget } from '../lib/target.js';
import { probeDns } from './dns.js';
import { probeRdap } from './rdap.js';
import { probeAsn } from './asn.js';
import { probeHttp } from './http.js';
import { probeTls } from './tls.js';
import { probeCert } from './cert.js';
import { probeSocket } from './socket.js';

export async function runFullProbe(req: ProbeRequest): Promise<ProbeResult> {
  const start = Date.now();
  const parsed = parseTarget(req.target);
  const host = parsed.host;
  const tlsPort = parsed.port ?? 443;
  const socketPort = req.socketPort ?? 80;
  const dnsMode = req.dnsMode ?? 'recursive';

  const [dns, rdap, http, tlsResult, cert, socket] = await Promise.all([
    probeDns(host, dnsMode, parsed.isIp),
    probeRdap(host, parsed.isIp),
    probeHttp(req.target, tlsPort),
    probeTls(host, tlsPort, parsed.isIp),
    probeCert(host, tlsPort, parsed.isIp),
    probeSocket(host, socketPort),
  ]);

  const firstA = dns.records.find((r) => r.type === 'A')?.value;
  const asn = await probeAsn(host, parsed.isIp ? host : firstA, parsed.isIp);

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
