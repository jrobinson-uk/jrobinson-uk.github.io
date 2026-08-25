import remarkGfm from "remark-gfm"
import smartypants from "remark-smartypants"
import { QuartzTransformerPlugin } from "../types"
import rehypeSlug from "rehype-slug"

export interface Options {
  enableSmartyPants: boolean
  linkHeadings: boolean
}

const defaultOptions: Options = {
  enableSmartyPants: true,
  linkHeadings: true,
}

export const GitHubFlavoredMarkdown: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "GitHubFlavoredMarkdown",
    markdownPlugins() {
      return opts.enableSmartyPants ? [remarkGfm, smartypants] : [remarkGfm]
    },
    // Local change: heading ids and heading anchor links are separate concerns, and
    // Quartz's `linkHeadings` option conflates them — setting it false also drops
    // rehypeSlug, which strips every heading id and breaks every deep link on the
    // site. This site wants the ids and not the anchors: an anchor appended to every
    // heading is furniture for a wiki you navigate by section, not for a page read
    // top to bottom.
    htmlPlugins() {
      return [rehypeSlug]
    },
  }
}
