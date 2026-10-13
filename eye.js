/* 簡化眼（reduced eye）共用繪圖：Schwartz 使用單一折射面 +60.00 D、n′ = 1.333、軸長 22.22 mm */
(function () {
  "use strict";
  const EYE = { F: 60, n: 1.333, L: 1.333 / 60 * 1000 }; // L ≈ 22.22 mm

  /* 在 Stage 上畫眼球：cornea 在 x0，視網膜在 x0 + L（皆為世界座標） */
  function drawEye(s, c, x0, Lw, ry, o = {}) {
    const ctx = s.ctx;
    const cx = s.X(x0 + Lw / 2), cy = s.Y(0);
    const rx = Math.abs(s.X(x0 + Lw) - s.X(x0)) / 2 + 2, rpy = Math.abs(s.Y(ry) - s.Y(0));
    ctx.save();
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, rpy, 0, 0, Math.PI * 2);
    ctx.fillStyle = c.accent; ctx.globalAlpha = 0.07; ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = c.muted; ctx.lineWidth = 1.2; ctx.stroke();
    // 視網膜（後方弧）
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, rpy, 0, -Math.PI / 2.8, Math.PI / 2.8);
    ctx.strokeStyle = c.retina; ctx.lineWidth = 3; ctx.stroke();
    // 角膜（前方較彎的弧）
    ctx.beginPath(); ctx.ellipse(s.X(x0) + rpy * 0.28, cy, rpy * 0.36, rpy * 0.62, 0, Math.PI / 2, Math.PI * 1.5);
    ctx.strokeStyle = c.glassEdge; ctx.lineWidth = 2.2; ctx.stroke();
    ctx.restore();
    if (o.label !== false) s.text("視網膜", x0 + Lw, ry * 0.75, { dx: 6, align: "left", size: 11, color: c.retina, weight: 700 });
  }

  window.OLEye = { EYE, drawEye };
})();
