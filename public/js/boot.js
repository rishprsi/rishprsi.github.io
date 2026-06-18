/* ============================================================
   BOOT - client-side wiring for the (otherwise static) page.
   Loads after animations.js, which defines the globals
   ANIMATIONS, AnimManager, and initSpace.
   Responsibilities:
     1. attach each project/thesis animation to its <canvas data-anim>
     2. the star-field background
     3. scroll-reveal for .reveal elements
     4. the typed hero boot line
     5. expand / collapse of each project group's full log
   ============================================================ */
(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1 + 2 — canvas animations + star field */
  function initCanvases() {
    document.querySelectorAll("canvas[data-anim]").forEach((canvas) => {
      const key = canvas.getAttribute("data-anim");
      if (key && typeof AnimManager !== "undefined") AnimManager.register(canvas, key);
    });
    if (typeof AnimManager !== "undefined") AnimManager.start();
    if (typeof initSpace === "function") initSpace();
  }

  /* 3 — reveal on scroll */
  function initReveal() {
    const nodes = document.querySelectorAll(".reveal");
    if (reduced || !("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("visible"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.08 }
    );
    nodes.forEach((n) => obs.observe(n));
  }

  /* 4 — typed hero boot line */
  function initBootLine() {
    const target = document.getElementById("boot-line");
    if (!target) return;
    const text = target.getAttribute("data-text") || target.textContent || "";
    if (reduced) {
      target.textContent = text;
      return;
    }
    let i = 0;
    (function type() {
      if (i <= text.length) {
        target.innerHTML = text.slice(0, i) + '<span class="cursor"></span>';
        i++;
        setTimeout(type, text[i - 1] === "." ? 40 : 28);
      }
    })();
  }

  /* 5 — group expand / collapse */
  function initGroupToggles() {
    document.querySelectorAll(".group-toggle").forEach((btn) => {
      const count = btn.getAttribute("data-count") || "";
      const wrap = btn.nextElementSibling;
      if (!wrap) return;
      btn.addEventListener("click", () => {
        const open = wrap.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(open));
        btn.innerHTML = open
          ? "▾ collapse mission log"
          : `▸ open full mission log <span class="toggle-count">(+${count})</span>`;
      });
    });
  }

  /* 6 — theme switching (persisted; tells the background to recolor) */
  function applyTheme(name) {
    if (!name) return;
    if (name === "deep-space") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", name);
    }
    try {
      localStorage.setItem("rs-theme", name);
    } catch (e) {}
    window.dispatchEvent(new Event("rs-theme-change"));
  }

  function initThemes() {
    let saved;
    try {
      saved = localStorage.getItem("rs-theme");
    } catch (e) {}
    if (saved) applyTheme(saved);
  }

  /* 7 — command console (Cmd/Ctrl-K). No "/" binding, so the browser's
     own quick-find on "/" keeps working. */
  function initPalette() {
    const wrap = document.getElementById("cmdk-wrap");
    const input = document.getElementById("cmdk-input");
    const list = document.getElementById("cmdk-list");
    const dataEl = document.getElementById("cmdk-data");
    if (!wrap || !input || !list || !dataEl) return;

    let CMDS = [];
    try {
      CMDS = JSON.parse(dataEl.textContent || "[]");
    } catch (e) {
      CMDS = [];
    }
    let filtered = CMDS.slice();
    let sel = 0;

    function exec(cmd) {
      if (!cmd) return;
      if (cmd.type === "theme") return applyTheme(cmd.target);
      if (cmd.type === "link") {
        const external = cmd.target.indexOf("http") === 0;
        window.open(cmd.target, external ? "_blank" : "_self", "noopener");
        return;
      }
      const el = document.querySelector(cmd.target); // nav
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }

    function paintSel() {
      Array.prototype.forEach.call(list.children, (c, i) =>
        c.setAttribute("aria-selected", String(i === sel))
      );
      const active = list.children[sel];
      if (active) active.scrollIntoView({ block: "nearest" });
    }

    function render() {
      list.innerHTML = "";
      filtered.forEach((cmd, i) => {
        const el = document.createElement("div");
        el.className = "cmdk-item";
        el.setAttribute("role", "option");
        el.setAttribute("aria-selected", String(i === sel));
        el.innerHTML =
          '<span class="c">' +
          cmd.c +
          '</span><span>' +
          cmd.t +
          '</span><span class="d">' +
          cmd.d +
          "</span>";
        el.addEventListener("click", () => {
          exec(cmd);
          closeP();
        });
        el.addEventListener("mousemove", () => {
          if (sel !== i) {
            sel = i;
            paintSel();
          }
        });
        list.appendChild(el);
      });
    }

    // fold diacritics so "rose" matches "Rosé", "resume" matches "résumé"
    function norm(s) {
      return (s || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    }
    function filterCmds() {
      const q = norm(input.value);
      filtered = CMDS.filter((c) => norm(c.t + " " + c.d).indexOf(q) !== -1);
      sel = 0;
      render();
    }

    function openP(prefill) {
      wrap.hidden = false;
      input.value = prefill || "";
      filterCmds();
      input.focus();
    }
    function closeP() {
      wrap.hidden = true;
    }

    input.addEventListener("input", filterCmds);
    wrap.addEventListener("click", (e) => {
      if (e.target === wrap) closeP();
    });

    const dockCmdk = document.getElementById("dock-cmdk");
    const dockTheme = document.getElementById("dock-theme");
    if (dockCmdk) dockCmdk.addEventListener("click", () => openP());
    if (dockTheme) dockTheme.addEventListener("click", () => openP("theme"));

    window.addEventListener("keydown", (e) => {
      const open = !wrap.hidden;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open ? closeP() : openP();
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeP();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        sel = Math.min(filtered.length - 1, sel + 1);
        paintSel();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        sel = Math.max(0, sel - 1);
        paintSel();
      } else if (e.key === "Enter") {
        e.preventDefault();
        exec(filtered[sel]);
        closeP();
      }
    });

    render();
  }

  function boot() {
    initThemes();
    initReveal();
    initBootLine();
    initGroupToggles();
    initPalette();
    requestAnimationFrame(initCanvases);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
