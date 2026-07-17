const results = [
  {
    name: "Stripe — March 2026 invoice.pdf",
    path: "~/Documents/Finance/Stripe/",
    score: 0.94,
    kind: "PDF",
  },
  {
    name: "stripe-invoice-mar26.eml",
    path: "Mail › Archive › Receipts",
    score: 0.89,
    kind: "Email",
  },
  {
    name: "Q1 reconciliation.xlsx",
    path: "~/Documents/Finance/Q1/",
    score: 0.81,
    kind: "Sheet",
  },
];

const kindColors: Record<string, string> = {
  PDF: "text-rose-300/90 bg-rose-400/10 border-rose-400/20",
  Email: "text-sky-300/90 bg-sky-400/10 border-sky-400/20",
  Sheet: "text-emerald-300/90 bg-emerald-400/10 border-emerald-400/20",
};

export default function CommandPaletteMock() {
  return (
    <div
      className="relative w-full max-w-xl mx-auto rounded-2xl border border-[var(--border-strong)] bg-[rgba(20,20,24,0.7)] backdrop-blur-md shadow-2xl shadow-black/40 overflow-hidden"
      style={{ boxShadow: "0 20px 80px -20px rgba(167,139,250,0.25), 0 0 0 1px rgba(255,255,255,0.04)" }}
    >
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-70" />

      <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[var(--accent)] shrink-0"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>

        <div className="flex-1 min-w-0 font-mono text-[15px] text-[var(--foreground)] truncate">
          invoices from Stripe last March
          <span className="inline-block w-[1px] h-4 align-middle ml-1 bg-[var(--accent)] animate-caret" />
        </div>

        <kbd className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[var(--muted)] border border-[var(--border)] rounded-md px-1.5 py-0.5 font-mono">
          ⌘ K
        </kbd>
      </div>

      <ul className="py-2">
        {results.map((r, i) => (
          <li
            key={r.name}
            className={`flex items-center gap-3 px-5 py-3 mx-2 rounded-lg ${
              i === 0 ? "bg-white/5" : ""
            } transition-colors`}
          >
            <span
              className={`shrink-0 text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${kindColors[r.kind]}`}
            >
              {r.kind}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-[var(--foreground)] truncate">{r.name}</div>
              <div className="text-xs text-[var(--muted)] truncate font-mono">{r.path}</div>
            </div>
            <span className="hidden sm:inline text-[11px] font-mono text-[var(--muted)]">
              {Math.round(r.score * 100)}%
            </span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between px-5 py-2.5 border-t border-[var(--border)] text-[11px] font-mono text-[var(--muted)]">
        <span>
          <span className="text-[var(--accent)]">●</span> 3 results · 42ms · local index
        </span>
        <span>
          <kbd className="border border-[var(--border)] rounded px-1">↵</kbd> open
        </span>
      </div>
    </div>
  );
}
