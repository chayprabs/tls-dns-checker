import tls from 'node:tls';
import type { CertInfo, CertResult } from '@tls-dns-checker/shared-types';
import { normalizeDomain } from '../lib/target.js';
import { tlsConnectOptions } from '../lib/tls-connect.js';

export async function probeCert(
  target: string,
  port = 443,
  isIp = false,
): Promise<CertResult> {
  const hostname = normalizeDomain(target);

  const peerCerts = await getPeerCertificateChain(hostname, port);
  const chain = peerCerts.map((c, i) => parseCert(c, hostname, i === 0));

  if (chain.length > 0 && !isIp) {
    try {
      const ctLogs = await Promise.race([
        fetchCtLogs(hostname).catch(() => [] as CertInfo['ctLogs']),
        new Promise<CertInfo['ctLogs']>((resolve) => setTimeout(() => resolve([]), 2500)),
      ]);
      chain[0].ctLogs = ctLogs;
    } catch {
      chain[0].ctLogs = [];
    }
  }

  return { chain, hostname };
}

function getPeerCertificateChain(
  host: string,
  port: number,
): Promise<tls.PeerCertificate[]> {
  return new Promise((resolve) => {
    const socket = tls.connect(tlsConnectOptions(host, port));
    socket.on('secureConnect', () => {
      const leaf = socket.getPeerCertificate(true);
      socket.end();
      resolve(leaf && Object.keys(leaf).length > 0 ? flattenChain(leaf) : []);
    });
    socket.on('error', () => resolve([]));
    socket.on('timeout', () => {
      socket.destroy();
      resolve([]);
    });
  });
}

function flattenChain(leaf: tls.PeerCertificate): tls.PeerCertificate[] {
  const chain: tls.PeerCertificate[] = [];
  let current: tls.PeerCertificate | undefined = leaf;

  for (let depth = 0; depth < 12 && current; depth++) {
    if (!current.valid_from && !current.serialNumber) break;
    chain.push(current);
    const issuerCert: tls.PeerCertificate | undefined = (
      current as tls.PeerCertificate & { issuerCertificate?: tls.PeerCertificate }
    ).issuerCertificate;
    if (!issuerCert || issuerCert === current || !issuerCert.valid_from) break;
    current = issuerCert;
  }

  return chain.length > 0 ? chain : [leaf];
}

function parseCert(cert: tls.PeerCertificate, hostname: string, isLeaf = true): CertInfo {
  const validFrom = cert.valid_from ?? '';
  const validTo = cert.valid_to ?? '';
  const end = new Date(validTo).getTime();
  const daysRemaining = Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24));

  let warning: CertInfo['warning'] = null;
  if (isLeaf) {
    if (daysRemaining <= 0) warning = 'expired';
    else if (daysRemaining <= 30) warning = 'expiring';
  }

  const subject = cert.subject?.CN ?? cert.subjectaltname ?? hostname;
  const issuer = cert.issuer?.O ?? cert.issuer?.CN ?? 'Unknown';

  const sans: string[] = [];
  if (cert.subjectaltname) {
    cert.subjectaltname.split(', ').forEach((s) => {
      const m = s.match(/^DNS:(.+)$/);
      if (m) sans.push(m[1]);
    });
  }
  if (sans.length === 0 && typeof subject === 'string') sans.push(subject);

  const curve = (cert as { asn1Curve?: string }).asn1Curve;
  const bits = (cert as { bits?: number }).bits;
  const keyAlgorithm = curve ? `ECDSA-${curve}` : bits ? `RSA-${bits}` : undefined;

  const infoAccessRaw = (cert as { infoAccess?: string | unknown }).infoAccess;
  const infoAccess =
    typeof infoAccessRaw === 'string' ? infoAccessRaw : JSON.stringify(infoAccessRaw ?? '');
  const ocspUrl = infoAccess.match(/OCSP - URI:([^\n]+)/i)?.[1]?.trim();

  return {
    subject: String(subject),
    issuer: String(issuer),
    validFrom,
    validTo,
    daysRemaining,
    sans,
    keyAlgorithm,
    signatureAlgorithm: (cert as { signature?: string }).signature,
    serialNumber: cert.serialNumber,
    warning,
    ocsp: { status: ocspUrl ? 'url-present' : 'not-checked', url: ocspUrl },
    crl: [],
  };
}

async function fetchCtLogs(domain: string): Promise<CertInfo['ctLogs']> {
  try {
    const url = `https://crt.sh/?q=${encodeURIComponent(domain)}&output=json`;
    const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
    if (!res.ok) return [];

    const entries = (await res.json()) as { issuer_name?: string; not_before?: string }[];
    return entries.slice(0, 10).map((e) => ({
      logName: e.issuer_name ?? 'crt.sh',
      timestamp: e.not_before ?? '',
    }));
  } catch {
    return [];
  }
}
