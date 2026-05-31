import type { AlertSubscription } from '@tls-dns-checker/shared-types';

const subscriptions: AlertSubscription[] = [];

export function subscribeAlert(sub: AlertSubscription): { ok: boolean; message: string } {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sub.email)) {
    return { ok: false, message: 'Invalid email' };
  }
  subscriptions.push({
    ...sub,
    thresholds: sub.thresholds.length ? sub.thresholds : [30, 14, 7, 1],
  });
  return {
    ok: true,
    message: 'Pro alert subscription recorded (email delivery requires Pro deployment)',
  };
}

export function listAlerts(): AlertSubscription[] {
  return subscriptions.map(({ email, ...rest }) => ({
    ...rest,
    email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
  }));
}
