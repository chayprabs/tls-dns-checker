export const metadata = { title: 'Terms & Conditions — DomainTLSProbe' };

export default function TermsPage() {
  return (
    <article className="prose prose-neutral max-w-none text-sm leading-relaxed text-[var(--foreground)]">
      <h1 className="text-2xl font-semibold">Terms &amp; Conditions</h1>
      <p className="text-[var(--muted)]">Last updated: May 31, 2026</p>

      <h2 className="mt-6 text-lg font-medium">Acceptance</h2>
      <p>
        By using DomainTLSProbe you agree to these terms. If you do not agree, do not use the
        Service.
      </p>

      <h2 className="mt-6 text-lg font-medium">Permitted use</h2>
      <p>
        You may use the Service to diagnose domains and infrastructure you own or are authorized to
        test. You must not use the Service for denial-of-service attacks, bulk scanning of networks
        you do not control, or any unlawful purpose.
      </p>

      <h2 className="mt-6 text-lg font-medium">Prohibited use</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Automated abuse that exceeds reasonable rate limits</li>
        <li>Attempting to bypass security controls of third parties</li>
        <li>Uploading malware or illegal content (not applicable to this tool&apos;s inputs)</li>
      </ul>

      <h2 className="mt-6 text-lg font-medium">No warranty</h2>
      <p>
        THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
        INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
      </p>

      <h2 className="mt-6 text-lg font-medium">Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE OPERATORS AND CONTRIBUTORS SHALL NOT BE LIABLE
        FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
        PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE, EVEN IF ADVISED OF THE
        POSSIBILITY OF SUCH DAMAGES. OUR TOTAL LIABILITY SHALL NOT EXCEED USD $100 OR THE AMOUNT YOU
        PAID US IN THE TWELVE MONTHS PRECEDING THE CLAIM, WHICHEVER IS GREATER.
      </p>

      <h2 className="mt-6 text-lg font-medium">Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless the operators from claims arising from your misuse
        of the Service or violation of these terms.
      </p>

      <h2 className="mt-6 text-lg font-medium">Open source</h2>
      <p>
        Source code is licensed under AGPL-3.0. Self-hosting is subject to the same license terms.
      </p>

      <h2 className="mt-6 text-lg font-medium">Changes</h2>
      <p>We may update these terms. Continued use after changes constitutes acceptance.</p>

      <h2 className="mt-6 text-lg font-medium">Governing law</h2>
      <p>
        These terms are governed by the laws applicable in the operator&apos;s jurisdiction, without
        regard to conflict-of-law principles.
      </p>
    </article>
  );
}
