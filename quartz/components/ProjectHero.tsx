import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { PreviewImage, heroOf, summaryOf } from "./ProjectTile"
import { categoriesOf, tagsOf, labelFor } from "../portfolio"
import { FullSlug, resolveRelative } from "../util/path"

/**
 * The summary and hero image at the top of a project page.
 *
 * The site plan is explicit that every entry leads with an image of a physical or
 * working thing, with text supporting the image rather than the reverse. Loaded eagerly
 * because it is the largest thing above the fold.
 *
 * Entries with no photograph render no hero block at all rather than a placeholder —
 * "photograph still to be taken" would be a lie for software or a degree.
 */
const ProjectHero: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const hero = heroOf(fileData)
  const summary = summaryOf(fileData)
  const year = fileData.frontmatter?.year
  const tools = fileData.frontmatter?.tools
  const toolList = Array.isArray(tools) ? tools.filter((t) => typeof t === "string") : []
  const categories = categoriesOf(fileData)
  const tags = tagsOf(fileData)
  const hasMeta = year !== undefined || toolList.length > 0

  if (!summary && !hero.src && !hasMeta && categories.length === 0 && tags.length === 0) return null

  return (
    <div class="project-hero">
      {summary && <p class="project-summary">{summary}</p>}
      {(hasMeta || categories.length > 0 || tags.length > 0) && (
        <dl class="project-meta">
          {year !== undefined && (
            <>
              <dt>Year</dt>
              <dd>{String(year)}</dd>
            </>
          )}
          {categories.length > 0 && (
            <>
              <dt>In</dt>
              <dd>
                {categories.map((slug, i) => (
                  <>
                    {i > 0 && ", "}
                    <a href={resolveRelative(fileData.slug!, `${slug}/index` as FullSlug)}>
                      {labelFor(slug)}
                    </a>
                  </>
                ))}
              </dd>
            </>
          )}
          {toolList.length > 0 && (
            <>
              <dt>Tools</dt>
              <dd>{toolList.join(", ")}</dd>
            </>
          )}
          {tags.length > 0 && (
            <>
              <dt>Topics</dt>
              <dd>
                {tags.map((tag, i) => (
                  <>
                    {i > 0 && ", "}
                    <a href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}>{tag}</a>
                  </>
                ))}
              </dd>
            </>
          )}
        </dl>
      )}
      {hero.src && (
        <div class="project-hero-media">
          <PreviewImage hero={hero} sizes="(min-width: 48rem) 46rem, 100vw" eager />
          {hero.credit && (
            <p class="project-hero-credit">
              {hero.creditUrl ? <a href={hero.creditUrl}>{hero.credit}</a> : hero.credit}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

ProjectHero.css = `
.project-summary {
  max-width: var(--measure);
  color: var(--darkgray);
  font-size: 1.1875rem;
}
.project-meta {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.2rem 1rem;
  max-width: var(--measure);
  margin: 0;
  font-size: 0.9375rem;
}
.project-meta dt { color: var(--gray); }
.project-meta dd { margin: 0; }

.project-hero-media {
  margin: 1.5rem 0 2.625rem;
  /* Shares the reading column, so the hero's edges line up with the prose below it. */
  max-width: var(--measure);
}
/* Squared to match the tiles, so an entry's hero has the same shape wherever it appears.
   See the note in ProjectTile for why this is CSS rather than a new derivative. */
/* Same centred-fit box as the tiles — see the note in ProjectTile for why the image is
   positioned out of flow rather than laid out inside the square. */
.project-hero-media picture {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 1;
}
.project-hero-media img {
  position: absolute;
  inset: 0;
  margin: auto;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
.project-hero-media video {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
}
.project-hero-credit {
  margin: 0.5rem 0 0;
  color: var(--gray);
  font-size: 0.8125rem;
}
`

export default (() => ProjectHero) satisfies QuartzComponentConstructor
