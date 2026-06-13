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

  function boot() {
    initReveal();
    initBootLine();
    initGroupToggles();
    requestAnimationFrame(initCanvases);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
