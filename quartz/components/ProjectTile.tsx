import { JSX } from "preact"
import { QuartzPluginData } from "../plugins/vfile"
import { FullSlug, resolveRelative } from "../util/path"
import { lookup, srcsetOf } from "../imageManifest"

export type Hero = {
  src?: string
  alt?: string
  /**
   * Who took the photograph, when that isn't James. Most images here are of his own
   * work and need no credit; a photograph *of* him at someone else's event does.
   */
  credit?: string
  creditUrl?: string
}

export function heroOf(data: QuartzPluginData): Hero {
  return (data.frontmatter?.hero as Hero | undefined) ?? {}
}

export function summaryOf(data: QuartzPluginData): string | undefined {
  const s = data.frontmatter?.summary
  return typeof s === "string" ? s : undefined
}

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
  const entry = lookup(hero.src)
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
          srcset={srcsetOf(entry.still.webp)}
          sizes={sizes}
        />
      )}
      {entry.anim && (
        <source type="image/webp" srcset={`${entry.anim.src} ${entry.anim.w}w`} sizes={sizes} />
      )}
      {!entry.anim && (
        <source type="image/avif" srcset={srcsetOf(entry.still.avif)} sizes={sizes} />
      )}
      {!entry.anim && (
        <source type="image/webp" srcset={srcsetOf(entry.still.webp)} sizes={sizes} />
      )}
      <img
        src={fallback}
        srcset={srcsetOf(jpeg)}
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
/* Hero images are squared off rather than shown at their own aspect ratio. The sources
   are a mix of portrait and landscape, which made the grid ragged — a 637x935 print next
   to a 4608x3456 photograph left one card twice the height of its neighbour. A contain fit
   letterboxes the whole image inside a square, so nothing is cropped or stretched.

   The padding is left transparent rather than filled, so it takes the page background
   and follows the light and dark themes without being told about either. Done in CSS on
   purpose: the source files and the derivatives are untouched, and squaring is a
   presentation decision that stays reversible by editing this rule. */
.tile-media picture {
  display: block;
  aspect-ratio: 1;
}
.tile-media img {
  display: block;
  width: 100%;
  max-width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

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
