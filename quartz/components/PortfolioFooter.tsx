import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface Options {
  /** Optional external links, e.g. GitHub. Rendered only if provided. */
  links?: Record<string, string>
}

/**
 * Replaces Quartz's default footer.
 *
 * Two reasons: the stock one puts its own version number and a link at contrast
 * ratios that fail WCAG AA (3.6:1 and 3.94:1 measured), and this site's footer should
 * be the name rather than the toolchain.
 *
 * No generator credit. Quartz is MIT, which asks that the licence travel with the
 * software — not that every rendered page announce the toolchain to a reader who came
 * to look at the work. The dependency is declared in package.json and the engine
 * source is in this repo.
 */
export default ((opts?: Options) => {
  const PortfolioFooter: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
    const links = opts?.links ?? {}
    return (
      <footer>
        <p class="footer-name">{cfg.pageTitle}</p>
        {Object.keys(links).length > 0 && (
          <ul>
            {Object.entries(links).map(([text, link]) => (
              <li key={text}>
                <a href={link}>{text}</a>
              </li>
            ))}
          </ul>
        )}
      </footer>
    )
  }

  PortfolioFooter.css = `
footer {
  margin-top: 4.5rem;
  padding: 1.5rem 0 2.5rem;
  border-top: 1px solid var(--lightgray);
  font-size: 0.9375rem;
}
footer .footer-name { margin: 0 0 0.3em; color: var(--darkgray); }
footer ul {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 0.5rem 0 0;
  padding: 0;
  list-style: none;
}
`
  return PortfolioFooter
}) satisfies QuartzComponentConstructor
