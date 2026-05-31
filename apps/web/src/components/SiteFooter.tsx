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
      </div>
    </footer>
  );
}
