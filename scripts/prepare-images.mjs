#!/usr/bin/env node
/**
 * Generates responsive derivatives for hero and tile images, plus a manifest the
 * components read to set width/height (so nothing shifts as the page loads).
 *
 * Quartz has no image pipeline of its own, so this runs before `quartz build`.
 * Output goes to content/assets/derived/, which Quartz's Assets emitter then
 * copies into public/ like any other content asset.
 *
 * Animated GIFs get three things: an H.264 MP4, an animated WebP, and a still first
 * frame.
 *
 * The MP4 is the good one. Inter-frame video compression is built for exactly this
 * job, so it carries every frame of the source at a fraction of the size — the LEGO
 * face loop is 160 frames in 167 KB, against 20 frames in 499 KB as WebP. It is
 * emitted with no `autoplay`, which makes reduced motion correct by construction:
 * nothing moves, and nothing is even downloaded, until the visitor presses play.
 *
 * The animated WebP is kept as the fallback for when ffmpeg isn't installed, and for
 * tile previews, where a video element would be the wrong furniture. It is encoded to
 * a byte budget by dropping frames rather than by destroying quality: a 160-frame GIF
 * at usable quality is several megabytes, and most of that is frames nobody perceives
 * individually. Frame delays are scaled to match so it still runs at the right speed.
 */
import fs from "node:fs/promises"
import path from "node:path"
import { execFile } from "node:child_process"
import { promisify } from "node:util"
import sharp from "sharp"

const run = promisify(execFile)

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

// CRF 26 was chosen by comparing crops at 3× zoom against CRF 20 and 23: at the
// resolutions these clips actually are, the three are indistinguishable, and 26 is a
// third of the size. Raise it for smaller files, lower it for better quality.
const VIDEO_CRF = 26
const VIDEO_MAX_WIDTH = 960 // body images render at ~740px; 960 covers a retina screen

const exists = async (p) => !!(await fs.stat(p).catch(() => null))
const mb = (b) => (b / 1024 / 1024).toFixed(2)

async function listSources() {
  if (!(await exists(IMG_DIR))) return []
  const entries = await fs.readdir(IMG_DIR)
  return entries.filter((f) => /\.(jpe?g|png|gif|webp|avif)$/i.test(f)).sort()
}

/**
 * Is ffmpeg on this machine? Cached, because the answer can't change mid-build.
 *
 * A missing ffmpeg is not an error. The build falls back to the animated WebP, which
 * is worse but works, so someone can clone this repo and build it without installing
 * anything beyond npm.
 */
let ffmpegAvailable
async function hasFfmpeg() {
  if (ffmpegAvailable === undefined) {
    ffmpegAvailable = await run("ffmpeg", ["-version"]).then(
      () => true,
      () => false,
    )
  }
  return ffmpegAvailable
}

/**
 * Encodes an animated source to H.264, keeping every frame.
 *
 * yuv420p and the even-dimension scale are both compatibility requirements: H.264
 * chroma subsampling needs even width and height, and a GIF's palette can decode to a
 * pixel format no browser will play. `+faststart` moves the index to the front so the
 * file can begin playing before it has fully downloaded.
 */
async function encodeVideo(srcPath, outPath) {
  await run("ffmpeg", [
    "-y",
    "-v", "error",
    "-i", srcPath,
    // Cap the width, never upscale, and round both axes down to even numbers.
    "-vf", `scale='trunc(min(iw,${VIDEO_MAX_WIDTH})/2)*2:-2'`,
    "-c:v", "libx264",
    "-crf", String(VIDEO_CRF),
    "-preset", "slow",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    "-an", // a screen recording of a robot face has nothing to say
    outPath,
  ])
  const [stat, meta] = await Promise.all([fs.stat(outPath), sharp(srcPath).metadata()])
  const width = Math.floor(Math.min(meta.width ?? VIDEO_MAX_WIDTH, VIDEO_MAX_WIDTH) / 2) * 2
  return { bytes: stat.size, width }
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
    video: null,
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
    if (await hasFfmpeg()) {
      const videoName = `${stem}-anim.mp4`
      const videoPath = path.join(OUT_DIR, videoName)
      const video = await encodeVideo(srcPath, videoPath)
      entry.video = {
        src: `/assets/derived/${videoName}`,
        w: video.width,
        frames: meta.pages,
        bytes: video.bytes,
      }
      // The animated WebP exists only as the fallback for a machine without ffmpeg.
      // With a video in hand it would be several hundred unreferenced kilobytes in
      // the deploy artefact, and it is the slowest thing in this script to encode.
      return entry
    }

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

  // Installing ffmpeg after an earlier build should produce the video, not be ignored
  // because the source hasn't changed since.
  if (entry.animated && !entry.video && (await hasFfmpeg())) return null

  const outputs = [
    ...Object.values(entry.still ?? {}).flatMap((list) => list.map((d) => d.src)),
    ...(entry.anim ? [entry.anim.src] : []),
    ...(entry.video ? [entry.video.src] : []),
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
    const note = entry.animated
      ? [
          entry.video
            ? `video: ${entry.video.frames} frames, ${mb(entry.video.bytes)} MB MP4`
            : "video: skipped, ffmpeg not installed",
          entry.anim &&
            `webp: ${entry.anim.frames}/${entry.anim.sourceFrames} frames, ${mb(entry.anim.bytes)} MB`,
        ]
          .filter(Boolean)
          .join("  ")
      : "still only"
    console.log(`  ${file}  ${entry.width}×${entry.height}  ${note}`)
  } catch (err) {
    console.error(`  ${file}  FAILED: ${err.message}`)
    process.exitCode = 1
  }
}

await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n")
console.log(`prepare-images: ${sources.length} source image(s) → ${OUT_DIR}`)
