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
  keywords: string[]; // synonyms so different phrasings match
};

export type Example = { emoji: string; text: string };

// The chips under the search bar — seed queries the visitor can then edit.
export const examples: Example[] = [
  { emoji: "🧾", text: "GST invoice from our Bengaluru supplier for the June order" },
  { emoji: "💡", text: "our office electricity bill from last quarter" },
  { emoji: "🧾", text: "receipt for the laptop I expensed at Croma" },
  { emoji: "📑", text: "all client invoices over ₹5 lakh this year" },
  { emoji: "🚚", text: "the Delhivery courier bill for the Mumbai shipment" },
];

const GST = ["gst", "invoice", "tax invoice", "supplier", "vendor", "purchase", "bengaluru", "bangalore", "karnataka", "june", "2025"];
const POWER = ["electricity", "bill", "power", "energy", "utility", "bescom", "office", "last quarter", "units", "kwh", "bengaluru", "karnataka", "2026"];
const CROMA = ["receipt", "croma", "laptop", "expense", "expensed", "electronics", "invoice", "purchase", "warranty", "2026"];
const CLIENT = ["invoice", "client", "outgoing", "5 lakh", "five lakh", "high value", "500000", "large", "services", "igst", "2026"];
const COURIER = ["courier", "delhivery", "shipment", "consignment", "awb", "waybill", "mumbai", "freight", "logistics", "shipping", "2026"];

export const docs: Doc[] = [
  // --- GST invoices, Bengaluru suppliers, June 2025 -----------------------
  { file: "gst-sunrise-electronics-jun.jpg", title: "Sunrise Electronics — GST invoice", party: "Sunrise Electronics · SP Road, Bengaluru", kind: "Invoice", meta: "₹1,42,544 · 03 Jun 2025",
    keywords: [...GST, "sunrise", "electronics", "pcb", "components", "sp road"] },
  { file: "gst-nandi-components-jun.jpg", title: "Nandi Components — GST invoice", party: "Nandi Components · Peenya, Bengaluru", kind: "Invoice", meta: "₹76,228 · 11 Jun 2025",
    keywords: [...GST, "nandi", "components", "enclosures", "hardware", "peenya"] },
  { file: "gst-koramangala-hardware-jun.jpg", title: "Koramangala Hardware — GST invoice", party: "Koramangala Hardware Supplies · Bengaluru", kind: "Invoice", meta: "₹73,266 · 18 Jun 2025",
    keywords: [...GST, "koramangala", "hardware", "server rack", "cables", "networking"] },
  { file: "gst-bharadwaj-traders-jun.jpg", title: "Bharadwaj Traders — GST invoice", party: "Bharadwaj Traders · Chickpet, Bengaluru", kind: "Invoice", meta: "₹1,71,808 · 22 Jun 2025",
    keywords: [...GST, "bharadwaj", "traders", "furniture", "chairs", "desks", "chickpet"] },
  { file: "gst-indiranagar-office-jun.jpg", title: "Indiranagar Office Supplies — GST invoice", party: "Indiranagar Office Supplies · Bengaluru", kind: "Invoice", meta: "₹75,284 · 27 Jun 2025",
    keywords: [...GST, "indiranagar", "office supplies", "paper", "stationery", "toner"] },

  // --- BESCOM electricity bills, last quarter (Apr–Jun 2026) --------------
  { file: "bescom-mg-road-apr.jpg", title: "BESCOM electricity bill — April", party: "BESCOM · MG Road HQ office", kind: "Bill", meta: "₹28,621 · Apr 2026",
    keywords: [...POWER, "mg road", "jayanagar", "headquarters", "hq", "april"] },
  { file: "bescom-mg-road-may.jpg", title: "BESCOM electricity bill — May", party: "BESCOM · MG Road HQ office", kind: "Bill", meta: "₹30,293 · May 2026",
    keywords: [...POWER, "mg road", "jayanagar", "headquarters", "hq", "may"] },
  { file: "bescom-mg-road-jun.jpg", title: "BESCOM electricity bill — June", party: "BESCOM · MG Road HQ office", kind: "Bill", meta: "₹31,338 · Jun 2026",
    keywords: [...POWER, "mg road", "jayanagar", "headquarters", "hq", "june"] },
  { file: "bescom-whitefield-may.jpg", title: "BESCOM electricity bill — Whitefield, May", party: "BESCOM · Whitefield office", kind: "Bill", meta: "₹18,038 · May 2026",
    keywords: [...POWER, "whitefield", "itpl", "may"] },
  { file: "bescom-whitefield-jun.jpg", title: "BESCOM electricity bill — Whitefield, June", party: "BESCOM · Whitefield office", kind: "Bill", meta: "₹18,886 · Jun 2026",
    keywords: [...POWER, "whitefield", "itpl", "june"] },

  // --- Croma laptop receipts ---------------------------------------------
  { file: "croma-macbook-air.jpg", title: "Croma — MacBook Air receipt", party: "Croma · Jayanagar, Bengaluru", kind: "Receipt", meta: "₹1,34,900 · 14 Feb 2026",
    keywords: [...CROMA, "macbook", "macbook air", "apple", "m3"] },
  { file: "croma-dell-xps.jpg", title: "Croma — Dell XPS 13 receipt", party: "Croma · Jayanagar, Bengaluru", kind: "Receipt", meta: "₹1,52,990 · 26 Mar 2026",
    keywords: [...CROMA, "dell", "xps"] },
  { file: "croma-thinkpad-e14.jpg", title: "Croma — ThinkPad E14 receipt", party: "Croma · Jayanagar, Bengaluru", kind: "Receipt", meta: "₹87,490 · 09 Apr 2026",
    keywords: [...CROMA, "lenovo", "thinkpad", "e14"] },
  { file: "croma-hp-pavilion.jpg", title: "Croma — HP Pavilion 14 receipt", party: "Croma · Jayanagar, Bengaluru", kind: "Receipt", meta: "₹68,990 · 21 May 2026",
    keywords: [...CROMA, "hp", "pavilion"] },
  { file: "croma-asus-vivobook.jpg", title: "Croma — ASUS Vivobook receipt", party: "Croma · Jayanagar, Bengaluru", kind: "Receipt", meta: "₹61,990 · 18 Jun 2026",
    keywords: [...CROMA, "asus", "vivobook"] },

  // --- Outgoing client invoices > ₹5 lakh, 2026 --------------------------
  { file: "client-invoice-northstar.jpg", title: "Invoice to Northstar Analytics", party: "Northstar Analytics · Hyderabad", kind: "Invoice", meta: "₹7,19,800 · 12 Jan 2026",
    keywords: [...CLIENT, "northstar", "analytics", "hyderabad", "document ai", "719800"] },
  { file: "client-invoice-meridian.jpg", title: "Invoice to Meridian Legal", party: "Meridian Legal LLP · Mumbai", kind: "Invoice", meta: "₹10,62,000 · 04 Feb 2026",
    keywords: [...CLIENT, "meridian", "legal", "mumbai", "contracts", "1062000", "10 lakh"] },
  { file: "client-invoice-quantvia.jpg", title: "Invoice to Quantvia Systems", party: "Quantvia Systems · Bengaluru", kind: "Invoice", meta: "₹6,54,900 · 09 Mar 2026",
    keywords: [...CLIENT, "quantvia", "systems", "bengaluru", "migration", "654900"] },
  { file: "client-invoice-blueharbor.jpg", title: "Invoice to Blue Harbor Shipping", party: "Blue Harbor Shipping · Mumbai", kind: "Invoice", meta: "₹15,10,400 · 15 Apr 2026",
    keywords: [...CLIENT, "blue harbor", "shipping", "mumbai", "enterprise", "1510400", "15 lakh"] },
  { file: "client-invoice-everline.jpg", title: "Invoice to Everline Media", party: "Everline Media Group · Mumbai", kind: "Invoice", meta: "₹6,96,200 · 20 May 2026",
    keywords: [...CLIENT, "everline", "media", "mumbai", "archive", "696200"] },

  // --- Delhivery consignment notes → Mumbai ------------------------------
  { file: "delhivery-blr-mumbai.jpg", title: "Delhivery courier bill — Bengaluru → Mumbai", party: "Delhivery · AWB 159284410077", kind: "Courier", meta: "₹1,560 · Bengaluru → Mumbai · 22 Jan 2026",
    keywords: [...COURIER, "bengaluru", "bangalore", "surface"] },
  { file: "delhivery-del-mumbai.jpg", title: "Delhivery courier bill — Delhi → Mumbai", party: "Delhivery · AWB 159311902845", kind: "Courier", meta: "₹846 · Delhi → Mumbai · 07 Feb 2026",
    keywords: [...COURIER, "delhi", "new delhi", "air"] },
  { file: "delhivery-maa-mumbai.jpg", title: "Delhivery courier bill — Chennai → Mumbai", party: "Delhivery · AWB 159402277163", kind: "Courier", meta: "₹2,961 · Chennai → Mumbai · 18 Mar 2026",
    keywords: [...COURIER, "chennai", "surface"] },
  { file: "delhivery-hyd-mumbai.jpg", title: "Delhivery courier bill — Hyderabad → Mumbai", party: "Delhivery · AWB 159488120934", kind: "Courier", meta: "₹1,296 · Hyderabad → Mumbai · 11 Apr 2026",
    keywords: [...COURIER, "hyderabad", "air"] },
  { file: "delhivery-pnq-mumbai.jpg", title: "Delhivery courier bill — Pune → Mumbai", party: "Delhivery · AWB 159560338471", kind: "Courier", meta: "₹1,004 · Pune → Mumbai · 29 May 2026",
    keywords: [...COURIER, "pune", "surface"] },
];

const STOPWORDS = new Set([
  "the", "our", "for", "all", "this", "year", "my", "in", "from", "over",
  "a", "an", "of", "to", "and", "with", "i", "we", "me", "on", "at", "is",
]);

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export type Ranked = { doc: Doc; score: number; pct: number };

/**
 * Client-side keyword search over the fabricated corpus. Lowercases and
 * tokenizes the query, drops stopwords, and scores each doc: a whole-word hit
 * in its haystack weighs 3, a looser substring hit weighs 1. Returns the
 * score-sorted matches (capped) with a display-friendly confidence percent.
 */
export function searchDocs(query: string, limit = 8): Ranked[] {
  const tokens = query
    .toLowerCase()
    .replace(/[₹,]/g, " ")
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
  if (tokens.length === 0) return [];

  const scored = docs
    .map((doc) => {
      const hay = [doc.title, doc.party, doc.kind, doc.meta, doc.keywords.join(" ")]
        .join(" ")
        .toLowerCase();
      let score = 0;
      for (const t of tokens) {
        if (new RegExp(`\\b${escapeRe(t)}\\b`).test(hay)) score += 3;
        else if (hay.includes(t)) score += 1;
      }
      return { doc, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  const top = scored[0]?.score ?? 1;
  return scored.slice(0, limit).map((r) => ({
    ...r,
    pct: Math.round(75 + (r.score / top) * 22), // 75–97, natural-looking
  }));
}
