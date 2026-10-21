/* ===== vaardigheden: kiezen parameters, leveren sleutels ===== */
const SK = {};
const CAT = {
  getal: 'Tellen & getallen', pm: 'Plus & min', tafel: 'Tafels & delen', klok: 'Klok & tijd', geld: 'Geld',
  meten: 'Meten', breuk: 'Breuken', komma: 'Kommagetallen', pct: 'Procenten', vh: 'Verhoudingen', ctx: 'Contextsommen & mix'
};
function sk(id, cat, name, gen) { SK[id] = { id, cat, name, gen }; }
const TA = [1, 2, 5, 10], TB = [3, 4], TC = [6, 7, 8, 9];
const pairIn = set => { const a = pickOne(set), b = ri(1, 10); return Math.random() < .5 ? [a, b] : [b, a]; };
function frac(maxD) { const ds = [2, 3, 4, 5, 6, 8, 10].filter(d => d <= maxD); const d = pickOne(ds); return [ri(1, d - 1), d]; }

/* Lente */
sk('tel5', 'getal', 'Tellen tot 5', () => `tel:${ri(1, 5)}`);
sk('tel10', 'getal', 'Tellen tot 10', () => `tel:${ri(3, 10)}`);
sk('tel20', 'getal', 'Tellen tot 20', () => `tel:${ri(8, 20)}`);
sk('na10', 'getal', 'Buurgetallen tot 10', () => { const d = Math.random() < .6 ? 1 : -1; return `na:${d > 0 ? ri(0, 9) : ri(1, 10)}:${d}`; });
sk('na20', 'getal', 'Buurgetallen tot 20', () => { const d = Math.random() < .5 ? 1 : -1; return `na:${d > 0 ? ri(9, 19) : ri(10, 20)}:${d}`; });
sk('meer10', 'getal', 'Wat is meer? (tot 10)', () => { const s = shuffle(range(0, 10)).slice(0, 3); return `meer:${s.join(':')}`; });
sk('meer100', 'getal', 'Wat is meer? (tot 100)', () => { const t = ri(1, 8); const s = shuffle([t * 10 + ri(0, 9), ri(1, 9) * 10 + t, t * 10 + ri(0, 9)]); if (new Set(s).size < 3) return 'meer:23:32:30'; return `meer:${s.join(':')}`; });
sk('splits5', 'getal', 'Splitsen tot 5', () => { const n = ri(2, 5); return `splits:${n}:${ri(1, n - 1)}`; });
sk('splits10', 'getal', 'Splitsen tot 10', () => { const n = ri(5, 10); return `splits:${n}:${ri(1, n - 1)}`; });
sk('plus5', 'pm', 'Plus tot 5', () => { const a = ri(1, 4); return `add:${a}:${ri(1, 5 - a)}`; });
sk('plus10', 'pm', 'Plus tot 10', () => { const a = ri(1, 9); return `add:${a}:${ri(1, 10 - a)}`; });
sk('min10', 'pm', 'Min tot 10', () => { const a = ri(2, 10); return `sub:${a}:${ri(1, a - 1)}`; });
sk('dubbel', 'pm', 'Dubbelsommen tot 20', () => { const a = ri(1, 10); return `add:${a}:${a}`; });
sk('plus20', 'pm', 'Plus tot 20 (13 + 4)', () => { const a = ri(10, 18); return `add:${a}:${ri(1, 9 - a % 10 || 1)}`; });
sk('min20', 'pm', 'Min tot 20 (17 − 4)', () => { const a = ri(11, 19); return `sub:${a}:${ri(1, a % 10)}`; });
sk('plus20x', 'pm', 'Plus over de 10 (8 + 7)', () => { let a, b; do { a = ri(2, 9); b = ri(2, 9); } while (a + b <= 10); return `add:${a}:${b}`; });
sk('min20x', 'pm', 'Min over de 10 (13 − 5)', () => { let a, b; do { a = ri(11, 18); b = ri(2, 9); } while (a % 10 >= b); return `sub:${a}:${b}`; });
sk('klokuur', 'klok', 'Klok: hele uren', () => `klok:${ri(1, 12)}:0`);
sk('klokhalf', 'klok', 'Klok: halve uren', () => `klok:${ri(1, 12)}:${Math.random() < .7 ? 30 : 0}`);
sk('geld1', 'geld', 'Geld tellen tot € 10', () => { const it = []; let s = 0; const n = ri(2, 4); for (let i = 0; i < n; i++) { const c = pickOne([100, 200, 200, 500]); if (s + c <= 1000) { it.push(c); s += c; } } if (it.length < 2) it.push(100); return `geld:${it.sort((x, y) => y - x).join('_')}`; });

/* Zomer */
sk('tien', 'pm', 'Tientallen (30 + 40)', () => { if (Math.random() < .5) { const a = ri(1, 8); return `add:${a * 10}:${ri(1, 9 - a) * 10}`; } const a = ri(2, 10); return `sub:${a * 10}:${ri(1, a - 1) * 10}`; });
sk('plus100e', 'pm', 'Plus tot 100 (42 + 5)', () => { let a; do { a = ri(21, 97); } while (a % 10 === 0 || a % 10 === 9); return `add:${a}:${ri(1, 9 - a % 10)}`; });
sk('min100e', 'pm', 'Min tot 100 (68 − 5)', () => { let a; do { a = ri(21, 99); } while (a % 10 === 0); return `sub:${a}:${ri(1, a % 10)}`; });
sk('tienerbij', 'pm', 'Tientallen erbij/eraf (85 − 20)', () => { let a; do { a = ri(11, 89); } while (a % 10 === 0); if (Math.random() < .5) return `add:${a}:${ri(1, Math.floor((99 - a) / 10)) * 10}`; const b = ri(21, 99); return b % 10 ? `sub:${b}:${ri(1, Math.floor((b - 10) / 10)) * 10}` : `sub:85:20`; });
sk('plus100x', 'pm', 'Plus over het tiental (47 + 8)', () => { let a, b; do { a = ri(21, 91); b = ri(2, 9); } while (a % 10 === 0 || a % 10 + b < 10 || a + b > 100); return `add:${a}:${b}`; });
sk('min100x', 'pm', 'Min over het tiental (63 − 9)', () => { let a, b; do { a = ri(21, 99); b = ri(2, 9); } while (a % 10 >= b); return `sub:${a}:${b}`; });
sk('tafA', 'tafel', 'Tafels van 1, 2, 5 en 10', () => { const [a, b] = pairIn(TA); return `mul:${a}:${b}`; });
sk('tafB', 'tafel', 'Tafels van 3 en 4', () => { const [a, b] = pairIn(TB); return `mul:${a}:${b}`; });
sk('tafAB', 'tafel', 'Tafels 1 t/m 5 en 10', () => { const [a, b] = pairIn([1, 2, 3, 4, 5, 10]); return `mul:${a}:${b}`; });
sk('tafC', 'tafel', 'Tafels van 6, 7, 8 en 9', () => { const a = pickOne(TC), b = ri(2, 10); return Math.random() < .5 ? `mul:${a}:${b}` : `mul:${b}:${a}`; });
sk('tafAll', 'tafel', 'Alle tafels', () => `mul:${ri(2, 10)}:${ri(2, 10)}`);
sk('deelA', 'tafel', 'Delen door 2, 5 en 10', () => { const b = pickOne([2, 5, 10]); return `div:${b * ri(1, 10)}:${b}`; });
sk('deelB', 'tafel', 'Delen door 3 en 4', () => { const b = pickOne(TB); return `div:${b * ri(1, 10)}:${b}`; });
sk('deelC', 'tafel', 'Delen door 6, 7, 8 en 9', () => { const b = pickOne(TC); return `div:${b * ri(2, 10)}:${b}`; });
sk('deelAll', 'tafel', 'Alle deeltafels', () => { const b = ri(2, 10); return `div:${b * ri(2, 10)}:${b}`; });
sk('kwartier', 'klok', 'Klok: kwartieren', () => `klok:${ri(1, 12)}:${pickOne([15, 45, 15, 45, 30])}`);
sk('geld2', 'geld', 'Geld tellen tot € 20', () => { const it = []; let s = 0; const n = ri(3, 5); for (let i = 0; i < n; i++) { const c = pickOne([1000, 500, 200, 100, 50, 20, 10]); if (s + c <= 2000) { it.push(c); s += c; } } while (it.length < 3) it.push(pickOne([50, 20, 10])); return `geld:${it.sort((x, y) => y - x).join('_')}`; });
sk('half', 'breuk', 'De helft en een kwart', () => Math.random() < .6 ? `fvan:1:2:${ri(1, 10) * 2 + (Math.random() < .3 ? 20 : 0)}` : `fvan:1:4:${ri(1, 10) * 4}`);
sk('terug', 'geld', 'Wisselgeld terugkrijgen', () => { const paid = pickOne([500, 1000, 1000, 2000]); const price = ri(1, paid / 10 - 1) * 10; return `terug:${price}:${paid}`; });

/* Herfst */
sk('plus100', 'pm', 'Plus tot 100 (34 + 25)', () => { let a, b; do { a = ri(11, 79); b = ri(11, 59); } while (a + b > 100 || a % 10 === 0 || b % 10 === 0); return `add:${a}:${b}`; });
sk('min100', 'pm', 'Min tot 100 (72 − 35)', () => { let a, b; do { a = ri(31, 99); b = ri(11, a - 5); } while (a % 10 === 0 || b % 10 === 0); return `sub:${a}:${b}`; });
sk('duizend', 'pm', 'Honderdtallen (340 + 200)', () => { const r = Math.random();
  if (r < .35) { const a = ri(1, 8) * 100 + ri(0, 9) * 10; return `add:${a}:${ri(1, Math.floor((1000 - a) / 100)) * 100 || 100}`; }
  if (r < .65) { const a = ri(3, 10) * 100; return `sub:${a}:${ri(1, a / 10 - 1) * 10}`; }
  const a = ri(11, 89) * 10; return `add:${a}:${ri(1, Math.floor((1000 - a) / 10)) * 10}`; });
sk('plus1000', 'pm', 'Plus tot 1000 (346 + 27)', () => { let a, b; do { a = ri(101, 899); b = ri(12, 89); } while (a % 10 + b % 10 < 10); return `add:${a}:${b}`; });
sk('min1000', 'pm', 'Min tot 1000 (523 − 48)', () => { let a, b; do { a = ri(120, 999); b = ri(12, 89); } while (a % 10 >= b % 10); return `sub:${a}:${b}`; });
sk('handig', 'pm', 'Handig rekenen (199 + 86)', () => { const r = Math.random();
  if (r < .35) { const a = pickOne([99, 199, 299, 399, 198, 499]); return Math.random() < .5 ? `add:${a}:${ri(12, 99)}` : `add:${ri(12, 99)}:${a}`; }
  if (r < .6) { const b = pickOne([99, 199, 299, 98, 198]); return `sub:${ri(b + 20, 999)}:${b}`; }
  if (r < .8) { const a = ri(3, 9) * 100 + ri(1, 5); return `sub:${a}:${a - ri(2, 9)}`; }
  const a = pickOne([125, 250, 150, 75, 450, 350]); return `add:${a}:${a}`; });
sk('meten1', 'meten', 'Meten: m, kg en liter', () => pickOne([
  () => `maat:${ri(1, 9) * 100}:m:cm`, () => `maat:${ri(1, 9) * 10000}:cm:m`, () => `maat:${ri(1, 9) * 100}:kg:g`,
  () => `maat:${ri(1, 9) * 100000}:g:kg`, () => `maat:${ri(1, 5) * 100}:l:ml`, () => `maat:${ri(1, 9) * 100000}:ml:l`])());
sk('klok5', 'klok', 'Klok: per 5 minuten', () => `klok:${ri(1, 12)}:${pickOne([5, 10, 20, 25, 35, 40, 50, 55])}`);
sk('digitaal', 'klok', 'Digitale klok (14:30)', () => `dig:${ri(13, 23)}:${pickOne([0, 15, 30, 45, 30, 10, 20, 40, 50])}`);
sk('meten1b', 'meten', 'Meten: mm, cm en km', () => pickOne([
  () => `maat:${ri(2, 15) * 100}:cm:mm`, () => `maat:${ri(2, 9) * 1000}:mm:cm`, () => `maat:${ri(1, 9) * 100}:km:m`, () => `maat:${ri(1, 9) * 100000}:m:km`, () => `maat:${ri(1, 9) * 100}:m:dm`])());
sk('nullen1', 'tafel', 'Rekenen met nullen (30 × 4)', () => { const a = ri(2, 9), b = ri(2, 9), r = Math.random();
  if (r < .3) return `mul:${a * 10}:${b}`; if (r < .5) return `mul:${a}:${b * 10}`; if (r < .75) return `div:${a * b * 10}:${b}`; return `mul:${a * 10}:${b * 10}`; });
sk('nullen2', 'tafel', 'Rekenen met nullen (40 × 50, 800 : 20)', () => { const a = ri(2, 9), b = ri(2, 9), r = Math.random();
  if (r < .3) return `mul:${a * 10}:${b * 10}`; if (r < .5) return `mul:${a}:${b * 100}`; if (r < .75) return `div:${a * b * 100}:${b * 10}`; return `div:${a * b * 100}:${b}`; });
sk('rest', 'tafel', 'Delen met rest', () => { const b = ri(2, 9), q = ri(2, 9), r = ri(1, b - 1); return `rest:${b * q + r}:${b}`; });
sk('bdeel', 'breuk', 'Welk deel is gekleurd?', () => { const [n, d] = frac(10); return `bdeel:${n}:${d}:${ri(0, 1)}`; });
sk('bvan', 'breuk', 'Breuk van een getal (3/4 van 20)', () => { const [n, d] = frac(10); return `fvan:${n}:${d}:${d * ri(2, 10)}`; });
sk('bvgl', 'breuk', 'Breuken vergelijken', () => { const s = new Map(); let g = 0; while (s.size < 3 && g++ < 50) { const [n, d] = frac(10); const v = Math.round(n / d * 1e6); if (![...s.values()].includes(v)) s.set(n + '_' + d, v); } return `bvgl:${[...s.keys()].join(':')}`; });
sk('bgel', 'breuk', 'Gelijkwaardige breuken', () => { let n, d; do { [n, d] = frac(6); } while (gcd(n, d) !== 1); return `bgel:${n}:${d}:${ri(2, 4)}`; });

/* Winter */
sk('kommageld', 'komma', 'Rekenen met geld (€ 2,75 + € 1,50)', () => { const a = ri(1, 15) * 100 + pickOne([25, 50, 75, 20, 40, 60, 80, 95]); const b = ri(0, 6) * 100 + pickOne([25, 50, 75, 10, 30, 45]);
  return Math.random() < .6 ? `eur:${a}:${b}:+` : (a > b ? `eur:${a}:${b}:-` : `eur:${a + b}:${b}:-`); });
sk('komma1', 'komma', 'Kommagetallen optellen en aftrekken', () => { const r = Math.random();
  if (r < .4) { const a = ri(1, 49) * 10, b = ri(1, 9) * 10; return `dec:${a}:${b}:+`; }
  if (r < .6) { const a = pickOne([50, 150, 250, 20, 120]), b = pickOne([25, 75, 5, 15, 35]); return `dec:${a}:${b}:+`; }
  const a = ri(20, 99) * 10, b = ri(1, 9) * 10; return `dec:${a}:${Math.min(b, a - 10)}:-`; });
sk('komma10', 'komma', 'Keer en gedeeld door 10, 100, 1000', () => { const r = Math.random();
  if (r < .4) return `dec10:${ri(11, 99) * 10}:${pickOne([10, 100])}:x`; if (r < .55) return `dec10:${ri(1, 99)}:${pickOne([10, 100, 1000])}:x`;
  return `dec10:${ri(1, 99) * 100 * pickOne([1, 10])}:${pickOne([10, 100])}:d`; });
sk('bkomma', 'komma', 'Breuken en kommagetallen (3/4 = 0,75)', () => { const p = pickOne([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [1, 10], [3, 10], [7, 10], [1, 8]]); return `bk:${p[0]}:${p[1]}:${ri(0, 1)}`; });
sk('pct1', 'pct', 'Procenten: 50%, 25% en 10%', () => { const p = pickOne([50, 25, 10]); return `pct:${p}:${pickOne([20, 40, 100, 200]) * ri(1, 9)}`; });
sk('pct2', 'pct', 'Procenten: 20%, 75%, 5%…', () => { const p = pickOne([20, 75, 5, 30, 40, 1, 60]); return `pct:${p}:${pickOne([100, 200, 300, 400, 500, 800, 1000, 1200])}`; });
sk('pbreuk', 'pct', 'Breuk = procent (3/4 = 75%)', () => { const p = pickOne([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [1, 10], [3, 10], [1, 20], [1, 3]].filter(x => x[1] !== 3)); return Math.random() < .3 ? `pb:1:${pickOne([2, 4, 5, 10, 20])}:1` : `pb:${p[0]}:${p[1]}:0`; });
sk('groot', 'getal', 'Grote getallen tot 1.000.000', () => { const r = Math.random();
  if (r < .3) return `groot:0:${ri(11, 99) * 1000}:${ri(1, 9) * 1000}`; if (r < .5) return `groot:1:${pickOne([10000, 100000, 1000000, 50000])}:${pickOne([1, 10, 100, 1000])}`;
  if (r < .7) return `groot:1:${ri(20, 99) * 1000}:${ri(1, 19) * 1000}`;
  return `groot:2:${ri(10001, 99999)}:${pickOne([100, 1000, 10000])}`; });
sk('verh', 'vh', 'Verhoudingen (prijs en recept)', () => { if (Math.random() < .5) return `vh:0:${ri(2, 5)}:${ri(1, 4)}:${ri(2, 10)}`; const a = pickOne([2, 4, 5, 6, 8, 10]), b = ri(2, 4), m = pickOne([2, 3, 5, 1.5].filter(x => Number.isInteger(a * x) && Number.isInteger(b * x))); return `vh:1:${a}:${b}:${a * m}`; });
sk('prijskilo', 'vh', 'Prijs per kilo', () => { const g = pickOne([100, 200, 250, 500, 750]), c = pickOne([400, 800, 1000, 1200, 1600, 2000, 2400]); return `pk:${c}:${g}`; });
sk('schaal', 'vh', 'Schaal en kaart', () => `schaal:${pickOne([100, 1000, 100000, 50000])}:${ri(2, 9)}`);
sk('tijdsduur', 'klok', 'Tijdsduur berekenen', () => { const h = ri(8, 20), m = pickOne([0, 15, 30, 45, 40, 50, 20]); return `duur:${h}:${m}:${pickOne([25, 35, 40, 45, 50, 70, 75, 90])}`; });
sk('volgorde', 'ctx', 'Volgorde van bewerkingen', () => { const r = Math.random();
  if (r < .4) { const a = ri(2, 20), b = ri(2, 9), c = ri(2, 9); return `vo:${a}:+:${b}:x:${c}:0`; }
  if (r < .6) { const b = ri(2, 9), c = ri(2, 9); return `vo:${b + ri(2, 20)}:-:${b * c}:d:${c}:0`; }
  if (r < .8) { const a = ri(2, 9), b = ri(2, 9), c = ri(2, 9); return `vo:${a}:+:${b}:x:${c}:1`; }
  const a = ri(2, 9), b = ri(2, 9), c = ri(1, b - 1 || 1); return `vo:${a}:x:${b}:-:${Math.min(c, b - 1) || 1}:2`; });
sk('gemiddelde', 'ctx', 'Gemiddelde', () => { const n = ri(3, 4), m = ri(3, 12); let it = range(1, n).map(() => m + ri(-3, 3)); const s = it.reduce((x, y) => x + y, 0); it[n - 1] += (n - s % n) % n; if (it[n - 1] <= 0) it = [4, 6, 8]; return `gem:${it.join('_')}`; });
sk('meten2', 'meten', 'Meten met kommagetallen (1,5 m = ? cm)', () => pickOne([
  () => `maat:${ri(11, 49) * 10}:m:cm`, () => `maat:${ri(11, 49) * 10}:kg:g`, () => `maat:${ri(1, 19) * 5}:l:ml`, () => `maat:${pickOne([25, 50, 75, 150, 250])}00:ml:l`,
  () => `maat:${ri(11, 99) * 10}:km:m`, () => `maat:${pickOne([250, 500, 750, 1500])}00:g:kg`])());
sk('context', 'ctx', 'Contextsommen', () => { const t = ri(0, CTX.length - 1);
  switch (t) { case 0: { const a = pickOne([40, 48, 52, 60, 64]); return `ctx:0:${a}:${ri(11, a - 5)}`; } case 1: return `ctx:1:${ri(3, 9)}:${pickOne([12, 24, 15, 25, 18])}`;
    case 2: return `ctx:2:${ri(2, 15)}:${ri(2, 6)}`; case 3: return `ctx:3:${pickOne([20, 40, 60, 80, 30, 50])}:${pickOne([10, 20, 25, 50])}`;
    case 4: return `ctx:4:${pickOne([10, 12, 14, 16, 20])}:${ri(2, 7)}`; default: return `ctx:5:${pickOne([0, 15, 30, 45, 50, 75, 105])}:${pickOne([85, 95, 100, 110, 125])}`; } });

/* De 'vo' met delen gebruikt 'd' als code voor ':' (anders breekt de sleutel) */
const _voMake = MAKES.vo; MAKES.vo = (a, o1, b, o2, c, p) => _voMake(a, o1 === 'd' ? ':' : o1, b, o2 === 'd' ? ':' : o2, c, p);
