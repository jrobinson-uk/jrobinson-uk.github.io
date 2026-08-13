# Portfolio site — James Robinson

A static site built with [Quartz](https://quartz.jzhao.xyz/) v4, authored in Obsidian.
Content is Markdown in `content/`, organised into category folders. Deployed to GitHub
Pages on every push to `main`.

Three working documents sit alongside this repo but are deliberately not committed to
it, since it's public: `portfolio-site-plan.md` (content and editorial decisions),
`claude-code-build-brief.md` (original build brief) and `NOTES.md` (open questions and
assets still needed). They're in `.gitignore`. A fresh clone won't have them — copy
them across manually.

## Running it

```bash
npm install
npm start
```

Serves at <http://localhost:8080> and rebuilds on save.

```bash
npm run build
```

Builds to `public/` exactly as CI does. Both commands run `scripts/prepare-images.mjs`
first, which generates the image derivatives.

## How a project gets on the site

1. **Create a note** in the right category folder: `content/making/thing.md` becomes
   `/making/thing`.
2. **Write the front matter** (all optional except `title`).
3. **Write the body** as `##` headings.
4. **Set `featured: true`** to put it on the landing page.

That's the whole mechanism. Nothing needs registering anywhere.

### Categories

Each is a folder in `content/`:

| Folder | Appears as |
| --- | --- |
| `making/` | Making |
| `research/` | Research |
| `teaching/` | Teaching |
| `writing/` | Writing |
| `publications/` | Publications |

A category with nothing in it is omitted from `/work` rather than shown empty. Its own
page says "Nothing logged here yet."

To add a category: create the folder, add a `index.md` with a `title`, and add a line
to `CATEGORIES` in `quartz/portfolio.ts`. That array controls both ordering and which
folders count as categories.

### Front matter

```yaml
---
title: LEGO Face
summary: An articulated LEGO face that reads objects with a Raspberry Pi camera.
order: 1              # sort position within its category
featured: true        # put it on the landing page
draft: false          # true keeps it out of the built site entirely
tools: [Raspberry Pi, Build HAT, LDraw]
hero:
  src: lego-face.jpg  # filename in content/assets/img/
  alt: An articulated face built from LEGO, with LED matrix eyes.
---
```

`featured` is the switch for the landing page. Flip it to change the shop window
without moving or rewriting anything — different projects at different times.

### The sections

The body is where the writing goes:

```markdown
## The question
## What I made
## What I did myself
## How it was tested
## What I learned
## Where it went
```

Use the ones you can fill; leave out the ones you can't. A section you don't write
simply doesn't appear. Order is up to you. Images and prose can go anywhere between
them.

## Images

Put source images in `content/assets/img/` and reference them by filename in
`hero.src`. `scripts/prepare-images.mjs` generates AVIF, WebP and JPEG at up to four
widths, plus a manifest that sets `width`/`height` so nothing shifts as the page loads.
Derivatives land in `content/assets/derived/`, which is gitignored and regenerated
every build — never edit it by hand.

**If the file isn't there yet you get a placeholder showing the alt text**, so a
project can be written before its photograph is taken.

### Animated GIFs

Animated GIFs work as tile previews. Each one becomes:

- an **animated WebP**, encoded to a ~900 KB budget by dropping frames rather than
  wrecking quality, with frame delays scaled so it still runs at the original speed;
- a **still first frame**, served to anyone whose system asks for reduced motion.

That last part is why animation goes through WebP rather than shipping the GIF: a GIF
animates unconditionally and can't be opted out of. A `<source media="(prefers-reduced-motion: reduce)">`
can.

The 7.7 MB `robot_face.gif` comes out at 670 KB, 27 of its 160 frames. If a GIF can't
be squeezed under budget even at maximum frame-dropping, the build warns and tells you
to use a shorter clip.

Images are never displayed larger than their intrinsic size, so a small source looks
small rather than blurry.

### Alt text is enforced

Any image reaching the output without usable alt text **fails the build** and names the
file. That includes alt text that's just a filename, which is what a bare Obsidian
embed produces. Both of these work:

```markdown
![[thing.jpg|A description of what is in the photograph]]
![A description of what is in the photograph](assets/img/thing.jpg)
```

This is a custom transformer (`quartz/plugins/transformers/requireAltText.ts`) — Quartz
has no equivalent.

## Writing in Obsidian

**Open `content/` as the vault**, not the repo root — that keeps `node_modules` and the
Quartz engine out of Obsidian's index. Settings are committed in
`content/.obsidian/app.json`: attachments land in `assets/img/`, wikilinks are on, and
`assets/derived/` is hidden.

Wikilinks work as you'd expect: `[[lego-face]]`, `[[lego-face|the LEGO face]]`.

### Committing and pushing from Obsidian

The **Git** plugin (obsidian-git) is set up. The bundle isn't committed, so on a new
machine install it from Settings → Community plugins; the committed `data.json`
configures it.

| Command (`Cmd-P`) | What it does |
| --- | --- |
| `Git: Commit all changes with specific message` | Prompts for a message |
| `Git: Push` | Pushes to `origin/main`, which triggers the deploy |
| `Git: Open source control view` | Sidebar with changed files and diffs |

Nothing is automatic — no auto-commit, no auto-push. Every push to `main` publishes the
site, so that's deliberate. It does pull on startup.

The vault is `content/` but the repo root is one level up; the plugin runs
`git rev-parse --show-cdup` and finds the repository root on its own.

## Publishing

Push to `main`. `.github/workflows/deploy.yml` runs `npm ci`, `npm run build`, and
deploys `public/` to Pages.

In the repo's **Settings → Pages**, Source must be **GitHub Actions**. For a custom
domain, add it there and create a `CNAME` file — see `quartz/plugins/emitters/cname.ts`
and add `Plugin.CNAME()` to the emitters in `quartz.config.ts`.

## What's customised, and why

Quartz's defaults are built for a note garden. These are the deviations:

| File | What it does |
| --- | --- |
| `quartz/portfolio.ts` | Category definitions, project/featured selection |
| `quartz/components/ProjectTile.tsx` | Tile + the responsive/animated `<picture>` |
| `quartz/components/FeaturedProjects.tsx` | Landing page shop window |
| `quartz/components/WorkIndex.tsx` | `/work`, grouped by category |
| `quartz/components/pages/CategoryPage.tsx` | Category index bodies (replaces `FolderContent`) |
| `quartz/components/PortfolioNav.tsx` | The header |
| `quartz/components/PortfolioFooter.tsx` | Footer (the stock one fails WCAG AA on contrast) |
| `quartz/plugins/transformers/requireAltText.ts` | Alt-text enforcement |
| `quartz/styles/custom.scss` | Single column, no side rails |
| `scripts/prepare-images.mjs` | The image pipeline Quartz doesn't have |

`quartz.layout.ts` empties the left and right rails: no explorer, search, graph, table
of contents or backlinks. On a site whose job is to show artefact photographs, all of
that competes with the photographs.

Because the engine is customised, `npx quartz update` will conflict. Expect to merge by
hand, and check the files above first.
