import * as fs from "fs";
import * as path from "path";

interface ManifestEntry {
  courseSlug: string;
  lessonIndex: number;
  lessonTitle: string;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function main(): void {
  const manifestPath = path.join(process.cwd(), "scripts", "video-manifest-full.json");
  if (!fs.existsSync(manifestPath)) throw new Error("Run npm run build:manifest first");

  const manifest: ManifestEntry[] = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  const courseContentPath = path.join(process.cwd(), "lib", "course-content.ts");
  let src = fs.readFileSync(courseContentPath, "utf-8");

  let alreadyCorrect = 0;
  let inserted = 0;
  let replaced = 0;
  const failures: string[] = [];

  for (const entry of manifest) {
    const newUrl = `/videos/${entry.courseSlug}/lesson-${entry.lessonIndex}.mp4`;
    const escapedTitle = escapeRegex(entry.lessonTitle);

    // 1. If the exact correct URL is already in the file, nothing to do.
    if (src.includes(`videoUrl: "${newUrl}"`)) {
      alreadyCorrect++;
      continue;
    }

    // 2. Look for the title line in the file.
    const titleRe = new RegExp(`([ \\t]+title:\\s*"${escapedTitle}",)`);
    const titleMatch = titleRe.exec(src);
    if (!titleMatch) {
      failures.push(`${entry.courseSlug} L${entry.lessonIndex}: title not found`);
      continue;
    }

    // 3. Within 300 chars after the title, check if there's a wrong videoUrl to replace.
    const afterTitle = src.slice(titleMatch.index + titleMatch[0].length, titleMatch.index + titleMatch[0].length + 300);
    const wrongUrlRe = /videoUrl:\s*"[^"]*"/;
    if (wrongUrlRe.test(afterTitle)) {
      // Replace the wrong URL that's close to this title
      const absStart = titleMatch.index + titleMatch[0].length;
      const wrongMatch = wrongUrlRe.exec(src.slice(absStart, absStart + 300))!;
      const urlStart = absStart + wrongMatch.index;
      src = src.slice(0, urlStart) + `videoUrl: "${newUrl}"` + src.slice(urlStart + wrongMatch[0].length);
      replaced++;
    } else {
      // 4. Insert a new videoUrl line immediately after the title line.
      const indent = titleMatch[1].match(/^[ \t]+/)![0];
      const insertPos = titleMatch.index + titleMatch[0].length;
      src = src.slice(0, insertPos) + `\n${indent}videoUrl: "${newUrl}",` + src.slice(insertPos);
      inserted++;
    }
  }

  fs.writeFileSync(courseContentPath, src);

  const total = (src.match(/videoUrl:\s*"/g) ?? []).length;
  console.log(`Already correct: ${alreadyCorrect} | Replaced: ${replaced} | Inserted: ${inserted} | Total videoUrl in file: ${total}/${manifest.length}`);
  if (failures.length > 0) {
    console.log(`\nFailed to patch ${failures.length} lessons:`);
    failures.forEach((f) => console.log(`  ${f}`));
  }
}

main();
