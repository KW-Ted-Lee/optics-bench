/* 第 7 章 練習題（原創，數字隨機）；簡化眼 +60.00 D、n′ = 1.333 */
(function () {
  const { define, F } = (typeof window !== "undefined" ? window : globalThis).OBPractice;
  const NP = 1.333, FE = 60;

  define("ch07", [
    { id: "7-1", title: "眼鏡度數換成隱形眼鏡", gen(r) {
      const Fs = r.sign() * r.step(3, 12, 0.25), d = r.step(10, 16, 1);
      const Fc = Fs / (1 - (d / 1000) * Fs);
      return {
        q: `病人戴 ${F.D(Fs)} 眼鏡完全矯正，頂點距離 ${d} mm。改戴隱形眼鏡需要多少度？與眼鏡相比，度數的「大小」變多還是變少？`,
        parts: [{ label: "隱形眼鏡度數", type: "num", ans: Fc, unit: "D" }, { label: "大小比較", type: "choice", opts: ["變多", "變少"], ans: Math.abs(Fc) > Math.abs(Fs) ? 0 : 1 }],
        steps: [
          { c: "矯正原則：眼鏡的 F′ 就是遠點。先找遠點在哪。", e: `f′ = 1 / ${F.s(Fs)} = ${F.s(1000 / Fs, 1)} mm（從眼鏡量）` },
          { c: "換成從角膜量（角膜在眼鏡後 " + d + " mm）。", e: `遠點到角膜 = ${F.s(1000 / Fs, 1)} − ${d} = ${F.s(1000 / Fs - d, 1)} mm` },
          { c: "隱形眼鏡在角膜上，它的 F′ 要落在同一個遠點。", e: `Fc = 1000 / ${F.s(1000 / Fs - d, 1)} = ${F.D(Fc)}` },
          { c: Fs < 0 ? "近視：隱形眼鏡需要的負度數較少。" : "遠視：隱形眼鏡需要的正度數較多。" },
        ],
      };
    } },
    { id: "7-2", title: "隱形眼鏡度數換成眼鏡", gen(r) {
      const Fc = r.sign() * r.step(3, 12, 0.25), d = r.step(10, 16, 1);
      const Fs = Fc / (1 + (d / 1000) * Fc);
      return {
        q: `病人戴 ${F.D(Fc)} 隱形眼鏡完全矯正。若改戴頂點距離 ${d} mm 的眼鏡，需要多少度？`,
        parts: [{ label: "眼鏡度數", type: "num", ans: Fs, unit: "D" }],
        steps: [
          { c: "隱形眼鏡的 F′ 就是遠點（從角膜量）。", e: `遠點 = 1000 / ${F.s(Fc)} = ${F.s(1000 / Fc, 1)} mm` },
          { c: "眼鏡在角膜前 " + d + " mm，遠點到眼鏡的距離要多加這段。", e: `${F.s(1000 / Fc, 1)} + ${d} = ${F.s(1000 / Fc + d, 1)} mm` },
          { c: "眼鏡的 F′ 要落在遠點。", e: `Fs = 1000 / ${F.s(1000 / Fc + d, 1)} = ${F.D(Fs)}` },
        ],
      };
    } },
    { id: "7-3", title: "由遠點求矯正處方", gen(r) {
      const myo = r.rand() < 0.6, d = r.step(10, 16, 1);
      const x = myo ? r.step(12, 100, 2) : r.step(15, 100, 5); // cm
      const K = myo ? -100 / x : 100 / x;
      const fromLens = myo ? -(x * 10 - d) : (x * 10 + d); // mm
      const Fs = 1000 / fromLens;
      return {
        q: myo ? `一位病人不調節時能看清的最遠距離在角膜前 ${x} cm。(a) 角膜面的屈光不正是多少？(b) 頂點距離 ${d} mm 的眼鏡處方？`
               : `一位遠視病人的遠點在角膜後 ${x} cm。(a) 角膜面的屈光不正是多少？(b) 頂點距離 ${d} mm 的眼鏡處方？`,
        parts: [{ label: "(a) 角膜面", type: "num", ans: K, unit: "D" }, { label: "(b) 眼鏡", type: "num", ans: Fs, unit: "D" }],
        steps: [
          { c: myo ? "遠點在眼前（左側），矯正鏡片是負的。" : "遠點在眼後（右側、虛的），矯正鏡片是正的。", e: `角膜面：1 / ${F.s((myo ? -x : x) / 100, 2)} m = ${F.D(K)}` },
          { c: "眼鏡的 F′ 要落在遠點；從眼鏡量遠點距離。", e: `${myo ? `−(${x * 10} − ${d})` : `${x * 10} + ${d}`} = ${F.s(fromLens, 0)} mm` },
          { c: "處方。", e: `Fs = 1000 / ${F.s(fromLens, 0)} = ${F.D(Fs)}` },
        ],
      };
    } },
    { id: "7-4", title: "軸性屈光不正的眼軸", gen(r) {
      const K = r.sign() * r.step(1, 10, 0.5);
      const L = NP / (FE + K) * 1000;
      return {
        q: `簡化眼（屈光力 +60.00 D、n′ = 1.333）有 ${F.D(K)} 的屈光不正（角膜面），且完全是軸性。(a) 眼軸長多少 mm？(b) 比正視眼（22.22 mm）長還是短？`,
        parts: [{ label: "(a) 眼軸", type: "num", ans: L, unit: "mm" }, { label: "(b)", type: "choice", opts: ["較長", "較短"], ans: L > 22.22 ? 0 : 1 }],
        steps: [
          { c: "遠點的光（聚散度 K）進入眼睛，要剛好聚在視網膜上。", e: `L′ = K + F眼 = ${F.s(K)} + 60.00 = ${F.D(FE + K)}` },
          { c: "視網膜位置 = 像距（在 n′ = 1.333 中）。", e: `眼軸 = 1.333 / ${F.s(FE + K)} = ${(L / 1000).toFixed(5)} m = ${L.toFixed(2)} mm` },
          { c: K < 0 ? "近視：眼睛「太長」。" : "遠視：眼睛「太短」。" },
        ],
      };
    } },
    { id: "7-5", title: "屈光性屈光不正的眼屈光力", gen(r) {
      const K = r.sign() * r.step(1, 10, 0.5), Fe = FE - K;
      return {
        q: `簡化眼眼軸正常（22.22 mm），有 ${F.D(K)} 的屈光不正（角膜面），完全是屈光性。眼睛的屈光力是多少？`,
        parts: [{ label: "眼屈光力", type: "num", ans: Fe, unit: "D" }],
        steps: [
          { c: "眼軸 22.22 mm 時，要聚焦在視網膜上，射出的聚散度必須是 +60.00 D。", e: `L′ = 1.333 / 0.02222 = +60.00 D` },
          { c: "遠點的光 K 加上眼屈光力要等於 +60.00 D。", e: `F眼 = 60.00 − (${F.s(K)}) = ${F.D(Fe)}` },
          { c: K < 0 ? "近視：眼睛「太強」。" : "遠視：眼睛「太弱」。" },
        ],
      };
    } },
    { id: "7-6", title: "由眼鏡處方推眼軸", gen(r) {
      const Fs = r.sign() * r.step(2, 10, 0.25), d = r.step(10, 16, 1);
      const K = Fs / (1 - (d / 1000) * Fs), L = NP / (FE + K) * 1000;
      return {
        q: `一隻軸性屈光不正的簡化眼戴 ${F.D(Fs)} 眼鏡（頂點距離 ${d} mm）完全矯正。求 (a) 角膜面的屈光不正、(b) 眼軸長。`,
        parts: [{ label: "(a) 角膜面", type: "num", ans: K, unit: "D" }, { label: "(b) 眼軸", type: "num", ans: L, unit: "mm" }],
        steps: [
          { c: "鏡片有效度：先換算到角膜面。", e: `K = ${F.s(Fs)} / (1 − ${(d / 1000).toFixed(3)} × ${F.s(Fs)}) = ${F.D(K)}` },
          { c: "軸性：屈光力 +60.00 D 不變，眼軸配合 K。", e: `眼軸 = 1.333 / (60.00 + (${F.s(K)})) = ${L.toFixed(2)} mm` },
        ],
      };
    } },
  ]);
})();
