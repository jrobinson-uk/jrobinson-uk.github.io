import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { curatedEntries, populatedCategories, tagIndex } from "../portfolio"
import { ProjectTile, tileStyles } from "./ProjectTile"
import { resolveRelative, FullSlug } from "../util/path"

/**
 * The archive: every entry once, making first, with the categories offered as links
 * above it.
 *
 * Entries can belong to more than one category, so grouping this page by category
 * would list the same entry several times. One flat list ordered by
 * `curatedEntries` avoids that, while still leading with the making — see the note
 * there for why date order is the wrong order here.
 *
 * The category links deliberately carry no counts. They were a tally of how much of
 * the site is not making, which is the first thing a reader saw.
 */
const WorkIndex: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
  const entries = curatedEntries(allFiles)
  if (entries.length === 0) return null

  const categories = populatedCategories(allFiles)
  const tags = tagIndex(allFiles)

  return (
    <div class="work-index">
      {categories.length > 0 && (
        <nav class="category-filters" aria-label="Categories">
          <ul>
            {categories.map((category) => (
              <li key={category.slug}>
                <a href={resolveRelative(fileData.slug!, `${category.slug}/index` as FullSlug)}>
                  {category.label}
                </a>
              </li>
            ))}
            {tags.length > 0 && (
              <li key="all-topics">
                <a href={resolveRelative(fileData.slug!, "tags/index" as FullSlug)}>All topics</a>
              </li>
            )}
          </ul>
        </nav>
      )}

      <ul class="tiles">
        {entries.map((page) => (
          <ProjectTile key={page.slug} page={page} currentSlug={fileData.slug!} />
        ))}
      </ul>
    </div>
  )
}

WorkIndex.css = `
${tileStyles}

.category-filters {
  margin: 0 0 2.25rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid var(--lightgray);
}
.category-filters ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
.filter-count { color: var(--gray); font-size: 0.875rem; }
`

export default (() => WorkIndex) satisfies QuartzComponentConstructor
