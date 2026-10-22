/* ===== Zelf kiezen: eigen training (geen verhaal, geen voortgang, minder munten) =====
   spec = { ops: ['add','sub','mul','div'] | [], max: 10|20|100|1000|10000|0, diff: 'mak'|'nor'|'moe'|'', ex: ['breuk','komma','pct','klok','geld'], taf: [2..10] }
   Leeg veld = 'maakt niet uit' (willekeurig binnen een redelijk bereik). */
const CU_OPS = [['add', '➕'], ['sub', '➖'], ['mul', '✖️'], ['div', '➗']];
const CU_MAX = [10, 20, 100, 1000, 10000];
const CU_DIFF = [['mak', '🙂'], ['nor', '😎'], ['moe', '🔥']];
const CU_EX = [['breuk', '🥧', 'breuken'], ['komma', '🔸', 'komma'], ['pct', '%', 'procent'], ['klok', '🕒', 'klok'], ['geld', '💶', 'geld']];
const CU_EXSK = {
  breuk: { mak: ['half', 'bdeel'], nor: ['bdeel', 'bvan'], moe: ['bvgl', 'bgel', 'bvan'] },
  komma: { mak: ['kommageld', 'komma1'], nor: ['komma1', 'komma10'], moe: ['komma10', 'bkomma'] },
  pct: { mak: ['pct1'], nor: ['pct1', 'pct2'], moe: ['pct2', 'pbreuk'] },
  klok: { mak: ['klokuur', 'klokhalf'], nor: ['kwartier', 'klok5'], moe: ['klok5', 'digitaal'] },
  geld: { mak: ['geld1'], nor: ['geld2', 'terug'], moe: ['terug', 'kommageld'] },
};
const cuDefault = () => ({ ops: ['add', 'sub'], max: 20, diff: '', ex: [], taf: [] });
/* één som binnen het gekozen bereik */
function cuGen(op, spec) {
  const diff = spec.diff || pickOne(['mak', 'nor', 'nor', 'moe']);
  const max = spec.max || pickOne(op === 'mul' || op === 'div' ? [100, 100, 1000] : [20, 100, 100, 1000]);
  const lo = diff === 'mak' ? 0 : diff === 'moe' ? .5 : .15;   // hoe groot de getallen ongeveer zijn (deel van max)
  const big = () => Math.max(2, ri(Math.ceil(max * lo) || 1, max));
  const carryA = (a, b) => { for (let p = 1; p < max; p *= 10) if (Math.floor(a / p) % 10 + Math.floor(b / p) % 10 >= 10) return true; return false; };
  const borrowS = (a, b) => { for (let p = 1; p < max; p *= 10) if (Math.floor(a / p) % 10 < Math.floor(b / p) % 10) return true; return false; };
  if (op === 'add' || op === 'sub') {
    for (let g = 0; g < 60; g++) {
      const s = big(), a = ri(1, s - 1), b = s - a;
      if (op === 'add') { const c = carryA(a, b); if (max > 10 && ((diff === 'mak' && c) || (diff === 'moe' && !c))) continue; return `add:${a}:${b}`; }
      const c = borrowS(s, b); if (max > 10 && ((diff === 'mak' && c) || (diff === 'moe' && !c))) continue; return `sub:${s}:${b}`;
    }
    const a = ri(1, Math.max(1, max - 1)); return op === 'add' ? `add:${a}:${ri(1, Math.max(1, max - a))}` : `sub:${max}:${ri(1, max - 1)}`;
  }
  // × en : — tafels-focus gaat voor; anders volgt het bereik de grootte
  let a, b;
  const taf = spec.taf && spec.taf.length ? spec.taf : null;
  if (taf) { a = pickOne(taf); b = diff === 'mak' ? pickOne([1, 2, 3, 4, 5, 10]) : ri(1, 10); }
  else if (max <= 20) { for (let g = 0; g < 50; g++) { a = ri(1, diff === 'mak' ? 5 : 10); b = ri(1, 10); if (a * b <= max) break; } if (a * b > max) { a = 2; b = Math.floor(max / 2); } }
  else if (max <= 100) { const set = diff === 'mak' ? [1, 2, 5, 10] : diff === 'moe' ? [6, 7, 8, 9] : range(2, 10); a = pickOne(set); b = ri(diff === 'moe' ? 3 : 1, 10); }
  else if (max <= 1000) { a = diff === 'mak' ? ri(2, 9) * 10 : ri(11, diff === 'moe' ? 99 : 49); b = ri(2, 9); if (a * b > 1000) b = Math.floor(1000 / a); }
  else { a = diff === 'mak' ? ri(2, 9) * 100 : ri(12, 99); b = diff === 'mak' ? ri(2, 9) : ri(11, diff === 'moe' ? 99 : 30); if (a * b > max) b = Math.max(2, Math.floor(max / a)); }
  if (op === 'mul') return Math.random() < .5 && !taf ? `mul:${b}:${a}` : `mul:${a}:${b}`;
  return `div:${a * b}:${a}`;
}
/* mix voor de rit: elk gekozen onderdeel een eigen 'skill' */
function customMix(spec) {
  const mix = [], diff = spec.diff || 'nor';
  const ops = spec.ops && spec.ops.length ? spec.ops : (spec.ex && spec.ex.length ? [] : ['add', 'sub', 'mul', 'div']);
  for (const op of ops) { const id = 'cu_' + op; SK[id] = { id, cat: op === 'add' || op === 'sub' ? 'pm' : 'tafel', name: 'Zelf gekozen', gen: () => cuGen(op, spec) }; mix.push([id, 1]); }
  for (const e of spec.ex || []) { const l = (CU_EXSK[e] || {})[diff] || []; l.forEach(s => SK[s] && mix.push([s, 1 / l.length])); }
  if (!mix.length) { SK.cu_add = { id: 'cu_add', cat: 'pm', name: 'Zelf gekozen', gen: () => cuGen('add', spec) }; mix.push(['cu_add', 1]); }
  return mix;
}
function customT(spec) { const t = spec.diff === 'mak' ? [12, 7, 15] : spec.diff === 'moe' ? [9, 4.5, 12] : [10.5, 5.5, 13.5], k = spec.max >= 1000 || (spec.ex || []).length ? 1.3 : 1; return t.map(x => +(x * k).toFixed(2)); }
const CU_LEN = 15;
