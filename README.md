# Portfolio site — James Robinson

A static site built with [Eleventy](https://www.11ty.dev/). Content is Markdown,
templates are Nunjucks, styling is one hand-written stylesheet. No client-side
JavaScript, no framework, no CMS.

Three working documents sit alongside this repo but are deliberately not committed
to it, since it's public: `portfolio-site-plan.md` (content and editorial
decisions), `claude-code-build-brief.md` (how it's built) and `NOTES.md` (open
questions and assets still needed). They're listed in `.gitignore`. If you've
cloned this fresh onto another machine, they won't come with it — copy them across
manually.

## Running it

```bash
npm install
npm start
```

That serves the site at <http://localhost:8080> and rebuilds on save.

```bash
npm run build
```

Builds to `_site/` exactly as CI does, including hiding drafts.

## Adding a project

1. Copy `src/projects/lego-face.md` to a new file. The filename becomes the URL:
   `src/projects/not-gate.md` → `/work/not-gate/`.
2. Fill in the front matter. Every field is optional except `title` — anything you
   leave out simply doesn't render, so a half-written project still looks
   deliberate rather than broken.
3. Drop images in `src/assets/img/` and reference them by filename only.

No template changes are needed for any of this.

### Front matter fields

| Field | What it does |
| --- | --- |
| `title` | Page heading and card title. Required. |
| `summary` | One line under the title, and on the card. |
| `year` | Shown in the meta list. A range like `"2022–2023"` is fine — quote it. |
| `order` | Sort position on `/work`. Lower comes first. |
| `draft` | `true` hides it from the published site. See below. |
| `featured` | `true` puts it among the home page cards. |
| `tools` | A list. Rendered comma-separated. |
| `hero.src` | Filename in `src/assets/img/`. |
| `hero.alt` | Required whenever `hero.src` is set. |
| `hero.video` | Filename in `src/assets/video/`. Used instead of the hero image. |
| `hero.poster` | Still image for the video, from `src/assets/img/`. |
| `links` | List of `{label, url}`. Entries with no `url` are skipped. |

### The sections

The body of the file is where the writing goes, as `##` headings. These are the
fields from the site plan's project template:

```markdown
## The question
## What I made
## What I did myself
## How it was tested
## What I learned
## Where it went
```

Use the ones you can fill and leave out the ones you can't — a section you don't
write simply doesn't appear. Order is up to you, though the list above reads best.
You can put images, figure rows and extra prose anywhere between them.

If you write a heading that isn't on that list, the build prints a warning naming
the file. It doesn't fail, so you're free to add a section the template never
anticipated — but it does catch "What I learnt" and similar typos. The canonical
list is `SECTION_HEADINGS` at the top of `.eleventy.js`.

## Images

Reference images by filename and the build does the rest: AVIF, WebP and JPEG at
four widths, with `width` and `height` set so nothing shifts as the page loads.
The hero loads eagerly, everything else lazily.

There are two ways to put an image on a page, and the difference matters:

- **Hero and figure rows** are declared in front matter and rendered by a shortcode.
  If the file isn't there yet you get a **placeholder block showing the alt text** —
  intentional, so you can write a whole project page before taking the photograph and
  have it read as unfinished rather than broken.
- **Images in the body** are ordinary Markdown,
  `![Alt text](src/assets/img/thing.jpg)`, which is what Obsidian writes when you
  paste one in. These still get the full responsive treatment, but there's no
  placeholder — the file needs to exist.

**Animated GIFs don't work as heroes.** The pipeline publishes a single still frame,
so the animation is lost. The build warns you when it spots one and prints the
`ffmpeg` command to convert it. Use `hero.video` with an MP4 instead — smaller, and
it can respect `prefers-reduced-motion`, which an animated GIF cannot.

Alt text is enforced at build time either way: any image that reaches the output with
missing or empty alt text **fails the build** and names the source file. That check
runs on the rendered HTML, so it catches Markdown images as well as shortcode ones.

### Iteration line-ups

For a row of two to four images sharing one caption — several versions of the same
object side by side — put the list in front matter and call `figureRow` in the body:

```njk
{% figureRow iterations, "Six revisions. Each one moved the copper tape somewhere less fragile." %}
```

```yaml
iterations:
  - src: not-gate-v1.jpg
    alt: First version, with copper tape running across the open face of the housing.
  - src: not-gate-v4.jpg
    alt: Fourth version, with the tape recessed into a channel.
```

### Video

Short, silent, self-hosted MP4 in `src/assets/video/`, under about 3 MB. Videos
render with controls and never autoplay, which is what keeps them compatible with
`prefers-reduced-motion` without any JavaScript.

## Writing in Obsidian

**The repo root is the vault.** Open `/Users/…/Portfolio` in Obsidian, not `src/`.
Settings are committed in `.obsidian/app.json`, so it behaves the same on a fresh
clone:

- Pasted images land in `src/assets/img/`, which is where the build looks for them.
- Links are written as Markdown with vault-absolute paths, so alt text is expressible.
- `node_modules/`, `_site/`, `.github/`, `src/_includes/`, `src/_data/` and
  `src/css/` are excluded from search and the quick switcher.

Machine-specific state — window layout, theme, plugin bundles — is gitignored.

### Committing and pushing from Obsidian

The **Git** community plugin (obsidian-git) is set up. The plugin bundle itself
isn't committed, so on a new machine install it from Settings → Community plugins;
the committed `data.json` then configures it.

Useful commands from the palette (`Cmd-P`):

| Command | What it does |
| --- | --- |
| `Git: Commit all changes` | Stages everything and commits with the default message |
| `Git: Commit all changes with specific message` | Prompts you for the message |
| `Git: Push` | Pushes to `origin/main`, which triggers the deploy |
| `Git: Open source control view` | Sidebar with staged/unstaged files and diffs |

Nothing is automatic: no auto-commit, no auto-push. That's deliberate, because
every push to `main` publishes the site — you don't want half-written project copy
deploying itself. It does pull on startup.

The vault is the repo root, so the source control view shows changes to
`.eleventy.js`, `README.md` and the workflow file as well as to your content. The
planning docs, `NOTES.md`, `node_modules/` and `_site/` are all gitignored, so
"Commit all changes" can't publish them by accident.

The build translates Obsidian's paths into the site's URLs, so all of these work:

| You write | You get |
| --- | --- |
| `![Alt](src/assets/img/thing.jpg)` | the responsive image pipeline |
| `[[lego-face]]` | a link to `/work/lego-face/` |
| `[[lego-face\|the LEGO face]]` | the same link, with your label |
| `[text](src/projects/lego-face.md)` | a link to `/work/lego-face/` |
| `[text](src/about.md)` | a link to `/about/` |

The `src/` prefix is optional in all of those, so the same links keep working if you
ever open `src/` as the vault instead.

One caveat: that translation is a text substitution over the whole file, so `[[...]]`
inside a fenced code block would also be rewritten. No project file has code blocks
today; if one ever needs them, that's the thing to watch.

Project pages are plain Markdown with `##` headings, so Live Preview shows you
essentially the finished page. The only non-Markdown thing you'll see is the
`{% figureRow %}` line for iteration line-ups.

## Drafts

`draft: true` in a project's front matter keeps it out of the published site — no
page, no card, no URL. It still renders under `npm start`, marked with a visible
draft banner, so you can work on it. Use it for anything with facts you haven't
confirmed yet.

`npm run build` sets `ELEVENTY_ENV=production`, which is what turns the hiding on.
That's the same command CI runs, so what you see from `npm run build` is what
publishes.

## Publishing

Push to `main`. `.github/workflows/deploy.yml` builds and deploys to GitHub Pages.

Two one-off setup steps, both in the repo's **Settings → Pages**:

- Set **Source** to **GitHub Actions**. Without this the workflow runs but nothing
  goes live.
- Add the custom domain there, and create a `CNAME` file at the repo root
  containing just the hostname. The build copies it into the output so the domain
  survives each deploy. Until that file exists the build skips it harmlessly.

## Layout of the repo

```
.                             ← open this directory as the Obsidian vault
├── .obsidian/                vault settings; app.json and the Git plugin's
│                             data.json are committed, the rest is ignored
├── .eleventy.js              config, image pipeline, path rewriting, validation
├── .github/workflows/        build and deploy to Pages
└── src/
    ├── _data/site.json       name, tagline, nav, contact
    ├── _includes/
    │   ├── base.njk          head, header, footer
    │   ├── project.njk       single project page
    │   └── partials/         project-card
    ├── projects/             one .md per project
    │   └── projects.11tydata.js   layout, tags, permalink, drafts
    ├── index.njk             home
    ├── work.njk              /work
    ├── about.md
    ├── assets/{img,video}/
    └── css/style.css
```

Two things in `.eleventy.js` are worth knowing about:

- The image, hero, `figureRow` and video shortcodes live there rather than as
  Nunjucks partials, because they check the filesystem to decide whether to emit a
  real image or a placeholder.
- The `obsidian-paths` preprocessor and the `validate-output` transform are what
  translate Obsidian's paths and enforce the alt-text and heading rules.
