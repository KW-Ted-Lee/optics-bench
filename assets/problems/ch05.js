/* 第 5 章 練習題（原創，數字隨機） */
(function () {
  const { define, F } = (typeof window !== "undefined" ? window : globalThis).OBPractice;

  /* 雙薄透鏡（cm、D） */
  function twoLens(l1, F1, F2, d) {
    const L1 = 100 / l1, L1p = L1 + F1, x1 = 100 / L1p, l2 = x1 - d, L2 = 100 / l2, L2p = L2 + F2, x2 = 100 / L2p;
    return { L1, L1p, x1, l2, L2, L2p, x2, M: (L1 / L1p) * (L2 / L2p) };
  }
  function ok2(s) { return Math.abs(s.L1p) > 0.8 && Math.abs(s.l2) > 1 && Math.abs(s.L2p) > 0.8 && Math.abs(s.L2) < 300; }

  define("ch05", [
    { id: "5-1", title: "兩片薄透鏡接力成像", gen(r) {
      let F1, F2, d, l1, s;
      for (let k = 0; k < 200; k++) {
        F1 = r.sign() * r.step(2, 15, 1); F2 = r.sign() * r.step(2, 15, 1); d = r.step(2, 30, 1); l1 = -r.step(10, 80, 5);
        s = twoLens(l1, F1, F2, d); if (ok2(s) && s.l2 < 0) break;
      }
      return {
        q: `兩片空氣中的薄透鏡相距 ${d} cm：第一片 ${F.D(F1)}，第二片 ${F.D(F2)}。物體在第一片左方 ${Math.abs(l1)} cm。求 (a) 第一片形成的像（中間像）位置、(b) 光到達第二片時的聚散度、(c) 最終像到第二片的距離、(d) 總放大率。`,
        parts: [{ label: "(a) 中間像 l₁′", type: "num", ans: s.x1, unit: "cm" }, { label: "(b) L₂", type: "num", ans: s.L2, unit: "D" }, { label: "(c) l₂′", type: "num", ans: s.x2, unit: "cm" }, { label: "(d) 總 M", type: "num", ans: s.M }],
        steps: [
          { c: "第一片：", e: `L₁ = 1/${F.s(l1 / 100, 2)} = ${F.D(s.L1)}\nL₁′ = ${F.s(s.L1)} + ${F.s(F1)} = ${F.D(s.L1p)}\nl₁′ = 1/${F.s(s.L1p)} = ${F.s(s.x1)} cm` },
          { c: "中間像就是第二片的物。改從第二片量距離：", e: `l₂ = l₁′ − d = ${F.s(s.x1)} − ${d} = ${F.s(s.l2)} cm` },
          { c: "光走了一段路，聚散度已經改變。", e: `L₂ = 1/${F.s(s.l2 / 100, 4)} = ${F.D(s.L2)}` },
          { c: "第二片：", e: `L₂′ = ${F.s(s.L2)} + ${F.s(F2)} = ${F.D(s.L2p)}\nl₂′ = 1/${F.s(s.L2p)} = ${F.s(s.x2)} cm` },
          { c: "總放大率 = 各片放大率相乘。", e: `M = (L₁/L₁′)(L₂/L₂′) = (${F.s(s.L1 / s.L1p)})(${F.s(s.L2 / s.L2p)}) = ${F.s(s.M)}` },
        ],
      };
    } },
    { id: "5-2", title: "虛物", gen(r) {
      let F1, F2, d, l1, s;
      for (let k = 0; k < 200; k++) {
        F1 = r.step(5, 15, 1); F2 = r.sign() * r.step(2, 12, 1); l1 = -r.step(20, 80, 5);
        const x1 = 100 / (100 / l1 + F1); if (!(x1 > 4)) continue;
        d = r.step(1, Math.max(2, Math.floor(x1) - 2), 1);
        s = twoLens(l1, F1, F2, d); if (ok2(s) && s.l2 > 0) break;
      }
      return {
        q: `第一片 ${F.D(F1)} 薄透鏡把左方 ${Math.abs(l1)} cm 的物體成像。第二片 ${F.D(F2)} 放在第一片右方 ${d} cm，比中間像更靠近第一片。(a) 第二片的物是實物還是虛物？(b) 到達第二片的聚散度？(c) 最終像到第二片的距離？`,
        parts: [{ label: "(a)", type: "choice", opts: ["實物", "虛物"], ans: 1 }, { label: "(b) L₂", type: "num", ans: s.L2, unit: "D" }, { label: "(c) l₂′", type: "num", ans: s.x2, unit: "cm" }],
        steps: [
          { c: "第一片原本會在這裡成像：", e: `L₁′ = 1/${F.s(l1 / 100, 2)} + ${F.s(F1)} = ${F.D(s.L1p)} → l₁′ = ${F.s(s.x1)} cm` },
          { c: "第二片擋在像形成之前，光還在會聚途中。這個「還沒形成的像」位於第二片右側，是<b>虛物</b>。", e: `l₂ = ${F.s(s.x1)} − ${d} = ${F.s(s.l2)} cm（正值：在右側）` },
          { c: "虛物的聚散度為正（會聚光入射）。", e: `L₂ = 1/${F.s(s.l2 / 100, 4)} = ${F.D(s.L2)}` },
          { c: "第二片照常相加。", e: `L₂′ = ${F.s(s.L2)} + ${F.s(F2)} = ${F.D(s.L2p)} → l₂′ = ${F.s(s.x2)} cm` },
        ],
      };
    } },
    { id: "5-3", title: "光在介質中行進後的聚散度", gen(r) {
      const L1 = r.sign() * r.step(2, 20, 1), media = [["空氣", 1.0], ["玻璃", 1.5]];
      const [mn, n] = r.pick(media), d = r.step(5, 30, 1);
      const L2 = L1 / (1 - (d / 1000 / n) * L1);
      return {
        q: `某光學面射出的光聚散度為 ${F.D(L1)}，之後在${mn}（n = ${n}）中前進 ${d} mm 到達下一個面。到達時的聚散度是多少？數值大小會變大還是變小？`,
        parts: [{ label: "L₂", type: "num", ans: L2, unit: "D" }, { label: "大小變化", type: "choice", opts: ["變大", "變小"], ans: Math.abs(L2) > Math.abs(L1) ? 0 : 1 }],
        steps: [
          { c: "方法一：先找光的「焦點」距離，再減掉走過的路。", e: `距離 = n / L₁ = ${n} / ${F.s(L1)} = ${F.s(n / L1 * 1000, 2)} mm` },
          { c: "前進 " + d + " mm 後，新距離：", e: `${F.s(n / L1 * 1000, 2)} − ${d} = ${F.s(n / L1 * 1000 - d, 2)} mm\nL₂ = ${n} / ${F.s((n / L1 * 1000 - d) / 1000, 5)} = ${F.D(L2)}` },
          { c: "方法二：公式（用約化距離 d/n）。", e: `L₂ = L₁ / (1 − (d/n)L₁) = ${F.D(L2)}` },
          { c: L1 > 0 ? "會聚光越走越接近像點，聚散度變大。" : "發散光越走越平，聚散度數值變小。" },
        ],
      };
    } },
    { id: "5-4", title: "厚透鏡逐面計算", gen(r) {
      const n = 1.5;
      let r1, r2, t, l, F1, F2, L1, L1p, l1p, l2, L2, L2p, x2;
      for (let k = 0; k < 200; k++) {
        r1 = r.step(4, 15, 1); r2 = -r.step(4, 15, 1); t = r.step(5, 30, 5); l = -r.step(10, 60, 5);
        F1 = (n - 1) / (r1 / 100); F2 = (1 - n) / (r2 / 100);
        L1 = 100 / l; L1p = L1 + F1; if (Math.abs(L1p) < 1) continue;
        l1p = n / L1p * 1000; l2 = l1p - t; if (Math.abs(l2) < 3) continue;
        L2 = n / (l2 / 1000); L2p = L2 + F2; if (Math.abs(L2p) < 0.8) continue;
        x2 = 100 / L2p; break;
      }
      return {
        q: `玻璃（n = 1.50）雙凸厚透鏡：r₁ = ${F.s(r1, 0)} cm、r₂ = ${F.s(r2, 0)} cm、中心厚 ${t} mm。物體在前表面左方 ${Math.abs(l)} cm。求 (a) F₁、(b) F₂、(c) 光到達後表面時的聚散度、(d) 最終像到後表面的距離。`,
        parts: [{ label: "(a) F₁", type: "num", ans: F1, unit: "D" }, { label: "(b) F₂", type: "num", ans: F2, unit: "D" }, { label: "(c) L₂", type: "num", ans: L2, unit: "D" }, { label: "(d) l₂′", type: "num", ans: x2, unit: "cm" }],
        steps: [
          { c: "兩個表面屈光力。", e: `F₁ = 0.50 / ${F.s(r1 / 100, 2)} = ${F.D(F1)}\nF₂ = −0.50 / ${F.s(r2 / 100, 2)} = ${F.D(F2)}` },
          { c: "第一面：像在玻璃中，距離要乘 n。", e: `L₁ = ${F.D(L1)}\nL₁′ = ${F.s(L1)} + ${F.s(F1)} = ${F.D(L1p)}\nl₁′ = 1.50 / ${F.s(L1p)} = ${F.s(l1p, 2)} mm` },
          { c: "從後表面量：", e: `l₂ = ${F.s(l1p, 2)} − ${t} = ${F.s(l2, 2)} mm\nL₂ = 1.50 / ${F.s(l2 / 1000, 5)} = ${F.D(L2)}` },
          { c: "第二面：射回空氣。", e: `L₂′ = ${F.s(L2)} + ${F.s(F2)} = ${F.D(L2p)}\nl₂′ = 1 / ${F.s(L2p)} = ${F.s(x2)} cm` },
        ],
      };
    } },
    { id: "5-5", title: "平行光通過厚透鏡", gen(r) {
      const n = 1.5;
      let F1, F2, t, L2, Lb;
      for (let i = 0; i < 100; i++) {
        F1 = r.step(8, 30, 1); F2 = r.sign() * r.step(2, 20, 1); t = r.step(4, 20, 1);
        L2 = F1 / (1 - (t / 1000 / n) * F1); Lb = L2 + F2; if (Math.abs(Lb) > 2) break;
      }
      const bfl = 1000 / Lb;
      return {
        q: `厚透鏡（n = 1.50）前表面 ${F.D(F1)}、後表面 ${F.D(F2)}、中心厚 ${t} mm。平行光由左方射入。求 (a) 光到達後表面時的聚散度、(b) 離開後表面的聚散度、(c) 後焦距（後表面到焦點，mm）。`,
        parts: [{ label: "(a) L₂", type: "num", ans: L2, unit: "D" }, { label: "(b) L₂′", type: "num", ans: Lb, unit: "D" }, { label: "(c) 後焦距", type: "num", ans: bfl, unit: "mm", dp: 1 }],
        steps: [
          { c: "平行光 L₁ = 0，經過前表面後 L₁′ = F₁。", e: `L₁′ = ${F.D(F1)}` },
          { c: "在玻璃中走 t：", e: `L₂ = F₁ / (1 − (t/n)F₁) = ${F.s(F1)} / (1 − ${(t / 1000 / n).toFixed(5)} × ${F.s(F1)}) = ${F.D(L2)}` },
          { c: "加上後表面：這個數字其實就是第 6 章的「後頂點屈光力」。", e: `L₂′ = ${F.s(L2)} + ${F.s(F2)} = ${F.D(Lb)}` },
          { c: "後焦距。", e: `1 / ${F.s(Lb)} = ${F.s(bfl / 1000, 5)} m = ${F.s(bfl, 1)} mm${Lb < 0 ? "（負：虛焦點在後表面左側）" : ""}` },
        ],
      };
    } },
  ]);
})();
