/* 第 4 章 練習題（原創，數字隨機） */
(function () {
  const { define, F } = (typeof window !== "undefined" ? window : globalThis).OBPractice;
  const MAT = [["CR-39", 1.498], ["冕牌玻璃", 1.523], ["聚碳酸酯", 1.586]];
  const FORMS = ["雙凸", "平凸", "正新月形", "雙凹", "平凹", "負新月形"];
  function formOf(F1, F2) {
    const a = Math.abs(F1) < 1e-9 ? 0 : Math.sign(F1), b = Math.abs(F2) < 1e-9 ? 0 : Math.sign(F2), T = F1 + F2;
    if (a >= 0 && b >= 0) return a && b ? 0 : 1;
    if (a <= 0 && b <= 0) return a && b ? 3 : 4;
    return T > 0 ? 2 : 5;
  }
  function objFor(r, P) { for (let k = 0; k < 60; k++) { const l = -r.step(5, 100, 5); if (Math.abs(100 / l + P) > 0.8) return l; } return -100; }

  define("ch04", [
    { id: "4-1", title: "鏡片屈光力與鏡片形式", gen(r) {
      const [mn, n] = r.pick(MAT);
      const RS = [5, 6, 8, 10, 12, 15, 20, 25, 40];
      let r1 = r.rand() < 0.15 ? Infinity : r.sign() * r.pick(RS);
      let r2 = r.rand() < 0.15 && isFinite(r1) ? Infinity : r.sign() * r.pick(RS);
      if (isFinite(r1) && isFinite(r2) && r1 === r2) r2 = -r2;
      const F1 = isFinite(r1) ? (n - 1) / (r1 / 100) : 0, F2 = isFinite(r2) ? (1 - n) / (r2 / 100) : 0, T = F1 + F2;
      const rs = (x) => (isFinite(x) ? F.s(x, 1) + " cm" : "∞（平面）");
      return {
        q: `${mn}（n = ${n}）薄透鏡，前表面曲率半徑 r₁ = ${rs(r1)}，後表面 r₂ = ${rs(r2)}（曲率中心在右側為正）。求 (a) 前表面屈光力、(b) 後表面屈光力、(c) 薄透鏡屈光力，(d) 鏡片形式？`,
        parts: [{ label: "(a) F₁", type: "num", ans: F1, unit: "D" }, { label: "(b) F₂", type: "num", ans: F2, unit: "D" }, { label: "(c) F", type: "num", ans: T, unit: "D" }, { label: "(d) 形式", type: "choice", opts: FORMS, ans: formOf(F1, F2) }],
        steps: [
          { c: "前表面：光由空氣進入鏡片。", e: `F₁ = (n − 1) / r₁ = ${(n - 1).toFixed(3)} / ${isFinite(r1) ? F.s(r1 / 100, 2) : "∞"} = ${F.D(F1)}` },
          { c: "後表面：光由鏡片回到空氣，折射率差變成 (1 − n)。", e: `F₂ = (1 − n) / r₂ = ${(1 - n).toFixed(3)} / ${isFinite(r2) ? F.s(r2 / 100, 2) : "∞"} = ${F.D(F2)}` },
          { c: "薄透鏡：兩面相加。", e: `F = F₁ + F₂ = ${F.D(T)}` },
          { c: `前表面${F1 > 0 ? "凸" : F1 < 0 ? "凹" : "平"}、後表面${F2 > 0 ? "凸" : F2 < 0 ? "凹" : "平"}，總屈光力${T >= 0 ? "為正" : "為負"} → ${FORMS[formOf(F1, F2)]}。` },
        ],
      };
    } },
    { id: "4-2", title: "正透鏡成像", gen(r) {
      const P = r.step(2, 20, 1), l = objFor(r, P), h = r.int(5, 30);
      const L = 100 / l, Lp = L + P, l2 = 100 / Lp, M = L / Lp;
      return {
        q: `高 ${h} mm 的物體放在 ${F.D(P)} 薄透鏡左方 ${Math.abs(l)} cm（空氣中）。求 (a) 像距、(b) 放大率、(c) 像高，並判斷 (d) 像的性質。`,
        parts: [{ label: "(a) l′", type: "num", ans: l2, unit: "cm" }, { label: "(b) M", type: "num", ans: M }, { label: "(c) h′", type: "num", ans: M * h, unit: "mm" }, { label: "(d)", type: "choice", opts: ["實像、倒立", "虛像、正立"], ans: Lp > 0 ? 0 : 1 }],
        steps: [
          { c: `先用觀念：焦距 ${(100 / P).toFixed(1)} cm，物體在 F ${Math.abs(l) > 100 / P ? "之外 → 應為倒立實像" : "之內 → 應為正立虛像（放大鏡）"}。` },
          { c: "聚散度關係。", e: `L = 1 / ${F.s(l / 100, 2)} = ${F.D(L)}\nL′ = ${F.s(L)} + ${F.s(P)} = ${F.D(Lp)}` },
          { c: "像距。", e: `l′ = 1 / L′ = ${F.s(l2)} cm` },
          { c: "放大率與像高。", e: `M = L / L′ = ${F.s(M)}\nh′ = ${F.s(M)} × ${h} = ${F.s(M * h)} mm` },
        ],
      };
    } },
    { id: "4-3", title: "負透鏡成像", gen(r) {
      const P = -r.step(2, 20, 1), l = -r.step(5, 100, 5), h = r.int(5, 30);
      const L = 100 / l, Lp = L + P, l2 = 100 / Lp, M = L / Lp;
      return {
        q: `高 ${h} mm 的物體放在 ${F.D(P)} 薄透鏡左方 ${Math.abs(l)} cm。求 (a) 像距、(b) 放大率、(c) 像高。`,
        parts: [{ label: "(a) l′", type: "num", ans: l2, unit: "cm" }, { label: "(b) M", type: "num", ans: M }, { label: "(c) h′", type: "num", ans: M * h, unit: "mm" }],
        steps: [
          { c: "觀念：負透鏡對實物永遠形成正立、縮小的虛像，位置在透鏡與 F′ 之間（左側）。" },
          { c: "聚散度關係。", e: `L = ${F.D(L)}\nL′ = ${F.s(L)} + (${F.s(P)}) = ${F.D(Lp)}` },
          { c: "像距（負 = 在透鏡左側）。", e: `l′ = 1 / ${F.s(Lp)} = ${F.s(l2)} cm` },
          { c: "放大率介於 0 和 1 之間。", e: `M = ${F.s(L)} / ${F.s(Lp)} = ${F.s(M)}　h′ = ${F.s(M * h)} mm` },
        ],
      };
    } },
    { id: "4-4", title: "由實像找物體", gen(r) {
      const P = r.step(4, 20, 1), l2 = Math.round(100 / P * r.pick([1.25, 1.5, 2, 3, 4]));
      const Lp = 100 / l2, L = Lp - P, l = 100 / L;
      return {
        q: `一片 ${F.D(P)} 的薄透鏡在右方 ${l2} cm 處形成實像。物體在哪裡？`,
        parts: [{ label: "L", type: "num", ans: L, unit: "D" }, { label: "物距 l", type: "num", ans: l, unit: "cm" }],
        steps: [
          { c: "實像在右側，距離為正。", e: `L′ = 1 / ${(l2 / 100).toFixed(2)} = ${F.D(Lp)}` },
          { c: "倒推物聚散度。", e: `L = L′ − F = ${F.s(Lp)} − ${F.s(P)} = ${F.D(L)}` },
          { c: "換回距離：負值 → 物在透鏡左側。", e: `l = 1 / ${F.s(L)} = ${F.s(l)} cm` },
        ],
      };
    } },
    { id: "4-5", title: "焦距與焦點位置", gen(r) {
      const P = r.sign() * r.step(1, 20, 0.5);
      const f2 = 100 / P;
      return {
        q: `一片空氣中的 ${F.D(P)} 薄透鏡。求 (a) 第二焦距 f′、(b) 第一焦距 f，並判斷 (c) 第二焦點 F′ 在透鏡的哪一側？`,
        parts: [{ label: "(a) f′", type: "num", ans: f2, unit: "cm" }, { label: "(b) f", type: "num", ans: -f2, unit: "cm" }, { label: "(c) F′ 位置", type: "choice", opts: ["右側（出射側）", "左側（入射側）"], ans: P > 0 ? 0 : 1 }],
        steps: [
          { c: "空氣中薄透鏡：f′ = 1 / F，f = −f′。", e: `f′ = 1 / ${F.s(P)} = ${F.s(f2 / 100, 4)} m = ${F.s(f2)} cm\nf = ${F.s(-f2)} cm` },
          { c: P > 0 ? "正透鏡把平行光聚到右側的 F′。" : "負透鏡讓平行光發散，射出的光看起來來自左側的 F′。所以負透鏡的 F′ 在入射側。" },
        ],
      };
    } },
    { id: "4-6", title: "牛頓公式", gen(r) {
      const P = r.step(4, 20, 1), f = 100 / P, x = -r.step(2, 40, 1);
      const x2 = -(f * f) / x, l2 = f + x2;
      const chk = 100 / (100 / (-f + x) + P);
      return {
        q: `${F.D(P)} 薄透鏡，物體位於第一焦點 F 左方 ${Math.abs(x)} cm（x = ${F.s(x, 0)} cm）。用牛頓公式求 (a) 像到 F′ 的距離 x′、(b) 像到透鏡的距離。`,
        parts: [{ label: "(a) x′", type: "num", ans: x2, unit: "cm" }, { label: "(b) l′", type: "num", ans: l2, unit: "cm" }],
        steps: [
          { c: "牛頓公式以焦點為原點量距離：物距從 F 量起（x），像距從 F′ 量起（x′）。", e: `x · x′ = f · f′ = −f′²\nf′ = ${f.toFixed(2)} cm` },
          { c: "代入。", e: `x′ = −f′² / x = −(${f.toFixed(2)})² / ${F.s(x, 0)} = ${F.s(x2)} cm` },
          { c: "從透鏡量：", e: `l′ = f′ + x′ = ${f.toFixed(2)} + ${F.s(x2)} = ${F.s(l2)} cm` },
          { c: "用聚散度驗算：物距 l = " + F.s(-f + x) + " cm。", e: `L′ = 1/${F.s((-f + x) / 100, 4)} + ${F.s(P)} → l′ = ${F.s(chk)} cm ✓` },
        ],
      };
    } },
  ]);
})();
