import DNS from 'dns2';
import type { DnsRecord, DnsRecordType, DnsResult } from '@tls-dns-checker/shared-types';
import { normalizeDomain } from '../lib/target.js';

const RECORD_TYPES: DnsRecordType[] = [
  'A',
  'AAAA',
  'CNAME',
  'MX',
  'TXT',
  'NS',
  'SOA',
  'SRV',
  'CAA',
  'DS',
  'DNSKEY',
];

function formatAnswer(type: DnsRecordType, answer: DNS.Packet.Resource): string {
  const a = answer as DNS.Packet.Resource & Record<string, unknown>;
  switch (type) {
    case 'MX': {
      const exchange = (a as { exchange?: string }).exchange;
      return `${a.priority} ${exchange && exchange.trim() ? exchange : '.'}`;
    }
    case 'NS':
      return String((a as { ns?: string }).ns ?? (a as { domain?: string }).domain ?? a);
    case 'SOA':
      return `${(a as { primary?: string }).primary ?? (a as { nsname?: string }).nsname} ${(a as { admin?: string }).admin ?? (a as { hostmaster?: string }).hostmaster} serial=${(a as { serial?: number }).serial}`;
    case 'SRV':
      return `${a.priority} ${a.weight} ${a.port} ${a.target}`;
    case 'TXT':
      return Array.isArray(a.data) ? (a.data as string[]).join('') : String(a.data ?? a);
    case 'CAA':
      return `${(a as { flags?: number }).flags} ${(a as { tag?: string }).tag} ${(a as { value?: string }).value}`;
    default:
      return String(
        (a as { address?: string }).address ??
          (a as { domain?: string }).domain ??
          (a as { nsname?: string }).nsname ??
          JSON.stringify(a),
      );
  }
}

function reverseArpa(ip: string): string | null {
  const parts = ip.split('.');
  if (parts.length === 4 && parts.every((p) => /^\d{1,3}$/.test(p))) {
    return `${parts.reverse().join('.')}.in-addr.arpa`;
  }
  return null;
}

export async function probeDns(
  target: string,
  mode: 'recursive' | 'authoritative' = 'recursive',
  isIp = false,
): Promise<DnsResult> {
  const domain = normalizeDomain(target);
  const client = new DNS({ dns: '1.1.1.1', timeout: 5000, recursive: true });

  if (isIp) {
    const arpa = reverseArpa(domain);
    if (!arpa) {
      return {
        records: [],
        dnssec: { validated: false, error: 'Reverse DNS not supported for this address format' },
        mode,
      };
    }
    const records: DnsRecord[] = [];
    try {
      const ptr = await client.resolve(arpa, 'PTR');
      for (const answer of ptr.answers) {
        records.push({
          type: 'PTR',
          name: arpa,
          value: String((answer as { domain?: string }).domain ?? answer),
          ttl: answer.ttl,
        });
      }
    } catch {
      /* no PTR */
    }
    return {
      records,
      dnssec: { validated: false, error: 'DNSSEC not applicable to reverse DNS PTR lookup' },
      mode,
    };
  }

  if (mode === 'authoritative') {
    try {
      const nsPacket = await client.resolve(domain, 'NS');
      const nsName = nsPacket.answers[0]?.ns;
      if (nsName) {
        const aPacket = await client.resolve(nsName, 'A');
        const nsIp = aPacket.answers[0]?.address;
        if (nsIp) {
          Object.assign(client, { nameServers: [nsIp] });
        }
      }
    } catch {
      /* fall back to recursive */
    }
  }

  const records: DnsRecord[] = [];

  await Promise.all(
    RECORD_TYPES.map(async (type) => {
      try {
        const result = await client.resolve(domain, type);
        for (const answer of result.answers) {
          records.push({
            type,
            name: domain,
            value: formatAnswer(type, answer),
            ttl: answer.ttl,
          });
        }
      } catch {
        /* record type may not exist */
      }
    }),
  );

  const dnssec = await validateDnssec(domain, client);

  return { records, dnssec, mode };
}

async function validateDnssec(domain: string, client: DNS): Promise<DnsResult['dnssec']> {
  try {
    const aPacket = await client.resolve(domain, 'A');
    const header = aPacket.header as { ad?: number };
    if (header.ad === 1) {
      return {
        validated: true,
        chain: ['Resolver AD flag set on DNSSEC-validated response'],
      };
    }
    const hasRrsig = aPacket.answers.some((ans) => (ans as { type?: number }).type === 46);
    if (hasRrsig) {
      return { validated: true, chain: ['RRSIG present in answer'] };
    }
  } catch {
    /* */
  }

  try {
    const ds = await client.resolve(domain, 'DS');
    if (ds.answers.length > 0) {
      return {
        validated: false,
        error: 'DS records present; validating resolver did not set AD flag',
        chain: ds.answers.map((a) => {
          const r = a as DNS.Packet.Resource & { keytag?: number; algorithm?: number };
          return `DS ${r.keytag} ${r.algorithm}`;
        }),
      };
    }
  } catch (err) {
    return {
      validated: false,
      error: `DS lookup failed: ${err instanceof Error ? err.message : 'SERVFAIL or timeout'}`,
    };
  }

  try {
    const dnskey = await client.resolve(domain, 'DNSKEY');
    if (dnskey.answers.length > 0) {
      return {
        validated: false,
        error: 'DNSKEY found without AD validation',
        chain: ['DNSKEY records present'],
      };
    }
  } catch (err) {
    return {
      validated: false,
      error: `DNSKEY lookup failed: ${err instanceof Error ? err.message : 'lookup error'}`,
    };
  }

  return { validated: false, error: 'Zone appears unsigned (no DS/DNSKEY)' };
}
