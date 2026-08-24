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

### Categories and topics

An entry's **categories** are metadata, not its folder. Declare them in front matter and
the entry appears under each one:

```yaml
categories: [making, publications]
```

The controlled list is `making`, `research`, `teaching`, `writing`, `publications` —
defined in `CATEGORIES` in `quartz/portfolio.ts`, which is also the ordering. Keep it
short: it drives navigation. An unknown value is ignored rather than creating a category
with no page, and an entry that declares none falls back to the folder it sits in.

The folder still decides the URL — `content/making/thing.md` is `/making/thing` — so it's
worth putting an entry in the folder of its main category. But it isn't what makes the
entry appear anywhere.

**Topics** are free-form and separate:

```yaml
tags: [raspberry-pi, copper-tape, machine-learning]
```

Each one gets a page at `/tags/<topic>`, with an index at `/tags`. Use Obsidian's tag
autocomplete. Topics are for browsing sideways; categories are for structure.

A category with no entries is left out of the navigation rather than shown empty, and its
own page says "Nothing logged here yet."

### Ordering

Listings are newest first, by the `year` field. Undated entries sort last. There's no
order field to maintain — `order` still exists and breaks ties within the same year, but
nothing needs it.

`/work` is the archive: every entry once, newest first, with category and topic counts
above it. Category pages are the filtered views. The archive deliberately doesn't group
by category, because an entry in two categories would be listed twice.

`featured: true` is separate from all of this and controls the landing page only.

### Front matter

```yaml
---
title: LEGO Face
summary: An articulated LEGO face that reads objects with a Raspberry Pi camera.
year: 2020            # drives ordering; listings are newest first
categories: [making, publications]
tags: [raspberry-pi, lego, machine-learning]
featured: true        # put it on the landing page
draft: false          # true keeps it out of the built site entirely
tools: [Raspberry Pi, Build HAT, LDraw]
hero:
  src: lego-face.jpg  # filename in content/assets/img/
  alt: An articulated face built from LEGO, with LED matrix eyes.
---
```

If a hero photograph isn't yours, credit it:

```yaml
hero:
  src: picademy-session.jpg
  alt: "..."
  credit: "Photograph: Raspberry Pi Foundation"
  creditUrl: https://www.raspberrypi.org/blog/picademy-expands-in-the-united-states/
```

Most images here are of James's own work and need no credit. A photograph *of* him at
someone else's event does, and `creditUrl` should point at where it was published so the
claim is checkable. Note the quotes — a `credit` containing a colon is not valid YAML
without them.

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

An animated GIF in the body of a note becomes an **H.264 MP4** with every frame of the
source, rendered as a `<video>` with controls, a poster and **no autoplay**.

That is deliberate on three counts. Video compression is built for this job, so the
whole clip costs a fraction of an animation format — the 7.7 MB `robot_face.gif` is
167 KB as MP4 with all 160 frames, against 499 KB as WebP with 20 of them. Nothing
moves until the visitor presses play, which is what `prefers-reduced-motion` is asking
for and what WCAG 2.2.2 requires, without needing a media query to arrange it. And
`preload="none"` means not a byte of the video is fetched unless it's wanted, so a page
carrying one is no heavier to load than a page of stills.

This needs **ffmpeg**: `brew install ffmpeg` locally, and the deploy workflow installs
it. Without it the build still works — it falls back to an **animated WebP** encoded to
a byte budget by dropping frames, with a still served under
`(prefers-reduced-motion: reduce)` — and says so in the build log:

```
robot_face.gif  323×325  video: skipped, ffmpeg not installed  webp: 20/160 frames, 0.49 MB
```

Install ffmpeg afterwards and the next build picks it up; it doesn't need the source
image to change first.

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

### Reviewing the prose

Sentences awaiting James's review are wrapped in Obsidian highlights:

```markdown
==This sentence is Claude's construction, not James's.==
```

Obsidian shows them in yellow. They are **stripped from the built site** by
`quartz/plugins/transformers/stripReviewHighlights.ts`, so the text reads normally in
public while staying flagged in the vault. Every build prints a count per file:

```
[review] 3 highlighted passages awaiting review in content/making/status-cube.md
```

To review: read the highlighted sentence, then either rewrite it in your own words or
delete the `==` markers to accept it as is. When no highlights remain, the transformer and
this section can both go.

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
| `quartz/portfolio.ts` | Categories, tags, entry selection and ordering |
| `quartz/components/ProjectTile.tsx` | Tile + the responsive/animated `<picture>` |
| `quartz/components/FeaturedProjects.tsx` | Landing page shop window |
| `quartz/components/WorkIndex.tsx` | `/work` archive, newest first, with filters |
| `quartz/components/pages/CategoryPage.tsx` | Category index bodies (replaces `FolderContent`) |
| `quartz/components/pages/TagEntries.tsx` | Topic pages and the `/tags` index |
| `quartz/components/ProjectHero.tsx` | Entry summary, meta line, hero image |
| `quartz/components/PortfolioNav.tsx` | The header |
| `quartz/components/PortfolioFooter.tsx` | Footer (the stock one fails WCAG AA on contrast) |
| `quartz/plugins/transformers/requireAltText.ts` | Alt-text enforcement |
| `quartz/plugins/transformers/responsiveImages.ts` | Body images → `<picture>`, animations → `<video>` |
| `quartz/styles/custom.scss` | Single column, no side rails |
| `scripts/prepare-images.mjs` | The image pipeline Quartz doesn't have |

`quartz.layout.ts` empties the left and right rails: no explorer, search, graph, table
of contents or backlinks. On a site whose job is to show artefact photographs, all of
that competes with the photographs.

Because the engine is customised, `npx quartz update` will conflict. Expect to merge by
hand, and check the files above first.
