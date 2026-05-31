import net from 'node:net';
import type { SocketResult } from '@tls-dns-checker/shared-types';
import { normalizeDomain } from '../lib/target.js';

export async function probeSocket(target: string, port = 80): Promise<SocketResult> {
  const host = normalizeDomain(target);
  const start = Date.now();

  return new Promise((resolve) => {
    const socket = net.connect({ host, port, timeout: 5000 }, () => {
      socket.write('\r\n');
    });

    let data = '';
    socket.on('data', (chunk) => {
      data += chunk.toString('utf8', 0, 512);
      socket.destroy();
    });

    socket.on('close', () => {
      resolve({
        port,
        banner: data.trim() || undefined,
        timingMs: Date.now() - start,
      });
    });

    socket.on('error', (err) => {
      resolve({
        port,
        error: err.message,
        timingMs: Date.now() - start,
      });
    });

    socket.on('timeout', () => {
      resolve({
        port,
        banner: data.trim() || undefined,
        error: 'Connection timed out',
        timingMs: Date.now() - start,
      });
      socket.destroy();
    });
  });
}
