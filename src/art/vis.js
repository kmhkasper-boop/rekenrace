/* ===== plaatjes bij vragen: stippen, klok, digitale klok, geld, breuk ===== */
function drawVis(c, v, W, H) {
  c.clearRect(0, 0, W, H); if (!v) return;
  const m = Math.min(W, H);
  if (v.type === 'dots' || v.type === 'split') {
    const n = v.n, rows = n > 10 ? 2 : 1, per = rows === 2 ? 10 : Math.max(5, n);
    const cell = Math.min(W / (per + 1.2), H / (rows * 1.25 + .3)), r = cell * .36;
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / per), col = i % per, gap = col >= 5 ? cell * .35 : 0;
      const x = W / 2 - (per * cell + cell * .35) / 2 + cell * (col + .5) + gap, y = H / 2 - (rows - 1) * cell * .62 + row * cell * 1.25;
      c.fillStyle = v.type === 'split' ? (i < v.a ? '#ff6fb5' : '#d9dfe9') : '#ff5a5f'; circ(c, x, y, r);
      c.fillStyle = 'rgba(255,255,255,.5)'; circ(c, x - r * .3, y - r * .3, r * .3);
      if (v.type === 'split' && i >= v.a) { c.fillStyle = '#8a93a6'; c.font = `700 ${r * 1.2}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('?', x, y + r * .05); }
    }
  } else if (v.type === 'line') { // getallenlijn: 7 8 ?  of  ? 8 9
    const seq = v.dir > 0 ? [v.n - 1, v.n, '?'] : ['?', v.n, v.n + 1], bw = Math.min(W / 3.6, H * .9), gap = bw * .25, x0 = W / 2 - (bw * 3 + gap * 2) / 2;
    seq.forEach((t, i) => { if (t !== '?' && t < 0) return; const x = x0 + i * (bw + gap), y = H / 2 - bw * .45; c.fillStyle = t === '?' ? '#ffd23f' : '#eef6ff'; rr(c, x, y, bw, bw * .9, bw * .2); c.fill();
      c.fillStyle = '#1f2a44'; c.font = `700 ${bw * .55}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(t), x + bw / 2, y + bw * .47);
      if (i < 2) { c.fillStyle = '#4cc3ff'; tri(c, x + bw + gap * .2, y + bw * .3, x + bw + gap * .8, y + bw * .45, x + bw + gap * .2, y + bw * .6); } });
  } else if (v.type === 'apples') { // 3 🍎 + 2 🍎  /  5 🍎 met 2 weggestreept
    const plus = v.op === 'add', tot = plus ? v.a + v.b : v.a, cell = Math.min(W / (tot + (plus ? 2.2 : 1.2)), H * .8), r = cell * .38; let x = W / 2 - (tot + (plus ? 1 : 0)) * cell / 2 + cell / 2;
    const apple = (x, y, cross) => { c.fillStyle = '#e8322f'; circ(c, x, y, r); c.fillStyle = 'rgba(255,255,255,.45)'; circ(c, x - r * .35, y - r * .3, r * .25); c.fillStyle = '#6b3a00'; c.fillRect(x - r * .06, y - r * 1.25, r * .12, r * .4); c.fillStyle = '#3ccf6e'; ell(c, x + r * .25, y - r * 1.05, r * .28, r * .14);
      if (cross) { c.strokeStyle = '#1f2a44'; c.lineWidth = r * .22; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - r, y - r); c.lineTo(x + r, y + r); c.moveTo(x + r, y - r); c.lineTo(x - r, y + r); c.stroke(); } };
    for (let i = 0; i < tot; i++) { if (plus && i === v.a) { c.fillStyle = '#1f2a44'; c.font = `700 ${cell * .7}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('+', x, H / 2); x += cell; }
      apple(x, H / 2 + r * .2, !plus && i >= v.a - v.b); x += cell; }
  } else if (v.type === 'clock') {
    const r = m * .46, x = W / 2, y = H / 2;
    c.fillStyle = '#1f5fd1'; circ(c, x, y, r); c.fillStyle = '#fff'; circ(c, x, y, r * .9);
    c.fillStyle = '#1f2a44'; c.font = `700 ${r * .22}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    for (let i = 1; i <= 12; i++) { const a = i / 12 * Math.PI * 2 - Math.PI / 2; c.fillText(i, x + Math.cos(a) * r * .7, y + Math.sin(a) * r * .7); }
    for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2; const L = i % 5 ? .04 : .08; c.fillRect(x + Math.cos(a) * r * (.88 - L) - .75, y + Math.sin(a) * r * (.88 - L) - .75, 1.5, 1.5); }
    const hA = ((v.h % 12) + v.m / 60) / 12 * Math.PI * 2 - Math.PI / 2, mA = v.m / 60 * Math.PI * 2 - Math.PI / 2;
    c.lineCap = 'round'; c.strokeStyle = '#1f2a44'; c.lineWidth = r * .09; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(hA) * r * .45, y + Math.sin(hA) * r * .45); c.stroke();
    c.strokeStyle = '#e8322f'; c.lineWidth = r * .055; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(mA) * r * .78, y + Math.sin(mA) * r * .78); c.stroke();
    c.fillStyle = '#1f2a44'; circ(c, x, y, r * .07);
  } else if (v.type === 'digital') {
    const w = Math.min(W * .8, m * 2.2), h = Math.min(H * .85, w * .42), x = W / 2 - w / 2, y = H / 2 - h / 2;
    c.fillStyle = '#1f2a44'; rr(c, x, y, w, h, h * .18); c.fill(); c.fillStyle = '#0d1424'; rr(c, x + h * .1, y + h * .1, w - h * .2, h * .8, h * .12); c.fill();
    c.fillStyle = '#5fff8a'; c.font = `700 ${h * .62}px ui-monospace,Menlo,Consolas,monospace`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.shadowColor = '#5fff8a'; c.shadowBlur = h * .15; c.fillText(`${two(v.h)}:${two(v.m)}`, W / 2, H / 2 + h * .04); c.shadowBlur = 0;
  } else if (v.type === 'money') {
    const it = v.items, n = it.length; const cell = Math.min(W / (n + .5), H * 1.1);
    let x = W / 2 - cell * n / 2 + cell / 2;
    for (const val of it) { drawMoney(c, val, x, H / 2, cell * .45); x += cell; }
  } else if (v.type === 'frac') {
    const { n, d } = v;
    if (v.shape === 'pie') { const r = m * .44, x = W / 2, y = H / 2;
      for (let i = 0; i < d; i++) { const a0 = i / d * Math.PI * 2 - Math.PI / 2, a1 = (i + 1) / d * Math.PI * 2 - Math.PI / 2;
        c.fillStyle = i < n ? '#ff8a2a' : '#fff3e0'; c.beginPath(); c.moveTo(x, y); c.arc(x, y, r, a0, a1); c.closePath(); c.fill();
        c.strokeStyle = '#8b5a3c'; c.lineWidth = Math.max(2, r * .04); c.stroke(); }
    } else { const w = Math.min(W * .9, H * 3.4), h = Math.min(H * .55, w / 3), x = W / 2 - w / 2, y = H / 2 - h / 2;
      for (let i = 0; i < d; i++) { c.fillStyle = i < n ? '#4cc3ff' : '#eef6ff'; c.fillRect(x + i * w / d, y, w / d, h); c.strokeStyle = '#1f5fd1'; c.lineWidth = 2; c.strokeRect(x + i * w / d, y, w / d, h); } }
  }
}
function drawMoney(c, cents, x, y, r) {
  if (cents >= 500) { // biljet
    const w = r * 2, h = r * 1.15, col = cents >= 2000 ? '#5fb3e8' : cents >= 1000 ? '#ff8f6b' : '#a8a8b8';
    c.save(); c.translate(x, y); c.rotate(-.08);
    c.fillStyle = col; rr(c, -w / 2, -h / 2, w, h, r * .1); c.fill(); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 2; c.stroke();
    c.fillStyle = 'rgba(255,255,255,.35)'; rr(c, -w * .38, -h * .3, w * .3, h * .6, r * .06); c.fill();
    c.fillStyle = '#1f2a44'; c.font = `700 ${h * .45}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('€' + cents / 100, w * .12, 0);
    c.restore(); return;
  }
  const big = cents >= 100, rr2 = r * (cents >= 200 ? .95 : cents === 100 ? .88 : cents === 50 ? .85 : cents === 20 ? .78 : cents === 10 ? .7 : .62);
  if (big) { c.fillStyle = cents === 200 ? '#d8d8e0' : '#e6b84a'; circ(c, x, y, rr2); c.fillStyle = cents === 200 ? '#e6b84a' : '#d8d8e0'; circ(c, x, y, rr2 * .72); }
  else { c.fillStyle = cents >= 10 ? '#e6b84a' : '#c8763a'; circ(c, x, y, rr2); c.fillStyle = 'rgba(255,255,255,.25)'; circ(c, x - rr2 * .3, y - rr2 * .3, rr2 * .3); }
  c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 2; c.beginPath(); c.arc(x, y, rr2, 0, Math.PI * 2); c.stroke();
  c.fillStyle = '#1f2a44'; c.font = `700 ${rr2 * (big ? .7 : .6)}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText(big ? '€' + cents / 100 : cents + 'ct', x, y + 1);
}

/* stippen-plaatje in een poort (dobbelsteen-achtig, max 10) */
function drawDotPic(c, n, cx, cy, w, h, col) {
  const per = n <= 5 ? n : Math.ceil(n / 2), rows = n <= 5 ? 1 : 2, cell = Math.min(w / per, h / rows) * .9, r = cell * .36;
  for (let i = 0; i < n; i++) { const row = rows === 1 ? 0 : Math.floor(i / per), col2 = rows === 1 ? i : i % per, cnt = row === 0 ? Math.min(per, n) : n - per;
    const x = cx - (cnt - 1) * cell / 2 + col2 * cell, y = cy - (rows - 1) * cell / 2 + row * cell; c.fillStyle = col || '#ff5a5f'; circ(c, x, y, r); }
}
