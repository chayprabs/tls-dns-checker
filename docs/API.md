# DomainTLSProbe API

Base URL: `http://localhost:8787` (worker) or `/api` (via Next.js proxy)

## Health

`GET /health`

```json
{ "status": "ok", "service": "domain-tls-probe-worker", "probeIpRange": "..." }
```

## Full probe

`POST /v1/probe`

```json
{
  "target": "example.com",
  "dnsMode": "recursive",
  "socketPort": 80
}
```

Returns full `ProbeResult` (dns, rdap, asn, http, tls, cert, socket).

## Per-tab probes

| Endpoint | Body |
|----------|------|
| `POST /v1/dns` | `{ "target", "dnsMode"? }` |
| `POST /v1/rdap` | `{ "target" }` |
| `POST /v1/asn` | `{ "target" }` |
| `POST /v1/http` | `{ "target" }` |
| `POST /v1/tls` | `{ "target" }` |
| `POST /v1/cert` | `{ "target" }` |
| `POST /v1/socket` | `{ "target", "socketPort"? }` |

## History (anonymous, in-memory)

- `GET /v1/history` — list recent probes
- `GET /v1/history/:id` — full result
- `GET /v1/history/diff/:a/:b` — compare two entries

## Alerts (Pro API)

`POST /v1/alerts/subscribe`

```json
{ "email": "you@example.com", "target": "example.com", "thresholds": [30, 14, 7, 1] }
```

## Rate limiting

60 requests per minute per IP (`x-forwarded-for`). Returns `429` when exceeded.

## Target formats

- Domain: `example.com`
- IP: `8.8.8.8`
- Host with port: `example.com:8443`
- URL: `https://example.com/path` (HTTP probe preserves path)
