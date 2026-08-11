const isProduction = process.env.ELEVENTY_ENV === "production";

/**
 * Shared front matter for every file in src/projects/.
 * A new project needs only its own content — no layout or permalink boilerplate.
 */
export default {
  layout: "project.njk",
  tags: ["project"],
  eleventyComputed: {
    // draft: true keeps a project out of the production build entirely, but it
    // still renders under `npm start` so you can work on it locally.
    permalink: (data) =>
      isProduction && data.draft ? false : `/work/${data.page.fileSlug}/`,
    eleventyExcludeFromCollections: (data) => Boolean(isProduction && data.draft),
    description: (data) => data.summary || data.site.description
  }
};
