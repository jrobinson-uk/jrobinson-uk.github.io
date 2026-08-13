import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

/**
 * Layout for the portfolio.
 *
 * The left and right rails are deliberately empty. Quartz's defaults put an
 * explorer, search, graph, table of contents and backlinks around every page; on a
 * site whose job is to show artefact photographs, all of that competes with the
 * photographs. Navigation is two links in the header, and categories are reachable
 * from /work.
 */
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [Component.PortfolioNav()],
  // Three page-specific lists, each rendered only where it belongs. Keeping them in
  // afterBody means they appear under whatever copy the Markdown file carries.
  afterBody: [
    Component.ConditionalRender({
      component: Component.FeaturedProjects(),
      condition: (props) => props.fileData.slug === "index",
    }),
    Component.ConditionalRender({
      component: Component.WorkIndex(),
      condition: (props) => props.fileData.slug === "work",
    }),
  ],
  footer: Component.PortfolioFooter(),
}

// A single project page: title, then the writing. Nothing else.
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
    // Summary and hero image, on project pages only.
    Component.ConditionalRender({
      component: Component.ProjectHero(),
      condition: (props) => (props.fileData.slug ?? "").includes("/"),
    }),
  ],
  left: [],
  right: [],
}

// Category index pages get their tile list appended after the page's own copy.
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.ArticleTitle()],
  left: [],
  right: [],
}
