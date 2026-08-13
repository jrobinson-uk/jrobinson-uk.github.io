import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { PreviewImage, heroOf, summaryOf } from "./ProjectTile"

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
  if (!summary && !hero.src) return null

  return (
    <div class="project-hero">
      {summary && <p class="project-summary">{summary}</p>}
      {hero.src && (
        <div class="project-hero-media">
          <PreviewImage hero={hero} sizes="(min-width: 60rem) 58rem, 100vw" eager />
        </div>
      )}
    </div>
  )
}

ProjectHero.css = `
.project-summary {
  max-width: 34rem;
  color: var(--darkgray);
  font-size: 1.1875rem;
}
.project-hero-media {
  margin: 1.5rem 0 2.625rem;
  max-width: 58rem;
}
.project-hero-media picture { display: block; }
.project-hero-media img { display: block; width: 100%; max-width: 100%; height: auto; }
`

export default (() => ProjectHero) satisfies QuartzComponentConstructor
