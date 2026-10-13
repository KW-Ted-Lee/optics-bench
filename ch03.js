/* 第 3 章 練習題（原創，數字隨機） */
(function () {
  const { define, F } = (typeof window !== "undefined" ? window : globalThis).OBPractice;
  const MAT = [["房水", 1.336], ["CR-39", 1.498], ["冕牌玻璃", 1.523], ["聚碳酸酯", 1.586]];
  /* 產生 L′ 不接近 0 的物距 */
  function objFor(r, P, lo, hi) {
    for (let k = 0; k < 50; k++) { const l = -r.step(lo, hi, 5); const Lp = 100 / l + P; if (Math.abs(Lp) > 0.8) return l; }
    return -lo;
  }

  define("ch03", [
    { id: "3-1", title: "會聚面成像位置", gen(r) {
      const [mn, n2] = r.pick(MAT), P = r.step(5, 20, 2.5), l = objFor(r, P, 10, 60);
      const L = 100 / l, Lp = L + P, l2 = n2 / Lp * 100;
      return {
        q: `空氣與${mn}（n′ = ${n2.toFixed(3)}）的交界面屈光力 ${F.D(P)}。物體在表面左方 ${Math.abs(l)} cm。求 (a) 物聚散度 L、(b) 像聚散度 L′、(c) 像距 l′，並判斷 (d) 像的性質。`,
        parts: [{ label: "(a) L", type: "num", ans: L, unit: "D" }, { label: "(b) L′", type: "num", ans: Lp, unit: "D" }, { label: "(c) l′", type: "num", ans: l2, unit: "cm" }, { label: "(d)", type: "choice", opts: ["實像", "虛像"], ans: Lp > 0 ? 0 : 1 }],
        steps: [
          { c: "物在左方，距離取負號；光由物點發散，L 為負。", e: `L = n / l = 1.000 / ${F.s(l / 100, 2)} = ${F.D(L)}` },
          { c: "聚散度關係：表面把屈光力加到光上。", e: `L′ = L + F = ${F.s(L)} + ${F.s(P)} = ${F.D(Lp)}` },
          { c: "像在折射率 n′ 的介質中，換算距離時要乘 n′。", e: `l′ = n′ / L′ = ${n2.toFixed(3)} / ${F.s(Lp)} = ${F.s(l2 / 100, 4)} m = ${F.s(l2)} cm` },
          { c: Lp > 0 ? "L′ 為正，光會聚，在表面右側形成實像。" : "L′ 為負，光仍發散，像在表面左側，是虛像。" },
        ],
      };
    } },
    { id: "3-2", title: "放大率與像高", gen(r) {
      const [mn, n2] = r.pick(MAT), P = r.step(5, 20, 2.5), l = objFor(r, P, 10, 60), h = r.int(5, 20);
      const L = 100 / l, Lp = L + P, M = L / Lp, h2 = M * h;
      return {
        q: `同樣是空氣與${mn}（n′ = ${n2.toFixed(3)}）的交界面，F = ${F.D(P)}。高 ${h} mm 的物體在左方 ${Math.abs(l)} cm。求 (a) 橫向放大率、(b) 像高（含正負號），(c) 像正立或倒立？`,
        parts: [{ label: "(a) M", type: "num", ans: M }, { label: "(b) 像高 h′", type: "num", ans: h2, unit: "mm" }, { label: "(c)", type: "choice", opts: ["正立", "倒立"], ans: M > 0 ? 0 : 1 }],
        steps: [
          { c: "先算物、像聚散度。", e: `L = 1 / ${F.s(l / 100, 2)} = ${F.D(L)}\nL′ = ${F.s(L)} + ${F.s(P)} = ${F.D(Lp)}` },
          { c: "放大率用聚散度比，已經把兩側折射率考慮進去。", e: `M = L / L′ = ${F.s(L)} / ${F.s(Lp)} = ${F.s(M)}` },
          { c: "像高 = 放大率 × 物高。", e: `h′ = ${F.s(M)} × ${h} = ${F.s(h2)} mm` },
          { c: M > 0 ? "M 為正，像與物同向：正立。" : "M 為負，像上下顛倒：倒立。" },
        ],
      };
    } },
    { id: "3-3", title: "發散面成像", gen(r) {
      const [mn, n2] = r.pick(MAT), P = -r.step(5, 25, 2.5), l = -r.step(10, 80, 5);
      const L = 100 / l, Lp = L + P, l2 = n2 / Lp * 100, M = L / Lp;
      return {
        q: `空氣與${mn}（n′ = ${n2.toFixed(3)}）的交界面屈光力為 ${F.D(P)}。實物位於左方 ${Math.abs(l)} cm。求 (a) L′、(b) 像距 l′、(c) 放大率，並判斷 (d) 像的性質。`,
        parts: [{ label: "(a) L′", type: "num", ans: Lp, unit: "D" }, { label: "(b) l′", type: "num", ans: l2, unit: "cm" }, { label: "(c) M", type: "num", ans: M }, { label: "(d)", type: "choice", opts: ["實像、倒立", "虛像、正立"], ans: 1 }],
        steps: [
          { c: "先用觀念：發散光遇到發散面，只會更發散，所以一定是虛像。" },
          { c: "聚散度關係。", e: `L = 1 / ${F.s(l / 100, 2)} = ${F.D(L)}\nL′ = ${F.s(L)} + (${F.s(P)}) = ${F.D(Lp)}` },
          { c: "像在 n′ 介質這一側計算，但因 L′ 為負，像位於表面左側。", e: `l′ = ${n2.toFixed(3)} / ${F.s(Lp)} = ${F.s(l2)} cm` },
          { c: "放大率為正且小於 1：正立、縮小。", e: `M = ${F.s(L)} / ${F.s(Lp)} = ${F.s(M)}` },
        ],
      };
    } },
    { id: "3-4", title: "由像的位置找物體", gen(r) {
      const [mn, n2] = r.pick(MAT), P = r.step(5, 20, 2.5);
      const l2 = Math.round(100 * n2 / P * r.pick([1.3, 1.5, 2, 2.5, 3]));
      const Lp = n2 / (l2 / 100), L = Lp - P, l = 100 / L;
      return {
        q: `空氣與${mn}（n′ = ${n2.toFixed(3)}）的交界面屈光力 ${F.D(P)}，在表面右方 ${l2} cm 處形成實像。求 (a) 像聚散度、(b) 物聚散度、(c) 物體位置。`,
        parts: [{ label: "(a) L′", type: "num", ans: Lp, unit: "D" }, { label: "(b) L", type: "num", ans: L, unit: "D" }, { label: "(c) l", type: "num", ans: l, unit: "cm" }],
        steps: [
          { c: "實像在右側，距離為正；像在 n′ 介質中。", e: `L′ = n′ / l′ = ${n2.toFixed(3)} / ${(l2 / 100).toFixed(2)} = ${F.D(Lp)}` },
          { c: "倒推：L = L′ − F。", e: `L = ${F.s(Lp)} − ${F.s(P)} = ${F.D(L)}` },
          { c: "物在空氣中。L 為負，物在左側。", e: `l = 1 / ${F.s(L)} = ${F.s(l / 100, 4)} m = ${F.s(l)} cm` },
        ],
      };
    } },
    { id: "3-5", title: "平面與視深", gen(r) {
      const mats = [["水", 1.333], ["冕牌玻璃", 1.523], ["鑽石", 2.42]];
      const [mn, n] = r.pick(mats), d = r.step(10, 120, 5);
      const L = -n / (d / 100), app = d / n;
      return {
        q: `一枚硬幣在${mn}（n = ${n.toFixed(3)}）表面下 ${d} cm，從正上方的空氣中往下看。(a) 光到達平面時的聚散度？(b) 硬幣看起來在表面下多深？`,
        parts: [{ label: "(a) L", type: "num", ans: L, unit: "D" }, { label: "(b) 視深", type: "num", ans: app, unit: "cm" }],
        steps: [
          { c: "光在介質 n 中由硬幣發散而來，聚散度要乘上 n。", e: `L = n / l = ${n.toFixed(3)} / ${F.s(-d / 100, 2)} = ${F.D(L)}` },
          { c: "平面的屈光力為 0，所以 L′ = L。", e: `L′ = ${F.D(L)}` },
          { c: "射入空氣（n′ = 1），換算成距離。", e: `l′ = 1 / ${F.s(L)} = ${F.s(-app / 100, 4)} m → 視深 ${app.toFixed(2)} cm` },
          { c: "結論：視深 = 實際深度 ÷ n。聚散度沒變，是折射率改變讓距離「縮短」了。" },
        ],
      };
    } },
    { id: "3-6", title: "玻璃球內的氣泡", gen(r) {
      const n = 1.523, R = r.step(5, 20, 1), d = r.step(2, Math.max(3, R - 1), 1);
      const Rs = -R; // 曲率中心在左（玻璃內）
      const P = (1 - n) / (Rs / 100), L = n / (-d / 100), Lp = L + P, l2 = 1 / Lp * 100;
      return {
        q: `一顆冕牌玻璃球（n = ${n}）半徑 ${R} cm，球內有一個氣泡，在靠近你這一側的球面內 ${d} cm（沿光軸）。你在空氣中看它。(a) 這一側球面對射出光的屈光力？(b) 氣泡看起來在球面的哪裡（像距，含正負號）？`,
        parts: [{ label: "(a) F", type: "num", ans: P, unit: "D" }, { label: "(b) l′", type: "num", ans: l2, unit: "cm" }],
        steps: [
          { c: "光由氣泡出發，從玻璃（n = 1.523）射向空氣（n′ = 1.000）。球面朝你凸出，曲率中心在玻璃內（光的左側），r 為負。", e: `r = ${F.s(Rs / 100, 2)} m\nF = (1.000 − 1.523) / ${F.s(Rs / 100, 2)} = ${F.D(P)}` },
          { c: "物聚散度要用玻璃的折射率。", e: `L = 1.523 / ${F.s(-d / 100, 2)} = ${F.D(L)}` },
          { c: "聚散度關係。", e: `L′ = ${F.s(L)} + ${F.s(P)} = ${F.D(Lp)}` },
          { c: "射出到空氣中，換算像距。", e: `l′ = 1 / ${F.s(Lp)} = ${F.s(l2)} cm` },
          { c: l2 < 0 ? `像距為負：氣泡看起來在球面內 ${Math.abs(l2).toFixed(2)} cm 處（虛像）。` : "像距為正：在空氣側形成實像。" },
        ],
      };
    } },
  ]);
})();
