import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { featuredProjects } from "../portfolio"
import { ProjectTile, tileStyles } from "./ProjectTile"

/**
 * The landing page shop window: every project with `featured: true`, in `order`.
 * Renders nothing at all if nothing is featured, rather than an empty heading.
 */
const FeaturedProjects: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
  const featured = featuredProjects(allFiles)
  if (featured.length === 0) return null

  return (
    <section class="featured">
      <h2 class="section-label">Selected work</h2>
      <ul class="tiles">
        {featured.map((page) => (
          <ProjectTile key={page.slug} page={page} currentSlug={fileData.slug!} />
        ))}
      </ul>
      <p class="more-link">
        <a href="./work">All work</a>
      </p>
    </section>
  )
}

FeaturedProjects.css = `
${tileStyles}

.featured { margin-top: 2.5rem; }
.section-label {
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--lightgray);
  color: var(--darkgray);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.more-link { margin-top: 1.5rem; }
`

export default (() => FeaturedProjects) satisfies QuartzComponentConstructor
