import fs from "fs"
import path from "path"

export type Derivative = { w: number; src: string }
export type ManifestEntry = {
  width: number | null
  height: number | null
  animated: boolean
  still: Record<string, Derivative[]>
  anim: { src: string; w: number; frames: number; sourceFrames: number; bytes: number } | null
  /** Present only for animated sources, and only when ffmpeg was available. */
  video: { src: string; w: number; frames: number; bytes: number } | null
}

/**
 * Written by scripts/prepare-images.mjs before the build, and read once here so both
 * the tile components and the body-image transformer work from the same data.
 *
 * An empty manifest is a normal state — it just means no photographs exist yet.
 */
const MANIFEST_PATH = path.join(process.cwd(), "content/assets/derived/manifest.json")

let manifest: Record<string, ManifestEntry> = {}
try {
  manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"))
} catch {
  manifest = {}
}

export { manifest }

/** Looks an image up by filename, ignoring whatever relative path prefix it carries. */
export function lookup(src: string | undefined): ManifestEntry | undefined {
  if (!src) return undefined
  const basename = decodeURIComponent(src).split("/").pop()
  return basename ? manifest[basename] : undefined
}

export const srcsetOf = (list: Derivative[] | undefined) =>
  list && list.length ? list.map((d) => `${d.src} ${d.w}w`).join(", ") : undefined
