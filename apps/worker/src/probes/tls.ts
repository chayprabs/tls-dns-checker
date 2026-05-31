import tls from 'node:tls';
import type { TlsResult } from '@tls-dns-checker/shared-types';
import { normalizeDomain } from '../lib/target.js';
import { isIpAddress, tlsConnectOptions } from '../lib/tls-connect.js';

export async function probeTls(
  target: string,
  port = 443,
  isIp = false,
): Promise<TlsResult> {
  const host = normalizeDomain(target);
  const useSni = !isIp && !isIpAddress(host);

  return new Promise((resolve) => {
    const socket = tls.connect(tlsConnectOptions(host, port), () => {
      const cipher = socket.getCipher();
      const protocol = socket.getProtocol() ?? undefined;
      const alpn = socket.alpnProtocol ? [socket.alpnProtocol] : undefined;

      resolve({
        protocol: protocol ?? undefined,
        cipher: cipher ? `${cipher.name} ${cipher.version}` : undefined,
        alpn,
        sni: useSni ? host : undefined,
        ocspStapling: false,
        sessionResumption: socket.isSessionReused?.() ?? false,
        supportedVersions: protocol ? [protocol] : undefined,
      });
      socket.end();
    });

    socket.on('error', () => {
      resolve({
        sni: useSni ? host : undefined,
        supportedVersions: [],
      });
      socket.destroy();
    });

    socket.on('timeout', () => {
      resolve({ sni: useSni ? host : undefined });
      socket.destroy();
    });
  });
}
