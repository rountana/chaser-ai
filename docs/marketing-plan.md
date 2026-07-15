# chaserAI — Marketing Plan (North America)

_Working draft. Product is pre-launch (waitlist live). Geography: United States & English Canada.
Last updated 2026-07-15._

## 1. What we're actually selling

chaserAI is a **desktop app (macOS 13+, Windows 10/11)** that OCRs scanned PDFs, photographed
bills, and paper receipts, then lets you retrieve any of them by **natural-language description**
("the internet bill that's due Friday") via a universal hotkey (⌘ + Space). The search index stays
local on the device; document contents are sent to an AI model for processing but never stored.

**The wedge — three things that only matter together:**

1. **OCR that reads messy scans/photos** — not just the text layer.
2. **Natural-language retrieval** — no filenames or folders required.
3. **Private / local** — index on device, bring-your-own-key, nothing stored by us.

We are **not** competing in general desktop search (crowded, weak differentiation). Our ownable
market is **retrieval of scanned financial paperwork** — invoices, bills, receipts, tax documents —
for people who have a lot of it and a reason to care about privacy.

### Constraints that shape the addressable market (today)

- **English-only** — for North America this is a *fit*, not a limitation: it cleanly covers the US
  and English Canada. It does exclude Québec/French-Canadian and US-Hispanic-first segments for now.
- **Desktop-only, needs internet + an AI key** — private, but *not* offline/air-gapped. Don't
  target buyers who need true on-prem/no-cloud.
- **Copy is currently India-flavored** (GST, ₹, Bengaluru, Croma, Delhivery) — this must be
  re-skinned for North America before any launch here (see §6). Every non-finance vertical then
  needs a further re-skin for that field's paperwork.

## 2. Positioning decision (must resolve before launch)

There's a gap in the current site: the brand tagline ("AI-powered desktop search," "Chase down any
file") promises *general* file search, but every headline, feature, and example narrows to
invoices/bills/receipts. We can't credibly sell both with one page.

**Decision: commit to the financial-document niche.** OCR-on-messy-scans is where our real
differentiation lives; general file search is not. Let the generic tagline go.

## 3. Target verticals

### Tier 1 — Strongest fit, market now

Exact pain the product already describes; active tool buyers.

- **Bookkeepers, CPAs, EAs & tax preparers** — piles of *client* receipts/invoices, constant
  retrieval pain, real privacy stakes (client financial data → BYO-key is a genuine selling point),
  and sharp seasonal triggers (Jan 1099/W-2 season, the April 15 filing deadline, quarterly
  estimated taxes). They live in QuickBooks/Xero but still drown in a "shoebox" of scanned and
  photographed source documents — that's our gap to fill.
- **SMB owners & their ops/admin staff** — retail, e-commerce, trades, agencies, restaurants.
  Vendor bills, sales-tax records, expense receipts, 1099 contractor paperwork. This is who the
  Examples section should speak to (re-skinned: Costco/Home Depot/Amazon Business receipts, the
  FedEx/UPS invoice, "all client invoices over $10k this year").
- **Freelancers / solo consultants / gig & 1099 workers** — expense receipts and invoices for
  Schedule C deductions and reimbursement. Low-friction, self-serve buyers.

### Tier 2 — Adjacent, same pain, minor repositioning

Document-heavy operators where "receipts" becomes "the paperwork of the job."

- **Property managers / landlords** — leases, utility bills, maintenance invoices across units.
- **Construction / contractors / trades** — field-photographed material receipts, subcontractor
  bills, permits (OCR-on-photos shines here).
- **Real estate agents / brokers** — contracts, disclosures, inspection reports, closing docs.
- **Insurance agents / claims adjusters** — policies, scanned claim forms, EOBs.
- **Logistics / freight / import-export** — carrier bills (FedEx/UPS/freight), bills of lading,
  customs invoices.

### Tier 3 — Privacy-led, higher value, needs care

Lead with "private by design / your data only touches your account." Bigger deals, longer sales;
soften any compliance claims.

- **Solo & small law firms** — scanned exhibits, contracts, case files (privacy non-negotiable).
- **Small medical / dental practices** — scanned records, insurance EOBs, billing. Strong privacy
  story, but be careful making HIPAA claims — say what the product does (nothing stored, local
  index), don't assert compliance we haven't certified.
- **Journalists / investigators / researchers** — document dumps, FOIA/archival scans.

## 4. Pricing → who converts on which tier

Intended model (from `Pricing.tsx`, not yet rendered live). USD already fits North America; add CAD
display for Canada.

| Tier | Price | Fit |
|------|-------|-----|
| Free · BYOK | $0, up to 2,000 pages, single device | Trial / individuals |
| Pro · BYOK | $6/mo ($48/yr) | Freelancers, solo consultants, individual bookkeepers, prosumers |
| Lifetime · BYOK | $149 one-time | Privacy-minded solo pros who distrust subscriptions (lawyers, journalists) |
| Managed | $29/mo, 1,500 pages then metered | SMBs, CPA/bookkeeping firms, property managers, trades — won't touch an API key |

**Takeaway:** vertical fit is *per tier*. Individuals convert on **BYOK ($6)**; businesses convert
on **Managed ($29)** — the higher-ARPU lane. Lifetime is a launch-momentum lever for the
privacy-first solo segment.

## 5. Recommended beachhead

Pick **one** Tier-1 segment rather than spreading thin: **North American bookkeepers & small
accounting/tax practices (CPAs and EAs)**. Reasons:

- Sharpest, most frequent pain (daily client-document retrieval).
- Clearest privacy motivation for BYO-key (client financial data).
- Strong, calendar-driven buying triggers (1099 season, April 15, quarterly estimates).
- Tight, word-of-mouth community with dense channels — QuickBooks ProAdvisor network, r/Bookkeeping
  and r/Accounting, AICPA/state-society groups, "accounting Twitter/LinkedIn," and bookkeeping
  podcasts/newsletters.

Position chaserAI as the **fast finder for the source documents QuickBooks/Xero don't organize** —
complementary, not competitive. Nail this segment, then expand into Tier 2 by re-skinning the same
core message.

## 6. Open items / to reconcile before launch

- **Localize the copy for North America:** replace all India-specific examples (GST invoice,
  ₹5 lakh, Bengaluru supplier, Croma, Delhivery) with US/Canada equivalents (sales-tax/vendor
  invoice, "$10k+ client invoices," Costco/Home Depot/Amazon Business, FedEx/UPS). This blocks any
  NA launch.
- **Currency display:** show USD by default, CAD for Canadian visitors.
- **Platform contradiction:** `Pricing.tsx` says "Available on App Store & Play Store," but the FAQ
  says desktop-only (no iOS/Android). Reconcile — it decides whether mobile-first verticals are on
  the table. Today they are not.
- **Positioning gap** (§2) must be resolved in the live copy.
- **Vertical-specific copy:** rework hero/features/examples once the beachhead is locked; consider
  two vertical variants to A/B.
- **Compliance language:** for Tier 3 (legal/medical), keep privacy claims factual (nothing stored,
  local index) and avoid asserting HIPAA/regulatory compliance until certified.
