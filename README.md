# Rishabh's Portfolio

A single-page portfolio with a deep-space "distributed cluster" theme — a nod to my MASS C++ thesis. Sections are laid out as BSP *supersteps* separated by barriers, the background is a drifting constellation graph, and every project card has its own canvas micro-animation.

No frameworks, no build step. Plain HTML/CSS/JS — works on GitHub Pages out of the box.

## Structure

```
portfolio/
├── index.html          # page skeleton (sections only, no content)
├── css/style.css       # theme — palette lives in :root variables at the top
├── js/data.js          # ★ ALL content lives here — edit this file
├── js/animations.js    # canvas animation registry + star field
├── js/main.js          # renders the page from data.js
├── Rishabh_Resume.pdf  # linked from the hero — replace when updated
└── .nojekyll           # tells GitHub Pages to serve files as-is
```

## Editing content (the modular part)

Everything on the page is rendered from `js/data.js`:

- **Projects are grouped by domain** in the `PROJECT_GROUPS` array. Each group has a `domain` name, an expertise `blurb`, `expertise` chips, and a `projects` array. The **first project in the array is the flagship** shown on the group card; the rest appear when the visitor expands the group's mission log.
- **Add/remove a project** — add or delete an entry in a group's `projects` array (or add a whole new group). Each project has a `name`, `tag`, `desc`, `tech`, `links`, a personal `note` comment, and an `anim` key. To change which project is featured, just reorder the array.
- **Pick an animation** — set `anim` to any key in the registry at the top of `js/animations.js` (`agents`, `nbody`, `search`, `encrypt`, `http`, `upload`, `chirps`, `rss`, `pokeball`, `asteroids`, `markdown`, `crawler`, `agentloop`, `memgraph`, `wordcount`). New projects can reuse an existing animation, or you can add a new factory to the registry.
- **Swap skills** — edit the `SKILLS` array.
- **Experience / thesis / books / certs** — `EXPERIENCE`, `THESIS`, `BOOKS`, `CERTS`.
- **Links, email, taglines** — the `SITE` object.
- **Colors** — CSS variables at the top of `css/style.css`.

> Note: most project `links` currently point at `github.com/rishprsi` — update each to the real repo URL once the repos are public.

## Preview locally

```bash
python3 -m http.server 8741 --directory portfolio
# open http://localhost:8741
```

## Deploy to GitHub Pages

**Option A — user site (recommended, served at `https://rishprsi.github.io/`):**

```bash
cd portfolio
git init && git add . && git commit -m "Portfolio site"
git branch -M main
git remote add origin git@github.com:rishprsi/rishprsi.github.io.git
git push -u origin main
```

Then on GitHub: repo **Settings → Pages → Source: Deploy from a branch → main / (root)**. The site goes live at `https://rishprsi.github.io/` within a minute or two.

**Option B — project site (served at `https://rishprsi.github.io/<repo>/`):**
Same steps with any repo name; enable Pages the same way. All asset paths in this site are relative, so it works under a subpath too.

To update the site later: edit `js/data.js`, commit, push. Done.
