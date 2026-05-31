import type { HistoryEntry, ProbeResult } from '@tls-dns-checker/shared-types';
import { randomUUID } from 'node:crypto';

const MAX_HISTORY = 50;
const store: HistoryEntry[] = [];

export function addHistory(result: ProbeResult): HistoryEntry {
  const entry: HistoryEntry = {
    id: randomUUID(),
    target: result.target,
    timestamp: result.timestamp,
    summary: {
      dnsRecords: result.dns.records.length,
      certDaysRemaining: result.cert.chain[0]?.daysRemaining,
      httpStatus: result.http.hops[result.http.hops.length - 1]?.status,
    },
    result,
  };
  store.unshift(entry);
  if (store.length > MAX_HISTORY) store.pop();
  return entry;
}

export function listHistory(): HistoryEntry[] {
  return store.map(({ result: _, ...rest }) => rest);
}

export function getHistory(id: string): HistoryEntry | undefined {
  return store.find((e) => e.id === id);
}

export function diffHistory(idA: string, idB: string): unknown {
  const a = getHistory(idA)?.result;
  const b = getHistory(idB)?.result;
  if (!a || !b) return { error: 'History entries not found' };
  return {
    targetChanged: a.target !== b.target,
    certDaysDelta:
      (a.cert.chain[0]?.daysRemaining ?? 0) - (b.cert.chain[0]?.daysRemaining ?? 0),
    dnsRecordDelta: a.dns.records.length - b.dns.records.length,
  };
}
