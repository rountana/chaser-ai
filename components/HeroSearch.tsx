"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { withBasePath } from "@/lib/basePath";
import { docs, searchDocs, type Doc } from "@/lib/sampleDocs";
import highlightsData from "@/lib/sampleHighlights.json";

const highlights = highlightsData as Record<string, Record<string, number[]>>;

const kindColors: Record<Doc["kind"], string> = {
  Invoice: "text-rose-300/90 bg-rose-400/10 border-rose-400/20",
  Bill: "text-amber-300/90 bg-amber-400/10 border-amber-400/20",
  Receipt: "text-emerald-300/90 bg-emerald-400/10 border-emerald-400/20",
  Courier: "text-sky-300/90 bg-sky-400/10 border-sky-400/20",
};

const FIELD_LABEL: Record<string, string> = {
  type: "document type", party: "vendor", amount: "amount", date: "date",
};

// The scripted tour: every chip theme + a few natural-language queries.
// `hl` picks which field(s) to glow-highlight on the opened document.
const STEPS: { query: string; hl: string[] }[] = [
  { query: "GST invoice from our Bengaluru supplier for the June order", hl: ["type", "date", "party"] },
  { query: "our office electricity bill from last quarter", hl: ["type", "party"] },
  { query: "receipt for the laptop I expensed at Croma", hl: ["party", "type"] },
  { query: "show me invoices under ₹75,000", hl: ["amount", "type"] },
  { query: "the Delhivery courier bill for the Mumbai shipment", hl: ["party", "type"] },
  { query: "bills from June 2026", hl: ["type", "date"] },
  { query: "client invoices over ₹5 lakh", hl: ["amount", "type"] },
];

const byFile = (file: string) => docs.find((d) => d.file === file);

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Doc | null>(null);
  const [hl, setHl] = useState<string[]>([]);
  const [glow, setGlow] = useState(false);
  const reduced = useRef(false);

  const { results, note } = useMemo(() => searchDocs(query), [query]);
  const shown = results.slice(0, 5);

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Reduced motion: render a single static frame, no loop, no animation.
    if (reduced.current) {
      const step = STEPS[0];
      setQuery(step.query);
      const top = searchDocs(step.query).results[0]?.doc ?? null;
      setActive(top);
      setHl(step.hl);
      setGlow(true);
      return;
    }

    let cancelled = false;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    (async () => {
      while (!cancelled) {
        for (const step of STEPS) {
          if (cancelled) return;
          setActive(null);
          setGlow(false);
          setQuery("");
          await sleep(700);
          if (cancelled) return;

          for (let k = 1; k <= step.query.length; k++) {
            if (cancelled) return;
            setQuery(step.query.slice(0, k));
            await sleep(55);
          }
          await sleep(2200);
          if (cancelled) return;

          const top = searchDocs(step.query).results[0]?.doc;
          if (top) {
            setActive(top);
            setHl(step.hl);
            setGlow(false);
            await sleep(800);
            if (cancelled) return;
            setGlow(true);
            await sleep(4200);
            if (cancelled) return;
            setGlow(false);
            await sleep(700);
          } else {
            await sleep(1400);
          }
        }
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const boxes = active ? highlights[active.file] : undefined;

  return (
    <div className="mt-10 mx-auto max-w-3xl">
      {/* Query bar (display-only, driven by the demo) */}
      <div className="flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] backdrop-blur-md p-2 pl-5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted)] shrink-0" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <div className="flex-1 min-w-0 text-sm sm:text-base text-[var(--foreground)] py-2 truncate">
          {query || <span className="text-[var(--muted)]">Describe the invoice, bill, or receipt you&apos;re looking for…</span>}
          <span className="inline-block w-[1px] h-4 align-middle ml-0.5 bg-[var(--accent)] animate-caret" />
        </div>
        <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] text-[11px] font-mono uppercase tracking-wider px-2.5 py-1.5">
          <span className="size-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
          Live demo
        </span>
      </div>

      {/* Stage — swaps between the results list and the opened document */}
      <div className="mt-4 min-h-[560px]">
        {active && boxes ? (
          // --- Opened document with match highlight ---
          <div className="rounded-2xl border border-[var(--border-strong)] bg-[rgba(20,20,24,0.7)] backdrop-blur-md overflow-hidden text-left shadow-2xl shadow-black/40">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
              <span className={`shrink-0 text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${kindColors[active.kind]}`}>
                {active.kind}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-[var(--foreground)] truncate">{active.title}</div>
                <div className="text-xs text-[var(--muted)] truncate font-mono">{active.party} · {active.meta}</div>
              </div>
            </div>
            <div className="flex flex-col items-center bg-[#d8d8d4] py-5">
              <div className="relative inline-block">
                <img
                  src={withBasePath(`/samples/${active.file}`)}
                  alt={active.title}
                  className="block max-h-[480px] w-auto rounded shadow-lg"
                />
                {hl.map((field) => {
                  const b = boxes[field];
                  if (!b) return null;
                  return (
                    <span
                      key={field}
                      className="absolute rounded-[3px] pointer-events-none transition-all duration-500"
                      style={{
                        left: `${b[0] * 100}%`,
                        top: `${b[1] * 100}%`,
                        width: `${b[2] * 100}%`,
                        height: `${b[3] * 100}%`,
                        opacity: glow ? 1 : 0,
                        transform: glow ? "scale(1)" : "scale(1.08)",
                        outline: "2px solid var(--accent)",
                        background: "color-mix(in srgb, var(--accent) 22%, transparent)",
                        boxShadow: "0 0 0 3px color-mix(in srgb, var(--accent) 28%, transparent), 0 0 18px 2px color-mix(in srgb, var(--accent) 45%, transparent)",
                      }}
                    />
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--border)] text-[11px] font-mono text-[var(--muted)]">
              <span>
                <span className="text-[var(--accent)]">●</span> opened · match on{" "}
                <span className="text-[var(--foreground)]/80">{hl.map((f) => FIELD_LABEL[f] ?? f).join(", ")}</span>
              </span>
              <span className="hidden sm:inline">on-device · nothing uploaded</span>
            </div>
          </div>
        ) : (
          // --- Live results as the query is typed ---
          <div className="rounded-2xl border border-[var(--border-strong)] bg-[rgba(20,20,24,0.7)] backdrop-blur-md overflow-hidden text-left shadow-2xl shadow-black/40">
            {shown.length > 0 ? (
              <>
                <ul className="py-2">
                  {shown.map(({ doc, pct }) => (
                    <li key={doc.file} className="flex items-center gap-3 px-3 sm:px-4 py-2.5 mx-1 rounded-lg">
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
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--border)] text-[11px] font-mono text-[var(--muted)]">
                  <span>
                    <span className="text-[var(--accent)]">●</span> {results.length} result{results.length === 1 ? "" : "s"}
                    {note ? <> · <span className="text-[var(--foreground)]/80">{note}</span></> : null}
                    {" · local index"}
                    {results.length > shown.length ? ` · showing ${shown.length}` : ""}
                  </span>
                  <span className="hidden sm:inline">opening top match…</span>
                </div>
              </>
            ) : (
              <div className="px-5 py-16 text-sm text-[var(--muted)] text-center">
                Searching your scanned documents…
              </div>
            )}
          </div>
        )}
      </div>

      <p className="mt-5 text-xs font-mono uppercase tracking-[0.22em] text-[var(--muted)] text-center">
        Auto-playing demo · 25 sample documents · searched on-device
      </p>
    </div>
  );
}
