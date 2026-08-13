#!/usr/bin/env node
/**
 * Generates responsive derivatives for hero and tile images, plus a manifest the
 * components read to set width/height (so nothing shifts as the page loads).
 *
 * Quartz has no image pipeline of its own, so this runs before `quartz build`.
 * Output goes to content/assets/derived/, which Quartz's Assets emitter then
 * copies into public/ like any other content asset.
 *
 * Animated GIFs get two things: an animated WebP and a still first frame. The tile
 * component serves the still to anyone who has asked for reduced motion — an
 * animated GIF can't be opted out of, an animated WebP behind a <source media>
 * query can.
 *
 * Animated WebP is encoded to a byte budget by dropping frames rather than by
 * destroying quality: a 161-frame GIF at usable quality is several megabytes, and
 * most of that is frames nobody perceives individually. Frame delays are scaled to
 * match so the animation still runs at the original speed.
 */
import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const IMG_DIR = "content/assets/img"
const OUT_DIR = "content/assets/derived"
const MANIFEST = path.join(OUT_DIR, "manifest.json")

const STILL_WIDTHS = [480, 800, 1200, 1600]
const STILL_FORMATS = ["avif", "webp", "jpeg"]

const ANIM_WIDTH = 480 // tiles render at ~350px; 480 covers 2× on the short edge
const ANIM_QUALITY = 60
const ANIM_BUDGET_BYTES = 900 * 1024
const FRAME_STEPS = [1, 2, 3, 4, 6, 8, 12]

const exists = async (p) => !!(await fs.stat(p).catch(() => null))
const mb = (b) => (b / 1024 / 1024).toFixed(2)

async function listSources() {
  if (!(await exists(IMG_DIR))) return []
  const entries = await fs.readdir(IMG_DIR)
  return entries.filter((f) => /\.(jpe?g|png|gif|webp|avif)$/i.test(f)).sort()
}

/** Re-encodes an animated image keeping every `step`th frame. */
async function encodeAnimated(srcPath, meta, step, width, outPath) {
  const source = sharp(srcPath, { animated: true })
  const scaled =
    meta.width && meta.width > width ? source.resize({ width, withoutEnlargement: true }) : source

  const { data, info } = await scaled.ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const pageHeight = info.height / meta.pages
  const frameBytes = info.width * pageHeight * info.channels

  const kept = []
  for (let i = 0; i < meta.pages; i += step) kept.push(i)

  const strip = Buffer.concat(kept.map((i) => data.subarray(i * frameBytes, (i + 1) * frameBytes)))
  const delay = kept.map((i) => (meta.delay?.[i] ?? 40) * step)

  await sharp(strip, {
    raw: {
      width: info.width,
      height: pageHeight * kept.length,
      channels: info.channels,
      pageHeight,
    },
  })
    .webp({ quality: ANIM_QUALITY, effort: 6, delay, loop: 0 })
    .toFile(outPath)

  const { size } = await fs.stat(outPath)
  return { frames: kept.length, bytes: size, width: info.width }
}

async function generate(file) {
  const srcPath = path.join(IMG_DIR, file)
  const stem = file.replace(/\.[^.]+$/, "")
  const meta = await sharp(srcPath).metadata()
  const animated = (meta.pages ?? 1) > 1

  const entry = {
    width: meta.width ?? null,
    height: meta.height ?? null,
    animated,
    still: {},
    anim: null,
  }

  // Never upscale: a 323px source shouldn't be stretched to 1600.
  let stillWidths = STILL_WIDTHS.filter((w) => !meta.width || w <= meta.width)
  if (stillWidths.length === 0 && meta.width) stillWidths = [meta.width]

  for (const format of STILL_FORMATS) {
    entry.still[format] = []
    for (const w of stillWidths) {
      const name = `${stem}-${w}.${format === "jpeg" ? "jpg" : format}`
      // `pages: 1` takes the first frame only, which is what a still should be.
      await sharp(srcPath, { pages: 1 })
        .resize({ width: w, withoutEnlargement: true })
        .toFormat(format, { quality: format === "avif" ? 55 : 78 })
        .toFile(path.join(OUT_DIR, name))
      entry.still[format].push({ w, src: `/assets/derived/${name}` })
    }
  }

  if (animated) {
    const name = `${stem}-anim.webp`
    const outPath = path.join(OUT_DIR, name)
    let result
    for (const step of FRAME_STEPS) {
      result = await encodeAnimated(srcPath, meta, step, ANIM_WIDTH, outPath)
      result.step = step
      if (result.bytes <= ANIM_BUDGET_BYTES) break
    }
    entry.anim = {
      src: `/assets/derived/${name}`,
      w: result.width,
      frames: result.frames,
      sourceFrames: meta.pages,
      bytes: result.bytes,
    }
    if (result.bytes > ANIM_BUDGET_BYTES) {
      console.warn(
        `  ! ${file}: ${mb(result.bytes)} MB even at 1 frame in ${result.step} — over the ` +
          `${mb(ANIM_BUDGET_BYTES)} MB budget. Consider a shorter clip, or an MP4 hero.`,
      )
    }
  }

  return entry
}

const sources = await listSources()
if (!sources.length) {
  await fs.mkdir(OUT_DIR, { recursive: true })
  await fs.writeFile(MANIFEST, "{}\n")
  console.log("prepare-images: no source images yet, nothing to do")
  process.exit(0)
}

await fs.mkdir(OUT_DIR, { recursive: true })
const manifest = {}
for (const file of sources) {
  try {
    const entry = (manifest[file] = await generate(file))
    const note = entry.anim
      ? `animated: ${entry.anim.frames}/${entry.anim.sourceFrames} frames, ${mb(entry.anim.bytes)} MB WebP`
      : "still only"
    console.log(`  ${file}  ${entry.width}×${entry.height}  ${note}`)
  } catch (err) {
    console.error(`  ${file}  FAILED: ${err.message}`)
    process.exitCode = 1
  }
}

await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n")
console.log(`prepare-images: ${sources.length} source image(s) → ${OUT_DIR}`)
