// marketing/mockups/shared/scenarios.test.mjs
// Plain-Node shape check for scenarios.js — no test framework needed.
// Run: node marketing/mockups/shared/scenarios.test.mjs

import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { scenarios } from "./scenarios.js";

const SAMPLES_DIR = join(dirname(fileURLToPath(import.meta.url)), "samples");

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
    assert.ok(r.filename.endsWith(".jpg"), `${s.id}: ${r.filename} must be a .jpg (it doubles as the preview image source)`);
    assert.ok(existsSync(join(SAMPLES_DIR, r.filename)), `${s.id}: ${r.filename} has no matching file under shared/samples/`);
  }
  assert.ok(Array.isArray(s.sidebar) && s.sidebar.length >= 1, `${s.id}: needs sidebar buckets`);
  assert.ok(typeof s.elapsedLabel === "string", `${s.id}: missing elapsedLabel`);
}

console.log(`OK — ${scenarios.length} scenarios validated`);
