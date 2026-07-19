# chaserAI Marketing Mockups

Standalone, animated HTML/CSS/JS mockups of the chaserAI search experience,
built for the landing page, sales/investor presentations, and written
documents. Kept fully separate from the real product code in `../India/`
and `../NorthAmerica/` (the two geography-specific Next.js sites), though
the scripted scenarios below reuse `NorthAmerica/lib/sampleDocs.ts`'s real
document corpus and images for consistency with the live NA site.

Scope: **AI Mode only**, for this pass. Regular Mode mockups are a planned
fast-follow using the same scaffold.

## What's here

- `mockups/search-ai-mode.html` — the ⌘K command palette, AI Mode: a typed
  query animates in, cycling through three scripted example queries.
- `mockups/results-ai-mode.html` — the full results screen: query → scanning
  (filenames streaming past) → verifying results… (AI judging each
  candidate) → results streaming in with relevance scores → completed state
  with the top match open in the preview panel. This is the flagship asset.
- `mockups/shared/chaser-mock.css` — one shared stylesheet with the dark,
  coral-accent (`#ee7a4b`) design tokens and component classes, ported from
  the product PRD and the shipped app's own CSS, so these mockups stay
  visually consistent with both.
- `mockups/shared/scenarios.js` — the three scripted query/result scenarios
  both pages animate through, built from real entries in
  `NorthAmerica/lib/sampleDocs.ts` (same filenames, vendor names, amounts).
- `mockups/shared/samples/` — the real document thumbnails these scenarios
  reference, copied from `NorthAmerica/public/samples/`.
- `scripts/assert-selectors.mjs`, `scripts/wait-for-beats.mjs` — small
  Playwright-based checks used while developing/extending the mockups.
- `scripts/capture.mjs` — exports both mockups to video (WebM always;
  MP4 + GIF when `ffmpeg` is installed) and PNG keyframes.
- `exports/` — capture output (gitignored — regenerate locally, see below).

## Previewing a mockup

No build step. Open either file directly in a browser:

```bash
open marketing/mockups/results-ai-mode.html
```

Both pages loop continuously through the three scripted scenarios. Enabling
"reduce motion" in your OS accessibility settings freezes each page on a
single static frame (fully typed query / completed results) instead.

## Generating exports

One-time setup:

```bash
cd marketing
npm install
npx playwright install chromium
brew install ffmpeg   # optional — MP4/GIF export needs it; WebM works without it
```

Then run:

```bash
npm run capture
```

This writes, per mockup, into `marketing/exports/<mockup-name>/`:

- `keyframes/<beat>.png` — one PNG per named animation beat (2x-scale).
  `search-ai-mode` has one beat (`query-typed`); `results-ai-mode` has four
  (`query-typed`, `scanning`, `verifying`, `complete`).
- `video/<mockup-name>.webm` — always produced (Playwright's native format).
- `video/<mockup-name>.mp4` and `.gif` — produced only if `ffmpeg` was
  installed before running `npm run capture`.

## Which export to use where

| Channel | Use |
|---|---|
| Landing page | Embed the HTML mockup directly (iframe, or port the markup/script into a React component under `NorthAmerica/components/` later), or embed the exported MP4 as a looping background video. |
| Presentations (Keynote/PPT/Slides) | The exported `.mp4` (preferred) or `.gif` — both drop into a slide natively and autoplay/loop without a browser. |
| Documents (Word/PDF/Google Docs) | The exported PNG keyframes — pick the beat that best matches the point being made (e.g. `verifying.png` when explaining the AI double-check step). |

## Adding a new scripted scenario

Add an object to the `scenarios` array in `mockups/shared/scenarios.js`
following the existing shape (see `scenarios.test.mjs` for the exact
invariants it must satisfy — run `node mockups/shared/scenarios.test.mjs`
after editing). Both mockup pages pick it up automatically since they
import and loop over the whole array.

## Testing changes

```bash
cd marketing
node mockups/shared/scenarios.test.mjs
node scripts/assert-selectors.mjs mockups/search-ai-mode.html '[{"selector":".frame-mode.ai","text":"AI: ON"}]'
node scripts/wait-for-beats.mjs mockups/results-ai-mode.html '["query-typed","scanning","verifying","complete"]' 20000
```
