import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { populatedCategories, projectsIn } from "../portfolio"
import { ProjectTile, tileStyles } from "./ProjectTile"
import { resolveRelative, FullSlug } from "../util/path"

/**
 * Every project, grouped under its category with the category heading linking to
 * that category's own page. Empty categories are omitted, so the page grows as you
 * log work rather than advertising gaps.
 */
const WorkIndex: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
  const categories = populatedCategories(allFiles)
  if (categories.length === 0) return null

  return (
    <div class="work-index">
      {categories.map((category) => {
        const projects = projectsIn(allFiles, category.slug)
        const categorySlug = `${category.slug}/index` as FullSlug
        return (
          <section key={category.slug} class="work-category">
            <h2 class="section-label">
              <a href={resolveRelative(fileData.slug!, categorySlug)}>{category.label}</a>
            </h2>
            <ul class="tiles">
              {projects.map((page) => (
                <ProjectTile key={page.slug} page={page} currentSlug={fileData.slug!} />
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

WorkIndex.css = `
${tileStyles}

.work-category { margin-bottom: 3rem; }
.work-category .section-label a { color: inherit; text-decoration: none; }
.work-category .section-label a:hover { text-decoration: underline; }
`

export default (() => WorkIndex) satisfies QuartzComponentConstructor
