#!/usr/bin/env node
/**
 * Composes an iteration line-up: several photographs of the same object at different
 * stages, laid out as one image so the whole arc reads at a glance.
 *
 * This exists because the sequence *is* the argument. The individual photographs are
 * already in the entry at full size for detail; what they can't show, one at a time, is
 * that the thing went through seven versions.
 *
 * Panels are padded to a square rather than cropped — the sources are a mix of
 * landscape and portrait, and cropping a portrait to landscape would cut the object out
 * of its own photograph. Numbered so the order is unambiguous.
 *
 * Run it by hand when the source photographs change:
 *   node scripts/compose-lineup.mjs
 */
import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const IMG_DIR = "content/assets/img"
// Centre-crop rather than pad. Tried both: padding left every panel a different
// visual weight and shrank the objects, and cropping loses nothing here because the
// artefact is centred in all seven photographs. It also gained legibility — "V2 dead"
// written across the failed print is only readable in the cropped version.
const FIT = process.env.FIT ?? "cover"

// The NOT gate, in the order the entry describes: a diagram on a sticky note, bare wires
// on the carpet, copper tape on paper, the print whose transistor blew, the template that
// replaced it, that template refined, and the finished gate.
const LINEUP = {
  out: "not-gate-lineup.jpg",
  columns: 4,
  panel: 620,
  gap: 16,
  labelled: true,
  frames: [
    "not-gate-00-diagram.jpg",
    "not-gate-01-bare-wires.jpg",
    "not-gate-02-paper.jpg",
    "not-gate-v2-dead.jpg",
    "not-gate-03-template.jpg",
    "not-gate-04-final-print.jpg",
    "not-gate-final.jpg",
  ],
}

/** A numeral rendered as SVG, so no font files or canvas dependency are needed. */
function numeral(n, size) {
  const d = Math.round(size * 0.115)
  return Buffer.from(
    `<svg width="${d * 2}" height="${d * 2}" xmlns="http://www.w3.org/2000/svg">
       <circle cx="${d}" cy="${d}" r="${d - 1}" fill="#ffffff" fill-opacity="0.92"/>
       <text x="${d}" y="${d}" font-family="Helvetica,Arial,sans-serif"
             font-size="${Math.round(d * 1.15)}" font-weight="600" fill="#1a1a1a"
             text-anchor="middle" dominant-baseline="central">${n}</text>
     </svg>`,
  )
}

async function compose(spec) {
  const { columns, panel, gap, frames } = spec
  const rows = Math.ceil(frames.length / columns)
  const width = columns * panel + (columns - 1) * gap
  const height = rows * panel + (rows - 1) * gap

  const layers = []
  for (const [i, file] of frames.entries()) {
    const src = path.join(IMG_DIR, file)
    if (!(await fs.stat(src).catch(() => null))) {
      throw new Error(`${file} is missing — the line-up would silently lose a stage`)
    }
    const tile = await sharp(src)
      .resize(panel, panel, { fit: FIT, background: "#ffffff" })
      .toBuffer()
    const col = i % columns
    const row = Math.floor(i / columns)
    // Centre a short final row, so the empty slot reads as layout rather than as a
    // missing photograph.
    const inRow = Math.min(columns, frames.length - row * columns)
    const rowWidth = inRow * panel + (inRow - 1) * gap
    const left = Math.round((width - rowWidth) / 2) + col * (panel + gap)
    const top = row * (panel + gap)
    layers.push({ input: tile, left, top })
    if (spec.labelled) {
      const badge = numeral(i + 1, panel)
      const inset = Math.round(panel * 0.035)
      layers.push({ input: badge, left: left + inset, top: top + inset })
    }
  }

  const outPath = path.join(IMG_DIR, spec.out)
  await sharp({
    create: { width, height, channels: 3, background: "#ffffff" },
  })
    .composite(layers)
    .jpeg({ quality: 88, chromaSubsampling: "4:4:4" })
    .toFile(outPath)

  const { size } = await fs.stat(outPath)
  console.log(
    `  ${spec.out}  ${width}×${height}  ${frames.length} panels in ${columns}×${rows}  ` +
      `${(size / 1024).toFixed(0)} KB`,
  )
}

await compose(LINEUP)
