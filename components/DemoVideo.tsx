export default function DemoVideo() {
  return (
    <section id="demo" className="py-16 sm:py-20 scroll-mt-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-10">
          <p className="text-sm font-mono uppercase tracking-[0.2em] text-[var(--accent)]">Demo</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
            See it in action.
          </h2>
        </div>

        <div
          className="relative w-full rounded-2xl border border-[var(--border-strong)] bg-[rgba(14,14,18,0.8)] overflow-hidden"
          style={{
            aspectRatio: "16/9",
            boxShadow: "0 24px 80px -20px rgba(167,139,250,0.18), 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(139,92,246,0.08)] via-transparent to-[rgba(167,139,250,0.04)]" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
            <button
              type="button"
              aria-label="Watch demo"
              className="flex items-center justify-center size-16 sm:size-20 rounded-full border border-[var(--border-strong)] bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 transition-colors backdrop-blur-sm"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--accent)] ml-1" aria-hidden>
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </button>
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-medium text-[var(--foreground)]">Watch the demo</span>
              <span className="text-xs font-mono text-[var(--muted)]">2 min · see chaserAI in action</span>
            </div>
          </div>
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="size-3 rounded-full bg-white/10" />
            <span className="size-3 rounded-full bg-white/10" />
            <span className="size-3 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
