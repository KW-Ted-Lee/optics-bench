/* 第 13 章 練習題（原創，數字隨機） */
(function () {
  const { define, F } = (typeof window !== "undefined" ? window : globalThis).OBPractice;
  const MAT = [["CR-39", 1.498], ["聚碳酸酯", 1.586], ["高折射率樹脂", 1.67]];
  function sm(Fv, d, F1, t, n) {
    const mp = 1 / (1 - (d / 1000) * Fv), ms = 1 / (1 - (t / 1000 / n) * F1);
    return { mp, ms, m: mp * ms };
  }

  define("ch13", [
    { id: "13-1", title: "眼鏡放大率", gen(r) {
      const [mn, n] = r.pick(MAT), Fv = r.sign() * r.step(2, 10, 0.25), d = r.step(10, 16, 1);
      const F1 = Fv > 0 ? r.step(Fv + 2, Fv + 6, 0.5) : r.step(1, 4, 0.5);
      const t = Fv > 0 ? r.step(4, 8, 0.5) : r.step(1.5, 2.5, 0.5);
      const s = sm(Fv, d, F1, t, n);
      return {
        q: `${mn}（n = ${n}）眼鏡片：後頂點屈光力 ${F.D(Fv)}、前表面 ${F.D(F1)}、中心厚 ${t} mm、頂點距離 ${d} mm。求 (a) 度數因子、(b) 形狀因子、(c) 眼鏡放大率（以 % 表示放大或縮小）。`,
        parts: [{ label: "(a) 度數因子", type: "num", ans: s.mp, dp: 4, tol: 0.0015 }, { label: "(b) 形狀因子", type: "num", ans: s.ms, dp: 4, tol: 0.0015 }, { label: "(c) 放大率", type: "num", ans: (s.m - 1) * 100, unit: "%", dp: 2, tol: 0.15 }],
        steps: [
          { c: "度數因子：與後頂點屈光力和頂點距離有關。", e: `1 / (1 − dFv) = 1 / (1 − ${(d / 1000).toFixed(3)} × ${F.s(Fv)}) = ${s.mp.toFixed(4)}` },
          { c: "形狀因子：與前表面屈光力、厚度、折射率有關（正鏡片前表面較凸、較厚，形狀因子較大）。", e: `1 / (1 − (t/n)F₁) = 1 / (1 − ${(t / 1000 / n).toFixed(6)} × ${F.s(F1)}) = ${s.ms.toFixed(4)}` },
          { c: "兩者相乘。", e: `M = ${s.mp.toFixed(4)} × ${s.ms.toFixed(4)} = ${s.m.toFixed(4)} → ${F.s((s.m - 1) * 100)} %` },
          { c: Fv < 0 ? "負鏡片：影像縮小。縮短頂點距離可以減少縮小量。" : "正鏡片：影像放大。" },
        ],
      };
    } },
    { id: "13-2", title: "兩眼眼鏡放大率差異", gen(r) {
      const n = 1.498, d = r.step(12, 14, 1), F1 = r.step(2, 4, 0.5), t = 2;
      const od = -r.step(0.5, 3, 0.25), os = -r.step(3.5, 8, 0.25);
      const a = sm(od, d, F1, t, n), b = sm(os, d, F1, t, n);
      const diff = (a.m - b.m) / b.m * 100;
      return {
        q: `兩眼皆為 CR-39 鏡片（n = 1.498），前表面 ${F.D(F1)}、中心厚 2.0 mm、頂點距離 ${d} mm。OD ${F.D(od)}、OS ${F.D(os)}。右眼影像比左眼大多少 %？`,
        parts: [{ label: "差異", type: "num", ans: diff, unit: "%", dp: 2, tol: 0.15 }],
        steps: [
          { c: "兩眼的形狀因子相同（同前弧、同厚度），差異來自度數因子。", e: `形狀因子 = ${a.ms.toFixed(4)}` },
          { c: "OD：", e: `${a.mp.toFixed(4)} × ${a.ms.toFixed(4)} = ${a.m.toFixed(4)}` },
          { c: "OS：", e: `${b.mp.toFixed(4)} × ${b.ms.toFixed(4)} = ${b.m.toFixed(4)}` },
          { c: "比較。", e: `(${a.m.toFixed(4)} − ${b.m.toFixed(4)}) / ${b.m.toFixed(4)} = ${diff.toFixed(2)} %` },
          { c: "一般而言差異超過約 3–5% 較可能有不等像症狀，可考慮縮短頂點距離、調整鏡片形式，或改用隱形眼鏡。" },
        ],
      };
    } },
    { id: "13-3", title: "視網膜像比正視眼大還是小？", gen(r) {
      const type = r.pick(["軸性", "屈光性"]), err = r.pick(["近視", "遠視"]), corr = r.pick(["未矯正", "隱形眼鏡", "眼鏡"]);
      let ans;
      if (type === "軸性") ans = corr === "眼鏡" ? 2 : err === "近視" ? 0 : 1;
      else ans = corr === "眼鏡" ? (err === "近視" ? 1 : 0) : 2;
      const why = type === "軸性"
        ? (corr === "眼鏡" ? "軸性屈光不正以眼鏡（約在眼睛前焦點）矯正時，依 Knapp 定律，影像約與正視眼相同。" : `軸性${err}眼${err === "近視" ? "較長" : "較短"}，未矯正或戴隱形眼鏡時，影像${err === "近視" ? "比正視眼大" : "比正視眼小"}；隱形眼鏡不改變這個差異。`)
        : (corr === "眼鏡" ? `眼軸正常，${err === "近視" ? "負" : "正"}眼鏡片位於眼前，產生${err === "近視" ? "縮小" : "放大"}效果。` : "屈光性屈光不正眼軸正常，未矯正或戴隱形眼鏡時，影像約與正視眼相同。");
      return {
        q: `${type}${err}，${corr}。與正視眼相比，視網膜像（中心）大小如何？`,
        parts: [{ label: "答案", type: "choice", opts: ["較大", "較小", "約相同"], ans }],
        steps: [{ c: why }, { c: "記憶方式：先問「眼睛長度正不正常」（軸性 vs 屈光性），再問「矯正鏡片離眼睛多遠」（隱形眼鏡 vs 眼鏡）。" }],
      };
    } },
    { id: "13-4", title: "Knapp 定律的鏡片位置", gen(r) {
      const P = r.step(56, 66, 0.5);
      const f = 1 / P * 1000;
      return {
        q: `一隻簡化眼的屈光力為 ${F.D(P)}。依 Knapp 定律，矯正軸性屈光不正的眼鏡應放在角膜前多少 mm，才能讓視網膜像與同屈光力的正視眼一樣大？`,
        parts: [{ label: "距離", type: "num", ans: f, unit: "mm" }],
        steps: [
          { c: "Knapp 定律：鏡片放在眼睛的第一焦點（前焦點）上。" },
          { c: "前焦距在空氣中量（n = 1）。", e: `f = −1 / F = −1 / ${P.toFixed(2)} = ${F.s(-f / 1000, 5)} m → 角膜前 ${f.toFixed(2)} mm` },
          { c: "此時「鏡片 + 眼睛」系統的等效屈光力等於眼睛本身，所以像大小不受鏡片度數影響。" },
        ],
      };
    } },
  ]);
})();
