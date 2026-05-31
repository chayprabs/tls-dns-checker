import type { Metadata } from 'next';
import './globals.css';
import { TopBar } from '@/components/TopBar';
import { SeoBar } from '@/components/SeoBar';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'DomainTLSProbe — DNS, TLS & Certificate Checker',
  description:
    'Check DNS, RDAP, TLS, certificate chain, ASN and socket banners online — with DNSSEC validation, CT logs and expiry alerts.',
  keywords: [
    'dns',
    'tls',
    'ssl',
    'tls-certificate',
    'certificate-chain',
    'dnssec',
    'rdap',
    'whois',
    'asn',
    'ocsp',
    'ct-logs',
    'domain-tools',
    'network-diagnostics',
    'ssl-checker',
    'online-tool',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'DomainTLSProbe',
    description:
      'All-in-one domain probe: DNS, RDAP, TLS, certificates, ASN, and socket banners.',
    type: 'website',
    siteName: 'DomainTLSProbe',
  },
  twitter: {
    card: 'summary',
    title: 'DomainTLSProbe',
    description: 'Online DNS, TLS, and certificate diagnostics in one probe.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <TopBar />
        <SeoBar />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
