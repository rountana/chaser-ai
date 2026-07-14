const steps = [
  {
    n: "01",
    title: "Install in seconds",
    body: "Download the secure app from the website — sign in with Apple or Google, and you're done. No system tweaks, no terminal.",
  },
  {
    n: "02",
    title: "Connect to your own AI model of choice",
    body: "Scanned PDFs, photographed bills, crumpled receipts — chaserAI extracts and indexes them through your own key, and never stores your documents.",
  },
  {
    n: "03",
    title: "⌘ + Space, ask anything",
    body: "From any app, summon the search bar and ask for the invoice, bill, or receipt you need.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-24 sm:py-32 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-mono uppercase tracking-[0.2em] text-[var(--accent)]">
            How it works
          </p>
          <h2 className="mt-3 text-3xl sm:text-5xl font-semibold tracking-tight">
            Three steps. Zero configuration.
          </h2>
        </div>

        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <li
              key={s.n}
              className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 overflow-hidden"
            >
              <div className="absolute -top-6 -right-4 text-[110px] font-mono font-semibold text-white/[0.04] select-none pointer-events-none">
                {s.n}
              </div>
              <div className="relative">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--accent)]">
                  <span className="size-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)]" />
                  Step {s.n}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
