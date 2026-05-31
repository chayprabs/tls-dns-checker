import { ProbePlayground } from '@/components/ProbePlayground';

export const metadata = {
  title: 'DNS Checker — DomainTLSProbe',
  description: 'Check DNS records and DNSSEC validation for any domain.',
};

export default function DnsCheckerPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">DNS Checker</h1>
      <ProbePlayground />
    </div>
  );
}
