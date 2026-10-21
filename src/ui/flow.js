/* ===== einde rit, verder, rustmomenten, verhaal ===== */
let lastEnd = null;
function finishLevel() {
  R.phase = 'end'; const lv = R.lv;
  const pct = R.done ? R.correct / R.done : 0;
  let stars = pct >= .9 ? 3 : pct >= .75 ? 2 : pct >= .5 ? 1 : 0;
  const bossWin = !lv.boss || R.correct >= R.bossNeed;
  if (!bossWin) stars = 0;
  const cleared = stars >= 1;
  const rec = P.lv[lv.id] || (P.lv[lv.id] = { st: 0, plays: 0, best: 0 });
  const firstClear = cleared && (!rec.cl || rec.pl);
  const newBest = stars > (rec.pl ? 0 : rec.st || 0);
  rec.st = rec.pl ? stars || rec.st : Math.max(rec.st || 0, stars); if (cleared) { rec.cl = 1; delete rec.pl; }
  rec.plays = (rec.plays || 0) + 1; rec.best = Math.max(rec.best || 0, R.correct);
  rec.T = +clamp(R.T * 1.05, R.Tb[1], R.Tb[2]).toFixed(2);
  const info = { id: lv.id, stars, pct, cleared, bossWin, newBest, banners: [], storyB: null, nextOpen: false };
  if (firstClear) {
    P.clears++; P.open = Math.max(P.open, Math.min(NLEV - 1, lv.id + 1)); info.nextOpen = lv.id + 1 < NLEV;
    if (P.clears % 3 === 0) { if (P.vouchers < 3) { P.vouchers++; info.banners.push('🎟️ Je kreeg een <b>Sla-deze-som-over-bon</b>! Tik hem aan tijdens een rit.'); } }
    if (lv.boss && lv.w % 4 === 3 && !P.seasonsDone.includes(lv.s)) {
      P.seasonsDone.push(lv.s); const v = VEHICLES.find(x => x.s === lv.s && x.how === 'boss');
      if (v && !P.owned.veh.includes(v.id)) { P.owned.veh.push(v.id); info.banners.push(`🏆 Nieuw voertuig gewonnen: <b>${v.name}</b>! Kijk in de garage.`); }
      info.banners.push(`${SEASONS[lv.s].icon} Je hebt het <b>${SEASONS[lv.s].name}kristal</b> terug!`); info.storyB = 'b' + lv.s;
    }
    if (lv.l === LPW - 1 && lv.w + 1 < WORLDS.length && WORLDS[lv.w + 1].s !== lv.s) info.banners.push(`${SEASONS[lv.s + 1].icon} Een nieuw seizoen gaat open: <b>${SEASONS[lv.s + 1].name}</b>!`);
  }
  if (lv.boss) info.banners.push(bossWin ? `👹 Je hebt ${lv.w % 4 === 3 ? SEASONS[lv.s].bossName : 'Graaf Chaos'} verslagen!` : `👹 De eindbaas heeft nog energie. Nog ${R.bossNeed - R.correct} goede antwoorden nodig!`);
  // spook
  const me = { c: R.correct, t: +(R.clock * SNEL).toFixed(2), marks: R.marks, veh: P.veh };
  if (R.ghost) { const g = R.ghost, win = me.c > g.c || (me.c === g.c && me.t < g.t);
    info.ghost = win; if (win) { P.ghostWins++; info.banners.push(`👻 Je versloeg het spook van ${g.self ? 'je beste rit' : esc(g.name)}!`); } else info.banners.push(`👻 Het spook van ${g.self ? 'je beste rit' : esc(g.name)} was nét sneller. Volgende keer!`); }
  if (!rec.ghost || me.c > rec.ghost.c || (me.c === rec.ghost.c && me.t < rec.ghost.t)) rec.ghost = me;
  P.seenHint = (P.seenHint || 0) + 1; P.last = lv.id;
  markPracticed(); P.rides++;
  info.stickers = checkStickers();
  save(); lastEnd = info;
  renderEnd(info); show('scrEnd'); SFX.fanfare(); if (stars >= 2 || firstClear) confetti();
}
function checkStickers() { const got = []; for (const [id, icon, name, , test] of STICKERS) if (!P.stickers[id] && test(P)) { P.stickers[id] = dayKey(); got.push(icon + ' ' + name); } return got; }
function renderEnd(info) {
  const lv = LEVELS[info.id], w = WORLDS[lv.w];
  const titles = ['Goed geoefend! 💪', 'Goed bezig! 👍', 'Super gedaan! 🎉', 'Fantastisch! 🏆'];
  $('#endTitle').textContent = titles[info.stars];
  $('#endWorld').textContent = `${SEASONS[lv.s].icon} ${w.name} · ${lv.name}`;
  $('#endStars').innerHTML = [0, 1, 2].map(i => `<span class="${i < info.stars ? 'star-on' : 'star-off'}" style="animation-delay:${.15 + i * .25}s">★</span>`).join('');
  $('#endMsg').textContent = `${R.correct} van de ${R.done} sommen goed!` + (info.stars === 0 ? ' Oefenen maakt je sneller. Probeer het nog eens!' : '');
  $('#endStats').innerHTML = `<span class="stat gold">🪙 +${R.coins} munten</span><span class="stat">🔥 Langste reeks: ${R.best}</span>` + (R.skips ? `<span class="stat">🎟️ ${R.skips} overgeslagen</span>` : '') + (R.bonusSeason ? `<span class="stat">${SEASONS[lv.s].icon} seizoensbonus</span>` : '');
  const order = [], byK = {};
  for (const r of R.results) { if (!byK[r.k]) { byK[r.k] = []; order.push(r.k); } byK[r.k].push(r); }
  $('#endChips').innerHTML = order.slice(0, 24).map(k => { const a = byK[k], cls = a[a.length - 1].ok ? (a[0].ok ? 'ok' : 'fix') : 'bad'; const it = buildItem(k); const t = it.q.length > 16 ? it.ans : it.q; return `<span class="chip ${cls}">${esc(t)}</span>`; }).join('');
  let b = info.banners.map(x => `<div class="banner">${x}</div>`).join('');
  if (info.newBest && info.stars > 0 && !info.banners.length) b += `<div class="banner">⭐ Nieuw sterrenrecord in dit level!</div>`;
  for (const s of info.stickers || []) b += `<div class="banner purple">🏷️ Nieuwe sticker: <b>${esc(s)}</b></div>`;
  $('#endBanners').innerHTML = b;
  const last = info.id === NLEV - 1 && info.cleared;
  $('#btnNext').textContent = last ? '🎉 Het einde van het verhaal' : info.cleared ? '➡️ Volgende level' : '🔁 Nog een poging';
  $('#btnNext').dataset.yi = ''; if (LEVELS[info.id].w <= 1) { $('#endMsg').textContent = `✅ ${R.correct}   ❌ ${R.done - R.correct}`; $('#endWorld').textContent = SEASONS[LEVELS[info.id].s].icon + ' ' + WORLDS[LEVELS[info.id].w].icon + ' ' + (LEVELS[info.id].l + 1); }
}
function goNext() {
  const info = lastEnd; if (!info) return;
  const next = info.cleared ? Math.min(NLEV - 1, info.id + 1) : info.id;
  const finale = info.id === NLEV - 1 && info.cleared;
  runRest(() => {
    if (info.storyB && !P.story[info.storyB]) playStory(info.storyB, () => finale ? show('scrMenu') : playLevel(next));
    else if (finale) show('scrMenu'); else playLevel(next);
  });
}
function defaultGhost(id) { return P.lv[id] && P.lv[id].ghost && P.lv[id].plays ? 'self' : 'none'; }
let wordsThen = null;
function playLevel(id, ghostPref) {
  const w = LEVELS[id].w, key = 'w' + w;
  const go0 = () => startRide('level', id, ghostPref == null ? defaultGhost(id) : ghostPref);
  const go = () => { if (!P.wordsAsked && WORLDS[w].sk.flat().some(x => WORD_SKILLS.includes(x))) { wordsThen = go0; $('#mdWords').classList.add('show'); } else go0(); };
  if (!P.story.intro) playStory('intro', () => playStory(key, go));
  else if (!P.story[key]) playStory(key, go); else go();
}

/* ---------- rustmoment (5-8 s) en ademhalingspauze (na elke 3 levels) ---------- */
let REST = null;
function runRest(done) {
  P.restN = (P.restN || 0) + 1; save();
  const breathe = P.restN % 3 === 0;
  const lv = lastEnd ? LEVELS[lastEnd.id] : LEVELS[0];
  const type = breathe ? 'adem' : pickOne(REST_BY_SEASON[lv.s]);
  REST = { type, t: 0, dur: (breathe ? 10 : 5) / SNEL, done, s: lv.s };
  $('#restText').textContent = youngNow() ? (breathe ? '🫧 😌' : '☕ 🙂') : (breathe ? 'Even rust. Adem mee met het rondje…' : REST_TXT[type]) + (breathe ? '' : ' (tik om verder te gaan)');
  $('#restTitle').textContent = breathe ? '🫧 Adempauze' : '☕ Rustmoment';
  show('scrRest'); layoutRest();
}
function layoutRest() { const cn = $('#restCv'), d = Math.min(2, devicePixelRatio || 1), r = cn.getBoundingClientRect(); cn.width = Math.round(r.width * d); cn.height = Math.round(r.height * d); REST && (REST.d = d, REST.w = r.width, REST.h = r.height); }
function endRest() { if (!REST) return; const d = REST.done; REST = null; d && d(); }
function drawRest(dt) {
  if (!REST) return; REST.t += dt; const cn = $('#restCv'), c = cn.getContext('2d'), w = REST.w, h = REST.h, t = REST.t * SNEL, k = REST.t / REST.dur;
  $('#restBar').style.width = Math.min(100, k * 100) + '%';
  $('#btnRestSkip').style.visibility = REST.type !== 'adem' || t >= 3 ? 'visible' : 'hidden';
  c.setTransform(REST.d, 0, 0, REST.d, 0, 0); c.clearRect(0, 0, w, h);
  const th = THEMES[REST.s][0], g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, th.sky[0]); g.addColorStop(.65, th.sky[1]); g.addColorStop(.651, th.grass[0]); g.addColorStop(1, th.grass[1]);
  c.fillStyle = g; c.fillRect(0, 0, w, h);
  const im = ART.img('rest_' + REST.type); const gy2 = h * .82, u = Math.min(w * .45, h * .5);
  if (im) drawImgCover(c, im, 0, 0, w, h);
  else switch (REST.type) {
    case 'adem': { const tt = REST.t * SNEL, ph = (1 - Math.cos(tt / 5 * Math.PI * 2)) / 2; c.fillStyle = 'rgba(255,255,255,.55)'; circ(c, w / 2, h * .42, u * (.25 + .3 * ph)); c.fillStyle = 'rgba(127,231,255,.5)'; circ(c, w / 2, h * .42, u * (.18 + .25 * ph));
      c.fillStyle = '#1f2a44'; c.font = `700 ${u * .12}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(tt % 5 < 2.5 ? 'adem in…' : 'adem uit…', w / 2, h * .42);
      drawVehicle(c, P.veh, colorHex(P.col, t), w / 2, gy2, u * .8 * (1 + .05 * ph), t * .3, 0, false); break; }
    case 'pitstop': drawVehicle(c, P.veh, colorHex(P.col, t), w * .5, gy2 - Math.max(0, Math.sin(t * 2)) * 6, u, t, 0, false); drawChar(c, 'opa', w * .22, gy2, u * .8, 0, t);
      c.fillStyle = '#22283a'; const tx = w * .78 + Math.sin(t * 3) * 10; circ(c, tx, gy2 - u * .12, u * .1); c.fillStyle = '#8a93a6'; circ(c, tx, gy2 - u * .12, u * .04); break;
    case 'wasstraat': drawVehicle(c, P.veh, colorHex(P.col, t), w * (.2 + (t * .12 % .6)), gy2, u, t, 0, false); c.fillStyle = 'rgba(120,180,255,.35)'; c.fillRect(w * .35, h * .2, w * .3, gy2 - h * .2);
      for (let i = 0; i < 25; i++) { c.fillStyle = 'rgba(255,255,255,.85)'; circ(c, w * .35 + ((i * 37 + t * 40) % (w * .3)), h * .25 + ((i * 53 + t * 60) % (gy2 - h * .3)), 4 + i % 5); } break;
    case 'ijsje': { drawChar(c, 'pim', w * .4, gy2, u * .8, k > .55 ? 1 : 0, t); const yy = k > .55 ? Math.min(gy2 - 8, h * .55 + (k - .55) * h * 1.5) : h * .55; c.fillStyle = '#e0a060'; tri(c, w * .55 - 10, yy, w * .55 + 10, yy, w * .55, yy + 28); c.fillStyle = '#ff9ac8'; circ(c, w * .55, yy - 6, 14);
      drawChar(c, 'opa', w * .75, gy2, u * .8, k > .55 ? 0 : 0, t, true); break; }
    case 'eekhoorn': { for (let i = 0; i < 3; i++) drawDecorAt(c, 'autumn', w * (.2 + i * .3), gy2, u * .9); const ex = w * (.1 + (t * .15 % .8)); c.fillStyle = '#c76a2a'; ell(c, ex, gy2 - 14, 18, 12); circ(c, ex + 16, gy2 - 24, 10); c.beginPath(); c.ellipse(ex - 20, gy2 - 30, 10, 22, -.4, 0, Math.PI * 2); c.fill(); c.fillStyle = '#7a4a2a'; ell(c, ex + 26, gy2 - 6, 6, 5); break; }
    case 'sneeuwpop': { c.fillStyle = '#fff'; const g2 = Math.min(1, k * 1.6); circ(c, w * .55, gy2 - u * .2, u * .2 * g2); if (g2 > .5) circ(c, w * .55, gy2 - u * .52, u * .14 * (g2 - .5) * 2); if (g2 >= 1) { c.fillStyle = '#e8322f'; ell(c, w * .55, gy2 - u * .6, u * .1, u * .03); c.fillStyle = '#f4f4f4'; ell(c, w * .55, gy2 - u * .47, u * .06, u * .018); }
      drawChar(c, 'pim', w * .25, gy2, u * .75, 0, t); for (let i = 0; i < 40; i++) { c.fillStyle = '#fff'; circ(c, (i * 71) % w, (i * 37 + t * 50) % h, 2.5); } break; }
    case 'tanken': { drawVehicle(c, P.veh, colorHex(P.col, t), w * .4, gy2, u, t, 0, false); c.fillStyle = '#e8322f'; rr(c, w * .72, gy2 - u * .7, u * .25, u * .7, 10); c.fill();
      c.fillStyle = '#fff'; rr(c, w * .74, gy2 - u * .62, u * .21, u * .18, 6); c.fill(); c.fillStyle = '#1f2a44'; c.font = `700 ${u * .09}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(Math.min(100, Math.round(k * 110)) + '%', w * .72 + u * .125, gy2 - u * .53); break; }
    case 'vlieger': { drawChar(c, 'opa', w * .3, gy2, u * .8, 0, t); const kx = w * .7 + Math.sin(t) * 30, ky = h * .25 + Math.cos(t * 1.3) * 20; c.strokeStyle = '#fff'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(w * .3 + u * .25, gy2 - u * .6); c.quadraticCurveTo(w * .5, h * .5, kx, ky + 30); c.stroke();
      c.fillStyle = '#ff6fb5'; c.beginPath(); c.moveTo(kx, ky - 30); c.lineTo(kx + 22, ky); c.lineTo(kx, ky + 30); c.lineTo(kx - 22, ky); c.closePath(); c.fill(); break; }
    case 'picknick': { c.fillStyle = '#ff5a5f'; rr(c, w * .25, gy2 - 30, w * .5, 40, 8); c.fill(); c.fillStyle = '#fff'; for (let i = 0; i < 6; i++) c.fillRect(w * .25 + i * w * .085, gy2 - 30, w * .04, 40);
      drawChar(c, 'pim', w * .3, gy2 - 10, u * .6, 0, t); drawChar(c, 'opa', w * .7, gy2 - 10, u * .7, k > .6 ? 1 : 0, t, true); c.fillStyle = '#f2c46d'; rr(c, w * .48, gy2 - 52 - Math.abs(Math.sin(t * 3)) * 20, 30, 18, 4); c.fill(); break; }
  }
  if (REST.t >= REST.dur) endRest();
}
function drawDecorAt(c, type, x, y, s) { c.fillStyle = '#7a4a2a'; c.fillRect(x - s * .06, y - s * .45, s * .12, s * .45); c.fillStyle = '#e07a2e'; circ(c, x, y - s * .7, s * .32); circ(c, x - s * .2, y - s * .55, s * .22); circ(c, x + s * .2, y - s * .55, s * .22); }

/* ---------- verhaal (stripplaatjes met tekstballonnen) ---------- */
let STORYRUN = null;
function playStory(key, done, force) {
  const st = STORY[key]; if (!st || (P.showStory === false && !force)) { done && done(); return; }
  STORYRUN = { key, i: 0, done, t: 0 }; $('#storyTitle').textContent = '📖 ' + st.title; show('scrStory'); layoutStory(); renderStoryPanel();
}
function layoutStory() { const cn = $('#storyCv'), d = Math.min(2, devicePixelRatio || 1), r = cn.getBoundingClientRect(); cn.width = Math.round(r.width * d); cn.height = Math.round(r.height * d); if (STORYRUN) Object.assign(STORYRUN, { d, w: r.width, h: r.height }); }
function renderStoryPanel() {
  const st = STORY[STORYRUN.key], p = st.p[STORYRUN.i];
  const who = p[2] === 'l' ? p[0] : p[2] === 'r' ? p[1] : null;
  const name = who ? (who === 'player' ? P.name : CHAR_NAMES[who]) : '';
  $('#bubble').className = 'bubble ' + (p[2] === 'n' ? 'narr' : p[2]);
  $('#bubbleWho').textContent = name; $('#bubbleText').textContent = p[3].replace(/\{naam\}/g, P.name);
  $('#storyDots').innerHTML = st.p.map((_, i) => `<i class="${i === STORYRUN.i ? 'on' : ''}"></i>`).join('');
  $('#btnStoryNext').textContent = STORYRUN.i < st.p.length - 1 ? 'Verder ▶' : 'Racen! 🏁';
  const yp = youngNow() && STORY_PICS[STORYRUN.key]; $('#bubble').classList.toggle('pics', !!yp); $('#bubblePic').textContent = yp ? yp[STORYRUN.i] || '' : '';
  applyYoung(); syncStoryBtn();
  SFX.page();
}
function storyNext() { const st = STORY[STORYRUN.key]; if (STORYRUN.i < st.p.length - 1) { STORYRUN.i++; renderStoryPanel(); } else storyEnd(); }
function storyEnd() { if (!STORYRUN) return; P.story[STORYRUN.key] = 1; save(); const d = STORYRUN.done; STORYRUN = null; d ? d() : show('scrMenu'); }
function drawStory(dt) {
  if (!STORYRUN || !STORYRUN.w) return; STORYRUN.t += dt; const st = STORY[STORYRUN.key], p = st.p[STORYRUN.i];
  const cn = $('#storyCv'), c = cn.getContext('2d'), w = STORYRUN.w, h = STORYRUN.h, t = STORYRUN.t;
  c.setTransform(STORYRUN.d, 0, 0, STORYRUN.d, 0, 0);
  const sk = SEASONS[st.s].key, bg = ART.img('bg_' + sk);
  const th = THEMES[st.s][STORYRUN.key === 'intro' ? 0 : Math.min(3, (+String(STORYRUN.key).replace(/\D/g, '') || 0) % 4)];
  if (bg) drawImgCover(c, bg, 0, 0, w, h * .6);
  else { const g = c.createLinearGradient(0, 0, 0, h * .6); g.addColorStop(0, th.sky[0]); g.addColorStop(1, th.sky[1]); c.fillStyle = g; c.fillRect(0, 0, w, h * .6);
    c.fillStyle = th.hill[0]; c.beginPath(); c.moveTo(0, h * .6); for (let x = 0; x <= w + 20; x += 20) c.lineTo(x, h * .5 - 18 * Math.sin(x * .013)); c.lineTo(w, h * .6); c.fill(); }
  c.fillStyle = th.grass[0]; c.fillRect(0, h * .6, w, h * .4);
  if (STORYRUN.key === 'intro' && STORYRUN.i < 2) { c.fillStyle = 'rgba(90,70,60,.25)'; c.fillRect(0, h * .2, w, h * .55); c.fillStyle = '#8a5a3a'; c.fillRect(0, h * .18, w, 10); }
  const s = Math.min(h * .46, w * .42), fy = h * .64;
  const L = p[0], Rr = p[1], talk = p[2];
  drawChar(c, L, w * .27, fy - (talk === 'l' ? Math.abs(Math.sin(t * 8)) * 4 : 0), s, L === 'chaos' && STORYRUN.key === 'b3' ? 0 : L === 'chaos' || L === 'victor' ? 2 : 0, t);
  drawChar(c, Rr, w * .73, fy - (talk === 'r' ? Math.abs(Math.sin(t * 8)) * 4 : 0), s * (Rr === 'pim' ? .8 : 1), 0, t, true);
  if (STORYRUN.key.startsWith('b')) { const cr = SEASONS[st.s].crystal; c.save(); c.translate(w / 2, h * .35 + Math.sin(t * 2) * 8); c.rotate(Math.sin(t) * .1); c.fillStyle = cr; c.beginPath(); c.moveTo(0, -s * .22); c.lineTo(s * .12, -s * .05); c.lineTo(0, s * .15); c.lineTo(-s * .12, -s * .05); c.closePath(); c.fill(); c.fillStyle = 'rgba(255,255,255,.6)'; tri(c, 0, -s * .22, s * .05, -s * .05, -s * .03, -s * .05); c.restore(); }
}
function confetti() {
  const box = document.createElement('div'); box.className = 'confetti'; const cols = ['#ff6b6b', '#ffd23f', '#5fd27d', '#4cc3ff', '#9b59ff', '#ff8ac0'];
  for (let i = 0; i < 70; i++) { const c = document.createElement('i'); c.style.left = Math.random() * 100 + '%'; c.style.background = pickOne(cols); c.style.animationDuration = rnd(1.8, 3.4) + 's'; c.style.animationDelay = rnd(0, .8) + 's'; box.appendChild(c); }
  document.body.appendChild(box); setTimeout(() => box.remove(), 4500);
}

function syncStoryBtn() { const b = $('#btnStoryToggle'), on = P.showStory !== false; b.classList.toggle('off', !on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); }
function toggleStory() { P.showStory = P.showStory === false; save(); SFX.click(); syncStoryBtn(); flash('#sFlash', P.showStory ? '📖 ✅' : '📖 ❌'); if ($('#mdOuders').classList.contains('show')) renderOuders(); }
