import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

type Link = { label?: string; url?: string }

/**
 * The "Links" block at the foot of a project page — published project, repository,
 * model, whatever exists.
 *
 * Entries without a `url` are skipped, and the whole block disappears when none
 * survive, so a project can carry placeholder labels without rendering an empty
 * heading.
 */
const ProjectLinks: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const raw = fileData.frontmatter?.links
  const links: Link[] = Array.isArray(raw) ? raw : []
  const live = links.filter(
    (l): l is Link & { url: string } => typeof l?.url === "string" && l.url.trim().length > 0,
  )
  if (live.length === 0) return null

  return (
    <section class="project-links">
      <h2>Links</h2>
      <ul>
        {live.map((link) => (
          <li key={link.url}>
            <a href={link.url}>{link.label || link.url}</a>
          </li>
        ))}
      </ul>
    </section>
  )
}

ProjectLinks.css = `
.project-links {
  max-width: 34rem;
  margin-top: 2.625rem;
}
.project-links h2 {
  margin-top: 0;
  color: var(--darkgray);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.project-links ul { margin: 0; padding: 0; list-style: none; }
.project-links li { margin-bottom: 0.35rem; }
`

export default (() => ProjectLinks) satisfies QuartzComponentConstructor
