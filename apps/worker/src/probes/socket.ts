import net from 'node:net';
import type { SocketResult } from '@tls-dns-checker/shared-types';
import { normalizeDomain } from '../lib/target.js';

const TIMEOUT_MS = 3000;

export async function probeSocket(target: string, port = 80): Promise<SocketResult> {
  const host = normalizeDomain(target);
  const start = Date.now();

  const payload =
    port === 443 || port === 8443
      ? '\r\n'
      : `GET / HTTP/1.0\r\nHost: ${host}\r\nConnection: close\r\n\r\n`;

  return new Promise((resolve) => {
    const socket = net.connect({ host, port, timeout: TIMEOUT_MS }, () => {
      socket.write(payload);
    });

    let data = '';
    socket.on('data', (chunk) => {
      data += chunk.toString('utf8', 0, 512);
      socket.destroy();
    });

    const finish = (extra?: Partial<SocketResult>) => {
      resolve({
        port,
        banner: data.trim() || undefined,
        timingMs: Date.now() - start,
        ...extra,
      });
    };

    socket.on('close', () => finish());

    socket.on('error', (err) => {
      resolve({
        port,
        error: err.message,
        timingMs: Date.now() - start,
      });
    });

    socket.on('timeout', () => {
      socket.destroy();
      finish({ error: data.trim() ? undefined : 'Connection timed out' });
    });
  });
}
