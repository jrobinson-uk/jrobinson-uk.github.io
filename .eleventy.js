import fs from "node:fs";
import path from "node:path";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import MarkdownIt from "markdown-it";

const IMG_SOURCE_DIR = "src/assets/img";

const isProduction = process.env.ELEVENTY_ENV === "production";

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });
const esc = (value) => md.utils.escapeHtml(String(value));

// The seven-field project template from portfolio-site-plan.md, in render order.
// Adding or renaming a field is a one-line change here.
const SECTIONS = [
  { key: "question", heading: "The question" },
  { key: "made", heading: "What I made" },
  { key: "scope", heading: "What I did myself" },
  { key: "tested", heading: "How it was tested" },
  { key: "learned", heading: "What I learned" },
  { key: "outcome", heading: "Where it went" }
];

const DEFAULT_SIZES = "(min-width: 48rem) 46rem, 100vw";

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function placeholderMarkup(alt, { wide = false } = {}) {
  const label = hasText(alt) ? alt : "Photograph still to be taken";
  return (
    `<div class="placeholder${wide ? " placeholder--wide" : ""}">` +
    `<p class="placeholder__kicker">Image to come</p>` +
    `<p class="placeholder__alt">${esc(label)}</p>` +
    `</div>`
  );
}

/**
 * Emits a plain <img> for images that exist and a labelled placeholder block for
 * ones that don't. eleventyImageTransformPlugin then rewrites the <img> into a
 * responsive <picture> at the end of the build.
 *
 * Deliberately synchronous: Nunjucks `{% include %}` silently drops the output of
 * async shortcodes, and the card partial is used inside a loop in an include.
 */
function imageMarkup(src, alt, options = {}) {
  const { eager = false, sizes = DEFAULT_SIZES, className = "", wide = false, context = "" } = options;

  if (!hasText(src)) return placeholderMarkup(alt, { wide });

  // Alt text is enforced at build time rather than by a linter, so a missing alt
  // fails loudly with the filename. No decorative images are expected here.
  if (!hasText(alt)) {
    throw new Error(
      `Missing alt text for image "${src}"${context ? ` in "${context}"` : ""}. ` +
        `Every image needs meaningful alt text — see claude-code-build-brief.md.`
    );
  }

  // Expected state while assets are still being gathered — not a build failure.
  if (!fs.existsSync(path.join(IMG_SOURCE_DIR, src))) {
    return placeholderMarkup(alt, { wide });
  }

  const attrs = [
    `src="/assets/img/${esc(src)}"`,
    `alt="${esc(alt)}"`,
    `sizes="${esc(sizes)}"`,
    `loading="${eager ? "eager" : "lazy"}"`,
    `decoding="${eager ? "sync" : "async"}"`
  ];
  if (eager) attrs.push(`fetchpriority="high"`);
  if (className) attrs.push(`class="${esc(className)}"`);
  return `<img ${attrs.join(" ")}>`;
}

export default function (eleventyConfig) {
  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addGlobalData("isProduction", isProduction);

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    extensions: "html",
    formats: ["avif", "webp", "jpeg"],
    widths: [480, 800, 1200, 1600],
    defaultAttributes: { sizes: DEFAULT_SIZES }
  });

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/assets/img");
  eleventyConfig.addPassthroughCopy("src/assets/video");
  eleventyConfig.addPassthroughCopy({ "src/assets/favicon.svg": "favicon.svg" });
  eleventyConfig.addPassthroughCopy(".nojekyll");

  // CNAME only exists once a custom domain is chosen; don't fail the build before then.
  if (fs.existsSync("CNAME")) {
    eleventyConfig.addPassthroughCopy("CNAME");
  }

  eleventyConfig.addFilter("markdown", (value) => (hasText(value) ? md.render(value) : ""));
  eleventyConfig.addFilter("inlineMarkdown", (value) =>
    hasText(value) ? md.renderInline(value) : ""
  );
  eleventyConfig.addFilter("hasText", hasText);

  // Only the sections that actually have copy, in template order. Anything blank
  // or absent is dropped, so a half-written project never renders an empty heading.
  eleventyConfig.addFilter("filledSections", (sections) =>
    SECTIONS.filter((section) => hasText(sections?.[section.key])).map((section) => ({
      ...section,
      body: md.render(sections[section.key])
    }))
  );

  eleventyConfig.addFilter("withUrl", (links) => (links || []).filter((link) => hasText(link?.url)));

  // Home page cards: anything marked `featured`, topped up in `order` sequence so
  // the page still fills out while the project set is incomplete.
  eleventyConfig.addFilter("selectFeatured", (projects = [], limit = 4) => {
    const featured = projects.filter((item) => item.data.featured);
    const rest = projects.filter((item) => !item.data.featured);
    return [...featured, ...rest].slice(0, limit);
  });

  eleventyConfig.addShortcode("image", (src, alt, opts = {}) => imageMarkup(src, alt, opts));

  eleventyConfig.addShortcode("hero", (hero, title) =>
    imageMarkup((hero || {}).src, (hero || {}).alt, {
      eager: true,
      wide: true,
      sizes: "(min-width: 60rem) 58rem, 100vw",
      className: "hero__image",
      context: title
    })
  );

  /**
   * A row of two to four images sharing one caption — the iteration line-up the
   * site plan calls the most persuasive image on the site.
   */
  eleventyConfig.addShortcode("figureRow", (images = [], caption = "") => {
    const items = images.map((img) =>
      imageMarkup(img.src, img.alt, { sizes: "(min-width: 48rem) 22rem, 45vw" })
    );
    const captionHTML = hasText(caption)
      ? `<figcaption>${md.renderInline(caption.trim())}</figcaption>`
      : "";
    return (
      `<figure class="figure-row">` +
      `<div class="figure-row__items" data-count="${items.length}">${items.join("")}</div>` +
      `${captionHTML}</figure>`
    );
  });

  eleventyConfig.addShortcode("video", (file, poster, label) => {
    if (!hasText(file)) return placeholderMarkup(label, { wide: true });
    const posterAttr = hasText(poster) ? ` poster="/assets/img/${esc(poster)}"` : "";
    // No autoplay anywhere: controls-only playback respects prefers-reduced-motion
    // by construction and needs no JavaScript.
    return (
      `<video class="video" controls muted loop playsinline preload="none"${posterAttr}>` +
      `<source src="/assets/video/${esc(file)}" type="video/mp4">` +
      `<p>${esc(label || "Video of the artefact in motion.")}</p>` +
      `</video>`
    );
  });

  eleventyConfig.addCollection("projects", (collectionApi) =>
    collectionApi
      .getFilteredByTag("project")
      .filter((item) => !(isProduction && item.data.draft))
      .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999))
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"]
  };
}
