/* 第 1 章 練習題（原創，數字隨機） */
(function () {
  const { define, F, deg, rad } = (typeof window !== "undefined" ? window : globalThis).OBPractice;
  const MED = [["空氣", 1.0], ["水", 1.333]];
  const GLASS = [["CR-39", 1.498], ["冕牌玻璃", 1.523], ["聚碳酸酯", 1.586], ["高折射 1.74", 1.74]];

  define("ch01", [
    { id: "1-1", title: "點光源的聚散度", gen(r) {
      const d = r.step(10, 200, 5), [mn, n] = r.pick(MED);
      const L = -n / (d / 100);
      return {
        q: `一個點光源位於${mn}（n = ${n.toFixed(3)}）中。在距離光源 ${d} cm 的平面上，光的聚散度是多少？`,
        parts: [{ label: "聚散度 L", type: "num", ans: L, unit: "D" }],
        steps: [
          { c: "點光源發出的光一路往外散開，是<b>發散光</b>，聚散度為負。" },
          { c: "距離換成公尺。", e: `l = ${d} cm = ${(d / 100).toFixed(2)} m` },
          { c: "聚散度 = 介質折射率 ÷ 距離（公尺）。", e: `L = −n / l = −${n.toFixed(3)} / ${(d / 100).toFixed(2)} = ${F.D(L)}` },
        ],
      };
    } },
    { id: "1-2", title: "會聚光束", gen(r) {
      const d = r.step(20, 100, 5), x = r.step(5, d - 10, 5);
      const L1 = 100 / d, L2 = 100 / (d - x);
      return {
        q: `空氣中一束光朝著右方 ${d} cm 處的一點會聚。(a) 在目前這個平面上的聚散度？(b) 光再往前走 ${x} cm 後，聚散度變成多少？`,
        parts: [{ label: "(a) 目前的 L", type: "num", ans: L1, unit: "D" }, { label: "(b) 前進後的 L", type: "num", ans: L2, unit: "D" }],
        steps: [
          { c: "朝一點收斂的光是<b>會聚光</b>，聚散度為正。", e: `(a) L = +1 / ${(d / 100).toFixed(2)} m = ${F.D(L1)}` },
          { c: "往前走之後，離會聚點只剩 " + (d - x) + " cm。越接近會聚點，波前越彎，聚散度越大。", e: `(b) L = +1 / ${((d - x) / 100).toFixed(2)} m = ${F.D(L2)}` },
        ],
      };
    } },
    { id: "1-3", title: "聚散度隨距離改變", gen(r) {
      const L1 = -r.step(2, 10, 0.5), x = r.step(5, 40, 5);
      const d1 = 100 / Math.abs(L1), L2 = -100 / (d1 + x);
      return {
        q: `空氣中某平面 A 上的光聚散度為 ${F.D(L1)}。(a) 光源距離 A 面多遠？(b) 光再前進 ${x} cm 到達平面 B，B 面的聚散度是多少？`,
        parts: [{ label: "(a) 光源到 A 面的距離", type: "num", ans: d1, unit: "cm" }, { label: "(b) B 面的 L", type: "num", ans: L2, unit: "D" }],
        steps: [
          { c: "負的聚散度代表發散光，光源在 A 面左側。距離 = 1 ÷ |L|。", e: `d = 1 / ${Math.abs(L1).toFixed(2)} = ${(d1 / 100).toFixed(4)} m = ${d1.toFixed(2)} cm` },
          { c: "到 B 面時，離光源更遠了。", e: `距離 = ${d1.toFixed(2)} + ${x} = ${(d1 + x).toFixed(2)} cm` },
          { c: "離光源越遠，發散光越平，聚散度數值變小（仍為負）。", e: `L_B = −1 / ${((d1 + x) / 100).toFixed(4)} = ${F.D(L2)}` },
        ],
      };
    } },
    { id: "1-4", title: "斯涅爾定律", gen(r) {
      const [m1, n1] = r.pick(MED), [m2, n2] = r.pick(GLASS), t1 = r.int(10, 70);
      const t2 = deg(Math.asin(n1 * Math.sin(rad(t1)) / n2));
      return {
        q: `光由${m1}（n = ${n1.toFixed(3)}）以入射角 ${t1}° 射入${m2}（n′ = ${n2.toFixed(3)}）。(a) 折射角是多少？(b) 折射光偏向還是偏離法線？`,
        parts: [{ label: "(a) 折射角 θ′", type: "num", ans: t2, unit: "°", tol: 0.15 }, { label: "(b) 方向", type: "choice", opts: ["偏向法線", "偏離法線"], ans: 0 }],
        steps: [
          { c: "先用觀念判斷：由低折射率進入高折射率，光變慢，偏向法線，所以折射角會比 " + t1 + "° 小。" },
          { c: "斯涅爾定律。", e: `n sin θ = n′ sin θ′\nsin θ′ = ${n1.toFixed(3)} × sin ${t1}° / ${n2.toFixed(3)} = ${(n1 * Math.sin(rad(t1)) / n2).toFixed(4)}` },
          { c: "取反正弦。", e: `θ′ = ${t2.toFixed(2)}°` },
        ],
      };
    } },
    { id: "1-5", title: "臨界角與全內反射", gen(r) {
      const [mn, n] = r.pick(GLASS.concat([["鑽石", 2.42]]));
      const tc = deg(Math.asin(1 / n));
      const test = Math.round(tc + r.pick([-1, 1]) * r.int(3, 15));
      const tir = test > tc;
      return {
        q: `光由${mn}（n = ${n.toFixed(3)}）射向空氣。(a) 臨界角是多少？(b) 若入射角為 ${test}°，光會怎樣？`,
        parts: [{ label: "(a) 臨界角 θc", type: "num", ans: tc, unit: "°", tol: 0.15 }, { label: "(b) 結果", type: "choice", opts: ["折射射出", "全內反射"], ans: tir ? 1 : 0 }],
        steps: [
          { c: "只有光從高折射率射向低折射率時才有臨界角。臨界角就是折射角剛好等於 90° 時的入射角。", e: `n sin θc = 1.000 × sin 90°\nsin θc = 1 / ${n.toFixed(3)} = ${(1 / n).toFixed(4)}\nθc = ${tc.toFixed(2)}°` },
          { c: `入射角 ${test}° ${tir ? "大於" : "小於"}臨界角，${tir ? "光無法射出，全部反射回去（全內反射）" : "光可以折射射出，並偏離法線"}。` },
        ],
      };
    } },
    { id: "1-6", title: "介質中的光速與波長", gen(r) {
      const [mn, n] = r.pick(MED.slice(1).concat(GLASS)), lam = r.pick([486, 546, 589, 656]);
      const v = 3.0 / n, l2 = lam / n;
      return {
        q: `波長 ${lam} nm（在真空中）的光進入${mn}（n = ${n.toFixed(3)}）。(a) 光在其中的速度是多少？（以 ×10⁸ m/s 表示，c = 3.00 × 10⁸ m/s）(b) 在該介質中的波長是多少？`,
        parts: [{ label: "(a) 速度", type: "num", ans: v, unit: "×10⁸ m/s", dp: 3 }, { label: "(b) 波長", type: "num", ans: l2, unit: "nm", dp: 1 }],
        steps: [
          { c: "折射率的定義：真空光速 ÷ 介質中的光速。", e: `v = c / n = 3.00 / ${n.toFixed(3)} = ${v.toFixed(3)} × 10⁸ m/s` },
          { c: "進入介質時頻率不變，速度變慢，所以波長按同樣比例縮短。", e: `λ = ${lam} / ${n.toFixed(3)} = ${l2.toFixed(1)} nm` },
        ],
      };
    } },
  ]);
})();
