/**
 * apply-blob-urls.js
 *
 * Reads scripts/video-url-map.json and replaces every /videos/... path
 * in lib/course-content.ts with the corresponding Vercel Blob URL.
 *
 * Usage: node scripts/apply-blob-urls.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const MAP_FILE = path.join(__dirname, "video-url-map.json");
const COURSE_CONTENT = path.join(ROOT, "lib", "course-content.ts");

if (!fs.existsSync(MAP_FILE)) {
  console.error("ERROR: scripts/video-url-map.json not found. Run upload-videos-to-blob.js first.");
  process.exit(1);
}

const map = JSON.parse(fs.readFileSync(MAP_FILE, "utf-8"));
let src = fs.readFileSync(COURSE_CONTENT, "utf-8");

let replaced = 0;
let missing = [];

for (const [oldPath, blobUrl] of Object.entries(map)) {
  // Match both single and double quoted versions
  const pattern = new RegExp(`(["'\`])${oldPath.replace(/\//g, "\\/")}\\1`, "g");
  const before = src;
  src = src.replace(pattern, (match, quote) => `${quote}${blobUrl}${quote}`);
  if (src !== before) {
    replaced++;
    console.log(`✅ ${oldPath} → ${blobUrl}`);
  } else {
    missing.push(oldPath);
  }
}

fs.writeFileSync(COURSE_CONTENT, src);

console.log(`\n=== Done ===`);
console.log(`Replaced: ${replaced} / ${Object.keys(map).length}`);
if (missing.length > 0) {
  console.log(`\nNot found in course-content.ts (${missing.length}):`);
  missing.forEach(p => console.log(`  ${p}`));
}
