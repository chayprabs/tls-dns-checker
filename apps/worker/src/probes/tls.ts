import tls from 'node:tls';
import type { TlsResult } from '@tls-dns-checker/shared-types';
import { normalizeDomain } from '../lib/target.js';

export async function probeTls(target: string, port = 443): Promise<TlsResult> {
  const host = normalizeDomain(target);

  return new Promise((resolve) => {
    const socket = tls.connect(
      {
        host,
        port,
        servername: host,
        rejectUnauthorized: false,
        timeout: 8000,
      },
      () => {
        const cipher = socket.getCipher();
        const protocol = socket.getProtocol() ?? undefined;
        const alpn = socket.alpnProtocol ? [socket.alpnProtocol] : undefined;

        resolve({
          protocol: protocol ?? undefined,
          cipher: cipher ? `${cipher.name} ${cipher.version}` : undefined,
          alpn,
          sni: host,
          ocspStapling: false,
          sessionResumption: socket.isSessionReused?.() ?? false,
          supportedVersions: protocol ? [protocol] : undefined,
        });
        socket.end();
      },
    );

    socket.on('error', () => {
      resolve({
        sni: host,
        supportedVersions: [],
      });
      socket.destroy();
    });

    socket.on('timeout', () => {
      resolve({ sni: host });
      socket.destroy();
    });
  });
}
