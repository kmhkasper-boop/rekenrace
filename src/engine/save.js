/* ===== opslag: meerdere profielen, migratie van v1 ===== */
const LS_KEY = 'rekenrace_v2', LS_V1 = 'rekenrace_v1';
function newProfile(name, av, avc) {
  return { id: 'p' + Date.now().toString(36) + ri(100, 999), name: name || 'Racer', av: av || '🦊', avc: avc || '#4cc3ff', created: Date.now(),
    coins: 0, owned: { veh: ['bliksem'], col: ['geel', 'rood'] }, veh: 'bliksem', col: 'geel', facts: {}, lv: {}, open: 0, placed: null,
    vouchers: 1, clears: 0, stickers: {}, unlockAll: false, focus: [], pace: 'normaal', calm: false, daily: {}, allTime: 0, allTimeDate: null,
    days: [], rides: 0, seenHint: 0, story: {}, tot: { n: 0, c: 0 }, ghostWins: 0, bestStreak: 0, last: 0, restN: 0, seasonsDone: [], usedVoucher: 0, dagT: 0, words: true, wordsAsked: 0, showStory: true, tutorN: 0, cv: 25, kleuter: false, custom: null };
}
function defaultG() { return { v: 2, cur: null, order: [], profiles: {}, muted: false }; }
function fixProfile(p) { const old = !p.cv; const d = newProfile(); for (const k in d) if (!(k in p)) p[k] = d[k]; if (old) migrate25(p); if (!p.owned.veh.includes('bliksem')) p.owned.veh.unshift('bliksem'); return p; }
/* v1 → v2: sterren/munten/voertuigen/feiten blijven bewaard */
function classifyOld(a, op, b) {
  if (op === 'x') return TA.includes(a) || TA.includes(b) ? 'tafA' : TB.includes(a) || TB.includes(b) ? 'tafB' : 'tafC';
  const ans = op === '+' ? a + b : a - b, m = Math.max(a, b, ans);
  if (m <= 10) return op === '+' ? 'plus10' : 'min10';
  if (m <= 20) { const cross = op === '+' ? (a % 10 + b % 10 >= 10 || (a < 10 && b < 10)) : a % 10 < b % 10; return op === '+' ? (cross ? 'plus20x' : 'plus20') : (cross ? 'min20x' : 'min20'); }
  if (a % 10 === 0 && b % 10 === 0) return 'tien';
  if (b % 10 === 0 || a % 10 === 0) return 'tienerbij';
  if (op === '+') return a % 10 + b % 10 >= 10 ? 'plus100x' : 'plus100e';
  return a % 10 < b % 10 ? 'min100x' : 'min100e';
}
function migrateV1(o) {
  const p = newProfile('Racer', '🏎️', '#ffb03b');
  p.coins = o.coins || 0; p.veh = o.veh || 'bliksem'; p.col = o.col || 'geel';
  p.owned.veh = Array.from(new Set(['bliksem'].concat((o.owned && o.owned.veh) || []))).filter(v => VEHICLES.some(x => x.id === v));
  p.owned.col = Array.from(new Set(['geel', 'rood'].concat((o.owned && o.owned.col) || [])));
  if (!p.owned.veh.includes(p.veh)) p.veh = 'bliksem';
  ['focus', 'pace', 'daily', 'allTime', 'allTimeDate', 'days', 'rides', 'seenHint', 'unlockAll'].forEach(k => { if (o[k] != null) p[k] = o[k]; });
  for (const k in (o.facts || {})) {
    const m = /^(\d+)([x+\-])(\d+)$/.exec(k); if (!m) continue;
    const a = +m[1], op = m[2], b = +m[3];
    const nk = (op === 'x' ? 'mul' : op === '+' ? 'add' : 'sub') + ':' + a + ':' + b;
    p.facts[nk] = Object.assign({}, o.facts[k], { s: classifyOld(a, op, b) });
    p.tot.n += o.facts[k].n || 0; p.tot.c += o.facts[k].c || 0;
  }
  // oude werelden → nieuwe werelden (alleen wat inhoudelijk overeenkomt)
  const st = id => ((o.worlds || {})[id] || {}).stars || 0;
  const map = [[1, [0, 1, 2]], [2, [4]], [3, [5]], [4, [7]], [5, [7]]];
  for (const [old, ws] of map) if (st(old) > 0) for (const w of ws) for (let l = 0; l < LPW; l++) p.lv[w * LPW + l] = { st: Math.min(st(old), 2), cl: 1, plays: 0, pl: 1 };
  const cl = Object.keys(p.lv).map(Number); p.open = cl.length ? Math.min(NLEV - 1, Math.max(...cl) + 1) : 0;
  // levels tussen de overgenomen werelden (bijv. Klokkentoren) staan open, maar zijn nog niet gehaald
  p.migrated = 1; p.clears = cl.length; delete p.cv; migrate25(p);
  return p;
}
/* v2.4 → v2.5: groep 1-2 (oude werelden 0-1) wordt de Kleuter-modus; Lente begint nu bij groep 3.
   oud w0,w1 → kleuter (levels 144-161) · oud w2 Bruggetje → nieuw w1 · oud w3 Klokkentoren blijft w3 · w4+ ongewijzigd.
   Nieuwe werelden (Splits-sloot w0, Tulpentuin w2) gelden als 'gehaald via instap' (0 sterren, pl) als je al verder was. Er gaat niets verloren. */
function migrate25(p) {
  const L = p.lv || {}, nl = {}, mapId = id => { const w = Math.floor(id / LPW), l = id % LPW; return w <= 1 ? NLEV + w * LPW + l : w === 2 ? LPW + l : id; };
  for (const k in L) { const id = +k; if (id >= 0 && id < NLEV) nl[mapId(id)] = L[k]; }
  const mainCl = Object.keys(nl).map(Number).filter(i => i < NLEV && nl[i].cl), maxCl = mainCl.length ? Math.max(...mainCl) : -1;
  for (const w of [0, 2]) if (maxCl >= (w + 1) * LPW) for (let l = 0; l < LPW; l++) { const id = w * LPW + l; if (!nl[id]) nl[id] = { st: 0, cl: 1, pl: 1, plays: 0, best: 0 }; }
  p.lv = nl;
  const oldOpen = p.open || 0, oo = oldOpen <= 2 * LPW - 1 ? 0 : mapId(oldOpen);
  p.open = Math.min(NLEV - 1, Math.max(oo, maxCl + 1, 0));
  const st = p.story || {}; if (st.w1) st.w0 = 1; else delete st.w0; if (st.w2) st.w1 = 1; else delete st.w1; delete st.w2;
  if (p.placed) { const w = p.placed.world || 0; if (w <= 1) { p.placed.world = 0; if (Object.keys(nl).some(i => +i >= NLEV) && maxCl < 0) p.kleuter = true; } else if (w === 2) p.placed.world = 1; }
  p.cv = 25; p.migrated25 = 1;
}
function loadG() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) { const g = Object.assign(defaultG(), JSON.parse(raw)); for (const id in g.profiles) fixProfile(g.profiles[id]); g.order = g.order.filter(id => g.profiles[id]); if (!g.profiles[g.cur]) g.cur = g.order[0] || null; return g; }
    const r1 = localStorage.getItem(LS_V1);
    if (r1) { const o = JSON.parse(r1), g = defaultG(), p = migrateV1(o); g.profiles[p.id] = p; g.order = [p.id]; g.cur = p.id; g.muted = !!o.muted; g.migratedFrom = 1; return g; }
  } catch (e) { }
  return defaultG();
}
let G = loadG();
let P = G.cur ? G.profiles[G.cur] : null;
function save() { try { localStorage.setItem(LS_KEY, JSON.stringify(G)); } catch (e) { } }
function setProfile(id) { G.cur = id; P = G.profiles[id]; save(); }
function addProfile(name, av, avc) { const p = newProfile(name, av, avc); G.profiles[p.id] = p; G.order.push(p.id); setProfile(p.id); return p; }
function deleteProfile(id) { delete G.profiles[id]; G.order = G.order.filter(x => x !== id); if (G.cur === id) { G.cur = G.order[0] || null; P = G.cur ? G.profiles[G.cur] : null; } save(); }

/* dagen / reeks */
function markPracticed() { const k = dayKey(); if (!P.days.includes(k)) { P.days.push(k); P.days.sort(); if (P.days.length > 500) P.days = P.days.slice(-500); } }
function streakOf(p) { const set = new Set(p.days); const d = new Date(); d.setHours(12, 0, 0, 0); const today = set.has(dayKey(d)); if (!today) d.setDate(d.getDate() - 1); let n = 0; while (set.has(dayKey(d))) { n++; d.setDate(d.getDate() - 1); } return { n, today }; }
function streakText() { const st = streakOf(P);
  if (st.today) return st.n >= 2 ? `🔥 ${st.n} dagen op rij!` : '🔥 Vandaag geoefend! Kom morgen terug voor 2 op rij.';
  if (st.n >= 1) return `🔥 ${st.n} ${st.n === 1 ? 'dag' : 'dagen'} op rij – speel vandaag om je reeks te houden!`;
  return '🔥 Speel vandaag en start je reeks!'; }

/* levels openen */
const lvRec = id => P.lv[id] || null;
const isCleared = id => !!(P.lv[id] && P.lv[id].cl);
const isOpen = id => id >= NLEV ? (id === NLEV || P.unlockAll || isCleared(id - 1) || isCleared(id)) : (id === 0 || P.unlockAll || id <= P.open || isCleared(id - 1) || isCleared(id));
const worldOpen = w => isOpen(w * LPW);
const seasonOpen = s => worldOpen(s * 4);
function worldStars(w) { let s = 0; for (let l = 0; l < LPW; l++) s += (P.lv[w * LPW + l] || {}).st || 0; return s; }
function nextKleuter() { for (let i = NLEV; i < NLEV + KLEVN; i++) if (!isCleared(i) && isOpen(i)) return i; return NLEV + KLEVN - 1; }
function nextLevel() { for (let i = 0; i < NLEV; i++) if (!isCleared(i) && isOpen(i)) return i; return NLEV - 1; }

/* Leitner (vakjes 0..5, -1 = nieuw) */
const MASTERED = 4, MULT = [4, 3, 1.6, .8, .35, .2];
const boxOf = k => { const r = P.facts[k]; return r ? r.b : -1; };
const mastery = k => { const b = boxOf(k); return b < 0 ? 0 : b <= 1 ? 1 : b < MASTERED ? 2 : 3; };
const isHard = k => { const b = boxOf(k); return b >= 0 && b <= 1; };
function recordResult(k, skill, ok, rt, fast) {
  const r = P.facts[k] || (P.facts[k] = { n: 0, c: 0, b: -1, rt: 0, t: 0 });
  r.n++; r.t = Date.now(); r.s = skill;
  if (ok) { r.c++; if (rt <= fast) r.b = r.b < 0 ? 2 : Math.min(5, r.b + 1); else r.b = Math.max(1, r.b); } else r.b = 0;
  r.rt = +(r.rt ? r.rt * .6 + rt * .4 : rt).toFixed(2);
  P.tot.n++; if (ok) P.tot.c++;
  // opslag beperken
  const ks = Object.keys(P.facts); if (ks.length > 2500) { ks.sort((a, b) => P.facts[a].t - P.facts[b].t); ks.slice(0, 300).forEach(x => delete P.facts[x]); }
  return r;
}
const focusMult = k => { if (!P.focus.length || !k.startsWith('mul:')) return 1; const [, a, b] = k.split(':').map(Number); return (P.focus.includes(a) || P.focus.includes(b)) ? 3 : 1; };
/* kies de volgende vraag uit een mix [[skill, gewicht]...] */
function pickKey(mix, ride) {
  const skills = new Set(mix.map(m => m[0])), recent = ride.recent, queued = k => ride.queue.some(q => q.k === k);
  if (Math.random() < ride.reviewP) {
    const hard = [];
    for (const k in P.facts) { const r = P.facts[k]; if (r.b >= 0 && r.b <= 1 && skills.has(r.s) && !recent.includes(k) && !queued(k)) hard.push([k, (3 - r.b) * focusMult(k)]); }
    if (hard.length) { const k = wpick(hard); return { k, s: P.facts[k].s }; }
  }
  const cands = [];
  for (let i = 0; i < 6; i++) {
    const s = wpick(mix); let k = SK[s].gen(), g = 0;
    while ((recent.includes(k) || queued(k)) && g++ < 6) k = SK[s].gen();
    const b = boxOf(k); cands.push([{ k, s }, (b < 0 ? 1 : MULT[b]) * focusMult(k) * (recent.includes(k) ? .05 : 1)]);
  }
  return wpick(cands);
}
