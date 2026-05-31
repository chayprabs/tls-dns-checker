import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { z } from 'zod';
import { serve } from '@hono/node-server';
import { runFullProbe, probeDns, probeRdap, probeAsn, probeHttp, probeTls, probeCert, probeSocket } from './probes/index.js';
import { addHistory, listHistory, getHistory, diffHistory } from './history.js';
import { subscribeAlert, listAlerts } from './alerts.js';
import { parseTarget } from './lib/target.js';
import { checkRateLimit } from './rate-limit.js';

const app = new Hono();

app.use('*', async (c, next) => {
  const ip = c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  if (!checkRateLimit(ip)) {
    return c.json({ error: 'Rate limit exceeded. Try again in a minute.' }, 429);
  }
  await next();
});

app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
  }),
);

const targetSchema = z.object({
  target: z.string().min(1, 'Target is required').max(253, 'Target too long'),
  dnsMode: z.enum(['recursive', 'authoritative']).optional(),
  socketPort: z
    .number()
    .int()
    .min(1, 'Port must be at least 1')
    .max(65535, 'Port must be 65535 or less')
    .optional(),
});

app.get('/health', (c) =>
  c.json({
    status: 'ok',
    service: 'domain-tls-probe-worker',
    probeIpRange: process.env.PROBE_IP_RANGE ?? 'documented-at-deploy',
  }),
);

app.post('/v1/probe', async (c) => {
  const body = targetSchema.safeParse(await c.req.json());
  if (!body.success) return c.json({ error: body.error.flatten() }, 400);

  try {
    const result = await runFullProbe(body.data);
    addHistory(result);
    return c.json(result);
  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : 'Probe failed' }, 400);
  }
});

app.post('/v1/dns', async (c) => {
  const body = targetSchema.safeParse(await c.req.json());
  if (!body.success) return c.json({ error: body.error.flatten() }, 400);
  try {
    const parsed = parseTarget(body.data.target);
    const dns = await probeDns(parsed.host, body.data.dnsMode ?? 'recursive', parsed.isIp);
    return c.json({ target: body.data.target, dns });
  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : 'DNS probe failed' }, 400);
  }
});

app.post('/v1/rdap', async (c) => {
  const body = targetSchema.safeParse(await c.req.json());
  if (!body.success) return c.json({ error: body.error.flatten() }, 400);
  try {
    const parsed = parseTarget(body.data.target);
    const rdap = await probeRdap(parsed.host, parsed.isIp);
    return c.json({ target: body.data.target, rdap });
  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : 'RDAP probe failed' }, 400);
  }
});

app.post('/v1/asn', async (c) => {
  const body = targetSchema.safeParse(await c.req.json());
  if (!body.success) return c.json({ error: body.error.flatten() }, 400);
  try {
    const parsed = parseTarget(body.data.target);
    const asn = await probeAsn(parsed.host, undefined, parsed.isIp);
    return c.json({ target: body.data.target, asn });
  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : 'ASN probe failed' }, 400);
  }
});

app.post('/v1/http', async (c) => {
  const body = targetSchema.safeParse(await c.req.json());
  if (!body.success) return c.json({ error: body.error.flatten() }, 400);
  try {
    const parsed = parseTarget(body.data.target);
    const http = await probeHttp(body.data.target, parsed.port ?? 443);
    return c.json({ target: body.data.target, http });
  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : 'HTTP probe failed' }, 400);
  }
});

app.post('/v1/tls', async (c) => {
  const body = targetSchema.safeParse(await c.req.json());
  if (!body.success) return c.json({ error: body.error.flatten() }, 400);
  try {
    const parsed = parseTarget(body.data.target);
    const tlsResult = await probeTls(parsed.host, parsed.port ?? 443, parsed.isIp);
    return c.json({ target: body.data.target, tls: tlsResult });
  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : 'TLS probe failed' }, 400);
  }
});

app.post('/v1/cert', async (c) => {
  const body = targetSchema.safeParse(await c.req.json());
  if (!body.success) return c.json({ error: body.error.flatten() }, 400);
  try {
    const parsed = parseTarget(body.data.target);
    const cert = await probeCert(parsed.host, parsed.port ?? 443, parsed.isIp);
    return c.json({ target: body.data.target, cert });
  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : 'Cert probe failed' }, 400);
  }
});

app.post('/v1/socket', async (c) => {
  const body = targetSchema.safeParse(await c.req.json());
  if (!body.success) return c.json({ error: body.error.flatten() }, 400);
  try {
    const parsed = parseTarget(body.data.target);
    const socket = await probeSocket(parsed.host, body.data.socketPort ?? parsed.port ?? 80);
    return c.json({ target: body.data.target, socket });
  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : 'Socket probe failed' }, 400);
  }
});

app.get('/v1/history', (c) => c.json({ history: listHistory() }));

app.get('/v1/history/:id', (c) => {
  const entry = getHistory(c.req.param('id'));
  if (!entry) return c.json({ error: 'Not found' }, 404);
  return c.json(entry);
});

app.get('/v1/history/diff/:a/:b', (c) => {
  return c.json(diffHistory(c.req.param('a'), c.req.param('b')));
});

app.post('/v1/alerts/subscribe', async (c) => {
  const schema = z.object({
    email: z.string().email('Enter a valid email address'),
    target: z.string().min(1, 'Target is required'),
    thresholds: z.array(z.number()).optional(),
  });
  const body = schema.safeParse(await c.req.json());
  if (!body.success) return c.json({ error: body.error.flatten() }, 400);
  const result = subscribeAlert({
    ...body.data,
    thresholds: body.data.thresholds ?? [30, 14, 7, 1],
  });
  return c.json(result, result.ok ? 200 : 400);
});

app.get('/v1/alerts', (c) => c.json({ alerts: listAlerts() }));

const port = Number(process.env.PORT ?? 8787);

if (process.env.NODE_ENV !== 'test') {
  serve({ fetch: app.fetch, port }, () => {
    console.log(`DomainTLSProbe worker listening on :${port}`);
  });
}

export default app;
