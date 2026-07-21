// marketing/mockups/shared/scenarios.js
// Scripted data for the AI-mode marketing mockups, drawn from the real North
// America document corpus in NorthAmerica/lib/sampleDocs.ts.
//
// results-ai-mode.html tells a 3-act before/after story on ONE shared file set
// per scenario:
//   Act 1 (the pile)   — a Finder window of `files`, shown by their junk
//                        camera/scanner `name`s (IMG_5510.jpg, Scan_2026….pdf).
//   Act 2 (failed hunt)— the `search` term typed into Finder → no matches
//                        (scans have no text layer; junk names don't contain it).
//   Act 3 (chaserAI)   — the SAME `files`, the SAME junk `name`s, the SAME
//                        `search` term — but chaserAI reads the images and ranks
//                        `results`. Each result's `name` is its junk filename and
//                        `file` is the real sample image (the thumbnail/preview
//                        source), so the payoff is literal: IMG_5510.jpg IS the
//                        Home Depot receipt once something actually reads it.
//
// `query` is the richer natural-language phrasing used only by
// search-ai-mode.html (the ⌘K palette). The results page uses `search`.

export const scenarios = [
  {
    id: "fedex-austin",
    search: "fedex austin shipment",
    query: "the FedEx bill for the Austin shipment",
    folder: { name: "Scans to file", path: "~/Documents/Scans to file", itemCount: 128 },
    files: [
      { name: "IMG_4471.jpg", file: "courier-fedex-austin.jpg" },
      { name: "IMG_4472.jpg", file: "courier-fedex-denver.jpg" },
      { name: "Scan_20260207.pdf", file: "courier-ups-boston.jpg" },
      { name: "CCF04112026.pdf", file: "courier-ups-cleveland.jpg" },
      { name: "IMG_4490.HEIC", file: "courier-fedex-sandiego.jpg" },
      { name: "doc0451.pdf", file: "utility-loop-jun.jpg" },
      { name: "2026-06-18 14.02.pdf", file: "retail-costco-jun.jpg" },
      { name: "New Scan (3).jpg", file: "vendor-ironclad-hardware-jun.jpg" },
    ],
    results: [
      { name: "IMG_4471.jpg", file: "courier-fedex-austin.jpg", snippet: "…FedEx, tracking 782044109938, Chicago to Austin, ground service…", score: 0.97, top: true, type: "Courier", date: "Jan 22, 2026", keywords: ["fedex", "austin", "ground"] },
      { name: "IMG_4472.jpg", file: "courier-fedex-denver.jpg", snippet: "…FedEx, tracking 782061837765, Chicago to Denver, ground…", score: 0.81, type: "Courier", date: "Mar 18, 2026", keywords: ["fedex", "denver"] },
      { name: "IMG_4490.HEIC", file: "courier-fedex-sandiego.jpg", snippet: "…FedEx, tracking 782099204471, Chicago to San Diego, air…", score: 0.76, type: "Courier", date: "May 29, 2026", keywords: ["fedex", "san diego"] },
      { name: "Scan_20260207.pdf", file: "courier-ups-boston.jpg", snippet: "…UPS, tracking 1Z9A87W40312445890, Chicago to Boston, air…", score: 0.64, type: "Courier", date: "Feb 7, 2026", keywords: [] },
      { name: "CCF04112026.pdf", file: "courier-ups-cleveland.jpg", snippet: "…UPS, tracking 1Z9A87W40315509934, Chicago to Cleveland, ground…", score: 0.58, type: "Courier", date: "Apr 11, 2026", keywords: [] },
    ],
    sidebar: [
      { label: "Shipping", count: 5 },
    ],
    elapsedLabel: "1.9s",
  },
  {
    id: "home-depot-renovation",
    search: "home depot tools",
    query: "the Home Depot receipt for the office renovation",
    folder: { name: "Receipts 2026", path: "~/Documents/Receipts 2026", itemCount: 214 },
    files: [
      { name: "IMG_5510.jpg", file: "retail-homedepot-may.jpg" },
      { name: "IMG_5511.jpg", file: "retail-staples-apr.jpg" },
      { name: "Scan_20260605.pdf", file: "vendor-summit-furnishings-jun.jpg" },
      { name: "CCF06202026.pdf", file: "vendor-cascade-office-jun.jpg" },
      { name: "IMG_5498.HEIC", file: "retail-bestbuy-mar.jpg" },
      { name: "doc0466.pdf", file: "vendor-meridian-print-jun.jpg" },
      { name: "2026-06-18 09.11.pdf", file: "retail-costco-jun.jpg" },
      { name: "Untitled.pdf", file: "utility-evanston-jun.jpg" },
    ],
    results: [
      { name: "IMG_5510.jpg", file: "retail-homedepot-may.jpg", snippet: "…The Home Depot, Chicago IL, tools + shelving for the office renovation…", score: 0.95, top: true, type: "Receipt", date: "May 21, 2026", keywords: ["home depot", "renovation", "tools", "shelving"] },
      { name: "Scan_20260605.pdf", file: "vendor-summit-furnishings-jun.jpg", snippet: "…Summit Business Furnishings, chairs and desks, office fit-out…", score: 0.83, type: "Invoice", date: "Jun 5, 2025", keywords: ["furniture", "office fit-out"] },
      { name: "CCF06202026.pdf", file: "vendor-cascade-office-jun.jpg", snippet: "…Cascade Office Essentials, paper, toner, markers…", score: 0.71, type: "Invoice", date: "Jun 20, 2025", keywords: [] },
      { name: "IMG_5511.jpg", file: "retail-staples-apr.jpg", snippet: "…Staples, printer and office supplies, unrelated to the renovation…", score: 0.64, type: "Receipt", date: "Apr 9, 2026", keywords: [] },
      { name: "2026-06-18 09.11.pdf", file: "retail-costco-jun.jpg", snippet: "…Costco Wholesale, pantry and office supplies, bulk order…", score: 0.57, type: "Receipt", date: "Jun 18, 2026", keywords: [] },
    ],
    sidebar: [
      { label: "Receipts", count: 3 },
      { label: "Financial", count: 2 },
    ],
    elapsedLabel: "2.0s",
  },
  {
    id: "client-invoices-10k",
    search: "client invoices over $10k",
    query: "all outgoing client invoices over $10,000",
    folder: { name: "Client scans", path: "~/Documents/Client scans", itemCount: 302 },
    files: [
      { name: "Scan_20260204_1042.pdf", file: "client-invoice-cedarstone.jpg" },
      { name: "Scan_20260415_0930.pdf", file: "client-invoice-pinecrest.jpg" },
      { name: "IMG_6120.jpg", file: "client-invoice-brightpath.jpg" },
      { name: "CCF03092026.pdf", file: "client-invoice-unionsquare.jpg" },
      { name: "IMG_6155.jpg", file: "client-invoice-delmar.jpg" },
      { name: "doc0480.pdf", file: "vendor-crestline-it-jun.jpg" },
      { name: "2026-03-18 16.20.pdf", file: "courier-fedex-denver.jpg" },
      { name: "New Scan (7).pdf", file: "utility-loop-may.jpg" },
    ],
    results: [
      { name: "Scan_20260204_1042.pdf", file: "client-invoice-cedarstone.jpg", snippet: "…Cedar & Stone Law Group, Boston MA, total due $61,500.00, contracts…", score: 0.95, top: true, type: "Invoice", date: "Feb 4, 2026", keywords: ["cedar & stone", "law", "$61,500"] },
      { name: "Scan_20260415_0930.pdf", file: "client-invoice-pinecrest.jpg", snippet: "…Pinecrest Manufacturing Co, Cleveland OH, total due $34,200.00…", score: 0.89, type: "Invoice", date: "Apr 15, 2026", keywords: ["pinecrest", "$34,200"] },
      { name: "IMG_6120.jpg", file: "client-invoice-brightpath.jpg", snippet: "…Bright Path Analytics Inc, Austin TX, total due $28,400.00…", score: 0.84, type: "Invoice", date: "Jan 12, 2026", keywords: ["bright path", "$28,400"] },
      { name: "CCF03092026.pdf", file: "client-invoice-unionsquare.jpg", snippet: "…Union Square Realty Partners, Denver CO, total due $19,800.00…", score: 0.77, type: "Invoice", date: "Mar 9, 2026", keywords: ["union square", "$19,800"] },
      { name: "IMG_6155.jpg", file: "client-invoice-delmar.jpg", snippet: "…Del Mar Hospitality Group, San Diego CA, total due $12,650.00…", score: 0.68, type: "Invoice", date: "May 20, 2026", keywords: ["del mar", "$12,650"] },
    ],
    sidebar: [
      { label: "Financial", count: 5 },
    ],
    elapsedLabel: "2.3s",
  },
];
