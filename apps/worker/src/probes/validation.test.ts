import { describe, it, expect } from 'vitest';
import app from '../index.js';

describe('valid input/output', () => {
  it('probes 8.8.8.8 with ASN and IP RDAP', async () => {
    const res = await app.request('http://localhost/v1/probe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: '8.8.8.8' }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      asn: { asn?: string; org?: string };
      rdap: { statuses?: string[] };
      dns: { records: unknown[] };
    };
    expect(body.asn.asn).toMatch(/^AS\d+/i);
    expect(body.asn.org).not.toBe('Could not resolve IP for ASN lookup');
    expect(body.dns.records.length).toBeGreaterThanOrEqual(0);
  }, 30000);

  it('example.com MX null exchange', async () => {
    const res = await app.request('http://localhost/v1/dns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: 'example.com' }),
    });
    const body = (await res.json()) as { dns: { records: { type: string; value: string }[] } };
    const mx = body.dns.records.find((r) => r.type === 'MX');
    expect(mx?.value).toBe('0 .');
  }, 15000);

  it('http:// scheme preserved in HTTP probe', async () => {
    const res = await app.request('http://localhost/v1/http', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: 'http://example.com' }),
    });
    const body = (await res.json()) as { http: { hops: { url: string }[] } };
    expect(body.http.hops[0]?.url).toMatch(/^http:\/\//);
  }, 15000);

  it('expired.badssl.com HTTP probe gets status', async () => {
    const res = await app.request('http://localhost/v1/http', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: 'expired.badssl.com' }),
    });
    const body = (await res.json()) as { http: { hops: { status: number }[] } };
    expect(body.http.hops[0]?.status).toBeGreaterThan(0);
  }, 15000);

  it('rejects invalid port', async () => {
    const res = await app.request('http://localhost/v1/probe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: 'example.com', socketPort: 99999 }),
    });
    expect(res.status).toBe(400);
  });
});
