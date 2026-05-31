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
    case 'MX':
      return `${a.priority} ${a.exchange}`;
    case 'SOA':
      return `${a.nsname} ${a.hostmaster} serial=${(a as { serial?: number }).serial}`;
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

export async function probeDns(
  target: string,
  mode: 'recursive' | 'authoritative' = 'recursive',
): Promise<DnsResult> {
  const domain = normalizeDomain(target);
  const client = new DNS({ dns: '8.8.8.8', timeout: 5000 });

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
    const ds = await client.resolve(domain, 'DS');
    if (ds.answers.length > 0) {
      return {
        validated: true,
        chain: ds.answers.map((a) => {
          const r = a as DNS.Packet.Resource & { keytag?: number; algorithm?: number };
          return `DS ${r.keytag} ${r.algorithm}`;
        }),
      };
    }
  } catch {
    /* unsigned or no DS */
  }

  try {
    const dnskey = await client.resolve(domain, 'DNSKEY');
    if (dnskey.answers.length > 0) {
      return {
        validated: false,
        error: 'DNSKEY present but DS chain not fully validated in this probe',
        chain: ['DNSKEY records found'],
      };
    }
  } catch {
    /* */
  }

  return { validated: false, error: 'No DNSSEC chain found (unsigned zone or no DS)' };
}
