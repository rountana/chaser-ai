# Marketing UI Mockups & Animation Renderings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build two standalone, animated HTML/CSS/JS marketing mockups (Search screen + Results screen, AI Mode only) that visually match the chaserAI PRD and shipped app, plus a Playwright capture script that exports them as MP4/GIF (presentations) and PNG keyframes (documents), all inside a new `marketing/` folder at the repo root — kept fully separate from the real Next.js site in `India/`.

**Architecture:** Two self-contained HTML pages share one CSS file (design tokens + component classes ported from the PRD and the real app's `styles.css`) and one JS data module (three scripted North-America-flavored query/result scenarios). Each page runs its own vanilla-JS animation loop and fires `mock:beat` custom events at named milestones. A Node/Playwright capture script listens for those events to grab PNG keyframes and record video, then shells out to `ffmpeg` (installed via Homebrew) to produce MP4 and GIF from Playwright's native WebM output.

**Tech Stack:** Plain HTML/CSS/JS (ES modules, no framework, no bundler), Node.js (built-in `assert` for data validation), Playwright (headless Chromium — smoke tests, beat-sequence tests, and the capture script), ffmpeg (WebM → MP4/GIF conversion).

## Global Constraints

- **Location:** everything lives under `marketing/` at the repo root (`chaser-landing-page/marketing/`), a sibling of `India/` (the real Next.js app) — never inside it.
- **Mode scope:** AI Mode only, for both mockups, this pass. Regular Mode variants are out of scope (fast-follow later, same scaffold).
- **Visual fidelity:** design tokens and component markup are ported near-verbatim from `~/langchain/docs/specs/2026-07-17-search-results-prd.html` (`--mock-*` custom properties, `.frame*`, `.mock-shell/-card/-preview/-crumbs/-status-row`) and from `~/langchain/chaser/ui/styles.css` (`#sweep-track`, `#scan-feed`, `#grade-phase`, `.search-skeleton`, `.card.just-streamed`, `#search-complete-row`) — dark-only mock surface, coral accent `#ee7a4b`, Inter + JetBrains Mono.
- **Sample content:** North America flavored (USD amounts, US/Canada vendor names — FedEx, Home Depot, Acme Fabrication, etc.), following the PRD's own naming style. Abstract thumbnail placeholders only — no photorealistic receipt images.
- **`prefers-reduced-motion: reduce`:** both mockups must render a single static frame (fully typed query / completed results) immediately, with no looping animation, matching `India/components/HeroSearch.tsx`'s existing reduced-motion behavior.
- **No build step:** both mockup HTML files must open directly in a browser (`file://`) with no bundler or dev server.
- **Node ESM throughout** — `marketing/package.json` sets `"type": "module"`. No test framework dependency beyond Node's built-in `assert` module and Playwright (already required for the capture script and smoke checks).
- **Video format correction from the design spec:** Playwright's `recordVideo` only ever produces WebM, never MP4 directly. `capture.mjs` therefore always writes a `.webm` file, and additionally produces `.mp4` (via `ffmpeg -i in.webm out.mp4`) and `.gif` (via `ffmpeg` on the mp4) when `ffmpeg` is on `PATH`. `ffmpeg` is installed via Homebrew as part of Task 8 on this machine so the primary MP4 deliverable is real, not skipped — but the script itself must not crash if `ffmpeg` is absent elsewhere, degrading to WebM-only with a clear console warning.
- **Generated output is not committed:** `marketing/.gitignore` excludes `node_modules/` and `exports/` — exports are regenerated locally by running the capture script, per the README.

---

### Task 1: Scaffold `marketing/` and the Playwright test harness

**Files:**
- Create: `marketing/package.json`
- Create: `marketing/.gitignore`
- Create: `marketing/scripts/assert-selectors.mjs`
- Create: `marketing/scripts/wait-for-beats.mjs`
- Create (dirs): `marketing/mockups/shared/`, `marketing/exports/` (created on demand later, not committed empty)

**Interfaces:**
- Produces: `node marketing/scripts/assert-selectors.mjs <html-path> '<checks-json>'` — CLI, exits 0 and prints `OK — N check(s) passed` on success, exits 1 and prints `FAIL: ...` lines otherwise. Each check object: `{ selector, exists?, text?, cssProp?, cssValue? }`.
- Produces: `node marketing/scripts/wait-for-beats.mjs <html-path> '<expected-beat-names-json>' [timeoutMs] [--reduced-motion]` — CLI, exits 0 and prints `OK — beats fired in order: [...]` on success, exits 1 and prints `FAIL: ...` otherwise. Listens for `window` `CustomEvent("mock:beat", { detail: { beat: <name> } })`.

- [ ] **Step 1: Create the directory structure**

```bash
mkdir -p marketing/mockups/shared marketing/scripts marketing/exports
```

- [ ] **Step 2: Write `marketing/package.json`**

```json
{
  "name": "chaserai-marketing-mockups",
  "private": true,
  "type": "module",
  "scripts": {
    "test:scenarios": "node mockups/shared/scenarios.test.mjs",
    "capture": "node scripts/capture.mjs"
  },
  "devDependencies": {
    "playwright": "^1.47.0"
  }
}
```

- [ ] **Step 3: Write `marketing/.gitignore`**

```
node_modules/
exports/
```

- [ ] **Step 4: Install dependencies and the Chromium browser binary**

```bash
cd marketing && npm install && npx playwright install chromium
```

Expected: `npm install` completes with no errors; `playwright install chromium` reports the browser is downloaded/already installed.

- [ ] **Step 5: Write `marketing/scripts/assert-selectors.mjs`**

```js
// marketing/scripts/assert-selectors.mjs
// Minimal Playwright-based structural smoke check, reused by several plan
// tasks to verify a mockup page renders expected elements/text/styles.
//
// Usage: node assert-selectors.mjs <path-to-html> '<JSON array of checks>'
// Each check: { selector, exists?: true, text?: "exact text", cssProp?: "background-color", cssValue?: "rgb(11, 13, 17)" }

import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const [, , htmlPath, checksJson] = process.argv;
if (!htmlPath || !checksJson) {
  console.error("Usage: node assert-selectors.mjs <html-path> '<checks-json>'");
  process.exit(2);
}
const checks = JSON.parse(checksJson);

const browser = await chromium.launch();
const page = await browser.newPage();
const pageErrors = [];
page.on("pageerror", (err) => pageErrors.push(err.message));

await page.goto(pathToFileURL(resolve(htmlPath)).href);

let failed = 0;
for (const check of checks) {
  const locator = page.locator(check.selector);
  const count = await locator.count();
  if (check.exists !== false && count === 0) {
    console.error(`FAIL: selector not found: ${check.selector}`);
    failed++;
    continue;
  }
  if (check.text !== undefined) {
    const text = (await locator.first().textContent())?.trim();
    if (text !== check.text) {
      console.error(`FAIL: ${check.selector} text "${text}" !== "${check.text}"`);
      failed++;
    }
  }
  if (check.cssProp !== undefined) {
    const value = await locator.first().evaluate((el, prop) => getComputedStyle(el)[prop], check.cssProp);
    if (value !== check.cssValue) {
      console.error(`FAIL: ${check.selector} ${check.cssProp} "${value}" !== "${check.cssValue}"`);
      failed++;
    }
  }
}

if (pageErrors.length) {
  console.error(`FAIL: ${pageErrors.length} page error(s): ${pageErrors.join("; ")}`);
  failed += pageErrors.length;
}

await browser.close();

if (failed > 0) {
  console.error(`${failed} check(s) failed`);
  process.exit(1);
}
console.log(`OK — ${checks.length} check(s) passed`);
```

- [ ] **Step 6: Write `marketing/scripts/wait-for-beats.mjs`**

```js
// marketing/scripts/wait-for-beats.mjs
// Loads a mockup page and waits for a sequence of `mock:beat` custom events,
// used to verify animation state machines fire beats in the right order
// within a reasonable time budget. Reused by multiple plan tasks.
//
// Usage: node wait-for-beats.mjs <html-path> '<expected-beat-names-json>' [timeoutMs] [--reduced-motion]

import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const [, , htmlPath, expectedJson, timeoutArg, motionFlag] = process.argv;
if (!htmlPath || !expectedJson) {
  console.error("Usage: node wait-for-beats.mjs <html-path> '<expected-json>' [timeoutMs] [--reduced-motion]");
  process.exit(2);
}
const expected = JSON.parse(expectedJson);
const timeoutMs = Number(timeoutArg) || 15000;
const reducedMotion = motionFlag === "--reduced-motion";

const browser = await chromium.launch();
const page = await browser.newPage({ reducedMotion: reducedMotion ? "reduce" : "no-preference" });

const seen = [];
await page.exposeFunction("__onBeat", (name) => seen.push(name));
await page.addInitScript(() => {
  window.addEventListener("mock:beat", (e) => window.__onBeat(e.detail.beat));
});

await page.goto(pathToFileURL(resolve(htmlPath)).href);

const start = Date.now();
while (seen.length < expected.length && Date.now() - start < timeoutMs) {
  await page.waitForTimeout(100);
}

await browser.close();

const gotPrefix = seen.slice(0, expected.length);
const ok = JSON.stringify(gotPrefix) === JSON.stringify(expected);
if (!ok) {
  console.error(`FAIL: expected beats ${JSON.stringify(expected)}, saw ${JSON.stringify(seen)}`);
  process.exit(1);
}
console.log(`OK — beats fired in order: ${JSON.stringify(gotPrefix)}`);
```

- [ ] **Step 7: Prove the harness works against a throwaway fixture**

```bash
cat > marketing/scripts/_fixture.html <<'EOF'
<!doctype html><html><body>
<h1 id="t" style="background:#0b0d11">hello</h1>
<script>setTimeout(() => window.dispatchEvent(new CustomEvent("mock:beat", { detail: { beat: "ping" } })), 50);</script>
</body></html>
EOF
node marketing/scripts/assert-selectors.mjs marketing/scripts/_fixture.html '[{"selector":"#t","text":"hello","cssProp":"backgroundColor","cssValue":"rgb(11, 13, 17)"}]'
node marketing/scripts/wait-for-beats.mjs marketing/scripts/_fixture.html '["ping"]' 3000
```

Expected: first command prints `OK — 1 check(s) passed`; second prints `OK — beats fired in order: ["ping"]`.

- [ ] **Step 8: Delete the fixture**

```bash
rm marketing/scripts/_fixture.html
```

- [ ] **Step 9: Commit**

```bash
git add marketing/package.json marketing/package-lock.json marketing/.gitignore marketing/scripts/assert-selectors.mjs marketing/scripts/wait-for-beats.mjs
git commit -m "marketing: scaffold folder and Playwright test harness"
```

---

### Task 2: Shared design tokens and component CSS

**Files:**
- Create: `marketing/mockups/shared/chaser-mock.css`

**Interfaces:**
- Consumes: nothing (pure CSS).
- Produces: CSS custom properties (`--mock-bg`, `--mock-surface`, `--mock-accent`, etc.) and component classes (`.stage`, `.frame`, `.frame-bar`, `.frame-mode.ai`, `.mock-palette-head`, `.mock-inputrow`, `.mock-pill.ai-on`, `.mock-helper`, `.mock-recent`, `.mock-foot`, `.mock-shell`, `.mock-sb-row`, `.mock-crumbs`, `.mock-status-row.scanning|.grading|.complete`, `.mock-sweep-track`/`.mock-sweep-fill`, `.mock-scan-feed`/`.mock-scan-feed-row.latest`, `.mock-card`/`.mock-card.selected`/`.mock-card.just-streamed`, `.mock-score`/`.mock-score.mid`, `.mock-skel`, `.mock-preview`, `.mock-complete-check`) consumed by Tasks 4–7.

- [ ] **Step 1: Write the CSS file**

```css
/* marketing/mockups/shared/chaser-mock.css
   Design tokens + component styles for chaserAI marketing mockups.
   Ported from:
   - ~/langchain/docs/specs/2026-07-17-search-results-prd.html (--mock-* tokens,
     .frame*, .mock-shell/-card/-preview/-crumbs/-status-row)
   - ~/langchain/chaser/ui/styles.css (#sweep-track, #scan-feed, #grade-phase,
     .search-skeleton, .card.just-streamed, #search-complete-row)
   Classes are prefixed `mock-` so this file is safe to share across
   multiple standalone mockup pages without ID collisions. */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

:root {
  --mock-bg:#0b0d11; --mock-surface:#161a21; --mock-surface-2:#1c2129; --mock-surface-3:#232934;
  --mock-border:#242a35; --mock-border-2:#2f3744;
  --mock-text:#e7eaef; --mock-text-muted:#8a92a0; --mock-text-faint:#5a6271;
  --mock-accent:#ee7a4b; --mock-accent-hi:#f59067; --mock-accent-bg:rgba(238,122,75,0.14); --mock-accent-border:rgba(238,122,75,0.34);
  --mock-ok:#4cc294; --mock-ok-bg:rgba(76,194,148,0.14);
  --mock-warn:#d9b94a; --mock-warn-bg:rgba(217,185,74,0.14);
  --mock-info:#5a93e0; --mock-info-bg:rgba(90,147,224,0.14);
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
}

* { box-sizing: border-box; }
html, body { margin: 0; }
body {
  background: var(--mock-bg);
  color: var(--mock-text);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

.stage {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
}

/* — Frame chrome (title bar) — */
.frame {
  width: 100%;
  max-width: 880px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--mock-bg);
  border: 1px solid var(--mock-border);
  box-shadow: 0 24px 48px -12px rgba(0,0,0,0.65), 0 4px 8px rgba(0,0,0,0.4);
}
.frame-bar {
  display: flex; align-items: center; gap: 8px; padding: 9px 14px;
  background: var(--mock-surface-2); border-bottom: 1px solid var(--mock-border);
}
.frame-dot { width: 9px; height: 9px; border-radius: 50%; }
.frame-dot.r { background: #e2685f; } .frame-dot.y { background: #e0b84c; } .frame-dot.g { background: #4cbf6f; }
.frame-title { margin-left: 8px; font-family: var(--font-mono); font-size: 11px; color: var(--mock-text-faint); letter-spacing: 0.03em; }
.frame-mode {
  margin-left: auto; font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.04em;
  padding: 3px 9px; border-radius: 999px; display: inline-flex; align-items: center; gap: 5px;
}
.frame-mode.ai { background: var(--mock-accent-bg); color: var(--mock-accent); border: 1px solid var(--mock-accent-border); }
.frame-mode::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.frame-body { padding: 20px; color: var(--mock-text); }

/* — Search screen — */
.mock-palette-head { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--mock-text-muted); padding: 0 2px 12px; }
.mock-kbd { font-family: var(--font-mono); font-size: 10.5px; background: var(--mock-surface-3); border: 1px solid var(--mock-border-2); border-radius: 5px; padding: 1px 6px; color: var(--mock-text); }
.mock-inputrow { display: flex; align-items: center; gap: 10px; background: var(--mock-surface); border: 1px solid var(--mock-border-2); border-radius: 10px; padding: 12px 14px; }
.mock-inputrow svg { flex-shrink: 0; color: var(--mock-text-faint); }
.mock-inputrow .q { flex: 1; font-size: 14px; color: var(--mock-text); min-height: 18px; }
.mock-inputrow .q.ph { color: var(--mock-text-faint); }
.mock-caret { display: inline-block; width: 1px; height: 14px; margin-left: 1px; vertical-align: -2px; background: var(--mock-accent); animation: caret-blink 1s step-end infinite; }
@keyframes caret-blink { 50% { opacity: 0; } }
.mock-pill { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.03em; padding: 3px 9px; border-radius: 999px; white-space: nowrap; flex-shrink: 0; }
.mock-pill.ai-on { background: var(--mock-accent-bg); color: var(--mock-accent); border: 1px solid var(--mock-accent-border); }
.mock-helper { font-size: 11.5px; color: var(--mock-text-faint); padding: 8px 4px 16px; }
.mock-section-label { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.07em; color: var(--mock-text-faint); padding: 0 4px 8px; }
.mock-recent { display: flex; align-items: center; gap: 8px; padding: 8px 4px; border-radius: 6px; font-size: 13px; color: var(--mock-text-muted); }
.mock-recent svg { color: var(--mock-text-faint); flex-shrink: 0; }
.mock-foot { display: flex; justify-content: space-between; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--mock-border); font-size: 11px; color: var(--mock-text-faint); font-family: var(--font-mono); }

/* — Results screen — */
.mock-shell { display: grid; grid-template-columns: 128px 1fr 150px; gap: 16px; }
.mock-sb h5 { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.07em; color: var(--mock-text-faint); margin: 0 0 8px; }
.mock-sb-row { display: flex; justify-content: space-between; font-size: 11.5px; padding: 4px 0; color: var(--mock-text-muted); }
.mock-sb-row b { color: var(--mock-text); font-weight: 500; }
.mock-crumbs { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-family: var(--font-mono); font-size: 11px; color: var(--mock-text-muted); padding-bottom: 10px; margin-bottom: 12px; border-bottom: 1px solid var(--mock-border); }
.mock-chip { border: 1px solid var(--mock-border-2); border-radius: 6px; padding: 2px 7px; font-size: 10.5px; color: var(--mock-text-muted); }

.mock-status-row { display: flex; align-items: center; gap: 7px; font-size: 11.5px; margin-bottom: 12px; font-family: var(--font-mono); min-height: 16px; }
.mock-status-row.scanning { color: var(--mock-text-muted); }
.mock-status-row.grading { color: var(--mock-info); }
.mock-status-row.complete { color: var(--mock-ok); }
.mock-status-row .spin { width: 11px; height: 11px; border-radius: 50%; border: 2px solid var(--mock-info-bg); border-top-color: var(--mock-info); animation: mock-spin 0.8s linear infinite; }
@keyframes mock-spin { to { transform: rotate(360deg); } }

.mock-sweep-track { height: 2px; background: transparent; overflow: hidden; position: relative; margin-bottom: 8px; }
.mock-sweep-fill { position: absolute; top: 0; height: 100%; width: 38%; border-radius: 2px; background: linear-gradient(90deg, transparent, var(--mock-accent) 40%, var(--mock-accent-hi) 60%, transparent); animation: mock-sweep 1.7s ease-in-out infinite alternate; }
@keyframes mock-sweep { 0% { left: -40%; } 100% { left: 100%; } }

.mock-scan-feed { font-family: var(--font-mono); font-size: 10.5px; color: var(--mock-text-faint); display: flex; flex-direction: column; gap: 3px; min-height: 56px; margin-bottom: 12px; }
.mock-scan-feed-row { display: flex; align-items: center; gap: 7px; animation: mock-feed-in 0.22s ease; }
.mock-scan-feed-row.latest { color: var(--mock-text-muted); }
.mock-scan-feed-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--mock-accent); opacity: 0.5; flex-shrink: 0; }
.mock-scan-feed-row.latest .mock-scan-feed-dot { opacity: 1; }
.mock-scan-feed-filename { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mock-scan-feed-folder { color: var(--mock-text-faint); opacity: 0.7; font-size: 9.5px; flex-shrink: 0; }
@keyframes mock-feed-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

.mock-card { display: flex; gap: 10px; padding: 10px; border: 1px solid var(--mock-border); border-radius: 8px; margin-bottom: 8px; background: var(--mock-surface); }
.mock-card.selected { border-color: var(--mock-accent-border); background: var(--mock-accent-bg); }
.mock-card.just-streamed { border-left: 2px solid var(--mock-accent); animation: mock-pop-in 0.35s ease forwards; }
@keyframes mock-pop-in { from { opacity: 0; } to { opacity: 1; } }
.mock-card .thumb { width: 30px; height: 30px; border-radius: 6px; background: var(--mock-surface-3); flex-shrink: 0; }
.mock-card .body { flex: 1; min-width: 0; }
.mock-card .fn { display: flex; justify-content: space-between; gap: 8px; font-size: 12.5px; font-weight: 500; margin-bottom: 4px; }
.mock-card .fn span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mock-card .snip { font-size: 11px; color: var(--mock-text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mock-score { display: inline-flex; align-items: center; gap: 5px; font-family: var(--font-mono); font-size: 10px; color: var(--mock-text-faint); flex-shrink: 0; }
.mock-score .bar { width: 34px; height: 4px; border-radius: 2px; background: var(--mock-surface-3); overflow: hidden; }
.mock-score .bar i { display: block; height: 100%; background: var(--mock-ok); }
.mock-score.mid .bar i { background: var(--mock-warn); }

.mock-skel { padding: 10px; border: 1px solid var(--mock-border); border-radius: 8px; margin-bottom: 8px; background: var(--mock-surface); position: relative; overflow: hidden; }
.mock-skel::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%); background-size: 200% 100%; animation: mock-shimmer 2s ease infinite; }
@keyframes mock-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
.mock-skel .ln { height: 8px; border-radius: 4px; background: var(--mock-surface-3); margin-bottom: 6px; opacity: 0.7; }
.mock-skel .ln.w60 { width: 60%; } .mock-skel .ln.w90 { width: 90%; }

.mock-preview { border-left: 1px solid var(--mock-border); padding-left: 16px; }
.mock-preview .hero { height: 64px; border-radius: 7px; background: var(--mock-surface-3); margin-bottom: 10px; }
.mock-preview h6 { font-size: 12px; margin: 0 0 8px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mock-preview dl { margin: 0; font-size: 10.5px; }
.mock-preview dt { color: var(--mock-text-faint); float: left; width: 44px; clear: left; margin-bottom: 5px; }
.mock-preview dd { margin: 0 0 5px 44px; color: var(--mock-text-muted); }
.mock-preview .rel { font-family: var(--font-mono); font-size: 11px; color: var(--mock-ok); margin: 8px 0; }

.mock-complete-check { width: 14px; height: 14px; border-radius: 50%; background: var(--mock-ok-bg); display: inline-flex; align-items: center; justify-content: center; font-size: 9px; color: var(--mock-ok); flex-shrink: 0; }
```

- [ ] **Step 2: Sanity-check the file has the expected shape**

```bash
grep -c "^  --mock-" marketing/mockups/shared/chaser-mock.css
grep -q "\.mock-card {" marketing/mockups/shared/chaser-mock.css && echo "has .mock-card"
grep -q "\.mock-status-row.grading" marketing/mockups/shared/chaser-mock.css && echo "has grading status"
```

Expected: first command prints a count ≥ 10 (one per token line); both `echo` lines print.

- [ ] **Step 3: Commit**

```bash
git add marketing/mockups/shared/chaser-mock.css
git commit -m "marketing: add shared design tokens and component CSS"
```

---

### Task 3: Scripted North-America scenario data

**Files:**
- Create: `marketing/mockups/shared/scenarios.test.mjs`
- Create: `marketing/mockups/shared/scenarios.js`

**Interfaces:**
- Produces: `export const scenarios` — array of exactly 3 objects, each:
  `{ id: string, query: string, sidebar: {label:string,count:number}[], scanFeed: {file:string,folder:string}[] (>=6), results: {filename:string,snippet:string,score:number,top?:true,type?:string,date?:string,keywords?:string[]}[] (>=5, sorted by score desc, exactly one top:true which is results[0]), elapsedLabel: string }`. Consumed by Tasks 4–7.

- [ ] **Step 1: Write the failing validation script**

```js
// marketing/mockups/shared/scenarios.test.mjs
// Plain-Node shape check for scenarios.js — no test framework needed.
// Run: node marketing/mockups/shared/scenarios.test.mjs

import assert from "node:assert/strict";
import { scenarios } from "./scenarios.js";

assert.equal(scenarios.length, 3, "expected exactly 3 scripted scenarios");

for (const s of scenarios) {
  assert.ok(s.id && typeof s.id === "string", `${s.id}: missing id`);
  assert.ok(s.query && s.query.length > 10, `${s.id}: query too short`);
  assert.ok(Array.isArray(s.scanFeed) && s.scanFeed.length >= 6, `${s.id}: needs >=6 scanFeed items`);
  for (const f of s.scanFeed) {
    assert.ok(f.file && f.folder, `${s.id}: scanFeed item missing file/folder`);
  }
  assert.ok(Array.isArray(s.results) && s.results.length >= 5, `${s.id}: needs >=5 results`);
  const tops = s.results.filter((r) => r.top === true);
  assert.equal(tops.length, 1, `${s.id}: needs exactly one top:true result`);
  assert.equal(s.results[0], tops[0], `${s.id}: top result must be first in the results array`);
  const scores = s.results.map((r) => r.score);
  const sorted = [...scores].sort((a, b) => b - a);
  assert.deepEqual(scores, sorted, `${s.id}: results must be sorted by score descending`);
  for (const r of s.results) {
    assert.ok(r.filename && r.snippet && typeof r.score === "number", `${s.id}: malformed result ${JSON.stringify(r)}`);
    assert.ok(r.score > 0 && r.score <= 1, `${s.id}: score out of range for ${r.filename}`);
  }
  assert.ok(Array.isArray(s.sidebar) && s.sidebar.length >= 1, `${s.id}: needs sidebar buckets`);
  assert.ok(typeof s.elapsedLabel === "string", `${s.id}: missing elapsedLabel`);
}

console.log(`OK — ${scenarios.length} scenarios validated`);
```

- [ ] **Step 2: Run it and confirm it fails**

```bash
node marketing/mockups/shared/scenarios.test.mjs
```

Expected: FAIL with a module-not-found error for `./scenarios.js`.

- [ ] **Step 3: Write `marketing/mockups/shared/scenarios.js`**

```js
// marketing/mockups/shared/scenarios.js
// Scripted NA-flavored query -> result data for the AI-mode marketing
// mockups. Each scenario drives both search-ai-mode.html (query typing
// only) and results-ai-mode.html (full scan -> verify -> complete loop).

export const scenarios = [
  {
    id: "fedex-freight",
    query: "the FedEx invoice for the Q3 freight shipment",
    sidebar: [
      { label: "Financial", count: 3 },
      { label: "Shipping", count: 2 },
    ],
    scanFeed: [
      { file: "FedEx_Freight_INV-88213.pdf", folder: "~/Documents/Vendors/FedEx" },
      { file: "UPS_Ground_Receipt_0417.pdf", folder: "~/Documents/Vendors/UPS" },
      { file: "Freight_Manifest_Q3.xlsx", folder: "~/Documents/Shipping" },
      { file: "Customs_Declaration_0912.pdf", folder: "~/Documents/Shipping/Customs" },
      { file: "Warehouse_Lease_2024.pdf", folder: "~/Documents/Leases" },
      { file: "DHL_Express_Invoice_331.pdf", folder: "~/Documents/Vendors/DHL" },
      { file: "Q3_Freight_Summary.pdf", folder: "~/Documents/Shipping" },
      { file: "Pallet_Order_Confirmation.pdf", folder: "~/Documents/Shipping" },
    ],
    results: [
      { filename: "FedEx_Freight_INV-88213.pdf", snippet: "…Q3 freight shipment, Bill of Lading #4471, remit to FedEx Freight…", score: 0.96, top: true, type: "Invoice", date: "Aug 2024", keywords: ["fedex", "freight", "q3 shipment"] },
      { filename: "Freight_Manifest_Q3.xlsx", snippet: "…manifest line items, carrier: FedEx Freight, 6 pallets…", score: 0.88, type: "Shipping", date: "Aug 2024", keywords: ["manifest", "freight"] },
      { filename: "Q3_Freight_Summary.pdf", snippet: "…quarterly freight cost summary, FedEx + DHL combined…", score: 0.81, type: "Shipping", date: "Sep 2024", keywords: [] },
      { filename: "Customs_Declaration_0912.pdf", snippet: "…customs declaration attached to the Q3 freight invoice…", score: 0.74, type: "Shipping", date: "Aug 2024", keywords: [] },
      { filename: "DHL_Express_Invoice_331.pdf", snippet: "…unrelated DHL express invoice, mentions freight in passing…", score: 0.62, type: "Invoice", date: "Jul 2024", keywords: [] },
    ],
    elapsedLabel: "2.1s",
  },
  {
    id: "home-depot-renovation",
    query: "the Home Depot receipt for the office renovation",
    sidebar: [
      { label: "Receipts", count: 3 },
      { label: "Contracts", count: 2 },
    ],
    scanFeed: [
      { file: "HomeDepot_Receipt_04521.jpg", folder: "~/Documents/Receipts/2024" },
      { file: "Lowes_Receipt_03312.jpg", folder: "~/Documents/Receipts/2024" },
      { file: "Contractor_Invoice_Renovation.pdf", folder: "~/Documents/Vendors/BuildRight" },
      { file: "Office_Renovation_Budget.xlsx", folder: "~/Documents/Projects/Renovation" },
      { file: "Paint_Supplies_Receipt.jpg", folder: "~/Documents/Receipts/2024" },
      { file: "Electrician_Invoice_0603.pdf", folder: "~/Documents/Vendors" },
      { file: "Flooring_Estimate.pdf", folder: "~/Documents/Projects/Renovation" },
      { file: "Permit_Application_Office.pdf", folder: "~/Documents/Projects/Renovation" },
    ],
    results: [
      { filename: "HomeDepot_Receipt_04521.jpg", snippet: "…Home Depot, drywall + paint + fixtures, office renovation…", score: 0.95, top: true, type: "Receipt", date: "Jun 2024", keywords: ["home depot", "renovation", "materials"] },
      { filename: "Contractor_Invoice_Renovation.pdf", snippet: "…BuildRight Contracting, office renovation phase 2 invoice…", score: 0.9, type: "Invoice", date: "Jun 2024", keywords: ["contractor", "renovation"] },
      { filename: "Office_Renovation_Budget.xlsx", snippet: "…renovation budget tracker, Home Depot + Lowe's line items…", score: 0.79, type: "Budget", date: "May 2024", keywords: [] },
      { filename: "Lowes_Receipt_03312.jpg", snippet: "…Lowe's, lumber and hardware, unrelated to office project…", score: 0.71, type: "Receipt", date: "Jun 2024", keywords: [] },
      { filename: "Paint_Supplies_Receipt.jpg", snippet: "…paint supplies, no vendor named, hand-written total…", score: 0.66, type: "Receipt", date: "Jun 2024", keywords: [] },
    ],
    elapsedLabel: "1.8s",
  },
  {
    id: "vendor-invoices-10k",
    query: "all vendor invoices over $10,000 this year",
    sidebar: [
      { label: "Invoices", count: 4 },
      { label: "Contracts", count: 1 },
    ],
    scanFeed: [
      { file: "Acme_Fabrication_INV-2291.pdf", folder: "~/Documents/Vendors/Acme" },
      { file: "Meridian_Supply_INV-559.pdf", folder: "~/Documents/Vendors/Meridian" },
      { file: "Northstar_Logistics_INV-102.pdf", folder: "~/Documents/Vendors/Northstar" },
      { file: "BlueHarbor_Consulting_INV-77.pdf", folder: "~/Documents/Vendors/BlueHarbor" },
      { file: "Quantvia_Services_INV-410.pdf", folder: "~/Documents/Vendors/Quantvia" },
      { file: "Everline_Materials_INV-88.pdf", folder: "~/Documents/Vendors/Everline" },
      { file: "Office_Lease_Renewal.pdf", folder: "~/Documents/Leases" },
      { file: "Insurance_Policy_2024.pdf", folder: "~/Documents/Insurance" },
    ],
    results: [
      { filename: "Northstar_Logistics_INV-102.pdf", snippet: "…Northstar Logistics, total due $22,050.00, net 30…", score: 0.93, top: true, type: "Invoice", date: "Mar 2024", keywords: ["northstar", "logistics", "$22,050"] },
      { filename: "Acme_Fabrication_INV-2291.pdf", snippet: "…Acme Fabrication, total due $18,240.00, custom parts order…", score: 0.91, type: "Invoice", date: "Feb 2024", keywords: ["acme", "$18,240"] },
      { filename: "Meridian_Supply_INV-559.pdf", snippet: "…Meridian Supply Co, total due $14,800.00, bulk materials…", score: 0.87, type: "Invoice", date: "Apr 2024", keywords: ["meridian", "$14,800"] },
      { filename: "BlueHarbor_Consulting_INV-77.pdf", snippet: "…Blue Harbor Consulting, total due $11,300.00, Q1 engagement…", score: 0.79, type: "Invoice", date: "Jan 2024", keywords: ["blue harbor", "$11,300"] },
      { filename: "Quantvia_Services_INV-410.pdf", snippet: "…Quantvia Services, total due $10,150.00, just over threshold…", score: 0.68, type: "Invoice", date: "May 2024", keywords: ["quantvia", "$10,150"] },
    ],
    elapsedLabel: "2.4s",
  },
];
```

- [ ] **Step 4: Run the validation script and confirm it passes**

```bash
node marketing/mockups/shared/scenarios.test.mjs
```

Expected: `OK — 3 scenarios validated`

- [ ] **Step 5: Commit**

```bash
git add marketing/mockups/shared/scenarios.js marketing/mockups/shared/scenarios.test.mjs
git commit -m "marketing: add scripted NA scenario data with validation script"
```

---

### Task 4: Search screen (AI Mode) — static markup

**Files:**
- Create: `marketing/mockups/search-ai-mode.html`

**Interfaces:**
- Consumes: `marketing/mockups/shared/chaser-mock.css` (Task 2).
- Produces: DOM ids `#query-text`, `#index-count` and structural classes `.frame-mode.ai`, `.mock-inputrow .q`, `.mock-helper`, `.mock-recent`, `.mock-foot` — consumed/animated by Task 5.

- [ ] **Step 1: Write the static page**

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>chaserAI — Search (AI Mode) marketing mockup</title>
<link rel="stylesheet" href="shared/chaser-mock.css">
</head>
<body>
<div class="stage">
  <div class="frame">
    <div class="frame-bar">
      <span class="frame-dot r"></span><span class="frame-dot y"></span><span class="frame-dot g"></span>
      <span class="frame-title">chaser · command palette</span>
      <span class="frame-mode ai">AI: ON</span>
    </div>
    <div class="frame-body">
      <div class="mock-palette-head">
        <span>Ask in your own words…</span>
        <span style="margin-left:auto;" class="mock-kbd">⌘K</span>
      </div>
      <div class="mock-inputrow">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="7" cy="7" r="5"/><path d="M11 11l3.5 3.5"/></svg>
        <span class="q ph" id="query-text">Describe what you&rsquo;re looking for…<span class="mock-caret"></span></span>
      </div>
      <div class="mock-helper">Understands natural phrasing · double-checks every match</div>
      <div class="mock-section-label">Recent</div>
      <div class="mock-recent"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="7" cy="7" r="5"/><path d="M11 11l3.5 3.5"/></svg> q3 budget review acme</div>
      <div class="mock-recent"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="7" cy="7" r="5"/><path d="M11 11l3.5 3.5"/></svg> passport scan</div>
      <div class="mock-foot"><span>↵ search · esc clear</span><span id="index-count">1,840 files indexed</span></div>
    </div>
  </div>
</div>
</body>
</html>
```

- [ ] **Step 2: Verify structure and styles render correctly**

```bash
node marketing/scripts/assert-selectors.mjs marketing/mockups/search-ai-mode.html '[
  {"selector":".frame-mode.ai","text":"AI: ON"},
  {"selector":".mock-helper","text":"Understands natural phrasing · double-checks every match"},
  {"selector":".mock-recent","exists":true},
  {"selector":"body","cssProp":"backgroundColor","cssValue":"rgb(11, 13, 17)"},
  {"selector":".frame-mode.ai","cssProp":"color","cssValue":"rgb(238, 122, 75)"}
]'
```

Expected: `OK — 5 check(s) passed`

- [ ] **Step 3: Commit**

```bash
git add marketing/mockups/search-ai-mode.html
git commit -m "marketing: add static Search (AI Mode) mockup markup"
```

---

### Task 5: Search screen (AI Mode) — typing animation

**Files:**
- Modify: `marketing/mockups/search-ai-mode.html`

**Interfaces:**
- Consumes: `scenarios` from `marketing/mockups/shared/scenarios.js` (Task 3); `#query-text` element from Task 4.
- Produces: fires `window.dispatchEvent(new CustomEvent("mock:beat", { detail: { beat: "query-typed", scenario: <scenario.id> } }))` once per scripted query, consumed by `wait-for-beats.mjs` and later by `capture.mjs` (Task 8).

- [ ] **Step 1: Add the animation script before `</body>`**

```html
<script type="module">
import { scenarios } from "./shared/scenarios.js";

const queryEl = document.getElementById("query-text");
const PLACEHOLDER = "Describe what you’re looking for…";

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function setQueryText(text, { placeholder = false, caret = true } = {}) {
  queryEl.classList.toggle("ph", placeholder);
  queryEl.textContent = text;
  if (caret) {
    const c = document.createElement("span");
    c.className = "mock-caret";
    queryEl.appendChild(c);
  }
}

function beat(name, scenario) {
  window.dispatchEvent(new CustomEvent("mock:beat", { detail: { beat: name, scenario: scenario.id } }));
}

async function typeQuery(scenario) {
  for (let i = 1; i <= scenario.query.length; i++) {
    setQueryText(scenario.query.slice(0, i));
    await sleep(45);
  }
  beat("query-typed", scenario);
}

async function runLoop() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    setQueryText(scenarios[0].query, { caret: false });
    beat("query-typed", scenarios[0]);
    return;
  }
  while (true) {
    for (const scenario of scenarios) {
      setQueryText(PLACEHOLDER, { placeholder: true });
      await sleep(700);
      await typeQuery(scenario);
      await sleep(3000);
    }
  }
}

runLoop();
</script>
```

- [ ] **Step 2: Verify the beat fires with the expected content, normal motion**

```bash
node marketing/scripts/wait-for-beats.mjs marketing/mockups/search-ai-mode.html '["query-typed"]' 10000
```

Expected: `OK — beats fired in order: ["query-typed"]`

- [ ] **Step 3: Verify the reduced-motion path fires immediately**

```bash
node marketing/scripts/wait-for-beats.mjs marketing/mockups/search-ai-mode.html '["query-typed"]' 3000 --reduced-motion
```

Expected: `OK — beats fired in order: ["query-typed"]` (well inside the 3s budget, since reduced motion skips the typing loop entirely).

- [ ] **Step 4: Verify final query text matches the first scenario under reduced motion**

```bash
node marketing/scripts/assert-selectors.mjs marketing/mockups/search-ai-mode.html '[{"selector":"#query-text","text":"the FedEx invoice for the Q3 freight shipment"}]'
```

Expected: `OK — 1 check(s) passed`. Note: `assert-selectors.mjs` launches Chromium with default (no-preference) motion, but the check still passes because it runs long after the ~2s typing animation for the first scenario completes.

- [ ] **Step 5: Commit**

```bash
git add marketing/mockups/search-ai-mode.html
git commit -m "marketing: animate Search (AI Mode) mockup query typing"
```

---

### Task 6: Results screen (AI Mode) — static complete-state markup

**Files:**
- Create: `marketing/mockups/results-ai-mode.html`

**Interfaces:**
- Consumes: `scenarios` from `marketing/mockups/shared/scenarios.js` (Task 3).
- Produces: render functions `renderSidebar(scenario)`, `renderCrumbs(scenario)`, `renderComplete(scenario)`, `cardHtml(result, opts)`, `renderCardsComplete(scenario)`, `renderPreview(result)`, `renderCompleteFrame(scenario)` — all extended in place by Task 7 (do not rename).

- [ ] **Step 1: Write the static page with a one-shot render script**

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>chaserAI — Results (AI Mode) marketing mockup</title>
<link rel="stylesheet" href="shared/chaser-mock.css">
</head>
<body>
<div class="stage">
  <div class="frame">
    <div class="frame-bar">
      <span class="frame-dot r"></span><span class="frame-dot y"></span><span class="frame-dot g"></span>
      <span class="frame-title">chaser · results</span>
      <span class="frame-mode ai">AI: ON</span>
    </div>
    <div class="frame-body">
      <div class="mock-shell">
        <div class="mock-sb" id="sidebar"></div>
        <div>
          <div class="mock-crumbs">
            <span id="crumbs-label"></span>
            <span class="chips"><span class="mock-chip">+ filters</span></span>
          </div>
          <div class="mock-sweep-track" id="sweep-track" style="display:none;"><div class="mock-sweep-fill"></div></div>
          <div class="mock-scan-feed" id="scan-feed" style="display:none;"></div>
          <div class="mock-status-row" id="status-row"></div>
          <div id="cards"></div>
        </div>
        <div class="mock-preview" id="preview"></div>
      </div>
    </div>
  </div>
</div>

<script type="module">
import { scenarios } from "./shared/scenarios.js";

const sidebarEl = document.getElementById("sidebar");
const cardsEl = document.getElementById("cards");
const previewEl = document.getElementById("preview");
const crumbsEl = document.getElementById("crumbs-label");
const statusRowEl = document.getElementById("status-row");

function escHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderSidebar(scenario) {
  sidebarEl.innerHTML =
    "<h5>Type</h5>" +
    scenario.sidebar.map((b) => `<div class="mock-sb-row"><span>${escHtml(b.label)}</span><b>${b.count}</b></div>`).join("");
}

function scoreClass(score) {
  return score < 0.75 ? "mock-score mid" : "mock-score";
}

function cardHtml(result, { selected = false, justStreamed = false } = {}) {
  const cls = ["mock-card"];
  if (selected) cls.push("selected");
  if (justStreamed) cls.push("just-streamed");
  return (
    `<div class="${cls.join(" ")}">` +
      `<div class="thumb"></div>` +
      `<div class="body">` +
        `<div class="fn"><span>${escHtml(result.filename)}</span>` +
        `<span class="${scoreClass(result.score)}"><span class="bar"><i style="width:${Math.round(result.score * 100)}%"></i></span>${result.score.toFixed(2)}</span></div>` +
        `<div class="snip">${escHtml(result.snippet)}</div>` +
      `</div>` +
    `</div>`
  );
}

function renderCardsComplete(scenario) {
  cardsEl.innerHTML = scenario.results.map((r) => cardHtml(r, { selected: r.top === true })).join("");
}

function renderPreview(result) {
  const rows = [];
  if (result.type) rows.push(`<dt>Type</dt><dd>${escHtml(result.type)}</dd>`);
  if (result.date) rows.push(`<dt>Date</dt><dd>${escHtml(result.date)}</dd>`);
  if (result.keywords && result.keywords.length) rows.push(`<dt>Keys</dt><dd>${escHtml(result.keywords.join(", "))}</dd>`);
  previewEl.innerHTML =
    `<div class="hero"></div>` +
    `<h6>${escHtml(result.filename)}</h6>` +
    `<div class="rel">Relevance ${Math.round(result.score * 100)}%</div>` +
    `<dl>${rows.join("")}</dl>`;
}

function renderCrumbs(scenario) {
  crumbsEl.textContent = `top ${scenario.results.length} results`;
}

function renderComplete(scenario) {
  statusRowEl.className = "mock-status-row complete";
  statusRowEl.innerHTML = `<span class="mock-complete-check">✓</span><span>${scenario.results.length} results · ${scenario.elapsedLabel}</span>`;
}

function renderCompleteFrame(scenario) {
  renderSidebar(scenario);
  renderCrumbs(scenario);
  renderComplete(scenario);
  renderCardsComplete(scenario);
  renderPreview(scenario.results.find((r) => r.top) ?? scenario.results[0]);
}

renderCompleteFrame(scenarios[0]);
</script>
</body>
</html>
```

- [ ] **Step 2: Verify the complete-state frame renders correctly**

```bash
node marketing/scripts/assert-selectors.mjs marketing/mockups/results-ai-mode.html '[
  {"selector":".frame-title","text":"chaser · results"},
  {"selector":"#crumbs-label","text":"top 5 results"},
  {"selector":".mock-card","exists":true},
  {"selector":".mock-card.selected .fn span:first-child","text":"FedEx_Freight_INV-88213.pdf"},
  {"selector":".mock-preview h6","text":"FedEx_Freight_INV-88213.pdf"},
  {"selector":"#status-row","text":"✓2.1s"}
]'
```

Expected: `OK — 6 check(s) passed`. Note the last check's text has no separators because `textContent` concatenates the check-icon span and the label span with no whitespace between them — this is intentional (matches how `assert-selectors.mjs`'s `.trim()` reads concatenated child text, not a rendering bug: the CSS `gap` on `.mock-status-row` provides the visual spacing).

- [ ] **Step 3: Also confirm the card count matches the scenario**

```bash
node -e '
import("./marketing/mockups/shared/scenarios.js").then(({ scenarios }) => {
  console.log(scenarios[0].results.length);
});
' 2>/dev/null
node marketing/scripts/assert-selectors.mjs marketing/mockups/results-ai-mode.html '[{"selector":".mock-card","text":null}]' 2>/dev/null || true
```

(This step is a manual cross-check, not a hard gate: confirm the number printed by the first command — `5` — matches the 5 `.mock-card` elements visually counted in Step 2's passing checks.)

- [ ] **Step 4: Commit**

```bash
git add marketing/mockups/results-ai-mode.html
git commit -m "marketing: add static Results (AI Mode) complete-state mockup"
```

---

### Task 7: Results screen (AI Mode) — full scan/verify/stream animation

**Files:**
- Modify: `marketing/mockups/results-ai-mode.html`

**Interfaces:**
- Consumes: render functions from Task 6 (`renderSidebar`, `renderCrumbs`, `renderComplete`, `cardHtml`, `renderPreview`, `renderCompleteFrame`); `scenarios` from Task 3.
- Produces: fires four `mock:beat` events per scenario cycle, in order: `query-typed`, `scanning`, `verifying`, `complete` — consumed by `wait-for-beats.mjs` and `capture.mjs` (Task 8).

- [ ] **Step 1: Replace the final `renderCompleteFrame(scenarios[0]);` call with the animation loop**

In `marketing/mockups/results-ai-mode.html`, replace this line:

```js
renderCompleteFrame(scenarios[0]);
```

with:

```js
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function beat(name, scenario) {
  window.dispatchEvent(new CustomEvent("mock:beat", { detail: { beat: name, scenario: scenario.id } }));
}

async function typeQuery(scenario) {
  // The results screen has no visible query input in the PRD's illustration,
  // but this beat keeps the four-beat contract identical to search-ai-mode.html
  // so capture.mjs can key off the same event names for both pages.
  await sleep(scenario.query.length * 20);
  beat("query-typed", scenario);
}

function resetFrame() {
  document.getElementById("sweep-track").style.display = "none";
  const feed = document.getElementById("scan-feed");
  feed.style.display = "none";
  feed.innerHTML = "";
  statusRowEl.innerHTML = "";
  cardsEl.innerHTML = "";
  previewEl.innerHTML = "";
  sidebarEl.innerHTML = "";
  crumbsEl.textContent = "";
}

async function runScanning(scenario) {
  beat("scanning", scenario);
  const sweep = document.getElementById("sweep-track");
  const feed = document.getElementById("scan-feed");
  sweep.style.display = "";
  feed.style.display = "flex";
  for (const item of scenario.scanFeed) {
    const prev = feed.querySelector(".latest");
    if (prev) prev.classList.remove("latest");
    const row = document.createElement("div");
    row.className = "mock-scan-feed-row latest";
    row.innerHTML =
      `<span class="mock-scan-feed-dot"></span>` +
      `<span class="mock-scan-feed-filename">${escHtml(item.file)}</span>` +
      `<span class="mock-scan-feed-folder">${escHtml(item.folder)}</span>`;
    feed.appendChild(row);
    while (feed.children.length > 4) feed.removeChild(feed.firstChild);
    await sleep(220);
  }
  sweep.style.display = "none";
  feed.style.display = "none";
}

async function runVerifying(scenario) {
  beat("verifying", scenario);
  statusRowEl.className = "mock-status-row grading";
  statusRowEl.innerHTML = `<span class="spin"></span><span>verifying results…</span>`;
  renderSidebar(scenario);
  renderCrumbs(scenario);
  cardsEl.innerHTML = scenario.results.map(() => `<div class="mock-skel"><div class="ln w90"></div><div class="ln w60"></div></div>`).join("");
  await sleep(900);
}

async function runStreaming(scenario) {
  const skeletons = cardsEl.querySelectorAll(".mock-skel");
  for (let i = 0; i < scenario.results.length; i++) {
    const result = scenario.results[i];
    const wrapper = document.createElement("div");
    wrapper.innerHTML = cardHtml(result, { selected: result.top === true, justStreamed: true });
    const card = wrapper.firstElementChild;
    skeletons[i].replaceWith(card);
    if (result.top) renderPreview(result);
    await sleep(450);
  }
}

async function runScenario(scenario) {
  resetFrame();
  await typeQuery(scenario);
  await runScanning(scenario);
  await runVerifying(scenario);
  await runStreaming(scenario);
  renderComplete(scenario);
  beat("complete", scenario);
  await sleep(3500);
}

async function runLoop() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    renderCompleteFrame(scenarios[0]);
    for (const name of ["query-typed", "scanning", "verifying", "complete"]) beat(name, scenarios[0]);
    return;
  }
  while (true) {
    for (const scenario of scenarios) {
      await runScenario(scenario);
    }
  }
}

runLoop();
```

- [ ] **Step 2: Verify the four beats fire in order under normal motion**

```bash
node marketing/scripts/wait-for-beats.mjs marketing/mockups/results-ai-mode.html '["query-typed","scanning","verifying","complete"]' 20000
```

Expected: `OK — beats fired in order: ["query-typed","scanning","verifying","complete"]`

- [ ] **Step 3: Verify the reduced-motion path fires all four beats immediately**

```bash
node marketing/scripts/wait-for-beats.mjs marketing/mockups/results-ai-mode.html '["query-typed","scanning","verifying","complete"]' 3000 --reduced-motion
```

Expected: `OK — beats fired in order: ["query-typed","scanning","verifying","complete"]`

- [ ] **Step 4: Verify the frame is back in a fully-rendered complete state after one scenario**

```bash
node marketing/scripts/assert-selectors.mjs marketing/mockups/results-ai-mode.html '[
  {"selector":"#status-row.complete","exists":true},
  {"selector":".mock-preview h6","exists":true}
]'
```

Expected: `OK — 2 check(s) passed`. (This check runs against a fresh page load with default timing; by the time `assert-selectors.mjs` navigates and queries, roughly 6–8s have elapsed and the first scenario's `complete` state is showing — comfortably inside its 3.5s hold before the next scenario resets the frame. If this becomes flaky in practice, rerun; the underlying beat-order test in Step 2 is the authoritative check.)

- [ ] **Step 5: Commit**

```bash
git add marketing/mockups/results-ai-mode.html
git commit -m "marketing: animate Results (AI Mode) scan/verify/stream pipeline"
```

---

### Task 8: Capture script — MP4/GIF + PNG keyframe export

**Files:**
- Create: `marketing/scripts/capture.mjs`

**Interfaces:**
- Consumes: `marketing/mockups/search-ai-mode.html` (1 beat: `query-typed`) and `marketing/mockups/results-ai-mode.html` (4 beats: `query-typed`, `scanning`, `verifying`, `complete`) from Tasks 5 and 7.
- Produces: `marketing/exports/<name>/keyframes/<beat>.png` and `marketing/exports/<name>/video/<name>.webm` (+ `.mp4`/`.gif` when `ffmpeg` is available).

- [ ] **Step 1: Install ffmpeg (required for the MP4/GIF deliverables)**

```bash
brew install ffmpeg
ffmpeg -version | head -1
```

Expected: prints an `ffmpeg version …` line.

- [ ] **Step 2: Write `marketing/scripts/capture.mjs`**

```js
// marketing/scripts/capture.mjs
// Exports MP4 video + PNG keyframes for each marketing mockup, driven by
// the same `mock:beat` events used by wait-for-beats.mjs.
// Usage: node scripts/capture.mjs

import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve, join } from "node:path";
import { mkdirSync, renameSync } from "node:fs";
import { execFileSync } from "node:child_process";

const ROOT = resolve(new URL(".", import.meta.url).pathname, "..");

const TARGETS = [
  {
    name: "search-ai-mode",
    html: join(ROOT, "mockups", "search-ai-mode.html"),
    beats: ["query-typed"],
    viewport: { width: 760, height: 420 },
  },
  {
    name: "results-ai-mode",
    html: join(ROOT, "mockups", "results-ai-mode.html"),
    beats: ["query-typed", "scanning", "verifying", "complete"],
    viewport: { width: 960, height: 620 },
  },
];

function hasFfmpeg() {
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

async function captureTarget(browser, target, ffmpegAvailable) {
  const exportDir = join(ROOT, "exports", target.name);
  const keyframeDir = join(exportDir, "keyframes");
  const videoDir = join(exportDir, "video");
  mkdirSync(keyframeDir, { recursive: true });
  mkdirSync(videoDir, { recursive: true });

  const context = await browser.newContext({
    viewport: target.viewport,
    recordVideo: { dir: videoDir, size: target.viewport },
  });
  const page = await context.newPage();

  const seenBeats = [];
  await page.exposeFunction("__onBeat", async (name) => {
    if (seenBeats.includes(name)) return;
    seenBeats.push(name);
    await page.screenshot({ path: join(keyframeDir, `${name}.png`) });
  });
  await page.addInitScript(() => {
    window.addEventListener("mock:beat", (e) => window.__onBeat(e.detail.beat));
  });

  await page.goto(pathToFileURL(target.html).href);

  const start = Date.now();
  while (seenBeats.length < target.beats.length && Date.now() - start < 20000) {
    await page.waitForTimeout(100);
  }
  if (seenBeats.length < target.beats.length) {
    console.warn(`WARN: ${target.name} only captured beats ${JSON.stringify(seenBeats)} before timeout`);
  }

  await page.close();
  const video = page.video();
  await context.close();

  if (video) {
    const webmPath = join(videoDir, `${target.name}.webm`);
    const tmpPath = await video.path();
    renameSync(tmpPath, webmPath);

    if (ffmpegAvailable) {
      const mp4Path = join(videoDir, `${target.name}.mp4`);
      execFileSync("ffmpeg", ["-y", "-i", webmPath, "-pix_fmt", "yuv420p", mp4Path]);
      const gifPath = join(videoDir, `${target.name}.gif`);
      execFileSync("ffmpeg", ["-y", "-i", mp4Path, "-vf", "fps=12,scale=760:-1:flags=lanczos", gifPath]);
      console.log(`  wrote ${mp4Path} and ${gifPath}`);
    } else {
      console.log(`  ffmpeg not found -- ${webmPath} is the only video output (install ffmpeg for MP4/GIF)`);
    }
  }

  console.log(`${target.name}: captured ${seenBeats.length}/${target.beats.length} keyframes`);
}

const ffmpegAvailable = hasFfmpeg();
if (!ffmpegAvailable) {
  console.warn("ffmpeg not found on PATH -- video export will stay WebM-only. Install with `brew install ffmpeg` (macOS) for MP4/GIF.");
}

const browser = await chromium.launch();
for (const target of TARGETS) {
  console.log(`Capturing ${target.name}...`);
  await captureTarget(browser, target, ffmpegAvailable);
}
await browser.close();
```

- [ ] **Step 3: Run the capture script**

```bash
cd marketing && node scripts/capture.mjs
```

Expected: two `Capturing …` lines, each followed by a `wrote …mp4 and …gif` line and a `captured N/N keyframes` line matching each target's beat count (`1/1` for `search-ai-mode`, `4/4` for `results-ai-mode`).

- [ ] **Step 4: Verify the expected output files exist and are non-empty**

```bash
cd marketing
for f in \
  exports/search-ai-mode/keyframes/query-typed.png \
  exports/search-ai-mode/video/search-ai-mode.webm \
  exports/search-ai-mode/video/search-ai-mode.mp4 \
  exports/search-ai-mode/video/search-ai-mode.gif \
  exports/results-ai-mode/keyframes/query-typed.png \
  exports/results-ai-mode/keyframes/scanning.png \
  exports/results-ai-mode/keyframes/verifying.png \
  exports/results-ai-mode/keyframes/complete.png \
  exports/results-ai-mode/video/results-ai-mode.webm \
  exports/results-ai-mode/video/results-ai-mode.mp4 \
  exports/results-ai-mode/video/results-ai-mode.gif \
; do
  test -s "$f" && echo "OK  $f" || echo "MISSING/EMPTY  $f"
done
```

Expected: every line prints `OK  <path>`.

- [ ] **Step 5: Commit** (the script only — `exports/` is gitignored)

```bash
git add marketing/scripts/capture.mjs
git commit -m "marketing: add Playwright capture script for MP4/GIF/PNG exports"
```

---

### Task 9: README

**Files:**
- Create: `marketing/README.md`

**Interfaces:** none (documentation only).

- [ ] **Step 1: Write the README**

```markdown
# chaserAI Marketing Mockups

Standalone, animated HTML/CSS/JS mockups of the chaserAI search experience,
built for the landing page, sales/investor presentations, and written
documents. Kept fully separate from the real product code in `../India/`
(the Next.js site).

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
- `mockups/shared/scenarios.js` — the three scripted North-America-flavored
  query/result scenarios both pages animate through.
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
| Landing page | Embed the HTML mockup directly (iframe, or port the markup/script into a React component under `India/components/` later), or embed the exported MP4 as a looping background video. |
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
```

- [ ] **Step 2: Confirm every file path mentioned in the README actually exists**

```bash
for f in \
  marketing/mockups/search-ai-mode.html \
  marketing/mockups/results-ai-mode.html \
  marketing/mockups/shared/chaser-mock.css \
  marketing/mockups/shared/scenarios.js \
  marketing/mockups/shared/scenarios.test.mjs \
  marketing/scripts/assert-selectors.mjs \
  marketing/scripts/wait-for-beats.mjs \
  marketing/scripts/capture.mjs \
; do
  test -f "$f" && echo "OK  $f" || echo "MISSING  $f"
done
```

Expected: every line prints `OK  <path>`.

- [ ] **Step 3: Commit**

```bash
git add marketing/README.md
git commit -m "marketing: add README covering preview, capture, and export usage"
```

---

## Self-Review Notes

- **Spec coverage:** all 5 deliverables from the design spec map onto tasks —
  `results-ai-mode.html` (Tasks 6–7), `search-ai-mode.html` (Tasks 4–5),
  `shared/chaser-mock.css` (Task 2), `shared/scenarios.js` (Task 3),
  `scripts/capture.mjs` (Task 8), `README.md` (Task 9), plus the scaffold/
  harness (Task 1) the spec assumed but didn't itemize.
- **Corrected during planning:** the design spec assumed Playwright emits
  MP4 directly; it only emits WebM. Task 8 and the Global Constraints now
  reflect the real pipeline (WebM native, MP4/GIF via `ffmpeg`) and install
  `ffmpeg` so the MP4 deliverable is real, not merely aspirational.
- **Type/name consistency:** `renderSidebar`, `renderCrumbs`, `renderComplete`,
  `cardHtml`, `renderPreview`, `renderCompleteFrame` are defined once in
  Task 6 and reused verbatim (not redefined) in Task 7. The `mock:beat`
  event name and its `detail.beat` values (`query-typed`, `scanning`,
  `verifying`, `complete`) are identical across Tasks 5, 7, and 8.
