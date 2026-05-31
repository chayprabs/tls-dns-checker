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
    'certificate',
    'dnssec',
    'rdap',
    'asn',
    'domain tools',
  ],
  openGraph: {
    title: 'DomainTLSProbe',
    description:
      'All-in-one domain probe: DNS, RDAP, TLS, certificates, ASN, and socket banners.',
  },
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
