# Contributing

Thanks for contributing to DomainTLSProbe.

## Setup

```bash
pnpm install
pnpm --filter @tls-dns-checker/shared-types build
pnpm dev
```

## Checks before PR

```bash
pnpm typecheck
pnpm test
pnpm build
```

## Commits

Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`.

## Security

Report vulnerabilities via GitHub Security Advisories — see [SECURITY.md](./SECURITY.md).
