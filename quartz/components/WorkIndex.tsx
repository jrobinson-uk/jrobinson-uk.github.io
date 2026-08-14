import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { allEntries, populatedCategories, entriesIn, tagIndex } from "../portfolio"
import { ProjectTile, tileStyles } from "./ProjectTile"
import { resolveRelative, FullSlug } from "../util/path"

/**
 * The archive: every entry once, newest first, with the categories offered as
 * filters above it.
 *
 * Entries can belong to more than one category now, so grouping this page by
 * category would list the same entry several times. One canonical chronological
 * list plus separate category pages avoids that, and is the shape a blog takes.
 */
const WorkIndex: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
  const entries = allEntries(allFiles)
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
                </a>{" "}
                <span class="filter-count">{entriesIn(allFiles, category.slug).length}</span>
              </li>
            ))}
            {tags.length > 0 && (
              <li key="all-topics">
                <a href={resolveRelative(fileData.slug!, "tags/index" as FullSlug)}>All topics</a>{" "}
                <span class="filter-count">{tags.length}</span>
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
