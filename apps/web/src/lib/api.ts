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
    throw new Error(
      formatApiError((err as { error?: unknown }).error, `Probe failed (${res.status})`),
    );
  }
  return res.json();
}

export async function fetchHistory(): Promise<HistoryEntry[]> {
  const res = await fetch(`${API_BASE}/v1/history`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.history ?? [];
}

function formatApiError(err: unknown, fallback: string): string {
  if (typeof err === 'string') return err;
  if (err && typeof err === 'object') {
    const e = err as { fieldErrors?: Record<string, string[]>; formErrors?: string[] };
    const parts = [...(e.formErrors ?? [])];
    if (e.fieldErrors) {
      for (const [k, v] of Object.entries(e.fieldErrors)) {
        parts.push(`${k}: ${v.join(', ')}`);
      }
    }
    if (parts.length) return parts.join('; ');
  }
  return fallback;
}

export async function subscribeAlerts(email: string, target: string): Promise<string> {
  const res = await fetch(`${API_BASE}/v1/alerts/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, target, thresholds: [30, 14, 7, 1] }),
  });
  const data = (await res.json()) as { message?: string; error?: unknown };
  if (!res.ok) {
    throw new Error(formatApiError(data.error, data.message ?? 'Subscribe failed'));
  }
  return data.message ?? 'Subscribed';
}
