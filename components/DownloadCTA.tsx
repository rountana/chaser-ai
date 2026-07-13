import WaitlistButton from "./WaitlistButton";

export default function DownloadCTA() {
  return (
    <section id="download" className="py-16 sm:py-20 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-elev)] px-8 py-10 sm:px-12 sm:py-14 flex flex-col sm:flex-row sm:items-center justify-between gap-8"
          style={{ boxShadow: "0 0 60px -20px rgba(167,139,250,0.12)" }}
        >
          <div>
            <p className="text-sm font-mono uppercase tracking-[0.2em] text-[var(--accent)]">Coming soon</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
              Join the waitlist for early access.
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)] max-w-sm leading-relaxed">
              Be first in line when chaserAI launches. No spam, just one email when it&apos;s your turn.
            </p>
          </div>
          <WaitlistButton size="lg" />
        </div>
      </div>
    </section>
  );
}
