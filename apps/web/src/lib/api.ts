import type { ProbeRequest, ProbeResult, HistoryEntry } from '@tls-dns-checker/shared-types';

const API_BASE = '/api';

export async function runProbe(req: ProbeRequest): Promise<ProbeResult> {
  const res = await fetch(`${API_BASE}/v1/probe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg =
      typeof (err as { error?: unknown }).error === 'string'
        ? (err as { error: string }).error
        : JSON.stringify((err as { error?: unknown }).error ?? err);
    throw new Error(msg || `Probe failed (${res.status})`);
  }
  return res.json();
}

export async function fetchHistory(): Promise<HistoryEntry[]> {
  const res = await fetch(`${API_BASE}/v1/history`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.history ?? [];
}

export async function subscribeAlerts(email: string, target: string): Promise<string> {
  const res = await fetch(`${API_BASE}/v1/alerts/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, target, thresholds: [30, 14, 7, 1] }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { message?: string }).message ?? 'Subscribe failed');
  return (data as { message: string }).message;
}
