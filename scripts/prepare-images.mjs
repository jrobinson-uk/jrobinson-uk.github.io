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
// Budget for an animation. Generous enough for a recognisable loop, small enough that a
// page carrying one still loads quickly. Note: changing this does not invalidate the
// derivative cache below — delete the -anim.webp file to force a re-encode.
const ANIM_QUALITY = 60
const ANIM_BUDGET_BYTES = 500 * 1024
const PROBE_STEP = 8 // first attempt; the rest is calculated from its cost per frame

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

    // Encoding a long animation at high effort is slow, so rather than trying every
    // frame rate in turn, probe once, measure the cost per frame, and calculate the
    // step needed to hit the budget. Usually two encodes instead of eight.
    let result = await encodeAnimated(srcPath, meta, PROBE_STEP, ANIM_WIDTH, outPath)
    result.step = PROBE_STEP

    if (result.bytes > ANIM_BUDGET_BYTES) {
      const bytesPerFrame = result.bytes / result.frames
      const affordableFrames = Math.max(2, Math.floor(ANIM_BUDGET_BYTES / bytesPerFrame))
      let step = Math.max(PROBE_STEP + 1, Math.ceil(meta.pages / affordableFrames))

      for (let attempt = 0; attempt < 3 && step <= meta.pages; attempt++) {
        result = await encodeAnimated(srcPath, meta, step, ANIM_WIDTH, outPath)
        result.step = step
        if (result.bytes <= ANIM_BUDGET_BYTES) break
        step = Math.ceil(step * 1.5)
      }
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
        `  ! ${file}: ${mb(result.bytes)} MB at 1 frame in ${result.step} — over the ` +
          `${mb(ANIM_BUDGET_BYTES)} MB budget. Consider a shorter clip, or an MP4 hero.`,
      )
    }
  }

  return entry
}

/**
 * Reuses the previous manifest entry when the source hasn't changed since the
 * derivatives were written. Encoding an animated WebP searches several frame rates at
 * high effort, which takes minutes — far too slow to repeat on every build.
 */
async function cached(file, previous) {
  const entry = previous?.[file]
  if (!entry) return null

  const srcStat = await fs.stat(path.join(IMG_DIR, file)).catch(() => null)
  if (!srcStat) return null

  const outputs = [
    ...Object.values(entry.still ?? {}).flatMap((list) => list.map((d) => d.src)),
    ...(entry.anim ? [entry.anim.src] : []),
  ].map((src) => path.join(OUT_DIR, path.basename(src)))

  for (const out of outputs) {
    const stat = await fs.stat(out).catch(() => null)
    if (!stat || stat.mtimeMs < srcStat.mtimeMs) return null
  }
  return outputs.length ? entry : null
}

const previous = await fs
  .readFile(MANIFEST, "utf8")
  .then(JSON.parse)
  .catch(() => ({}))

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
    const reused = await cached(file, previous)
    const entry = (manifest[file] = reused ?? (await generate(file)))
    if (reused) {
      console.log(`  ${file}  unchanged, reusing derivatives`)
      continue
    }
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
