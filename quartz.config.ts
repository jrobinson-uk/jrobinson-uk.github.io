import { QuartzConfig } from "./quartz/cfg"
import { RequireAltText } from "./quartz/plugins/transformers/requireAltText"
import { ResponsiveImages } from "./quartz/plugins/transformers/responsiveImages"
import { StripReviewHighlights } from "./quartz/plugins/transformers/stripReviewHighlights"
import * as Plugin from "./quartz/plugins"
import * as Component from "./quartz/components"

/**
 * Quartz 4 configuration for jamesrobinson's portfolio.
 *
 * Deliberately stripped back: no search index, no graph, no
 * popovers, no downloaded fonts. The design direction is that the artefact
 * photographs are the only visual interest, so the site's own furniture stays
 * close to invisible.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "James Robinson",
    pageTitleSuffix: "",
    // No client-side routing: it buys nothing on a nine-page site and costs JS.
    enableSPA: false,
    enablePopovers: false,
    // GoatCounter: cookieless, aggregate only, no cross-site tracking, so no consent
    // banner. Quartz injects a deferred script from gc.zgo.at and counts again on
    // in-page navigation, which matters because this site does client-side routing.
    analytics: { provider: "goatcounter", websiteId: "legojames" },
    locale: "en-GB",
    baseUrl: "jrobinson-uk.github.io",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      // System fonts only — no third-party font downloads.
      fontOrigin: "local",
      cdnCaching: false,
      typography: {
        header: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
        body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
        code: "ui-monospace, SFMono-Regular, Menlo, monospace",
      },
      colors: {
        lightMode: {
          light: "#ffffff",
          lightgray: "#e2e2e2",
          gray: "#6b6b6b",
          darkgray: "#4a4a4a",
          dark: "#1a1a1a",
          secondary: "#1a5c7a",
          tertiary: "#12455c",
          highlight: "rgba(26, 92, 122, 0.08)",
          textHighlight: "rgba(26, 92, 122, 0.18)",
        },
        darkMode: {
          light: "#1a1a1a",
          lightgray: "#2c2c2c",
          gray: "#8f8f8f",
          darkgray: "#d4d4d4",
          dark: "#f4f4f2",
          secondary: "#7fc4dd",
          tertiary: "#a8d8ea",
          highlight: "rgba(127, 196, 221, 0.10)",
          textHighlight: "rgba(127, 196, 221, 0.22)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({ priority: ["frontmatter", "git", "filesystem"] }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      // Fails the build on any image without meaningful alt text.
      // Must run before ResponsiveImages: that turns animated images into <video>
      // elements, and this only inspects <img>.
      RequireAltText(),
      // Rewrites body images to responsive <picture> using the generated derivatives.
      ResponsiveImages(),
      // Editing marks: ==highlighted== prose is visible in Obsidian, never published.
      StripReviewHighlights(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      // Category index pages. Quartz routes */index through FolderPage, not
      // ContentPage, so the category listings are configured here.
      Plugin.FolderPage({ pageBody: Component.CategoryPage() }),
      // Topical tag pages, listed as tiles rather than Quartz's dated text list.
      Plugin.TagPage({ pageBody: Component.TagEntries() }),
      Plugin.ContentIndex({ enableSiteMap: true, enableRSS: false }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
