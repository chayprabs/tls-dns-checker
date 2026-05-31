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
    expect(res.status).toBe(200);
    const body = (await res.json()) as { target: string; dns: unknown; cert: unknown };
    expect(body.target).toBe('example.com');
    expect(body.dns).toBeDefined();
    expect(body.cert).toBeDefined();
  }, 30000);
});
