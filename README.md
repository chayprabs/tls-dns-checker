# DomainTLSProbe (`tls-dns-checker`)

Check DNS, RDAP, TLS, certificate chain, ASN and socket banners online — with DNSSEC validation, CT logs and expiry alerts.

All-in-one domain probe playground: enter a domain or IP, run a single probe, and inspect tabbed results for DNS, RDAP, ASN, HTTP redirects, TLS handshake, certificates, and socket banners.

![DomainTLSProbe](docs/screenshot-placeholder.md)

## Features

| Area | Capability |
|------|------------|
| **DNS** | A, AAAA, CNAME, MX, TXT, NS, SOA, SRV, CAA, DS, DNSKEY, PTR (reverse) |
| **DNSSEC** | AD flag / DS / DNSKEY hints; recursive vs authoritative |
| **RDAP** | Registrar, dates, statuses, nameservers (domain + IP) |
| **ASN** | Team Cymru lookup — ASN, prefix, org |
| **HTTP** | Redirect chain, status, headers, timings (`http://` and paths preserved) |
| **TLS** | Protocol, cipher, ALPN, SNI, OCSP stapling, session resumption |
| **Certificate** | Full chain, SANs, validity, CT logs (crt.sh), expiry warnings |
| **Socket** | Configurable port banner grab (HTTP probe on port 80) |
| **History** | In-memory recent probes with restore |
| **Alerts** | Pro subscription API (30/14/7/1 day thresholds) |

## Quick start

```bash
pnpm install
pnpm --filter @tls-dns-checker/shared-types build
pnpm dev
```

- **Web:** http://localhost:3000
- **Worker API:** http://localhost:8787

## Docker

```bash
docker compose up --build
```

Set `PROBE_IP_RANGE` to your deployment egress CIDR so users can allowlist probe traffic. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

Worker-only:

```bash
docker compose -f docker-compose.single.yml up --build
```

## API

Full reference: [docs/API.md](docs/API.md)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/v1/probe` | POST | Full probe |
| `/v1/dns` | POST | DNS only |
| `/v1/rdap` | POST | RDAP only |
| `/v1/asn` | POST | ASN only |
| `/v1/http` | POST | HTTP only |
| `/v1/tls` | POST | TLS only |
| `/v1/cert` | POST | Certificate only |
| `/v1/socket` | POST | Socket banner |
| `/v1/history` | GET | List recent probes |
| `/v1/history/:id` | GET | Get probe by id |
| `/v1/alerts/subscribe` | POST | Expiry alert subscription |

## SEO routes

- `/` — main playground
- `/dns-checker`, `/tls-checker`, `/ssl-checker`
- `/cert-expiry-checker`, `/dnssec-validator`, `/rdap-lookup`
- `/privacy`, `/terms`

## Development

```bash
pnpm typecheck   # TypeScript
pnpm test        # Unit tests
pnpm build       # Production build
pnpm format      # Prettier
```

## Self-host & license

AGPL-3.0 — see [LICENSE](./LICENSE). Contributions: [CONTRIBUTING.md](./CONTRIBUTING.md). Security: [SECURITY.md](./SECURITY.md).

## Links

- **GitHub:** https://github.com/chayprabs/tls-dns-checker
- **Maintainer:** https://www.chaitanyaprabuddha.com
