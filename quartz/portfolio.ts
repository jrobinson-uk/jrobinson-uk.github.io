import { QuartzPluginData } from "./plugins/vfile"

/**
 * The controlled list of categories an entry can belong to.
 *
 * Categories are metadata, not folders: an entry declares `categories: [making,
 * publications]` in its front matter and appears under both. The folder an entry
 * lives in only decides its URL, and acts as a default if it declares no
 * categories at all.
 *
 * This list drives navigation, so it stays short. Topical labels go in `tags`,
 * which is free-form.
 */
export const CATEGORIES = [
  { slug: "making", label: "Making" },
  { slug: "research", label: "Research" },
  { slug: "teaching", label: "Teaching" },
  { slug: "writing", label: "Writing" },
  { slug: "publications", label: "Publications" },
] as const

export type CategorySlug = (typeof CATEGORIES)[number]["slug"]

const CATEGORY_SLUGS: readonly string[] = CATEGORIES.map((c) => c.slug)

export function labelFor(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug
}

/** The folder an entry sits in. Only used as a fallback and to build URLs. */
export function folderOf(page: QuartzPluginData): string | undefined {
  const segments = (page.slug ?? "").split("/")
  if (segments.length < 2) return undefined
  return CATEGORY_SLUGS.includes(segments[0]) ? segments[0] : undefined
}

/**
 * Every category an entry belongs to, from front matter. Unknown values are
 * dropped rather than silently creating a category that has no page, and an entry
 * that declares none falls back to its folder so nothing disappears.
 */
export function categoriesOf(page: QuartzPluginData): string[] {
  const declared = page.frontmatter?.categories
  const list = Array.isArray(declared) ? declared : declared ? [declared] : []
  const valid = list
    .filter((c): c is string => typeof c === "string")
    .map((c) => c.trim().toLowerCase())
    .filter((c) => CATEGORY_SLUGS.includes(c))

  if (valid.length > 0) return [...new Set(valid)]
  const folder = folderOf(page)
  return folder ? [folder] : []
}

/** Free-form topical tags, distinct from categories. */
export function tagsOf(page: QuartzPluginData): string[] {
  const tags = page.frontmatter?.tags
  if (!Array.isArray(tags)) return []
  return [...new Set(tags.filter((t): t is string => typeof t === "string"))]
}

/** An entry is any page in a category folder that isn't that folder's index. */
export function isEntry(page: QuartzPluginData): boolean {
  const segments = (page.slug ?? "").split("/")
  return folderOf(page) !== undefined && segments[segments.length - 1] !== "index"
}

function yearOf(page: QuartzPluginData): number {
  const year = page.frontmatter?.year
  if (typeof year === "number") return year
  // Handles ranges like "2022–2023" by sorting on the latest year mentioned.
  if (typeof year === "string") {
    const years = year.match(/\d{4}/g)
    if (years?.length) return Math.max(...years.map(Number))
  }
  return -Infinity // undated entries sort last
}

function orderOf(page: QuartzPluginData): number {
  const order = page.frontmatter?.order
  return typeof order === "number" ? order : Number.MAX_SAFE_INTEGER
}

/**
 * Newest first. `order` only breaks ties within the same year, so it's there if
 * you want it but nothing needs it.
 */
const byYearThenOrder = (a: QuartzPluginData, b: QuartzPluginData) =>
  yearOf(b) - yearOf(a) ||
  orderOf(a) - orderOf(b) ||
  String(a.frontmatter?.title ?? "").localeCompare(String(b.frontmatter?.title ?? ""))

export function allEntries(allFiles: QuartzPluginData[]): QuartzPluginData[] {
  return allFiles.filter(isEntry).sort(byYearThenOrder)
}

export function entriesIn(allFiles: QuartzPluginData[], category: string): QuartzPluginData[] {
  return allEntries(allFiles).filter((p) => categoriesOf(p).includes(category))
}

export function entriesTagged(allFiles: QuartzPluginData[], tag: string): QuartzPluginData[] {
  return allEntries(allFiles).filter((p) => tagsOf(p).includes(tag))
}

/**
 * Entries flagged `featured: true`. This is the mechanism for choosing what
 * appears on the landing page — flip the flag to change the shop window without
 * moving or rewriting anything.
 */
export function featuredEntries(allFiles: QuartzPluginData[]): QuartzPluginData[] {
  return allEntries(allFiles).filter((p) => p.frontmatter?.featured === true)
}

/** Categories that currently contain at least one entry. */
export function populatedCategories(allFiles: QuartzPluginData[]) {
  return CATEGORIES.filter((c) => entriesIn(allFiles, c.slug).length > 0)
}

/** Every tag in use, with counts, most-used first. */
export function tagIndex(allFiles: QuartzPluginData[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const page of allEntries(allFiles)) {
    for (const tag of tagsOf(page)) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}
