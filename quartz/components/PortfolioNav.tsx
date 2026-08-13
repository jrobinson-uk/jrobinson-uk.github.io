import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative, pathToRoot } from "../util/path"

const LINKS: { slug: FullSlug; label: string }[] = [
  { slug: "work" as FullSlug, label: "Work" },
  { slug: "about" as FullSlug, label: "About" },
]

/**
 * The whole of the site's navigation: name on the left, two links on the right.
 * Categories are reachable from /work rather than the header — five category links
 * plus Work and About is more furniture than a nine-page site can justify.
 */
const PortfolioNav: QuartzComponent = ({ fileData, cfg }: QuartzComponentProps) => {
  const current = fileData.slug!
  return (
    <div class="portfolio-nav">
      <p class="site-name">
        <a href={pathToRoot(current)}>{cfg.pageTitle}</a>
      </p>
      <nav aria-label="Main">
        <ul>
          {LINKS.map(({ slug, label }) => {
            const isCurrent = current === slug
            return (
              <li key={slug}>
                <a
                  href={resolveRelative(current, slug)}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

PortfolioNav.css = `
.portfolio-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  align-items: baseline;
  justify-content: space-between;
  padding: 1.75rem 0 2.5rem;
}
.portfolio-nav .site-name { margin: 0; font-weight: 600; }
.portfolio-nav .site-name a { color: var(--dark); text-decoration: none; }
.portfolio-nav nav ul {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
.portfolio-nav [aria-current="page"] { color: var(--dark); text-decoration: none; }
`

export default (() => PortfolioNav) satisfies QuartzComponentConstructor
