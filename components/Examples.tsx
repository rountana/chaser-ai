import CommandPaletteMock from "./CommandPaletteMock";

const examples = [
  { emoji: "📧", text: "find emails about Q3 budget approval" },
  { emoji: "📁", text: "my contract with Acme Corp" },
  { emoji: "📄", text: "search invoice PDF for payment due date and terms" },
  { emoji: "🩺", text: "find medication list in my medical record from Dr. Patel" },
  {
    emoji: "💬",
    text: "find all messages where someone asked about the product launch timeline and pricing in Q4",
  },
];

export default function Examples() {
  return (
    <section id="examples" className="py-24 sm:py-32 scroll-mt-16">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05]">
          <span className="bg-gradient-to-r from-[var(--accent)] to-[#e9d5ff] bg-clip-text text-transparent">
            Even if you forgot
          </span>
          <br />
          <span className="bg-gradient-to-r from-[var(--accent)] to-[#e9d5ff] bg-clip-text text-transparent">
            where you put it.
          </span>
        </h2>

        <p className="mt-6 text-lg text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
          chaserAI searches across your emails, documents, Slack, and files — and understands what you actually mean.
        </p>

        {/* Search bar */}
        <div className="mt-10 mx-auto max-w-2xl">
          <div className="flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] backdrop-blur-md p-2 pl-5 transition-colors focus-within:border-[var(--accent)]">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--muted)] shrink-0"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="text"
              placeholder="Ask anything or describe what you're looking for..."
              aria-label="Search query"
              className="flex-1 min-w-0 bg-transparent text-sm sm:text-base text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none py-2"
            />
            <button
              type="button"
              className="shrink-0 rounded-full bg-[var(--accent)] hover:bg-[#bfa6ff] text-[#0a0a0a] text-sm font-medium px-5 py-2 transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Example chips */}
        <p className="mt-10 text-xs font-mono uppercase tracking-[0.22em] text-[var(--muted)]">
          Try an example
        </p>

        <ul className="mt-5 flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
          {examples.map((ex) => (
            <li key={ex.text}>
              <button
                type="button"
                className="inline-flex items-start gap-2 text-left text-sm text-[var(--foreground)]/90 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] hover:bg-[var(--surface-elev)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors px-4 py-2"
              >
                <span aria-hidden className="text-base leading-tight">
                  {ex.emoji}
                </span>
                <span className="leading-snug">{ex.text}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Command palette result preview */}
        <div className="mt-14">
          <CommandPaletteMock />
        </div>
      </div>
    </section>
  );
}
