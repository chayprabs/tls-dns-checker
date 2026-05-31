# Security Policy

## Reporting

Please report security vulnerabilities via **GitHub Security Advisories** on this repository:

https://github.com/chayprabs/tls-dns-checker/security/advisories

Do not open public GitHub issues for undisclosed security bugs.

## Scope

In scope:

- Worker API (`/v1/*`) authentication, rate limiting, and input validation
- TLS/certificate parsing and outbound probe safety
- Log handling and accidental secret exposure
- Docker/compose misconfiguration with security impact

Out of scope:

- Social engineering, physical attacks, or denial-of-service from excessive legitimate traffic
- Vulnerabilities in third-party DNS/RDAP/CT infrastructure
- Issues requiring physical access to operator hardware

## Supported versions

| Version | Supported |
|---------|-----------|
| `main`  | Yes       |

## Safe harbor

We appreciate responsible disclosure. We make no commitment to bug bounties or compensation unless
expressly agreed in writing.

## Legal

Use of the Service is subject to the [Terms & Conditions](apps/web/src/app/terms/page.tsx). The
software is provided under AGPL-3.0 without warranty — see [NOTICE.md](./NOTICE.md).
