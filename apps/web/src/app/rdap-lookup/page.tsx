import { ProbePlayground } from '@/components/ProbePlayground';

export const metadata = {
  title: 'RDAP Lookup — DomainTLSProbe',
  description: 'RDAP/WHOIS registration data lookup.',
};

export default function RdapPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">RDAP Lookup</h1>
      <ProbePlayground initialTarget="example.com" initialTab="rdap" />
    </div>
  );
}
