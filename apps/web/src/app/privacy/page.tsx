export const metadata = { title: 'Privacy Policy — DomainTLSProbe' };

export default function PrivacyPage() {
  return (
    <article className="prose prose-neutral max-w-none text-sm leading-relaxed text-[var(--foreground)]">
      <h1 className="text-2xl font-semibold">Privacy Policy</h1>
      <p className="text-[var(--muted)]">Last updated: May 31, 2026</p>

      <h2 className="mt-6 text-lg font-medium">Summary</h2>
      <p>
        DomainTLSProbe (&quot;the Service&quot;) is operated as an open-source diagnostic tool. We
        collect minimal technical data necessary to run network probes. We do not sell personal
        data.
      </p>

      <h2 className="mt-6 text-lg font-medium">What we collect</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Probe targets</strong> — domains, IPs, or hostnames you submit are used only to
          perform the requested lookups.
        </li>
        <li>
          <strong>Technical logs</strong> — timestamps, probe duration, and error codes for rate
          limiting and abuse prevention. We do not log full response bodies indefinitely.
        </li>
        <li>
          <strong>Alert subscriptions (Pro)</strong> — if you opt in, we store your email and
          target domain solely to send certificate expiry notices.
        </li>
      </ul>

      <h2 className="mt-6 text-lg font-medium">What we do not collect</h2>
      <p>
        We do not require accounts for basic use. We do not collect names, payment card data (unless
        you use a separate billing provider later), or browsing history outside this tool.
      </p>

      <h2 className="mt-6 text-lg font-medium">Retention</h2>
      <p>
        Anonymous probe history is kept in server memory only and is cleared on restart. Self-hosted
        deployments control their own retention. Pro persistent history follows your subscription
        settings.
      </p>

      <h2 className="mt-6 text-lg font-medium">Third parties</h2>
      <p>
        Probes may query public infrastructure (RDAP registries, crt.sh, Team Cymru DNS). Those
        services have their own policies.
      </p>

      <h2 className="mt-6 text-lg font-medium">Your rights</h2>
      <p>
        Depending on your jurisdiction you may request access, correction, or deletion of alert
        subscription data by contacting the repository maintainer via GitHub issues.
      </p>

      <h2 className="mt-6 text-lg font-medium">Disclaimer</h2>
      <p>
        Results are provided &quot;as is&quot; for informational purposes only. Not legal or security
        advice.
      </p>
    </article>
  );
}
