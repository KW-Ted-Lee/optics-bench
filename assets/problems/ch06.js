/* 第 6 章 練習題（原創，數字隨機） */
(function () {
  const { define, F } = (typeof window !== "undefined" ? window : globalThis).OBPractice;
  const MAT = [["CR-39", 1.498], ["冕牌玻璃", 1.523], ["聚碳酸酯", 1.586], ["高折射率樹脂", 1.67]];
  function thick(r) {
    const [mn, n] = r.pick(MAT);
    const kind = r.pick(["men", "men", "bi", "neg"]);
    let F1, F2;
    if (kind === "men") { F1 = r.step(6, 14, 0.5); F2 = -r.step(1, F1 - 2, 0.5); }
    else if (kind === "bi") { F1 = r.step(4, 12, 0.5); F2 = r.step(2, 12, 0.5); }
    else { F1 = r.step(1, 5, 0.5); F2 = -r.step(F1 + 2, 14, 0.5); }
    const t = kind === "neg" ? r.step(1.5, 3, 0.5) : r.step(4, 12, 0.5);
    const tn = t / 1000 / n;
    const Fe = F1 + F2 - tn * F1 * F2;
    return { mn, n, F1, F2, t, tn, Fe, Fv: F1 / (1 - tn * F1) + F2, Fn: F2 / (1 - tn * F2) + F1, A1H: tn * F2 / Fe * 1000, A2H: -tn * F1 / Fe * 1000 };
  }
  const desc = (k) => `${k.mn}（n = ${k.n}）厚鏡片：前表面 F₁ = ${F.D(k.F1)}、後表面 F₂ = ${F.D(k.F2)}、中心厚 t = ${k.t} mm`;

  define("ch06", [
    { id: "6-1", title: "後頂點屈光力", gen(r) {
      const k = thick(r);
      return {
        q: `${desc(k)}。(a) 求後頂點屈光力。(b) 與 F₁ + F₂ 相比，差多少？`,
        parts: [{ label: "(a) Fv", type: "num", ans: k.Fv, unit: "D" }, { label: "(b) Fv − (F₁+F₂)", type: "num", ans: k.Fv - k.F1 - k.F2, unit: "D", tol: 0.02 }],
        steps: [
          { c: "後頂點屈光力 = 平行光入射時，離開後表面的聚散度。前表面射出的光先在鏡片內走過 t，聚散度改變。", e: `t/n = ${k.t} mm / ${k.n} = ${(k.tn * 1000).toFixed(3)} mm = ${k.tn.toFixed(6)} m` },
          { c: "到達後表面時：", e: `F₁ / (1 − (t/n)F₁) = ${F.s(k.F1)} / (1 − ${k.tn.toFixed(6)} × ${F.s(k.F1)}) = ${F.D(k.F1 / (1 - k.tn * k.F1))}` },
          { c: "加上後表面。", e: `Fv = ${F.D(k.F1 / (1 - k.tn * k.F1))} + ${F.s(k.F2)} = ${F.D(k.Fv)}` },
          { c: "差異。前表面越凸、鏡片越厚，差異越大；這就是驗度儀讀數和「兩面相加」不同的原因。", e: `${F.D(k.Fv)} − ${F.D(k.F1 + k.F2)} = ${F.D(k.Fv - k.F1 - k.F2)}` },
        ],
      };
    } },
    { id: "6-2", title: "前頂點屈光力與驗度儀", gen(r) {
      const k = thick(r);
      return {
        q: `${desc(k)}。(a) 求前頂點（中和）屈光力。(b) 若把這片鏡片「後表面朝下」放上驗度儀，讀到的是哪一個值？`,
        parts: [{ label: "(a) Fn", type: "num", ans: k.Fn, unit: "D" }, { label: "(b)", type: "choice", opts: ["後頂點屈光力 Fv", "前頂點屈光力 Fn", "等效屈光力 Fe"], ans: 0 }],
        steps: [
          { c: "前頂點屈光力：把光反過來想，平行光從後面射入，在前表面離開時的聚散度（大小）。所以兩個表面的角色互換。", e: `Fn = F₂ / (1 − (t/n)F₂) + F₁\n= ${F.s(k.F2)} / (1 − ${k.tn.toFixed(6)} × ${F.s(k.F2)}) + ${F.s(k.F1)} = ${F.D(k.Fn)}` },
          { c: "驗度儀量的是緊貼鏡片座那一面到焦點的距離。後表面朝下 → 讀到後頂點屈光力（眼鏡處方的定義）。若放反了，就會讀到前頂點屈光力。" },
        ],
      };
    } },
    { id: "6-3", title: "等效屈光力", gen(r) {
      const k = thick(r);
      return {
        q: `${desc(k)}。求 (a) 等效屈光力 Fe、(b) 等效焦距（由主平面量起，mm）。`,
        parts: [{ label: "(a) Fe", type: "num", ans: k.Fe, unit: "D" }, { label: "(b) fe′", type: "num", ans: 1000 / k.Fe, unit: "mm", dp: 1 }],
        steps: [
          { c: "等效屈光力 = 兩面相加，再扣掉一個與厚度有關的修正項。", e: `Fe = F₁ + F₂ − (t/n)F₁F₂\n= ${F.s(k.F1)} + ${F.s(k.F2)} − ${k.tn.toFixed(6)} × ${F.s(k.F1)} × ${F.s(k.F2)}\n= ${F.D(k.Fe)}` },
          { c: "等效焦距要從主平面 H′ 量，不是從鏡片表面。", e: `fe′ = 1 / Fe = ${F.s(1000 / k.Fe, 1)} mm` },
        ],
      };
    } },
    { id: "6-4", title: "主平面位置", gen(r) {
      const k = thick(r);
      const where = (x, ref) => (x > 0 ? `${ref}右方` : x < 0 ? `${ref}左方` : `剛好在${ref}`);
      return {
        q: `${desc(k)}。求 (a) 前表面頂點到第一主平面 H 的距離 A₁H、(b) 後表面頂點到第二主平面 H′ 的距離 A₂H′（mm，右正左負）。`,
        parts: [{ label: "(a) A₁H", type: "num", ans: k.A1H, unit: "mm", dp: 2, tol: Math.max(0.03, Math.abs(k.A1H) * 0.02) }, { label: "(b) A₂H′", type: "num", ans: k.A2H, unit: "mm", dp: 2, tol: Math.max(0.03, Math.abs(k.A2H) * 0.02) }],
        steps: [
          { c: "先算等效屈光力。", e: `Fe = ${F.D(k.Fe)}` },
          { c: "第一主平面。", e: `A₁H = (t/n)F₂ / Fe = ${(k.tn * 1000).toFixed(3)} × ${F.s(k.F2)} / ${F.s(k.Fe)} = ${F.s(k.A1H)} mm（${where(k.A1H, "前表面")}）` },
          { c: "第二主平面。", e: `A₂H′ = −(t/n)F₁ / Fe = −${(k.tn * 1000).toFixed(3)} × ${F.s(k.F1)} / ${F.s(k.Fe)} = ${F.s(k.A2H)} mm（${where(k.A2H, "後表面")}）` },
          { c: k.F2 < 0 && k.Fe > 0 ? "新月形正鏡片：兩個主平面都被拉向凸的前表面，H 甚至落在鏡片前方。" : "觀察主平面落在鏡片內還是外，並比較兩者間距。" },
        ],
      };
    } },
    { id: "6-5", title: "用等效透鏡找像", gen(r) {
      let k, l, lH, L, Lp, lpH, lp;
      for (let i = 0; i < 100; i++) {
        k = thick(r); l = -r.step(20, 100, 5);
        lH = l * 10 - k.A1H; // 物到 H（mm）
        L = 1000 / lH; Lp = L + k.Fe; if (Math.abs(Lp) < 0.8) continue;
        lpH = 1000 / Lp; lp = (lpH + k.A2H) / 10; break;
      }
      return {
        q: `${desc(k)}。物體在前表面左方 ${Math.abs(l)} cm。用等效透鏡（主平面）方法，求最終像到後表面的距離。`,
        parts: [{ label: "像到後表面", type: "num", ans: lp, unit: "cm" }],
        steps: [
          { c: "先找等效屈光力與主平面。", e: `Fe = ${F.D(k.Fe)}\nA₁H = ${F.s(k.A1H)} mm，A₂H′ = ${F.s(k.A2H)} mm` },
          { c: "物距要從 H 量起。", e: `物到 H = ${F.s(l * 10, 1)} − (${F.s(k.A1H)}) = ${F.s(lH, 2)} mm\nL = 1000 / ${F.s(lH, 2)} = ${F.D(L)}` },
          { c: "把它當成位於主平面的薄透鏡。", e: `L′ = ${F.s(L)} + ${F.s(k.Fe)} = ${F.D(Lp)}\n像到 H′ = 1000 / ${F.s(Lp)} = ${F.s(lpH, 2)} mm` },
          { c: "換回從後表面量。", e: `像到後表面 = ${F.s(lpH, 2)} + (${F.s(k.A2H)}) = ${F.s(lp * 10, 2)} mm = ${F.s(lp)} cm` },
        ],
      };
    } },
  ]);
})();
