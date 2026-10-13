/* 第 2 章 練習題（原創，數字隨機） */
(function () {
  const { define, F } = (typeof window !== "undefined" ? window : globalThis).OBPractice;
  const MAT = [["房水", 1.336], ["角膜", 1.376], ["CR-39", 1.498], ["冕牌玻璃", 1.523], ["聚碳酸酯", 1.586]];
  const shapeOf = (r) => (r > 0 ? "凸面，曲率中心在右側" : "凹面，曲率中心在左側");

  define("ch02", [
    { id: "2-1", title: "球面屈光力與會聚／發散", gen(r) {
      const [mn, nm] = r.pick(MAT), rev = r.rand() < 0.3;
      const n = rev ? nm : 1.0, n2 = rev ? 1.0 : nm;
      const R = r.sign() * r.pick([10, 15, 20, 25, 40, 50, 80, 100, 125, 200]);
      const P = (n2 - n) / (R / 1000);
      return {
        q: `光由${rev ? mn : "空氣"}（n = ${n.toFixed(3)}）射向${rev ? "空氣" : mn}（n′ = ${n2.toFixed(3)}），交界處是一個曲率半徑 r = ${F.s(R, 1)} mm 的球面（${shapeOf(R)}）。(a) 表面屈光力？(b) 這個表面會聚還是發散？`,
        parts: [{ label: "(a) 屈光力 F", type: "num", ans: P, unit: "D" }, { label: "(b) 性質", type: "choice", opts: ["會聚", "發散"], ans: P > 0 ? 0 : 1 }],
        steps: [
          { c: "半徑換成公尺，注意正負號：曲率中心在右側為正。", e: `r = ${F.s(R, 1)} mm = ${F.s(R / 1000, 4)} m` },
          { c: "表面屈光力由折射率差與曲率共同決定。", e: `F = (n′ − n) / r = (${n2.toFixed(3)} − ${n.toFixed(3)}) / ${F.s(R / 1000, 4)} = ${F.D(P)}` },
          { c: `屈光力為${P > 0 ? "正" : "負"}，所以是${P > 0 ? "會聚" : "發散"}面。${rev ? "注意光是由高折射率射向低折射率，形狀與會聚／發散的關係和平常相反。" : ""}` },
        ],
      };
    } },
    { id: "2-2", title: "第一與第二焦距", gen(r) {
      const [mn, n2] = r.pick(MAT), P = r.sign() * r.step(4, 40, 2);
      const f2 = n2 / P * 100, f1 = -1 / P * 100;
      return {
        q: `空氣（n = 1.000）與${mn}（n′ = ${n2.toFixed(3)}）的交界面，屈光力為 ${F.D(P)}。求 (a) 第二焦距 f′ 與 (b) 第一焦距 f（皆以 cm、含正負號）。`,
        parts: [{ label: "(a) f′", type: "num", ans: f2, unit: "cm" }, { label: "(b) f", type: "num", ans: f1, unit: "cm" }],
        steps: [
          { c: "第二焦點 F′：平行光進入後聚焦（或看起來發散）的點，在折射後的介質 n′ 中量。", e: `f′ = n′ / F = ${n2.toFixed(3)} / ${F.s(P)} = ${F.s(f2 / 100, 4)} m = ${F.s(f2)} cm` },
          { c: "第一焦點 F：發出後經表面變成平行光的點，在入射介質 n 中量。", e: `f = −n / F = −1.000 / ${F.s(P)} = ${F.s(f1)} cm` },
          { c: "兩側折射率不同，所以 |f| ≠ |f′|；折射率較高那一側的焦距較長。" },
        ],
      };
    } },
    { id: "2-3", title: "由屈光力求曲率半徑", gen(r) {
      const [mn, n2] = r.pick(MAT), P = r.sign() * r.step(5, 50, 2.5);
      const R = (n2 - 1) / P * 1000;
      return {
        q: `光由空氣射入${mn}（n′ = ${n2.toFixed(3)}），交界球面的屈光力為 ${F.D(P)}。(a) 曲率半徑是多少 mm？(b) 面向入射光，這是凸面還是凹面？`,
        parts: [{ label: "(a) r", type: "num", ans: R, unit: "mm", dp: 1 }, { label: "(b) 形狀", type: "choice", opts: ["凸面", "凹面"], ans: R > 0 ? 0 : 1 }],
        steps: [
          { c: "把屈光力公式移項。", e: `r = (n′ − n) / F = ${(n2 - 1).toFixed(3)} / ${F.s(P)} = ${F.s(R / 1000, 4)} m = ${F.s(R, 1)} mm` },
          { c: `r 為${R > 0 ? "正，曲率中心在右側（介質內），表面朝入射光凸出" : "負，曲率中心在左側，表面朝入射光凹陷"}。` },
        ],
      };
    } },
    { id: "2-4", title: "角膜前表面", gen(r) {
      const R = r.step(7.2, 8.4, 0.1);
      const P = (1.376 - 1) / (R / 1000), f2 = 1.376 / P * 1000;
      return {
        q: `把角膜前表面視為空氣（1.000）與角膜（1.376）的交界面，曲率半徑 ${R.toFixed(1)} mm。(a) 表面屈光力？(b) 平行光經這個表面後聚焦在角膜後方多遠（mm）？`,
        parts: [{ label: "(a) F", type: "num", ans: P, unit: "D" }, { label: "(b) f′", type: "num", ans: f2, unit: "mm", dp: 1 }],
        steps: [
          { c: "角膜前表面朝外凸出，曲率中心在眼內（右側），r 為正。", e: `F = (1.376 − 1.000) / ${(R / 1000).toFixed(4)} = ${F.D(P)}` },
          { c: "這就是角膜弧度儀「K 值」的原理：曲率越小（越陡），屈光力越大。" },
          { c: "第二焦距在角膜介質中量。", e: `f′ = n′ / F = 1.376 / ${P.toFixed(2)} = ${(f2 / 1000).toFixed(5)} m = ${f2.toFixed(1)} mm` },
        ],
      };
    } },
    { id: "2-5", title: "簡化眼的屈光力與眼軸", gen(r) {
      const R = r.step(5.2, 6.0, 0.05);
      const P = (1.333 - 1) / (R / 1000), L = 1.333 / P * 1000;
      return {
        q: `一個簡化眼由單一折射面組成：空氣（1.000）到房水（1.333），曲率半徑 ${R.toFixed(2)} mm。(a) 眼睛的屈光力？(b) 若要成為正視眼，眼軸（折射面到視網膜）應為多少 mm？`,
        parts: [{ label: "(a) F", type: "num", ans: P, unit: "D" }, { label: "(b) 眼軸", type: "num", ans: L, unit: "mm" }],
        steps: [
          { c: "表面屈光力公式。", e: `F = (1.333 − 1.000) / ${(R / 1000).toFixed(5)} = ${F.D(P)}` },
          { c: "正視眼：平行光剛好聚焦在視網膜上，所以眼軸 = 第二焦距。", e: `f′ = 1.333 / ${P.toFixed(2)} = ${L.toFixed(2)} mm` },
          { c: "課本的標準簡化眼 r = 5.55 mm，得到 +60.00 D、22.22 mm。" },
        ],
      };
    } },
    { id: "2-6", title: "判斷實像或虛像", gen(r) {
      const [mn, n2] = r.pick(MAT), P = r.step(5, 20, 2.5);
      const f1 = 100 / P; // |f| cm（n = 1）
      const l = -Math.round(f1 * r.pick([0.4, 0.6, 1.5, 2, 3]));
      const L = 100 / l, Lp = L + P;
      const real = Lp > 0;
      return {
        q: `空氣與${mn}（n′ = ${n2.toFixed(3)}）的交界面屈光力為 ${F.D(P)}。一個實物放在表面左方 ${Math.abs(l)} cm。不必算出像距，判斷 (a) 像是實像還是虛像？(b) 正立還是倒立？`,
        parts: [{ label: "(a)", type: "choice", opts: ["實像", "虛像"], ans: real ? 0 : 1 }, { label: "(b)", type: "choice", opts: ["正立", "倒立"], ans: real ? 1 : 0 }],
        steps: [
          { c: "先找第一焦點：", e: `f = −1 / F = ${F.s(-f1, 1)} cm（物體在 F ${Math.abs(l) > f1 ? "之外" : "之內"}）` },
          { c: "或用聚散度：", e: `L = 1 / ${F.s(l / 100, 2)} = ${F.D(L)}\nL′ = L + F = ${F.D(Lp)}` },
          { c: real ? "L′ 為正：射出會聚光，形成實像。單一球面的實像是倒立的。" : "L′ 為負：射出的光仍發散，只能由延長線形成虛像，虛像正立。" },
        ],
      };
    } },
  ]);
})();
