import DNS from 'dns2';
import type { AsnResult } from '@tls-dns-checker/shared-types';

export async function probeAsn(
  target: string,
  resolvedIp?: string,
  isIp = false,
): Promise<AsnResult> {
  const ip = isIp ? target : (resolvedIp ?? (await resolveFirstIp(target)));
  if (!ip) {
    return { ip: target, org: 'Could not resolve IP for ASN lookup' };
  }

  try {
    const reversed = ip.split('.').reverse().join('.');
    const query = `${reversed}.origin.asn.cymru.com`;
    const txt = await dnsTxt(query);
    const parts = txt.split('|').map((p) => p.trim());
    const asnRaw = parts[0] ?? '';
    const asn = asnRaw.match(/^\d+$/) ? `AS${asnRaw}` : asnRaw;
    const prefix = parts[1];
    const country = parts[2];
    const registry = parts[3];

    let org: string | undefined;
    if (asn) {
      const asnNum = asn.replace(/^AS/i, '');
      const orgTxt = await dnsTxt(`AS${asnNum}.asn.cymru.com`);
      const orgParts = orgTxt.split('|').map((p) => p.trim());
      org = orgParts[4] ?? orgParts[orgParts.length - 1];
    }

    return {
      ip,
      asn,
      asnName: org,
      country,
      prefixes: prefix ? [prefix] : [],
      org: org ?? registry,
    };
  } catch (err) {
    return {
      ip,
      org: err instanceof Error ? err.message : 'ASN lookup failed',
    };
  }
}

async function resolveFirstIp(host: string): Promise<string | undefined> {
  const client = new DNS({ dns: '8.8.8.8', timeout: 3000 });
  try {
    const a = await client.resolve(host, 'A');
    return a.answers[0]?.address;
  } catch {
    try {
      const aaaa = await client.resolve(host, 'AAAA');
      return aaaa.answers[0]?.address;
    } catch {
      return undefined;
    }
  }
}

async function dnsTxt(name: string): Promise<string> {
  const client = new DNS({ dns: '8.8.8.8', timeout: 5000 });
  const result = await client.resolve(name, 'TXT');
  const answer = result.answers[0];
  const data = answer?.data;
  const text = Array.isArray(data) ? data.join('') : String(data ?? '');
  return text.replace(/"/g, '');
}
