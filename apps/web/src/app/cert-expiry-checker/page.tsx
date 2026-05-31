import { ProbePlayground } from '@/components/ProbePlayground';

export const metadata = {
  title: 'Certificate Expiry Checker — DomainTLSProbe',
  description: 'Check SSL certificate expiry and get warning badges.',
};

export default function CertExpiryPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Certificate Expiry Checker</h1>
      <ProbePlayground initialTarget="expired.badssl.com" />
    </div>
  );
}
