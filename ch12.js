/* 第 12 章 練習題（原創，數字隨機） */
(function () {
  const { define, F } = (typeof window !== "undefined" ? window : globalThis).OBPractice;

  define("ch12", [
    { id: "12-1", title: "相對距離放大", gen(r) {
      const d1 = r.pick([40, 50, 33, 25]), d2 = r.step(5, d1 - 5, 1);
      const M = d1 / d2;
      return {
        q: `病人原本在 ${d1} cm 閱讀，把書拉近到 ${d2} cm。(a) 視網膜影像放大幾倍？(b) 若遠用已完全矯正，在 ${d2} cm 需要多少調節（或加入度）？`,
        parts: [{ label: "(a) 放大", type: "num", ans: M, unit: "×" }, { label: "(b) 需求", type: "num", ans: 100 / d2, unit: "D" }],
        steps: [
          { c: "視角約與距離成反比，距離縮短幾倍，影像就放大幾倍。", e: `M = ${d1} / ${d2} = ${M.toFixed(2)}×` },
          { c: "代價：物體越近，需要的屈光力越大。", e: `1 / ${(d2 / 100).toFixed(2)} = ${F.D(100 / d2)}` },
        ],
      };
    } },
    { id: "12-2", title: "等效視距與近用加入度", gen(r) {
      const dref = r.pick([40, 33, 25]), M = r.pick([1.5, 2, 2.5, 3, 4, 5]);
      const evd = dref / M, add = 100 / evd;
      return {
        q: `低視力病人在 ${dref} cm 只能讀出比目標大 ${M} 倍的字。要讓他讀到目標字體，(a) 等效視距是多少？(b) 需要多強的近用鏡片（物體放在焦點）？`,
        parts: [{ label: "(a) 等效視距", type: "num", ans: evd, unit: "cm", dp: 2 }, { label: "(b) 鏡片", type: "num", ans: add, unit: "D" }],
        steps: [
          { c: "要放大 " + M + " 倍，就把物體拉到原來距離的 1/" + M + "。", e: `EVD = ${dref} / ${M} = ${evd.toFixed(2)} cm` },
          { c: "用一片焦距等於等效視距的正鏡片，物體放在焦點上，射出平行光，眼睛不必調節。", e: `F = 1 / ${(evd / 100).toFixed(4)} = ${F.D(add)}` },
        ],
      };
    } },
    { id: "12-3", title: "有效放大率", gen(r) {
      const fwd = r.rand() < 0.5;
      if (fwd) {
        const P = r.step(4, 40, 2);
        return {
          q: `一個 ${F.D(P)} 的放大鏡，以 25 cm 為參考距離，「有效放大率」是幾倍？等效視距多少？`,
          parts: [{ label: "M", type: "num", ans: P / 4, unit: "×" }, { label: "等效視距", type: "num", ans: 100 / P, unit: "cm" }],
          steps: [
            { c: "參考距離 25 cm 對應 4 D，所以 M = F / 4。", e: `M = ${P} / 4 = ${(P / 4).toFixed(2)}×` },
            { c: "等效視距。", e: `1 / ${P} m = ${(100 / P).toFixed(2)} cm` },
            { c: "注意：若參考距離不是 25 cm（例如 40 cm），同一片鏡片的「倍數」就不同。" },
          ],
        };
      }
      const M = r.step(1.5, 10, 0.5);
      return {
        q: `以 25 cm 為參考距離，要達到 ${M}× 的有效放大率，需要多少屈光度的放大鏡？`,
        parts: [{ label: "F", type: "num", ans: 4 * M, unit: "D" }],
        steps: [{ c: "反推 M = F / 4。", e: `F = 4 × ${M} = ${F.D(4 * M)}` }],
      };
    } },
    { id: "12-4", title: "望遠鏡的倍率、長度與成像方向", gen(r) {
      const gal = r.rand() < 0.5, Fo = r.step(2, 10, 1), Fe = (gal ? -1 : 1) * r.step(Fo + 4, 40, 2);
      const M = -Fe / Fo, d = 100 / Fo + 100 / Fe;
      return {
        q: `無焦望遠鏡：物鏡 ${F.D(Fo)}、目鏡 ${F.D(Fe)}。求 (a) 角放大率（含正負號）、(b) 鏡筒長（兩片間距），(c) 影像正立還是倒立？`,
        parts: [{ label: "(a) M", type: "num", ans: M, unit: "×" }, { label: "(b) 鏡筒長", type: "num", ans: d, unit: "cm" }, { label: "(c)", type: "choice", opts: ["正立（伽利略式）", "倒立（克卜勒式）"], ans: gal ? 0 : 1 }],
        steps: [
          { c: "角放大率只看兩片屈光力的比。", e: `M = −Fe / Fo = −(${F.s(Fe)}) / ${F.s(Fo)} = ${F.s(M)}×` },
          { c: "無焦條件：物鏡的 F′ 與目鏡的 F 重合，間距 = 兩個焦距相加。", e: `d = 1/${F.s(Fo)} + 1/${F.s(Fe)} = ${(100 / Fo).toFixed(2)} + (${F.s(100 / Fe)}) = ${d.toFixed(2)} cm` },
          { c: gal ? "負目鏡：伽利略式，M 為正，影像正立、鏡筒短。" : "正目鏡：克卜勒式，M 為負，影像倒立（需轉像稜鏡），鏡筒長，中間有實像。" },
        ],
      };
    } },
    { id: "12-5", title: "由瞳孔大小求倍率", gen(r) {
      const M = r.step(2, 8, 0.5), ex = r.step(2, 6, 0.5);
      return {
        q: `一支望遠鏡的入射瞳孔（物鏡口徑）直徑 ${(M * ex).toFixed(1)} mm，出射瞳孔直徑 ${ex} mm。角放大率是多少？`,
        parts: [{ label: "M", type: "num", ans: M, unit: "×" }],
        steps: [
          { c: "無焦系統中，角放大率 = 入射瞳孔 ÷ 出射瞳孔。", e: `M = ${(M * ex).toFixed(1)} / ${ex} = ${M.toFixed(2)}×` },
          { c: "臨床技巧：把望遠鏡對著亮處，在目鏡後方量出射光點（出射瞳孔）的大小，就能估計倍率。" },
        ],
      };
    } },
  ]);
})();
