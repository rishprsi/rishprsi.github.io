/* ============================================================
   ANIMATIONS — canvas micro-animations, one per project type.
   Registry keys (use these in data.js `anim` fields):
     agents, nbody, search, encrypt, http, upload, chirps, rss,
     pokeball, asteroids, markdown, crawler, agentloop,
     memgraph, wordcount
   Each entry is a factory: (ctx, w, h) => draw(t, dt)
   To add a new animation, add a factory here and reference its
   key from a project in data.js.
   ============================================================ */

const C = {
  amber: "#ffb454",
  cyan: "#59c2ff",
  green: "#7fd962",
  dim: "rgba(132,148,171,0.55)",
  faint: "rgba(120,150,200,0.18)",
  bgFade: "rgba(7,11,18,0.30)",
};

const TAU = Math.PI * 2;
const rnd = (a, b) => a + Math.random() * (b - a);

const ANIMATIONS = {
  /* --- agents migrating over a distributed graph (MASS) --- */
  agents(ctx, w, h) {
    const N = 14;
    const nodes = Array.from({ length: N }, () => ({
      x: rnd(0.08, 0.92) * w,
      y: rnd(0.15, 0.85) * h,
      glow: 0,
    }));
    const edges = [];
    nodes.forEach((n, i) => {
      const dists = nodes
        .map((m, j) => ({ j, d: Math.hypot(n.x - m.x, n.y - m.y) }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      dists.forEach((o) => {
        if (
          !edges.some(
            (e) => (e.a === i && e.b === o.j) || (e.a === o.j && e.b === i),
          )
        )
          edges.push({ a: i, b: o.j });
      });
    });
    const agents = Array.from({ length: 5 }, (_, k) => ({
      e: k % edges.length,
      p: Math.random(),
      dir: 1,
      col: k % 2 ? C.amber : C.cyan,
    }));
    return (t, dt) => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = C.faint;
      ctx.lineWidth = 1;
      edges.forEach((e) => {
        ctx.beginPath();
        ctx.moveTo(nodes[e.a].x, nodes[e.a].y);
        ctx.lineTo(nodes[e.b].x, nodes[e.b].y);
        ctx.stroke();
      });
      nodes.forEach((n) => {
        n.glow = Math.max(0, n.glow - dt * 1.5);
        ctx.beginPath();
        ctx.arc(n.x, n.y, 3 + n.glow * 2.5, 0, TAU);
        ctx.fillStyle = n.glow > 0.05 ? C.amber : C.dim;
        ctx.fill();
      });
      agents.forEach((a) => {
        a.p += dt * 0.45 * a.dir;
        if (a.p >= 1 || a.p <= 0) {
          const arrived = a.p >= 1 ? edges[a.e].b : edges[a.e].a;
          nodes[arrived].glow = 1;
          const next = edges
            .map((e, i) => i)
            .filter((i) => edges[i].a === arrived || edges[i].b === arrived);
          a.e = next[Math.floor(Math.random() * next.length)];
          a.dir = edges[a.e].a === arrived ? 1 : -1;
          a.p = a.dir === 1 ? 0 : 1;
        }
        const e = edges[a.e];
        const x = nodes[e.a].x + (nodes[e.b].x - nodes[e.a].x) * a.p;
        const y = nodes[e.a].y + (nodes[e.b].y - nodes[e.a].y) * a.p;
        ctx.beginPath();
        ctx.arc(x, y, 2.6, 0, TAU);
        ctx.fillStyle = a.col;
        ctx.shadowColor = a.col;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };
  },

  /* --- gravitational orbits with trails (N-Body) --- */
  nbody(ctx, w, h) {
    const cx = w / 2,
      cy = h / 2;
    const bodies = Array.from({ length: 26 }, () => {
      const r = rnd(18, Math.min(w, h) * 0.44);
      const a = rnd(0, TAU);
      const speed = Math.sqrt(2600 / r);
      return {
        x: cx + r * Math.cos(a),
        y: cy + r * Math.sin(a),
        vx: -Math.sin(a) * speed,
        vy: Math.cos(a) * speed,
        col: Math.random() < 0.3 ? C.amber : C.cyan,
      };
    });
    ctx.fillStyle = "#070b12";
    ctx.fillRect(0, 0, w, h);
    return (t, dt) => {
      ctx.fillStyle = C.bgFade;
      ctx.fillRect(0, 0, w, h);
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, TAU);
      ctx.fillStyle = C.amber;
      ctx.shadowColor = C.amber;
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;
      const step = Math.min(dt, 0.033) * 0.1; // time-scale: lower = slower orbits
      bodies.forEach((b) => {
        const dx = cx - b.x,
          dy = cy - b.y;
        const d2 = Math.max(dx * dx + dy * dy, 120);
        const f = 2600 / d2,
          d = Math.sqrt(d2);
        b.vx += (dx / d) * f * step * 60;
        b.vy += (dy / d) * f * step * 60;
        b.x += b.vx * step * 60 * 0.016 * 60;
        b.y += b.vy * step * 60 * 0.016 * 60;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 1.6, 0, TAU);
        ctx.fillStyle = b.col;
        ctx.fill();
      });
    };
  },

  /* --- result bars re-ranking themselves (SearchBot) --- */
  search(ctx, w, h) {
    const N = 6;
    const bars = Array.from({ length: N }, (_, i) => ({
      score: Math.random(),
      target: Math.random(),
      rank: i,
      y: 0,
    }));
    let timer = 0;
    const rerank = () => {
      bars.forEach((b) => (b.target = Math.random()));
      [...bars]
        .sort((a, b) => b.target - a.target)
        .forEach((b, i) => (b.rank = i));
    };
    rerank();
    return (t, dt) => {
      ctx.clearRect(0, 0, w, h);
      timer += dt;
      if (timer > 2.4) {
        timer = 0;
        rerank();
      }
      const rowH = (h - 30) / N;
      bars.forEach((b) => {
        b.score += (b.target - b.score) * Math.min(dt * 4, 1);
        const ty = 18 + b.rank * rowH;
        b.y = b.y === 0 ? ty : b.y + (ty - b.y) * Math.min(dt * 6, 1);
        const len = 30 + b.score * (w - 90);
        ctx.fillStyle = b.rank === 0 ? C.amber : "rgba(89,194,255,0.55)";
        ctx.fillRect(34, b.y, len, rowH * 0.42);
        ctx.fillStyle = C.dim;
        ctx.font = "9px monospace";
        ctx.fillText(b.score.toFixed(2), 34 + len + 6, b.y + rowH * 0.36);
        ctx.fillStyle = b.rank === 0 ? C.amber : C.dim;
        ctx.fillText("#" + (b.rank + 1), 10, b.y + rowH * 0.36);
      });
      ctx.fillStyle = C.green;
      ctx.font = "10px monospace";
      ctx.fillText(
        "> rank_fusion(bm25, semantic)" + (Math.floor(t * 2) % 2 ? "_" : " "),
        10,
        h - 8,
      );
    };
  },

  /* --- plaintext scrambling to ciphertext (Simple Encrypt) --- */
  encrypt(ctx, w, h) {
    const plain = "meet me at the usual place at nine";
    const glyphs = "!@#$%^&*()_+-=[]{}|;:,.<>?/~ABCDEF0123456789";
    let scrambled = plain.split("");
    return (t) => {
      ctx.clearRect(0, 0, w, h);
      const period = 6;
      const phase = (t % period) / period;
      const sweep = phase < 0.5 ? phase * 2 : (1 - phase) * 2;
      const cut = Math.floor(sweep * (plain.length + 1));
      ctx.font = "12px monospace";
      const charW = ctx.measureText("m").width;
      const startX = Math.max(8, (w - plain.length * charW) / 2);
      const y = h / 2 - 8;
      for (let i = 0; i < plain.length; i++) {
        if (i < cut) {
          if (Math.random() < 0.18)
            scrambled[i] = glyphs[Math.floor(Math.random() * glyphs.length)];
          ctx.fillStyle = C.amber;
          ctx.fillText(scrambled[i], startX + i * charW, y);
        } else {
          ctx.fillStyle = C.dim;
          ctx.fillText(plain[i], startX + i * charW, y);
        }
      }
      const sx = startX + cut * charW;
      ctx.fillStyle = C.green;
      ctx.fillRect(sx, y - 12, 2, 16);
      ctx.font = "10px monospace";
      ctx.fillStyle = C.green;
      ctx.fillText(
        phase < 0.5 ? "> aes-256-gcm encrypt..." : "> decrypting...",
        10,
        h - 10,
      );
      ctx.fillStyle = C.dim;
      ctx.fillText("🔒", w - 24, h - 10);
    };
  },

  /* --- request/response packets (MyOwnHTTP) --- */
  http(ctx, w, h) {
    const cy = h / 2;
    return (t) => {
      ctx.clearRect(0, 0, w, h);
      const period = 3.2;
      const p = (t % period) / period;
      // client
      ctx.beginPath();
      ctx.arc(28, cy, 9, 0, TAU);
      ctx.strokeStyle = C.cyan;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = C.dim;
      ctx.font = "9px monospace";
      ctx.fillText("client", 12, cy + 24);
      // server
      ctx.strokeStyle = C.amber;
      ctx.strokeRect(w - 52, cy - 16, 32, 32);
      ctx.fillText("tcp:42069", w - 64, cy + 30);
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = i === Math.floor(t * 2) % 3 ? C.amber : C.dim;
        ctx.fillRect(w - 46, cy - 9 + i * 8, 20, 3);
      }
      // wire
      ctx.strokeStyle = C.faint;
      ctx.beginPath();
      ctx.moveTo(40, cy);
      ctx.lineTo(w - 54, cy);
      ctx.stroke();
      const x0 = 44,
        x1 = w - 58;
      ctx.font = "10px monospace";
      if (p < 0.42) {
        const x = x0 + (x1 - x0) * (p / 0.42);
        ctx.fillStyle = C.cyan;
        ctx.fillRect(x - 5, cy - 4, 10, 8);
        ctx.fillText("GET /", x - 14, cy - 10);
      } else if (p < 0.55) {
        ctx.fillStyle = C.amber;
        ctx.fillText("parsing...", w - 110, cy - 24);
      } else {
        const q = (p - 0.55) / 0.45;
        for (let c = 0; c < 3; c++) {
          const cp = q - c * 0.16;
          if (cp > 0 && cp < 1) {
            const x = x1 - (x1 - x0) * cp;
            ctx.fillStyle = C.green;
            ctx.fillRect(x - 4, cy - 3, 8, 6);
          }
        }
        ctx.fillStyle = C.green;
        ctx.fillText("200 OK · chunked", x0 + 10, cy - 10);
      }
    };
  },

  /* --- frames flying into the cloud (Tubely) --- */
  upload(ctx, w, h) {
    const frames = Array.from({ length: 5 }, (_, i) => ({ p: -i * 0.22 }));
    return (t, dt) => {
      ctx.clearRect(0, 0, w, h);
      const cloudX = w - 58,
        cloudY = 40;
      // cloud
      ctx.strokeStyle = C.cyan;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cloudX - 14, cloudY + 6, 10, Math.PI * 0.5, Math.PI * 1.5);
      ctx.arc(cloudX - 4, cloudY - 4, 11, Math.PI * 0.9, Math.PI * 1.9);
      ctx.arc(cloudX + 12, cloudY + 2, 9, Math.PI * 1.2, Math.PI * 0.4);
      ctx.lineTo(cloudX - 14, cloudY + 16);
      ctx.stroke();
      ctx.fillStyle = C.dim;
      ctx.font = "9px monospace";
      ctx.fillText("s3 + cdn", cloudX - 22, cloudY + 32);
      // film strip source
      const sx = 22,
        sy = h - 34;
      ctx.strokeStyle = C.amber;
      ctx.strokeRect(sx - 12, sy - 10, 30, 22);
      for (let i = 0; i < 3; i++) ctx.strokeRect(sx - 9 + i * 9, sy - 6, 6, 13);
      ctx.fillStyle = C.dim;
      ctx.fillText("video.mp4", sx - 12, sy + 26);
      // path
      frames.forEach((f) => {
        f.p += dt * 0.28;
        if (f.p > 1.05) f.p = -0.1;
        if (f.p < 0) return;
        const x = sx + (cloudX - sx) * f.p;
        const y = sy + (cloudY + 14 - sy) * f.p - Math.sin(f.p * Math.PI) * 26;
        const s = 1 - f.p * 0.4;
        ctx.globalAlpha = f.p > 0.9 ? (1.05 - f.p) * 6.7 : 1;
        ctx.fillStyle = C.amber;
        ctx.fillRect(x - 6 * s, y - 4 * s, 12 * s, 8 * s);
        ctx.globalAlpha = 1;
      });
      // progress bar
      const prog = (t * 0.13) % 1;
      ctx.strokeStyle = C.faint;
      ctx.strokeRect(60, h - 18, w - 130, 6);
      ctx.fillStyle = C.green;
      ctx.fillRect(60, h - 18, (w - 130) * prog, 6);
      ctx.fillStyle = C.dim;
      ctx.fillText(Math.floor(prog * 100) + "%", w - 60, h - 12);
    };
  },

  /* --- chirps floating up (Chirpy) --- */
  chirps(ctx, w, h) {
    const bubbles = [];
    let spawn = 0;
    const texts = ["chirp!", "201 ✓", "@user", "chirp?", "JWT ok"];
    return (t, dt) => {
      ctx.clearRect(0, 0, w, h);
      spawn -= dt;
      if (spawn <= 0) {
        bubbles.push({
          x: rnd(30, w - 70),
          y: h + 14,
          vy: rnd(18, 30),
          txt: texts[Math.floor(Math.random() * texts.length)],
          col: Math.random() < 0.3 ? C.amber : C.cyan,
        });
        spawn = rnd(0.5, 1.1);
      }
      ctx.font = "10px monospace";
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.y -= b.vy * dt;
        if (b.y < -20) {
          bubbles.splice(i, 1);
          continue;
        }
        const alpha = Math.min(1, (h - b.y) / 40, b.y / 50);
        ctx.globalAlpha = Math.max(0, alpha);
        const tw = ctx.measureText(b.txt).width + 14;
        ctx.strokeStyle = b.col;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y - 12, tw, 18, 8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(b.x + 8, b.y + 6);
        ctx.lineTo(b.x + 4, b.y + 12);
        ctx.lineTo(b.x + 14, b.y + 6);
        ctx.stroke();
        ctx.fillStyle = b.col;
        ctx.fillText(b.txt, b.x + 7, b.y + 1);
      }
      ctx.globalAlpha = 1;
    };
  },

  /* --- feed items flowing into Postgres (BlogAggregator) --- */
  rss(ctx, w, h) {
    const sources = [0.25, 0.5, 0.75].map((f) => ({
      y: f * h,
      next: rnd(0, 2),
    }));
    const items = [];
    return (t, dt) => {
      ctx.clearRect(0, 0, w, h);
      const dbX = w - 44,
        dbY = h / 2;
      // db cylinder
      ctx.strokeStyle = C.amber;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(dbX, dbY - 18, 16, 6, 0, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(dbX - 16, dbY - 18);
      ctx.lineTo(dbX - 16, dbY + 16);
      ctx.ellipse(dbX, dbY + 16, 16, 6, 0, Math.PI, 0, true);
      ctx.lineTo(dbX + 16, dbY - 18);
      ctx.stroke();
      ctx.fillStyle = C.dim;
      ctx.font = "9px monospace";
      ctx.fillText("postgres", dbX - 22, dbY + 36);
      // sources
      sources.forEach((s, i) => {
        ctx.fillStyle = C.cyan;
        ctx.font = "11px monospace";
        ctx.fillText("((·))", 8, s.y + 4);
        s.next -= dt;
        if (s.next <= 0) {
          items.push({ x: 44, y: s.y, ty: dbY, p: 0 });
          s.next = rnd(1.2, 2.6);
        }
      });
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        it.p += dt * 0.5;
        if (it.p >= 1) {
          items.splice(i, 1);
          continue;
        }
        const x = it.x + (dbX - 24 - it.x) * it.p;
        const y = it.y + (it.ty - it.y) * it.p * it.p;
        ctx.globalAlpha = it.p > 0.85 ? (1 - it.p) * 6.7 : 1;
        ctx.strokeStyle = C.cyan;
        ctx.strokeRect(x, y - 5, 22, 10);
        ctx.fillStyle = C.faint;
        ctx.fillRect(x + 3, y - 2, 16, 1.5);
        ctx.fillRect(x + 3, y + 1, 12, 1.5);
        ctx.globalAlpha = 1;
      }
    };
  },

  /* --- catching wild dots (Pokedex) --- */
  pokeball(ctx, w, h) {
    const wild = Array.from({ length: 6 }, () => ({
      x: rnd(20, w - 20),
      y: rnd(15, h - 40),
      a: rnd(0, TAU),
      caught: 0,
    }));
    let flash = 0;
    return (t, dt) => {
      ctx.clearRect(0, 0, w, h);
      const bx = w / 2,
        by = h - 22;
      const bounce = Math.abs(Math.sin(t * 2.4)) * 5;
      // ball
      const r = 9;
      ctx.save();
      ctx.translate(bx, by - bounce);
      ctx.beginPath();
      ctx.arc(0, 0, r, Math.PI, 0);
      ctx.fillStyle = "#e8554d";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI);
      ctx.fillStyle = "#e6e9ef";
      ctx.fill();
      ctx.strokeStyle = "#070b12";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-r, 0);
      ctx.lineTo(r, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, TAU);
      ctx.fillStyle = "#e6e9ef";
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      flash = Math.max(0, flash - dt * 2);
      if (flash > 0) {
        ctx.beginPath();
        ctx.arc(bx, by - bounce, r + 6 + (1 - flash) * 14, 0, TAU);
        ctx.strokeStyle = `rgba(255,180,84,${flash})`;
        ctx.stroke();
      }
      wild.forEach((d) => {
        if (d.caught > 0) {
          d.caught += dt * 1.4;
          if (d.caught >= 1) {
            d.x = rnd(20, w - 20);
            d.y = rnd(15, h - 50);
            d.caught = 0;
            flash = 1;
            return;
          }
          const p = d.caught;
          const x = d.x + (bx - d.x) * p,
            y = d.y + (by - bounce - d.y) * p;
          ctx.beginPath();
          ctx.arc(x, y, 3 * (1 - p), 0, TAU);
          ctx.fillStyle = C.amber;
          ctx.fill();
          return;
        }
        d.a += rnd(-1.5, 1.5) * dt;
        d.x += Math.cos(d.a) * 14 * dt;
        d.y += Math.sin(d.a) * 14 * dt;
        d.x = Math.max(12, Math.min(w - 12, d.x));
        d.y = Math.max(12, Math.min(h - 45, d.y));
        if (Math.random() < dt * 0.12) d.caught = 0.01;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 3, 0, TAU);
        ctx.fillStyle = C.cyan;
        ctx.fill();
      });
      ctx.fillStyle = C.dim;
      ctx.font = "9px monospace";
      ctx.fillText("gotta cache 'em all", 10, h - 8);
    };
  },

  /* --- drifting rocks and a lone ship (Asteroids) --- */
  asteroids(ctx, w, h) {
    const mkRock = (size) => ({
      x: rnd(0, w),
      y: rnd(0, h),
      vx: rnd(-14, 14),
      vy: rnd(-12, 12),
      size,
      rot: rnd(0, TAU),
      vr: rnd(-0.8, 0.8),
      pts: Array.from({ length: 8 }, () => rnd(0.7, 1.25)),
    });
    const rocks = Array.from({ length: 6 }, () => mkRock(rnd(7, 14)));
    let shipA = 0;
    const bullets = [];
    let fire = 0;
    return (t, dt) => {
      ctx.clearRect(0, 0, w, h);
      const sx = w / 2,
        sy = h / 2;
      shipA += dt * 0.7;
      // ship
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(shipA);
      ctx.strokeStyle = C.amber;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(9, 0);
      ctx.lineTo(-7, 6);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-7, -6);
      ctx.closePath();
      ctx.stroke();
      if (Math.floor(t * 8) % 3 === 0) {
        ctx.beginPath();
        ctx.moveTo(-7, 2);
        ctx.lineTo(-12, 0);
        ctx.lineTo(-7, -2);
        ctx.strokeStyle = C.cyan;
        ctx.stroke();
      }
      ctx.restore();
      fire -= dt;
      if (fire <= 0) {
        bullets.push({
          x: sx,
          y: sy,
          vx: Math.cos(shipA) * 90,
          vy: Math.sin(shipA) * 90,
          life: 1.4,
        });
        fire = 1.1;
      }
      ctx.fillStyle = C.green;
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.life -= dt;
        if (b.life <= 0) {
          bullets.splice(i, 1);
          continue;
        }
        ctx.fillRect(b.x - 1, b.y - 1, 2.5, 2.5);
        rocks.forEach((r, ri) => {
          if (Math.hypot(b.x - r.x, b.y - r.y) < r.size) {
            b.life = 0;
            if (r.size > 8) {
              rocks[ri] = mkRock(r.size * 0.55);
              rocks[ri].x = r.x;
              rocks[ri].y = r.y;
              const r2 = mkRock(r.size * 0.55);
              r2.x = r.x;
              r2.y = r.y;
              rocks.push(r2);
              if (rocks.length > 9) rocks.shift();
            } else {
              Object.assign(rocks[ri], mkRock(rnd(8, 14)));
            }
          }
        });
      }
      ctx.strokeStyle = C.dim;
      ctx.lineWidth = 1.2;
      rocks.forEach((r) => {
        r.x = (r.x + r.vx * dt + w) % w;
        r.y = (r.y + r.vy * dt + h) % h;
        r.rot += r.vr * dt;
        ctx.save();
        ctx.translate(r.x, r.y);
        ctx.rotate(r.rot);
        ctx.beginPath();
        r.pts.forEach((p, i) => {
          const a = (i / r.pts.length) * TAU;
          const px = Math.cos(a) * r.size * p,
            py = Math.sin(a) * r.size * p;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      });
    };
  },

  /* --- markdown morphing into HTML (StaticSiteGenerator) --- */
  markdown(ctx, w, h) {
    const rows = [
      ["# Title", "<h1>Title</h1>"],
      ["**bold**", "<b>bold</b>"],
      ["- item", "<li>item</li>"],
      ["[link](#)", "<a>link</a>"],
      ["`code`", "<code/>"],
    ];
    return (t) => {
      ctx.clearRect(0, 0, w, h);
      const rowH = (h - 24) / rows.length;
      const active = Math.floor(t * 0.8) % rows.length;
      ctx.font = "10px monospace";
      rows.forEach((r, i) => {
        const y = 20 + i * rowH + rowH / 2;
        const isA = i === active;
        ctx.fillStyle = isA ? C.amber : C.dim;
        ctx.fillText(r[0], 12, y);
        ctx.fillStyle = isA ? C.green : C.faint;
        const arrowP = isA ? (t * 0.8) % 1 : 0;
        ctx.fillText(
          "─".repeat(3) + "▶",
          w / 2 - 26 + (isA ? Math.sin(arrowP * Math.PI) * 4 : 0),
          y,
        );
        ctx.fillStyle = isA ? C.cyan : C.dim;
        ctx.fillText(r[1], w / 2 + 14, y);
      });
      ctx.fillStyle = C.green;
      ctx.fillText("> generating site...", 12, h - 6);
    };
  },

  /* --- BFS over a site map (WebScraper) --- */
  crawler(ctx, w, h) {
    // 3-level tree
    const nodes = [{ x: w / 2, y: 22, visited: 1, parent: -1 }];
    for (let i = 0; i < 3; i++)
      nodes.push({
        x: w * (0.2 + i * 0.3),
        y: h * 0.45,
        visited: 0,
        parent: 0,
      });
    for (let i = 0; i < 6; i++)
      nodes.push({
        x: w * (0.1 + i * 0.16),
        y: h * 0.78,
        visited: 0,
        parent: 1 + Math.floor(i / 2),
      });
    let order = [1, 2, 3, 4, 5, 6, 7, 8, 9],
      oi = 0,
      p = 0;
    return (t, dt) => {
      ctx.clearRect(0, 0, w, h);
      nodes.forEach((n, i) => {
        if (n.parent >= 0) {
          const par = nodes[n.parent];
          ctx.strokeStyle = n.visited ? "rgba(255,180,84,0.4)" : C.faint;
          ctx.beginPath();
          ctx.moveTo(par.x, par.y);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }
      });
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.visited ? 5 : 4, 0, TAU);
        ctx.fillStyle = n.visited ? C.amber : "rgba(132,148,171,0.35)";
        ctx.fill();
      });
      // spider moving to next target
      const target = nodes[order[oi]];
      const from = nodes[target.parent];
      p += dt * 0.9;
      const x = from.x + (target.x - from.x) * Math.min(p, 1);
      const y = from.y + (target.y - from.y) * Math.min(p, 1);
      ctx.beginPath();
      ctx.arc(x, y, 3.4, 0, TAU);
      ctx.fillStyle = C.green;
      ctx.shadowColor = C.green;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
      if (p >= 1) {
        target.visited = 1;
        p = 0;
        oi++;
        if (oi >= order.length) {
          oi = 0;
          nodes.forEach((n, i) => i > 0 && (n.visited = 0));
        }
      }
      ctx.fillStyle = C.dim;
      ctx.font = "9px monospace";
      ctx.fillText(
        `crawled: ${nodes.filter((n) => n.visited).length}/${nodes.length} pages`,
        10,
        h - 8,
      );
    };
  },

  /* --- the agent tool loop (BuggyAIAgent) --- */
  agentloop(ctx, w, h) {
    const labels = ["prompt", "LLM", "tool call", "result"];
    const cx = w / 2,
      cy = h / 2 - 4,
      R = Math.min(w, h) * 0.31;
    const pos = labels.map((_, i) => {
      const a = -Math.PI / 2 + (i / labels.length) * TAU;
      return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R, a };
    });
    return (t) => {
      ctx.clearRect(0, 0, w, h);
      const prog = (t * 0.35) % 1;
      const seg = Math.floor(prog * 4);
      ctx.strokeStyle = C.faint;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, TAU);
      ctx.stroke();
      pos.forEach((p, i) => {
        const active = i === seg;
        ctx.beginPath();
        ctx.arc(p.x, p.y, active ? 6 : 4.5, 0, TAU);
        ctx.fillStyle = active ? C.amber : "rgba(132,148,171,0.4)";
        ctx.fill();
        ctx.fillStyle = active ? C.amber : C.dim;
        ctx.font = "9px monospace";
        const tw = ctx.measureText(labels[i]).width;
        ctx.fillText(labels[i], p.x - tw / 2, p.y + (p.y < cy ? -12 : 20));
      });
      const a = -Math.PI / 2 + prog * TAU;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * R, cy + Math.sin(a) * R, 3, 0, TAU);
      ctx.fillStyle = C.cyan;
      ctx.shadowColor = C.cyan;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = C.green;
      ctx.font = "9px monospace";
      ctx.fillText("while not done:", 10, h - 8);
    };
  },

  /* --- hierarchical memory with importance pulses (Memory Graph) --- */
  memgraph(ctx, w, h) {
    const root = { x: w / 2, y: h * 0.28, r: 7, ph: 0 };
    const mids = [0.25, 0.5, 0.75].map((f, i) => ({
      x: w * f,
      y: h * 0.55,
      r: 5,
      ph: i * 1.3,
    }));
    const leaves = Array.from({ length: 6 }, (_, i) => ({
      x: w * (0.12 + i * 0.152),
      y: h * 0.82,
      r: 3.5,
      ph: i * 0.8,
    }));
    return (t) => {
      ctx.clearRect(0, 0, w, h);
      // semantic edges (cyan) parent->child
      mids.forEach((m, i) => {
        ctx.strokeStyle = "rgba(89,194,255,0.3)";
        ctx.beginPath();
        ctx.moveTo(root.x, root.y);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();
        leaves.slice(i * 2, i * 2 + 2).forEach((l) => {
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(l.x, l.y);
          ctx.stroke();
        });
      });
      // temporal edges (amber, dashed) between siblings
      ctx.strokeStyle = "rgba(255,180,84,0.35)";
      ctx.setLineDash([3, 4]);
      for (let i = 0; i < leaves.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(leaves[i].x, leaves[i].y);
        ctx.lineTo(leaves[i + 1].x, leaves[i + 1].y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      [root, ...mids, ...leaves].forEach((n) => {
        const pulse = 1 + Math.sin(t * 1.8 + n.ph) * 0.3;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * pulse, 0, TAU);
        ctx.fillStyle = n === root ? C.amber : C.cyan;
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      ctx.font = "9px monospace";
      ctx.fillStyle = C.dim;
      ctx.fillText("importance ∝ pagerank", 10, h - 8);
      ctx.fillStyle = "rgba(89,194,255,0.8)";
      ctx.fillText("— semantic", w - 130, h - 18);
      ctx.fillStyle = "rgba(255,180,84,0.8)";
      ctx.fillText("┄ temporal", w - 130, h - 8);
    };
  },

  /* --- letters falling into frequency bins (BookBot) --- */
  wordcount(ctx, w, h) {
    const bins = "etaoi".split("").map((ch, i) => ({ ch, n: rnd(2, 8) }));
    const letters = [];
    let spawn = 0;
    return (t, dt) => {
      ctx.clearRect(0, 0, w, h);
      spawn -= dt;
      if (spawn <= 0) {
        const bi = Math.floor(Math.random() * bins.length);
        letters.push({ bi, y: -8, x: 0 });
        spawn = rnd(0.25, 0.6);
      }
      const binW = (w - 40) / bins.length;
      const baseY = h - 26;
      const maxN = 22;
      ctx.font = "10px monospace";
      bins.forEach((b, i) => {
        const x = 20 + i * binW;
        const bh = (b.n / maxN) * (h - 60);
        ctx.fillStyle = "rgba(89,194,255,0.45)";
        ctx.fillRect(x + 6, baseY - bh, binW - 12, bh);
        ctx.fillStyle = C.amber;
        ctx.fillText(b.ch, x + binW / 2 - 3, baseY + 13);
        ctx.fillStyle = C.dim;
        ctx.fillText(String(Math.floor(b.n)), x + binW / 2 - 6, baseY - bh - 4);
      });
      for (let i = letters.length - 1; i >= 0; i--) {
        const L = letters[i];
        const x = 20 + L.bi * binW + binW / 2 - 3;
        L.y += 55 * dt;
        const b = bins[L.bi];
        const top = baseY - (b.n / maxN) * (h - 60) - 10;
        if (L.y >= top) {
          b.n = b.n >= maxN ? rnd(2, 5) : b.n + 1;
          letters.splice(i, 1);
          continue;
        }
        ctx.fillStyle = C.green;
        ctx.fillText(b.ch, x, L.y);
      }
    };
  },
};

/* ============================================================
   STAR FIELD + constellation background (#space canvas)
   ============================================================ */
function initSpace() {
  const canvas = document.getElementById("space");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let stars = [],
    nodes = [],
    edges = [],
    W = 0,
    H = 0;

  // smoothed cursor position (0..1) drives a subtle parallax offset
  const m = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  window.addEventListener(
    "mousemove",
    (e) => {
      m.tx = e.clientX / window.innerWidth;
      m.ty = e.clientY / window.innerHeight;
    },
    { passive: true }
  );

  // theme-aware colors, re-read whenever the palette changes
  let cStar = "170,196,232",
    cLine = "89,194,255",
    cNode = "255,180,84";
  function toRgb(v) {
    v = (v || "").trim();
    const x = v.replace("#", "");
    if (x.length === 3)
      return [
        parseInt(x[0] + x[0], 16),
        parseInt(x[1] + x[1], 16),
        parseInt(x[2] + x[2], 16),
      ].join(",");
    if (x.length >= 6)
      return [
        parseInt(x.slice(0, 2), 16),
        parseInt(x.slice(2, 4), 16),
        parseInt(x.slice(4, 6), 16),
      ].join(",");
    return null;
  }
  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    cLine = toRgb(cs.getPropertyValue("--cyan")) || cLine;
    cNode = toRgb(cs.getPropertyValue("--amber")) || cNode;
    cStar = toRgb(cs.getPropertyValue("--text-dim")) || cStar;
  }
  readColors();
  window.addEventListener("rs-theme-change", readColors);

  function build() {
    const dpr = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: Math.floor((W * H) / 9000) }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: rnd(0.4, 1.5),
      ph: rnd(0, TAU),
      sp: rnd(0.3, 1.2),
      z: rnd(0.3, 1), // depth: deeper stars parallax less
    }));
    nodes = Array.from({ length: 16 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: rnd(-4, 4),
      vy: rnd(-3, 3),
    }));
  }
  build();
  window.addEventListener("resize", build);

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let last = performance.now();
  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    // ease toward the cursor and turn it into a small pixel offset
    m.x += (m.tx - m.x) * 0.04;
    m.y += (m.ty - m.y) * 0.04;
    const ox = (m.x - 0.5) * 34;
    const oy = (m.y - 0.5) * 34;
    ctx.clearRect(0, 0, W, H);
    // stars (parallax scaled by depth)
    stars.forEach((s) => {
      const tw = 0.5 + 0.5 * Math.sin((now / 1000) * s.sp + s.ph);
      ctx.globalAlpha = 0.25 + tw * 0.5;
      ctx.fillStyle = `rgb(${cStar})`;
      ctx.fillRect(s.x + ox * s.z * 0.5, s.y + oy * s.z * 0.5, s.r, s.r);
    });
    ctx.globalAlpha = 1;
    // constellation
    nodes.forEach((n) => {
      n.x = (n.x + n.vx * dt + W) % W;
      n.y = (n.y + n.vy * dt + H) % H;
    });
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (d < 190) {
          ctx.strokeStyle = `rgba(${cLine},${(1 - d / 190) * 0.1})`;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x + ox, nodes[i].y + oy);
          ctx.lineTo(nodes[j].x + ox, nodes[j].y + oy);
          ctx.stroke();
        }
      }
    }
    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.arc(n.x + ox, n.y + oy, 1.6, 0, TAU);
      ctx.fillStyle = `rgba(${cNode},0.35)`;
      ctx.fill();
    });
    if (!reduced) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ============================================================
   ANIMATION MANAGER — sizes canvases for DPR, runs only the
   animations currently visible in the viewport.
   ============================================================ */
const AnimManager = (() => {
  const entries = new Map(); // canvas -> {key, draw, ctx, w, h, t}
  const active = new Set();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setup(canvas, key) {
    const factory = ANIMATIONS[key];
    if (!factory) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(rect.width, 50),
      h = Math.max(rect.height, 50);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    entries.set(canvas, {
      key,
      ctx,
      w,
      h,
      draw: factory(ctx, w, h),
      t: rnd(0, 10),
    });
  }

  const observer = new IntersectionObserver(
    (obs) =>
      obs.forEach((o) => {
        if (o.isIntersecting) active.add(o.target);
        else active.delete(o.target);
      }),
    { rootMargin: "60px" },
  );

  let last = performance.now();
  function loop(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    active.forEach((canvas) => {
      const e = entries.get(canvas);
      if (!e) return;
      e.t += dt;
      e.draw(e.t, dt);
    });
    requestAnimationFrame(loop);
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      entries.forEach((e, canvas) => setup(canvas, e.key));
    }, 200);
  });

  return {
    register(canvas, key) {
      setup(canvas, key);
      if (reduced) {
        const e = entries.get(canvas);
        if (e) e.draw(1, 0.016); // single static frame
        return;
      }
      observer.observe(canvas);
    },
    start() {
      if (!reduced) requestAnimationFrame(loop);
    },
  };
})();
