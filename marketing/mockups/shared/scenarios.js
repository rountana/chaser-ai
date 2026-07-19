// marketing/mockups/shared/scenarios.js
// Scripted query -> result data for the AI-mode marketing mockups, drawn
// from the real North America document corpus already shipped in
// NorthAmerica/lib/sampleDocs.ts. Each scenario drives both
// search-ai-mode.html (query typing only) and results-ai-mode.html (full
// scan -> verify -> complete loop). `result.filename` doubles as the image
// source under shared/samples/.

export const scenarios = [
  {
    id: "fedex-austin",
    query: "the FedEx bill for the Austin shipment",
    sidebar: [
      { label: "Shipping", count: 5 },
    ],
    scanFeed: [
      { file: "courier-fedex-austin.jpg", folder: "~/Documents/Shipping/FedEx" },
      { file: "courier-ups-boston.jpg", folder: "~/Documents/Shipping/UPS" },
      { file: "vendor-ironclad-hardware-jun.jpg", folder: "~/Documents/Vendors/Ironclad Hardware" },
      { file: "courier-fedex-denver.jpg", folder: "~/Documents/Shipping/FedEx" },
      { file: "utility-loop-jun.jpg", folder: "~/Documents/Utilities" },
      { file: "courier-ups-cleveland.jpg", folder: "~/Documents/Shipping/UPS" },
      { file: "retail-costco-jun.jpg", folder: "~/Documents/Receipts" },
      { file: "courier-fedex-sandiego.jpg", folder: "~/Documents/Shipping/FedEx" },
    ],
    results: [
      { filename: "courier-fedex-austin.jpg", snippet: "…FedEx, tracking 782044109938, Chicago to Austin, ground service…", score: 0.97, top: true, type: "Courier", date: "Jan 22, 2026", keywords: ["fedex", "austin", "ground"] },
      { filename: "courier-fedex-denver.jpg", snippet: "…FedEx, tracking 782061837765, Chicago to Denver, ground…", score: 0.81, type: "Courier", date: "Mar 18, 2026", keywords: ["fedex", "denver"] },
      { filename: "courier-fedex-sandiego.jpg", snippet: "…FedEx, tracking 782099204471, Chicago to San Diego, air…", score: 0.76, type: "Courier", date: "May 29, 2026", keywords: ["fedex", "san diego"] },
      { filename: "courier-ups-boston.jpg", snippet: "…UPS, tracking 1Z9A87W40312445890, Chicago to Boston, air…", score: 0.64, type: "Courier", date: "Feb 7, 2026", keywords: [] },
      { filename: "courier-ups-cleveland.jpg", snippet: "…UPS, tracking 1Z9A87W40315509934, Chicago to Cleveland, ground…", score: 0.58, type: "Courier", date: "Apr 11, 2026", keywords: [] },
    ],
    elapsedLabel: "1.9s",
  },
  {
    id: "home-depot-renovation",
    query: "the Home Depot receipt for the office renovation",
    sidebar: [
      { label: "Receipts", count: 3 },
      { label: "Financial", count: 2 },
    ],
    scanFeed: [
      { file: "retail-homedepot-may.jpg", folder: "~/Documents/Receipts" },
      { file: "vendor-summit-furnishings-jun.jpg", folder: "~/Documents/Vendors/Summit Business Furnishings" },
      { file: "vendor-cascade-office-jun.jpg", folder: "~/Documents/Vendors/Cascade Office Essentials" },
      { file: "retail-staples-apr.jpg", folder: "~/Documents/Receipts" },
      { file: "vendor-meridian-print-jun.jpg", folder: "~/Documents/Vendors/Meridian Print & Packaging" },
      { file: "retail-costco-jun.jpg", folder: "~/Documents/Receipts" },
      { file: "utility-evanston-jun.jpg", folder: "~/Documents/Utilities" },
      { file: "retail-bestbuy-mar.jpg", folder: "~/Documents/Receipts" },
    ],
    results: [
      { filename: "retail-homedepot-may.jpg", snippet: "…The Home Depot, Chicago IL, tools + shelving for the office renovation…", score: 0.95, top: true, type: "Receipt", date: "May 21, 2026", keywords: ["home depot", "renovation", "tools", "shelving"] },
      { filename: "vendor-summit-furnishings-jun.jpg", snippet: "…Summit Business Furnishings, chairs and desks, office fit-out…", score: 0.83, type: "Invoice", date: "Jun 5, 2025", keywords: ["furniture", "office fit-out"] },
      { filename: "vendor-cascade-office-jun.jpg", snippet: "…Cascade Office Essentials, paper, toner, markers…", score: 0.71, type: "Invoice", date: "Jun 20, 2025", keywords: [] },
      { filename: "retail-staples-apr.jpg", snippet: "…Staples, printer and office supplies, unrelated to the renovation…", score: 0.64, type: "Receipt", date: "Apr 9, 2026", keywords: [] },
      { filename: "retail-costco-jun.jpg", snippet: "…Costco Wholesale, pantry and office supplies, bulk order…", score: 0.57, type: "Receipt", date: "Jun 18, 2026", keywords: [] },
    ],
    elapsedLabel: "2.0s",
  },
  {
    id: "client-invoices-10k",
    query: "all outgoing client invoices over $10,000",
    sidebar: [
      { label: "Financial", count: 5 },
    ],
    scanFeed: [
      { file: "client-invoice-cedarstone.jpg", folder: "~/Documents/Clients/Cedar & Stone Law Group" },
      { file: "client-invoice-pinecrest.jpg", folder: "~/Documents/Clients/Pinecrest Manufacturing" },
      { file: "client-invoice-brightpath.jpg", folder: "~/Documents/Clients/Bright Path Analytics" },
      { file: "client-invoice-unionsquare.jpg", folder: "~/Documents/Clients/Union Square Realty" },
      { file: "client-invoice-delmar.jpg", folder: "~/Documents/Clients/Del Mar Hospitality" },
      { file: "courier-fedex-denver.jpg", folder: "~/Documents/Shipping/FedEx" },
      { file: "vendor-crestline-it-jun.jpg", folder: "~/Documents/Vendors/Crestline IT Solutions" },
      { file: "utility-loop-may.jpg", folder: "~/Documents/Utilities" },
    ],
    results: [
      { filename: "client-invoice-cedarstone.jpg", snippet: "…Cedar & Stone Law Group, Boston MA, total due $61,500.00, contracts…", score: 0.95, top: true, type: "Invoice", date: "Feb 4, 2026", keywords: ["cedar & stone", "law", "$61,500"] },
      { filename: "client-invoice-pinecrest.jpg", snippet: "…Pinecrest Manufacturing Co, Cleveland OH, total due $34,200.00…", score: 0.89, type: "Invoice", date: "Apr 15, 2026", keywords: ["pinecrest", "$34,200"] },
      { filename: "client-invoice-brightpath.jpg", snippet: "…Bright Path Analytics Inc, Austin TX, total due $28,400.00…", score: 0.84, type: "Invoice", date: "Jan 12, 2026", keywords: ["bright path", "$28,400"] },
      { filename: "client-invoice-unionsquare.jpg", snippet: "…Union Square Realty Partners, Denver CO, total due $19,800.00…", score: 0.77, type: "Invoice", date: "Mar 9, 2026", keywords: ["union square", "$19,800"] },
      { filename: "client-invoice-delmar.jpg", snippet: "…Del Mar Hospitality Group, San Diego CA, total due $12,650.00…", score: 0.68, type: "Invoice", date: "May 20, 2026", keywords: ["del mar", "$12,650"] },
    ],
    elapsedLabel: "2.3s",
  },
];
