/**
 * upload-videos-to-blob.ts
 *
 * Uploads all .mp4 files referenced in lib/course-content.ts to Vercel Blob Storage.
 * Outputs:
 *   - Console: blob URL for each uploaded file
 *   - scripts/video-url-map.json: mapping of "/videos/..." → "https://....blob.vercel-storage.com/..."
 *
 * Usage:
 *   BLOB_READ_WRITE_TOKEN=<token> npx ts-node --skipProject scripts/upload-videos-to-blob.ts
 */

import * as fs from "fs";
import * as path from "path";
import { put } from "@vercel/blob";

const ROOT = path.join(__dirname, "..");
const VIDEOS_DIR = path.join(ROOT, "public", "videos");
const COURSE_CONTENT = path.join(ROOT, "lib", "course-content.ts");
const MAP_OUT = path.join(__dirname, "video-url-map.json");

function getReferencedPaths(): string[] {
  const src = fs.readFileSync(COURSE_CONTENT, "utf-8");
  const matches = src.match(/["']\/videos\/[^"']+\.mp4["']/g) ?? [];
  const unique = [...new Set(matches.map((m) => m.replace(/^["']|["']$/g, "")))];
  return unique.sort();
}

async function uploadFile(localPath: string, blobPath: string): Promise<string> {
  const stream = fs.createReadStream(localPath);
  const { url } = await put(blobPath, stream, {
    access: "public",
    contentType: "video/mp4",
  });
  return url;
}

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error("❌  BLOB_READ_WRITE_TOKEN not set. Add it to .env.local and export it before running.");
    process.exit(1);
  }

  const referenced = getReferencedPaths();
  console.log(`Found ${referenced.length} video paths referenced in course-content.ts\n`);

  const map: Record<string, string> = {};
  const failed: string[] = [];

  // Load existing map so we can resume without re-uploading
  if (fs.existsSync(MAP_OUT)) {
    const existing = JSON.parse(fs.readFileSync(MAP_OUT, "utf-8")) as Record<string, string>;
    Object.assign(map, existing);
    const already = Object.keys(existing).filter((k) => referenced.includes(k));
    if (already.length > 0) {
      console.log(`↩  Skipping ${already.length} already-uploaded files (found in video-url-map.json)\n`);
    }
  }

  let i = 0;
  for (const videoPath of referenced) {
    i++;
    // Skip if already in map
    if (map[videoPath]) {
      console.log(`[${i}/${referenced.length}] ✓ (cached)  ${videoPath}`);
      console.log(`            ${map[videoPath]}\n`);
      continue;
    }

    const localFile = path.join(ROOT, "public", videoPath);
    if (!fs.existsSync(localFile)) {
      console.warn(`[${i}/${referenced.length}] ⚠  File not found locally, skipping: ${localFile}`);
      failed.push(videoPath);
      continue;
    }

    const sizeMB = (fs.statSync(localFile).size / 1024 / 1024).toFixed(1);
    const blobKey = videoPath.replace(/^\//, ""); // strip leading slash → "videos/..."
    console.log(`[${i}/${referenced.length}] ⬆  Uploading ${videoPath} (${sizeMB} MB)…`);

    try {
      const url = await uploadFile(localFile, blobKey);
      map[videoPath] = url;
      console.log(`            ✅ ${url}\n`);

      // Save map after every upload so progress survives crashes
      fs.writeFileSync(MAP_OUT, JSON.stringify(map, null, 2));
    } catch (err) {
      console.error(`            ❌ FAILED: ${err}\n`);
      failed.push(videoPath);
    }
  }

  fs.writeFileSync(MAP_OUT, JSON.stringify(map, null, 2));

  console.log("\n=== DONE ===");
  console.log(`Uploaded: ${Object.keys(map).length} / ${referenced.length}`);
  if (failed.length > 0) {
    console.log(`Failed (${failed.length}):`);
    failed.forEach((f) => console.log(`  ${f}`));
  }
  console.log(`\nMapping saved to: ${MAP_OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
