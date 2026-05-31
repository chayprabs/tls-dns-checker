'use client';

import { useState } from 'react';
import type { ProbeResult } from '@tls-dns-checker/shared-types';
import { AlertTriangle, Shield, Globe, Server, Lock, FileKey, Network, Plug } from 'lucide-react';

const TABS = [
  { id: 'dns', label: 'DNS', icon: Globe },
  { id: 'rdap', label: 'RDAP', icon: FileKey },
  { id: 'asn', label: 'ASN', icon: Network },
  { id: 'http', label: 'HTTP', icon: Server },
  { id: 'tls', label: 'TLS', icon: Lock },
  { id: 'cert', label: 'Certificate', icon: Shield },
  { id: 'socket', label: 'Socket', icon: Plug },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function ProbeResults({
  result,
  initialTab,
}: {
  result: ProbeResult;
  initialTab?: TabId;
}) {
  const [tab, setTab] = useState<TabId>(initialTab ?? 'dns');
  const certWarning = result.cert.chain[0]?.warning;

  return (
    <section className="rounded-xl border border-[var(--border)] bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] px-4 py-3">
        <div>
          <h2 className="font-semibold">{result.target}</h2>
          <p className="text-xs text-[var(--muted)]">
            {result.probeDurationMs}ms · {new Date(result.timestamp).toLocaleString()}
          </p>
        </div>
        {certWarning && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
              certWarning === 'expired'
                ? 'bg-red-100 text-[var(--danger)]'
                : 'bg-amber-100 text-[var(--warning)]'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            {certWarning === 'expired' ? 'Certificate expired' : 'Certificate expiring soon'}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1 border-b border-[var(--border)] px-2 py-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition ${
              tab === id
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--muted)] hover:bg-[#f5f5f5]'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="max-h-[32rem] overflow-auto p-4">
        <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed">
          {JSON.stringify(getTabData(result, tab), null, 2)}
        </pre>
      </div>
    </section>
  );
}

function getTabData(result: ProbeResult, tab: TabId): unknown {
  switch (tab) {
    case 'dns':
      return result.dns;
    case 'rdap':
      return result.rdap;
    case 'asn':
      return result.asn;
    case 'http':
      return result.http;
    case 'tls':
      return result.tls;
    case 'cert':
      return result.cert;
    case 'socket':
      return result.socket;
  }
}
