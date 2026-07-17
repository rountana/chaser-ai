# Marketing UI Mockups & Animation Renderings

## Problem

The chaserAI landing page needs visual assets that show off the product's
search experience for three different consumption contexts: the landing page
itself (live web embed), sales/investor presentations (Keynote/PPT/Slides),
and written documents (PDF/Word/Google Docs). No single file format serves
all three, and today's only asset (`HeroSearch.tsx` on the live site) is a
simple query-bar demo — it doesn't show the richer AI-mode results-screen
experience (scanning, AI verification, streaming results) that the product's
actual differentiation lives in.

These are marketing/presentation assets, not product code — they must live
separately from the real Next.js site (`India/`) so the two don't get
conflated.

## Reference material

- **Real app UI** — `~/langchain/chaser/ui/{index.html,styles.css,app.js}`:
  the shipped Tauri app. `app.js` (`enterScanPhase`, `tickScanFeed`,
  `enterGradingPhase`, `snapSkeletonToResult`, `finishSearchStream`) is the
  authoritative source for the scan → verify → complete animation timing and
  behavior we're recreating for marketing.
- **PRD** — `~/langchain/docs/specs/2026-07-17-search-results-prd.html`:
  specifies the Search screen (⌘K palette) and Results screen (progress,
  filters, cards, preview) for both AI Mode and Regular Mode. Its embedded
  `<style>` block defines the exact dark, coral-accent (`#ee7a4b`) design
  tokens and mock component markup (`.mock-shell`, `.mock-card`,
  `.mock-status-row`, etc.) these mockups reuse for visual consistency.
- **Design spec** — `~/langchain/docs/superpowers/specs/2026-07-17-regular-vs-ai-mode-design.md`:
  explains the AI Mode / Regular Mode boundary in product terms.
- **Existing site demo** — `India/components/HeroSearch.tsx`: the current
  live hero query-bar animation (India-flavored content, typed query → top
  result only — no results-screen chrome).
- **Marketing plan** — `docs/marketing-plan.md`: confirms North America is
  the target market and that India-flavored sample content (₹, GST,
  Bengaluru) must be re-skinned before NA launch.

## Decisions (settled via user Q&A)

1. **Format** — a single animated HTML/CSS/JS master per screen, with two
   automated export tracks generated from it: MP4/GIF (presentations) and
   PNG keyframes (documents). The master also serves as the live-embeddable
   version for the landing page.
2. **Scope** — the full Results-screen flow (scan → verifying → streamed
   results, three-pane sidebar/results/preview layout), not just the hero
   query bar. This is the richer AI-mode moment the existing site demo
   doesn't show.
3. **Mode priority** — AI Mode only, for both mockups. Regular Mode variants
   are explicitly out of scope for this pass (noted as a fast follow using
   the same scaffold).
4. **Sample content** — North America flavored (USD amounts, US/Canada
   vendor names), following the PRD's own example style
   (`Q3_2024_Budget_Review.pdf`, FedEx/Home Depot/Costco-style vendors).
   Abstract thumbnail placeholders, not photorealistic receipt images —
   matches how the PRD's own results-screen mock renders cards.
5. **Location** — a `marketing/` folder at the repo root
   (`chaser-landing-page/marketing/`), sibling to `India/` (the real
   Next.js app), never inside it.

## Deliverables

### `marketing/mockups/results-ai-mode.html` (primary)

Reproduces the PRD's Results-screen frame — title bar with traffic-light
dots + `AI: ON` pill, sidebar type filters, crumbs bar, result cards,
preview panel — and animates the real pipeline modeled in `chaser/ui/app.js`:

1. Query text types into the search bar (character-by-character, matching
   `HeroSearch.tsx`'s existing typing-cadence pattern).
2. **Scanning** — a sweep progress bar plus a live feed of filenames
   streaming past (`tickScanFeed` pattern: rolling 4-row list, newest
   pinned/highlighted, folder path shown).
3. **Verifying results…** — status row switches to a spinner + this label;
   skeleton cards appear (`enterGradingPhase` pattern: shimmer placeholder
   cards, count capped/faded past a threshold like the real app).
4. Skeleton cards snap to real result cards one at a time, each with a
   filename, relevance score bar, and snippet (`snapSkeletonToResult`
   pattern) — fading in individually rather than all at once.
5. **Complete** — crumbs settle to "top N results"; the first (highest-score)
   card auto-selects and the preview panel populates: hero thumbnail,
   relevance %, type/date, keywords.
6. Holds on the completed frame, then loops into the next scripted query.

Three scripted NA query/result scenarios cycle continuously (e.g. "the
FedEx invoice for the Q3 freight shipment," "the Home Depot receipt for the
office renovation," "all vendor invoices over $10,000 this year"), each with
5–6 fabricated result filenames/snippets/scores and one designated top match
for the preview panel — same authoring pattern as `HeroSearch.tsx`'s
`STEPS` array.

Respects `prefers-reduced-motion`: renders one static completed frame, no
animation loop — matching `HeroSearch.tsx`'s existing behavior.

### `marketing/mockups/search-ai-mode.html` (secondary)

The ⌘K palette screen from the PRD's Search illustration: typing animation,
`AI: ON` pill, "Understands natural phrasing · double-checks every match"
helper copy, a Recent list, and the keyboard-shortcut footer. Simpler than
the results mockup — reuses the same shared visual chrome and scripted
queries (can serve as the "before" beat that leads into
`results-ai-mode.html`'s "after").

### `marketing/mockups/shared/`

- `chaser-mock.css` — the PRD's `--mock-*` design tokens and component
  classes (`.frame`, `.frame-bar`, `.mock-shell`, `.mock-card`,
  `.mock-status-row`, `.mock-preview`, etc.), factored out so both mockup
  pages import one source of truth instead of duplicating styles.
- `scenarios.js` — the scripted NA query/result data consumed by both pages.

### `marketing/scripts/capture.mjs`

A Playwright-based capture script, run manually (`node capture.mjs`), that:

- Loads each mockup HTML page headless at a fixed viewport.
- Records a full loop cycle as video, saved as MP4 (H.264) and converted to
  a looping GIF via `ffmpeg` if available on the machine (documented as an
  optional dependency — script still succeeds with MP4-only if `ffmpeg` is
  missing).
- Takes 2x-scale PNG screenshots at each named animation beat (query-typed,
  scanning, verifying, complete) by hooking into the page's own animation
  state (mockups expose a small `window.__marketingCapture` hook that fires
  a custom event at each beat, so capture timing isn't guessed via sleeps).
- Writes output into `marketing/exports/<mockup-name>/{video,keyframes}/`.

### `marketing/README.md`

Explains: how to open a mockup directly in a browser to preview it, how to
run the capture script and its Playwright/ffmpeg prerequisites, the folder
layout, how to add a new scripted scenario, and which export to use for
which channel (landing page = live HTML embed or embed the MP4;
presentations = MP4/GIF; documents = PNG keyframes).

## Out of scope (this pass)

- Regular Mode mockups (noted as a fast follow, same scaffold).
- Porting either mockup into a React component inside `India/` for live
  site embedding — can be done later once a specific screen is chosen for
  the real site; today's live embed path is iframing or copying the
  standalone HTML.
- Photorealistic sample document images — cards use abstract thumbnail
  placeholders, matching the PRD's own mock style.
- Automated CI generation of exports — `capture.mjs` is a manual/local
  script for this pass.

## Verification

- Both mockup HTML files open directly in a browser (no build step) and
  animate correctly through a full loop.
- `prefers-reduced-motion` produces a static, non-animated frame on both
  pages.
- `capture.mjs` run against both pages produces non-empty MP4 output and a
  PNG for each of the four named beats, without manual timing adjustment.
- Visual spot-check against the PRD's Results/Search illustrations confirms
  matching tokens (coral accent, dark surface, type scale) and component
  shapes.
