export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-white py-6">
      <div className="mx-auto flex max-w-5xl justify-center gap-6 px-4 text-sm text-[var(--muted)]">
        <a href="/privacy" className="hover:text-[var(--foreground)]">
          Privacy Policy
        </a>
        <a href="/terms" className="hover:text-[var(--foreground)]">
          Terms &amp; Conditions
        </a>
        <a
          href="https://github.com/chayprabs/tls-dns-checker/blob/main/LICENSE"
          className="hover:text-[var(--foreground)]"
          target="_blank"
          rel="noopener noreferrer"
        >
          License (AGPL-3.0)
        </a>
      </div>
    </footer>
  );
}
