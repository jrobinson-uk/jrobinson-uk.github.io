import { visit } from "unist-util-visit"
import { Root, Element } from "hast"
import { QuartzTransformerPlugin } from "../types"

/**
 * Removes `==highlight==` marks from the built site, keeping the text inside them.
 *
 * The highlights are an editing device, not content. Obsidian shows `==like this==`
 * in yellow, which makes it easy to see which sentences are still awaiting James's
 * review — but they should never reach a visitor. This unwraps every <mark> so the
 * prose reads normally in public while staying flagged in the vault.
 *
 * It reports a count per file at build time, so the review backlog is visible from
 * the terminal. When nothing is highlighted any more, this plugin has done its job
 * and can be removed along with the marks.
 */
export const StripReviewHighlights: QuartzTransformerPlugin = () => {
  return {
    name: "StripReviewHighlights",
    htmlPlugins() {
      return [
        () => {
          return (tree: Root, file) => {
            let stripped = 0

            visit(tree, "element", (node: Element, index, parent) => {
              if (index === undefined || !parent) return
              // Quartz's Obsidian-flavoured markdown renders ==x== as a span with
              // class "text-highlight", not as <mark>.
              const classes = node.properties?.className
              const isHighlight =
                node.tagName === "mark" ||
                (Array.isArray(classes) && classes.includes("text-highlight")) ||
                classes === "text-highlight"
              if (!isHighlight) return
              // Splice the mark's children into its place, dropping the wrapper.
              parent.children.splice(index, 1, ...node.children)
              stripped++
              return index // re-visit this position, now holding the unwrapped children
            })

            if (stripped > 0) {
              console.log(
                `[review] ${stripped} highlighted passage${stripped === 1 ? "" : "s"} awaiting review in ${file.data.filePath}`,
              )
            }
          }
        },
      ]
    },
  }
}
