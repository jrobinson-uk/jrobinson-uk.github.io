import { i18n } from "../i18n"
import { FullSlug, getFileExtension, joinSegments, pathToRoot } from "../util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../util/resources"
import { googleFontHref, googleFontSubsetHref } from "../util/theme"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { unescapeHTML } from "../util/escape"
import { CustomOgImagesEmitterName } from "../plugins/emitters/ogImage"
import { lookup } from "../imageManifest"
import { Hero } from "./ProjectTile"
export default (() => {
  const Head: QuartzComponent = ({
    cfg,
    fileData,
    externalResources,
    ctx,
  }: QuartzComponentProps) => {
    const titleSuffix = cfg.pageTitleSuffix ?? ""
    const title =
      (fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) + titleSuffix
    // Every entry already carries a hand-written one-line `summary`, which is exactly
    // what a share card wants. Without this, Quartz falls through to its own extract of
    // the body — which begins at the first heading, so a link pasted into Slack read
    // "The question Could the Build HAT support a project where...".
    const description =
      fileData.frontmatter?.socialDescription ??
      fileData.frontmatter?.description ??
      (typeof fileData.frontmatter?.summary === "string"
        ? fileData.frontmatter.summary
        : undefined) ??
      unescapeHTML(fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description)

    const { css, js, additionalHead } = externalResources

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)
    const iconPath = joinSegments(baseDir, "static/icon.png")

    // Url of current page
    const socialUrl =
      fileData.slug === "404" ? url.toString() : joinSegments(url.toString(), fileData.slug!)

    const usesCustomOgImage = ctx.cfg.plugins.emitters.some(
      (e) => e.name === CustomOgImagesEmitterName,
    )
    const ogImageDefaultPath = `https://${cfg.baseUrl}/static/og-image.png`

    // Prefer the entry's own hero photograph over the site-wide card. On a site whose
    // job is to show artefacts, sharing the same generic image for every project throws
    // away the strongest thing each page has. 1200px is the widest derivative that
    // still sits inside the 5MB most platforms will fetch.
    // A hero is chosen to sit at the top of a page; a share card is cropped to roughly
    // 1.91:1 by every platform that renders one. Those wants differ, so `ogImage` lets
    // an entry nominate a landscape image for sharing without changing the page.
    const hero = fileData.frontmatter?.hero as Hero | undefined
    const ogImageOverride =
      typeof fileData.frontmatter?.ogImage === "string" ? fileData.frontmatter.ogImage : undefined
    const heroEntry = lookup(ogImageOverride ?? hero?.src)
    const heroDerivative =
      heroEntry?.still.jpeg?.slice().reverse().find((d) => d.w <= 1200) ??
      heroEntry?.still.jpeg?.[heroEntry.still.jpeg.length - 1]
    const ogImagePath = heroDerivative
      ? `https://${cfg.baseUrl}${heroDerivative.src}`
      : ogImageDefaultPath
    const ogImageAlt =
      heroDerivative && !ogImageOverride && hero?.alt ? hero.alt : description

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="stylesheet" href={googleFontHref(cfg.theme)} />
            {cfg.theme.typography.title && (
              <link rel="stylesheet" href={googleFontSubsetHref(cfg.theme, cfg.pageTitle)} />
            )}
          </>
        )}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta name="og:site_name" content={cfg.pageTitle}></meta>
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:image:alt" content={ogImageAlt} />

        {!usesCustomOgImage && (
          <>
            <meta property="og:image" content={ogImagePath} />
            <meta property="og:image:url" content={ogImagePath} />
            <meta name="twitter:image" content={ogImagePath} />
            <meta
              property="og:image:type"
              content={`image/${getFileExtension(ogImagePath) ?? "png"}`}
            />
            {heroDerivative && (
              <>
                <meta property="og:image:width" content={String(heroDerivative.w)} />
                {heroEntry?.width && heroEntry?.height && (
                  <meta
                    property="og:image:height"
                    content={String(
                      Math.round((heroDerivative.w * heroEntry.height) / heroEntry.width),
                    )}
                  />
                )}
              </>
            )}
          </>
        )}

        {cfg.baseUrl && (
          <>
            <meta property="twitter:domain" content={cfg.baseUrl}></meta>
            <meta property="og:url" content={socialUrl}></meta>
            <meta property="twitter:url" content={socialUrl}></meta>
          </>
        )}

        <link rel="icon" href={iconPath} />
        <meta name="description" content={description} />
        <meta name="generator" content="Quartz" />

        {css.map((resource) => CSSResourceToStyleElement(resource, true))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((resource) => {
          if (typeof resource === "function") {
            return resource(fileData)
          } else {
            return resource
          }
        })}
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor
