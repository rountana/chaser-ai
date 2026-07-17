// Fabricated document corpus for the hero "Try an example" search demo.
// All names, GSTINs, amounts and addresses are fictitious. The JPEGs live in
// public/samples/ and are produced by scripts/gen_samples.py.

export type DocKind = "Invoice" | "Bill" | "Receipt" | "Courier";

export type Doc = {
  file: string; // basename under /samples/
  title: string;
  party: string; // shown as the result subtitle
  kind: DocKind;
  meta: string; // amount · date (· route)
  amount: number; // total in rupees, for numeric queries
  month: number; // 1–12, for date queries
  year: number;
  keywords: string[]; // synonyms so different phrasings match
};

export type Example = { emoji: string; text: string };

// The chips under the search bar — seed queries the visitor can then edit.
export const examples: Example[] = [
  { emoji: "🧾", text: "GST invoice from our Bengaluru supplier for the June order" },
  { emoji: "💡", text: "our office electricity bill from last quarter" },
  { emoji: "🧾", text: "receipt for the laptop I expensed at Croma" },
  { emoji: "📑", text: "documents over ₹75,000 from this year" },
  { emoji: "🚚", text: "the Delhivery courier bill for the Mumbai shipment" },
];

const GST = ["gst", "tax invoice", "supplier", "vendor", "purchase", "bengaluru", "bangalore", "karnataka", "order"];
const POWER = ["electricity", "power", "energy", "utility", "bescom", "office", "last quarter", "units", "kwh", "bengaluru", "karnataka"];
const CROMA = ["croma", "laptop", "expense", "expensed", "electronics", "purchase", "warranty"];
const CLIENT = ["client", "outgoing", "high value", "large", "services", "igst"];
const COURIER = ["delhivery", "shipping", "mumbai", "freight", "logistics", "parcel"];

export const docs: Doc[] = [
  // --- GST invoices, Bengaluru suppliers, June 2025 -----------------------
  { file: "gst-sunrise-electronics-jun.jpg", title: "Sunrise Electronics — GST invoice", party: "Sunrise Electronics · SP Road, Bengaluru", kind: "Invoice", meta: "₹1,42,544 · 03 Jun 2025", amount: 142544, month: 6, year: 2025,
    keywords: [...GST, "sunrise", "electronics", "pcb", "components", "sp road"] },
  { file: "gst-nandi-components-jun.jpg", title: "Nandi Components — GST invoice", party: "Nandi Components · Peenya, Bengaluru", kind: "Invoice", meta: "₹76,228 · 11 Jun 2025", amount: 76228, month: 6, year: 2025,
    keywords: [...GST, "nandi", "components", "enclosures", "hardware", "peenya"] },
  { file: "gst-koramangala-hardware-jun.jpg", title: "Koramangala Hardware — GST invoice", party: "Koramangala Hardware Supplies · Bengaluru", kind: "Invoice", meta: "₹73,266 · 18 Jun 2025", amount: 73266, month: 6, year: 2025,
    keywords: [...GST, "koramangala", "hardware", "server rack", "cables", "networking"] },
  { file: "gst-bharadwaj-traders-jun.jpg", title: "Bharadwaj Traders — GST invoice", party: "Bharadwaj Traders · Chickpet, Bengaluru", kind: "Invoice", meta: "₹1,71,808 · 22 Jun 2025", amount: 171808, month: 6, year: 2025,
    keywords: [...GST, "bharadwaj", "traders", "furniture", "chairs", "desks", "chickpet"] },
  { file: "gst-indiranagar-office-jun.jpg", title: "Indiranagar Office Supplies — GST invoice", party: "Indiranagar Office Supplies · Bengaluru", kind: "Invoice", meta: "₹75,284 · 27 Jun 2025", amount: 75284, month: 6, year: 2025,
    keywords: [...GST, "indiranagar", "office supplies", "paper", "stationery", "toner"] },

  // --- BESCOM electricity bills, last quarter (Apr–Jun 2026) --------------
  { file: "bescom-mg-road-apr.jpg", title: "BESCOM electricity bill — April", party: "BESCOM · MG Road HQ office", kind: "Bill", meta: "₹28,621 · Apr 2026", amount: 28621, month: 4, year: 2026,
    keywords: [...POWER, "mg road", "jayanagar", "headquarters", "hq"] },
  { file: "bescom-mg-road-may.jpg", title: "BESCOM electricity bill — May", party: "BESCOM · MG Road HQ office", kind: "Bill", meta: "₹30,293 · May 2026", amount: 30293, month: 5, year: 2026,
    keywords: [...POWER, "mg road", "jayanagar", "headquarters", "hq"] },
  { file: "bescom-mg-road-jun.jpg", title: "BESCOM electricity bill — June", party: "BESCOM · MG Road HQ office", kind: "Bill", meta: "₹31,338 · Jun 2026", amount: 31338, month: 6, year: 2026,
    keywords: [...POWER, "mg road", "jayanagar", "headquarters", "hq"] },
  { file: "bescom-whitefield-may.jpg", title: "BESCOM electricity bill — Whitefield, May", party: "BESCOM · Whitefield office", kind: "Bill", meta: "₹18,038 · May 2026", amount: 18038, month: 5, year: 2026,
    keywords: [...POWER, "whitefield", "itpl"] },
  { file: "bescom-whitefield-jun.jpg", title: "BESCOM electricity bill — Whitefield, June", party: "BESCOM · Whitefield office", kind: "Bill", meta: "₹18,886 · Jun 2026", amount: 18886, month: 6, year: 2026,
    keywords: [...POWER, "whitefield", "itpl"] },

  // --- Croma laptop receipts ---------------------------------------------
  { file: "croma-macbook-air.jpg", title: "Croma — MacBook Air receipt", party: "Croma · Jayanagar, Bengaluru", kind: "Receipt", meta: "₹1,34,900 · 14 Feb 2026", amount: 134900, month: 2, year: 2026,
    keywords: [...CROMA, "macbook", "macbook air", "apple", "m3"] },
  { file: "croma-dell-xps.jpg", title: "Croma — Dell XPS 13 receipt", party: "Croma · Jayanagar, Bengaluru", kind: "Receipt", meta: "₹1,52,990 · 26 Mar 2026", amount: 152990, month: 3, year: 2026,
    keywords: [...CROMA, "dell", "xps"] },
  { file: "croma-thinkpad-e14.jpg", title: "Croma — ThinkPad E14 receipt", party: "Croma · Jayanagar, Bengaluru", kind: "Receipt", meta: "₹87,490 · 09 Apr 2026", amount: 87490, month: 4, year: 2026,
    keywords: [...CROMA, "lenovo", "thinkpad", "e14"] },
  { file: "croma-hp-pavilion.jpg", title: "Croma — HP Pavilion 14 receipt", party: "Croma · Jayanagar, Bengaluru", kind: "Receipt", meta: "₹68,990 · 21 May 2026", amount: 68990, month: 5, year: 2026,
    keywords: [...CROMA, "hp", "pavilion"] },
  { file: "croma-asus-vivobook.jpg", title: "Croma — ASUS Vivobook receipt", party: "Croma · Jayanagar, Bengaluru", kind: "Receipt", meta: "₹61,990 · 18 Jun 2026", amount: 61990, month: 6, year: 2026,
    keywords: [...CROMA, "asus", "vivobook"] },

  // --- Outgoing client invoices > ₹5 lakh, 2026 --------------------------
  { file: "client-invoice-northstar.jpg", title: "Invoice to Northstar Analytics", party: "Northstar Analytics · Hyderabad", kind: "Invoice", meta: "₹7,19,800 · 12 Jan 2026", amount: 719800, month: 1, year: 2026,
    keywords: [...CLIENT, "northstar", "analytics", "hyderabad", "document ai"] },
  { file: "client-invoice-meridian.jpg", title: "Invoice to Meridian Legal", party: "Meridian Legal LLP · Mumbai", kind: "Invoice", meta: "₹10,62,000 · 04 Feb 2026", amount: 1062000, month: 2, year: 2026,
    keywords: [...CLIENT, "meridian", "legal", "mumbai", "contracts"] },
  { file: "client-invoice-quantvia.jpg", title: "Invoice to Quantvia Systems", party: "Quantvia Systems · Bengaluru", kind: "Invoice", meta: "₹6,54,900 · 09 Mar 2026", amount: 654900, month: 3, year: 2026,
    keywords: [...CLIENT, "quantvia", "systems", "bengaluru", "migration"] },
  { file: "client-invoice-blueharbor.jpg", title: "Invoice to Blue Harbor Shipping", party: "Blue Harbor Shipping · Mumbai", kind: "Invoice", meta: "₹15,10,400 · 15 Apr 2026", amount: 1510400, month: 4, year: 2026,
    keywords: [...CLIENT, "blue harbor", "shipping", "mumbai", "enterprise"] },
  { file: "client-invoice-everline.jpg", title: "Invoice to Everline Media", party: "Everline Media Group · Mumbai", kind: "Invoice", meta: "₹6,96,200 · 20 May 2026", amount: 696200, month: 5, year: 2026,
    keywords: [...CLIENT, "everline", "media", "mumbai", "archive"] },

  // --- Delhivery consignment notes → Mumbai ------------------------------
  { file: "delhivery-blr-mumbai.jpg", title: "Delhivery courier bill — Bengaluru → Mumbai", party: "Delhivery · AWB 159284410077", kind: "Courier", meta: "₹1,560 · Bengaluru → Mumbai · 22 Jan 2026", amount: 1560, month: 1, year: 2026,
    keywords: [...COURIER, "bengaluru", "bangalore", "surface"] },
  { file: "delhivery-del-mumbai.jpg", title: "Delhivery courier bill — Delhi → Mumbai", party: "Delhivery · AWB 159311902845", kind: "Courier", meta: "₹846 · Delhi → Mumbai · 07 Feb 2026", amount: 846, month: 2, year: 2026,
    keywords: [...COURIER, "delhi", "new delhi", "air"] },
  { file: "delhivery-maa-mumbai.jpg", title: "Delhivery courier bill — Chennai → Mumbai", party: "Delhivery · AWB 159402277163", kind: "Courier", meta: "₹2,961 · Chennai → Mumbai · 18 Mar 2026", amount: 2961, month: 3, year: 2026,
    keywords: [...COURIER, "chennai", "surface"] },
  { file: "delhivery-hyd-mumbai.jpg", title: "Delhivery courier bill — Hyderabad → Mumbai", party: "Delhivery · AWB 159488120934", kind: "Courier", meta: "₹1,296 · Hyderabad → Mumbai · 11 Apr 2026", amount: 1296, month: 4, year: 2026,
    keywords: [...COURIER, "hyderabad", "air"] },
  { file: "delhivery-pnq-mumbai.jpg", title: "Delhivery courier bill — Pune → Mumbai", party: "Delhivery · AWB 159560338471", kind: "Courier", meta: "₹1,004 · Pune → Mumbai · 29 May 2026", amount: 1004, month: 5, year: 2026,
    keywords: [...COURIER, "pune", "surface"] },
];

const STOPWORDS = new Set([
  "the", "our", "for", "all", "this", "year", "my", "in", "from", "over",
  "a", "an", "of", "to", "and", "with", "i", "we", "me", "on", "at", "is",
  "show", "find", "get", "list", "want", "need", "please", "documents",
  "document", "docs", "doc", "that", "are", "worth", "rs", "rupees", "inr",
  "than", "more", "less", "under", "below", "above", "between", "any", "some",
  "dated", "during", "month", "invoice", "invoices", "bill", "bills",
  "receipt", "receipts", "courier", "couriers",
]);

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Indian-grouped rupee formatting for intent labels, e.g. 75000 -> "75,000".
function fmtINR(n: number): string {
  const s = Math.round(n).toString();
  if (s.length <= 3) return s;
  const head = s.slice(0, -3);
  const tail = s.slice(-3);
  const parts: string[] = [];
  let h = head;
  while (h.length > 2) {
    parts.unshift(h.slice(-2));
    h = h.slice(0, -2);
  }
  if (h) parts.unshift(h);
  return parts.join(",") + "," + tail;
}

const AMT = String.raw`(?:rs\.?|inr|₹)?\s*([\d][\d.,]*)\s*(k|lakhs?|lac|crores?|cr)?`;

function toNumber(numStr: string, unit?: string): number {
  let n = parseFloat(numStr.replace(/,/g, ""));
  const u = (unit || "").toLowerCase();
  if (u === "k") n *= 1e3;
  else if (u.startsWith("lakh") || u === "lac") n *= 1e5;
  else if (u.startsWith("crore") || u === "cr") n *= 1e7;
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
  [/\b(couriers?|consignments?|shipments?|waybills?|awbs?)\b/i, "Courier"],
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
    amtLabels.push(`₹${fmtINR(min)}–₹${fmtINR(max)}`);
    rest = rest.replace(between[0], " ");
  } else {
    const lo = rest.match(new RegExp(String.raw`\b(?:over|above|more than|greater than|at\s?least|exceeding|>=?|min)\s*${AMT}`, "i"));
    if (lo) { min = toNumber(lo[1], lo[2]); amtLabels.push(`over ₹${fmtINR(min)}`); rest = rest.replace(lo[0], " "); }
    const hi = rest.match(new RegExp(String.raw`\b(?:under|below|less than|cheaper than|at\s?most|up\s?to|upto|<=?|max)\s*${AMT}`, "i"));
    if (hi) { max = toNumber(hi[1], hi[2]); amtLabels.push(`under ₹${fmtINR(max)}`); rest = rest.replace(hi[0], " "); }
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
    .replace(/[₹,]/g, " ")
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
