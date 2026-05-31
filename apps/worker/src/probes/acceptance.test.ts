import { describe, it, expect } from 'vitest';
import app from '../index.js';

describe('acceptance probes', () => {
  it('health endpoint', async () => {
    const res = await app.request('http://localhost/health');
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string };
    expect(body.status).toBe('ok');
  });

  it('probe example.com returns structured result', async () => {
    const res = await app.request('http://localhost/v1/probe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: 'example.com' }),
    });
    const body = (await res.json()) as {
      target?: string;
      dns?: unknown;
      cert?: unknown;
      error?: unknown;
    };
    if (res.status !== 200) {
      throw new Error(`probe failed ${res.status}: ${JSON.stringify(body)}`);
    }
    expect(body.target).toBe('example.com');
    expect(body.dns).toBeDefined();
    expect(body.cert).toBeDefined();
  }, 30000);

  it('A1: google.com all sections populated', async () => {
    const res = await app.request('http://localhost/v1/probe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: 'google.com' }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      dns: { records: unknown[] };
      rdap: { registrar?: string };
      asn: { asn?: string };
      http: { hops: unknown[] };
      tls: { protocol?: string };
      cert: { chain: unknown[] };
      socket: { port: number };
      probeDurationMs: number;
    };
    expect(body.dns.records.length).toBeGreaterThan(0);
    expect(body.rdap.registrar).toBeTruthy();
    expect(body.asn.asn).toMatch(/^AS/i);
    expect(body.http.hops.length).toBeGreaterThan(0);
    expect(body.tls.protocol).toBeTruthy();
    expect(body.cert.chain.length).toBeGreaterThan(0);
    expect(body.socket.port).toBe(80);
    expect(body.probeDurationMs).toBeLessThan(30000);
  }, 45000);
});
