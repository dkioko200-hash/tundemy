/**
 * upload-videos-to-blob.js  — plain Node.js (no TypeScript needed)
 *
 * Usage:
 *   BLOB_READ_WRITE_TOKEN=<token> node scripts/upload-videos-to-blob.js
 */

const fs = require("fs");
const path = require("path");
const { put } = require("@vercel/blob");

const ROOT = path.join(__dirname, "..");
const COURSE_CONTENT = path.join(ROOT, "lib", "course-content.ts");
const MAP_OUT = path.join(__dirname, "video-url-map.json");
const LOG_OUT = path.join(__dirname, "upload-log.txt");

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_OUT, line + "\n");
}

function getReferencedPaths() {
  const src = fs.readFileSync(COURSE_CONTENT, "utf-8");
  const matches = src.match(/["']\/videos\/[^"']+\.mp4["']/g) || [];
  const unique = [...new Set(matches.map((m) => m.replace(/^["']|["']$/g, "")))];
  return unique.sort();
}

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    log("ERROR: BLOB_READ_WRITE_TOKEN not set");
    process.exit(1);
  }

  // Clear log
  fs.writeFileSync(LOG_OUT, "");

  const referenced = getReferencedPaths();
  log(`Found ${referenced.length} video paths in course-content.ts`);

  // Load existing map (resume support)
  const map = fs.existsSync(MAP_OUT)
    ? JSON.parse(fs.readFileSync(MAP_OUT, "utf-8"))
    : {};

  const skipped = Object.keys(map).filter((k) => referenced.includes(k)).length;
  if (skipped > 0) log(`Skipping ${skipped} already-uploaded files`);

  const failed = [];
  let i = 0;

  for (const videoPath of referenced) {
    i++;
    if (map[videoPath]) {
      log(`[${i}/${referenced.length}] SKIP (cached): ${videoPath}`);
      continue;
    }

    const localFile = path.join(ROOT, "public", videoPath);
    if (!fs.existsSync(localFile)) {
      log(`[${i}/${referenced.length}] MISSING: ${localFile}`);
      failed.push(videoPath);
      continue;
    }

    const sizeMB = (fs.statSync(localFile).size / 1024 / 1024).toFixed(1);
    const blobKey = videoPath.replace(/^\//, ""); // strip leading slash
    log(`[${i}/${referenced.length}] UPLOAD ${videoPath} (${sizeMB} MB)...`);

    try {
      const stream = fs.createReadStream(localFile);
      const { url } = await put(blobKey, stream, {
        access: "public",
        contentType: "video/mp4",
      });
      map[videoPath] = url;
      log(`[${i}/${referenced.length}] OK: ${url}`);
      fs.writeFileSync(MAP_OUT, JSON.stringify(map, null, 2));
    } catch (err) {
      log(`[${i}/${referenced.length}] FAILED: ${err.message}`);
      failed.push(videoPath);
    }
  }

  fs.writeFileSync(MAP_OUT, JSON.stringify(map, null, 2));
  log(`\n=== DONE === Uploaded: ${Object.keys(map).length}/${referenced.length}`);
  if (failed.length > 0) {
    log(`Failed: ${failed.join(", ")}`);
  }
  log(`Map saved to: ${MAP_OUT}`);
}

main().catch((err) => {
  fs.appendFileSync(LOG_OUT, `FATAL: ${err.message}\n`);
  process.exit(1);
});
