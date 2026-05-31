'use client';

import { useState, useCallback } from 'react';
import type { ProbeResult } from '@tls-dns-checker/shared-types';
import {
  AlertTriangle,
  Shield,
  Globe,
  Server,
  Lock,
  FileKey,
  Network,
  Plug,
  Copy,
  Download,
} from 'lucide-react';

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
  const [copied, setCopied] = useState(false);
  const certWarning = result.cert.chain[0]?.warning;
  const tabData = getTabData(result, tab);
  const json = JSON.stringify(tabData, null, 2);

  const copyJson = useCallback(async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [json]);

  const downloadJson = useCallback(() => {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `domain-tls-probe-${result.target.replace(/[^a-z0-9.-]+/gi, '_')}-${tab}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [json, result.target, tab]);

  return (
    <section className="rounded-xl border border-[var(--border)] bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] px-4 py-3">
        <div>
          <h2 className="font-semibold">{result.target}</h2>
          <p className="text-xs text-[var(--muted)]">
            {result.probeDurationMs}ms · {new Date(result.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
          <button
            type="button"
            onClick={copyJson}
            className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-2 py-1 text-xs hover:bg-[#f5f5f5]"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={downloadJson}
            className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-2 py-1 text-xs hover:bg-[#f5f5f5]"
          >
            <Download className="h-3.5 w-3.5" />
            JSON
          </button>
        </div>
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

      <div className="border-b border-[var(--border)] bg-[#fafafa] px-4 py-3 text-sm">
        <TabSummary result={result} tab={tab} />
      </div>

      <div className="max-h-[32rem] overflow-auto p-4">
        <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed">
          {json}
        </pre>
      </div>
    </section>
  );
}

function TabSummary({ result, tab }: { result: ProbeResult; tab: TabId }) {
  switch (tab) {
    case 'dns': {
      const n = result.dns.records.length;
      const sec = result.dns.dnssec.validated
        ? 'DNSSEC validated (AD)'
        : result.dns.dnssec.error ?? 'No DNSSEC validation';
      return (
        <p>
          <strong>{n}</strong> records ({result.dns.mode}) · {sec}
        </p>
      );
    }
    case 'rdap':
      return (
        <p>
          Registrar: <strong>{result.rdap.registrar ?? '—'}</strong>
          {result.rdap.expires ? ` · Expires ${result.rdap.expires}` : ''}
        </p>
      );
    case 'asn':
      return (
        <p>
          <strong>{result.asn.asn ?? '—'}</strong> · {result.asn.org ?? '—'} · {result.asn.ip}
        </p>
      );
    case 'http': {
      const last = result.http.hops[result.http.hops.length - 1];
      return (
        <p>
          {result.http.hops.length} hop(s) · Status <strong>{last?.status ?? '—'}</strong> ·{' '}
          {result.http.totalTimingMs}ms total
        </p>
      );
    }
    case 'tls':
      return (
        <p>
          <strong>{result.tls.protocol ?? '—'}</strong> · {result.tls.cipher ?? '—'}
          {result.tls.ocspStapling ? ' · OCSP stapled' : ''}
        </p>
      );
    case 'cert': {
      const c = result.cert.chain[0];
      if (!c) return <p>No certificate returned</p>;
      return (
        <p>
          <strong>{c.subject}</strong> · {c.daysRemaining} days left · Issuer: {c.issuer}
          {result.cert.chain.length > 1 ? ` · Chain: ${result.cert.chain.length} certs` : ''}
        </p>
      );
    }
    case 'socket':
      return (
        <p>
          Port <strong>{result.socket.port}</strong>
          {result.socket.banner
            ? ` · Banner: ${result.socket.banner.slice(0, 80)}${result.socket.banner.length > 80 ? '…' : ''}`
            : result.socket.error
              ? ` · ${result.socket.error}`
              : ' · No banner'}
        </p>
      );
  }
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
