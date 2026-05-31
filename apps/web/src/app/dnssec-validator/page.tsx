import { ProbePlayground } from '@/components/ProbePlayground';

export const metadata = {
  title: 'DNSSEC Validator — DomainTLSProbe',
  description: 'Validate DNSSEC chain for signed domains.',
};

export default function DnssecPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">DNSSEC Validator</h1>
      <ProbePlayground initialTarget="dnssec.works" />
    </div>
  );
}
