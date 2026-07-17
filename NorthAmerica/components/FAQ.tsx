const faqs = [
  {
    q: "Does chaserAI send my files to the cloud?",
    a: "To read and index a document, its contents are sent to an AI model for processing — encrypted in transit and never stored. The resulting search index and embeddings stay on your device.",
  },
  {
    q: "Do I need an internet connection?",
    a: "Yes — a connection is needed to index new documents and to run searches. Your index stays on your device.",
  },
  {
    q: "Which file types are supported?",
    a: "Scanned PDFs, text-based PDFs, and common image formats like JPG and PNG — including photographed and scanned pages, with AI OCR (optical character recognition) to read the text inside them.",
  },
  {
    q: "What operating systems work?",
    a: "macOS 13+ and Windows 10/11. chaserAI is a desktop-only app — there are no iOS or Android versions.",
  },
  {
    q: "How much disk space does the index need?",
    a: "Roughly 1–3% of the size of the content you index. For a typical 50 GB Documents folder, expect ~750 MB of index data.",
  },
  {
    q: "Which AI model does it use?",
    a: "Bring your own key and chaserAI runs on your provider of choice — Claude, GPT, or Gemini — for both indexing and search, so your documents only ever touch your account. Prefer not to manage a key? Our managed option handles it for you, encrypted in transit and never stored.",
  },
  {
    q: "Can I search documents in other languages?",
    a: "English only for now. Support for the other languages your AI model understands is coming in future releases.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-24 sm:py-32 scroll-mt-16">
      <div className="mx-auto max-w-3xl px-6">
        <div>
          <p className="text-sm font-mono uppercase tracking-[0.2em] text-[var(--accent)]">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl sm:text-5xl font-semibold tracking-tight">
            Quick answers.
          </h2>
        </div>

        <div className="mt-10 divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                <h3 className="text-base sm:text-lg font-medium text-[var(--foreground)]">
                  {f.q}
                </h3>
                <span
                  aria-hidden
                  className="shrink-0 size-7 rounded-full border border-[var(--border-strong)] flex items-center justify-center text-[var(--muted)] group-open:rotate-45 group-open:text-[var(--accent)] group-open:border-[var(--accent)] transition-all"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-sm sm:text-base text-[var(--muted)] leading-relaxed max-w-prose">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
