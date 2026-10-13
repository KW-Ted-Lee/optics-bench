/* 第 15 章 練習題（原創，數字隨機） */
(function () {
  const { define, F, rad } = (typeof window !== "undefined" ? window : globalThis).OBPractice;
  const MAT = [["CR-39", 1.498, 58], ["冕牌玻璃", 1.523, 59], ["聚碳酸酯", 1.586, 30], ["高折射率樹脂 1.67", 1.67, 32], ["高折射率樹脂 1.74", 1.74, 33]];

  define("ch15", [
    { id: "15-1", title: "阿貝數", gen(r) {
      const nd = r.step(1.49, 1.75, 0.01), V = r.int(28, 60);
      const disp = (nd - 1) / V, nF = +(nd + disp * 0.7).toFixed(4), nC = +(nF - disp).toFixed(4);
      const Vc = (nd - 1) / (nF - nC);
      return {
        q: `某鏡片材料的折射率：nF（藍，486 nm）= ${nF.toFixed(4)}、nd（黃，588 nm）= ${nd.toFixed(4)}、nC（紅，656 nm）= ${nC.toFixed(4)}。求 (a) 阿貝數，(b) 色散程度屬於？`,
        parts: [{ label: "(a) V", type: "num", ans: Vc, dp: 1, tol: 0.6 }, { label: "(b)", type: "choice", opts: ["色散小（V 高）", "色散大（V 低）"], ans: Vc >= 45 ? 0 : 1 }],
        steps: [
          { c: "阿貝數（constringence）= 色散能力的倒數。", e: `V = (nd − 1) / (nF − nC) = ${(nd - 1).toFixed(4)} / ${(nF - nC).toFixed(4)} = ${Vc.toFixed(1)}` },
          { c: Vc >= 45 ? "V 高，色散小（如 CR-39 約 58）。" : "V 低，色散大（如聚碳酸酯約 30），透過鏡片周邊看時容易出現彩邊。" },
        ],
      };
    } },
    { id: "15-2", title: "橫向色像差", gen(r) {
      const [mn, n, V] = r.pick(MAT), P = r.sign() * r.step(2, 10, 0.5), c = r.step(5, 15, 1);
      const pr = (c / 10) * Math.abs(P), ca = pr / V;
      return {
        q: `${mn} 鏡片（阿貝數約 ${V}），度數 ${F.D(P)}。病人透過離光學中心 ${c} mm 的位置看出去。求 (a) 該處的稜鏡度、(b) 橫向色像差（Δ）。`,
        parts: [{ label: "(a) 稜鏡", type: "num", ans: pr, unit: "Δ" }, { label: "(b) 色像差", type: "num", ans: ca, unit: "Δ", dp: 3, tol: Math.max(0.002, ca * 0.02) }],
        steps: [
          { c: "Prentice 法則。", e: `P = ${(c / 10).toFixed(1)} × ${Math.abs(P).toFixed(2)} = ${pr.toFixed(2)} Δ` },
          { c: "不同顏色的偏折差 = 稜鏡度 ÷ 阿貝數。", e: `色像差 = ${pr.toFixed(2)} / ${V} = ${ca.toFixed(3)} Δ` },
          { c: "一般認為超過約 0.1 Δ 時，有些人會察覺彩邊或視力下降。高度數、低阿貝數、看得越偏，問題越明顯。" },
        ],
      };
    } },
    { id: "15-3", title: "紅綠測試判讀", gen(r) {
      const red = r.rand() < 0.5;
      return {
        q: `做紅綠測試時，病人說「${red ? "紅" : "綠"}色那邊的字比較清楚」。(a) 影像（黃光焦點）相對於視網膜在哪裡？(b) 應該加什麼度數？`,
        parts: [{ label: "(a)", type: "choice", opts: ["視網膜前方", "視網膜後方"], ans: red ? 0 : 1 }, { label: "(b)", type: "choice", opts: ["加負度數", "加正度數"], ans: red ? 0 : 1 }],
        steps: [
          { c: "眼睛的色像差：短波長（綠）折射較多、焦點較前；長波長（紅）焦點較後。" },
          { c: red ? "紅色較清楚 → 紅光焦點比較靠近視網膜 → 整體影像落在視網膜前（近視方向，例如近視欠矯或遠視過矯）。" : "綠色較清楚 → 綠光焦點比較靠近視網膜 → 整體影像落在視網膜後（例如近視過矯）。" },
          { c: red ? "加負度數把焦點往後推。口訣：RAM（Red Add Minus）。" : "加正度數把焦點往前拉。口訣：GAP（Green Add Plus）。" },
        ],
      };
    } },
    { id: "15-4", title: "鏡片前傾產生的散光", gen(r) {
      const n = 1.5, P = r.sign() * r.step(2, 10, 0.5), th = r.step(5, 20, 1);
      const s2 = Math.pow(Math.sin(rad(th)), 2);
      const Fs = P * (1 + s2 / (2 * n)), Fc = Fs * Math.pow(Math.tan(rad(th)), 2);
      return {
        q: `${F.D(P)} 球面鏡片（n = 1.50）有 ${th}° 前傾角（pantoscopic tilt）。求 (a) 新的球面度、(b) 誘發的柱面度（軸 180）。`,
        parts: [{ label: "(a) 球面度", type: "num", ans: Fs, unit: "D" }, { label: "(b) 柱面度", type: "num", ans: Fc, unit: "D", tol: Math.max(0.015, Math.abs(Fc) * 0.03) }],
        steps: [
          { c: "斜著透過鏡片看，等於光線斜向通過，產生斜向散光。", e: `sin²${th}° = ${s2.toFixed(4)}` },
          { c: "新的球面度。", e: `F = ${F.s(P)} × (1 + ${s2.toFixed(4)} / (2 × 1.5)) = ${F.D(Fs)}` },
          { c: "誘發柱面度（以新球面度計算）。", e: `C = ${F.s(Fs)} × tan²${th}° = ${F.D(Fc)} × 180` },
          { c: "度數越高、傾斜越大，誘發的散光越多。配鏡時前傾角會配合光學中心高度調整，以減少這個效應。" },
        ],
      };
    } },
    { id: "15-5", title: "形狀因子（bending factor）", gen(r) {
      let r1 = r.sign() * r.step(5, 40, 5), r2 = r.sign() * r.step(5, 40, 5);
      if (r1 === r2) r2 = -r2;
      const s = (r2 + r1) / (r2 - r1);
      return {
        q: `透鏡兩面的曲率半徑 r₁ = ${F.s(r1, 0)} cm、r₂ = ${F.s(r2, 0)} cm。求形狀因子 σ。`,
        parts: [{ label: "σ", type: "num", ans: s }],
        steps: [
          { c: "形狀因子描述鏡片「彎曲」的方式：σ = 0 為對稱雙凸／雙凹，±1 為平凸／平凹，|σ| > 1 為新月形。", e: `σ = (r₂ + r₁) / (r₂ − r₁) = (${F.s(r2, 0)} + ${F.s(r1, 0)}) / (${F.s(r2, 0)} − ${F.s(r1, 0)}) = ${F.s(s)}` },
          { c: "同樣屈光力下，選擇適當的 σ 可以把球面像差降到最低；眼鏡片則多以減少斜向散光為主要考量。" },
        ],
      };
    } },
  ]);
})();
