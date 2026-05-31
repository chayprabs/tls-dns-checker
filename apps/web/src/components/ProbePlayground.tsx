'use client';

import { useState, useCallback, useEffect } from 'react';
import type { ProbeResult } from '@tls-dns-checker/shared-types';
import { runProbe, fetchHistory, subscribeAlerts } from '@/lib/api';
import { ProbeResults } from './ProbeResults';
import { Loader2, Search, History, Bell } from 'lucide-react';

const SAMPLES = ['example.com', 'google.com', 'github.com'];

export function ProbePlayground({
  initialTarget,
  initialTab,
  autoRun = false,
}: {
  initialTarget?: string;
  initialTab?: 'dns' | 'rdap' | 'asn' | 'http' | 'tls' | 'cert' | 'socket';
  autoRun?: boolean;
}) {
  const [target, setTarget] = useState(initialTarget ?? '');
  const [dnsMode, setDnsMode] = useState<'recursive' | 'authoritative'>('recursive');
  const [socketPort, setSocketPort] = useState(80);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProbeResult | null>(null);
  const [history, setHistory] = useState<{ id: string; target: string; timestamp: string }[]>([]);
  const [alertEmail, setAlertEmail] = useState('');
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    const h = await fetchHistory();
    setHistory(h.map((e) => ({ id: e.id, target: e.target, timestamp: e.timestamp })));
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleProbe = useCallback(async () => {
    if (!target.trim()) {
      setError('Enter a domain, IP, or hostname:port');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await runProbe({ target: target.trim(), dnsMode, socketPort });
      setResult(data);
      await loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Probe failed');
    } finally {
      setLoading(false);
    }
  }, [target, dnsMode, socketPort, loadHistory]);

  useEffect(() => {
    if (autoRun && initialTarget?.trim()) {
      void handleProbe();
    }
  }, [autoRun, initialTarget, handleProbe]);

  const handleSubscribe = async () => {
    if (!alertEmail || !target.trim()) return;
    try {
      const msg = await subscribeAlerts(alertEmail, target.trim());
      setAlertMsg(msg);
    } catch (err) {
      setAlertMsg(err instanceof Error ? err.message : 'Failed');
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleProbe()}
              placeholder="example.com or 1.1.1.1 or host:443"
              className="w-full rounded-lg border border-[var(--border)] bg-[#fafafa] py-3 pl-10 pr-4 text-base outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
              aria-label="Probe target"
            />
          </div>
          <button
            type="button"
            onClick={handleProbe}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-6 py-3 font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? 'Probing…' : 'Run probe'}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-[var(--muted)]">DNS mode:</span>
            <select
              value={dnsMode}
              onChange={(e) => setDnsMode(e.target.value as 'recursive' | 'authoritative')}
              className="rounded border border-[var(--border)] bg-white px-2 py-1"
            >
              <option value="recursive">Recursive</option>
              <option value="authoritative">Authoritative</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-[var(--muted)]">Banner port:</span>
            <input
              type="number"
              min={1}
              max={65535}
              value={socketPort}
              onChange={(e) => setSocketPort(Number(e.target.value))}
              className="w-20 rounded border border-[var(--border)] bg-white px-2 py-1"
            />
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[var(--muted)]">Samples:</span>
            {SAMPLES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setTarget(s)}
                className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs hover:bg-[#f5f5f5]"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {history.length > 0 && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <History className="h-4 w-4 text-[var(--muted)]" />
            <select
              className="flex-1 rounded border border-[var(--border)] bg-white px-2 py-1"
              onChange={(e) => {
                const h = history.find((x) => x.id === e.target.value);
                if (h) setTarget(h.target);
              }}
              defaultValue=""
            >
              <option value="" disabled>
                Recent probes…
              </option>
              {history.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.target} — {new Date(h.timestamp).toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--danger)]" role="alert">
            {error}
          </p>
        )}
      </section>

      {result && <ProbeResults result={result} initialTab={initialTab} />}

      <section className="rounded-xl border border-dashed border-[var(--border)] bg-[#fafafa] p-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Bell className="h-4 w-4" />
          Subscribe to expiry alerts (Pro)
        </div>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Email alerts at 30, 14, 7, and 1 days before certificate expiry.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            placeholder="you@example.com"
            value={alertEmail}
            onChange={(e) => setAlertEmail(e.target.value)}
            className="flex-1 rounded border border-[var(--border)] px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={handleSubscribe}
            className="rounded-lg border border-[var(--accent)] px-4 py-2 text-sm text-[var(--accent)] hover:bg-blue-50"
          >
            Subscribe
          </button>
        </div>
        {alertMsg && <p className="mt-2 text-xs text-[var(--muted)]">{alertMsg}</p>}
      </section>
    </div>
  );
}
