# chaserAI — Marketing Plan (North America)

_Working draft. Product is pre-launch (waitlist live). Geography: United States & English Canada.
Last updated 2026-07-21._

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
- **Desktop-only.** Cloud modes (BYOK, Managed) need internet + an AI key — private, but *not*
  offline/air-gapped. The **Local (on-device) option changes this** (see §4): it is genuinely
  offline, which opens the on-prem/no-cloud buyers this line previously told us to avoid. Local
  is dev-only today — until it ships, treat the no-cloud segment as out of reach.
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

Intended model — **this section, not `Pricing.tsx`, is now the source of truth**; the component and
`docs/PRICING.md` still carry superseded numbers (see §6). USD already fits North America; add CAD
display for Canada.

| Tier | Price | Fit |
|------|-------|-----|
| Free · BYOK | $0, up to 1,000 pages, single device | Trial / individuals |
| Pro · BYOK | $18/mo ($144/yr) + their provider bill | Freelancers, solo consultants, individual bookkeepers, prosumers |
| Pro · Local | $18/mo ($144/yr), **no API cost at all** | Privacy maximalists, offline/air-gapped buyers, Tier 3 (legal, medical) |
| ~~Lifetime · BYOK~~ | **Not in consideration — parked for future** | — |
| Managed | $87/mo, 1,500 pages then metered | SMBs, CPA/bookkeeping firms, property managers, trades — won't touch an API key |

**Takeaway:** vertical fit is *per tier*. Individuals convert on **BYOK or Local ($18)**; businesses
convert on **Managed ($87)** — the higher-ARPU lane. Local and BYOK are priced identically on
purpose: we're selling the app, not the inference. The user picks where the compute happens.

**Lifetime is parked.** It was the launch-momentum lever for the privacy-first solo segment, but
it's off the table for launch — revisit only once BYOK Pro conversion data exists and the
support/update cost of a perpetual license is known.

### BYOK cost to the user — estimates per 1,000 pages

On BYOK the user pays their own provider bill, so "what will this actually cost me?" is a
front-of-funnel objection, not a footnote. Ballpark it in the copy rather than letting prospects
guess high.

Per page indexed, a scanned page costs roughly **~2,500 input tokens** (the page image) plus
**~800 output tokens** (the extracted text). Per 1,000 pages that's ~2.7M in / ~0.8M out:

| Tier | Model (list price, $/MTok in → out) | Est. cost / 1,000 pages |
|------|-----------------------------------|------------------------|
| **Local (on-device)** | No provider — runs on the user's machine | **$0** (paid in electricity and time — see below) |
| **Value** | Qwen3-VL 32B Instruct ($0.10 → $0.42) | **~$0.60** |
| Value | Qwen3-VL 235B A22B ($0.20 → $0.88) | ~$1.25 |
| Value | Gemini 3.1 Flash-Lite ($0.25 → $1.50) | **~$1.90** |
| Value | Kimi K2.5 ($0.375 → $2.03, via OpenRouter) | ~$2.60 |
| Budget | Gemini 3.5 Flash-Lite ($0.30 → $2.50) | **~$2.80** |
| Budget | Claude Haiku 4.5 ($1 → $5) | ~$7 |
| Mid | Gemini 3.6 Flash ($1.50 → $7.50) | ~$10 |
| Mid | Claude Sonnet 5 ($3 → $15) | ~$20 |
| Frontier | Claude Opus 4.8 ($5 → $25) | ~$34 |

Prices verified against provider pricing pages, July 2026 — re-check before publishing, this table
goes stale fast.

**A note on model churn, because it bit this table once already.** An earlier draft priced the
Gemini row on **2.5 Flash**, which is deprecated (shut down 16 Oct 2026) — replaced above with the
current GA Flash-Lite line. Google shipped four Flash-tier models in roughly a year, so **pin the
copy to a tier, not a version**: say "a fast, low-cost vision model" in customer-facing material
and keep the specific model IDs in config and in this table. Anything we print with a version
number in it will be wrong within two quarters.

**The value tier changes the pitch.** At **~$0.60 per 1,000 pages**, Qwen3-VL 32B makes the whole
cost objection evaporate — a 5,000-page shoebox indexes for about **$3 of the user's own API
credit**, one time. That is a fundamentally different sentence from "$35 on Haiku." Recommend we
default new BYOK users to a value-tier model and let power users upgrade, rather than defaulting
to a frontier model and defending the bill.

**Two caveats that decide whether these numbers survive contact with reality:**

- **Image tokenization differs by provider, and the input side is most of the variance.** Our
  ~2,500-input-tokens-per-page figure is calibrated to Anthropic's image tokenizer. Gemini tiles
  images (~258 tokens per 768px tile) and Qwen-VL uses merged 28px patches — both plausibly land
  *below* 2,500 for the same page, which would make the value tier cheaper still. Every number
  above is directionally right and precisely wrong. **Benchmark 100 real pages against each
  candidate model and replace this table with measured figures before any of it is published.**
- **Cheap is only cheap if it reads the page.** Our wedge is messy scans and phone photos.
  Cost-per-1,000-pages is the wrong axis to optimize alone — the right metric is
  *cost per correctly-extracted page*. A model at $0.60 that fails 15% of crumpled receipts is
  worse than one at $7 that doesn't. The same 100-page benchmark must score accuracy, not just
  price.

**Kimi note:** the K2 line is primarily a text/agentic family; K2.5 is natively multimodal and
does accept images, but it is not a purpose-built document-OCR model the way the Qwen-VL line is.
Verify it on our own hard-case set before listing it as a supported option.

**Qwen is also the bridge to Local.** Qwen3-VL ships as open weights, so the same model family can
run in the cloud on someone else's GPU (BYOK) or on the user's own machine (Local). That means one
extraction pipeline, one prompt, one output schema across both modes — and a clean upgrade story
("run it locally; if your laptop is too slow, point it at the hosted version of the same model").
Worth confirming with engineering, because it simplifies the product surface considerably.

Notes that materially move these figures:

- **Indexing is a one-time spike, not a subscription.** A 5,000-page shoebox costs **~$3 on the
  value tier** (~$35 on Haiku) *once*; after that it's ~0 until new documents arrive.
- **Batch/async processing is ~50% off** on most providers, and Kimi/Qwen advertise 60–85% prompt-
  cache discounts on repeated context. Since we index in the background, the real bill lands
  **below** every figure in the table.
- **Queries are the cheap axis** — well under a cent per search on the value and budget tiers,
  less with prompt caching. The page count is what drives the bill.
- Photographed receipts are far cheaper than full letter-size scans (fewer image tokens, less
  text out); dense multi-column pages are more expensive. Treat these as midpoints.

**Marketing implication:** lead with the value-tier number. *"Index 1,000 pages for well under a
dollar of your own API credit — and you own the key"* is a far stronger privacy-and-cost story
than our subscription price alone, and it's the honest answer to the objection that BYOK just
moves the bill somewhere else. Show the range (value → frontier) so nobody feels bait-and-switched
when they pick a better model. It also frames Managed ($87/mo) correctly: a convenience premium
for people who won't touch a key, not a markup on the AI itself.

### Local (on-device) — the $0-inference option

Same $18/mo as Pro · BYOK. The difference is that the model runs on the user's own machine, so
there is **no API key, no provider bill, and no document ever leaves the device** — not even in
transit for processing. This is the only configuration that is genuinely offline/air-gapped, and
it's the strongest version of our privacy claim.

> ⚠️ **Status check:** this is currently a dev-only path (see `docs/PRICING.md`). Everything below
> is the *plan* for productizing it. None of the performance language ships until we've benchmarked
> on real hardware — see the open item in §6.

**Why price it the same as BYOK.** We're charging for the app — the OCR pipeline, the index, the
retrieval UX, the hotkey — not for inference. Discounting Local would imply the app is worth less
without the cloud; charging more for it would penalize the most privacy-motivated buyers, who are
exactly the Tier 3 segment we want. Identical pricing also keeps the sales conversation on *fit*
("where do you want the compute?") instead of on price.

**The disclaimers — these are non-negotiable in the copy.** Local performance is a function of the
user's hardware, and overpromising here produces refunds and bad reviews from precisely the
audience whose trust we need most:

- **Hardware floor, stated plainly.** Local mode needs a reasonably modern machine with enough
  free memory to hold a vision model — Apple Silicon with unified memory, or a Windows box with a
  discrete GPU. Machines at the low end of the spec (8GB, integrated graphics, older CPUs) will
  either run slowly or fall back to cloud. Publish a concrete minimum *and* a recommended spec,
  and gate the download behind a hardware check so nobody buys into a machine that can't run it.
- **Speed is hardware-bound, and slower than cloud.** Indexing a large backlog locally is a
  background job measured in hours, not the minutes a batched cloud run takes. Frame it honestly:
  "start it before you go home." Never quote a pages-per-minute figure we haven't measured on that
  class of machine.
- **Accuracy may be lower on the hard cases.** This is the uncomfortable one. Our wedge is *OCR
  that reads messy scans and photos* — and that is exactly where a small on-device model gives up
  the most ground to a frontier cloud model. Clean typed invoices should be fine; crumpled
  receipts, handwriting, and bad phone photos are where the gap shows. Say so, and make it trivial
  to re-index a specific document against a cloud model when local output looks wrong.
- **It costs battery, thermals, and disk.** Sustained indexing will spin fans and drain a laptop;
  the model itself is a multi-gigabyte download. Recommend running the initial backlog on power.
- **Support surface is wider.** "It's slow on my machine" becomes a support ticket in a way that
  a cloud API call never does. Budget for a hardware-troubleshooting doc before launch.

**Where it wins the deal.** Local removes the single biggest objection in **Tier 3 — solo/small
law firms, small medical and dental practices, journalists and investigators** — where "nothing
stored, local index" was previously undercut by "…but the page contents are sent to an AI model
for processing." With Local, that caveat disappears. It also unlocks the on-prem/no-cloud buyers
that §1 explicitly told us not to chase. Expect these to be slower, higher-value, more
security-reviewed deals — and expect the hardware conversation to be part of every one of them.

**Copy angle:** *"Your documents never leave your Mac. No API key, no cloud, no bill — just your
machine doing the work."* Then the honest second line about hardware, immediately, in the same
block. The disclaimer is part of the pitch to this audience, not fine print buried beneath it.

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
- **Pricing docs are out of sync:** `docs/PRICING.md` and `India/components/Pricing.tsx` still
  carry the old numbers (2,000-page free tier, $6 / $29 / $149 Lifetime), no Local tier, and an
  indexing-cost assumption of ~$10 per 1,000 pages — which is **~16× the value-tier reality**
  (~$0.60) and drives the whole Managed margin model. Re-derive Managed's $87 and its $12/1,000
  overage against real per-model costs; the current numbers may leave money on the table or
  misprice the guardrail. Reconcile with §4 before anything ships.
- **Benchmark before publishing any cost or accuracy claim:** run the same 100 hard pages
  (crumpled receipts, phone photos, multi-column statements, handwriting) through Qwen3-VL 32B,
  Gemini 3.1 Flash-Lite, Kimi K2.5, and Claude Haiku 4.5. Record measured tokens-per-page, cost,
  and extraction accuracy. That table replaces the estimates in §4 — and picks our default model.
- **Local (on-device) is dev-only today.** Productizing it is a prerequisite for the Local tier,
  the Tier-3 push, and the offline claim in §1. Needs: a shipped on-device model, a hardware
  capability check, published min/recommended specs, measured throughput per machine class, and a
  hardware-troubleshooting support doc. Nothing in §4's Local copy ships before that.
- **Vertical-specific copy:** rework hero/features/examples once the beachhead is locked; consider
  two vertical variants to A/B.
- **Compliance language:** for Tier 3 (legal/medical), keep privacy claims factual (nothing stored,
  local index) and avoid asserting HIPAA/regulatory compliance until certified.
