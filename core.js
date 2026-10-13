/* 視光光學實驗台 — 共用程式
   提供：章節清單、導覽列、主題切換、Stage（光學台畫布）、近軸光線追跡、控制元件、預測題、測驗、學習進度。
   純 JavaScript，無外部相依，可直接放在 GitHub Pages。 */
(function () {
  "use strict";

  const CHAPTERS = [
    { id: "ch01", no: 1, zh: "基本名詞與觀念", en: "Basic Terms and Concepts" },
    { id: "ch02", no: 2, zh: "球面折射", en: "Refraction at Spherical Surfaces" },
    { id: "ch03", no: 3, zh: "聚散度關係", en: "The Vergence Relationship" },
    { id: "ch04", no: 4, zh: "薄透鏡", en: "Thin Lenses" },
    { id: "ch05", no: 5, zh: "多面光學系統", en: "Optical Systems with Multiple Surfaces" },
    { id: "ch06", no: 6, zh: "厚透鏡", en: "Thick Lenses" },
    { id: "ch07", no: 7, zh: "屈光不正", en: "Ametropia" },
    { id: "ch08", no: 8, zh: "調節", en: "Accommodation" },
    { id: "ch09", no: 9, zh: "柱面鏡與散光", en: "Cylindrical Lenses & Astigmatism" },
    { id: "ch10", no: 10, zh: "稜鏡", en: "Prisms" },
    { id: "ch11", no: 11, zh: "景深", en: "Depth of Field" },
    { id: "ch12", no: 12, zh: "放大率與低視力輔具", en: "Magnification & Low Vision Devices" },
    { id: "ch13", no: 13, zh: "視網膜像大小", en: "Retinal Image Size" },
    { id: "ch14", no: 14, zh: "反射", en: "Reflection" },
    { id: "ch15", no: 15, zh: "像差", en: "Aberrations" },
  ];

  /* ---------- 儲存（容錯） ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 無痕模式等情況忽略 */ } },
  };

  /* ---------- 主題 ---------- */
  const THEME_KEY = "ob-theme";
  function applyTheme(t) {
    const r = document.documentElement;
    if (t === "light" || t === "dark") r.setAttribute("data-theme", t); else r.removeAttribute("data-theme");
    document.dispatchEvent(new CustomEvent("ob-theme"));
  }
  applyTheme(store.get(THEME_KEY, "system"));
  try {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => document.dispatchEvent(new CustomEvent("ob-theme")));
  } catch (e) { /* 舊瀏覽器 */ }

  function colors() {
    const cs = getComputedStyle(document.documentElement);
    const g = (n) => cs.getPropertyValue(n).trim();
    return {
      bg: g("--canvas"), ink: g("--ink"), muted: g("--muted"), line: g("--line"), grid: g("--grid"),
      accent: g("--accent"), ray: g("--ray"), ray2: g("--ray-2"), ray3: g("--ray-3"), virtual: g("--virtual"),
      glass: g("--glass"), glassEdge: g("--glass-edge"), ok: g("--ok"), warn: g("--warn"), bad: g("--bad"),
      retina: g("--retina"), surface: g("--surface"), surface2: g("--surface-2"),
      mono: g("--font-mono"), body: g("--font-body"),
    };
  }

  /* ---------- 導覽 ---------- */
  const LOGO = '<svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true"><path d="M15 3 C20 9 20 21 15 27 C10 21 10 9 15 3Z" fill="var(--glass)" stroke="var(--glass-edge)" stroke-width="1.5"/><path d="M2 10 L15 10 L28 20" stroke="var(--ray)" stroke-width="1.6" fill="none"/><path d="M2 20 L15 20 L28 10" stroke="var(--ray)" stroke-width="1.6" fill="none" opacity=".55"/></svg>';

  function mountChrome(currentId) {
    const header = document.getElementById("topbar");
    if (header) {
      header.className = "topbar";
      const opts = CHAPTERS.map((c) => `<option value="${c.id}" ${c.id === currentId ? "selected" : ""}>第 ${c.no} 章　${c.zh}</option>`).join("");
      header.innerHTML = `<div class="topbar-inner">
        <a class="brand" href="index.html">${LOGO}<span>視光光學實驗台<small>GEOMETRICAL &amp; VISUAL OPTICS LAB</small></span></a>
        <div class="spacer"></div>
        <select class="chapter-select" id="chapter-jump" aria-label="跳至章節"><option value="index">— 章節目錄 —</option>${opts}</select>
        <button class="theme-btn" id="theme-btn" type="button"></button>
      </div>`;
      header.querySelector("#chapter-jump").addEventListener("change", (e) => {
        location.href = e.target.value === "index" ? "index.html" : e.target.value + ".html";
      });
      const btn = header.querySelector("#theme-btn");
      const label = () => {
        const t = store.get(THEME_KEY, "system");
        btn.textContent = t === "dark" ? "深色" : t === "light" ? "淺色" : "跟隨系統";
        btn.setAttribute("aria-label", "切換配色，目前：" + btn.textContent);
      };
      label();
      btn.addEventListener("click", () => {
        const order = ["system", "light", "dark"];
        const t = order[(order.indexOf(store.get(THEME_KEY, "system")) + 1) % 3];
        store.set(THEME_KEY, t); applyTheme(t); label();
      });
    }
    const pager = document.getElementById("pager");
    if (pager && currentId) {
      const i = CHAPTERS.findIndex((c) => c.id === currentId);
      const prev = CHAPTERS[i - 1], next = CHAPTERS[i + 1];
      pager.className = "pager";
      pager.innerHTML =
        (prev ? `<a class="prev" href="${prev.id}.html"><small>← 上一章</small>第 ${prev.no} 章　${prev.zh}</a>` : `<a class="prev" href="index.html"><small>← 回到</small>章節目錄</a>`) +
        (next ? `<a class="next" href="${next.id}.html"><small>下一章 →</small>第 ${next.no} 章　${next.zh}</a>` : `<a class="next" href="index.html"><small>完成 →</small>回到章節目錄</a>`);
    }
    const foot = document.getElementById("footer");
    if (foot) {
      foot.className = "site";
      const cfg = window.OB_CONFIG || {};
      const cp = cfg.copyright || {};
      const devs = (cfg.developers || []).map((d) => `${esc(d.name)}${d.role ? "（" + esc(d.role) + "）" : ""}`).join("、");
      foot.innerHTML = `<div class="wrap foot-grid">
        ${devs ? `<div><b>開發者</b>　${devs}</div>` : ""}
        ${cp.holder ? `<div class="copy">© ${esc(String(cp.year || new Date().getFullYear()))} ${esc(cp.holder)}${cp.note ? "　" + esc(cp.note) : ""}</div>` : ""}
        <div>教學用互動教材，內容依 Schwartz《Geometrical and Visual Optics》(2nd ed.) 各章主題設計；模擬採近軸（paraxial）近似。符號慣例：光由左向右行進，距離由光學面量起，左負右正。</div>
      </div>`;
    }
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]); }

  /* ---------- Stage：光學台畫布 ---------- */
  class Stage {
    constructor(canvas, opt) {
      this.cv = typeof canvas === "string" ? document.getElementById(canvas) : canvas;
      this.ctx = this.cv.getContext("2d");
      this.opt = Object.assign({ xmin: -10, xmax: 10, ymin: -5, ymax: 5, aspect: 0.5, minH: 260, maxH: 460, equal: false }, opt);
      this.drawFn = this.opt.draw || (() => {});
      this.handles = [];
      this.dragging = null;
      this._raf = 0;
      const ro = new ResizeObserver(() => this.resize());
      ro.observe(this.cv.parentElement);
      document.addEventListener("ob-theme", () => this.render());
      this._bindPointer();
      this.resize();
    }
    setView(v) { Object.assign(this.opt, v); this._compute(); this.render(); }
    resize() {
      const w = Math.max(100, this.cv.parentElement.clientWidth);
      const h = Math.round(Math.min(this.opt.maxH, Math.max(this.opt.minH, w * this.opt.aspect)));
      const dpr = window.devicePixelRatio || 1;
      this.w = w; this.h = h; this.dpr = dpr;
      this.cv.style.height = h + "px";
      this.cv.width = Math.round(w * dpr); this.cv.height = Math.round(h * dpr);
      this._compute();
      this.render();
    }
    _compute() {
      const o = this.opt;
      this.sx = this.w / (o.xmax - o.xmin);
      this.sy = this.h / (o.ymax - o.ymin);
      this.ox = 0; this.oy = 0;
      if (o.equal) {
        const s = Math.min(this.sx, this.sy);
        this.ox = (this.w - s * (o.xmax - o.xmin)) / 2; this.oy = (this.h - s * (o.ymax - o.ymin)) / 2;
        this.sx = this.sy = s;
      }
    }
    X(x) { return this.ox + (x - this.opt.xmin) * this.sx; }
    Y(y) { return this.h - this.oy - (y - this.opt.ymin) * this.sy; }
    wx(px) { return (px - this.ox) / this.sx + this.opt.xmin; }
    wy(py) { return (this.h - this.oy - py) / this.sy + this.opt.ymin; }
    render() {
      cancelAnimationFrame(this._raf);
      this._raf = requestAnimationFrame(() => {
        const c = this.ctx;
        c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        c.clearRect(0, 0, this.w, this.h);
        this.c = colors();
        c.fillStyle = this.c.bg; c.fillRect(0, 0, this.w, this.h);
        c.lineCap = "round"; c.lineJoin = "round";
        this.drawFn(this, this.c);
        for (const hd of this.handles) if (hd.visible !== false && (!hd.show || hd.show())) this._drawHandle(hd);
      });
    }
    /* --- 拖曳 --- */
    addHandle(h) { this.handles.push(h); return h; }
    _drawHandle(h) {
      const [x, y] = h.pos(); const c = this.ctx;
      c.save(); c.beginPath(); c.arc(this.X(x), this.Y(y), 7, 0, Math.PI * 2);
      c.fillStyle = this.c.surface; c.fill(); c.lineWidth = 2; c.strokeStyle = h.color || this.c.accent; c.stroke(); c.restore();
    }
    _bindPointer() {
      const pt = (e) => { const r = this.cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
      const find = (px, py) => this.handles.find((h) => {
        if (h.show && !h.show()) return false;
        const [x, y] = h.pos(); return Math.hypot(this.X(x) - px, this.Y(y) - py) < (h.r || 18);
      });
      this.cv.addEventListener("pointerdown", (e) => {
        const [px, py] = pt(e); const h = find(px, py);
        if (h) { this.dragging = h; this.cv.setPointerCapture(e.pointerId); e.preventDefault(); }
      });
      this.cv.addEventListener("pointermove", (e) => {
        const [px, py] = pt(e);
        if (this.dragging) { this.dragging.drag(this.wx(px), this.wy(py)); this.render(); }
        else this.cv.style.cursor = find(px, py) ? "grab" : "default";
      });
      const up = () => { if (this.dragging && this.dragging.end) this.dragging.end(); this.dragging = null; };
      this.cv.addEventListener("pointerup", up); this.cv.addEventListener("pointercancel", up);
    }
    /* --- 繪圖基本元件（世界座標） --- */
    line(x1, y1, x2, y2, o = {}) {
      const c = this.ctx; c.save();
      c.strokeStyle = o.color || this.c.ink; c.lineWidth = o.w || 1.6; c.globalAlpha = o.alpha == null ? 1 : o.alpha;
      if (o.dash) c.setLineDash(o.dash === true ? [6, 5] : o.dash);
      c.beginPath(); c.moveTo(this.X(x1), this.Y(y1)); c.lineTo(this.X(x2), this.Y(y2)); c.stroke(); c.restore();
    }
    poly(pts, o = {}) {
      if (pts.length < 2) return;
      const c = this.ctx; c.save();
      c.strokeStyle = o.color || this.c.ink; c.lineWidth = o.w || 1.6; c.globalAlpha = o.alpha == null ? 1 : o.alpha;
      if (o.dash) c.setLineDash(o.dash === true ? [6, 5] : o.dash);
      c.beginPath(); c.moveTo(this.X(pts[0][0]), this.Y(pts[0][1]));
      for (let i = 1; i < pts.length; i++) c.lineTo(this.X(pts[i][0]), this.Y(pts[i][1]));
      if (o.close) c.closePath();
      if (o.fill) { c.fillStyle = o.fill; c.fill(); }
      if (o.w !== 0) c.stroke();
      c.restore();
    }
    /* 光線：折線，每段中央加箭頭 */
    ray(pts, o = {}) {
      this.poly(pts, o);
      if (o.arrows === false) return;
      for (let i = 0; i < pts.length - 1; i++) {
        const x1 = this.X(pts[i][0]), y1 = this.Y(pts[i][1]), x2 = this.X(pts[i + 1][0]), y2 = this.Y(pts[i + 1][1]);
        const L = Math.hypot(x2 - x1, y2 - y1); if (L < 30) continue;
        const t = o.at == null ? 0.5 : o.at;
        this.arrowHead(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, Math.atan2(y2 - y1, x2 - x1), o.color || this.c.ray, o.alpha);
      }
    }
    arrowHead(px, py, ang, color, alpha) {
      const c = this.ctx, s = 7; c.save(); c.globalAlpha = alpha == null ? 1 : alpha;
      c.translate(px, py); c.rotate(ang); c.fillStyle = color;
      c.beginPath(); c.moveTo(s, 0); c.lineTo(-s * 0.8, s * 0.6); c.lineTo(-s * 0.8, -s * 0.6); c.closePath(); c.fill(); c.restore();
    }
    text(s, x, y, o = {}) {
      const c = this.ctx; c.save();
      c.font = `${o.weight || 500} ${o.size || 12}px ${o.font || this.c.body}`;
      c.textAlign = o.align || "center"; c.textBaseline = o.base || "middle";
      let px = (o.px ? x : this.X(x)) + (o.dx || 0), py = (o.px ? y : this.Y(y)) + (o.dy || 0);
      if (o.bg) {
        const m = c.measureText(s), w = m.width + 8, hgt = (o.size || 12) + 6;
        let bx = px - (c.textAlign === "center" ? w / 2 : c.textAlign === "right" ? w - 4 : 4);
        c.fillStyle = o.bg; c.globalAlpha = 0.85; c.fillRect(bx, py - hgt / 2, w, hgt); c.globalAlpha = 1;
      }
      c.fillStyle = o.color || this.c.ink; c.fillText(s, px, py); c.restore();
    }
    axis(o = {}) {
      this.line(this.opt.xmin, 0, this.opt.xmax, 0, { color: this.c.muted, w: 1, dash: [10, 4, 2, 4], alpha: 0.8 });
      if (o.label !== false) this.text("光軸", this.opt.xmax, 0, { px: false, align: "right", dy: -10, dx: -6, size: 11, color: this.c.muted });
    }
    gridX(step, o = {}) {
      const c = this.c;
      for (let x = Math.ceil(this.opt.xmin / step) * step; x <= this.opt.xmax; x += step)
        this.line(x, this.opt.ymin, x, this.opt.ymax, { color: c.grid, w: 1 });
      if (o.labels) for (let x = Math.ceil(this.opt.xmin / step) * step; x <= this.opt.xmax; x += step)
        this.text(o.labels(x), x, this.opt.ymin, { dy: -9, size: 10, color: c.muted, font: c.mono });
    }
    point(x, y, label, o = {}) {
      const c = this.ctx; c.save(); c.beginPath(); c.arc(this.X(x), this.Y(y), o.r || 3.5, 0, Math.PI * 2);
      c.fillStyle = o.color || this.c.ink; c.fill(); c.restore();
      if (label) this.text(label, x, y, { dy: o.dy == null ? 14 : o.dy, dx: o.dx || 0, color: o.color || this.c.ink, size: o.size || 12, weight: 700, font: this.c.mono });
    }
    /* 物體／像箭頭 */
    arrowObj(x, h, o = {}) {
      const color = o.color || this.c.ink;
      this.line(x, 0, x, h, { color, w: o.w || 2.4, dash: o.dash });
      const ang = h >= 0 ? -Math.PI / 2 : Math.PI / 2;
      const c = this.ctx; c.save(); if (o.dash) c.globalAlpha = 0.8;
      this.arrowHead(this.X(x), this.Y(h), ang, color); c.restore();
      if (o.label) this.text(o.label, x, h, { dy: h >= 0 ? -12 : 14, color, weight: 700, size: 12 });
    }
    /* 透鏡：power>0 凸，<0 凹，0 平 */
    lens(x, hh, power, o = {}) {
      const c = this.ctx, X = this.X(x), y1 = this.Y(hh), y2 = this.Y(-hh);
      const bulge = Math.max(-12, Math.min(12, (o.bulge != null ? o.bulge : power * 0.9)));
      const half = 4;
      c.save(); c.beginPath();
      if (power >= 0) {
        c.moveTo(X, y1); c.quadraticCurveTo(X + half + bulge * 1.6, (y1 + y2) / 2, X, y2);
        c.quadraticCurveTo(X - half - bulge * 1.6, (y1 + y2) / 2, X, y1);
      } else {
        const b = -bulge, e = half + 6;
        c.moveTo(X - e, y1); c.lineTo(X + e, y1); c.quadraticCurveTo(X + e - b * 1.6, (y1 + y2) / 2, X + e, y2);
        c.lineTo(X - e, y2); c.quadraticCurveTo(X - e + b * 1.6, (y1 + y2) / 2, X - e, y1);
      }
      c.closePath(); c.fillStyle = this.c.glass; c.fill(); c.strokeStyle = this.c.glassEdge; c.lineWidth = 1.4; c.stroke(); c.restore();
      if (o.label) this.text(o.label, x, hh, { dy: -12, color: this.c.accent, weight: 700, size: 12 });
    }
    /* 將射線（點+斜率）延長到畫面邊界 */
    extend(x0, y0, s, dir) {
      const xe = dir > 0 ? this.opt.xmax : this.opt.xmin;
      return [xe, y0 + s * (xe - x0)];
    }
  }

  /* ---------- 近軸光線追跡 ----------
     ray: {x, y, s(斜率 dy/dx), n}；elems: [{x, F(屈光度), n2}]，座標單位為公尺。
     折射公式（縮減角）：n2·s' = n1·s − y·F */
  function trace(ray, elems, xEnd) {
    let { x, y, s, n } = Object.assign({ n: 1 }, ray);
    const pts = [[x, y]];
    const seq = elems.slice().sort((a, b) => a.x - b.x);
    for (const e of seq) {
      if (e.x < x) continue;
      y = y + s * (e.x - x); x = e.x; pts.push([x, y]);
      const n2 = e.n2 == null ? n : e.n2;
      s = (n * s - y * e.F) / n2; n = n2;
    }
    if (xEnd != null) { y = y + s * (xEnd - x); x = xEnd; pts.push([x, y]); }
    return { pts, s, y, x, n };
  }

  /* ---------- 格式 ---------- */
  const fmt = {
    D(v, d = 2) { if (!isFinite(v)) return "∞"; if (Math.abs(v) < 0.005) return "0.00 D"; return (v > 0 ? "+" : "−") + Math.abs(v).toFixed(d) + " D"; },
    num(v, d = 2, unit = "") { if (!isFinite(v)) return "∞"; const s = (v < 0 ? "−" : v > 0 ? "+" : "") + Math.abs(v).toFixed(d); return s + (unit ? " " + unit : ""); },
    plain(v, d = 1, unit = "") { if (!isFinite(v)) return "∞"; return (v < 0 ? "−" : "") + Math.abs(v).toFixed(d) + (unit ? " " + unit : ""); },
    cmFromM(m, d = 1) { if (!isFinite(m) || Math.abs(m) > 1e4) return "∞"; return fmt.num(m * 100, d, "cm"); },
  };

  /* ---------- 控制元件 ---------- */
  function range(id, format, onInput) {
    const el = document.getElementById(id);
    const out = document.getElementById(id + "-out");
    const upd = () => { if (out) out.textContent = format ? format(+el.value) : el.value; };
    el.addEventListener("input", () => { upd(); onInput && onInput(+el.value); });
    upd();
    return {
      get value() { return +el.value; },
      set value(v) { el.value = v; upd(); },
      el, refresh: upd,
    };
  }
  function seg(id, onChange) {
    const box = document.getElementById(id);
    const btns = [...box.querySelectorAll("button")];
    let val = (btns.find((b) => b.getAttribute("aria-pressed") === "true") || btns[0]).dataset.v;
    const set = (v, silent) => {
      val = v; btns.forEach((b) => b.setAttribute("aria-pressed", b.dataset.v === v ? "true" : "false"));
      if (!silent && onChange) onChange(v);
    };
    btns.forEach((b) => { b.type = "button"; b.addEventListener("click", () => set(b.dataset.v)); });
    set(val, true);
    return { get value() { return val; }, set: set };
  }
  function check(id, onChange) {
    const el = document.getElementById(id);
    el.addEventListener("change", () => onChange && onChange(el.checked));
    return { get value() { return el.checked; }, el };
  }

  /* ---------- 預測題 ----------
     <div class="predict" data-answer="1"><p class="q">…</p><div class="opts"><button>A</button>…</div><p class="why" hidden>…</p></div> */
  function initPredicts() {
    document.querySelectorAll(".predict").forEach((p) => {
      const ans = +p.dataset.answer;
      const btns = [...p.querySelectorAll(".opts button")];
      const why = p.querySelector(".why");
      btns.forEach((b, i) => {
        b.type = "button";
        b.addEventListener("click", () => {
          btns.forEach((x, j) => { x.classList.toggle("right", j === ans); x.classList.toggle("wrong", j === i && i !== ans); });
          if (why) {
            why.hidden = false;
            why.innerHTML = (i === ans ? '<span class="pill ok">預測正確</span> ' : '<span class="pill warn">再想想</span> ') + why.dataset.text;
          }
        });
      });
      if (why) { why.dataset.text = why.innerHTML; why.innerHTML = ""; why.hidden = true; }
    });
  }

  /* ---------- 測驗 ---------- */
  const PROG_KEY = "ob-progress";
  function quiz(elId, chapterId, items) {
    const root = document.getElementById(elId);
    root.classList.add("quiz");
    let answered = 0, correct = 0;
    const scoreEl = document.createElement("div");
    scoreEl.className = "quiz-score";
    items.forEach((raw, qi) => {
      // 每次載入隨機排列選項，避免背答案位置
      const order = raw.opts.map((_, i) => i);
      for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      const it = { q: raw.q, exp: raw.exp, opts: order.map((i) => raw.opts[i]), a: order.indexOf(raw.a) };
      const box = document.createElement("div"); box.className = "qitem";
      box.innerHTML = `<div class="qn">Q${qi + 1} / ${items.length}</div><div class="qt">${it.q}</div><div class="qopts"></div><div class="qexp" hidden></div>`;
      const opts = box.querySelector(".qopts"), exp = box.querySelector(".qexp");
      it.opts.forEach((o, oi) => {
        const b = document.createElement("button"); b.type = "button";
        b.innerHTML = String.fromCharCode(65 + oi) + ". " + o;
        b.addEventListener("click", () => {
          [...opts.children].forEach((x, j) => { x.disabled = true; if (j === it.a) x.classList.add("right"); });
          if (oi !== it.a) b.classList.add("wrong"); else correct++;
          answered++;
          exp.hidden = false;
          exp.innerHTML = (oi === it.a ? '<span class="pill ok">答對</span> ' : '<span class="pill bad">答錯</span> ') + it.exp;
          updateScore();
        });
        opts.appendChild(b);
      });
      root.appendChild(box);
    });
    root.appendChild(scoreEl);
    function updateScore() {
      scoreEl.innerHTML = `<span>已作答 ${answered} / ${items.length}　答對 ${correct}</span>`;
      if (answered === items.length) {
        const p = store.get(PROG_KEY, {});
        const prev = p[chapterId];
        if (!prev || correct >= prev.correct) p[chapterId] = { correct, total: items.length, t: Date.now() };
        store.set(PROG_KEY, p);
        const pct = correct / items.length;
        scoreEl.innerHTML += pct >= 0.8 ? ' <span class="pill ok">觀念掌握良好</span>' : ' <span class="pill warn">建議回到互動實驗再操作一次</span>';
        const again = document.createElement("button"); again.className = "btn ghost"; again.type = "button"; again.textContent = "重新作答";
        again.addEventListener("click", () => { root.innerHTML = ""; quiz(elId, chapterId, items); });
        scoreEl.appendChild(again);
      }
    }
    updateScore();
  }
  function progress() { return store.get(PROG_KEY, {}); }

  /* ---------- 模糊字（以圓盤取樣模擬幾何模糊；不依賴 ctx.filter，Safari 也能用） ----------
     diam：模糊圈直徑（px）；ex、ey 為橢圓模糊時的水平與垂直直徑（散光用） */
  function blurText(ctx, text, x, y, font, color, ex, ey) {
    if (ey == null) ey = ex;
    ctx.save(); ctx.font = font; ctx.fillStyle = color; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    const R = Math.max(ex, ey) / 2;
    if (R < 0.6) { ctx.fillText(text, x, y); ctx.restore(); return; }
    const pts = [];
    const rings = Math.min(7, Math.ceil(R / 2));
    for (let i = 0; i <= rings; i++) {
      const rr = i / rings; const n = i === 0 ? 1 : Math.round(6 * i);
      for (let j = 0; j < n; j++) { const a = (j / n) * Math.PI * 2 + i * 0.4; pts.push([Math.cos(a) * rr * ex / 2, Math.sin(a) * rr * ey / 2]); }
    }
    ctx.globalAlpha = Math.min(1, 1.6 / pts.length * 1.0 + 0.02);
    for (const [dx, dy] of pts) ctx.fillText(text, x + dx, y + dy);
    ctx.restore();
  }

  /* ---------- 工具 ---------- */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  window.OL = { CHAPTERS, store, colors, mountChrome, Stage, trace, fmt, range, seg, check, initPredicts, quiz, progress, clamp, lerp, blurText };

  document.addEventListener("DOMContentLoaded", () => {
    mountChrome(document.body.dataset.chapter || null);
    initPredicts();
  });
})();
