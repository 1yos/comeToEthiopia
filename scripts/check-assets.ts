/**
 * check-assets.ts
 * Scans all .tsx and .ts source files for image/video/audio references,
 * checks that every referenced file exists in public/media or public/,
 * and exits with code 1 if anything is missing.
 *
 * Run: npx tsx scripts/check-assets.ts
 * Wired into: npm run build and npm run dev (via package.json scripts)
 */

import fs from "fs";
import path from "path";
import { glob } from "glob";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const SRC_DIR = path.join(ROOT, "src");

// Patterns that indicate a static asset path served from /public
// Matches strings like "/media/tours/foo.webp", "/favicon.svg", etc.
const ASSET_PATTERN =
  /["'`](\/[^\s"'`]*\.(webp|avif|jpg|jpeg|png|gif|svg|mp4|webm|ogg|mp3))["'`]/g;

// Also catch template literals like `/media/tours/${...}-480.webp`
// We resolve these by checking the base path exists
const TEMPLATE_PATTERN =
  /`(\/[^\s`$]*)\$\{[^}]*\}([^\s`]*\.(?:webp|avif|jpg|jpeg|png|gif|svg|mp4|webm|ogg|mp3))`/g;

interface Issue {
  file: string;
  line: number;
  ref: string;
  reason: string;
}

const issues: Issue[] = [];
const checked = new Set<string>();

function checkPath(ref: string, file: string, line: number): void {
  if (checked.has(ref)) return;
  checked.add(ref);

  const abs = path.join(PUBLIC_DIR, ref);
  if (!fs.existsSync(abs)) {
    issues.push({ file, line, ref, reason: "File not found in public/" });
  } else {
    const size = fs.statSync(abs).size;
    if (size === 0) {
      issues.push({ file, line, ref, reason: "File exists but is 0 bytes" });
    }
  }
}

async function main(): Promise<void> {
  console.log("🔍 check-assets: scanning source files...\n");

  const sourceFiles = await glob("src/**/*.{ts,tsx}", {
    cwd: ROOT,
    absolute: true,
  });
  let scannedCount = 0;
  let refCount = 0;

  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, "utf8");
    // Strip single-line comments before scanning to avoid false positives
    const stripped = content
      .split("\n")
      .map((line) => {
        const commentIdx = line.indexOf("//");
        return commentIdx >= 0 ? line.substring(0, commentIdx) : line;
      })
      .join("\n");
    scannedCount++;

    // Check static string references (use stripped — comments excluded)
    let match: RegExpExecArray | null;
    ASSET_PATTERN.lastIndex = 0;
    while ((match = ASSET_PATTERN.exec(stripped)) !== null) {
      const ref = match[1];
      const lineNum = stripped.substring(0, match.index).split("\n").length;
      checkPath(ref, file.replace(ROOT + path.sep, ""), lineNum);
      refCount++;
    }

    // Check template literal base paths (use stripped — comments excluded)
    TEMPLATE_PATTERN.lastIndex = 0;
    while ((match = TEMPLATE_PATTERN.exec(stripped)) !== null) {
      const dir = path.dirname(path.join(PUBLIC_DIR, match[1]));
      const lineNum = stripped.substring(0, match.index).split("\n").length;
      if (!fs.existsSync(dir)) {
        const rel = file.replace(ROOT + path.sep, "");
        issues.push({
          file: rel,
          line: lineNum,
          ref: match[1] + "${...}" + match[2],
          reason: `Directory not found: ${dir.replace(ROOT, "")}`,
        });
      }
    }
  }

  console.log(`  Scanned: ${scannedCount} source files`);
  console.log(`  Checked: ${checked.size} unique asset paths`);
  console.log(`  Total refs: ${refCount}\n`);

  if (issues.length === 0) {
    console.log("✓ All asset references resolved. No missing files.\n");
    process.exit(0);
  } else {
    console.error(`✗ ${issues.length} missing or broken asset reference(s):\n`);
    for (const issue of issues) {
      console.error(`  ${issue.file}:${issue.line}`);
      console.error(`    ref: ${issue.ref}`);
      console.error(`    reason: ${issue.reason}\n`);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("check-assets failed:", err);
  process.exit(1);
});
