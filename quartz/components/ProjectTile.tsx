import fs from "fs"
import path from "path"
import { JSX } from "preact"
import { QuartzPluginData } from "../plugins/vfile"
import { FullSlug, resolveRelative } from "../util/path"

type Derivative = { w: number; src: string }
type ManifestEntry = {
  width: number | null
  height: number | null
  animated: boolean
  still: Record<string, Derivative[]>
  anim: { src: string; w: number; frames: number; sourceFrames: number; bytes: number } | null
}

/**
 * Written by scripts/prepare-images.mjs before the build. Read once at module load.
 * An empty manifest is a normal state — it just means no photographs exist yet.
 */
const MANIFEST_PATH = path.join(process.cwd(), "content/assets/derived/manifest.json")
let manifest: Record<string, ManifestEntry> = {}
try {
  manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"))
} catch {
  manifest = {}
}

export type Hero = { src?: string; alt?: string }

export function heroOf(data: QuartzPluginData): Hero {
  return (data.frontmatter?.hero as Hero | undefined) ?? {}
}

export function summaryOf(data: QuartzPluginData): string | undefined {
  const s = data.frontmatter?.summary
  return typeof s === "string" ? s : undefined
}

const srcset = (list: Derivative[] | undefined) =>
  list && list.length ? list.map((d) => `${d.src} ${d.w}w`).join(", ") : undefined

/**
 * The preview image for a tile.
 *
 * For an animated source this emits, in order: a still for anyone who has asked for
 * reduced motion, then the animated WebP, then a still <img> fallback. The
 * media-query <source> is the whole reason animation goes through WebP rather than
 * shipping the GIF — a GIF animates unconditionally and cannot be opted out of.
 */
export function PreviewImage({
  hero,
  sizes,
  eager = false,
}: {
  hero: Hero
  sizes: string
  eager?: boolean
}): JSX.Element {
  const entry = hero.src ? manifest[hero.src] : undefined
  const alt = hero.alt ?? ""

  if (!hero.src || !entry) {
    // Placeholder, so a project can be written before its photograph is taken.
    return (
      <div class="placeholder">
        <p class="placeholder-kicker">Image to come</p>
        <p class="placeholder-alt">{alt || "Photograph still to be taken"}</p>
      </div>
    )
  }

  const jpeg = entry.still.jpeg ?? []
  const fallback = jpeg[jpeg.length - 1]?.src ?? ""
  const loading = eager ? "eager" : "lazy"

  // Never display an image larger than it actually is. A small source shown big is
  // just blurry, and it hides the fact that a better photograph is needed.
  const cap = entry.width ? { maxWidth: `${entry.width}px` } : undefined

  return (
    <picture style={cap}>
      {entry.anim && (
        <source
          media="(prefers-reduced-motion: reduce)"
          type="image/webp"
          srcset={srcset(entry.still.webp)}
          sizes={sizes}
        />
      )}
      {entry.anim && (
        <source type="image/webp" srcset={`${entry.anim.src} ${entry.anim.w}w`} sizes={sizes} />
      )}
      {!entry.anim && <source type="image/avif" srcset={srcset(entry.still.avif)} sizes={sizes} />}
      {!entry.anim && <source type="image/webp" srcset={srcset(entry.still.webp)} sizes={sizes} />}
      <img
        src={fallback}
        srcset={srcset(jpeg)}
        sizes={sizes}
        alt={alt}
        width={entry.width ?? undefined}
        height={entry.height ?? undefined}
        loading={loading}
        decoding={eager ? "sync" : "async"}
      />
    </picture>
  )
}

/** A single project card: preview image, title, one-line summary. */
export function ProjectTile({
  page,
  currentSlug,
  sizes = "(min-width: 48rem) 22rem, 100vw",
}: {
  page: QuartzPluginData
  currentSlug: FullSlug
  sizes?: string
}): JSX.Element {
  const hero = heroOf(page)
  const summary = summaryOf(page)
  const href = resolveRelative(currentSlug, page.slug!)

  return (
    <li class="tile">
      <a class="tile-link" href={href}>
        {hero.src && (
          <div class="tile-media">
            <PreviewImage hero={hero} sizes={sizes} />
          </div>
        )}
        <div class="tile-text">
          <span class="tile-title">{page.frontmatter?.title}</span>
          {summary && <span class="tile-summary">{summary}</span>}
        </div>
      </a>
    </li>
  )
}

export const tileStyles = `
.tiles {
  display: grid;
  gap: 2.25rem;
  margin: 0 0 1.5rem;
  padding: 0;
  list-style: none;
}
.tile { display: flex; }
.tile-link {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.75rem;
  color: inherit;
  text-decoration: none;
}
.tile-text { margin-top: auto; }
.tile-title {
  display: block;
  color: var(--secondary);
  font-size: 1.1875rem;
  font-weight: 600;
}
.tile-link:hover .tile-title { text-decoration: underline; }
.tile-summary { display: block; color: var(--darkgray); }
.tile-media picture { display: block; }
.tile-media img { display: block; width: 100%; max-width: 100%; height: auto; }

.placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.4rem;
  min-height: 9rem;
  padding: 1.25rem;
  background: #f4f4f2;
  border: 1px dashed #c9c9c4;
  color: var(--darkgray);
}
.placeholder-kicker {
  margin: 0;
  color: var(--darkgray);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.placeholder-alt { margin: 0; font-size: 0.9375rem; }

@media (min-width: 48rem) {
  .tiles { grid-template-columns: repeat(2, 1fr); }
}
`
