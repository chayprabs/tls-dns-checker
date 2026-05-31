import type { RdapResult } from '@tls-dns-checker/shared-types';
import { normalizeDomain } from '../lib/target.js';

export async function probeRdap(target: string, isIp = false): Promise<RdapResult> {
  const domain = normalizeDomain(target);

  if (isIp) {
    try {
      const response = await fetch(`https://rdap.org/ip/${domain}`, {
        headers: { Accept: 'application/rdap+json' },
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) {
        return fallbackWhois(domain, `IP RDAP HTTP ${response.status}`);
      }
      const data = (await response.json()) as Record<string, unknown>;
      const name = (data.name as string) ?? domain;
      const entities = (data.entities as Record<string, unknown>[]) ?? [];
      const org = entities
        .flatMap((e) => {
          const vcard = e.vcardArray as unknown[];
          if (!Array.isArray(vcard?.[1])) return [];
          const fn = (vcard[1] as unknown[][]).find((r) => r[0] === 'fn');
          return typeof fn?.[3] === 'string' ? [fn[3]] : [];
        })
        .find(Boolean);
      return {
        domain: name,
        registrar: org,
        statuses: (data.status as string[]) ?? [],
        nameservers: [],
        contacts: org ? [{ role: 'registrant', name: org }] : [],
        raw: data,
      };
    } catch (err) {
      return fallbackWhois(domain, err instanceof Error ? err.message : 'IP RDAP failed');
    }
  }

  try {
    const bootstrap = await fetch('https://data.iana.org/rdap/dns.json', {
      signal: AbortSignal.timeout(5000),
    });
    const bootstrapData = (await bootstrap.json()) as {
      services: [string[], string[]][];
    };

    const tld = domain.split('.').pop()?.toLowerCase() ?? domain;
    let rdapUrl: string | undefined;

    for (const [tlds, urls] of bootstrapData.services) {
      if (tlds.some((t) => t.replace(/^\./, '').toLowerCase() === tld)) {
        rdapUrl = urls[0];
        break;
      }
    }

    if (!rdapUrl) {
      rdapUrl = `https://rdap.org/domain/${domain}`;
    }

    const response = await fetch(`${rdapUrl.replace(/\/$/, '')}/domain/${domain}`, {
      headers: { Accept: 'application/rdap+json' },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return fallbackWhois(domain, `RDAP HTTP ${response.status}`);
    }

    const data = (await response.json()) as Record<string, unknown>;
    return normalizeRdap(domain, data);
  } catch (err) {
    return fallbackWhois(domain, err instanceof Error ? err.message : 'RDAP failed');
  }
}

function normalizeRdap(domain: string, data: Record<string, unknown>): RdapResult {
  const events = (data.events as { eventAction: string; eventDate: string }[]) ?? [];
  const statuses = (data.status as string[]) ?? [];
  const entities = (data.entities as Record<string, unknown>[]) ?? [];

  const getEvent = (action: string) =>
    events.find((e) => e.eventAction === action)?.eventDate;

  const registrar = entities.find((e) =>
    (e.roles as string[])?.includes('registrar'),
  ) as Record<string, unknown> | undefined;

  const vcard = registrar?.vcardArray as unknown[];
  const registrarName =
    vcard && Array.isArray(vcard[1])
      ? (vcard[1] as unknown[][]).find((r) => r[0] === 'fn')?.[3]
      : undefined;

  const nameservers =
    (data.nameservers as { ldhName?: string }[])?.map((n) => n.ldhName).filter(Boolean) ??
    [];

  const contacts = entities
    .filter((e) => (e.roles as string[])?.some((r) => ['registrant', 'admin', 'tech'].includes(r)))
    .map((e) => ({
      role: ((e.roles as string[]) ?? [])[0] ?? 'contact',
      name: extractVcardFn(e.vcardArray),
    }));

  return {
    domain,
    registrar: typeof registrarName === 'string' ? registrarName : undefined,
    created: getEvent('registration'),
    updated: getEvent('last changed') ?? getEvent('last update of RDAP database'),
    expires: getEvent('expiration'),
    statuses,
    nameservers: nameservers as string[],
    contacts,
    raw: data,
  };
}

function extractVcardFn(vcard: unknown): string | undefined {
  if (!Array.isArray(vcard) || !Array.isArray(vcard[1])) return undefined;
  const fn = (vcard[1] as unknown[][]).find((r) => r[0] === 'fn');
  return typeof fn?.[3] === 'string' ? fn[3] : undefined;
}

async function fallbackWhois(domain: string, note: string): Promise<RdapResult> {
  return {
    domain,
    statuses: ['lookup-degraded'],
    contacts: [{ role: 'system', name: note }],
    raw: { note },
  };
}
