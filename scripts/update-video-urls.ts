import * as fs from "fs";
import * as path from "path";

interface ManifestEntry {
  courseSlug: string;
  lessonIndex: number;
  lessonTitle: string;
  avatarName: string;
}

function main(): void {
  const manifestPath = path.join(process.cwd(), "scripts", "video-manifest-full.json");
  if (!fs.existsSync(manifestPath)) throw new Error("Run npm run build:manifest first");

  const manifest: ManifestEntry[] = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  const courseContentPath = path.join(process.cwd(), "lib", "course-content.ts");
  let src = fs.readFileSync(courseContentPath, "utf-8");

  let updated = 0;
  let added = 0;

  for (const entry of manifest) {
    const newUrl = `/videos/${entry.courseSlug}/lesson-${entry.lessonIndex}.mp4`;

    // Check if a videoUrl line already exists near this lesson
    // Pattern: match existing videoUrl within the context of this lesson block
    // We'll use the lesson title as an anchor since lessonNumber is unique within a course
    const titlePattern = new RegExp(
      `(lessonNumber:\\s*${entry.lessonIndex},[\\s\\S]{0,600}?)(videoUrl:\\s*"[^"]*")`,
      "g"
    );

    const titlePatternNoUrl = new RegExp(
      `(lessonNumber:\\s*${entry.lessonIndex},[\\s\\S]{0,200}?title:\\s*"${entry.lessonTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]{0,200}?)(isAvailable:\\s*(?:true|false),)`,
      "g"
    );

    if (titlePattern.test(src)) {
      // Replace existing videoUrl for this lesson number
      // More targeted: find the lesson block and replace its videoUrl
      const blockPattern = new RegExp(
        `(lessonNumber:\\s*${entry.lessonIndex},[\\s\\S]{0,800}?)(videoUrl:\\s*"[^"]*")(,?)`,
      );
      const newSrc = src.replace(blockPattern, (match, before, _urlPart, comma) => {
        const alreadyNew = _urlPart.includes(newUrl);
        if (alreadyNew) return match;
        updated++;
        return `${before}videoUrl: "${newUrl}"${comma}`;
      });
      if (newSrc !== src) src = newSrc;
    } else {
      // Need to insert videoUrl — add after isAvailable line in this lesson block
      src = src.replace(titlePatternNoUrl, (match, before, isAvailLine) => {
        // Check if videoUrl already present in this match
        if (match.includes("videoUrl:")) return match;
        added++;
        return `${before}videoUrl: "${newUrl}",\n        ${isAvailLine}`;
      });
    }
  }

  fs.writeFileSync(courseContentPath, src);
  console.log(`\nUpdated ${updated} existing videoUrl fields`);
  console.log(`Added   ${added} new videoUrl fields`);
  console.log(`Total   ${manifest.length} lessons processed`);

  // Verify: count videoUrl fields
  const matches = (src.match(/videoUrl:\s*"/g) ?? []).length;
  console.log(`\nTotal videoUrl fields in file: ${matches}`);
}

main();
