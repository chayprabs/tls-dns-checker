import { ProbePlayground } from '@/components/ProbePlayground';

export const metadata = {
  title: 'TLS Checker — DomainTLSProbe',
  description: 'Inspect TLS handshake metadata and cipher suites.',
};

export default function TlsCheckerPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">TLS Checker</h1>
      <ProbePlayground />
    </div>
  );
}
