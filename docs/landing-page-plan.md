# chaserAI — Landing Page Content Plan (North America)

_Working draft. Companion to [`marketing-plan.md`](./marketing-plan.md) — that document decides
**who** we sell to and **at what price**; this one decides **what the page says**.
Target: `NorthAmerica/`. Last updated 2026-07-21._

**Beachhead:** North American bookkeepers, CPAs & EAs (marketing plan §5, locked 2026-07-21).
**Purpose of this build:** a paid-traffic **demand test** — see §2. The page is an experiment
instrument first and a marketing page second.

---

## 1. The reader

A bookkeeper or small-practice CPA/EA with 30–200 clients, drowning in scanned and photographed
*source documents* — the receipts and vendor invoices behind numbers already sitting in QuickBooks.
They lose ten minutes hunting for a single receipt when a client or an auditor asks. They are not
shopping for "desktop search"; they're shopping for the end of that ten minutes.

**The one sentence the page has to land:**

> chaserAI finds the source document QuickBooks doesn't organize — by describing it, in seconds,
> without your client's financials leaving your control.

**Positioning guardrail:** complementary to QuickBooks/Xero, never competitive. We don't do
bookkeeping. We find the paper behind it. Any copy that sounds like a GL replacement is wrong.

**The three objections that kill the deal**, in the order they occur to this reader:

1. *"OCR never works on my scans."* → proof strip
2. *"Is my client's financial data safe?"* → privacy block
3. *"What's this actually going to cost me?"* → pricing

## 2. Demand test — what this page is actually measuring

We are buying Google traffic to answer one question: **would these people pay, and at what price?**
A waitlist-only page can't answer that — "give me your email" is nearly free, so it measures
curiosity, not intent. So the page carries **real, priced CTAs** (*Get Pro — $18/mo*,
*Get Managed — $87/mo*), and purchase intent is captured at the click.

**The flow:**

```
Google ad → landing page → click "Get Pro — $18/mo"   ← THE SIGNAL
                                    ↓
                  honest pre-launch reveal (modal)
                                    ↓
                    waitlist signup (email + tier)     ← QUALIFIED SIGNAL
```

**Non-negotiables.** This is a fake-door test, which is a legitimate and common validation
technique — but only if it's run honestly. Three rules, no exceptions:

1. **Never collect payment details.** No card fields, no Stripe checkout, no "we'll charge you
   later." The reveal happens *before* anything that looks like a purchase flow. This is the line
   between a demand test and taking money for a product that doesn't exist.
2. **A visible pre-launch badge stays above the fold.** Not buried, not a footnote. See the
   trade-off note below — it costs less signal than you'd think and it's what makes the rest of
   this defensible.
3. **Never A/B a "no badge" variant.** The moment the page is designed to conceal availability, it
   stops being a test and starts being a lie. Don't ship that variant even to measure the delta.

> ⚠️ **Google Ads policy — read before spending money.** Checked against Google's
> [Misrepresentation](https://support.google.com/adspolicy/answer/6020955) and
> [Unavailable offers](https://support.google.com/adspolicy/answer/15937063) policies, July 2026.
>
> **The policy judges the landing page, not just the ad.** Softening ad copy alone is not
> sufficient — the destination is explicitly in scope:
>
> > *"Promising products, services or promotional offers in the ad that are unavailable **or aren't
> > easily found from the destination** is not allowed."*
>
> And the enumerated violations include *"including calls-to-action **not readily accessible on the
> landing page**"* — which is precisely a `Buy now` button that can't complete a purchase.
>
> **What the ad copy change does buy us.** The primary clause is about what the *ad* promises being
> unavailable at the destination. An ad promising **"early access" / "join the waitlist"**, landing
> on a page that delivers exactly that, fulfils its promise. That removes the most common trigger —
> it just leaves residual risk on the page's own CTA labels, which §4.7 handles.
>
> **Consequence is milder than it sounds:** *"Violations of this policy won't lead to immediate
> account suspension without prior warning. A warning will be issued at least seven days prior to
> any suspension."* The realistic downside is **ad disapproval** — fixable by editing and
> resubmitting — not account loss. The quieter cost is Ad Rank: landing-page experience feeds
> quality scoring, so a page Google reads as misleading raises CPCs even when it isn't disapproved.
>
> **Mitigations, all cheap:**
> - Ad copy around **"early access" / "join the waitlist"** — never "buy" or "download."
> - Page CTAs are **`Get Pro — $18/mo`**, not `Buy now`, with a `Pre-launch — join the waitlist`
>   line at the button (§4.7). The price carries the signal; the verb doesn't need to.
> - Pre-launch badge visible above the fold (rule 2 above does double duty here).
> - No price extensions, promotion extensions, or Merchant Center listings.
> - Expect manual review. Have the reveal modal live before the first ad goes out — reviewers land
>   on the page and click.

**The trade-off, stated plainly:** a visible "in development" badge will lower raw CTA click-rate
versus a page that hides it. That's fine — arguably better. Someone who clicks *Get Managed — $87/mo*
while knowing the product isn't shippable yet is a **much stronger signal** than someone who
clicked because they thought they could buy it today. We're optimizing for signal quality, not
click volume.

**What we give back.** People clicking a buy button deserve something for the detour. The reveal
offers a **founding-user discount, locked to the tier they clicked.** It softens the bait, and it
makes the tier choice a real commitment rather than an idle click — which sharpens the data.

## 3. Page structure

Components exist in `NorthAmerica/components/` — reuse the order in `app/page.tsx`, rewrite the
copy. Four sections need building.

| # | Section | Component | Job on the page |
|---|---------|-----------|-----------------|
| 1 | Nav | `Nav.tsx` | Pre-launch badge + persistent CTA |
| 2 | Hero | `Hero.tsx` + `HeroSearch.tsx` | Name the pain; show the search; first CTA |
| 3 | **Proof strip** | ⚠️ **new** | Kill "will this read *my* scans?" immediately |
| 4 | Features | `Features.tsx` | Three benefits, not six features |
| 5 | How it works | `HowItWorks.tsx` | Defuse setup fear — three steps |
| 6 | **Examples** | ⚠️ **new** | Highest-converting section for this segment |
| 7 | **Pricing** | ⚠️ **new** | **The measurement instrument.** Real prices, real CTAs |
| 8 | **Reveal modal** | ⚠️ **new** | Honest pre-launch message → waitlist capture |
| 9 | FAQ | `FAQ.tsx` | Handle the rest |
| 10 | Footer | `Footer.tsx` | Unchanged |

`DownloadCTA.tsx` gets repurposed as the mid-page CTA band (§4.8).

## 4. Draft copy

Everything below is a starting draft — cut, don't pad.

### 4.1 Nav

Left: wordmark. Right: pre-launch badge + `Get early access`.

Badge: **`In development · Launching 2026`**

### 4.2 Hero — opening lines

Eyebrow: `For bookkeepers, CPAs & EAs`

**Headline candidates** (test one per ad group; each takes a different angle):

| # | Headline | Angle |
|---|----------|-------|
| A | **Find any client receipt in ten seconds. Not ten minutes.** | Time — most concrete |
| B | **The shoebox, searchable.** | Recognition — shortest, most memorable |
| C | **QuickBooks has the numbers. chaserAI finds the paperwork behind them.** | Positioning — clearest for cold traffic |
| D | **Your client's receipts are in there somewhere. Now you can just ask.** | Empathy |

Recommend opening with **A** as control and **C** as the challenger — C does the most work with
traffic that has never heard of us.

**Subheads** (pair with any headline):

> Desktop app that OCRs every scanned invoice, vendor bill, and phone-shot receipt you've got —
> then finds them by description. Hit ⌘ + Space and ask.

> Stop opening folders. chaserAI reads your scans, your PDFs, and the crumpled receipt someone
> photographed on a dashboard — and finds it when you describe it.

**Supporting line (the objection pre-empt):**

> Your client's financial data stays on your machine. Bring your own API key — documents go
> straight to your AI provider, never through us.

**Hero CTA:** `Get early access` · secondary `See pricing`
Status line under the buttons: *In development · Join the waitlist for launch + founding pricing*
Trust line: *macOS 13+ and Windows · Free for your first 1,000 pages*

**`HeroSearch.tsx` demo queries** — must be this reader's language, not generic:

- `Home Depot receipt from the Mueller job in March`
- `Ramirez LLC vendor bills, Q3`
- `the FedEx invoice with the wrong billing address`

### 4.3 Proof strip

Eyebrow: `Reads the ones that never scan properly`

Before/after: crumpled, skewed, phone-shot receipt → clean extracted fields (vendor, date, total,
tax, line items). Caption:

> Faxed statements. Skewed scans. A receipt photographed on someone's dashboard. chaserAI reads
> the pixels, not the text layer — so the documents that break every other search tool are the
> ones it's built for.

Once the benchmark lands (marketing plan §6), put the accuracy number here.
**No customer logos until we have customers.**

### 4.4 Features — three cards

1. **Reads the messy ones**
   Scanned PDFs, faxed statements, crumpled receipts shot on a phone. It reads what's printed on
   the page, not just an embedded text layer that half your documents don't have.
2. **Ask like you'd ask a colleague**
   No filenames. No folder discipline. No naming convention your predecessor invented and
   abandoned in 2019. Describe the document and it surfaces.
3. **Client data stays yours**
   The index lives on your device. With your own API key, documents go straight from your machine
   to your AI provider — never through our servers, never stored.

### 4.5 How it works

Eyebrow: `Set up in an afternoon, not a quarter`
Heading: **Three steps. Then forget it's there.**

**1 · Point it at your folders**
Client folders, a scanner dump, that `Downloads` directory you've been avoiding since March.
Local drives, external disks, or a synced Dropbox/Drive folder. No re-filing, no re-naming — leave
everything exactly where it is.

**2 · It reads everything, once**
chaserAI OCRs each page and builds a searchable index on your machine. A big backlog runs in the
background — start it before you head home and it's ready in the morning. New documents dropped
into a watched folder are picked up automatically.

**3 · Hit ⌘ + Space and describe it**
From any app, any time. *"The Amazon Business invoice over $2k from last quarter."* Results in
under a second, with the page that matched. Open it, or reveal it in Finder.

Closing line: *No migration. No new filing system to learn. It reads the mess you already have.*

### 4.6 Examples

Heading: **Things you can actually ask it**

- *"the Amazon Business invoice over $2k from last quarter"*
- *"Ramirez LLC's Q3 vendor bills"*
- *"every receipt I don't have a matching bank line for"*
- *"the 1099-NEC I sent to the landscaper"*
- *"utility bills for the Elm Street property, 2025"*
- *"that FedEx invoice with the wrong billing address"*
- *"the Home Depot receipts from the Mueller job"*
- *"anything from Ramirez with a late fee on it"*

### 4.7 Pricing — the measurement instrument

Prices from marketing plan §4. **Every button is instrumented** (§5).

Eyebrow: `Pricing`
Heading: **Pay for the app. Not for the AI.**
Sub: *chaserAI runs on your own AI provider account, so you pay them directly — usually well under
a dollar per 1,000 pages. We charge for the app.*

| | **Free** | **Pro** ⭐ | **Managed** |
|---|---|---|---|
| Price | **$0** | **$18**/mo · $144/yr | **$87**/mo |
| For | Trying it out | Solo bookkeepers & small practices | Practices that won't touch an API key |
| Pages | 1,000 | Unlimited | 1,500/mo, then metered |
| AI | Your key | Your key | Included — no key needed |
| Devices | 1 | 5 | 5 |
| **CTA** | `Get started free` | `Get Pro — $18/mo` | `Get Managed — $87/mo` |

Under every button, in small text: **`Pre-launch — join the waitlist`**

> **Why not "Buy now."** Google's Misrepresentation policy lists *"calls-to-action not readily
> accessible on the landing page"* as a violation, and it evaluates the **destination**, not just
> the ad — so softening the ad copy alone does not cover a `Buy now` button that can't complete a
> purchase. This costs us nothing experimentally: **the signal is which price they click, not the
> verb.** `Get Pro — $18/mo` vs `Get Managed — $87/mo` measures willingness to pay just as well,
> and the at-the-button status line makes each CTA an accurate description of what it does.

Footnote under the table:

> **Pro and Free need an API key** from OpenAI, Anthropic, or Google — a two-minute setup, and you
> pay your provider directly at cost. Typical: **under $1 per 1,000 pages indexed**, one time.
> Indexing is a one-off cost per document; searching is effectively free.
> **Managed** includes the AI — no key, no provider account, one bill.

Do **not** name a specific model version anywhere in customer-facing copy (marketing plan §4,
model-churn note). "A fast, low-cost vision model" is the durable phrasing.

**Not shown:** Local/on-device (dev-only — claiming it would be false), Lifetime (parked).

### 4.8 Mid-page CTA band (`DownloadCTA.tsx`)

Heading: **Stop hunting for receipts.**
Sub: *Index your first 1,000 pages free. macOS 13+ and Windows 10/11.*
Primary: `Get early access` · Secondary: `See pricing`
Status line: *In development — join the waitlist and we'll email you at launch.*
Seasonal line — rotate with the calendar: *Get set up before 1099 season.*
(Jan → 1099/W-2 · Feb–Apr → April 15 · Jun/Sep → quarterlies)

### 4.9 Reveal modal — fires on every transactional CTA

The honesty moment. Keep it short, lead with the truth, make the ask small.

> ### chaserAI isn't ready to buy yet.
>
> We're building it right now — and we're showing real pricing because we'd rather find out what
> people actually want than guess.
>
> Leave your email and we'll tell you the moment it ships. **You'll get founding-user pricing on
> the plan you picked.**
>
> `[ email ]` → **`Notify me at launch`**
>
> No card, no charge, no spam. One email when we launch.

Tone notes: *"isn't ready to buy yet"* first — don't bury it under a pitch. Never *"Oops!"* or
*"Congratulations!"*; this reader is a professional and the moment is a small letdown, so be
straight about it. Pre-select the tier they clicked and let them change it — that's a data point.
Add an optional field: **"Roughly how many pages of client paperwork are you sitting on?"**

Post-submit confirmation:

> **You're on the list.** We'll email you at launch with your founding-user discount — nothing
> before that.

### 4.10 FAQ

Keep the existing seven; the answers are accurate and appropriately hedged. Reorder so the
availability question sits first, and add these:

**When can I actually buy it?**
> chaserAI is in active development. The pricing on this page is real and what we intend to launch
> with — we're publishing it now so people can tell us whether it's right. Join the waitlist and
> you'll get a launch email plus founding-user pricing.

**Does this replace QuickBooks or Xero?**
> No, and it isn't trying to. QuickBooks holds the numbers; chaserAI finds the source documents
> behind them — the receipts and vendor invoices your accounting software never stored.

**Do I need an API key? What does it cost?**
> On Free and Pro, yes — from OpenAI, Anthropic, or Google. Setup takes about two minutes and you
> pay your provider directly at cost, typically under $1 per 1,000 pages indexed. Indexing is a
> one-time cost per document. On Managed, we handle it and there's no key.

**Can I keep separate libraries per client?**
> *(Answer honestly against what actually ships. If it isn't built, say "not in the first
> release" rather than implying otherwise.)*

**What happens to my index if I cancel?**
> The index is on your machine and stays there. *(Confirm the intended behaviour with engineering
> before publishing — this is a trust question and a wrong answer is expensive.)*

**Is my client data confidential?**
> The search index never leaves your device. With your own key, document contents go straight from
> your machine to your AI provider — never through us, never stored by us. On Managed they're
> encrypted in transit and never retained.
> *(Factual claims only — no SOC 2, HIPAA, or IRS Pub. 4557 language until certified.)*

## 5. Instrumentation

The page is worthless as a test if the clicks aren't captured. Minimum event set:

| Event | Properties | Why |
|---|---|---|
| `page_view` | `utm_*`, ad group, variant | Denominator |
| `cta_click` | `tier`, `placement` (hero/pricing/band), `label` | **The intent signal** |
| `reveal_shown` | `tier` | Confirms modal fired |
| `waitlist_submit` | `tier`, `page_volume`, email | **Qualified intent** |
| `reveal_dismissed` | `tier` | Drop-off after the reveal |

**Read it like this:**

- **`cta_click` / `page_view`** — headline intent. Compare across headline variants and ad groups.
- **Clicks split by tier** — the price-sensitivity answer we're paying for. Clicks on *Get Pro — $18/mo*
  versus *Get Managed — $87/mo* say more about willingness to pay than any survey.
- **`waitlist_submit` / `reveal_shown`** — signal quality. A high ratio means the click was real
  intent; a low one means people were clicking to see what happens.
- **`page_volume` distribution** — validates the page-count pricing model in marketing plan §4 and
  tells us whether we're reaching shoebox owners or tire-kickers.

Segment everything by ad group — one vertical's traffic can carry a misleading average.

**Pre-flight:** fire every event once with the ad-preview URL and confirm it lands before spending.
A week of untracked traffic is a week of nothing.

### 5.1 Pre-launch disclosure — what we test, and what we don't

The badge is not optional (§2, rule 2), and **whether to disclose is not an experiment** — see the
note at the end of this section. But *how* we disclose is a real variable with a real effect on
both click-rate and signal quality, and it's worth measuring. Every variant below contains the
truth; they differ only in wording, placement, and emphasis.

**Test A — badge wording** (nav badge, one variant per traffic split):

| Variant | Copy | Hypothesis |
|---|---|---|
| A1 *(control)* | `In development · Launching 2026` | Neutral, factual, dates the promise |
| A2 | `Coming soon — join the waitlist` | Softest; familiar pattern, may read as marketing filler |
| A3 | `Early access — not yet available` | Bluntest; strongest self-filter, lowest click-rate |
| A4 | `In private beta · Public launch 2026` | Implies a working product; **only if a private beta genuinely exists** |

⚠️ **A4 is conditional.** If there is no real private beta, drop it — it implies more product
maturity than we have and lands back in misrepresentation territory.

**Test B — placement / emphasis:**

| Variant | Where the disclosure appears |
|---|---|
| B1 *(control)* | Nav badge + `Pre-launch — join the waitlist` under every CTA button |
| B2 | Nav badge only (no at-button line) |
| B3 | Nav badge + at-button line + one line in the hero subhead |

**B1 is the control and the recommended floor.** B2 exists to measure what the at-button line
costs us in clicks — but note it also weakens the Google Ads position (§2: *"calls-to-action not
readily accessible on the landing page"*), so treat a B2 win as information, not a licence to ship
it unmodified.

**Test C — the reveal modal's offer framing:**

| Variant | Lead line after the honest opener |
|---|---|
| C1 *(control)* | *"You'll get founding-user pricing on the plan you picked."* |
| C2 | *"First 100 signups get 50% off year one."* (scarcity — only if we'll honour it) |
| C3 | No offer — waitlist only | 

C3 is the useful baseline: it tells us how much of our `waitlist_submit` rate is genuine interest
versus discount-chasing. If C1 and C3 convert similarly, the discount isn't buying anything and we
can drop it.

**How to read these.** Judge on **`waitlist_submit` per 1,000 visitors**, not on `cta_click`. A
variant that lifts clicks but not qualified signups just moved the drop-off from the button to the
modal — that's noise dressed as a win. Secondary read: `waitlist_submit` / `reveal_shown`, which
tells us whether the wording set accurate expectations at the click.

Add `disclosure_variant` (A1–A4, B1–B3, C1–C3) as a property on **every** event in the table above.

**Not on the list, deliberately: a no-badge variant.** Reasoning in full at §2, in short: shipping
it means building a page designed to conceal availability and routing half our paid traffic into
it — and the result is unactionable, because we could not ethically ship the winner if it won. An
experiment whose outcome can't change the decision isn't an experiment. Tests A–C recover
essentially all of the learning without that problem.

## 6. Guardrails

- **Reversal, deliberate:** an earlier draft said *one CTA site-wide (waitlist), no pricing page
  until pricing ships.* That's now wrong. Price-point signal is the entire point of the test, so
  pricing is on the page with real numbers and transactional CTAs. The waitlist is what happens
  *after* the click, not instead of it.
- **Never collect payment details.** See §2. Not negotiable.
- **The pre-launch badge stays visible above the fold**, and no variant hides it.
- **Don't say "Spotlight replacement."** It reframes us as general desktop search — the positioning
  marketing plan §2 rejected — and invites a comparison we don't need.
- **No compliance claims.** "Nothing stored, index stays local" is factual and sufficient.
- **No Local/offline copy yet.** Dev-only. Tempting for this audience — still false until it ships.
- **No model version numbers in customer-facing copy.** They go stale in a quarter.
- **No fabricated social proof** — no logos, no "trusted by 500 firms," no invented testimonials.

## 7. What "working" looks like

Set the bar before the spend, not after — otherwise any number looks like a result.

| Metric | Reading |
|---|---|
| `cta_click` rate | The headline number. Set a go/no-go threshold **before** launching. |
| Tier split | Which price point pulls. Decides whether $18/$87 survive. |
| `waitlist_submit` / `reveal_shown` | Signal quality. Low = curiosity clicks, not buyers. |
| Cost per waitlist signup | Early read on CAC — the number that decides whether paid acquisition works at all. |
| `page_volume` distribution | Validates page-count pricing (marketing plan §4). |

**Decide the kill criteria in advance.** Write down the click-rate and cost-per-signup numbers that
would make us stop, and commit to them before the first dollar is spent.

## 8. Build checklist

**Page**
- [ ] `Nav.tsx` — pre-launch badge + CTA
- [ ] `Hero.tsx` — headline variants, beachhead `HeroSearch` queries, dual CTA
- [ ] Proof strip component (before/after OCR)
- [ ] `Features.tsx` — cut six cards to three
- [ ] `HowItWorks.tsx` — three-step copy
- [ ] `Examples.tsx` — port the pattern from `India/components/Examples.tsx`, re-skinned
- [ ] `Pricing.tsx` for `NorthAmerica/` — §4 numbers, instrumented CTAs
- [ ] Reveal modal + waitlist form (tier pre-select, page-volume field)
- [ ] `DownloadCTA.tsx` — repurpose as mid-page band
- [ ] `FAQ.tsx` — reorder, add five entries

**Test infrastructure**
- [ ] Analytics events wired and verified end-to-end
- [ ] Waitlist backend stores tier + page volume, not just email
- [ ] Headline variants behind a flag
- [ ] Disclosure variants (§5.1 tests A/B/C) behind a flag; `disclosure_variant` on every event
- [ ] Confirm A4 is dropped unless a private beta actually exists
- [ ] Confirm C2's discount will be honoured before shipping that variant
- [ ] Go/no-go thresholds written down and agreed

**Pre-flight**
- [ ] Reveal modal live *before* the first ad runs (reviewers click)
- [ ] Ad copy reviewed against Google's Misrepresentation policy — "early access," not "buy"
- [ ] Confirm no India-flavored copy survives anywhere in `NorthAmerica/`
- [ ] Confirm no claim on the page is currently false (Local, devices, client libraries)
