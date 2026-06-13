# Rishabh's Portfolio

A single-page portfolio with a deep-space "distributed cluster" theme, a nod to my MASS C++ thesis. Sections are laid out as BSP *supersteps* separated by barriers, the background is a drifting constellation graph, and every project card has its own canvas micro-animation.

Built with [Astro](https://astro.build): the page is pre-rendered to static HTML at build time (great for SEO and link previews), while the content still lives in a single editable data file. Package manager is [Bun](https://bun.sh).

## Structure

```
portfolio/
├── src/
│   ├── data.js              # ★ ALL content lives here — edit this file
│   ├── icons.js             # tech name → Nerd Font glyph map (for chips)
│   ├── pages/index.astro    # composes the sections in order
│   ├── layouts/Layout.astro # <head>, SEO + Open Graph tags, fonts, scripts
│   ├── components/          # one .astro per section (Hero, About, Thesis, ...)
│   └── styles/global.css    # theme — palette lives in :root variables at the top
├── public/
│   ├── js/animations.js     # canvas animation registry + star field (plain JS)
│   ├── js/boot.js           # wires canvases, scroll reveals, typed line, toggles
│   ├── fonts/               # self-hosted JetBrains Mono Nerd Font (subset woff2)
│   ├── og.svg / og.png      # link-preview card (edit og.svg, regenerate og.png)
│   ├── Rishabh_Resume.pdf   # linked from the hero — replace when updated
│   └── .nojekyll
├── astro.config.mjs         # site URL + base path
└── .github/workflows/deploy.yml  # builds with Bun + deploys to Pages
```

## Editing content (the modular part)

Everything on the page is rendered from `src/data.js`:

- **Projects are grouped by domain** in the `PROJECT_GROUPS` array. Each group has a `domain` name, a `blurb`, `expertise` chips, and a `projects` array. The **first project in the array is the flagship** shown on the group card; the rest appear when the visitor expands the group's mission log.
- **Add/remove a project** — add or delete an entry in a group's `projects` array (or add a whole new group). Each project has a `name`, `tag`, `desc`, `tech`, `links`, a personal `note`, and an `anim` key. To change which project is featured, reorder the array.
- **Pick an animation** — set `anim` to any key in the registry at the top of `public/js/animations.js` (`agents`, `nbody`, `search`, `encrypt`, `http`, `upload`, `chirps`, `rss`, `pokeball`, `asteroids`, `markdown`, `crawler`, `agentloop`, `memgraph`, `wordcount`).
- **Swap skills** — edit the `SKILLS` array.
- **Experience / thesis / books / certs** — `EXPERIENCE`, `THESIS`, `BOOKS`, `CERTS`.
- **Links, email, taglines, SEO description** — the `SITE` object.
- **Colors** — CSS variables at the top of `src/styles/global.css`.

> Note: most project `links` currently point at `github.com/rishprsi` — update each to the real repo URL once the repos are public.

## Develop & build

```bash
cd portfolio
bun install      # first time only
bun run dev      # local dev server at http://localhost:4321
bun run build    # static output into dist/
bun run preview  # serve the built dist/ locally
```

### Tech glyphs (Nerd Font)

The skill / tech / expertise chips show language and tool logos from
**JetBrains Mono Nerd Font**, which is self-hosted (no Google Fonts dependency
for the mono face) and **subset to only the glyphs actually used**, so all three
weights together are ~130 KB. The Regular weight is preloaded; `font-display: swap`
keeps text instant, and glyphs are hidden until the font is ready (no tofu flash).

The name→glyph mapping lives in `src/icons.js`. To add a logo for a new tech:

1. Find its codepoint in the [Nerd Fonts cheat sheet](https://www.nerdfonts.com/cheat-sheet) (prefer the `nf-dev-*` Devicons or `nf-fa-*` set).
2. Add it to `TECH_ICONS` in `src/icons.js` (e.g. `rust: "\ue7a8"`).
3. Re-subset the font so the new glyph is included (see below). If you skip this,
   the glyph renders as an empty box.

To re-subset the font (needs `fonttools` + `brotli`, e.g. `pip install fonttools brotli`):
download the JetBrains Mono Nerd Font, then run `pyftsubset` on the
`*NerdFontMono-{Regular,SemiBold,Italic}.ttf` files with `--flavor=woff2`,
passing `--unicodes=` the Latin ranges plus every codepoint in `src/icons.js`
(Regular carries the icons; SemiBold/Italic only need Latin). Output the three
files into `public/fonts/`.

### Regenerating the link-preview image

The Open Graph card is authored as SVG so it stays editable. After changing
`public/og.svg`, regenerate the PNG (needs `rsvg-convert`, e.g. `brew install librsvg`):

```bash
rsvg-convert -w 1200 -h 630 public/og.svg -o public/og.png
```

## Deploy to GitHub Pages

This repo ships a GitHub Actions workflow (`.github/workflows/deploy.yml`) that
installs Bun, runs `bun run build`, and publishes `dist/`.

1. Push to the `main` branch of `rishprsi.github.io`.
2. On GitHub: **Settings → Pages → Source: GitHub Actions**.
3. The site goes live at `https://rishprsi.github.io/` after the workflow finishes.

If you deploy under a subpath instead (`https://rishprsi.github.io/<repo>/`),
set `base: "/<repo>/"` in `astro.config.mjs` so asset URLs resolve correctly.

To update the site later: edit `src/data.js`, commit, push. The workflow rebuilds and redeploys.
