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
  assert.ok(s.search && typeof s.search === "string", `${s.id}: missing search term`);

  // Finder folder metadata (Act 1).
  assert.ok(s.folder && typeof s.folder === "object", `${s.id}: missing folder`);
  assert.ok(s.folder.name && typeof s.folder.name === "string", `${s.id}: folder.name required`);
  assert.ok(s.folder.path && typeof s.folder.path === "string", `${s.id}: folder.path required`);
  assert.ok(typeof s.folder.itemCount === "number" && s.folder.itemCount > 0, `${s.id}: folder.itemCount must be a positive number`);

  // The shared file set — same files stream through both the Finder pile and
  // the chaserAI scan feed. Each shows its junk `name`; `file` is the real image.
  assert.ok(Array.isArray(s.files) && s.files.length >= 6, `${s.id}: needs >=6 files`);
  for (const f of s.files) {
    assert.ok(f.name && typeof f.name === "string", `${s.id}: file missing junk name`);
    assert.ok(f.file && existsSync(join(SAMPLES_DIR, f.file)), `${s.id}: file image ${f.file} has no matching sample`);
  }

  assert.ok(Array.isArray(s.results) && s.results.length >= 5, `${s.id}: needs >=5 results`);
  const tops = s.results.filter((r) => r.top === true);
  assert.equal(tops.length, 1, `${s.id}: needs exactly one top:true result`);
  assert.equal(s.results[0], tops[0], `${s.id}: top result must be first in the results array`);
  const scores = s.results.map((r) => r.score);
  const sorted = [...scores].sort((a, b) => b - a);
  assert.deepEqual(scores, sorted, `${s.id}: results must be sorted by score descending`);
  for (const r of s.results) {
    assert.ok(r.name && r.snippet && typeof r.score === "number", `${s.id}: malformed result ${JSON.stringify(r)}`);
    assert.ok(r.score > 0 && r.score <= 1, `${s.id}: score out of range for ${r.name}`);
    // `file` is the image source (preview/thumbnail); `name` is the junk display filename.
    assert.ok(r.file && r.file.endsWith(".jpg"), `${s.id}: ${r.name} must map to a .jpg image (it doubles as the preview source)`);
    assert.ok(existsSync(join(SAMPLES_DIR, r.file)), `${s.id}: ${r.file} has no matching file under shared/samples/`);
  }

  // Same file set across acts: every result must be one of the folder's files,
  // and the top result must appear in the pile so the Act-3 reveal lands.
  const fileImages = new Set(s.files.map((f) => f.file));
  for (const r of s.results) {
    assert.ok(fileImages.has(r.file), `${s.id}: result ${r.name} (${r.file}) is not in the shared file set`);
  }

  assert.ok(Array.isArray(s.sidebar) && s.sidebar.length >= 1, `${s.id}: needs sidebar buckets`);
  assert.ok(typeof s.elapsedLabel === "string", `${s.id}: missing elapsedLabel`);
}

console.log(`OK — ${scenarios.length} scenarios validated`);
