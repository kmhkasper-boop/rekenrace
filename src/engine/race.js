/* ===== de rit: rijstroken, poorten, Leitner, tips, voucher, combo, spook ===== */
let R = null, lastRide = null;
const GOOD = ['Goed zo!', 'Super!', 'Toppie!', 'Knap!', 'Wauw!', 'Yes!', 'Top!', 'Raak!'];
const OOPS = ['Bijna!', 'Net niet!', 'Oeps! Geeft niks.', 'Bijna goed!'];
const PACE = { rustig: 1.25, normaal: 1, pittig: .88 };
const DAG_T = [6.5, 3.5, 10];
const fmtTime = s => { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + two(s % 60); };
const effT = () => R.T * (PACE[P.pace] || 1) * ((R.row && R.row.it.tf) || 1);
function dagMix() {
  const open = WORLDS.filter(w => worldOpen(w.id)).map(w => w.id); const last = open.slice(-2);
  const mix = []; for (const w of open) { const wt = last.includes(w) ? 2 : .5; WORLDS[w].sk.flat().forEach(s => mix.push([s, wt])); }
  return mix;
}
function chooseGhost(levelId, pref) {
  if (!pref || pref === 'none') return null;
  const src = pref === 'self' ? P : G.profiles[pref]; if (!src) return null;
  const g = src.lv[levelId] && src.lv[levelId].ghost; if (!g) return null;
  return Object.assign({}, g, { name: pref === 'self' ? 'jij' : src.name, self: pref === 'self' });
}
function startRide(mode, levelId, ghostPref) {
  const lv = mode === 'level' ? LEVELS[levelId] : null;
  const Tb = lv ? lv.T : DAG_T;
  const lr = lv ? (P.lv[lv.id] || {}) : null;
  const T0 = lv ? (lr.T || Tb[0]) : (P.dagT || Tb[0]);
  R = { mode, lv, mix: lv ? lv.mix : dagMix(), Tb, T: clamp(T0, Tb[1], Tb[2]),
    total: lv ? lv.len : Infinity, extra: 0, done: 0, correct: 0, coins: 0, streak: 0, best: 0, score: 0, skips: 0,
    queue: [], recent: [], results: [], before: {}, phase: 'count', countN: 4, countT: 0, clock: 0, gap: .3,
    row: null, timeLeft: DUUR, reviewP: lv ? (lv.boss ? .4 : .3) : .45, paused: false, finishAt: null,
    lastCL: -1, sameRun: 0, bossHit: 0, bossNeed: lv ? Math.ceil(lv.len * .7) : 0, speedLvl: 0, lastSec: -1, marks: [],
    ghost: lv ? chooseGhost(lv.id, ghostPref) : null, young: !!(lv && lv.w <= 1), tutor: !!(lv && lv.w <= 1 && (P.tutorN || 0) < 3), fastN: 0, ghostState: null, bonusSeason: lv && lv.s === realSeason() };
  R.speedLvl = speedLevel();
  if (R.tutor) { P.tutorN = (P.tutorN || 0) + 1; }
  lastRide = { mode, levelId, ghostPref };
  if (lv) setTheme(lv.s, lv.w % 4); else setTheme(realSeason(), 0);
  dist = 0; decor = []; nextDecor = 2; parts = []; rows = []; player.x = 0; player.lane = 1; player.tilt = 0; player.hop = 0;
  boostT = bumpT = shakeT = comboT = 0;
  $('#game').classList.toggle('dag', mode === 'dag');
  $('#game').classList.toggle('calm', !!P.calm);
  $('#bossRow').classList.toggle('on', !!(lv && lv.boss));
  if (lv && lv.boss) $('#bossName').textContent = (lv.w % 4 === 3 ? SEASONS[lv.s].bossName : 'Graaf Chaos');
  $('#tipCard').classList.remove('show');
  $('#sumCard').className = ''; setSumText(lv ? `${WORLDS[lv.w].name} · ${lv.name}` : '1 minuut!'); showVis(null);
  show('game'); layout(); spawnDecor(dist + ZFAR);
  $('#swipeHint').textContent = R.young ? '👈 👆 👉' : '👆 Veeg ← → of tik op een antwoord · ↑ turbo'; $('#swipeHint').classList.toggle('show', (P.seenHint || 0) < 3 && !R.tutor);
  updateHud();
}
function speedLevel() { return Math.floor((R.Tb[2] - R.T) / (R.Tb[2] - R.Tb[1]) * 4 + 1e-6); }
function countdownStep() {
  const el = $('#countBig'); R.countN--;
  if (R.countN > 0) {
    let sub = '';
    if (R.countN === 3) sub = R.lv ? (R.lv.boss ? `👹 Eindbaas: ${R.lv.w % 4 === 3 ? SEASONS[R.lv.s].bossName : 'Graaf Chaos'}!` : `${SEASONS[R.lv.s].icon} ${WORLDS[R.lv.w].name} · ${R.lv.name}`) : '⏱️ Zoveel mogelijk sommen in 1 minuut!';
    if (R.countN === 2 && R.ghost) sub = `👻 Race tegen ${R.ghost.self ? 'je beste rit' : R.ghost.name}!`;
    el.innerHTML = R.countN + (sub ? `<small>${esc(sub)}</small>` : ''); el.className = ''; el.style.display = 'block'; SFX.count();
  } else if (R.countN === 0) { el.innerHTML = 'Start! 🏁'; el.className = 'go'; SFX.go(); }
  else { el.style.display = 'none'; R.phase = 'run'; R.gap = .15; }
  R.countT = .55 / SNEL;
}
function setSumText(t) { const el = $('#sumText'); el.textContent = t; el.classList.toggle('long', t.length > 22); el.classList.toggle('mid', t.length <= 22 && /[a-zA-Zë]{4,}/.test(t)); fitSum(); }
function fitSum() {
  const el = $('#sumText'); el.style.fontSize = '';
  let fs = parseFloat(getComputedStyle(el).fontSize) || 60, n = 0;
  if (el.classList.contains('long')) { while (el.scrollHeight > el.clientHeight + 2 && fs > 14 && n++ < 40) { fs -= 1; el.style.fontSize = fs + 'px'; } return; }
  while (el.scrollWidth > el.clientWidth + 1 && fs > 20 && n++ < 40) { fs -= 2; el.style.fontSize = fs + 'px'; }
}
function showVis(v) {
  const cn = $('#sumVis'); cn.style.display = v ? 'block' : 'none'; if (!v) return;
  const r = cn.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
  cn.width = Math.round((r.width || 280) * d); cn.height = Math.round((r.height || 90) * d);
  const c = cn.getContext('2d'); c.setTransform(d, 0, 0, d, 0, 0); drawVis(c, v, r.width || 280, r.height || 90);
}
function updateHud() {
  if (!R) return;
  $('#hudCoins').textContent = P.coins; $('#hudStreak').textContent = R.streak; $('#pillStreak').classList.toggle('hot', R.streak >= 3);
  $('#hudScore').textContent = R.score;
  const vb = $('#btnVoucher'); vb.style.display = R.mode === 'level' && P.vouchers > 0 ? '' : 'none'; $('#vCount').textContent = P.vouchers;
  if (R.mode === 'level') {
    $('#progFill').style.width = (R.done / R.total * 100) + '%'; $('#progFill').style.background = '';
    $('#progText').textContent = `${R.done}/${R.total}`;
    if (R.lv.boss) $('#bossFill').style.width = Math.max(0, 100 - R.correct / R.bossNeed * 100) + '%';
  } else updateTimer(true);
  updateGhostPill();
}
function updateGhostPill() {
  const el = $('#pillGhost'); if (!R || !R.ghost) { el.style.display = 'none'; return; }
  el.style.display = ''; const g = R.ghostState; const d = g ? g.diff : 0;
  el.innerHTML = d > 0 ? `👻 +${d}` : d < 0 ? `👻 jij +${-d}` : '👻 gelijk';
  el.classList.toggle('ahead', d < 0);
}
function updateTimer(force) {
  const sec = Math.ceil(R.timeLeft); if (!force && sec === R.lastSec) return; R.lastSec = sec;
  $('#progFill').style.width = (R.timeLeft / DUUR * 100) + '%';
  $('#progFill').style.background = R.timeLeft < 10 ? 'linear-gradient(90deg,#ff5f7e,#ff9f1c)' : 'linear-gradient(90deg,#ffd23f,#ff9f1c)';
  $('#progText').textContent = '⏱️ ' + fmtTime(R.timeLeft);
  if (R.phase === 'run' && sec <= 5 && sec > 0 && !force) SFX.count();
}
function feedback(txt, gold) { const el = $('#fb'); el.textContent = txt; el.className = ''; void el.offsetWidth; el.className = 'show' + (gold ? ' gold' : ''); }
function toast(txt) { const el = $('#toast'); el.textContent = txt; el.className = ''; void el.offsetWidth; el.className = 'show'; }

function spawnNext() {
  let pick = null, repeat = false;
  let qi = -1; R.queue.forEach((q, i) => { if (q.due <= R.done && (qi < 0 || q.due < R.queue[qi].due)) qi = i; });
  if (qi >= 0) { pick = R.queue[qi]; R.queue.splice(qi, 1); repeat = true; } else pick = pickKey(R.mix, R);
  const it0 = buildItem(pick.k), it = R.young ? youngItem(it0) : it0, opts = makeOptions(it);
  let cl = opts.indexOf(it.ans);
  if (cl === R.lastCL && R.sameRun >= 1) { const o = (cl + 1 + Math.floor(Math.random() * 2)) % 3; [opts[cl], opts[o]] = [opts[o], opts[cl]]; cl = o; }
  R.sameRun = cl === R.lastCL ? R.sameRun + 1 : 0; R.lastCL = cl;
  const golden = isHard(pick.k);
  const row = { dots: R.young && !!it.dotGates, big: R.young, commitAt: null, it, s: pick.s, opts, cl, z: ZS, age: 0, spawn: R.clock, lastMove: null, resolved: false, chosen: -1, ok: false, golden, repeat, waitT: 0 };
  rows.push(row); R.row = row;
  R.recent.push(pick.k); if (R.recent.length > 6) R.recent.shift();
  if (!(pick.k in R.before)) R.before[pick.k] = boxOf(pick.k);
  $('#tipCard').classList.remove('show');
  const card = $('#sumCard'), qq = qShow(it, R.young); setSumText(qq); showVis(it.vis);
  card.className = (golden ? 'gold' : '') + (it.vis ? ' hasvis' : '') + (R.young && it.vis && !qq ? ' pic' : ''); syncWordsBtn(); void card.offsetWidth; card.classList.add('pop');
  $('#calmGo').classList.remove('show');
}
function resolve(row) {
  row.resolved = true; row.tRes = TG; $('#btnWords').classList.remove('show'); row.chosen = player.lane; row.ok = row.opts[row.chosen] === row.it.ans;
  const it = row.it, cross = R.clock - row.spawn - row.waitT, fast = (it.fast || 4) / SNEL;
  const rt = row.lastMove != null ? row.lastMove : row.turbo ? row.turboAt : Math.min(cross, fast);
  recordResult(it.k, row.s, row.ok, rt * SNEL, fast * SNEL);
  R.done++;
  R.results.push({ k: it.k, q: it.q, ans: it.ans, ok: row.ok, rt: +(rt * SNEL).toFixed(2), repeat: row.repeat, golden: row.golden, chosen: row.opts[row.chosen] });
  const sP = F / ZP, px = CX + (player.x - camX) * sP;
  $('#swipeHint').classList.remove('show'); $('#calmGo').classList.remove('show');
  if (row.ok) {
    R.correct++; R.streak++; R.best = Math.max(R.best, R.streak); P.bestStreak = Math.max(P.bestStreak, R.streak);
    R.marks.push(+(R.clock * SNEL).toFixed(2));
    let coins = row.golden ? 4 : 2; const combo = R.streak % 5 === 0, quick = rt <= fast * .5;
    if (quick) { coins += 1; R.fastN++; }
    if (combo) coins += 3; if (R.bonusSeason) coins += 1;
    P.coins += coins; R.coins += coins;
    if (R.mode === 'dag') R.score += 1 + (combo ? 2 : 0);
    boostT = .8; R.bossHit = .5;
    row.golden ? SFX.gold() : SFX.good(); SFX.coin();
    burstCoins(Math.min(6, coins), row.golden); burst(px, PY - LANE * .4, ['#ffd23f', '#5fd27d', '#4cc3ff', '#ff6fb5'], 14);
    if (combo) { comboT = 2.2 / SNEL; SFX.combo(); vibrate([15, 30, 15]); feedback(`COMBO TURBO! 🔥 ${R.streak} op rij`, true); }
    else feedback(quick ? (R.young ? '⚡👍' : 'Snel! ⚡ +1') : (row.golden ? 'Goud! ⭐ ' : '') + (R.young ? '👍' : pickOne(GOOD)), row.golden || quick);
    $('#sumCard').className = 'ok' + (it.vis ? ' hasvis' : ''); { const qq = qShow(it, R.young); setSumText(`${!qq || qq.length > 22 ? '' : qq + ' = '}${it.ans}`); }
    const pill = $('#pillStreak'); pill.classList.remove('bump'); void pill.offsetWidth; pill.classList.add('bump');
    R.T *= rt <= fast ? .94 : .985; R.gap = .4 / SNEL;
  } else {
    R.streak = 0; bumpT = 1; shakeT = .35; player.hop = LANE * .12; comboT = 0;
    SFX.bad(); vibrate(70); burst(px, PY - 5, 'rgba(180,170,160,.8)', 8, 'puff');
    const last3 = R.results.slice(-3).filter(r => !r.ok).length;
    R.T *= last3 >= 2 ? 1.17 : 1.11;
    R.queue = R.queue.filter(q => q.k !== it.k);
    if (R.mode === 'level') { const remaining = R.total - R.done;
      if (remaining <= 0) { if (R.extra < 3) { R.total++; R.extra++; R.queue.push({ k: it.k, s: row.s, due: R.done }); } }
      else R.queue.push({ k: it.k, s: row.s, due: R.done + Math.min(3, remaining - 1) }); }
    else R.queue.push({ k: it.k, s: row.s, due: R.done + 3 });
    const qq = qShow(it, R.young); $('#sumCard').className = 'bad' + (it.vis ? ' hasvis' : ''); setSumText(qq || '');
    $('#tipHead').textContent = `${pickOne(OOPS)} Jij koos ${row.opts[row.chosen]}.`;
    $('#tipSum').textContent = R.young ? (it.dotGates || /^\d+$/.test(it.ans) && +it.ans <= 10 ? '●'.repeat(+it.ans) + '  ' + it.ans : it.ans) : qq.length > 22 ? `Antwoord: ${it.ans}` : `${qq} = ${it.ans}`;
    $('#tipText').textContent = R.young ? '' : '💡 ' + it.tip; $('#tipCard').classList.toggle('young', R.young); if (R.young) $('#tipHead').textContent = '🙂 👉';
    $('#tipCard').classList.add('show');
    R.gap = (R.young ? 1.6 : R.mode === 'dag' ? 1.5 : 2.2) / SNEL * (!R.young && it.tip.length > 70 ? 1.3 : 1);
  }
  R.T = clamp(R.T, R.Tb[1], R.Tb[2]);
  const lvl = speedLevel();
  if (!P.calm) { if (lvl > R.speedLvl) { toast('⚡ Sneller!'); SFX.speed(); } else if (lvl < R.speedLvl) toast('🐢 Even iets rustiger'); }
  R.speedLvl = lvl;
  checkFinish(row.ok);
  updateHud(); save();
}
function checkFinish(ok) {
  if (R.mode === 'level' && R.done >= R.total) {
    if (R.queue.some(q => q.skip)) { R.total++; R.queue.forEach(q => { if (q.skip) q.due = Math.min(q.due, R.done); }); return; }
    if (R.queue.length && R.extra < 3) { R.total++; R.extra++; }
    else R.finishAt = R.clock + (ok ? .6 : 1.8) / SNEL;
  }
}
/* 🎟️ sla deze som over: telt niet als fout, komt later in de rit terug */
function useVoucher() {
  if (!R || R.mode !== 'level' || R.phase !== 'run' || R.paused) return false;
  const row = R.row; if (!row || row.resolved || P.vouchers <= 0) return false;
  row.resolved = true; row.skipped = true; row.tRes = TG; P.vouchers--; P.usedVoucher = (P.usedVoucher || 0) + 1; R.skips++;
  R.queue.push({ k: row.it.k, s: row.s, due: R.done + 2, skip: true });
  SFX.skip(); toast('🎟️ Overgeslagen! Deze som komt straks terug.');
  setSumText('🎟️ Overgeslagen'); showVis(null); R.gap = .9 / SNEL; $('#calmGo').classList.remove('show');
  updateHud(); save(); return true;
}
function update(dt) {
  TG += dt;
  boostT = Math.max(0, boostT - dt); bumpT = Math.max(0, bumpT - dt * .8); shakeT = Math.max(0, shakeT - dt); comboT = Math.max(0, comboT - dt);
  R.bossHit = Math.max(0, R.bossHit - dt);
  const lvl = (R.Tb[2] - R.T) / (R.Tb[2] - R.Tb[1]);
  const mult = (1 - .7 * bumpT) * (1 + .7 * Math.min(1, boostT / .5)) * (comboT > 0 ? 1.35 : 1);
  const VS = (6.5 + 6 * lvl) * mult * (R.phase === 'count' ? .5 : 1);
  dist += VS * dt;
  camX += (player.x * .55 - camX) * Math.min(1, dt * 8);
  const tx = player.lane - 1, dx = tx - player.x;
  player.x += dx * Math.min(1, dt * 14); player.tilt = clamp(dx * .35, -.35, .35); player.hop = Math.max(0, player.hop - dt * LANE * .5);
  spawnDecor(dist + ZFAR); updateParticles(dt); updateWeather(dt);
  if (R.ghost) { const gp = R.ghost.marks.filter(t => t <= R.clock * SNEL).length, diff = gp - R.correct; const gs = R.ghostState || (R.ghostState = { x: 1, diff: 0 });
    const gl = player.lane === 2 ? 1 : player.lane + 1; gs.x += ((gl - 1) - gs.x) * Math.min(1, dt * 3); if (gs.diff !== diff) { gs.diff = diff; updateGhostPill(); } }
  if (R.phase === 'count') { R.countT -= dt; if (R.countT <= 0) countdownStep(); return; }
  if (R.phase !== 'run') return;
  R.clock += dt;
  if (R.mode === 'dag') { R.timeLeft -= dt; updateTimer(false); if (R.timeLeft <= 0) { R.timeLeft = 0; finishDag(); return; } }
  const vGate = (ZS - ZP) / effT() * SNEL;
  const row = R.row;
  if (row && !row.resolved) {
    if (row.commitAt != null && !row.turbo && R.clock >= row.commitAt) commit(row);
    const hold = P.calm && !row.turbo && row.z <= ZP + 1.6;
    if (hold) { row.waitT += dt; if (!$('#calmGo').classList.contains('show')) $('#calmGo').classList.add('show'); }
    else row.z -= (row.committed ? Math.max(vGate * 6, 14 * SNEL) : vGate * (row.turbo ? 3.5 : 1)) * dt;
    row.age += dt; if (row.z <= ZP) resolve(row);
  }
  else if (R.finishAt != null) { if (R.clock >= R.finishAt) { finishLevel(); return; } }
  else { R.gap -= dt; if (R.gap <= 0) spawnNext(); }
  for (const r of rows) if (r.resolved) r.z -= (vGate + VS * .5) * dt;
  rows = rows.filter(r => r.z > ZNEAR * .8);
}
function move(d) {
  if (!R || R.paused || R.phase === 'end') return;
  const nl2 = clamp(player.lane + d, 0, 2);
  if (nl2 === player.lane) { player.tilt = d * .25; if (R.row && !R.row.resolved && R.phase === 'run') commit(R.row); return; }
  player.lane = nl2; SFX.lane();
  if (R.row && !R.row.resolved) { R.row.lastMove = R.clock - R.row.spawn - R.row.waitT; if (R.phase === 'run') R.row.commitAt = R.clock + .28 / SNEL; }
  if ($('#swipeHint').classList.contains('show') && R.phase === 'run') $('#swipeHint').classList.remove('show');
}
function turbo() {
  if (!R || R.paused || R.phase !== 'run') return;
  const r = R.row; if (!r || r.resolved || r.turbo) return;
  r.turbo = true; r.turboAt = R.clock - r.spawn - r.waitT; boostT = .6; SFX.speed(); $('#calmGo').classList.remove('show');
}

/* vroeg kiezen: de auto versnelt meteen naar de poort */
function commit(row) {
  if (!row || row.resolved || row.turbo) return;
  row.turbo = true; row.committed = true; row.turboAt = R.clock - row.spawn - row.waitT; boostT = .7; R.versnelT = .6; R.commits = (R.commits || 0) + 1;
  if (R.commits <= 2) toast(R.young ? '⚡🚀' : '⚡ Versnellen!'); SFX.speed(); $('#calmGo').classList.remove('show');
}
/* tik op een antwoordpoort: stuur erheen en versnel */
function tapGate(cx, cy) {
  if (!R || R.paused || R.phase !== 'run') return false; const r = R.row; if (!r || r.resolved) return false;
  const s = sc(r.z), g = gy(r.z), top = g - s * 1.6;
  if (cy < top - 10 || cy > g + 10) return false;
  let best = -1, bd = 1e9; for (let i = 0; i < 3; i++) { const x = CX + (i - 1 - camX) * s, d = Math.abs(cx - x); if (d < bd) { bd = d; best = i; } }
  if (bd > s * .6) return false;
  const d = best - player.lane; if (d) { player.lane = best; SFX.lane(); r.lastMove = R.clock - r.spawn - r.waitT; }
  commit(r); return true;
}

/* verhaaltjessommen aan/uit, direct naast de som */
function syncWordsBtn() {
  const b = $('#btnWords'), it = R && R.row && !R.row.resolved && R.row.it, on = P.words !== false;
  const vis = !!(it && it.bare); b.classList.toggle('show', vis); b.classList.toggle('off', !on); $('#sumCard').classList.toggle('hasw', vis); fitSum();
  b.setAttribute('aria-pressed', on ? 'true' : 'false');
  const lb = $('#lvWords'); if (lb) lb.classList.toggle('off', !on);
}
function flash(id, txt) { const el = $(id); el.textContent = txt; el.classList.remove('show'); void el.offsetWidth; el.classList.add('show'); }
function toggleWords() {
  P.words = P.words === false; P.wordsAsked = 1; save(); SFX.click();
  if (R && R.row && !R.row.resolved) { const qq = qShow(R.row.it, R.young); setSumText(qq); }
  syncWordsBtn(); flash('#wFlash', P.words ? '📖 ✅' : '🔢 ✅');
  if ($('#mdOuders').classList.contains('show')) renderOuders();
}
