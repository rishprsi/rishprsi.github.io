/* ============================================================
   RENDERER — builds the page from data.js. You should rarely
   need to touch this; edit data.js instead.
   ============================================================ */

const $ = (sel) => document.querySelector(sel);

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

/* ---- hero ---- */
function renderHero() {
  $("#brand-name").textContent = SITE.brand;
  $("#hero-name").textContent = SITE.name;
  $("#hero-tagline").textContent = SITE.tagline;
  $("#hero-sub").textContent = SITE.subline;
  $("#hero-note").textContent = SITE.heroNote;

  const links = $("#hero-links");
  [
    { label: "github", url: SITE.github, primary: true },
    { label: "linkedin", url: SITE.linkedin },
    { label: "resume.pdf", url: SITE.resume },
    { label: "email", url: `mailto:${SITE.email}` },
  ].forEach(l => {
    const a = el("a", "btn" + (l.primary ? " primary" : ""), l.label);
    a.href = l.url;
    if (l.url.startsWith("http")) { a.target = "_blank"; a.rel = "noopener"; }
    links.appendChild(a);
  });

  // typed boot line
  const target = $("#boot-line");
  const text = SITE.bootLine;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) { target.textContent = text; return; }
  let i = 0;
  const cursor = el("span", "cursor");
  target.appendChild(cursor);
  (function type() {
    if (i <= text.length) {
      target.firstChild ? null : target.appendChild(cursor);
      target.innerHTML = text.slice(0, i) + '<span class="cursor"></span>';
      i++;
      setTimeout(type, text[i - 1] === "." ? 40 : 28);
    }
  })();
}

/* ---- nav ---- */
function renderNav() {
  const nav = $("#nav");
  NAV.forEach(n => {
    const a = el("a", null, n.label);
    a.href = n.href;
    nav.appendChild(a);
  });
}

/* ---- about + skills ---- */
function renderAbout() {
  const wrap = $("#about-text");
  ABOUT_PARAGRAPHS.forEach(p => wrap.appendChild(el("p", null, p)));

  const books = $("#books");
  BOOKS.forEach(b => books.appendChild(el("li", null, b)));
  const certs = $("#certs");
  CERTS.forEach(c => certs.appendChild(el("li", null, c)));

  const skills = $("#skills");
  SKILLS.forEach(group => {
    const row = el("div", "skill-row reveal");
    row.appendChild(el("span", "skill-group", group.group + " ::"));
    const chips = el("div", "chips");
    group.items.forEach(s => chips.appendChild(el("span", "chip", s)));
    row.appendChild(chips);
    skills.appendChild(row);
  });
}

/* ---- thesis ---- */
function renderThesis() {
  const panel = el("div", "panel thesis-panel reveal");

  const head = el("div", "thesis-head");
  head.appendChild(el("h3", null, THESIS.title));
  head.appendChild(el("div", "thesis-inst mono", THESIS.institution));
  panel.appendChild(head);

  const canvasWrap = el("div", "thesis-canvas-wrap");
  const canvas = document.createElement("canvas");
  canvasWrap.appendChild(canvas);
  panel.appendChild(canvasWrap);

  panel.appendChild(el("p", "thesis-summary", THESIS.summary));

  const grid = el("div", "contrib-grid");
  THESIS.contributions.forEach(c => {
    const box = el("div", "contrib");
    box.appendChild(el("h4", null, c.title));
    box.appendChild(el("p", null, c.body));
    grid.appendChild(box);
  });
  panel.appendChild(grid);

  const stats = el("div", "stat-row");
  THESIS.stats.forEach(s => {
    const stat = el("div", "stat");
    stat.appendChild(el("div", "value", s.value));
    stat.appendChild(el("div", "label", s.label));
    stats.appendChild(stat);
  });
  panel.appendChild(stats);

  panel.appendChild(el("p", "card-note", THESIS.note));
  $("#thesis-panel").appendChild(panel);

  // size the canvas after layout, then register its animation
  requestAnimationFrame(() => AnimManager.register(canvas, THESIS.anim));
}

/* ---- projects ---- */
function projectBody(p, headingTag) {
  const body = el("div", "card-body");
  body.appendChild(el(headingTag, null, p.name));
  body.appendChild(el("p", "card-desc", p.desc));

  const tech = el("div", "card-tech");
  p.tech.forEach(t => tech.appendChild(el("span", null, t)));
  body.appendChild(tech);

  if (p.links && p.links.length) {
    const links = el("div", "card-links");
    p.links.forEach(l => {
      const a = el("a", null, l.label);
      a.href = l.url;
      a.target = "_blank";
      a.rel = "noopener";
      links.appendChild(a);
    });
    body.appendChild(links);
  }

  if (p.note) body.appendChild(el("p", "card-note", p.note));
  return body;
}

function projectCanvas(p, pendingCanvases) {
  const wrap = el("div", "card-canvas-wrap");
  const canvas = document.createElement("canvas");
  wrap.appendChild(canvas);
  wrap.appendChild(el("span", "card-tag", p.tag));
  pendingCanvases.push([canvas, p.anim]);
  return wrap;
}

function renderProjects() {
  $("#projects-intro").textContent = PROJECTS_INTRO;
  const grid = $("#project-grid");
  const pendingCanvases = [];

  PROJECT_GROUPS.forEach(group => {
    const [flagship, ...rest] = group.projects;
    const panel = el("section", "panel group reveal");

    // group header: domain + expertise
    const head = el("div", "group-head");
    const headText = el("div", "group-head-text");
    headText.appendChild(el("h3", "group-domain", group.domain));
    headText.appendChild(el("p", "group-blurb", group.blurb));
    head.appendChild(headText);
    const chips = el("div", "chips group-chips");
    group.expertise.forEach(s => chips.appendChild(el("span", "chip", s)));
    head.appendChild(chips);
    panel.appendChild(head);

    // flagship project
    const feat = el("div", "g-featured");
    feat.appendChild(projectCanvas(flagship, pendingCanvases));
    const body = projectBody(flagship, "h4");
    body.insertBefore(el("span", "flagship-label mono", "★ flagship mission"), body.firstChild);
    feat.appendChild(body);
    panel.appendChild(feat);

    // expandable log with the remaining projects
    if (rest.length) {
      const btn = el("button", "group-toggle mono",
        `▸ open full mission log <span class="toggle-count">(+${rest.length})</span>`);
      btn.setAttribute("aria-expanded", "false");
      panel.appendChild(btn);

      const moreWrap = el("div", "group-more-wrap");
      const more = el("div", "group-more");
      rest.forEach(p => {
        const card = el("article", "panel card sub-card");
        card.appendChild(projectCanvas(p, pendingCanvases));
        card.appendChild(projectBody(p, "h4"));
        more.appendChild(card);
      });
      moreWrap.appendChild(more);
      panel.appendChild(moreWrap);

      btn.addEventListener("click", () => {
        const open = moreWrap.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(open));
        btn.innerHTML = open
          ? "▾ collapse mission log"
          : `▸ open full mission log <span class="toggle-count">(+${rest.length})</span>`;
      });
    }

    grid.appendChild(panel);
  });

  requestAnimationFrame(() =>
    pendingCanvases.forEach(([canvas, key]) => AnimManager.register(canvas, key)));
}

/* ---- experience ---- */
function renderExperience() {
  const tl = $("#timeline");
  EXPERIENCE.forEach(e => {
    const entry = el("div", "t-entry reveal");
    const head = el("div", "t-head");
    head.appendChild(el("h3", null, e.role));
    head.appendChild(el("span", "t-org", e.org));
    head.appendChild(el("span", "t-when mono", e.when));
    entry.appendChild(head);
    const ul = el("ul");
    e.points.forEach(pt => ul.appendChild(el("li", null, pt)));
    entry.appendChild(ul);
    tl.appendChild(entry);
  });
}

/* ---- contact + footer ---- */
function renderContact() {
  $("#contact-blurb").textContent = SITE.contactBlurb;
  $("#contact-note").textContent = SITE.contactNote;
  const links = $("#contact-links");
  [
    { label: SITE.email, url: `mailto:${SITE.email}`, primary: true },
    { label: "github", url: SITE.github },
    { label: "linkedin", url: SITE.linkedin },
  ].forEach(l => {
    const a = el("a", "btn" + (l.primary ? " primary" : ""), l.label);
    a.href = l.url;
    if (l.url.startsWith("http")) { a.target = "_blank"; a.rel = "noopener"; }
    links.appendChild(a);
  });
  $("#footer-line").textContent = SITE.footer;
}

/* ---- scroll reveal ---- */
function initReveal() {
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.unobserve(e.target);
      }
    }),
    { threshold: 0.08 }
  );
  document.querySelectorAll(".reveal").forEach(n => obs.observe(n));
}

/* ---- boot ---- */
renderNav();
renderHero();
renderAbout();
renderThesis();
renderProjects();
renderExperience();
renderContact();
initReveal();
initSpace();
AnimManager.start();
