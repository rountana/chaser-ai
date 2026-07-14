"use client";

import { useEffect, useMemo, useState } from "react";
import { withBasePath } from "@/lib/basePath";
import { docs, examples, searchDocs, type Doc } from "@/lib/sampleDocs";

const kindColors: Record<Doc["kind"], string> = {
  Invoice: "text-rose-300/90 bg-rose-400/10 border-rose-400/20",
  Bill: "text-amber-300/90 bg-amber-400/10 border-amber-400/20",
  Receipt: "text-emerald-300/90 bg-emerald-400/10 border-emerald-400/20",
  Courier: "text-sky-300/90 bg-sky-400/10 border-sky-400/20",
};

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Doc | null>(null);

  const results = useMemo(() => searchDocs(query), [query]);
  const typed = query.trim().length > 0;
  const ms = results.length ? 14 + results.length * 6 : 22;

  // Deep-link support: ?q= prefills the search, ?doc= opens a document.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) setQuery(q);
    const file = params.get("doc");
    if (file) {
      const found = docs.find((d) => d.file === file);
      if (found) setOpen(found);
    }
  }, []);

  // Close the viewer on Esc and lock body scroll while it's open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="mt-10 mx-auto max-w-2xl">
      {/* Search bar */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] backdrop-blur-md p-2 pl-5 transition-colors focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_3px_var(--accent-glow)]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted)] shrink-0" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe the invoice, bill, or receipt you're looking for..."
          aria-label="Search query"
          className="flex-1 min-w-0 bg-transparent text-sm sm:text-base text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none py-2"
        />
        {typed && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="shrink-0 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors px-1"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
        <button
          type="submit"
          className="shrink-0 rounded-full bg-[var(--accent)] hover:bg-[#bfa6ff] active:scale-95 text-[#0a0a0a] text-sm font-medium px-5 py-2 transition-all"
        >
          Search
        </button>
      </form>

      {/* Results */}
      {typed && (
        <div className="mt-4 rounded-2xl border border-[var(--border-strong)] bg-[rgba(20,20,24,0.7)] backdrop-blur-md overflow-hidden text-left shadow-2xl shadow-black/40">
          {results.length > 0 ? (
            <>
              <ul className="py-2">
                {results.map(({ doc, pct }) => (
                  <li key={doc.file}>
                    <button
                      type="button"
                      onClick={() => setOpen(doc)}
                      className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 mx-1 rounded-lg hover:bg-white/5 transition-colors text-left"
                    >
                      <img
                        src={withBasePath(`/samples/${doc.file}`)}
                        alt=""
                        loading="lazy"
                        className="shrink-0 w-10 h-12 object-cover object-top rounded border border-[var(--border)] bg-white"
                      />
                      <span className={`shrink-0 hidden sm:inline text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${kindColors[doc.kind]}`}>
                        {doc.kind}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm text-[var(--foreground)] truncate">{doc.title}</span>
                        <span className="block text-xs text-[var(--muted)] truncate font-mono">{doc.party} · {doc.meta}</span>
                      </span>
                      <span className="hidden sm:inline text-[11px] font-mono text-[var(--muted)] shrink-0">{pct}%</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--border)] text-[11px] font-mono text-[var(--muted)]">
                <span>
                  <span className="text-[var(--accent)]">●</span> {results.length} result{results.length === 1 ? "" : "s"} · {ms}ms · local index
                </span>
                <span className="hidden sm:inline">click a document to open it</span>
              </div>
            </>
          ) : (
            <div className="px-5 py-6 text-sm text-[var(--muted)] text-center">
              No matches. Try{" "}
              <button type="button" onClick={() => setQuery("laptop")} className="text-[var(--accent)] hover:underline">laptop</button>
              {" "}or{" "}
              <button type="button" onClick={() => setQuery("electricity bill")} className="text-[var(--accent)] hover:underline">electricity bill</button>.
            </div>
          )}
        </div>
      )}

      {/* Example chips */}
      <p className="mt-8 text-xs font-mono uppercase tracking-[0.22em] text-[var(--muted)]">
        Try an example
      </p>
      <ul className="mt-4 flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
        {examples.map((ex) => (
          <li key={ex.text}>
            <button
              type="button"
              onClick={() => setQuery(ex.text)}
              className="inline-flex items-start gap-2 text-left text-sm text-[var(--foreground)]/90 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] hover:bg-[var(--surface-elev)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors px-4 py-2"
            >
              <span aria-hidden className="text-base leading-tight">{ex.emoji}</span>
              <span className="leading-snug">{ex.text}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Document viewer */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${open.title} — document preview`}
        >
          <div
            className="relative flex flex-col max-h-full w-full max-w-3xl rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
              <span className={`shrink-0 text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${kindColors[open.kind]}`}>
                {open.kind}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-[var(--foreground)] truncate">{open.title}</div>
                <div className="text-xs text-[var(--muted)] truncate font-mono">{open.party} · {open.meta}</div>
              </div>
              <a
                href={withBasePath(`/samples/${open.file}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-xs font-mono text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              >
                Open original ↗
              </a>
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Close"
                className="shrink-0 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-auto bg-[#d8d8d4] p-4 sm:p-6">
              <img
                src={withBasePath(`/samples/${open.file}`)}
                alt={open.title}
                className="mx-auto w-full max-w-xl rounded shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
