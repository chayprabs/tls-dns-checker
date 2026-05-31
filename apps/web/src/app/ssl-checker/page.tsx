import { ProbePlayground } from '@/components/ProbePlayground';

export const metadata = {
  title: 'SSL Checker — DomainTLSProbe',
  description: 'Online SSL/TLS certificate and chain inspection.',
};

export default function SslCheckerPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">SSL Checker</h1>
      <ProbePlayground />
    </div>
  );
}
