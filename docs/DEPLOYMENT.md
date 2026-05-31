# Deployment

## Environment variables

| Variable | Service | Description |
|----------|---------|-------------|
| `PORT` | worker | API port (default `8787`) |
| `PROBE_IP_RANGE` | worker | Documented CIDR for firewall allowlists |
| `WORKER_URL` | web (build) | Worker URL for `/api` rewrites |
| `NEXT_PUBLIC_SITE_URL` | web | Canonical URL for sitemap/robots |

## Docker Compose (recommended)

```bash
docker compose up --build
```

- Web: http://localhost:3000
- Worker: http://localhost:8787

Build web with worker URL baked in:

```bash
docker build -f apps/web/Dockerfile --build-arg WORKER_URL=http://worker:8787 -t domain-tls-probe-web .
```

## Fly.io (worker)

Deploy `apps/worker/Dockerfile` with public IP. Set `PROBE_IP_RANGE` to your Fly egress range and document it in README for users who allowlist probes.

## GitHub topics

Suggested repo topics: `dns`, `tls`, `ssl`, `tls-certificate`, `certificate-chain`, `dnssec`, `rdap`, `whois`, `asn`, `ocsp`, `ct-logs`, `domain-tools`, `network-diagnostics`, `ssl-checker`, `online-tool`
