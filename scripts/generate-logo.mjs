/**
 * Generates tundemy-logo-white.png (transparent bg) and
 * tundemy-logo-preview.png (navy bg) using sharp + raw SVG compositing.
 *
 * Canvas size: 500 × 100
 * Stripe specs: 8px wide, 70px tall, 3px gaps, starting at x=0
 * Text: "Tundemy", bold 52px, white, 16px gap after stripes
 */

import sharp from "sharp";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../public/images");

const W = 500;
const H = 100;

// ── Stripe geometry ────────────────────────────────────────────────────────────
const STRIPE_W = 8;
const STRIPE_H = 70;
const GAP = 3;
const STRIPE_Y = (H - STRIPE_H) / 2;   // 15 — centred vertically

const stripes = [
  { x: 0,                    color: "#000000" },
  { x: STRIPE_W + GAP,       color: "#bb0000" },
  { x: (STRIPE_W + GAP) * 2, color: "#2d8a4e" },
];

// Right edge of the last stripe
const stripesRight = (STRIPE_W + GAP) * 2 + STRIPE_W;  // 38

// ── Text position ──────────────────────────────────────────────────────────────
const TEXT_GAP = 16;
const TEXT_X = stripesRight + TEXT_GAP;   // 54

// SVG baseline tweak: for a 52px font the dominant-baseline centre sits ~2px
// high on most renderers, so we nudge y slightly.
const TEXT_Y = H / 2 + 1;                // 51

// ── Build SVG ─────────────────────────────────────────────────────────────────
function buildSVG(bgColor) {
  const bg = bgColor
    ? `<rect width="${W}" height="${H}" fill="${bgColor}" />`
    : "";

  const stripeRects = stripes
    .map(
      (s) =>
        `<rect x="${s.x}" y="${STRIPE_Y}" width="${STRIPE_W}" height="${STRIPE_H}" fill="${s.color}" />`
    )
    .join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  ${bg}
  ${stripeRects}
  <text
    x="${TEXT_X}"
    y="${TEXT_Y}"
    dominant-baseline="central"
    font-family="Arial, Helvetica, sans-serif"
    font-weight="bold"
    font-size="52"
    fill="#ffffff"
  >Tundemy</text>
</svg>`;
}

// ── Render + save ──────────────────────────────────────────────────────────────
async function render(svgString, outFile) {
  const buf = Buffer.from(svgString);
  await sharp(buf).png().toFile(outFile);
  console.log(`✓ ${outFile}`);
}

await render(buildSVG(null),        path.join(OUT, "tundemy-logo-white.png"));
await render(buildSVG("#0f1f3d"),   path.join(OUT, "tundemy-logo-preview.png"));

console.log("Done.");
