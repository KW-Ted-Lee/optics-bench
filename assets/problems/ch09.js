/* 第 9 章 練習題（原創，數字隨機） */
(function () {
  const { define, F, rad } = (typeof window !== "undefined" ? window : globalThis).OBPractice;
  const ax3 = (a) => String(a).padStart(3, "0");
  const rx = (S, C, A) => `${F.s(S)} ${F.s(C)} × ${ax3(A)}`;
  const flip = (A) => (A + 90 > 180 ? A - 90 : A + 90);
  /* 鏡片十字：@ 軸方向 = S；@ 與軸垂直 = S + C */
  const cross = (S, C, A) => ({ at90: A === 90 ? S : S + C, at180: A === 180 ? S : S + C });

  define("ch09", [
    { id: "9-1", title: "正、負柱鏡處方轉換", gen(r) {
      const S = r.sign() * r.step(0, 6, 0.25), C = r.sign() * r.step(0.5, 4, 0.25), A = r.step(5, 180, 5);
      const S2 = S + C, C2 = -C, A2 = flip(A);
      return {
        q: `把處方 <span class="eq">${rx(S, C, A)}</span> 轉換成另一種柱鏡寫法。`,
        parts: [{ label: "球面度", type: "num", ans: S2, unit: "D" }, { label: "柱面度", type: "num", ans: C2, unit: "D" }, { label: "軸", type: "num", ans: A2, unit: "°", dp: 0, tol: 0.5 }],
        steps: [
          { c: "新球面度 = 球面度 + 柱面度。", e: `${F.s(S)} + (${F.s(C)}) = ${F.s(S2)}` },
          { c: "柱面度變號。", e: `${F.s(C)} → ${F.s(C2)}` },
          { c: "軸轉 90°（結果保持在 1–180）。", e: `${ax3(A)} → ${ax3(A2)}` },
          { c: "兩種寫法描述的是同一片鏡片，鏡片十字完全相同。", e: `轉換結果：${rx(S2, C2, A2)}` },
        ],
      };
    } },
    { id: "9-2", title: "鏡片十字", gen(r) {
      const S = r.sign() * r.step(0, 6, 0.25), C = r.sign() * r.step(0.5, 4, 0.25), A = r.pick([90, 180]);
      const k = cross(S, C, A);
      return {
        q: `處方 <span class="eq">${rx(S, C, A)}</span>。畫出鏡片十字：垂直子午線（@090）與水平子午線（@180）的屈光力各是多少？`,
        parts: [{ label: "@090", type: "num", ans: k.at90, unit: "D" }, { label: "@180", type: "num", ans: k.at180, unit: "D" }],
        steps: [
          { c: "柱鏡在「軸」的方向沒有屈光力，所以軸方向只剩球面度。", e: `@${ax3(A)} = ${F.D(S)}` },
          { c: "與軸垂直的方向，球面度加上完整的柱面度。", e: `@${ax3(flip(A))} = ${F.s(S)} + (${F.s(C)}) = ${F.D(S + C)}` },
        ],
      };
    } },
    { id: "9-3", title: "點光源的兩條焦線", gen(r) {
      let S, C, A, l, k, x90, x180;
      for (let i = 0; i < 100; i++) {
        S = r.step(4, 10, 0.5); C = r.step(1, 4, 0.5); A = r.pick([90, 180]); l = -r.step(30, 100, 10);
        k = cross(S, C, A);
        const L = 100 / l; const a = L + k.at90, b = L + k.at180;
        if (a > 0.8 && b > 0.8) { x90 = 100 / a; x180 = 100 / b; break; }
      }
      const hFirst = x90 < x180;
      return {
        q: `點光源在 <span class="eq">${rx(S, C, A)}</span> 鏡片左方 ${Math.abs(l)} cm。求 (a) 水平焦線、(b) 垂直焦線到鏡片的距離，(c) 哪一條離鏡片較近？`,
        parts: [{ label: "(a) 水平焦線", type: "num", ans: x90, unit: "cm" }, { label: "(b) 垂直焦線", type: "num", ans: x180, unit: "cm" }, { label: "(c) 較近的是", type: "choice", opts: ["水平焦線", "垂直焦線"], ans: hFirst ? 0 : 1 }],
        steps: [
          { c: "先畫鏡片十字。", e: `@090 = ${F.D(k.at90)}　@180 = ${F.D(k.at180)}` },
          { c: "關鍵觀念：垂直子午線把光「上下」聚攏，形成的是<b>水平</b>焦線；水平子午線形成<b>垂直</b>焦線。" },
          { c: "物聚散度。", e: `L = 1 / ${F.s(l / 100, 2)} = ${F.D(100 / l)}` },
          { c: "垂直子午線 → 水平焦線。", e: `L′ = ${F.s(100 / l)} + ${F.s(k.at90)} = ${F.D(100 / l + k.at90)} → ${x90.toFixed(2)} cm` },
          { c: "水平子午線 → 垂直焦線。", e: `L′ = ${F.s(100 / l)} + ${F.s(k.at180)} = ${F.D(100 / l + k.at180)} → ${x180.toFixed(2)} cm` },
        ],
      };
    } },
    { id: "9-4", title: "斜向子午線的屈光力", gen(r) {
      const S = r.sign() * r.step(0, 4, 0.25), C = r.sign() * r.step(1, 4, 0.25), A = r.pick([90, 180, 45, 135, 30, 60, 120, 150]);
      let th = r.step(0, 175, 5); if (th === A % 180) th = (th + 30) % 180;
      const ang = th - A, P = S + C * Math.pow(Math.sin(rad(ang)), 2);
      return {
        q: `處方 <span class="eq">${rx(S, C, A)}</span>。在 ${th}° 子午線上的屈光力約為多少？`,
        parts: [{ label: `@${ax3(th)}`, type: "num", ans: P, unit: "D" }],
        steps: [
          { c: "柱鏡的屈光力隨子午線與軸的夾角 θ 而變：軸上為 0，垂直時為全部。", e: `θ = ${th} − ${A} = ${ang}°` },
          { c: "正弦平方公式。", e: `F柱(θ) = C sin²θ = ${F.s(C)} × sin²(${ang}°) = ${F.s(C)} × ${Math.pow(Math.sin(rad(ang)), 2).toFixed(4)} = ${F.s(C * Math.pow(Math.sin(rad(ang)), 2))}` },
          { c: "加上球面度。", e: `F = ${F.s(S)} + (${F.s(C * Math.pow(Math.sin(rad(ang)), 2))}) = ${F.D(P)}` },
        ],
      };
    } },
    { id: "9-5", title: "等價球面度", gen(r) {
      const S = r.sign() * r.step(0, 6, 0.25), C = r.sign() * r.step(0.5, 4, 0.25), A = r.step(5, 180, 5);
      const SE = S + C / 2;
      return {
        q: `處方 <span class="eq">${rx(S, C, A)}</span> 的等價球面度是多少？`,
        parts: [{ label: "SE", type: "num", ans: SE, unit: "D" }],
        steps: [
          { c: "等價球面度把最小模糊圈放到視網膜上，它是兩條主子午線屈光力的平均值。", e: `SE = S + C/2 = ${F.s(S)} + (${F.s(C)}/2) = ${F.D(SE)}` },
          { c: "驗證：兩條主子午線是 " + F.s(S) + " 與 " + F.s(S + C) + "，平均正好是 " + F.s(SE) + "。" },
        ],
      };
    } },
    { id: "9-6", title: "散光分類", gen(r) {
      const types = ["複性近視散光", "單純近視散光", "混合散光", "單純遠視散光", "複性遠視散光"];
      const t = r.int(0, 4), C = -r.step(0.5, 3, 0.25);
      let S;
      if (t === 0) S = -r.step(0.25, 4, 0.25);
      else if (t === 1) S = 0;
      else if (t === 2) S = r.step(0.25, -C - 0.25, 0.25);
      else if (t === 3) S = -C;
      else S = r.step(-C + 0.25, -C + 4, 0.25);
      const A = r.pick([180, 175, 5, 90, 85, 95]);
      const wtr = A >= 150 || A <= 30;
      return {
        q: `矯正處方（負柱鏡）<span class="eq">${rx(S, C, A)}</span>。(a) 這是哪一類散光？(b) 順規還是逆規？`,
        parts: [{ label: "(a) 類型", type: "choice", opts: types, ans: t }, { label: "(b)", type: "choice", opts: ["順規（with-the-rule）", "逆規（against-the-rule）"], ans: wtr ? 0 : 1 }],
        steps: [
          { c: "找出兩條主子午線需要的矯正量。", e: `@${ax3(A)}：${F.D(S)}\n@${ax3(flip(A))}：${F.s(S)} + (${F.s(C)}) = ${F.D(S + C)}` },
          { c: "矯正量為負 → 該子午線焦線在視網膜前；為 0 → 在視網膜上；為正 → 在視網膜後。" },
          { c: `兩條焦線：${S < 0 ? "前" : S === 0 ? "視網膜上" : "後"}、${S + C < 0 ? "前" : S + C === 0 ? "視網膜上" : "後"} → ${types[t]}。` },
          { c: wtr ? "負柱鏡軸在 180 附近：垂直子午線較強，稱為順規散光（年輕人常見）。" : "負柱鏡軸在 090 附近：水平子午線較強，稱為逆規散光（年長者較常見）。" },
        ],
      };
    } },
  ]);
})();
