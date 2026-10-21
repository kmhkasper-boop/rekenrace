/* ===== vraag-generatoren =====
   Een vraag heeft een sleutel "make:p1:p2..." (bijv. "add:47:8"). Uit de sleutel bouwt MAKES[make](...p) de vraag:
   { q: tekst, a: antwoord (getal of tekst), w: [[fout, gewicht]...], f: opmaak, tip, vis, tf: tijdsfactor }.
   SKILLS kiezen parameters per onderwerp/niveau; het Leitner-systeem onthoudt per sleutel. */
const opSym = op => ({ '+': '+', '-': '−', x: '×', ':': ':' }[op]);
const fr = (n, d) => n + '/' + d;
const UNIT = { mm: 1, cm: 10, dm: 100, m: 1000, km: 1e6, g: 1, kg: 1000, ml: 1, cl: 10, dl: 100, l: 1000 };
const UNAME = { mm: 'millimeter', cm: 'centimeter', dm: 'decimeter', m: 'meter', km: 'kilometer', g: 'gram', kg: 'kilogram', ml: 'milliliter', cl: 'centiliter', dl: 'deciliter', l: 'liter' };

function timeWords(h, m) {
  h = ((h % 12) + 12) % 12 || 12; const nx = h % 12 + 1;
  switch (m) {
    case 0: return `${h} uur`; case 5: return `5 over ${h}`; case 10: return `10 over ${h}`; case 15: return `kwart over ${h}`;
    case 20: return `10 voor half ${nx}`; case 25: return `5 voor half ${nx}`; case 30: return `half ${nx}`;
    case 35: return `5 over half ${nx}`; case 40: return `10 over half ${nx}`; case 45: return `kwart voor ${nx}`;
    case 50: return `10 voor ${nx}`; case 55: return `5 voor ${nx}`;
  }
  return `${h}:${two(m)}`;
}
const hhmm = (h, m) => `${h}:${two(m)}`;

/* ---------- plus / min (tips en afleiders uit v1, uitgebreid tot 1000) ---------- */
function capFor(a, b, ans) { const m = Math.max(a, b, ans); return m <= 20 ? 20 : m <= 100 ? 100 : m <= 1000 ? 1000 : 1e7; }
function addSubWrong(a, b, op, ans) {
  const C = []; const add = (v, w) => C.push([v, w]);
  const ua = a % 10, ub = b % 10;
  if (op === '+') {
    if (ua === 0 && ub === 0) { const st = (a % 100 === 0 && b % 100 === 0) ? 100 : 10; add(ans + st, 3); add(ans - st, 3); add(ans + 2 * st, .6); add(ans - 10, a >= 100 ? 1 : 0); }
    else if (ub === 0) { add(ans + 10, 3); add(ans - 10, 3); add(a + b / 10, 1.5); add(ans + 1, .8); add(ans - 1, .8); }
    else {
      add(ans + 1, 2); add(ans - 1, 2); add(ans + 2, .7); add(ans - 2, .7);
      if (ua + ub >= 10 && a >= 10) add(ans - 10, 2.5);
      if (a >= 10) add(ans + 10, .9);
      if (Math.abs(a - b) !== ans && Math.abs(a - b) >= ans * .4) add(Math.abs(a - b), .6);
      if (a >= 100 && b >= 100) add(ans + 100, .8);
    }
  } else {
    if (ua === 0 && ub === 0) { const st = (a % 100 === 0 && b % 100 === 0) ? 100 : 10; add(ans + st, 3); add(ans - st, 3); add(ans + 2 * st, .6); }
    else if (ub === 0 && b !== 10) { add(ans + 10, 3); add(ans - 10, 3); add(a - b / 10, 1.5); add(ans + 1, .8); add(ans - 1, .8); }
    else if (b === 10) { add(ans + 1, 2); add(ans - 1, 2); add(a - 1, 1.2); add(ans + 2, .6); add(ans - 2, .6); }
    else {
      add(ans + 1, 2); add(ans - 1, 2); add(ans + 2, .7); add(ans - 2, .7);
      if (ua < ub) { add((Math.floor(a / 10) - Math.floor(b / 10)) * 10 + Math.abs(ua - ub), 2.5); if (a >= 20) add(ans + 10, 1.5); }
      else if (a >= 20) add(ans + 10, .8);
      add(a + b, .5);
      if (a >= 100) add(ans + 100, .6);
    }
  }
  const cap = capFor(a, b, ans);
  return C.filter(([v]) => v <= cap && (v > 0 || ans <= 3));
}
function addSubTip(a, b, op, ans) {
  const ua = a % 10, ub = b % 10, ta = Math.floor(a / 10);
  if (op === '+') {
    if (b % 100 >= 95 && b > 100) { const r = Math.ceil(b / 100) * 100; return `Handig: ${a} + ${r} = ${a + r}, en dan ${r - b} eraf = ${ans}`; }
    if (a % 100 >= 95 && a > 100) { const r = Math.ceil(a / 100) * 100; return `Handig: ${r} + ${b} = ${r + b}, en dan ${r - a} eraf = ${ans}`; }
    if (a === b && a >= 10) return `Dubbel: 2 × ${a} = ${ans}`;
    if (ua === 0 && ub === 0) { if (a % 100 === 0 && b % 100 === 0) return `Reken met honderdtallen: ${a / 100} + ${b / 100} = ${ans / 100}, dus ${ans}`; return `Reken met tientallen: ${a / 10} + ${b / 10} = ${ans / 10}, dus ${ans}`; }
    if (ub === 0) return `Eerst de tientallen: ${ta * 10} + ${b} = ${ta * 10 + b}, plus ${ua} = ${ans}`;
    if (a < 10 && b < 10 && a === b) return `Dubbel: ${a} + ${a} = ${ans}`;
    if (a < 10 && b < 10 && Math.abs(a - b) === 1) { const m = Math.min(a, b); return `Bijna dubbel: ${m} + ${m} = ${2 * m}, plus 1 = ${ans}`; }
    if (b >= 10) { const bt = b - ub; return `Splits ${b} in ${bt} en ${ub}: ${a} + ${bt} = ${a + bt}, plus ${ub} = ${ans}`; }
    if (ua + ub >= 10) { const to = 10 - ua; return `Eerst naar ${a + to}: ${a} + ${to} = ${a + to}, dan nog ${b - to} erbij = ${ans}`; }
    if (a >= 10) return `Kijk naar de eenheden: ${ua} + ${b} = ${ua + b}, dus ${ans}`;
    if (a <= 5 && b <= 5) return `Tel op je vingers: ${a} vingers en nog ${b} = ${ans}`;
    return `Begin bij ${Math.max(a, b)} en tel ${Math.min(a, b)} verder: ${ans}`;
  }
  if (b >= 100 && a - b <= 20) return `Tel op vanaf ${b}: hoeveel erbij om ${a} te maken? Dat is ${ans}`;
  if (b % 100 >= 95 && b > 100) { const r = Math.ceil(b / 100) * 100; return `Handig: ${a} − ${r} = ${a - r}, en dan ${r - b} erbij = ${ans}`; }
  if (ua === 0 && ub === 0) { if (a % 100 === 0 && b % 100 === 0) return `Reken met honderdtallen: ${a / 100} − ${b / 100} = ${ans / 100}, dus ${ans}`; return `Reken met tientallen: ${a / 10} − ${b / 10} = ${ans / 10}, dus ${ans}`; }
  if (b === 10) return `Min 10: er gaat één tiental af. ${a} − 10 = ${ans}`;
  if (ub === 0) return `Alleen de tientallen eraf: ${a} − ${b} = ${ans}. De ${ua} blijft staan.`;
  if (b >= 10) { const bt = b - ub; return `Splits ${b} in ${bt} en ${ub}: ${a} − ${bt} = ${a - bt}, min ${ub} = ${ans}`; }
  if (ua < ub) {
    if (a === 10) return `Splits 10: ${b} en ${ans} maken samen 10. Dus 10 − ${b} = ${ans}`;
    if (ua === 0) return `Denk aan 10 − ${b} = ${10 - b}. Dus ${a} − ${b} = ${ans}`;
    return `Eerst naar ${a - ua}: ${a} − ${ua} = ${a - ua}, dan nog ${b - ua} eraf = ${ans}`;
  }
  if (a >= 10) return `Kijk naar de eenheden: ${ua} − ${b} = ${ua - b}, dus ${ans}`;
  return `Denk aan de plussom: ${ans} + ${b} = ${a}, dus ${a} − ${b} = ${ans}`;
}
function mulTip(a, b, ans) {
  if (a >= 10 && a % 10 === 0 || b >= 10 && b % 10 === 0) {
    if (!(a <= 10 && b <= 10)) { const za = String(a).match(/0+$/), zb = String(b).match(/0+$/); const na = za ? za[0].length : 0, nb = zb ? zb[0].length : 0;
      const ka = a / 10 ** na, kb = b / 10 ** nb; return `Zonder nullen: ${ka} × ${kb} = ${ka * kb}. Plak de ${na + nb} ${na + nb === 1 ? 'nul' : 'nullen'} erachter: ${nl(ans)}`; }
  }
  if (a === 25 || b === 25) { const o = a === 25 ? b : a; return `4 × 25 = 100. Dus ${o} × 25 = ${o / 4} × 100 = ${ans}`; }
  if ((a === 7 && b === 8) || (a === 8 && b === 7)) return 'Denk aan 5-6-7-8: 56 = 7 × 8';
  if (a === b) return `Een dubbel-tafel: ${a} × ${a} = ${ans}. Die onthoud je!`;
  const pr = [10, 1, 2, 5, 9, 4, 3, 6, 8, 7];
  const t = pr.indexOf(a) <= pr.indexOf(b) ? a : b, o = t === a ? b : a;
  switch (t) {
    case 10: return `Keer 10: zet er een 0 achter. ${o} → ${ans}`;
    case 1: return `Keer 1: het getal blijft hetzelfde.`;
    case 2: return `Keer 2 is dubbelen: ${o} + ${o} = ${ans}`;
    case 5: return `Keer 5 is de helft van keer 10: 10 × ${o} = ${10 * o}, de helft is ${ans}`;
    case 9: return `Truc met 9: 10 × ${o} = ${10 * o}, min ${o} = ${ans}`;
    case 4: return `Keer 4 = twee keer dubbelen: ${o} → ${2 * o} → ${ans}`;
    case 3: return `Keer 3 = keer 2 plus nog één: ${2 * o} + ${o} = ${ans}`;
    case 6: return `Truc met 6: 5 × ${o} = ${5 * o}, plus ${o} = ${ans}`;
    case 8: return `Keer 8 = drie keer dubbelen: ${o} → ${2 * o} → ${4 * o} → ${ans}`;
    default: return `Truc met 7: 5 × ${o} = ${5 * o}, plus 2 × ${o} = ${2 * o} → ${ans}`;
  }
}
function mulWrong(a, b, ans) {
  const C = []; const add = (v, w) => C.push([v, w]);
  if (a <= 10 && b <= 10) {
    if (b < 10) add(a * (b + 1), 3); if (b > 1) add(a * (b - 1), 3);
    if (a < 10) add((a + 1) * b, 3); if (a > 1) add((a - 1) * b, 3);
    add(ans + 1, 1); add(ans - 1, 1);
    if (ans >= 10 && a + b !== ans) add(a + b, 1.2);
    if (ans >= 12) { add(ans + 10, .8); add(ans - 10, .8); }
    if (ans >= 10 && ans < 100 && ans % 10 !== 0) add((ans % 10) * 10 + Math.floor(ans / 10), 1.4);
  } else { add(ans * 10, 3); if (ans % 10 === 0) add(ans / 10, 3); add(ans + a, 1); add(ans - a, 1); add(ans + b, 1); add(ans - b, 1); }
  return C;
}

/* ---------- breuken ---------- */
const fval = s => { const [n, d] = s.split('/').map(Number); return n / d; };

/* ---------- MAKES ---------- */
const MAKES = {
  tel(n) { return { q: 'Hoeveel stippen?', a: n, vis: { type: 'dots', n }, w: [[n + 1, 3], [n - 1, 3], [n + 2, 1], [n - 2, 1]].filter(x => x[0] > 0), tip: n > 5 ? `Tel in groepjes van 5: 5 en nog ${n - 5} is ${n}` : `Tel ze één voor één, wijs ze aan: ${n}`, fast: 4.5 }; },
  na(n, dir) { return { q: dir > 0 ? `Welk getal komt na ${n}?` : `Welk getal komt vóór ${n}?`, a: n + dir, w: [[n, 2], [n - dir, 3], [n + 2 * dir, 1]].filter(x => x[0] >= 0), tip: dir > 0 ? `Tel verder: ${n}, ${n + 1}` : `Tel terug: ${n}, ${n - 1}`, fast: 4 }; },
  meer(a, b, c) { const ans = Math.max(a, b, c); return { q: 'Welk getal is het grootst?', a: ans, opts: [a, b, c].map(String), tip: `${ans} is het grootst: die komt het laatst als je telt.`, fast: 4 }; },
  splits(n, a) { const ans = n - a; return { q: `${n} = ${a} + ?`, a: ans, vis: { type: 'split', n, a }, w: [[ans + 1, 3], [ans - 1, 3], [a, 1.2], [n, .5]].filter(x => x[0] >= 0), tip: `${a} en ${ans} maken samen ${n}. Tel verder vanaf ${a} tot ${n}.`, fast: 4 }; },
  add(a, b) { const ans = a + b; return { q: `${nl(a)} + ${nl(b)}`, a: ans, w: addSubWrong(a, b, '+', ans), tip: addSubTip(a, b, '+', ans), fast: ans > 100 ? 6 : ans > 20 ? 4.5 : 3.5 }; },
  sub(a, b) { const ans = a - b; return { q: `${nl(a)} − ${nl(b)}`, a: ans, w: addSubWrong(a, b, '-', ans), tip: addSubTip(a, b, '-', ans), fast: a > 100 ? 6 : a > 20 ? 4.5 : 3.5 }; },
  mul(a, b) { const ans = a * b; return { q: `${nl(a)} × ${nl(b)}`, a: ans, w: mulWrong(a, b, ans), tip: mulTip(a, b, ans), fast: (a <= 10 && b <= 10) ? ([6, 7, 8, 9].some(x => x === a || x === b) ? 3.6 : 3.2) : 5.5 }; },
  div(n, b) { const q = n / b; const C = [[q + 1, 3], [q - 1, 3], [q + 2, .8], [q - 2, .8]];
    if (n >= 100 && n % 10 === 0) { C.push([q * 10, 3]); if (q % 10 === 0) C.push([q / 10, 3]); }
    if (q * 10 !== n && n % 10 === 0 && b < 10) C.push([n / 10, .6]);
    const z = (n >= 100 && b >= 10) ? `Haal aan beide kanten even veel nullen weg of denk: ${nl(b)} × ? = ${nl(n)}. Antwoord: ${nl(q)}` : `Denk aan de keersom: ${b} × ${q} = ${nl(n)}, dus ${nl(n)} : ${b} = ${q}`;
    return { q: `${nl(n)} : ${nl(b)}`, a: q, w: C.filter(x => x[0] > 0), tip: z, fast: n <= 100 ? 4.2 : 6 }; },
  rest(n, b) { const q = Math.floor(n / b), r = n % b; const s = (x, y) => `${x} rest ${y}`;
    const C = [[s(q, r + 1), 2], [s(q + 1, r), 2], [s(q, r - 1), r > 1 ? 2 : 0], [s(q - 1, r + b), 1.4], [s(q + 1, Math.max(0, r - 1)), .5], [s(q - 1, r), 1]];
    return { q: `${n} : ${b}`, a: s(q, r), w: C.filter(x => x[1] > 0 && !/rest -/.test(x[0]) && !/^-/.test(x[0]) && !/^0 /.test(x[0])), tip: `${b} × ${q} = ${b * q}. Er blijft ${n} − ${b * q} = ${r} over: ${q} rest ${r}`, fast: 6, tf: 1.15 }; },
  klok(h, m) { return clockItem(h, m, false); },
  dig(h, m) { return clockItem(h, m, true); },
  duur(h, m, mins) {
    const e = h * 60 + m + mins, h2 = Math.floor(e / 60), m2 = e % 60;
    const naive = (h2 * 100 + m2) - (h * 100 + m);
    const C = [[mins + 5, 2], [mins - 5, 2], [mins + 10, 1.5], [mins - 10, 1.5], [naive, naive !== mins ? 3 : 0], [mins + 60, .8]];
    return { q: `Van ${hhmm(h, m)} tot ${hhmm(h2, m2)}. Hoeveel minuten?`, a: mins, f: v => `${v} min`, w: C.filter(x => x[0] > 0 && x[1] > 0),
      tip: mins > 60 - m ? `Spring eerst naar het hele uur: ${hhmm(h, m)} → ${hhmm(h + 1, 0)} is ${60 - m} min, dan nog ${mins - (60 - m)} min. Samen ${mins} min.` : `Tel de minuten van ${hhmm(h, m)} verder: samen ${mins} min.`, fast: 8, tf: 1.5 };
  },
  geld(list) { const it = String(list).split('_').map(Number), s = it.reduce((x, y) => x + y, 0);
    const big = Math.max(...it), small = Math.min(...it);
    return { q: 'Hoeveel geld is dit?', a: s, f: eur, vis: { type: 'money', items: it }, w: [[s + small, 2], [s - small, 2], [s + 100, 1.5], [s - 100, s > 100 ? 1.5 : 0], [s - big, 1], [s + 50, 1], [s - 50, s > 50 ? 1 : 0], [s + 10, .5]].filter(x => x[0] > 0 && x[1] > 0),
      tip: `Begin bij het grootste: ${it.slice().sort((x, y) => y - x).map(eurShort).join(' + ')} = ${eur(s)}`, fast: 6, tf: 1.2 }; },
  terug(price, paid) { const t = paid - price;
    const C = [[t + 10, 2], [t - 10, 2], [t + 100, 2], [t - 100, t > 100 ? 2 : 0], [price, price !== t ? .8 : 0], [t + 50, 1]];
    return { q: `Het kost ${eur(price)}. Je betaalt ${eur(paid)}. Hoeveel krijg je terug?`, a: t, f: eur, w: C.filter(x => x[0] > 0 && x[1] > 0),
      tip: `Tel op vanaf ${eur(price)} tot ${eur(paid)}: dat is ${eur(t)}`, fast: 8, tf: 1.5 }; },
  eur(a, b, op) { const ans = op === '+' ? a + b : a - b;
    const C = [[ans + 10, 2], [ans - 10, 2], [ans + 100, 2], [ans - 100, ans > 100 ? 2 : 0], [ans + 5, .6]];
    return { q: `${eur(a)} ${opSym(op)} ${eur(b)}`, a: ans, f: eur, w: C.filter(x => x[0] > 0 && x[1] > 0),
      tip: `Eerst de euro's, dan de centen: ${eur(a)} ${opSym(op)} ${eur(Math.floor(b / 100) * 100)} = ${eur(op === '+' ? a + Math.floor(b / 100) * 100 : a - Math.floor(b / 100) * 100)}, ${op === '+' ? 'plus' : 'min'} ${b % 100} cent = ${eur(ans)}`, fast: 7, tf: 1.25 }; },
  maat(v100, from, to) {
    const v = v100 / 100, ans = Math.round(v * UNIT[from] / UNIT[to] * 1000) / 1000;
    const C = [[ans * 10, 3], [ans / 10, 3], [ans * 100, 1.5], [ans / 100, 1.5], [ans * 1000, .5], [ans / 1000, .5]];
    const k = UNIT[from] > UNIT[to] ? UNIT[from] / UNIT[to] : UNIT[to] / UNIT[from];
    const tip = UNIT[from] > UNIT[to] ? `1 ${from} = ${nl(k)} ${to}. Dus ${nl(v)} ${from} = ${nl(v)} × ${nl(k)} = ${nl(ans)} ${to}` : `${nl(k)} ${from} = 1 ${to}. Dus ${nl(v)} ${from} = ${nl(v)} : ${nl(k)} = ${nl(ans)} ${to}`;
    return { q: `${nl(v)} ${from} = ? ${to}`, a: ans, f: x => `${nl(x)} ${to}`, w: C.filter(x => x[0] >= .001 && x[0] < 1e7 && Math.abs(x[0] * 1000 - Math.round(x[0] * 1000)) < 1e-6), tip, fast: 6, ok: x => x !== ans };
  },
  dec(a, b, op) { // a,b in honderdsten
    const ans = (op === '+' ? a + b : a - b) / 100;
    const C = [[ans + .1, 2], [ans - .1, 2], [ans + 1, 2], [ans - 1, 1.5], [ans + .01, .5]];
    const fa = decDigits(a), fb = decDigits(b);
    if (fa.length !== fb.length && op === '+') { // fout: decimalen als hele getallen optellen (0,5 + 0,25 → 0,30)
      const ia = Math.floor(a / 100) + Math.floor(b / 100), s = +fa + +fb, L = Math.max(fa.length, fb.length);
      if (s < 10 ** L) C.push([ia + s / 10 ** L, 3]);
    }
    return { q: `${nl(a / 100)} ${opSym(op)} ${nl(b / 100)}`, a: ans, w: C.filter(x => x[0] >= 0), tip: `Zet de komma's onder elkaar: tienden bij tienden, honderdsten bij honderdsten. ${nl(a / 100)} = ${a} honderdsten. Uitkomst: ${nl(ans)}`, fast: 6, tf: 1.15, ok: x => x !== ans };
  },
  dec10(a100, k, op) {
    const v = a100 / 100, ans = op === 'x' ? Math.round(v * k * 1000) / 1000 : Math.round(v / k * 100000) / 100000;
    const C = [[ans * 10, 3], [ans / 10, 3], [ans * 100, 1], [ans / 100, 1]];
    return { q: `${nl(v)} ${op === 'x' ? '×' : ':'} ${nl(k)}`, a: ans, w: C.filter(x => x[0] >= .001 && Math.abs(x[0] * 1000 - Math.round(x[0] * 1000)) < 1e-6),
      tip: `${op === 'x' ? 'Keer' : 'Gedeeld door'} ${nl(k)}: alle cijfers schuiven ${String(k).length - 1} ${String(k).length - 1 === 1 ? 'plek' : 'plekken'} naar ${op === 'x' ? 'links (groter)' : 'rechts (kleiner)'}. ${nl(v)} → ${nl(ans)}`, fast: 5, ok: x => x !== ans };
  },
  fvan(n, d, N) { const ans = N * n / d;
    const q = n === 1 && d === 2 ? `De helft van ${N}` : n === 1 && d === 4 ? `Een kwart van ${N}` : `${fr(n, d)} van ${nl(N)}`;
    const C = [[N / d, n > 1 ? 3 : 0], [N - ans, N - ans !== ans ? 2 : 0], [ans + 1, 1], [ans - 1, 1], [ans * 2, 1], [N / (d + 1), 0]];
    return { q, a: ans, w: C.filter(x => x[1] > 0 && x[0] > 0 && Number.isInteger(x[0])), tip: n === 1 ? `Verdeel ${N} in ${d} gelijke stukken: ${N} : ${d} = ${ans}` : `Eerst 1/${d}: ${N} : ${d} = ${N / d}. Dan keer ${n}: ${N / d} × ${n} = ${ans}`, fast: 5.5 };
  },
  bdeel(n, d, shape) { const ans = fr(n, d);
    const C = [[fr(d - n, d), d - n !== n ? 3 : 0], [fr(n, d + 1), 1.5], [fr(1, d), n > 1 ? 1.5 : 0], [fr(n, d - n), d - n > 0 && d - n !== d ? 2 : 0], [fr(n + 1, d), n + 1 < d ? 1 : 0], [fr(n, d - 1), d - 1 > n ? 1 : 0], [fr(n, d * 2), .7], [fr(n + 1, d + 2), .5]];
    return { q: 'Welk deel is gekleurd?', a: ans, vis: { type: 'frac', n, d, shape: shape ? 'bar' : 'pie' }, w: C.filter(x => x[1] > 0 && fval(x[0]) !== n / d && fval(x[0]) < 1), tip: `Het geheel is in ${d} gelijke stukken verdeeld. ${n === 1 ? 'Er is er 1' : `Er zijn er ${n}`} gekleurd: ${ans}`, fast: 5 };
  },
  bvgl(p1, p2, p3) { const o = [p1, p2, p3].map(s => s.replace('_', '/')); let best = o[0]; for (const x of o) if (fval(x) > fval(best)) best = x;
    return { q: 'Welke breuk is het grootst?', a: best, opts: o, tip: `Denk aan een taart: ${best} is het grootste stuk (${best} ≈ ${nl(Math.round(fval(best) * 100) / 100)}).`, fast: 6 };
  },
  bgel(n, d, k) { const ans = fr(n, d);
    const C = [[fr(n, d + 1), 2], [fr(n + 1, d), n + 1 < d ? 2 : 0], [fr(n * k, d), n * k < d ? 1 : 0], [fr(d - n, d), 2], [fr(n, d * k), 1.5], [fr(1, d), n > 1 ? 1 : 0]];
    return { q: `${fr(n * k, d * k)} is evenveel als …`, a: ans, w: C.filter(x => x[1] > 0 && Math.abs(fval(x[0]) - n / d) > 1e-9), tip: `Deel boven en onder door ${k}: ${n * k} : ${k} = ${n}, ${d * k} : ${k} = ${d}. Dus ${ans}`, fast: 6 };
  },
  bk(n, d, dir) { const v = n / d, dv = nl(v);
    if (!dir) { const C = [[n + d / 10 ** String(d).length, 0], ['' + n + ',' + d, 3], [nl(Math.round((v + .1) * 1000) / 1000), 1.5], [nl(Math.round(Math.abs(v - .05) * 1000) / 1000), 1], [nl(1 - v), v !== .5 ? 2 : 0], [nl(n / (d * 10)), 1]];
      return { q: `${fr(n, d)} = ?`, a: dv, w: C.filter(x => x[1] > 0 && typeof x[0] === 'string' && x[0] !== dv), tip: `${fr(n, d)} betekent ${n} : ${d} = ${dv}. Handig: 1/4 = 0,25 en 1/5 = 0,2`, fast: 5.5 }; }
    const C = [[fr(d - n, d), 2], [fr(n, d * 2), 1], [fr(n + 1, d), n + 1 < d ? 1 : 0], [fr(1, Math.round(1 / v) + 1), 1.5], [fr(2, d), n !== 2 ? 1 : 0]];
    return { q: `${dv} = ?`, a: fr(n, d), w: C.filter(x => x[1] > 0 && Math.abs(fval(x[0]) - v) > 1e-9), tip: `${dv} is ${Math.round(v * 100)} honderdste. Dat is ${fr(n, d)}`, fast: 5.5 };
  },
  pct(p, N) { const ans = p * N / 100;
    const C = [[N * p / 10, 1.5], [N - ans, N - ans !== ans ? 2 : 0], [ans + N / 10, 1.5], [ans - N / 10, ans > N / 10 ? 1.5 : 0], [ans * 2, 1], [ans / 2, 1], [N / 10, p !== 10 ? 1 : 0], [p, p !== ans ? .5 : 0]];
    const t = p === 50 ? `50% is de helft: ${N} : 2 = ${ans}` : p === 25 ? `25% is een kwart: ${N} : 4 = ${ans}` : p === 10 ? `10% is een tiende: ${N} : 10 = ${ans}` : p === 1 ? `1% is een honderdste: ${N} : 100 = ${ans}` :
      `Eerst 10%: ${N} : 10 = ${N / 10}. ${p}% is ${p / 10} keer zoveel: ${ans}`;
    return { q: `${p}% van ${nl(N)}`, a: ans, w: C.filter(x => x[1] > 0 && x[0] > 0 && (Number.isInteger(x[0]) || !Number.isInteger(ans))), tip: t, fast: 6 };
  },
  pb(n, d, kind) { const p = 100 * n / d; const f = v => `${nl(v)}%`;
    const C = [[100 * (d - n) / d, (d - n) !== n ? 2 : 0], [p + 10, 1.5], [p - 10, p > 10 ? 1.5 : 0], [n * 10 + d, 1], [d, 1], [p * 2, p * 2 <= 100 ? 1 : 0], [p / 2, 1]];
    return { q: kind ? `1 op de ${d} = ?%` : `${fr(n, d)} = ?%`, a: p, f, w: C.filter(x => x[1] > 0 && x[0] > 0 && x[0] <= 100 && x[0] !== p && Number.isInteger(x[0] * 10)), tip: `Het hele = 100%. ${fr(n, d)} = ${n} × (100 : ${d}) = ${nl(p)}%`, fast: 6 };
    // kind=1 (1 op de d) heeft altijd n=1
  },
  groot(kind, a, b) {
    if (kind === 2) { const ans = Math.round(a / b) * b; const C = [[Math.floor(a / b) * b, Math.floor(a / b) * b !== ans ? 3 : 0], [Math.ceil(a / b) * b, Math.ceil(a / b) * b !== ans ? 3 : 0], [ans + b, 1], [ans - b, ans > b ? 1 : 0], [Math.round(a / (b * 10)) * b * 10, 1]];
      return { q: `Rond ${nl(a)} af op ${b === 10 ? 'tientallen' : b === 100 ? 'honderdtallen' : b === 1000 ? 'duizendtallen' : 'tienduizendtallen'}`, a: ans, w: C.filter(x => x[1] > 0 && x[0] > 0), tip: `Kijk naar het cijfer rechts ervan: 5 of meer → naar boven, minder dan 5 → naar beneden. ${nl(a)} → ${nl(ans)}`, fast: 7, tf: 1.3 }; }
    const ans = kind ? a - b : a + b; const st = 10 ** Math.max(0, String(Math.min(a, b) % 10 === 0 ? b : 1).length - 1);
    const C = [[ans + b, .5], [ans + 1000, 2], [ans - 1000, ans > 1000 ? 2 : 0], [ans + 10000, 1], [ans - 10000, ans > 10000 ? 1 : 0], [ans + 100, 1], [ans - 100, 1], [ans * 10, .8], [ans + 1, kind && b === 1 ? 3 : 0], [ans - 9, kind && b === 1 ? 1 : 0]];
    return { q: `${nl(a)} ${kind ? '−' : '+'} ${nl(b)}`, a: ans, w: C.filter(x => x[1] > 0 && x[0] > 0 && x[0] !== ans), tip: `Lees het getal in stukken: ${nl(a)} ${kind ? '−' : '+'} ${nl(b)}. Let op welke plek (duizendtal, honderdtal…) verandert: ${nl(ans)}`, fast: 6, tf: 1.1, _st: st };
  },
  vh(kind, a, b, c) {
    if (kind === 0) { // a stuks kosten a*b euro, wat kosten c stuks
      const ans = c * b * 100; const C = [[c * a * 100, c * a !== c * b ? 1 : 0], [(c * b + b) * 100, 2], [(c * b - b) * 100, c > 1 ? 2 : 0], [(a * b + c) * 100, 1], [(a * b * c) * 100, 1]];
      return { q: `${a} ijsjes kosten ${eur(a * b * 100)}. Wat kosten ${c} ijsjes?`, a: ans, f: eur, w: C.filter(x => x[1] > 0 && x[0] > 0 && x[0] !== ans), tip: `Eerst 1 ijsje: ${eur(a * b * 100)} : ${a} = ${eur(b * 100)}. Dan ${c} × ${eur(b * 100)} = ${eur(ans)}`, fast: 9, tf: 1.6 };
    }
    // recept: voor a pannenkoeken b eieren, voor c pannenkoeken?
    const ans = b * c / a; const C = [[ans + 1, 2], [ans - 1, ans > 1 ? 2 : 0], [b + (c - a), 2.5], [ans * 2, 1], [c / b, Number.isInteger(c / b) ? 1 : 0]];
    return { q: `Voor ${a} pannenkoeken heb je ${b} eieren nodig. Hoeveel eieren voor ${c} pannenkoeken?`, a: ans, w: C.filter(x => x[1] > 0 && x[0] > 0 && x[0] !== ans && Number.isInteger(x[0])), tip: `Maak een verhoudingstabel: ${a} → ${b}. ${c} is ${nl(c / a)} keer zoveel, dus ${b} × ${nl(c / a)} = ${ans} eieren`, fast: 9, tf: 1.7 };
  },
  pk(c, g) { const ans = c * g / 1000;
    const C = [[ans * 10, 1.5], [ans / 2, 1.5], [ans * 2, 1.5], [ans + 100, 1], [ans - 100, ans > 100 ? 1 : 0], [c - ans, 1]];
    return { q: `1 kg kaas kost ${eur(c)}. Wat kost ${g} gram?`, a: ans, f: eur, w: C.filter(x => x[1] > 0 && x[0] > 0 && Number.isInteger(x[0]) && x[0] !== ans), tip: `1 kg = 1000 g. ${g} g is ${fr(g / gcd(g, 1000), 1000 / gcd(g, 1000))} kg. ${eur(c)} : ${1000 / gcd(g, 1000)} × ${g / gcd(g, 1000)} = ${eur(ans)}`, fast: 9, tf: 1.6 };
  },
  schaal(s, cm) { const realCm = s * cm; let ans, u;
    if (realCm >= 100000) { ans = realCm / 100000; u = 'km'; } else { ans = realCm / 100; u = 'm'; }
    const f = v => `${nl(v)} ${u}`;
    const C = [[ans * 10, 3], [ans / 10, 3], [ans * 100, 1], [cm, cm !== ans ? 1 : 0]];
    return { q: `Schaal 1 : ${nl(s)}. Op de kaart is het ${cm} cm. Hoeveel is dat echt?`, a: ans, f, w: C.filter(x => x[1] > 0 && x[0] >= .01 && x[0] !== ans), tip: `1 cm op de kaart is ${nl(s)} cm echt. ${cm} × ${nl(s)} = ${nl(realCm)} cm = ${f(ans)}`, fast: 9, tf: 1.6 };
  },
  vo(a, o1, b, o2, c, par) {
    const ap = (x, o, y) => o === '+' ? x + y : o === '-' ? x - y : o === 'x' ? x * y : x / y;
    const hi = o => o === 'x' || o === ':';
    let ans, l2r;
    if (par === 1) ans = ap(ap(a, o1, b), o2, c);
    else if (par === 2) ans = ap(a, o1, ap(b, o2, c));
    else ans = (hi(o2) && !hi(o1)) ? ap(a, o1, ap(b, o2, c)) : ap(ap(a, o1, b), o2, c);
    l2r = par === 2 ? ap(ap(a, o1, b), o2, c) : par === 1 ? ap(a, o1, ap(b, o2, c)) : ap(ap(a, o1, b), o2, c);
    const t = `${par === 1 ? '(' : ''}${a} ${opSym(o1)} ${par === 2 ? '(' : ''}${b}${par === 1 ? ')' : ''} ${opSym(o2)} ${c}${par === 2 ? ')' : ''}`;
    const C = [[l2r, l2r !== ans ? 4 : 0], [ans + 1, 1], [ans - 1, 1], [ans + 2, .6], [ans + 10, .5]];
    return { q: t, a: ans, w: C.filter(x => x[1] > 0 && Number.isInteger(x[0]) && x[0] >= 0), tip: par ? `Eerst wat tussen de haakjes staat. Uitkomst: ${ans}` : `Eerst × en :, daarna + en −. Uitkomst: ${ans}`, fast: 7, tf: 1.2 };
  },
  gem(list) { const it = String(list).split('_').map(Number), s = it.reduce((x, y) => x + y, 0), ans = s / it.length;
    const C = [[s, 2], [ans + 1, 2], [ans - 1, 2], [Math.max(...it), 1], [s / (it.length + 1), Number.isInteger(s / (it.length + 1)) ? 1 : 0]];
    return { q: `Wat is het gemiddelde van ${it.slice(0, -1).join(', ')} en ${it[it.length - 1]}?`, a: ans, w: C.filter(x => x[1] > 0 && x[0] > 0 && Number.isInteger(x[0]) && x[0] !== ans), tip: `Tel alles op: ${s}. Deel door het aantal (${it.length}): ${s} : ${it.length} = ${ans}`, fast: 8, tf: 1.4 };
  },
  ctx(t, a, b) { return CTX[t](a, b); },
};
function eurShort(c) { return c >= 100 && c % 100 === 0 ? `€${c / 100}` : c < 100 ? `${c}ct` : eur(c); }
function decDigits(x) { const s = String(x % 100).padStart(2, '0'); return s.endsWith('0') ? s[0] : s; }
function clockItem(h, m, digital) {
  const H = ((h % 12) + 12) % 12 || 12, ans = timeWords(H, m);
  const C = [[timeWords(H - 1, m), m === 30 ? 4 : 2], [timeWords(H + 1, m), m === 30 ? 3 : 2]];
  if (m !== 0 && m !== 30) C.push([timeWords(H, 60 - m), 3]);
  if (m === 0) { C.push([`half ${H}`, 2]); C.push([`half ${H % 12 + 1}`, 1.5]); }
  if (m === 30) C.push([`${H} uur`, 1.5]);
  if (m % 15 === 0 && m % 30) C.push([timeWords(H, (m + 30) % 60), 1.2]);
  if (m % 15) { C.push([timeWords(H, (m + 5) % 60), 1.5]); C.push([timeWords(H, (m + 55) % 60), 1.5]); }
  let tip;
  if (digital) tip = h > 12 ? `${hhmm(h, m)} is 's middags of 's avonds: ${h} − 12 = ${h - 12}. Dus ${hhmm(h - 12, m)} = ${ans}` : `${hhmm(h, m)}: ${m} minuten na ${H} uur = ${ans}`;
  else tip = m === 0 ? `De grote wijzer staat recht omhoog: precies ${H} uur.` : m === 30 ? `De grote wijzer staat onderaan: half. Half ${H % 12 + 1} = een half uur vóór ${H % 12 + 1} uur.` :
    m === 15 ? `De grote wijzer staat op de 3: kwart over ${H}.` : m === 45 ? `De grote wijzer staat op de 9: kwart voor ${H % 12 + 1}.` : `De grote wijzer staat op de ${m / 5}: dat is ${m} minuten na ${H} uur = ${ans}`;
  return { q: digital ? 'Hoe zeg je deze tijd?' : 'Hoe laat is het?', a: ans, vis: digital ? { type: 'digital', h, m } : { type: 'clock', h: H, m }, w: C.filter(x => x[0] !== ans), tip, fast: 6, tf: 1.2 };
}
/* contextsommen (finale): t = sjabloon */
const CTX = [
  (a, b) => ({ q: `In de bus zijn ${a} plekken. Er zitten ${b} mensen in. Hoeveel plekken zijn er nog vrij?`, a: a - b, w: [[a - b + 10, 2], [a - b - 10, 2], [a + b, 1], [a - b + 1, 1]], tip: `Vrij = ${a} − ${b} = ${a - b}`, fast: 9, tf: 1.6 }),
  (a, b) => ({ q: `Er zijn ${a} dozen met elk ${b} eieren. Hoeveel eieren zijn dat samen?`, a: a * b, w: [[a * b + b, 2], [a * b - b, 2], [a + b, 1], [a * b + 10, 1]], tip: `${a} × ${b}: splits ${b} in ${b - b % 10} en ${b % 10}: ${a} × ${b - b % 10} + ${a} × ${b % 10} = ${a * b}`, fast: 10, tf: 1.7 }),
  (a, b) => ({ q: `Je verdeelt ${eur(a * b * 100)} eerlijk over ${b} kinderen. Hoeveel krijgt ieder?`, a: a * 100, f: eur, w: [[a * 100 + 100, 2], [a * 100 - 100, 2], [a * b * 100 - b * 100, 1], [a * 50, 1]], tip: `${eur(a * b * 100)} : ${b} = ${eur(a * 100)}`, fast: 9, tf: 1.6 }),
  (a, b) => ({ q: `Een trui kost ${eur(a * 100)}. Je krijgt ${b}% korting. Wat betaal je?`, a: a * (100 - b), f: eur, w: [[a * b, 3], [a * (100 - b) + 100 * a / 10, 1.5], [(a - b) * 100, a > b ? 2 : 0], [a * (100 - b) - 100 * a / 10, 1]], tip: `${b}% van ${eur(a * 100)} = ${eur(a * b)}. Je betaalt ${eur(a * 100)} − ${eur(a * b)} = ${eur(a * (100 - b))}`, fast: 10, tf: 1.8 }),
  (a, b) => ({ q: `Je fietst ${a} km per uur. Hoe ver kom je in ${nl(b / 2)} uur?`, a: a * b / 2, f: v => `${nl(v)} km`, w: [[a * Math.floor(b / 2), b % 2 ? 2 : 0], [a + b / 2, 1.5], [a * b, 2], [a * b / 2 + a, 1]], tip: `${a} km per uur. ${nl(b / 2)} uur: ${a} × ${nl(b / 2)} = ${nl(a * b / 2)} km`, fast: 10, tf: 1.8 }),
  (a, b) => { const h = 18 + Math.floor(a / 60), m = a % 60, e = h * 60 + m + b; return { q: `De film begint om ${hhmm(h, m)} en duurt ${b} minuten. Hoe laat is hij klaar?`, a: hhmm(Math.floor(e / 60), e % 60), w: [[hhmm(h + 1, (m + b) % 100 % 60), 1], [hhmm(Math.floor((e + 60) / 60), e % 60), 2], [hhmm(Math.floor((e - 60) / 60), e % 60), 1.5], [hhmm(Math.floor((e + 10) / 60), (e + 10) % 60), 1.5], [hhmm(Math.floor((e - 10) / 60), (e - 10) % 60), 1.5]], tip: `${b} min = ${Math.floor(b / 60)} uur en ${b % 60} min. ${hhmm(h, m)} + ${Math.floor(b / 60)} uur = ${hhmm(h + Math.floor(b / 60), m)}, plus ${b % 60} min = ${hhmm(Math.floor(e / 60), e % 60)}`, fast: 12, tf: 1.9 }; },
];
/* ---------- opbouwen ---------- */
function parseKey(k) { const p = k.split(':'); return { make: p[0], ps: p.slice(1).map(x => /^-?\d+(\.\d+)?$/.test(x) ? +x : x) }; }
const itemCache = new Map();
function buildItem(k) {
  if (itemCache.has(k)) return itemCache.get(k);
  const { make, ps } = parseKey(k);
  const it = MAKES[make](...ps); it.k = k; it.make = make;
  const f = it.f || nl; it.ans = f(it.a); it.fmt = f;
  if (itemCache.size > 3000) itemCache.clear();
  itemCache.set(k, it); return it;
}
/* drie antwoorden (één goed), afleiders gewogen */
function makeOptions(it) {
  if (it.opts) return shuffle(it.opts.slice());
  const seen = new Set([it.ans]); let cands = [];
  for (const [v, w] of (it.w || [])) {
    if (typeof v === 'number' && (!isFinite(v) || v < 0)) continue;
    if (it.ok && !it.ok(v)) continue;
    const s = it.fmt(v); if (seen.has(s) || /NaN|undefined|Infinity/.test(s)) continue;
    seen.add(s); cands.push([s, w]);
  }
  const out = [];
  while (out.length < 2 && cands.length) { const s = wpick(cands); out.push(s); cands = cands.filter(c => c[0] !== s); }
  if (out.length < 2 && typeof it.a === 'number') {
    const step = it.a >= 1000 && it.a % 100 === 0 ? 100 : Number.isInteger(it.a) ? 1 : .1;
    for (let k = 1; out.length < 2 && k < 60; k++) for (const v of [it.a + k * step, it.a - k * step]) { const vv = Math.round(v * 1000) / 1000; const s = it.fmt(vv); if (out.length < 2 && vv >= 0 && !seen.has(s)) { seen.add(s); out.push(s); } }
  }
  for (let k = 1; out.length < 2; k++) { const s = it.ans + ' ' + '?'.repeat(k); if (!seen.has(s)) { seen.add(s); out.push(s); } } // noodgreep (komt niet voor in tests)
  return shuffle([it.ans, out[0], out[1]]);
}
