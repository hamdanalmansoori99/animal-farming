// One-off: chroma-key the white background out of public/images/logo.png.
// Run with: node scripts/strip-white-bg.mjs
//
// Pixels with all RGB channels >= HARD_WHITE become fully transparent.
// Pixels with channels in [SOFT_WHITE, HARD_WHITE) get a feathered alpha
// proportional to brightness, so edges stay smooth instead of stair-stepping.

import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TARGET = path.join(__dirname, "..", "public", "images", "logo.png");

// Logo is dark on light. Background may be pure white OR slightly cream/grey.
// We treat any "bright + low-saturation" pixel as background.
const BRIGHT_MIN = 180;     // brightness >= this AND saturation low => candidate
const HARD_BRIGHT = 230;    // brightness >= this => fully transparent
const SAT_MAX = 0.12;       // saturation must be below this to count as bg

const img = sharp(TARGET).ensureAlpha();
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

if (channels !== 4) {
  throw new Error(`Expected 4 channels (RGBA), got ${channels}`);
}

const out = Buffer.from(data);
let stripped = 0;
let feathered = 0;

for (let i = 0; i < out.length; i += 4) {
  const r = out[i];
  const g = out[i + 1];
  const b = out[i + 2];
  const maxC = Math.max(r, g, b);
  const minC = Math.min(r, g, b);
  const saturation = maxC === 0 ? 0 : (maxC - minC) / maxC;
  const brightness = (r + g + b) / 3;

  if (saturation > SAT_MAX) continue;          // colored pixel, keep as-is
  if (brightness < BRIGHT_MIN) continue;       // dark pixel, keep as-is

  if (brightness >= HARD_BRIGHT) {
    out[i + 3] = 0;
    stripped++;
  } else {
    // Feather: BRIGHT_MIN -> alpha 255, HARD_BRIGHT -> alpha 0
    const t = (brightness - BRIGHT_MIN) / (HARD_BRIGHT - BRIGHT_MIN);
    out[i + 3] = Math.round(255 * (1 - t));
    feathered++;
  }
}

await sharp(out, { raw: { width, height, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(TARGET);

console.log(
  `done — ${width}x${height}, ${stripped} pixels fully transparent, ${feathered} feathered.`
);
