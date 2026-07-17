// Fabricated document corpus for the hero "Try an example" search demo.
// All names, EINs, amounts and addresses are fictitious. The JPEGs live in
// public/samples/ and are produced by scripts/gen_samples.py.

export type DocKind = "Invoice" | "Bill" | "Receipt" | "Courier";

export type Doc = {
  file: string; // basename under /samples/
  title: string;
  party: string; // shown as the result subtitle
  kind: DocKind;
  meta: string; // amount · date (· route)
  amount: number; // total in USD, for numeric queries
  month: number; // 1–12, for date queries
  year: number;
  keywords: string[]; // synonyms so different phrasings match
};

const VENDOR = ["vendor", "invoice", "supplier", "purchase", "order", "chicago"];
const UTILITY = ["electricity", "power", "energy", "utility", "office", "last quarter", "kwh", "chicago"];
const CLIENT = ["client", "outgoing", "invoice", "services"];
const COURIER = ["courier", "shipping", "freight", "parcel"];

export const docs: Doc[] = [
  // --- Vendor invoices, June 2025 -----------------------------------------
  { file: "vendor-ironclad-hardware-jun.jpg", title: "Ironclad Hardware Supply — Invoice", party: "Ironclad Hardware Supply · Chicago, IL", kind: "Invoice", meta: "$2,403 · Jun 12, 2025", amount: 2403, month: 6, year: 2025,
    keywords: [...VENDOR, "ironclad", "hardware", "server", "rack", "networking"] },
  { file: "vendor-summit-furnishings-jun.jpg", title: "Summit Business Furnishings — Invoice", party: "Summit Business Furnishings · Chicago, IL", kind: "Invoice", meta: "$5,453 · Jun 5, 2025", amount: 5453, month: 6, year: 2025,
    keywords: [...VENDOR, "summit", "furniture", "chairs", "desks", "office furniture"] },
  { file: "vendor-cascade-office-jun.jpg", title: "Cascade Office Essentials — Invoice", party: "Cascade Office Essentials · Chicago, IL", kind: "Invoice", meta: "$1,088 · Jun 20, 2025", amount: 1088, month: 6, year: 2025,
    keywords: [...VENDOR, "cascade", "office supplies", "paper", "toner", "markers"] },
  { file: "vendor-meridian-print-jun.jpg", title: "Meridian Print & Packaging — Invoice", party: "Meridian Print & Packaging · Chicago, IL", kind: "Invoice", meta: "$794 · Jun 26, 2025", amount: 794, month: 6, year: 2025,
    keywords: [...VENDOR, "meridian", "printing", "packaging", "boxes", "business cards"] },
  { file: "vendor-crestline-it-jun.jpg", title: "Crestline IT Solutions — Invoice", party: "Crestline IT Solutions · Chicago, IL", kind: "Invoice", meta: "$3,432 · Jun 30, 2025", amount: 3432, month: 6, year: 2025,
    keywords: [...VENDOR, "crestline", "it", "computer", "monitor", "docking station", "keyboard"] },

  // --- Lakeshore Power & Light electric bills, Apr–Jun 2026 ---------------
  { file: "utility-loop-apr.jpg", title: "Lakeshore Power & Light — April", party: "Lakeshore Power & Light · Chicago Loop office", kind: "Bill", meta: "$536 · Apr 2026", amount: 536, month: 4, year: 2026,
    keywords: [...UTILITY, "loop", "headquarters", "hq"] },
  { file: "utility-loop-may.jpg", title: "Lakeshore Power & Light — May", party: "Lakeshore Power & Light · Chicago Loop office", kind: "Bill", meta: "$568 · May 2026", amount: 568, month: 5, year: 2026,
    keywords: [...UTILITY, "loop", "headquarters", "hq"] },
  { file: "utility-loop-jun.jpg", title: "Lakeshore Power & Light — June", party: "Lakeshore Power & Light · Chicago Loop office", kind: "Bill", meta: "$588 · Jun 2026", amount: 588, month: 6, year: 2026,
    keywords: [...UTILITY, "loop", "headquarters", "hq"] },
  { file: "utility-evanston-may.jpg", title: "Lakeshore Power & Light — Evanston, May", party: "Lakeshore Power & Light · Evanston office", kind: "Bill", meta: "$355 · May 2026", amount: 355, month: 5, year: 2026,
    keywords: [...UTILITY, "evanston", "satellite office"] },
  { file: "utility-evanston-jun.jpg", title: "Lakeshore Power & Light — Evanston, June", party: "Lakeshore Power & Light · Evanston office", kind: "Bill", meta: "$372 · Jun 2026", amount: 372, month: 6, year: 2026,
    keywords: [...UTILITY, "evanston", "satellite office"] },

  // --- Retail receipts -----------------------------------------------------
  { file: "retail-costco-jun.jpg", title: "Costco Wholesale — Receipt", party: "Costco Wholesale · Chicago, IL", kind: "Receipt", meta: "$214 · Jun 18, 2026", amount: 214, month: 6, year: 2026,
    keywords: ["costco", "receipt", "pantry", "office supplies", "bulk", "wholesale", "warehouse club", "snacks", "water", "coffee"] },
  { file: "retail-homedepot-may.jpg", title: "The Home Depot — Receipt", party: "The Home Depot · Chicago, IL", kind: "Receipt", meta: "$291 · May 21, 2026", amount: 291, month: 5, year: 2026,
    keywords: ["home depot", "receipt", "tools", "shelving", "renovation", "hardware store"] },
  { file: "retail-amazonbiz-jun.jpg", title: "Amazon Business — Order Receipt", party: "Amazon Business", kind: "Receipt", meta: "$666 · Jun 12, 2026", amount: 666, month: 6, year: 2026,
    keywords: ["amazon", "amazon business", "receipt", "webcam", "electronics", "conference room", "order"] },
  { file: "retail-bestbuy-mar.jpg", title: "Best Buy — Laptop Receipt", party: "Best Buy · Chicago, IL", kind: "Receipt", meta: "$1,521 · Mar 26, 2026", amount: 1521, month: 3, year: 2026,
    keywords: ["best buy", "receipt", "laptop", "dell", "xps", "expensed", "electronics", "new hire"] },
  { file: "retail-staples-apr.jpg", title: "Staples — Receipt", party: "Staples · Chicago, IL", kind: "Receipt", meta: "$380 · Apr 9, 2026", amount: 380, month: 4, year: 2026,
    keywords: ["staples", "receipt", "printer", "office supplies"] },

  // --- Outgoing client invoices, 2026 --------------------------------------
  { file: "client-invoice-brightpath.jpg", title: "Invoice to Bright Path Analytics", party: "Bright Path Analytics Inc · Austin, TX", kind: "Invoice", meta: "$28,400 · Jan 12, 2026", amount: 28400, month: 1, year: 2026,
    keywords: [...CLIENT, "bright path", "analytics", "austin", "document search"] },
  { file: "client-invoice-cedarstone.jpg", title: "Invoice to Cedar & Stone Law Group", party: "Cedar & Stone Law Group · Boston, MA", kind: "Invoice", meta: "$61,500 · Feb 4, 2026", amount: 61500, month: 2, year: 2026,
    keywords: [...CLIENT, "cedar", "stone", "law", "legal", "boston", "contracts", "large", "high value"] },
  { file: "client-invoice-unionsquare.jpg", title: "Invoice to Union Square Realty Partners", party: "Union Square Realty Partners · Denver, CO", kind: "Invoice", meta: "$19,800 · Mar 9, 2026", amount: 19800, month: 3, year: 2026,
    keywords: [...CLIENT, "union square", "realty", "real estate", "denver", "closing docs"] },
  { file: "client-invoice-pinecrest.jpg", title: "Invoice to Pinecrest Manufacturing", party: "Pinecrest Manufacturing Co · Cleveland, OH", kind: "Invoice", meta: "$34,200 · Apr 15, 2026", amount: 34200, month: 4, year: 2026,
    keywords: [...CLIENT, "pinecrest", "manufacturing", "cleveland", "enterprise"] },
  { file: "client-invoice-delmar.jpg", title: "Invoice to Del Mar Hospitality Group", party: "Del Mar Hospitality Group · San Diego, CA", kind: "Invoice", meta: "$12,650 · May 20, 2026", amount: 12650, month: 5, year: 2026,
    keywords: [...CLIENT, "del mar", "hospitality", "san diego", "archive"] },

  // --- FedEx / UPS bills, shipments from Chicago HQ ------------------------
  { file: "courier-fedex-austin.jpg", title: "FedEx bill — Chicago → Austin", party: "FedEx · Tracking 782044109938", kind: "Courier", meta: "$137 · Chicago → Austin · Jan 22, 2026", amount: 137, month: 1, year: 2026,
    keywords: [...COURIER, "fedex", "austin", "ground", "bright path"] },
  { file: "courier-ups-boston.jpg", title: "UPS bill — Chicago → Boston", party: "UPS · Tracking 1Z9A87W40312445890", kind: "Courier", meta: "$74 · Chicago → Boston · Feb 7, 2026", amount: 74, month: 2, year: 2026,
    keywords: [...COURIER, "ups", "boston", "air", "cedar stone", "legal"] },
  { file: "courier-fedex-denver.jpg", title: "FedEx bill — Chicago → Denver", party: "FedEx · Tracking 782061837765", kind: "Courier", meta: "$111 · Chicago → Denver · Mar 18, 2026", amount: 111, month: 3, year: 2026,
    keywords: [...COURIER, "fedex", "denver", "ground", "union square"] },
  { file: "courier-ups-cleveland.jpg", title: "UPS bill — Chicago → Cleveland", party: "UPS · Tracking 1Z9A87W40315509934", kind: "Courier", meta: "$67 · Chicago → Cleveland · Apr 11, 2026", amount: 67, month: 4, year: 2026,
    keywords: [...COURIER, "ups", "cleveland", "ground", "pinecrest"] },
  { file: "courier-fedex-sandiego.jpg", title: "FedEx bill — Chicago → San Diego", party: "FedEx · Tracking 782099204471", kind: "Courier", meta: "$165 · Chicago → San Diego · May 29, 2026", amount: 165, month: 5, year: 2026,
    keywords: [...COURIER, "fedex", "san diego", "air", "del mar"] },
];

const STOPWORDS = new Set([
  "the", "our", "for", "all", "this", "year", "my", "in", "from", "over",
  "a", "an", "of", "to", "and", "with", "i", "we", "me", "on", "at", "is",
  "show", "find", "get", "list", "want", "need", "please", "documents",
  "document", "docs", "doc", "that", "are", "worth", "usd", "dollars",
  "than", "more", "less", "under", "below", "above", "between", "any", "some",
  "dated", "during", "month", "invoice", "invoices", "bill", "bills",
  "receipt", "receipts", "courier", "couriers",
]);

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// US-grouped dollar formatting for intent labels, e.g. 10000 -> "10,000".
function fmtUSD(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

const AMT = String.raw`\$?\s*([\d][\d.,]*)\s*(k|m)?`;

function toNumber(numStr: string, unit?: string): number {
  let n = parseFloat(numStr.replace(/,/g, ""));
  const u = (unit || "").toLowerCase();
  if (u === "k") n *= 1e3;
  else if (u === "m") n *= 1e6;
  return Math.round(n);
}

const MONTHS: Record<string, number> = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4,
  may: 5, jun: 6, june: 6, jul: 7, july: 7, aug: 8, august: 8, sep: 9, sept: 9,
  september: 9, oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12,
};
const MONTH_NAMES = ["", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

const KIND_WORDS: [RegExp, DocKind][] = [
  [/\b(invoices?)\b/i, "Invoice"],
  [/\b(bills?)\b/i, "Bill"],
  [/\b(receipts?)\b/i, "Receipt"],
  [/\b(couriers?|shipments?|packages?|freight)\b/i, "Courier"],
];
const KIND_LABEL: Record<DocKind, string> = {
  Invoice: "invoices", Bill: "bills", Receipt: "receipts", Courier: "courier",
};

// Today is mid-2026 in this demo; "this/last year" resolve against that.
const THIS_YEAR = 2026;

export type Filters = {
  min?: number; max?: number; kind?: DocKind; month?: number; year?: number;
  note: string | null; rest: string;
};

/** Extract structured intent (amount, type, month, year) from a natural query. */
export function parseFilters(query: string): Filters {
  let rest = query;
  let min: number | undefined;
  let max: number | undefined;
  const amtLabels: string[] = [];

  const between = rest.match(new RegExp(String.raw`\bbetween\s+${AMT}\s*(?:and|to|-|–|—)\s*${AMT}`, "i"));
  if (between) {
    const lo = toNumber(between[1], between[2]);
    const hi = toNumber(between[3], between[4]);
    min = Math.min(lo, hi); max = Math.max(lo, hi);
    amtLabels.push(`$${fmtUSD(min)}–$${fmtUSD(max)}`);
    rest = rest.replace(between[0], " ");
  } else {
    const lo = rest.match(new RegExp(String.raw`\b(?:over|above|more than|greater than|at\s?least|exceeding|>=?|min)\s*${AMT}`, "i"));
    if (lo) { min = toNumber(lo[1], lo[2]); amtLabels.push(`over $${fmtUSD(min)}`); rest = rest.replace(lo[0], " "); }
    const hi = rest.match(new RegExp(String.raw`\b(?:under|below|less than|cheaper than|at\s?most|up\s?to|upto|<=?|max)\s*${AMT}`, "i"));
    if (hi) { max = toNumber(hi[1], hi[2]); amtLabels.push(`under $${fmtUSD(max)}`); rest = rest.replace(hi[0], " "); }
  }

  // Year — relative first, then an explicit 20xx.
  let year: number | undefined;
  if (/\bthis year\b/i.test(rest)) { year = THIS_YEAR; rest = rest.replace(/\bthis year\b/i, " "); }
  else if (/\blast year\b/i.test(rest)) { year = THIS_YEAR - 1; rest = rest.replace(/\blast year\b/i, " "); }
  const ym = rest.match(/\b(20\d{2})\b/);
  if (ym) { year = parseInt(ym[1], 10); rest = rest.replace(ym[0], " "); }

  // Month.
  let month: number | undefined;
  for (const key of Object.keys(MONTHS)) {
    const re = new RegExp(`\\b${key}\\b`, "i");
    const next = rest.replace(re, " ");
    if (next !== rest) { month = MONTHS[key]; rest = next; break; }
  }

  // Document type — only apply as a filter when the query names exactly one.
  const kinds = new Set<DocKind>();
  for (const [re, k] of KIND_WORDS) {
    const next = rest.replace(new RegExp(re, "gi"), " ");
    if (next !== rest) { kinds.add(k); rest = next; }
  }
  const kind = kinds.size === 1 ? [...kinds][0] : undefined;

  const dateLabel = month && year ? `${MONTH_NAMES[month]} ${year}` : month ? MONTH_NAMES[month] : year ? String(year) : null;
  const parts = [kind ? KIND_LABEL[kind] : null, dateLabel, ...amtLabels].filter(Boolean) as string[];

  return { min, max, kind, month, year, note: parts.length ? parts.join(" · ") : null, rest };
}

export type Ranked = { doc: Doc; score: number; pct: number };
export type SearchResult = { results: Ranked[]; note: string | null };

/**
 * Natural-language-ish search over the fabricated corpus. Extracts structured
 * intent (amount comparisons, document type, month, year) as hard filters, then
 * keyword-ranks whatever text is left. Returns the sorted list plus a
 * human-readable note of what it understood.
 */
export function searchDocs(query: string): SearchResult {
  const f = parseFilters(query);
  const hasFilter = f.min != null || f.max != null || f.kind != null || f.month != null || f.year != null;

  const tokens = f.rest
    .toLowerCase()
    .replace(/[$,]/g, " ")
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));

  if (!hasFilter && tokens.length === 0) return { results: [], note: null };

  const scored: Ranked[] = [];
  for (const doc of docs) {
    if (f.min != null && doc.amount < f.min) continue;
    if (f.max != null && doc.amount > f.max) continue;
    if (f.kind != null && doc.kind !== f.kind) continue;
    if (f.month != null && doc.month !== f.month) continue;
    if (f.year != null && doc.year !== f.year) continue;

    const hay = [doc.title, doc.party, doc.kind, doc.meta, doc.keywords.join(" ")]
      .join(" ")
      .toLowerCase();
    let score = 0;
    for (const t of tokens) {
      if (new RegExp(`\\b${escapeRe(t)}\\b`).test(hay)) score += 3;
      else if (hay.includes(t)) score += 1;
    }
    // A structured filter with no leftover keywords keeps every passing doc.
    if (hasFilter && tokens.length === 0) score = 2;
    if (score > 0) scored.push({ doc, score, pct: 0 });
  }

  scored.sort((a, b) => b.score - a.score || b.doc.amount - a.doc.amount);
  const top = scored[0]?.score ?? 1;
  for (const r of scored) r.pct = Math.round(75 + (r.score / top) * 22); // 75–97

  return { results: scored, note: f.note };
}
