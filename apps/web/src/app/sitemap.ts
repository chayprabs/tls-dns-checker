import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/dns-checker',
    '/tls-checker',
    '/ssl-checker',
    '/cert-expiry-checker',
    '/dnssec-validator',
    '/rdap-lookup',
    '/privacy',
    '/terms',
  ];
  return routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));
}
