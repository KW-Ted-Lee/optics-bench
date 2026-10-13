/* 第 11 章 練習題（原創，數字隨機） */
(function () {
  const { define, F } = (typeof window !== "undefined" ? window : globalThis).OBPractice;
  const AM = 180 / Math.PI * 60; // 弧度 → 角分

  define("ch11", [
    { id: "11-1", title: "模糊圈的角大小", gen(r) {
      const p = r.step(2, 7, 0.5), D = r.step(0.5, 3, 0.25);
      const b = (p / 1000) * D * AM;
      return {
        q: `瞳孔直徑 ${p} mm，眼睛有 ${D.toFixed(2)} D 的離焦。視網膜上的模糊圈對應多少角分（直徑）？`,
        parts: [{ label: "模糊圈", type: "num", ans: b, unit: "角分", dp: 1 }],
        steps: [
          { c: "模糊圈的角大小（弧度）≈ 瞳孔直徑（公尺）× 離焦屈光度。", e: `β = ${(p / 1000).toFixed(4)} × ${D.toFixed(2)} = ${((p / 1000) * D).toFixed(5)} rad` },
          { c: "換成角分（1 rad = 3438 角分）。", e: `β = ${b.toFixed(1)} 角分` },
          { c: "20/20 視標的筆畫寬 1 角分。模糊圈比筆畫大很多時，字就辨認不出來；瞳孔越小模糊越少。" },
        ],
      };
    } },
    { id: "11-2", title: "艾瑞盤", gen(r) {
      const d = r.step(1, 6, 0.5), lam = r.pick([500, 555, 600]);
      const th = 1.22 * (lam * 1e-9) / (d / 1000) * AM;
      return {
        q: `波長 ${lam} nm 的光通過直徑 ${d} mm 的瞳孔。艾瑞盤的角半徑是多少角分？`,
        parts: [{ label: "θ", type: "num", ans: th, unit: "角分", dp: 2 }],
        steps: [
          { c: "繞射：孔越小，艾瑞盤越大。", e: `θ = 1.22 λ / d = 1.22 × ${lam}×10⁻⁹ / ${(d / 1000).toFixed(4)} = ${(th / AM).toExponential(3)} rad` },
          { c: "換成角分。", e: `θ = ${th.toFixed(2)} 角分` },
          { c: d <= 2 ? "瞳孔很小時，繞射模糊已接近 1 角分，會限制視力。" : "一般瞳孔大小下，繞射造成的模糊很小。" },
        ],
      };
    } },
    { id: "11-3", title: "景深延伸近點", gen(r) {
      const A = r.step(0.5, 3, 0.25), T = r.step(0.5, 1.5, 0.25);
      const near = 100 / (A + T / 2);
      return {
        q: `遠用已完全矯正的老花病人，調節幅度 ${A.toFixed(2)} D，總景深 ${T.toFixed(2)} D（對焦點前後各一半）。最近能看清多近？`,
        parts: [{ label: "最近", type: "num", ans: near, unit: "cm", dp: 1 }],
        steps: [
          { c: "用盡調節時，眼睛對焦在 " + A.toFixed(2) + " D 處；景深再往近處延伸半個景深。", e: `${A.toFixed(2)} + ${T.toFixed(2)}/2 = ${(A + T / 2).toFixed(3)} D` },
          { c: "換成距離。", e: `1 / ${(A + T / 2).toFixed(3)} = ${near.toFixed(1)} cm` },
          { c: "若不考慮景深，近點只有 " + (100 / A).toFixed(1) + " cm。景深讓病人多了一點看近的空間。" },
        ],
      };
    } },
    { id: "11-4", title: "超焦距", gen(r) {
      const T = r.step(0.5, 2, 0.25);
      return {
        q: `一位總景深 ${T.toFixed(2)} D 的眼睛（或相機）。(a) 超焦距是多少 cm？(b) 對焦在超焦距時，最近能看清多近？`,
        parts: [{ label: "(a) 超焦距", type: "num", ans: 100 / (T / 2), unit: "cm", dp: 1 }, { label: "(b) 最近", type: "num", ans: 100 / T, unit: "cm", dp: 1 }],
        steps: [
          { c: "對焦在超焦距時，景深的遠端剛好延伸到無限遠（0 D）。所以對焦點的聚散度 = 半個景深。", e: `${(T / 2).toFixed(3)} D → ${(100 / (T / 2)).toFixed(1)} cm` },
          { c: "景深的近端再加半個景深。", e: `${(T / 2).toFixed(3)} + ${(T / 2).toFixed(3)} = ${T.toFixed(2)} D → ${(100 / T).toFixed(1)} cm` },
          { c: "結論：對焦在超焦距，從超焦距的一半一直到無限遠都清楚。" },
        ],
      };
    } },
    { id: "11-5", title: "加入度、調節與景深", gen(r) {
      const add = r.step(1, 2.75, 0.25), A = r.step(0.5, 2, 0.25), T = r.step(0.5, 1, 0.25);
      const far = 100 / (add - T / 2), near = 100 / (add + A + T / 2);
      return {
        q: `遠用完全矯正的病人戴 ${F.D(add)} 加入度，調節幅度 ${A.toFixed(2)} D，總景深 ${T.toFixed(2)} D。透過加入度能看清的範圍：(a) 最遠、(b) 最近？`,
        parts: [{ label: "(a) 最遠", type: "num", ans: far, unit: "cm", dp: 1 }, { label: "(b) 最近", type: "num", ans: near, unit: "cm", dp: 1 }],
        steps: [
          { c: "不調節時對焦在加入度的焦點（" + add.toFixed(2) + " D），景深往遠處延伸半個景深。", e: `${add.toFixed(2)} − ${(T / 2).toFixed(3)} = ${(add - T / 2).toFixed(3)} D → ${far.toFixed(1)} cm` },
          { c: "用盡調節時對焦在 add + A，景深再往近處延伸半個景深。", e: `${add.toFixed(2)} + ${A.toFixed(2)} + ${(T / 2).toFixed(3)} = ${(add + A + T / 2).toFixed(3)} D → ${near.toFixed(1)} cm` },
        ],
      };
    } },
    { id: "11-6", title: "未矯正近視與景深", gen(r) {
      const T = r.step(0.5, 1.5, 0.25), K = -r.step(T / 2 + 0.75, 4, 0.25);
      const far = 100 / (Math.abs(K) - T / 2);
      return {
        q: `未矯正的 ${F.D(K)} 近視者，總景深 ${T.toFixed(2)} D。不戴眼鏡時最遠能看清多遠？（比較：不考慮景深時遠點是 ${(100 / Math.abs(K)).toFixed(1)} cm）`,
        parts: [{ label: "最遠", type: "num", ans: far, unit: "cm", dp: 1 }],
        steps: [
          { c: "遠點在 " + Math.abs(K).toFixed(2) + " D；景深讓清楚範圍再往遠處延伸半個景深。", e: `${Math.abs(K).toFixed(2)} − ${(T / 2).toFixed(3)} = ${(Math.abs(K) - T / 2).toFixed(3)} D` },
          { c: "換成距離。", e: `1 / ${(Math.abs(K) - T / 2).toFixed(3)} = ${far.toFixed(1)} cm` },
          { c: "低度近視者瞇眼（縮小有效瞳孔、加大景深）就能看得比較遠，原因在此。" },
        ],
      };
    } },
  ]);
})();
