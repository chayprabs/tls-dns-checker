export const metadata = { title: 'Terms & Conditions — DomainTLSProbe' };

export default function TermsPage() {
  return (
    <article className="max-w-none text-sm leading-relaxed text-[var(--foreground)]">
      <h1 className="text-2xl font-semibold">Terms &amp; Conditions</h1>
      <p className="text-[var(--muted)]">Last updated: 1 June 2026 · Version 2.0</p>

      <p className="mt-4 rounded-lg border border-[var(--border)] bg-[#fafafa] p-4 text-[var(--muted)]">
        PLEASE READ CAREFULLY. These Terms &amp; Conditions (&quot;Terms&quot;) are a binding
        agreement between you (&quot;you&quot;, &quot;User&quot;) and Chaitanya Prabuddha
        (&quot;Operator&quot;, &quot;we&quot;, &quot;us&quot;) governing use of DomainTLSProbe
        (the &quot;Service&quot;). If you do not agree, do not access or use the Service.
      </p>

      <h2 className="mt-8 text-lg font-medium">1. The Service</h2>
      <p>
        DomainTLSProbe is an online diagnostic tool that performs DNS, RDAP, TLS, HTTP, certificate,
        ASN, and related technical lookups against targets you submit. The Service is provided free
        of charge unless otherwise stated. Source code is licensed separately under the GNU Affero
        General Public License v3.0 (&quot;AGPL&quot;) — use of the hosted Service is governed by
        these Terms, not by the AGPL alone.
      </p>

      <h2 className="mt-6 text-lg font-medium">2. No professional advice</h2>
      <p>
        OUTPUTS ARE FOR GENERAL INFORMATIONAL PURPOSES ONLY. The Service does not provide legal,
        security, compliance, investment, or professional advice. You are solely responsible for
        decisions you make based on probe results. We do not warrant accuracy, completeness,
        timeliness, or fitness for any purpose. Third-party networks, caches, and registries may
        cause stale or incorrect data.
      </p>

      <h2 className="mt-6 text-lg font-medium">3. Eligibility</h2>
      <p>
        You must be at least 16 years old and have legal capacity to enter these Terms. By using the
        Service, you represent that you meet these requirements.
      </p>

      <h2 className="mt-6 text-lg font-medium">4. Acceptable use</h2>
      <p>You may use the Service only to test domains, hosts, or networks that you:</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>Own or control, or</li>
        <li>Have explicit written authorization to test.</li>
      </ul>

      <h2 className="mt-6 text-lg font-medium">5. Prohibited conduct</h2>
      <p>You must not:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Probe systems without authorization or violate any applicable law</li>
        <li>Conduct denial-of-service attacks, port sweeping, or harassment</li>
        <li>Circumvent rate limits, authentication, or security controls</li>
        <li>Submit unlawful content or targets intended to harm others</li>
        <li>Reverse engineer the Service to build a competing service in violation of law or license</li>
        <li>Use the Service in violation of export control, sanctions, or embargo laws</li>
        <li>Scrape or automate access beyond reasonable personal use and published limits</li>
      </ul>

      <h2 className="mt-6 text-lg font-medium">6. Your responsibilities</h2>
      <p>
        You are solely responsible for targets you submit and for compliance with privacy, computer
        misuse, telecommunications, and data-protection laws in every jurisdiction that applies to
        you. You will indemnify the Operator as stated in Section 12.
      </p>

      <h2 className="mt-6 text-lg font-medium">7. Disclaimer of warranties</h2>
      <p className="uppercase">
        TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, THE SERVICE AND ALL RESULTS ARE PROVIDED
        &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTY OF ANY KIND, WHETHER EXPRESS,
        IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, ACCURACY, AND
        QUIET ENJOYMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE,
        SECURE, OR FREE OF HARMFUL COMPONENTS.
      </p>

      <h2 className="mt-6 text-lg font-medium">8. Limitation of liability</h2>
      <p className="uppercase">
        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW IN ANY JURISDICTION, IN NO EVENT SHALL THE
        OPERATOR, CONTRIBUTORS, LICENSORS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
        SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE,
        DATA, GOODWILL, BUSINESS INTERRUPTION, OR PROCUREMENT OF SUBSTITUTE SERVICES, ARISING OUT OF
        OR RELATED TO THE SERVICE OR THESE TERMS, WHETHER BASED ON WARRANTY, CONTRACT, TORT
        (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR ANY OTHER THEORY, EVEN IF ADVISED OF THE
        POSSIBILITY OF SUCH DAMAGES.
      </p>
      <p className="mt-3 uppercase">
        OUR AGGREGATE LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE SERVICE OR THESE
        TERMS SHALL NOT EXCEED THE GREATER OF (A) ONE HUNDRED U.S. DOLLARS (USD $100) OR (B) THE
        TOTAL AMOUNT YOU PAID TO US FOR THE SERVICE IN THE TWELVE (12) MONTHS BEFORE THE EVENT
        GIVING RISE TO LIABILITY. IF YOU PAID NOTHING, THE CAP IS USD $100.
      </p>
      <p className="mt-3">
        Some jurisdictions do not allow certain limitations; in those jurisdictions, our liability
        is limited to the greatest extent permitted by law.
      </p>

      <h2 className="mt-6 text-lg font-medium">9. Indemnification</h2>
      <p>
        You agree to defend, indemnify, and hold harmless the Operator, contributors, and affiliates
        from and against any claims, damages, losses, liabilities, costs, and expenses (including
        reasonable attorneys&apos; fees) arising out of or related to: (a) your use of the Service;
        (b) targets you submit or probes you initiate; (c) your violation of these Terms or any law;
        (d) your violation of third-party rights; or (e) content or conduct attributable to you.
      </p>

      <h2 className="mt-6 text-lg font-medium">10. Third-party services</h2>
      <p>
        The Service queries third-party infrastructure (DNS, RDAP, CT logs, etc.). We are not
        responsible for third-party availability, policies, or actions. Links to external sites are
        not endorsements.
      </p>

      <h2 className="mt-6 text-lg font-medium">11. Intellectual property</h2>
      <p>
        We retain rights in the Service branding and site content except open-source components
        under their respective licenses. AGPL software is provided under AGPL terms; if you
        modify and deploy networked copies, you must comply with AGPL source-offer obligations.
      </p>

      <h2 className="mt-6 text-lg font-medium">12. Privacy</h2>
      <p>
        Our{' '}
        <a href="/privacy" className="text-[var(--accent)] hover:underline">
          Privacy Policy
        </a>{' '}
        is incorporated by reference.
      </p>

      <h2 className="mt-6 text-lg font-medium">13. Suspension and termination</h2>
      <p>
        We may suspend or terminate access at any time, without notice, for abuse, risk to the
        Service, legal requirements, or any reason. Sections that by nature should survive will
        survive (including Sections 2, 7–9, 11, 14–18).
      </p>

      <h2 className="mt-6 text-lg font-medium">14. Dispute resolution</h2>
      <p>
        <strong>Informal resolution.</strong> Before filing a claim, you agree to contact us via
        GitHub issues and allow thirty (30) days to attempt informal resolution.
      </p>
      <p className="mt-2">
        <strong>Governing law.</strong> These Terms are governed by the laws of India, without regard
        to conflict-of-law rules that would apply another jurisdiction&apos;s laws.
      </p>
      <p className="mt-2">
        <strong>Jurisdiction.</strong> Subject to Section 14.3, you agree that courts located in
        Bengaluru, Karnataka, India shall have exclusive jurisdiction over disputes that are not
        subject to arbitration, and you consent to personal jurisdiction there.
      </p>
      <p className="mt-2">
        <strong>Arbitration (optional tier).</strong> At the Operator&apos;s sole discretion, a
        dispute may be referred to binding arbitration under the Arbitration and Conciliation Act,
        1996 (India), seated in Bengaluru, in English, before a single arbitrator. Each party bears
        its own costs unless the arbitrator decides otherwise.
      </p>
      <p className="mt-2">
        <strong>Class action waiver.</strong> TO THE EXTENT PERMITTED BY LAW, YOU AND THE OPERATOR
        AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN AN INDIVIDUAL CAPACITY AND NOT AS
        A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.
      </p>

      <h2 className="mt-6 text-lg font-medium">15. Force majeure</h2>
      <p>
        We are not liable for failure or delay due to events beyond reasonable control (including
        natural disasters, war, terrorism, labor disputes, internet failures, third-party outages,
        or government action).
      </p>

      <h2 className="mt-6 text-lg font-medium">16. Changes</h2>
      <p>
        We may modify these Terms at any time by posting an updated version. Material changes may
        be indicated by updating the date above. Continued use constitutes acceptance where
        permitted by law.
      </p>

      <h2 className="mt-6 text-lg font-medium">17. General</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Entire agreement.</strong> These Terms and the Privacy Policy are the entire
          agreement regarding the hosted Service.
        </li>
        <li>
          <strong>Severability.</strong> If any provision is unenforceable, the remainder stays in
          effect.
        </li>
        <li>
          <strong>No waiver.</strong> Failure to enforce a provision is not a waiver.
        </li>
        <li>
          <strong>Assignment.</strong> You may not assign these Terms without consent. We may assign
          freely.
        </li>
        <li>
          <strong>No agency.</strong> No partnership, joint venture, or employment is created.
        </li>
      </ul>

      <h2 className="mt-6 text-lg font-medium">18. Contact</h2>
      <p>
        Operator: Chaitanya Prabuddha · https://github.com/chayprabs/tls-dns-checker · Website:
        https://www.chaitanyaprabuddha.com
      </p>
    </article>
  );
}
