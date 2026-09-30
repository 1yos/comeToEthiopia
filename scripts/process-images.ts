/**
 * process-images.ts
 * Converts all source images in /src/assets/images/{hero,regions,tours}/
 * into WebP srcset variants (480w, 960w, 1600w) and tiny LQIP (20×20 WebP).
 *
 * Run with: npx tsx scripts/process-images.ts
 *
 * Output structure:
 *   src/assets/images/{folder}/{name}-480.webp
 *   src/assets/images/{folder}/{name}-960.webp
 *   src/assets/images/{folder}/{name}-1600.webp
 *   src/assets/images/{folder}/{name}-lqip.webp  (20×20, blur)
 */

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const WIDTHS = [480, 960, 1600]
const LQIP_SIZE = 20
const WEBP_QUALITY = 82
const LQIP_QUALITY = 20

const SOURCE_DIRS = [
  'src/assets/images/hero',
  'src/assets/images/regions',
  'src/assets/images/tours',
]

const SUPPORTED_EXTS = new Set(['.webp', '.jpg', '.jpeg', '.png', '.avif'])

let processed = 0
let skipped = 0
let errors = 0

async function processImage(filePath: string): Promise<void> {
  const ext = path.extname(filePath).toLowerCase()
  if (!SUPPORTED_EXTS.has(ext)) return

  const dir  = path.dirname(filePath)
  const base = path.basename(filePath, ext)

  // Skip files that are already processed variants
  if (base.endsWith('-480') || base.endsWith('-960') || base.endsWith('-1600') || base.endsWith('-lqip')) {
    skipped++
    return
  }

  const src = sharp(filePath)
  const meta = await src.metadata()
  const srcW = meta.width ?? 1600

  console.log(`  Processing: ${path.basename(filePath)} (${srcW}px wide)`)

  const tasks: Promise<void>[] = []

  // Generate each width variant
  for (const w of WIDTHS) {
    // Don't upscale — skip variants wider than the source
    if (w > srcW * 1.1) {
      console.log(`    → skip ${w}w (source is ${srcW}px)`)
      continue
    }

    const outPath = path.join(dir, `${base}-${w}.webp`)
    if (fs.existsSync(outPath)) {
      console.log(`    → already exists: ${base}-${w}.webp`)
      continue
    }

    tasks.push(
      sharp(filePath)
        .resize(w, undefined, { withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(outPath)
        .then(() => {
          const size = Math.round(fs.statSync(outPath).size / 1024)
          console.log(`    → ${base}-${w}.webp (${size}KB)`)
        })
    )
  }

  // Generate LQIP
  const lqipPath = path.join(dir, `${base}-lqip.webp`)
  if (!fs.existsSync(lqipPath)) {
    tasks.push(
      sharp(filePath)
        .resize(LQIP_SIZE, LQIP_SIZE, { fit: 'cover' })
        .blur(2)
        .webp({ quality: LQIP_QUALITY })
        .toFile(lqipPath)
        .then(() => console.log(`    → ${base}-lqip.webp`))
    )
  }

  await Promise.all(tasks)
  processed++
}

async function main() {
  const cwd = process.cwd()
  let total = 0

  for (const dir of SOURCE_DIRS) {
    const absDir = path.join(cwd, dir)
    if (!fs.existsSync(absDir)) {
      console.log(`  Skipping missing dir: ${dir}`)
      continue
    }

    const files = fs.readdirSync(absDir)
      .filter(f => SUPPORTED_EXTS.has(path.extname(f).toLowerCase()))
      .filter(f => !f.includes('-480') && !f.includes('-960') && !f.includes('-1600') && !f.includes('-lqip'))

    console.log(`\n${dir} — ${files.length} source file(s)`)
    total += files.length

    for (const file of files) {
      try {
        await processImage(path.join(absDir, file))
      } catch (err) {
        console.error(`  ✗ Error processing ${file}: ${err}`)
        errors++
      }
    }
  }

  console.log(`\n── Summary ──────────────────`)
  console.log(`  Source images: ${total}`)
  console.log(`  Processed:     ${processed}`)
  console.log(`  Skipped:       ${skipped}`)
  console.log(`  Errors:        ${errors}`)
  console.log(`─────────────────────────────`)
}

main().catch(console.error)
