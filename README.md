# Portfolio site — James Robinson

A static site built with [Eleventy](https://www.11ty.dev/). Content is Markdown,
templates are Nunjucks, styling is one hand-written stylesheet. No client-side
JavaScript, no framework, no CMS.

Content and editorial decisions live in `portfolio-site-plan.md`. How it's built
lives in `claude-code-build-brief.md`. Open questions and missing assets live in
`NOTES.md`.

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
| `sections` | The six content fields. See below. |
| `links` | List of `{label, url}`. Entries with no `url` are skipped. |

Anything after the front matter is optional long-form body copy, rendered below
the sections.

### The sections

These are the fields from the site plan's project template, and they render in
this order with these headings:

| Key | Heading |
| --- | --- |
| `question` | The question |
| `made` | What I made |
| `scope` | What I did myself |
| `tested` | How it was tested |
| `learned` | What I learned |
| `outcome` | Where it went |

Write them as YAML block strings (`question: |`) and use Markdown inside. Leave
out any you can't fill — an absent section produces no heading at all.

To change the set or the order, edit the `SECTIONS` array at the top of
`.eleventy.js`. Nothing else needs touching.

## Images

Reference images by filename and the build does the rest: AVIF, WebP and JPEG at
four widths, with `width` and `height` set so nothing shifts as the page loads.
The hero loads eagerly, everything else lazily.

**If the file isn't there yet, you get a placeholder block showing the alt text.**
That's intentional — you can write a whole project page before taking the
photograph, and the page reads as unfinished rather than broken.

Alt text is enforced at build time. Referencing an image without alt text fails
the build and names the file.

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
src/
├── _data/site.json          name, tagline, nav, contact
├── _includes/
│   ├── base.njk             head, header, footer
│   ├── project.njk          single project page
│   └── partials/            project-card
├── projects/                one .md per project
│   └── projects.11tydata.js shared front matter: layout, tags, permalink, drafts
├── index.njk                home
├── work.njk                 /work
├── about.md
├── assets/{img,video}/
└── css/style.css
.eleventy.js                 config, image pipeline, section order, filters
```

The image, hero, `figureRow` and video shortcodes live in `.eleventy.js` rather
than as Nunjucks partials, because they check the filesystem to decide whether to
emit a real image or a placeholder.
