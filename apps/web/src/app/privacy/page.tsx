export const metadata = { title: 'Privacy Policy — DomainTLSProbe' };

export default function PrivacyPage() {
  return (
    <article className="max-w-none text-sm leading-relaxed text-[var(--foreground)]">
      <h1 className="text-2xl font-semibold">Privacy Policy</h1>
      <p className="text-[var(--muted)]">Last updated: 1 June 2026 · Version 2.0</p>

      <p className="mt-4 rounded-lg border border-[var(--border)] bg-[#fafafa] p-4 text-[var(--muted)]">
        This Privacy Policy describes how DomainTLSProbe (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
        handles information when you use the website, API, and related services (collectively, the
        &quot;Service&quot;). The Service is operated by Chaitanya Prabuddha as an open-source
        diagnostic project. By using the Service, you acknowledge this Policy.
      </p>

      <h2 className="mt-8 text-lg font-medium">1. Scope</h2>
      <p>
        This Policy applies to visitors and users of any DomainTLSProbe instance operated by the
        project maintainer, including self-hosted copies only to the extent the operator chooses to
        adopt it. If you self-host, you are responsible for your own compliance obligations.
      </p>

      <h2 className="mt-6 text-lg font-medium">2. Information we process</h2>
      <h3 className="mt-3 font-medium">2.1 Probe inputs</h3>
      <p>
        When you submit a domain name, IP address, hostname, or URL, we process that string solely
        to perform the technical lookups you request. Do not submit personal data you are not
        authorized to process (for example, third-party emails or credentials).
      </p>
      <h3 className="mt-3 font-medium">2.2 Technical data</h3>
      <p>We may automatically process:</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>IP address and request metadata (for rate limiting, abuse prevention, and security)</li>
        <li>Timestamps, probe duration, and coarse error codes</li>
        <li>User-agent and referrer where transmitted by your browser</li>
      </ul>
      <p className="mt-2">
        We do not intentionally log full probe response payloads indefinitely. Logs may exist
        transiently in server memory or short-lived operational logs.
      </p>
      <h3 className="mt-3 font-medium">2.3 Alert subscriptions (optional)</h3>
      <p>
        If you opt into certificate expiry alerts, we store the email address and target domain you
        provide for that feature only.
      </p>
      <h3 className="mt-3 font-medium">2.4 What we do not seek to collect</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>Accounts are not required for basic use</li>
        <li>We do not sell personal information</li>
        <li>We do not knowingly collect data from children under 16</li>
        <li>We do not use third-party advertising trackers on the Service</li>
      </ul>

      <h2 className="mt-6 text-lg font-medium">3. Legal bases (EEA/UK users)</h2>
      <p>Where the GDPR or UK GDPR applies, we rely on:</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>
          <strong>Legitimate interests</strong> — operating, securing, and improving a free
          diagnostic tool, balanced against your rights
        </li>
        <li>
          <strong>Contract</strong> — processing necessary to provide probes you request
        </li>
        <li>
          <strong>Consent</strong> — where you voluntarily subscribe to email alerts
        </li>
      </ul>

      <h2 className="mt-6 text-lg font-medium">4. How we use information</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Execute DNS, RDAP, TLS, HTTP, and related probes</li>
        <li>Maintain in-memory probe history on the server (anonymous, non-persistent across restarts)</li>
        <li>Enforce rate limits and prevent abuse</li>
        <li>Send expiry alert emails if you subscribed</li>
        <li>Comply with law and protect rights, safety, and security</li>
      </ul>

      <h2 className="mt-6 text-lg font-medium">5. Sharing and third parties</h2>
      <p>
        Probes inherently contact public networks and services (for example, DNS resolvers, RDAP
        registries, Certificate Transparency logs, ASN lookup infrastructure). Those systems
        receive the targets you submit and may log requests under their own policies.
      </p>
      <p className="mt-2">
        We do not sell your personal information. We may disclose information if required by law,
        court order, or to protect against fraud, abuse, or security threats.
      </p>

      <h2 className="mt-6 text-lg font-medium">6. International transfers</h2>
      <p>
        The Service may be hosted or accessed from multiple countries. By using the Service, you
        understand that information may be processed in jurisdictions that may not provide the
        same level of data protection as your home country.
      </p>

      <h2 className="mt-6 text-lg font-medium">7. Retention</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Anonymous probe history: in-memory until server restart or process recycle</li>
        <li>Rate-limit counters: short rolling windows (approximately one minute)</li>
        <li>Alert subscriptions: until you request deletion or the feature is discontinued</li>
        <li>Operational logs: minimal retention where logs exist at all</li>
      </ul>

      <h2 className="mt-6 text-lg font-medium">8. Your rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct, delete, restrict, or
        object to processing of your personal information, and to data portability or withdrawal of
        consent.
      </p>
      <p className="mt-2">
        California residents may have additional rights under the CCPA/CPRA (know, delete, correct,
        opt out of sale — we do not sell personal information).
      </p>
      <p className="mt-2">
        To exercise rights, contact us via GitHub:
        https://github.com/chayprabs/tls-dns-checker/issues — we will respond within a reasonable
        time as required by applicable law.
      </p>

      <h2 className="mt-6 text-lg font-medium">9. Security</h2>
      <p>
        We use reasonable technical measures appropriate to a free diagnostic tool. No method of
        transmission or storage is 100% secure. You use the Service at your own risk.
      </p>

      <h2 className="mt-6 text-lg font-medium">10. Changes</h2>
      <p>
        We may update this Policy at any time. The &quot;Last updated&quot; date will change.
        Continued use after changes constitutes acceptance where permitted by law.
      </p>

      <h2 className="mt-6 text-lg font-medium">11. Contact</h2>
      <p>
        Operator: Chaitanya Prabuddha · Project:
        https://github.com/chayprabs/tls-dns-checker
      </p>

      <h2 className="mt-6 text-lg font-medium">12. Relationship to Terms</h2>
      <p>
        This Policy is incorporated by reference into our{' '}
        <a href="/terms" className="text-[var(--accent)] hover:underline">
          Terms &amp; Conditions
        </a>
        . Diagnostic results are not professional advice.
      </p>
    </article>
  );
}
