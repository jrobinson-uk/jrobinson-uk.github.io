import { visit } from "unist-util-visit"
import { Root, Element } from "hast"
import { QuartzTransformerPlugin } from "../types"

/**
 * Fails the build on any image without meaningful alt text.
 *
 * Quartz has no equivalent check, and this site's accessibility claims depend on
 * one. It runs on the HTML tree rather than the Markdown tree so it catches every
 * route to an image: Markdown `![alt](src)`, Obsidian `![[embeds]]`, and raw
 * `<img>` in HTML.
 *
 * An Obsidian embed produces alt text equal to the filename, which is worse than
 * useless to a screen reader — so alt text that is just a filename is rejected too.
 */

const FILENAME_LIKE = /\.(jpe?g|png|gif|webp|avif|svg)$/i

function describe(node: Element): string {
  const src = node.properties?.src
  return typeof src === "string" && src.length > 0 ? src : "unknown source"
}

export const RequireAltText: QuartzTransformerPlugin = () => {
  return {
    name: "RequireAltText",
    htmlPlugins() {
      return [
        () => {
          return (tree: Root, file) => {
            const problems: string[] = []

            visit(tree, "element", (node: Element) => {
              if (node.tagName !== "img") return

              // Decorative images are marked as such and are legitimately alt-free.
              const role = node.properties?.role
              const hidden = node.properties?.ariaHidden
              if (role === "presentation" || role === "none" || hidden === "true") return

              const alt = node.properties?.alt
              if (typeof alt !== "string" || alt.trim().length === 0) {
                problems.push(`  ${describe(node)} — no alt text`)
              } else if (FILENAME_LIKE.test(alt.trim())) {
                problems.push(
                  `  ${describe(node)} — alt text is a filename ("${alt.trim()}"), ` +
                    `which tells a screen reader nothing`,
                )
              }
            })

            if (problems.length > 0) {
              throw new Error(
                `Images without usable alt text in ${file.data.filePath}:\n` +
                  problems.join("\n") +
                  `\n\nEvery image needs meaningful alt text. Obsidian's embed syntax takes ` +
                  `it after a pipe:\n` +
                  `    ![[thing.jpg|A description of what is in the photograph]]\n` +
                  `Markdown syntax works too: ![A description](thing.jpg)\n` +
                  `If an image really is decorative, add role="presentation".`,
              )
            }
          }
        },
      ]
    },
  }
}
