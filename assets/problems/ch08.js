/* 第 8 章 練習題（原創，數字隨機）；調節以角膜面計算 */
(function () {
  const { define, F } = (typeof window !== "undefined" ? window : globalThis).OBPractice;

  define("ch08", [
    { id: "8-1", title: "由遠點與近點求調節幅度", gen(r) {
      const myo = r.rand() < 0.6;
      const K = myo ? -r.step(1, 6, 0.25) : r.step(0.5, 3, 0.25);
      const fp = myo ? 100 / -K : null;
      const np = myo ? r.step(5, Math.min(15, Math.floor(fp) - 3), 1) : r.step(15, 50, 5);
      const A = K + 100 / np;
      return {
        q: myo ? `一位未矯正的 ${F.D(K)} 近視者（角膜面），最近能看清的距離是角膜前 ${np} cm。他的調節幅度是多少？`
               : `一位未矯正的 ${F.D(K)} 遠視者（角膜面），用盡調節時最近能看清角膜前 ${np} cm。他的調節幅度是多少？`,
        parts: [{ label: "調節幅度", type: "num", ans: A, unit: "D" }],
        steps: [
          { c: "調節幅度 = 遠點聚散度與近點聚散度的差（在屈光度尺上量寬度）。" },
          { c: myo ? "遠點在眼前，從遠點來的光聚散度就等於 K。" : "遠視的遠點在眼後，遠點聚散度 K 為正。", e: `遠點聚散度 = ${F.D(K)}` },
          { c: "近點的物聚散度。", e: `近點：−1 / ${(np / 100).toFixed(2)} = ${F.D(-100 / np)}` },
          { c: "相減。", e: `A = ${F.s(K)} − (${F.s(-100 / np)}) = ${F.D(A)}` },
          { c: myo ? "近視眼本身偏強，同樣的調節幅度，近點會比正視者更近。" : "遠視者要先用掉一部分調節才看得清遠方，剩下的調節才拿來看近，所以近點較遠。" },
        ],
      };
    } },
    { id: "8-2", title: "未矯正時看近需要多少調節", gen(r) {
      const K = r.sign() * r.step(0.5, 4, 0.25), x = r.step(20, 50, 5), Amp = r.step(1, 8, 0.5);
      const A = K + 100 / x;
      const res = A < 0 ? 2 : A <= Amp ? 0 : 1;
      return {
        q: `未矯正、屈光不正 ${F.D(K)}（角膜面）的病人看角膜前 ${x} cm 的書。(a) 需要多少調節？(b) 他的調節幅度是 ${Amp.toFixed(2)} D，看得清楚嗎？`,
        parts: [{ label: "(a) 需要的調節", type: "num", ans: A, unit: "D" }, { label: "(b)", type: "choice", opts: ["看得清楚", "太近，調節不夠", "物體在遠點之外，模糊"], ans: res }],
        steps: [
          { c: "物體送到角膜的聚散度：", e: `L = −1 / ${(x / 100).toFixed(2)} = ${F.D(-100 / x)}` },
          { c: "調節的任務：把 L 變成眼睛遠點的聚散度 K（這樣才會成像在視網膜上）。", e: `F調節 = K − L = ${F.s(K)} − (${F.s(-100 / x)}) = ${F.D(A)}` },
          { c: res === 0 ? "需要的調節不超過調節幅度，看得清楚。" : res === 1 ? "需要的調節超過調節幅度，物體比近點還近，看不清楚。" : "需要的調節為負：物體在近視者的遠點之外，眼睛無法「放鬆」更多，所以模糊。" },
        ],
      };
    } },
    { id: "8-3", title: "眼鏡與隱形眼鏡的調節需求", gen(r) {
      const K = r.sign() * r.step(3, 10, 0.5), x = r.step(10, 40, 5), dmm = r.step(12, 16, 1), d = dmm / 1000;
      const Fs = K / (1 + d * K);
      const Acl = 100 / x;
      const Ls = -1 / (x / 100 - d), Lsp = Ls + Fs, Lc = Lsp / (1 - d * Lsp), Asp = K - Lc;
      return {
        q: `屈光不正 ${F.D(K)}（角膜面）的病人看角膜前 ${x} cm 的物體。求完全矯正時所需的調節：(a) 戴隱形眼鏡、(b) 戴頂點距離 ${dmm} mm 的眼鏡（${F.D(Fs)}）。(c) 哪一種需要較多調節？`,
        parts: [{ label: "(a) 隱形眼鏡", type: "num", ans: Acl, unit: "D" }, { label: "(b) 眼鏡", type: "num", ans: Asp, unit: "D" }, { label: "(c)", type: "choice", opts: ["隱形眼鏡", "眼鏡"], ans: Acl > Asp ? 0 : 1 }],
        steps: [
          { c: "隱形眼鏡在角膜上，完全矯正後眼睛等同正視眼，調節需求 = 物體距離的倒數。", e: `A = 1 / ${(x / 100).toFixed(2)} = ${F.D(Acl)}` },
          { c: "眼鏡：先算物體到眼鏡的聚散度，經過鏡片後再走到角膜。", e: `L(眼鏡面) = −1 / ${(x / 100 - d).toFixed(3)} = ${F.D(Ls)}\nL′ = ${F.s(Ls)} + ${F.s(Fs)} = ${F.D(Lsp)}\n到角膜：${F.s(Lsp)} / (1 − ${d.toFixed(3)} × ${F.s(Lsp)}) = ${F.D(Lc)}` },
          { c: "調節把角膜處的聚散度變成遠點聚散度 K。", e: `A = K − L(角膜) = ${F.s(K)} − (${F.s(Lc)}) = ${F.D(Asp)}` },
          { c: K < 0 ? "近視者戴眼鏡看近需要的調節較少；改戴隱形眼鏡後調節需求增加。" : "遠視者戴眼鏡看近需要的調節較多；改戴隱形眼鏡反而較輕鬆。" },
        ],
      };
    } },
    { id: "8-4", title: "老花加入度", gen(r) {
      const Amp = r.step(0.5, 3, 0.25), x = r.pick([33, 40, 50]);
      const add = 100 / x - Amp / 2;
      return {
        q: `一位遠用已完全矯正的老花病人，調節幅度 ${Amp.toFixed(2)} D。他想在 ${x} cm 閱讀，而且只使用一半的調節幅度（保留另一半）。需要多少加入度？`,
        parts: [{ label: "加入度", type: "num", ans: add, unit: "D" }],
        steps: [
          { c: "在 " + x + " cm 閱讀，總共需要的屈光力：", e: `1 / ${(x / 100).toFixed(2)} = ${F.D(100 / x)}` },
          { c: "病人自己提供一半的調節幅度。", e: `${Amp.toFixed(2)} / 2 = ${F.D(Amp / 2)}` },
          { c: "不足的部分由加入度補上。", e: `add = ${F.s(100 / x)} − ${F.s(Amp / 2)} = ${F.D(add)}` },
          { c: "臨床上會再依景深與實際試戴微調（通常以 0.25 D 為單位）。" },
        ],
      };
    } },
    { id: "8-5", title: "戴加入度時的清晰範圍", gen(r) {
      const add = r.step(1, 3, 0.25), Amp = r.step(0.5, 3, 0.25);
      return {
        q: `遠用完全矯正的病人戴 ${F.D(add)} 加入度，調節幅度 ${Amp.toFixed(2)} D。透過加入度能看清的範圍：(a) 最遠多少 cm？(b) 最近多少 cm？（忽略景深）`,
        parts: [{ label: "(a) 最遠", type: "num", ans: 100 / add, unit: "cm", dp: 1 }, { label: "(b) 最近", type: "num", ans: 100 / (add + Amp), unit: "cm", dp: 1 }],
        steps: [
          { c: "不調節時，加入度就像一個近視眼：遠點在 1/add。", e: `最遠 = 1 / ${add.toFixed(2)} = ${(100 / add).toFixed(1)} cm` },
          { c: "用盡調節時，總屈光力 = add + 調節幅度。", e: `最近 = 1 / (${add.toFixed(2)} + ${Amp.toFixed(2)}) = ${(100 / (add + Amp)).toFixed(1)} cm` },
          { c: "清晰範圍的「寬度」在屈光度尺上仍等於調節幅度，只是整段往近處移。" },
        ],
      };
    } },
    { id: "8-6", title: "年齡與近點", gen(r) {
      const age = r.int(10, 55), Amp = Math.max(0, 18.5 - 0.3 * age);
      return {
        q: `用 Hofstetter 平均值公式（18.5 − 0.3 × 年齡）估計一位 ${age} 歲正視者的 (a) 調節幅度、(b) 近點距離。`,
        parts: [{ label: "(a) 調節幅度", type: "num", ans: Amp, unit: "D" }, { label: "(b) 近點", type: "num", ans: 100 / Amp, unit: "cm", dp: 1 }],
        steps: [
          { c: "代入經驗公式（這是臨床常用的平均值估計，個人差異很大）。", e: `18.5 − 0.3 × ${age} = ${Amp.toFixed(2)} D` },
          { c: "正視者的遠點在無限遠（0 D），近點聚散度就等於調節幅度。", e: `近點 = 1 / ${Amp.toFixed(2)} = ${(100 / Amp).toFixed(1)} cm` },
          { c: age >= 40 ? "近點已接近或超過一般閱讀距離，開始出現老花症狀。" : "年輕時近點很近，閱讀時只用到一小部分調節。" },
        ],
      };
    } },
  ]);
})();
