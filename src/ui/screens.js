/* ===== schermen ===== */
const SCREENS = ['scrProfiles', 'scrNew', 'scrMenu', 'scrMap', 'scrGarage', 'scrStickers', 'scrKaart', 'scrEnd', 'scrDag', 'scrDagEnd', 'scrPlace', 'scrStory', 'scrRest'];
let curScreen = 'scrMenu';
function show(id) {
  SCREENS.forEach(s => $('#' + s).classList.toggle('show', s === id)); curScreen = id;
  $('#game').classList.toggle('on', id === 'game');
  if (id !== 'game') { $('#mdPause').classList.remove('show'); if (R && R.phase !== 'end') R = null; }
  document.body.dataset.season = (id === 'scrMap' ? mapSeason : realSeason());
  const fn = RENDER[id]; if (fn) fn(); applyYoung();
  const el = $('#' + id); if (el && el.scrollTo) el.scrollTop = 0;
}
const coinsTxt = () => $$('.coinTxt').forEach(e => e.textContent = P ? P.coins : 0);
function syncMute() { $$('.mutebtn').forEach(b => b.textContent = G.muted ? '🔇' : '🔊'); $('#btnMute2').textContent = G.muted ? '🔇 Geluid is uit' : '🔊 Geluid is aan'; }
const totalStars = p => Object.values(p.lv).reduce((s, l) => s + (l.pl ? 0 : l.st || 0), 0);
let mapSeason = 0;
const RENDER = {
  scrProfiles() {
    $('#profList').innerHTML = G.order.map(id => { const p = G.profiles[id];
      return `<button class="pcard ${id === G.cur ? 'sel' : ''}" data-prof="${id}"><span class="pav" style="background:${p.avc}">${p.av}</span><span class="pn">${esc(p.name)}</span><span class="ps">⭐ ${totalStars(p)} · 🪙 ${p.coins}</span></button>`; }).join('') +
      (G.order.length < 6 ? `<button class="pcard new" id="btnNewProf"><span class="pav">＋</span><span class="pn">Nieuwe racer</span></button>` : '');
  },
  scrNew() {
    newDraft = { av: AVATARS[ri(0, AVATARS.length - 1)], avc: pickOne(AVCOLS) };
    $('#newName').value = ''; renderNewPick();
  },
  scrMenu() {
    if (!P) return;
    const rs = realSeason(), S0 = SEASONS[rs];
    $('#menuProf').innerHTML = `<span class="pav sm" style="background:${P.avc}">${P.av}</span> ${esc(P.name)}`;
    $('#menuStreak').textContent = streakText();
    $('#menuSeason').innerHTML = `${S0.icon} Het is nu <b>${S0.name.toLowerCase()}</b>! In ${S0.name}-levels krijg je <b>+1 seizoensmunt</b> per goed antwoord.`;
    $('#menuV').textContent = P.vouchers; coinsTxt(); syncMute();
    const n = nextLevel(), lv = LEVELS[n]; $('#btnPlay').innerHTML = `🏁 Rijden! <small>${SEASONS[lv.s].icon} ${WORLDS[lv.w].name} · ${lv.name}</small>`;
  },
  scrMap() { renderMap(); },
  scrGarage() { renderGarage(); },
  scrStickers() { renderStickers(); },
  scrKaart() { renderKaart(); },
  scrDag() { renderRecords(''); },
  scrPlace() { placeIntro(); },
};
let newDraft = {};
function renderNewPick() {
  $('#avPick').innerHTML = AVATARS.map(a => `<button class="${a === newDraft.av ? 'on' : ''}" data-av="${a}">${a}</button>`).join('');
  $('#colPick').innerHTML = AVCOLS.map(c => `<button class="${c === newDraft.avc ? 'on' : ''}" data-avc="${c}" style="background:${c}" aria-label="kleur"></button>`).join('');
  $('#newPreview').innerHTML = `<span class="pav big" style="background:${newDraft.avc}">${newDraft.av}</span>`;
}
function createProfileFromForm() {
  const name = ($('#newName').value || '').trim().slice(0, 14); if (!name) { $('#newName').focus(); $('#newName').classList.add('shake'); setTimeout(() => $('#newName').classList.remove('shake'), 400); return; }
  addProfile(name, newDraft.av, newDraft.avc); P.calm = $('#newCalm').checked; P.words = $('#newWords').checked; P.wordsAsked = 1; save(); show('scrPlace');
}

/* ---------- kaart met seizoenen ---------- */
function renderMap() {
  $('#mapStars').textContent = totalStars(P); $('#mapV').textContent = P.vouchers;
  $('#seasonTabs').innerHTML = SEASONS.map(s => `<button data-season="${s.id}" class="${s.id === mapSeason ? 'on' : ''} ${seasonOpen(s.id) ? '' : 'locked'}" style="--sc:${s.col}">${seasonOpen(s.id) ? s.icon : '🔒'} ${s.name}${P.seasonsDone.includes(s.id) ? ' 💎' : ''}</button>`).join('');
  const S0 = SEASONS[mapSeason], bg = ART.has('map_' + S0.key) ? `url(assets/map_${S0.key}.webp)` : '';
  const box = $('#mapBox'); box.dataset.season = mapSeason; box.style.backgroundImage = bg;
  let h = '';
  for (let wi = 0; wi < 4; wi++) {
    const w = WORLDS[mapSeason * 4 + wi], wo = worldOpen(w.id);
    h += `<section class="wsec ${wo ? '' : 'locked'}"><div class="whead"><span class="wi">${wo ? w.icon : '🔒'}</span><span><b>${w.name}</b><br><small>${w.groep} · ⭐ ${worldStars(w.id)}/27</small></span></div><div class="path">`;
    for (let l = 0; l < LPW; l++) {
      const lv = levelOf(w.id, l), op = isOpen(lv.id), rec = P.lv[lv.id] || {}, st = rec.pl ? 0 : rec.st || 0, nx = lv.id === nextLevel();
      h += `<button class="node ${op ? '' : 'locked'} ${lv.boss ? 'boss' : ''} ${rec.cl ? 'done' : ''} ${rec.pl ? 'placed' : ''} ${nx ? 'next' : ''}" data-level="${lv.id}" aria-label="${w.name} ${lv.name}" style="--i:${l}">
        <span class="nn">${op ? (lv.boss ? '👹' : l + 1) : '🔒'}</span><span class="nst">${rec.pl ? '✓' : [0, 1, 2].map(i => i < st ? '★' : '☆').join('')}</span></button>`;
    }
    h += `</div></section>`;
  }
  if (!seasonOpen(mapSeason)) h = `<div class="card lockmsg">🔒 ${S0.icon} <b>${S0.name}</b> gaat open als je de eindbaas van het vorige seizoen verslaat. Of doe de instaptest bij Ouders.</div>` + h;
  box.innerHTML = h;
}
function openLevel(id) {
  const lv = LEVELS[id], w = WORLDS[lv.w]; if (!isOpen(id)) { SFX.bad(); return; }
  const rec = P.lv[id] || {};
  $('#lvTitle').textContent = `${SEASONS[lv.s].icon} ${w.name} · ${lv.name}`;
  $('#lvSkills').innerHTML = Array.from(new Set(lv.mix.map(m => SK[m[0]].name))).slice(0, 6).map(n => `<span class="chip ok">${esc(n)}</span>`).join('');
  $('#lvInfo').textContent = (rec.pl ? 'Al gehaald via de instaptest. ' : '') + (rec.plays ? `${rec.plays}× gereden · beste: ${rec.best} goed · ` : '') + (lv.boss ? `Eindbaas: haal ${Math.ceil(lv.len * .7)} van de ${lv.len} goed!` : `${lv.len} sommen`);
  const opts = [['none', '🚫 Geen spook']];
  if (rec.ghost) opts.push(['self', '👻 Mijn beste rit']);
  for (const pid of G.order) if (pid !== G.cur && G.profiles[pid].lv[id] && G.profiles[pid].lv[id].ghost) opts.push([pid, `👻 ${G.profiles[pid].av} ${G.profiles[pid].name}`]);
  const def = defaultGhost(id);
  $('#lvGhost').innerHTML = opts.map(([v, t]) => `<button data-ghost="${v}" class="${v === def ? 'on' : ''}">${esc(t)}</button>`).join('');
  $('#lvWords').style.display = w.sk.flat().some(x => WORD_SKILLS.includes(x)) ? '' : 'none'; syncWordsBtn();
  $('#mdLevel').dataset.level = id; $('#mdLevel').classList.add('show');
}
/* ---------- garage ---------- */
const garageCanvases = [];
function renderGarage() {
  coinsTxt(); let h = '';
  for (const s of SEASONS) {
    h += `<h2 class="sect">${s.icon} ${s.name}${seasonOpen(s.id) ? '' : ' 🔒'}</h2><div class="vgrid">`;
    for (const v of VEHICLES.filter(x => x.s === s.id)) {
      const own = P.owned.veh.includes(v.id), sel = P.veh === v.id, canBuy = seasonOpen(s.id) && v.how === 'coins';
      let btn;
      if (sel) btn = `<button class="btn small green" disabled>✅ Gekozen</button>`;
      else if (own) btn = `<button class="btn small" data-veh="${v.id}">Kies</button>`;
      else if (v.how === 'boss') btn = `<div class="small-note">🏆 Versla ${s.bossName}</div>`;
      else if (!canBuy) btn = `<div class="small-note">🔒 Open ${s.name} eerst</div>`;
      else btn = `<button class="btn small yellow" data-buyveh="${v.id}" ${P.coins < v.price ? 'disabled' : ''}>🪙 ${v.price}</button>`;
      h += `<div class="vcard ${sel ? 'sel' : ''} ${own ? '' : 'notown'}"><canvas width="260" height="200" data-prev="${v.id}"></canvas><div class="vn">${v.name}</div>${btn}</div>`;
    }
    h += '</div>';
  }
  $('#vehList').innerHTML = h;
  $('#colList').innerHTML = COLORS.map(c => {
    const own = P.owned.col.includes(c.id), sel = P.col === c.id;
    const bg = c.id === 'regenboog' ? 'conic-gradient(#ff6b6b,#ffd23f,#5fd27d,#4cc3ff,#9b59ff,#ff6b6b)' : c.id === 'goud' ? 'radial-gradient(circle at 30% 30%,#fff3b0,#f5b800 60%,#b98500)' : c.hex;
    const btn = sel ? `<button class="btn small green" disabled>✅</button>` : own ? `<button class="btn small" data-col="${c.id}">Kies</button>` : `<button class="btn small yellow" data-buycol="${c.id}" ${P.coins < c.price ? 'disabled' : ''}>🪙 ${c.price}</button>`;
    return `<div class="ccard ${sel ? 'sel' : ''}"><span class="sw" style="background:${bg}"></span>${c.name}${btn}</div>`;
  }).join('');
  garageCanvases.length = 0; $$('#vehList canvas').forEach(cn => garageCanvases.push(cn)); drawGarage(0);
}
function drawGarage(t) { for (const cn of garageCanvases) { const c = cn.getContext('2d'); c.clearRect(0, 0, cn.width, cn.height); c.fillStyle = '#eef6ff'; rr(c, 10, 150, 240, 40, 20); c.fill(); drawVehicle(c, cn.dataset.prev, colorHex(P.col, t), 130, 172, 190, t, 0, false); } }
function buy(kind, id) {
  const item = (kind === 'veh' ? VEHICLES : COLORS).find(x => x.id === id);
  if (!item || P.owned[kind].includes(id) || P.coins < item.price) return;
  if (kind === 'veh' && (item.how !== 'coins' || !seasonOpen(item.s))) return;
  P.coins -= item.price; P.owned[kind].push(id); P[kind] = id; checkStickers(); save();
  SFX.buy(); vibrate([20, 40, 20]); confetti(); renderGarage();
}
/* ---------- stickers ---------- */
function renderStickers() {
  const n = STICKERS.filter(s => P.stickers[s[0]]).length;
  $('#stkCount').textContent = `${n} van ${STICKERS.length}`;
  $('#stkGrid').innerHTML = STICKERS.map(([id, icon, name, how]) => { const got = P.stickers[id]; return `<div class="stk ${got ? 'got' : ''}"><span class="si">${got ? icon : '❔'}</span><b>${name}</b><small>${got ? 'gehaald ' + got.split('-').reverse().join('-') : how}</small></div>`; }).join('');
}
/* ---------- sterrenkaart ---------- */
function catStats(p) {
  const out = {}; for (const c in CAT) out[c] = { n: 0, c: 0, sum: 0, k: 0, slow: 0 };
  const val = [0.15, 0.3, 0.55, 0.75, 0.92, 1];
  for (const k in p.facts) { const r = p.facts[k], s = SK[r.s]; if (!s) continue; const o = out[s.cat]; o.n += r.n; o.c += r.c; o.k++; o.sum += r.b >= 0 ? val[r.b] : 0; }
  return out;
}
function renderKaart() {
  let h = '<div class="corner">×</div>'; for (let j = 1; j <= 10; j++) h += `<div class="hd">${j}</div>`;
  let greens = 0;
  for (let i = 1; i <= 10; i++) { h += `<div class="hd">${i}</div>`; for (let j = 1; j <= 10; j++) { const k = `mul:${i}:${j}`, lv = mastery(k); if (lv === 3) greens++; h += `<button class="m${lv}" data-cell="${k}" aria-label="${i} keer ${j}">${i * j}</button>`; } }
  $('#tGrid').innerHTML = h; $('#tGreen').textContent = `(${greens} van 100 groen)`; $('#cellInfo').textContent = 'Tik op een vakje!';
  const cs = catStats(P);
  $('#pmBars').innerHTML = Object.keys(CAT).map(c => { const o = cs[c], pct = o.k ? Math.round(Math.min(1, o.sum / Math.max(8, Math.min(o.k, 25))) * 100) : 0;
    const col = !o.k ? '#c7cdd8' : pct < 40 ? '#ff8a8a' : pct < 75 ? '#ffb03b' : '#3ccf6e';
    return `<div class="bar"><div class="bl"><span>${CAT[c]}</span><span>${o.k ? pct + '%' : 'nog niet'}</span></div><div class="bt"><div class="bf" style="width:${Math.max(o.k ? 4 : 0, pct)}%;background:${col}"></div></div></div>`; }).join('');
}
function cellInfo(k) {
  const it = buildItem(k), r = P.facts[k], lv = mastery(k);
  const word = ['nog niet geoefend', 'nog lastig – oefenen maar!', 'bijna!', 'kan ik! 🌟'][lv];
  $('#cellInfo').textContent = `${it.q} = ${it.ans} · ` + (r ? `${r.c} van ${r.n} keer goed · ` : '') + word;
  $$('#tGrid button.hl').forEach(b => b.classList.remove('hl')); const b = $(`#tGrid button[data-cell="${k}"]`); if (b) b.classList.add('hl');
}
/* ---------- ouders ---------- */
function estimate(p) {
  // hoogste wereld die echt beheerst wordt: ≥5 levels gehaald (niet via instaptest) met gem. ≥2 sterren, of ≥80% goed bij ≥15 pogingen
  const acc = {}; for (const k in p.facts) { const r = p.facts[k]; for (const w of WORLDS) if (w.sk.flat().includes(r.s)) { const a = acc[w.id] || (acc[w.id] = { n: 0, c: 0 }); a.n += r.n; a.c += r.c; } }
  let best = -1;
  for (const w of WORLDS) {
    let cl = 0, st = 0; for (let l = 0; l < LPW; l++) { const r = p.lv[w.id * LPW + l]; if (r && r.cl && !r.pl) { cl++; st += r.st; } }
    const a = acc[w.id]; if ((cl >= 5 && st / cl >= 2) || (a && a.n >= 15 && a.c / a.n >= .8)) best = w.id;
  }
  if (best < 0 && p.placed && !p.placed.skipped && p.placed.world > 0) best = p.placed.world - 1; // alleen instaptest
  return best;
}
function renderOuders() {
  $('#oudName').innerHTML = `<span class="pav sm" style="background:${P.avc}">${P.av}</span> ${esc(P.name)}`;
  const e = estimate(P);
  $('#oudEst').innerHTML = e < 0 ? 'Nog te weinig gespeeld voor een schatting. Speel een paar levels (of doe de instaptest).' :
    `<b>Geschat niveau: ${WORLDS[e].groep}</b> (vergelijkbaar met Cito-niveau <b>${WORLDS[e].cito}</b>).<br><small>⚠️ Dit is een <b>schatting</b> op basis van het spel, geen officiële Cito- of LVS-toets.</small>`;
  const cs = catStats(P), strong = [], weak = [];
  for (const c in cs) { const o = cs[c]; if (o.n < 6) continue; const a = o.c / o.n; if (a >= .85 && o.n >= 10) strong.push(`${CAT[c]} (${Math.round(a * 100)}%)`); else if (a < .7) weak.push(`${CAT[c]} (${Math.round(a * 100)}%)`); }
  $('#oudTopics').innerHTML = `<div>💪 <b>Sterk:</b> ${strong.length ? strong.join(', ') : '–'}</div><div>🎯 <b>Oefenen:</b> ${weak.length ? weak.join(', ') : '–'}</div>`;
  const hard = Object.keys(P.facts).filter(k => P.facts[k].b === 0 && P.facts[k].n >= 2).sort((a, b) => P.facts[b].n - P.facts[a].n).slice(0, 8);
  $('#oudHard').innerHTML = hard.length ? hard.map(k => { const it = buildItem(k); return `<span class="chip bad">${esc(it.q.length > 26 ? it.q.slice(0, 24) + '…' : it.q)}</span>`; }).join('') : '<span class="small-note">Geen lastige sommen op dit moment.</span>';
  $$('#segUnlock button').forEach(b => b.classList.toggle('on', (b.dataset.v === '1') === !!P.unlockAll));
  $$('#segPace button').forEach(b => b.classList.toggle('on', b.dataset.v === P.pace));
  $$('#segCalm button').forEach(b => b.classList.toggle('on', (b.dataset.v === '1') === !!P.calm));
  $$('#segWords button').forEach(b => b.classList.toggle('on', (b.dataset.v === '1') === (P.words !== false)));
  $$('#segStory button').forEach(b => b.classList.toggle('on', (b.dataset.v === '1') === (P.showStory !== false)));
  $('#focusChips').innerHTML = range(1, 10).map(n => `<button data-focus="${n}" class="${P.focus.includes(n) ? 'on' : ''}">${n}</button>`).join('');
  const nf = Object.keys(P.facts).length, ng = Object.keys(P.facts).filter(k => P.facts[k].b >= MASTERED).length;
  $('#ouderStats').textContent = `${P.rides} ritten · ${P.days.length} dagen geoefend · ${P.tot.c} van ${P.tot.n} goed · ${nf} verschillende sommen, ${ng} beheerst · ⭐ ${totalStars(P)} · 🪙 ${P.coins}` + (P.placed ? ` · instaptest: start in ${WORLDS[P.placed.world].name}` : '');
  const rb = $('#btnReset'); rb.dataset.armed = ''; rb.textContent = 'Voortgang van dit profiel wissen';
  const db = $('#btnDelProf'); db.dataset.armed = ''; db.textContent = 'Profiel verwijderen';
}
function renderRecords(sfx) {
  const today = dayKey();
  $('#dagToday' + sfx).textContent = P.daily[today] != null ? P.daily[today] : '–';
  $('#dagAll' + sfx).textContent = P.allTime ? P.allTime : '–';
  $('#dagStreak' + sfx).textContent = streakText();
  const set = new Set(P.days), names = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
  let h = ''; const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - 6);
  for (let i = 0; i < 7; i++) { const k = dayKey(d), on = set.has(k); h += `<div class="${on ? 'on' : ''} ${i === 6 ? 'today' : ''}">${i === 6 ? 'vandaag' : names[d.getDay()]}<b>${on ? '✅' : '·'}</b>${P.daily[k] ? '🏆' + P.daily[k] : '&nbsp;'}</div>`; d.setDate(d.getDate() + 1); }
  $('#dagWeek' + sfx).innerHTML = h;
}
function finishDag() {
  R.phase = 'end';
  const today = dayKey(), prevToday = P.daily[today] || 0, prevAll = P.allTime || 0;
  P.daily[today] = Math.max(prevToday, R.score);
  const allRec = R.score > prevAll; if (allRec) { P.allTime = R.score; P.allTimeDate = today; }
  const keys = Object.keys(P.daily).sort(); while (keys.length > 120) delete P.daily[keys.shift()];
  P.dagT = +clamp(R.T * 1.05, DAG_T[1], DAG_T[2]).toFixed(2);
  P.seenHint = (P.seenHint || 0) + 1; markPracticed(); P.rides++;
  const stk = checkStickers(); save();
  $('#dagScore').textContent = R.score;
  $('#dagStats').innerHTML = `<span class="stat">✅ ${R.correct} goed</span><span class="stat">❌ ${R.done - R.correct} fout</span><span class="stat">🔥 Langste reeks: ${R.best}</span><span class="stat gold">🪙 +${R.coins}</span>`;
  let b = '';
  if (allRec && R.score > 0) b += `<div class="banner">🏆 Nieuw record aller tijden! Wauw!</div>`;
  else if (R.score > prevToday && prevToday > 0) b += `<div class="banner">⭐ Nieuw dagrecord! (was ${prevToday})</div>`;
  else if (R.score > prevToday) b += `<div class="banner">⭐ Je dagrecord van vandaag: ${R.score}!</div>`;
  else b += `<div class="banner purple">Nog ${P.daily[today] - R.score + 1} punt(en) meer en je verbreekt je dagrecord! 💪</div>`;
  for (const s of stk) b += `<div class="banner purple">🏷️ Nieuwe sticker: <b>${esc(s)}</b></div>`;
  $('#dagBanners').innerHTML = b;
  $('#dagEndTitle').textContent = allRec && R.score > 0 ? 'Record! 🏆' : 'Tijd! ⏱️';
  renderRecords('2'); show('scrDagEnd'); SFX.fanfare(); if (R.score > prevToday) confetti();
}
/* ---------- groep 1-2: iconen eerst ---------- */
function youngNow() { if (!P) return false; if (R && R.lv) return R.lv.w <= 1; if (lastEnd && curScreen === 'scrEnd') return LEVELS[lastEnd.id].w <= 1; return LEVELS[nextLevel()].w <= 1; }
const YOUNG_ICONS = { btnPlay: '▶️', btnMap: '🗺️', btnDag: '⏱️', btnGarage: '🚗', btnStickers: '🏷️', btnKaart: '⭐', btnStory: '📖', btnNext: '▶️', btnAgain: '🔁', btnResume: '▶️', btnQuit: '🏠', btnStoryNext: '▶️', btnRestSkip: '▶️', btnLvGo: '▶️', btnLvClose: '⬅️', btnPlDone: '▶️', btnEndMap: '🗺️' };
function applyYoung() {
  const y = youngNow(); document.body.classList.toggle('young', y);
  for (const id in YOUNG_ICONS) { const b = document.getElementById(id); if (!b) continue;
    if (b.dataset.yi === '1' && !b.querySelector('.yico')) b.dataset.yi = '';
    if (y) { if (b.dataset.yi !== '1') { b.dataset.orig = b.innerHTML; b.dataset.yi = '1'; if (!b.getAttribute('aria-label')) b.setAttribute('aria-label', b.textContent.trim()); } b.innerHTML = `<span class="yico">${YOUNG_ICONS[id]}</span>`; }
    else if (b.dataset.yi === '1') { b.innerHTML = b.dataset.orig; b.dataset.yi = ''; } }
}
