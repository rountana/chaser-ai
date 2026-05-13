type Feature = {
  title: string;
  body: string;
  icon: React.ReactNode;
};

const I = (path: React.ReactNode) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-[var(--accent)]"
    aria-hidden
  >
    {path}
  </svg>
);

const features: Feature[] = [
  {
    title: "Semantic search",
    body: "Find files by what they mean, not what they're named. Embeddings let chaserAI match concepts, synonyms, and intent.",
    icon: I(
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>,
    ),
  },
  {
    title: "Natural-language queries",
    body: 'Ask like you\'d ask a friend: "the slide deck from the offsite," "tax docs from last year," "that one screenshot."',
    icon: I(
      <>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
      </>,
    ),
  },
  {
    title: "Content-aware indexing",
    body: "PDFs, docs, code, even text inside screenshots — chaserAI reads inside files, not just filenames.",
    icon: I(
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8M8 17h6" />
      </>,
    ),
  },
  {
    title: "100% local & private",
    body: "Your index and embeddings live on your Mac. Files never get uploaded, even to us. Air-gap friendly.",
    icon: I(
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>,
    ),
  },
  {
    title: "Instant results",
    body: "Sub-100ms search across millions of files. The index updates in the background as you work.",
    icon: I(
      <>
        <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
      </>,
    ),
  },
  {
    title: "Universal hotkey",
    body: "Hit ⌘ + Space (or any key you bind) from anywhere. A Spotlight replacement, but smarter.",
    icon: I(
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 16h8" />
      </>,
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 sm:py-32 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6">

        <div className="max-w-2xl">
          <p className="text-sm font-mono uppercase tracking-[0.2em] text-[var(--accent)]">
            Features
          </p>
          <h2 className="mt-3 text-3xl sm:text-5xl font-semibold tracking-tight">
            Built for the way you actually look for things.
          </h2>
          <p className="mt-4 text-lg text-[var(--muted)] leading-relaxed">
            Filename search broke the day you stopped naming files. chaserAI gets you back to "I'll find it" in a second.
          </p>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <li
              key={f.title}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface-elev)]"
            >
              <div className="size-10 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-elev)] flex items-center justify-center mb-5 group-hover:shadow-[0_0_24px_-6px_var(--accent-glow)] transition-shadow">
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
                {f.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
