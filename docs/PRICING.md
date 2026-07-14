# chaserAI — Pricing (working draft)

> Status: **not shipped on the landing page.** Documented here while we finalize
> the model. All numbers are placeholders sized for positive margin and easy to tune.

## The core constraint

Every real user runs on a **cloud AI provider** — there is no shipped on-device
model (local is a dev-only option). That means two variable costs:

| Cost axis | When | Scales with | Shape |
|---|---|---|---|
| **Indexing (Vision/OCR)** | Ingest-time | Pages in library | Big spike on day 1, then ~0 |
| **Querying (LLM)** | Runtime | Queries/month | Steady drip |

**Assumed cost: ~1¢ per page indexed** (≈ $10 per 1,000 pages). A user with a
10,000-page library therefore costs ~$100 just to onboard. Indexing is
front-loaded, so it must be handled at **ingest volume**, never as flat/lifetime.

## The rule that follows

- **BYOK (bring your own key)** → the user's key pays for *both* indexing and
  queries → our marginal cost is **$0**. Flat, annual, and **Lifetime are all
  safe here.**
- **Managed (we host the key)** → we pay real money on both axes →
  **must be metered. No "unlimited," no lifetime.**

Strategy: make **BYOK the hero** (cheapest for the user, zero-risk for us, most
on-brand for a privacy tool). Managed is the "I don't want to deal with keys"
convenience premium, priced to cover its own cost.

## Tiers

| Tier | Price | LLM cost handling | Our marginal cost |
|---|---|---|---|
| **Free** | $0 forever | BYOK; capped at 2,000 pages, single device | $0 |
| **Pro · BYOK** ⭐ | $6/mo · **$4/mo billed annually** ($48/yr) | Their key, unlimited pages, any model, 5 devices | $0 |
| **Lifetime · BYOK** | $149 one-time | Their key; pay once, own forever, unlimited devices | $0 |
| **Managed** | $29/mo | Includes 1,500 pages/mo, then **$12 per additional 1,000** | Capped by quota |

### Free
- Bring your own API key
- Natural-language document search
- Index up to 2,000 pages
- Single device
- Community support

### Pro · BYOK (Most popular)
- Everything in Free
- Unlimited pages indexed
- Any model — OpenAI, Anthropic, Gemini
- Up to 5 devices
- Priority support

### Lifetime · BYOK
- Everything in Pro
- All future updates included
- Unlimited devices
- Founder badge in-app
- Lifetime priority support

### Managed
- No API key needed
- 1,500 pages indexed / month
- Then $12 per additional 1,000 pages (metered overage — the guardrail)
- Fair-use AI search
- Encrypted in transit, never stored
- Priority email support

## Margin math (Managed)

- Included 1,500 pages/mo ≈ **$15** Vision cost vs **$29** price → positive before query cost.
- Overage priced at **$12/1,000 pages** vs **$10/1,000** cost → ~20% margin, so
  heavy indexers can't run us into a loss; the bill just tracks usage.

## Open risks / TODO before shipping

- **Trial leak:** a Managed free trial + a user dumping a huge library = guaranteed
  loss. If we add a trial, cap trial indexing (e.g. first 500 pages) or require a
  card and meter from page one. BYOK trials are safe (their key pays).
- **Query cost** isn't yet folded into the Managed number — get a per-query cost
  and confirm "fair-use" holds, or convert to a single credits pool (indexing +
  queries in one unit).
- **Managed checkout** is web/subscription, not App Store — the card currently
  shows the generic "Available on App Store & Play Store" note; needs its own CTA.
- Revisit the **$149 Lifetime** anchor once BYOK Pro conversion data exists.
