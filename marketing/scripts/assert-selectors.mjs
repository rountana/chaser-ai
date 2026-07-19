// marketing/scripts/assert-selectors.mjs
// Minimal Playwright-based structural smoke check, reused by several plan
// tasks to verify a mockup page renders expected elements/text/styles.
//
// Usage: node assert-selectors.mjs <path-to-html> '<JSON array of checks>' [--reduced-motion]
// Each check: { selector, exists?: true, text?: "exact text", cssProp?: "background-color", cssValue?: "rgb(11, 13, 17)" }

import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const [, , htmlPath, checksJson, motionFlag] = process.argv;
if (!htmlPath || !checksJson) {
  console.error("Usage: node assert-selectors.mjs <html-path> '<checks-json>' [--reduced-motion]");
  process.exit(2);
}
const checks = JSON.parse(checksJson);
const reducedMotion = motionFlag === "--reduced-motion";

const browser = await chromium.launch({ args: ["--allow-file-access-from-files"] });
const page = await browser.newPage({ reducedMotion: reducedMotion ? "reduce" : "no-preference" });
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
