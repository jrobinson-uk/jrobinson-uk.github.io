import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { projectsIn } from "../../portfolio"
import { ProjectTile, tileStyles } from "../ProjectTile"

/**
 * The body of a category index page: whatever the folder's own index.md says,
 * followed by a tile for every project in that category.
 *
 * This replaces Quartz's FolderContent, which lists pages as text with dates and
 * word counts. On this site a project is its photograph first, so the listing is
 * tiles.
 */
const CategoryPage: QuartzComponent = ({ fileData, tree, allFiles }: QuartzComponentProps) => {
  const category = (fileData.slug ?? "").split("/")[0]
  const projects = projectsIn(allFiles, category)
  const intro = htmlToJsx(fileData.filePath!, tree as Root)
  const hasIntro = (fileData.text ?? "").trim().length > 0

  return (
    <div class="category-page">
      {hasIntro && <div class="category-intro">{intro}</div>}
      {projects.length > 0 ? (
        <ul class="tiles">
          {projects.map((page) => (
            <ProjectTile key={page.slug} page={page} currentSlug={fileData.slug!} />
          ))}
        </ul>
      ) : (
        <p class="category-empty">Nothing logged here yet.</p>
      )}
    </div>
  )
}

CategoryPage.css = `
${tileStyles}

.category-intro { max-width: 34rem; margin-bottom: 2.25rem; }
.category-empty { color: var(--gray); }
`

export default (() => CategoryPage) satisfies QuartzComponentConstructor
