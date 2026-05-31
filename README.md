# DomainTLSProbe (`tls-dns-checker`)

Check DNS, RDAP, TLS, certificate chain, ASN and socket banners online — with DNSSEC validation, CT logs and expiry alerts.

All-in-one domain probe playground: enter a domain or IP, run a single probe, and inspect tabbed results for DNS, RDAP, ASN, HTTP redirects, TLS handshake, certificates, and socket banners.

## Features

- **DNS** — A, AAAA, CNAME, MX, TXT, NS, SOA, SRV, CAA, DS, DNSKEY with recursive/authoritative toggle and DNSSEC hints
- **RDAP** — normalized registration fields
- **ASN** — Team Cymru IP → ASN → prefix → org
- **HTTP** — redirect chain with status, headers, timings
- **TLS** — protocol, cipher, ALPN, SNI
- **Certificate** — chain, SANs, validity, CT logs (crt.sh), expiry warnings
- **Socket** — configurable port banner grab
- **History** — in-memory recent probes
- **Alerts** — Pro subscription API for expiry emails (30/14/7/1 days)

## Quick start

```bash
pnpm install
pnpm --filter @tls-dns-checker/shared-types build
pnpm dev
```

- Web: http://localhost:3000
- Worker API: http://localhost:8787

## Docker

```bash
docker compose up --build
```

Probe traffic originates from the worker container. Document your deployment IP range in `PROBE_IP_RANGE` for firewall allowlisting.

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/probe` | POST | Full probe |
| `/v1/dns` | POST | DNS only |
| `/v1/tls` | POST | TLS only |
| `/v1/cert` | POST | Certificate only |
| `/health` | GET | Health check |

## SEO routes

- `/dns-checker`
- `/tls-checker`
- `/ssl-checker`
- `/cert-expiry-checker`
- `/dnssec-validator`
- `/rdap-lookup`

## Self-host

AGPL-3.0 — see [LICENSE](./LICENSE). Contributions welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Links

- GitHub: https://github.com/chayprabs/tls-dns-checker
- Maintainer: https://www.chaitanyaprabuddha.com
