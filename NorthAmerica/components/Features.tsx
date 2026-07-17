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
    title: "AI OCR that reads real invoices",
    body: "Scanned PDFs, photographed bills, crumpled paper receipts — chaserAI's optical character recognition software reads the pixels, not just the text layer.",
    icon: I(
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8M8 17h6" />
      </>,
    ),
  },
  {
    title: "Ask like a person",
    body: '"the vendor invoice that\'s due Friday" — no exact filenames or folders required.',
    icon: I(
      <>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
      </>,
    ),
  },
  {
    title: "Receipt OCR for tax season",
    body: "Every receipt for a Schedule C deduction, every invoice a client or CPA asks for — indexed from what's actually printed on the page, searchable in seconds.",
    icon: I(
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>,
    ),
  },
  {
    title: "Private by design",
    body: "Bring your own key and your documents go straight to your provider — never through us. On managed, they're encrypted in transit and never stored.",
    icon: I(
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>,
    ),
  },
  {
    title: "Bring your own key",
    body: "Prefer your own OpenAI, Anthropic, or Gemini account? Drop in your API key and chaserAI runs on it — your provider, your rates, your data.",
    icon: I(
      <>
        <circle cx="7.5" cy="15.5" r="4.5" />
        <path d="m10.7 12.3 8.3-8.3M15 6l3 3M18 3l3 3" />
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
            Optical character recognition software built for the paperwork that piles up.
          </h2>
          <p className="mt-4 text-lg text-[var(--muted)] leading-relaxed">
            Scanned PDFs and photographed receipts don&apos;t come with searchable filenames. chaserAI&apos;s AI OCR reads what&apos;s actually printed on them.
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
