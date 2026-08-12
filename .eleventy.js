import fs from "node:fs";
import path from "node:path";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import MarkdownIt from "markdown-it";

const IMG_SOURCE_DIR = "src/assets/img";

const isProduction = process.env.ELEVENTY_ENV === "production";

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });
const esc = (value) => md.utils.escapeHtml(String(value));

/**
 * The project template from the site plan. These are now `##` headings written in
 * the body of each project's Markdown, so they can be authored in Obsidian's
 * editor rather than as nested YAML.
 *
 * Nothing enforces that a project uses all of them, or uses them in this order —
 * absent sections simply don't render. The list exists so the build can warn about
 * a heading that looks like a typo of one of these.
 */
const SECTION_HEADINGS = [
  "The question",
  "What I made",
  "What I did myself",
  "How it was tested",
  "What I learned",
  "Where it went",
  "Links"
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
        `Every image needs meaningful alt text; decorative images aren't expected here.`
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
    defaultAttributes: { sizes: DEFAULT_SIZES },
    // A body image whose file isn't there yet shouldn't stop the site building.
    // Alt text is still enforced, by the transform further down.
    failOnError: false
  });

  /**
   * Rewrites the link and image paths Obsidian writes into paths this site serves.
   *
   * Obsidian, with "Use [[Wikilinks]]" off and "New link format" set to absolute,
   * writes vault-root-relative paths: `assets/img/foo.jpg`, `projects/bar.md`.
   * Wikilinks are handled too, in case you type them by hand.
   *
   * Caveat: this is a text substitution over the whole file, so `[[...]]` inside a
   * fenced code block would also be rewritten. No project file has code blocks; if
   * one ever does, that's the thing to watch.
   */
  eleventyConfig.addPreprocessor("obsidian-paths", "md", (data, content) =>
    content
      // ![Alt](assets/img/x.jpg) and ![Alt](/assets/img/x.jpg) → served path
      .replace(/(!\[[^\]]*\]\()\/?assets\/(img|video)\//g, "$1/assets/$2/")
      // [Label](projects/lego-face.md) → [Label](/work/lego-face/)
      .replace(/(\]\()\/?projects\/([^)/]+)\.md(\))/g, "$1/work/$2/$3")
      // [Label](about.md) → [Label](/about/)
      .replace(/(\]\()\/?(about|writing)\.md(\))/g, "$1/$2/$3")
      // [[lego-face]] and [[lego-face|The LEGO face]] → a link to the project
      .replace(
        /\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g,
        (_m, target, label) => `[${label || target}](/work/${target.replace(/\.md$/, "")}/)`
      )
  );

  /**
   * Two build-time guarantees, checked on the rendered HTML so they cover both the
   * `image` shortcode and plain Markdown images written in Obsidian:
   *
   *  1. Every image has non-empty alt text. This throws — it's the accessibility
   *     commitment the site is built on, and a silent warning would get ignored.
   *  2. Project `##` headings are warned about if they aren't from the known set,
   *     which catches "What I learnt" and similar typos. This only warns, so you're
   *     free to add a section the template never anticipated.
   */
  eleventyConfig.addTransform("validate-output", function (content) {
    const outputPath = this.page?.outputPath;
    if (!outputPath || !outputPath.endsWith(".html")) return content;

    for (const tag of content.match(/<img\b[^>]*>/g) || []) {
      const alt = tag.match(/\salt\s*=\s*"([^"]*)"/);
      if (!alt || !hasText(alt[1])) {
        const src = (tag.match(/\ssrc\s*=\s*"([^"]*)"/) || [])[1] || "unknown source";
        throw new Error(
          `Image with no alt text in ${this.page.inputPath} (src: ${src}).\n` +
            `Every image needs meaningful alt text; decorative images aren't expected here.`
        );
      }
    }

    const isProjectPage = /\/work\/[^/]+\/index\.html$/.test(outputPath);
    if (isProjectPage) {
      for (const tag of content.match(/<h2\b[^>]*>[\s\S]*?<\/h2>/g) || []) {
        const text = tag.replace(/<[^>]+>/g, "").trim();
        if (text && !SECTION_HEADINGS.includes(text)) {
          console.warn(
            `[project headings] "${text}" in ${this.page.inputPath} isn't one of: ` +
              SECTION_HEADINGS.join(", ")
          );
        }
      }
    }

    return content;
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

  // Used to gate og:image, so social cards never advertise a photo that isn't there.
  eleventyConfig.addFilter("imageExists", (src) =>
    hasText(src) && fs.existsSync(path.join(IMG_SOURCE_DIR, src))
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
