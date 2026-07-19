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

const browser = await chromium.launch({ args: ["--allow-file-access-from-files"] });
for (const target of TARGETS) {
  console.log(`Capturing ${target.name}...`);
  await captureTarget(browser, target, ffmpegAvailable);
}
await browser.close();
