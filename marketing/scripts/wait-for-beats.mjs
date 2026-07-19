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

const browser = await chromium.launch({ args: ["--allow-file-access-from-files"] });
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
