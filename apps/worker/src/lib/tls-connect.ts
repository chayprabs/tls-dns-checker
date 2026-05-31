import type { ConnectionOptions } from 'node:tls';

const IPV4 = /^(?:\d{1,3}\.){3}\d{1,3}$/;

export function isIpAddress(host: string): boolean {
  return IPV4.test(host);
}

export function tlsConnectOptions(
  host: string,
  port: number,
): ConnectionOptions {
  const opts: ConnectionOptions = {
    host,
    port,
    rejectUnauthorized: false,
    timeout: 8000,
  };
  if (!isIpAddress(host)) {
    opts.servername = host;
  }
  return opts;
}
