import { QuartzPluginData } from "./plugins/vfile"

/**
 * The categories a project can be logged under. A category is a folder in
 * `content/`, so adding one means creating the folder and adding a line here.
 * Order controls the order sections appear on /work and in the nav.
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

/** The category folder a page sits in, or undefined if it isn't in one. */
export function categoryOf(page: QuartzPluginData): string | undefined {
  const segments = (page.slug ?? "").split("/")
  if (segments.length < 2) return undefined
  return CATEGORY_SLUGS.includes(segments[0]) ? segments[0] : undefined
}

/** A project is any page inside a category folder that isn't the folder's index. */
export function isProject(page: QuartzPluginData): boolean {
  const segments = (page.slug ?? "").split("/")
  return categoryOf(page) !== undefined && segments[segments.length - 1] !== "index"
}

function orderOf(page: QuartzPluginData): number {
  const order = page.frontmatter?.order
  return typeof order === "number" ? order : Number.MAX_SAFE_INTEGER
}

const byOrderThenTitle = (a: QuartzPluginData, b: QuartzPluginData) =>
  orderOf(a) - orderOf(b) ||
  String(a.frontmatter?.title ?? "").localeCompare(String(b.frontmatter?.title ?? ""))

export function allProjects(allFiles: QuartzPluginData[]): QuartzPluginData[] {
  return allFiles.filter(isProject).sort(byOrderThenTitle)
}

export function projectsIn(allFiles: QuartzPluginData[], category: string): QuartzPluginData[] {
  return allProjects(allFiles).filter((p) => categoryOf(p) === category)
}

/**
 * Projects flagged `featured: true` in front matter. This is the mechanism for
 * choosing what appears on the landing page — flip the flag to change the shop
 * window without moving or rewriting anything.
 */
export function featuredProjects(allFiles: QuartzPluginData[]): QuartzPluginData[] {
  return allProjects(allFiles).filter((p) => p.frontmatter?.featured === true)
}

/** Categories that currently contain at least one project. */
export function populatedCategories(allFiles: QuartzPluginData[]) {
  return CATEGORIES.filter((c) => projectsIn(allFiles, c.slug).length > 0)
}
