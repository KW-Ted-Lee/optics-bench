/* 第 10 章 練習題（原創，數字隨機） */
(function () {
  const { define, F, deg, rad } = (typeof window !== "undefined" ? window : globalThis).OBPractice;
  const MAT = [["CR-39", 1.498], ["冕牌玻璃", 1.523], ["聚碳酸酯", 1.586], ["高折射率樹脂", 1.74]];
  const BASES = ["BU（基底朝上）", "BD（基底朝下）", "BI（基底朝內）", "BO（基底朝外）"];
  /* 瞳孔相對光學中心的位置 → 基底方向（正鏡片基底朝光學中心） */
  const POS = { 上方: [0, 1], 下方: [0, -1], 鼻側: [1, 0], 顳側: [-1, 0] };
  function baseIdx(pos, P) {
    const [x, y] = POS[pos]; const s = P > 0 ? -1 : 1; // 正鏡片：基底方向 = −(瞳孔位置)
    const bx = x * s, by = y * s;
    if (by > 0) return 0; if (by < 0) return 1; if (bx > 0) return 2; return 3;
  }

  define("ch10", [
    { id: "10-1", title: "薄稜鏡的偏折", gen(r) {
      const [mn, n] = r.pick(MAT), a = r.step(2, 12, 0.5);
      const d = a * (n - 1), P = 100 * Math.tan(rad(d));
      return {
        q: `${mn}（n = ${n}）薄稜鏡，尖端角 ${a}°。求 (a) 最小偏折角、(b) 換算成稜鏡度。`,
        parts: [{ label: "(a) 偏折角", type: "num", ans: d, unit: "°" }, { label: "(b) 稜鏡度", type: "num", ans: P, unit: "Δ" }],
        steps: [
          { c: "薄稜鏡近似：偏折角與尖端角成正比，比例是 (n − 1)。", e: `d = α(n − 1) = ${a} × ${(n - 1).toFixed(3)} = ${d.toFixed(2)}°` },
          { c: "稜鏡度：100 cm 外偏移多少 cm。", e: `P = 100 × tan ${d.toFixed(2)}° = ${P.toFixed(2)} Δ` },
          { c: "粗估：1° 約等於 1.75 Δ。" },
        ],
      };
    } },
    { id: "10-2", title: "由偏移量求稜鏡度", gen(r) {
      const x = r.step(1, 20, 0.5), y = r.step(1, 6, 0.5);
      const P = x / y;
      return {
        q: `光線通過一個稜鏡後，在 ${y} m 外偏移了 ${x} cm。這個稜鏡是幾個稜鏡度？`,
        parts: [{ label: "P", type: "num", ans: P, unit: "Δ" }],
        steps: [
          { c: "定義：每 100 cm 的距離偏移 1 cm 為 1Δ。距離與偏移要用同一單位。", e: `P = 100 × (偏移 / 距離) = 100 × ${x} / ${y * 100} = ${P.toFixed(2)} Δ` },
          { c: "等價說法：偏移（cm） ÷ 距離（m）。" },
        ],
      };
    } },
    { id: "10-3", title: "Prentice 法則與基底方向", gen(r) {
      const P = r.sign() * r.step(1, 10, 0.25), c = r.step(1, 10, 0.5), pos = r.pick(Object.keys(POS));
      const pr = (c / 10) * Math.abs(P), b = baseIdx(pos, P);
      return {
        q: `右眼戴 ${F.D(P)} 球面鏡片，瞳孔落在光學中心的${pos} ${c} mm。病人感受到的稜鏡 (a) 有多少？(b) 基底朝哪裡？`,
        parts: [{ label: "(a) 稜鏡", type: "num", ans: pr, unit: "Δ" }, { label: "(b) 基底", type: "choice", opts: BASES, ans: b }],
        steps: [
          { c: "Prentice 法則：偏心距離用公分。", e: `P = c × F = ${(c / 10).toFixed(2)} cm × ${Math.abs(P).toFixed(2)} D = ${pr.toFixed(2)} Δ` },
          { c: P > 0 ? "正鏡片像兩個基底相對的稜鏡，基底朝向光學中心。" : "負鏡片像兩個尖端相對的稜鏡，基底背離光學中心。" },
          { c: `瞳孔在光學中心${pos} → 光學中心在瞳孔的${{ 上方: "下方", 下方: "上方", 鼻側: "顳側", 顳側: "鼻側" }[pos]} → ${P > 0 ? "基底朝向它" : "基底朝反方向"} → ${BASES[b]}。` },
        ],
      };
    } },
    { id: "10-4", title: "球柱鏡偏心", gen(r) {
      let S, C, A, dir, c, pow;
      for (let i = 0; i < 100; i++) {
        S = r.sign() * r.step(1, 6, 0.25); C = -r.step(0.5, 4, 0.25); A = r.pick([90, 180]);
        dir = r.pick(["水平", "垂直"]); c = r.step(2, 8, 0.5);
        pow = dir === "水平" ? (A === 180 ? S : S + C) : (A === 90 ? S : S + C);
        if (Math.abs(pow) >= 0.75) break;
      }
      const pr = (c / 10) * Math.abs(pow);
      return {
        q: `鏡片 <span class="eq">${F.s(S)} ${F.s(C)} × ${String(A).padStart(3, "0")}</span>，在${dir}方向偏心 ${c} mm。產生多少稜鏡？`,
        parts: [{ label: "稜鏡", type: "num", ans: pr, unit: "Δ" }],
        steps: [
          { c: `${dir}方向的偏心，要用${dir === "水平" ? "水平（@180）" : "垂直（@090）"}子午線的屈光力。` },
          { c: "鏡片十字：軸方向 = 球面度；與軸垂直 = 球面度 + 柱面度。", e: `@${dir === "水平" ? "180" : "090"} = ${F.D(pow)}` },
          { c: "Prentice 法則。", e: `P = ${(c / 10).toFixed(2)} × ${Math.abs(pow).toFixed(2)} = ${pr.toFixed(2)} Δ` },
        ],
      };
    } },
    { id: "10-5", title: "瞳距不符產生的稜鏡", gen(r) {
      const P = r.sign() * r.step(2, 8, 0.5), diff = r.sign() * r.step(2, 8, 1), pd = r.int(58, 68);
      const each = (Math.abs(diff) / 2 / 10) * Math.abs(P), total = 2 * each;
      // 鏡架光學中心距 > 瞳距：光學中心在瞳孔顳側 → 瞳孔在光學中心鼻側
      const pupilNasal = diff > 0;
      const base = (P > 0) === pupilNasal ? 1 : 0; // 0 = BI, 1 = BO
      return {
        q: `病人瞳距 ${pd} mm，兩眼都是 ${F.D(P)}。眼鏡的兩光學中心距離做成了 ${pd + diff} mm。兩眼合計的水平稜鏡效果 (a) 多少？(b) 是基底朝內還是朝外？`,
        parts: [{ label: "(a) 合計", type: "num", ans: total, unit: "Δ" }, { label: "(b)", type: "choice", opts: ["基底朝內 BI", "基底朝外 BO"], ans: base }],
        steps: [
          { c: "總共差 " + Math.abs(diff) + " mm，平均分給兩眼，每眼偏心一半。", e: `每眼 ${(Math.abs(diff) / 2).toFixed(1)} mm` },
          { c: "每眼稜鏡。", e: `${(Math.abs(diff) / 20).toFixed(2)} cm × ${Math.abs(P).toFixed(2)} D = ${each.toFixed(2)} Δ\n兩眼合計 ${total.toFixed(2)} Δ` },
          { c: `光學中心距${diff > 0 ? "比瞳距大，光學中心在瞳孔外側（顳側），瞳孔在光學中心的鼻側" : "比瞳距小，光學中心在瞳孔內側（鼻側），瞳孔在光學中心的顳側"}。` },
          { c: `${P > 0 ? "正鏡片基底朝光學中心" : "負鏡片基底背離光學中心"} → ${base ? "基底朝外 BO" : "基底朝內 BI"}。` },
        ],
      };
    } },
    { id: "10-6", title: "稜鏡度與距離", gen(r) {
      const P = r.step(2, 20, 1), x = r.step(1, 10, 0.5);
      const y = x / P; // m
      return {
        q: `一個 ${P}Δ 的稜鏡，要在多遠處才會讓光偏移 ${x} cm？`,
        parts: [{ label: "距離", type: "num", ans: y * 100, unit: "cm", dp: 1 }],
        steps: [
          { c: P + "Δ 代表每 100 cm 偏移 " + P + " cm。偏移與距離成正比。", e: `距離 = 100 × ${x} / ${P} = ${(y * 100).toFixed(1)} cm` },
        ],
      };
    } },
  ]);
})();
