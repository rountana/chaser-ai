import WaitlistButton from "./WaitlistButton";
import HeroSearch from "./HeroSearch";

const platforms = [
  {
    label: "macOS",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
  },
  {
    label: "Windows",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M3 5.557L10.373 4.5v7.145H3V5.557zm0 12.887L10.373 19.5v-7.145H3v5.089zm8.133 1.21L21 21v-8.645h-9.867v7.299zm0-14.308v7.01H21V3L11.133 5.346z"/>
      </svg>
    ),
  },
];

export default function Hero() {
  return (
    <section id="top" className="relative pt-20 pb-24 sm:pt-28 sm:pb-32">
      <div className="mx-auto max-w-5xl px-6 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1 text-xs font-mono text-[var(--muted)] mb-8">
          <span className="size-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)]" />
          OCR-powered document search · private by design
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] max-w-4xl mx-auto">
          Describe what you remember.{" "}
          <span className="bg-gradient-to-r from-[var(--accent)] to-[#e9d5ff] bg-clip-text text-transparent">
          Find it in scanned documents.
          </span>
          <br className="hidden sm:block" />
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-lg text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
          The invoice from that vendor. The bill from last winter. The receipt for the thing you returned.
        </p>

        {/* Waitlist CTA */}
        <div className="mt-8">
          <WaitlistButton size="lg" />
        </div>

        {/* Platform pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {platforms.map((p) => (
            <span
              key={p.label}
              className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] border border-[var(--border-strong)] bg-[var(--surface)] rounded-full px-3 py-1.5"
            >
              {p.icon}
              {p.label}
            </span>
          ))}
        </div>

        {/* Interactive search demo */}
        <HeroSearch />

      </div>
    </section>
  );
}
