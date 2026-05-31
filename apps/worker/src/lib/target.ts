export interface ParsedTarget {
  host: string;
  port?: number;
  isIp: boolean;
}

const IPV4 = /^(?:\d{1,3}\.){3}\d{1,3}$/;
const IPV6 = /^[0-9a-f:]+$/i;
const HOST_PORT = /^([^:\[\]]+|\[[^\]]+\])(?::(\d+))?$/;

export function parseTarget(input: string): ParsedTarget {
  const trimmed = input.trim().replace(/^https?:\/\//i, '').split('/')[0] ?? '';
  if (!trimmed) throw new Error('Target is required');

  const match = trimmed.match(HOST_PORT);
  if (!match) throw new Error('Invalid target format');

  let host = match[1];
  if (host.startsWith('[') && host.endsWith(']')) {
    host = host.slice(1, -1);
  }

  const port = match[2] ? Number(match[2]) : undefined;
  const isIp = IPV4.test(host) || IPV6.test(host);

  if (!isIp && !/^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/i.test(host)) {
    throw new Error('Invalid hostname');
  }

  return { host, port, isIp };
}

export function normalizeDomain(host: string): string {
  return host.toLowerCase().replace(/\.$/, '');
}
