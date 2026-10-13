/* 第 14 章 練習題（原創，數字隨機）；鏡面：F = −2/r，L′ = −1/l′ */
(function () {
  const { define, F } = (typeof window !== "undefined" ? window : globalThis).OBPractice;

  define("ch14", [
    { id: "14-1", title: "面鏡的屈光力與焦點", gen(r) {
      const cc = r.rand() < 0.5, R = (cc ? -1 : 1) * r.step(10, 100, 5);
      const P = -2 / (R / 100), f = R / 2;
      return {
        q: `一面${cc ? "凹" : "凸"}面鏡，曲率半徑大小 ${Math.abs(R)} cm（光由左方射向鏡面；曲率中心在${cc ? "左" : "右"}方，r = ${F.s(R, 0)} cm）。求 (a) 鏡面屈光力、(b) 焦點到鏡面的距離，(c) 焦點在鏡前還是鏡後？`,
        parts: [{ label: "(a) F", type: "num", ans: P, unit: "D" }, { label: "(b) 距離", type: "num", ans: Math.abs(f), unit: "cm" }, { label: "(c)", type: "choice", opts: ["鏡前（實焦點）", "鏡後（虛焦點）"], ans: cc ? 0 : 1 }],
        steps: [
          { c: "鏡面屈光力。", e: `F = −2 / r = −2 / ${F.s(R / 100, 2)} = ${F.D(P)}` },
          { c: "焦距是曲率半徑的一半。", e: `|f| = ${Math.abs(R)} / 2 = ${Math.abs(f)} cm` },
          { c: cc ? "凹面鏡會聚（F 為正），反射光真的聚在鏡前的焦點。" : "凸面鏡發散（F 為負），反射光看起來來自鏡後的焦點。" },
        ],
      };
    } },
    { id: "14-2", title: "凹面鏡成像", gen(r) {
      let R, l, P, L, Lp;
      for (let i = 0; i < 100; i++) { R = -r.step(20, 80, 10); l = -r.step(5, 100, 5); P = -2 / (R / 100); L = 100 / l; Lp = L + P; if (Math.abs(Lp) > 0.8) break; }
      const l2 = -100 / Lp, M = -l2 / l;
      const real = l2 < 0;
      return {
        q: `曲率半徑 ${Math.abs(R)} cm 的凹面鏡，物體在鏡前 ${Math.abs(l)} cm。求 (a) 像的位置（鏡前為負、鏡後為正）、(b) 放大率，並判斷 (c) 像的性質。`,
        parts: [{ label: "(a) l′", type: "num", ans: l2, unit: "cm" }, { label: "(b) M", type: "num", ans: M }, { label: "(c)", type: "choice", opts: ["實像、倒立", "虛像、正立"], ans: real ? 0 : 1 }],
        steps: [
          { c: "鏡面屈光力與物聚散度。", e: `F = −2 / ${F.s(R / 100, 2)} = ${F.D(P)}\nL = 1 / ${F.s(l / 100, 2)} = ${F.D(L)}` },
          { c: "聚散度關係照用。", e: `L′ = ${F.s(L)} + ${F.s(P)} = ${F.D(Lp)}` },
          { c: "反射後光往左走，所以像距 l′ = −1 / L′。", e: `l′ = −1 / ${F.s(Lp)} = ${F.s(l2)} cm（${real ? "鏡前" : "鏡後"}）` },
          { c: "鏡面的放大率。", e: `M = −l′ / l = −(${F.s(l2)}) / (${F.s(l, 0)}) = ${F.s(M)}` },
          { c: real ? "L′ 為正：反射光會聚，在鏡前形成倒立實像。" : "物體在焦點以內：反射光發散，在鏡後形成正立放大虛像（化妝鏡）。" },
        ],
      };
    } },
    { id: "14-3", title: "角膜反射像（角膜弧度儀原理）", gen(r) {
      const R = r.step(7.2, 8.4, 0.1), l = -r.step(20, 100, 10), h = r.step(20, 80, 10);
      const P = -2 / (R / 1000), L = 100 / l, Lp = L + P, l2 = -1 / Lp * 1000, M = -(l2 / 10) / l, h2 = M * h;
      return {
        q: `把角膜前表面當成凸面鏡，曲率半徑 ${R.toFixed(1)} mm。一個高 ${h} mm 的光圈放在角膜前 ${Math.abs(l)} cm。求 (a) 角膜的反射屈光力、(b) 反射像位置（mm）、(c) 像高（mm）。`,
        parts: [{ label: "(a) F", type: "num", ans: P, unit: "D" }, { label: "(b) l′", type: "num", ans: l2, unit: "mm" }, { label: "(c) 像高", type: "num", ans: h2, unit: "mm", dp: 3, tol: Math.max(0.005, Math.abs(h2) * 0.015) }],
        steps: [
          { c: "角膜朝外凸出，對反射光而言是凸面鏡，r 為正。", e: `F = −2 / ${(R / 1000).toFixed(4)} = ${F.D(P)}` },
          { c: "聚散度關係。", e: `L = ${F.D(L)}\nL′ = ${F.s(L)} + ${F.s(P)} = ${F.D(Lp)}\nl′ = −1 / ${F.s(Lp)} = ${F.s(l2 / 1000, 5)} m = ${F.s(l2)} mm` },
          { c: "像在角膜後約 " + Math.abs(l2).toFixed(2) + " mm（接近焦點 r/2），是正立縮小的虛像，這就是 Purkinje I。", e: `M = −l′/l = ${M.toExponential(3)}\nh′ = ${h2.toFixed(3)} mm` },
          { c: "角膜弧度儀量這個像的大小反推 r：角膜越陡，像越小。" },
        ],
      };
    } },
    { id: "14-4", title: "鏡片表面反射", gen(r) {
      const n = r.pick([1.498, 1.523, 1.586, 1.6, 1.67, 1.74, 1.9]);
      const R1 = Math.pow((n - 1) / (n + 1), 2), T = Math.pow(1 - R1, 2);
      return {
        q: `折射率 ${n} 的鏡片沒有鍍膜。(a) 單一表面的反射率是多少 %？(b) 光通過前、後兩個表面後，約剩多少 % 穿透（忽略吸收與多次反射）？`,
        parts: [{ label: "(a) R", type: "num", ans: R1 * 100, unit: "%", dp: 2 }, { label: "(b) 穿透", type: "num", ans: T * 100, unit: "%", dp: 1 }],
        steps: [
          { c: "垂直入射的反射率。", e: `R = ((n − 1)/(n + 1))² = (${(n - 1).toFixed(3)} / ${(n + 1).toFixed(3)})² = ${(R1 * 100).toFixed(2)} %` },
          { c: "每一面穿透 (1 − R)，兩面相乘。", e: `(1 − ${R1.toFixed(4)})² = ${(T * 100).toFixed(1)} %` },
          { c: "折射率越高，反射越多，所以高折射率鏡片更需要抗反射膜。" },
        ],
      };
    } },
    { id: "14-5", title: "理想抗反射膜", gen(r) {
      const n = r.pick([1.498, 1.523, 1.586, 1.67, 1.74]), lam = r.pick([510, 550, 555, 580]);
      const nc = Math.sqrt(n), t = lam / (4 * nc);
      return {
        q: `要在折射率 ${n} 的鏡片上做單層抗反射膜，針對 ${lam} nm 讓反射降到 0。(a) 膜的折射率應為多少？(b) 膜厚應為多少 nm？`,
        parts: [{ label: "(a) n膜", type: "num", ans: nc, dp: 3, tol: 0.005 }, { label: "(b) 厚度", type: "num", ans: t, unit: "nm", dp: 1 }],
        steps: [
          { c: "振幅條件：膜上、下兩個界面的反射強度要相等。", e: `n膜 = √n鏡片 = √${n} = ${nc.toFixed(3)}` },
          { c: "相位條件：兩道反射光相差半個波長而抵消，膜內來回一趟要差 λ/2，所以膜厚是膜內波長的四分之一。", e: `t = λ / (4 n膜) = ${lam} / (4 × ${nc.toFixed(3)}) = ${t.toFixed(1)} nm` },
          { c: "實際上常用 MgF₂（n ≈ 1.38）或多層膜，因為很難找到剛好 √n 的材料。" },
        ],
      };
    } },
  ]);
})();
