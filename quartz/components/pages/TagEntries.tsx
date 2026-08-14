import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { entriesTagged, tagIndex } from "../../portfolio"
import { ProjectTile, tileStyles } from "../ProjectTile"
import { FullSlug, resolveRelative } from "../../util/path"

/**
 * Body for `/tags/<tag>` pages, and for the `/tags` index.
 *
 * Replaces Quartz's TagContent, which lists pages as dated text. Tags here are
 * topical labels — raspberry-pi, copper-tape, machine-learning — and are separate
 * from the five categories that drive navigation.
 */
const TagEntries: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  const slug = fileData.slug ?? ""
  const isIndex = slug === "tags" || slug === "tags/index"

  if (isIndex) {
    const tags = tagIndex(allFiles)
    if (tags.length === 0) return <p class="category-empty">No topics yet.</p>
    return (
      <ul class="tag-index">
        {tags.map(({ tag, count }) => (
          <li key={tag}>
            <a href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}>{tag}</a>{" "}
            <span class="tag-count">{count}</span>
          </li>
        ))}
      </ul>
    )
  }

  const tag = slug.replace(/^tags\//, "")
  const entries = entriesTagged(allFiles, tag)
  if (entries.length === 0) return <p class="category-empty">Nothing tagged with this yet.</p>

  return (
    <ul class="tiles">
      {entries.map((page) => (
        <ProjectTile key={page.slug} page={page} currentSlug={fileData.slug!} />
      ))}
    </ul>
  )
}

TagEntries.css = `
${tileStyles}

.tag-index {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  padding: 0;
  list-style: none;
}
.tag-count { color: var(--gray); font-size: 0.875rem; }
.category-empty { color: var(--gray); }
`

export default (() => TagEntries) satisfies QuartzComponentConstructor
