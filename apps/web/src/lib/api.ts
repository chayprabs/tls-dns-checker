import type { ProbeRequest, ProbeResult, HistoryEntry } from '@tls-dns-checker/shared-types';

const API_BASE = '/api';

const FRIENDLY: Record<string, string> = {
  'String must contain at least 1 character(s)': 'Target is required',
  'Number must be less than or equal to 65535': 'Port must be between 1 and 65535',
  'Number must be greater than or equal to 1': 'Port must be at least 1',
  'Invalid email': 'Enter a valid email address',
};

function formatApiError(err: unknown, fallback: string): string {
  if (typeof err === 'string') return FRIENDLY[err] ?? err;
  if (err && typeof err === 'object') {
    const e = err as { fieldErrors?: Record<string, string[]>; formErrors?: string[] };
    const parts = [...(e.formErrors ?? [])];
    if (e.fieldErrors) {
      for (const [k, v] of Object.entries(e.fieldErrors)) {
        const msgs = v.map((m) => FRIENDLY[m] ?? m);
        parts.push(`${k}: ${msgs.join(', ')}`);
      }
    }
    if (parts.length) return parts.join('; ');
  }
  return fallback;
}

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
  if (!res.ok) throw new Error(`History unavailable (${res.status})`);
  const data = await res.json();
  return data.history ?? [];
}

export async function fetchHistoryEntry(id: string): Promise<HistoryEntry | null> {
  const res = await fetch(`${API_BASE}/v1/history/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function subscribeAlerts(email: string, target: string): Promise<string> {
  const res = await fetch(`${API_BASE}/v1/alerts/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, target, thresholds: [30, 14, 7, 1] }),
  });
  const data = (await res.json()) as { message?: string; error?: unknown; ok?: boolean };
  if (!res.ok) {
    throw new Error(formatApiError(data.error, data.message ?? 'Subscribe failed'));
  }
  return data.message ?? 'Subscribed';
}
