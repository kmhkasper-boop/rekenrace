/* ===== events, besturing, hoofdlus ===== */
function pauseGame() { if (!R || R.phase === 'end' || !$('#game').classList.contains('on')) return; R.paused = true; syncMute(); syncCalm(); $('#mdPause').classList.add('show'); }
function resumeGame() { if (!R) return; R.paused = false; $('#mdPause').classList.remove('show'); }
function syncCalm() { $('#btnCalm').textContent = P && P.calm ? '🧘 Rustige modus: aan' : '🧘 Rustige modus: uit'; }
function holdButton(el, ms, cb) {
  let t0 = 0, raf = 0; const fill = el.querySelector('.fill');
  const stop = () => { cancelAnimationFrame(raf); t0 = 0; fill.style.width = '0'; };
  el.addEventListener('pointerdown', e => { e.preventDefault(); t0 = performance.now();
    const step = () => { if (!t0) return; const p = (performance.now() - t0) / (ms / SNEL); fill.style.width = Math.min(100, p * 100) + '%'; if (p >= 1) { stop(); cb(); } else raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => el.addEventListener(ev, stop));
  el.addEventListener('contextmenu', e => e.preventDefault());
  el.addEventListener('click', () => { if (!t0 && !$('#mdOuders').classList.contains('show')) toast2('Houd de knop 2 seconden vast'); });
}
function toast2(txt) { const n = $('#menuStreak'); n.textContent = '👪 ' + txt; clearTimeout(toast2.t); toast2.t = setTimeout(() => { n.textContent = streakText(); }, 1600); }
function openOuders() {
  SFX.click(); renderOuders(); const md = $('#mdOuders'); md.classList.add('show');
  md.style.pointerEvents = 'none'; const en = () => { clearTimeout(en.t); en.t = setTimeout(() => { md.style.pointerEvents = ''; }, 400); };
  window.addEventListener('pointerup', en, { once: true }); en.t = setTimeout(() => { md.style.pointerEvents = ''; }, 5000);
}
document.addEventListener('click', e => {
  const t = e.target.closest('button'); if (!t) return;
  if (t.dataset.go) { SFX.click(); show(t.dataset.go); return; }
  if (t.dataset.prof) { SFX.click(); setProfile(t.dataset.prof); show(P.placed ? 'scrMenu' : 'scrPlace'); return; }
  if (t.id === 'btnNewProf') { SFX.click(); show('scrNew'); return; }
  if (t.dataset.av) { newDraft.av = t.dataset.av; SFX.click(); renderNewPick(); return; }
  if (t.dataset.avc) { newDraft.avc = t.dataset.avc; SFX.click(); renderNewPick(); return; }
  if (t.dataset.season != null) { const s = +t.dataset.season; mapSeason = s; SFX.page(); document.body.dataset.season = s; renderMap(); return; }
  if (t.dataset.level != null) { SFX.click(); openLevel(+t.dataset.level); return; }
  if (t.dataset.ghost != null) { $$('#lvGhost button').forEach(b => b.classList.toggle('on', b === t)); return; }
  if (t.dataset.pl != null) { placeAnswer(t.dataset.pl); return; }
  if (t.dataset.veh) { P.veh = t.dataset.veh; save(); SFX.click(); renderGarage(); return; }
  if (t.dataset.col) { P.col = t.dataset.col; save(); SFX.click(); renderGarage(); return; }
  if (t.dataset.buyveh) { buy('veh', t.dataset.buyveh); return; }
  if (t.dataset.buycol) { buy('col', t.dataset.buycol); return; }
  if (t.dataset.cell) { cellInfo(t.dataset.cell); return; }
  if (t.dataset.focus) { const n = +t.dataset.focus; P.focus = P.focus.includes(n) ? P.focus.filter(x => x !== n) : P.focus.concat(n).sort((a, b) => a - b); save(); renderOuders(); return; }
  const pid = t.parentElement && t.parentElement.id;
  if (pid === 'segUnlock') { P.unlockAll = t.dataset.v === '1'; save(); renderOuders(); return; }
  if (pid === 'segPace') { P.pace = t.dataset.v; save(); renderOuders(); return; }
  if (pid === 'segCalm') { P.calm = t.dataset.v === '1'; save(); renderOuders(); return; }
  if (pid === 'segWords') { P.words = t.dataset.v === '1'; P.wordsAsked = 1; save(); renderOuders(); return; }
  if (pid === 'segStory') { P.showStory = t.dataset.v === '1'; save(); renderOuders(); return; }
  if (t.classList.contains('mutebtn') || t.id === 'btnMute2') { G.muted = !G.muted; save(); syncMute(); if (!G.muted) SFX.click(); return; }
});
const on = (id, f) => { $(id).onclick = f; };
on('#btnPlay', () => { SFX.click(); playLevel(nextLevel()); });
on('#btnMap', () => { SFX.click(); mapSeason = LEVELS[nextLevel()].s; show('scrMap'); });
on('#btnDag', () => { SFX.click(); show('scrDag'); });
on('#btnGarage', () => { SFX.click(); show('scrGarage'); });
on('#btnKaart', () => { SFX.click(); show('scrKaart'); });
on('#btnStickers', () => { SFX.click(); show('scrStickers'); });
on('#btnSwitch', () => { SFX.click(); show('scrProfiles'); });
on('#btnStory', () => { SFX.click(); playStory('intro', () => show('scrMenu'), true); });
on('#btnNewGo', createProfileFromForm);
$('#newName').addEventListener('keydown', e => { if (e.key === 'Enter') createProfileFromForm(); });
on('#btnLvGo', () => { const id = +$('#mdLevel').dataset.level, g = ($('#lvGhost button.on') || {}).dataset; $('#mdLevel').classList.remove('show'); SFX.click(); playLevel(id, g ? g.ghost : 'none'); });
on('#btnLvClose', () => $('#mdLevel').classList.remove('show'));
on('#btnDagStart', () => { SFX.click(); startRide('dag'); });
on('#btnDagAgain', () => { SFX.click(); startRide('dag'); });
on('#btnAgain', () => { SFX.click(); if (lastRide) startRide(lastRide.mode, lastRide.levelId, lastRide.ghostPref); });
on('#btnNext', () => { SFX.click(); goNext(); });
on('#btnPause', () => { SFX.click(); pauseGame(); });
on('#btnResume', () => { SFX.click(); resumeGame(); });
on('#btnCalm', () => { P.calm = !P.calm; save(); syncCalm(); $('#game').classList.toggle('calm', P.calm); if (!P.calm) $('#calmGo').classList.remove('show'); });
on('#btnQuit', () => { const m = R && R.mode; SFX.click(); R = null; if (m === 'dag') show('scrDag'); else { if (lastRide && lastRide.levelId != null) mapSeason = LEVELS[lastRide.levelId].s; show('scrMap'); } });
on('#btnVoucher', () => { useVoucher(); });
on('#calmGo', () => { turbo(); });
on('#btnRestSkip', () => { endRest(); });
$('#scrRest').addEventListener('click', e => { if (REST && (REST.type !== 'adem' || REST.t * SNEL >= 3)) endRest(); });
const setWords = v => { P.words = v; P.wordsAsked = 1; save(); };
on('#btnWordsOn', () => { setWords(true); $('#mdWords').classList.remove('show'); const f = wordsThen; wordsThen = null; f && f(); });
on('#btnWordsOff', () => { setWords(false); $('#mdWords').classList.remove('show'); const f = wordsThen; wordsThen = null; f && f(); });
on('#btnStoryNext', () => { SFX.page(); storyNext(); });
on('#btnStorySkip', () => { storyEnd(); });
on('#storyCv', () => { SFX.page(); storyNext(); });
on('#btnPlStart', () => { SFX.click(); placeStart(); });
on('#btnPlSkip', () => { SFX.click(); placeSkip(); });
on('#btnPlDone', () => { SFX.click(); afterPlace(); });
on('#btnOudersClose', () => { $('#mdOuders').classList.remove('show'); if (RENDER[curScreen]) RENDER[curScreen](); });
on('#btnRedoPlace', () => { $('#mdOuders').classList.remove('show'); show('scrPlace'); });
on('#btnReset', e => { const b = e.currentTarget;
  if (!b.dataset.armed) { b.dataset.armed = '1'; b.textContent = '⚠️ Echt alles van dit profiel wissen? Tik nog een keer'; return; }
  const n = newProfile(P.name, P.av, P.avc); n.id = P.id; n.placed = null; G.profiles[P.id] = n; P = n; save(); renderOuders(); b.textContent = '✅ Gewist'; });
on('#btnDelProf', e => { const b = e.currentTarget;
  if (!b.dataset.armed) { b.dataset.armed = '1'; b.textContent = `⚠️ ${P.name} echt verwijderen? Tik nog een keer`; return; }
  deleteProfile(P.id); $('#mdOuders').classList.remove('show'); show(P ? 'scrProfiles' : 'scrNew'); });
holdButton($('#btnParent'), 2000, openOuders);

// --- sturen met vinger/muis/toetsen ---
const gameEl = $('#game'); let ptr = null;
gameEl.addEventListener('pointerdown', e => { if (e.target.closest('button')) return; ptr = { id: e.pointerId, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, t: performance.now(), moves: 0 }; });
gameEl.addEventListener('pointermove', e => {
  if (!ptr || e.pointerId !== ptr.id) return;
  const dx = e.clientX - ptr.x, dy = e.clientY - ptr.y, need = ptr.moves ? 70 : 28;
  if (Math.abs(dx) >= need && Math.abs(dx) > Math.abs(dy) * .8) { move(dx > 0 ? 1 : -1); ptr.moves++; ptr.x = e.clientX; ptr.y = e.clientY; }
  else if (!ptr.turbo && -dy >= 45 && -dy > Math.abs(dx) * 1.2) { turbo(); ptr.turbo = true; ptr.moves++; }
});
function endPtr(e, cancel) { if (!ptr || e.pointerId !== ptr.id) return; const moved = Math.hypot(e.clientX - ptr.x0, e.clientY - ptr.y0);
  if (!cancel && !ptr.moves && moved < 24 && performance.now() - ptr.t < 600) {
    if (R && R.phase === 'run' && $('#tipCard').classList.contains('show') && (!R.row || R.row.resolved)) { $('#tipCard').classList.remove('show'); R.gap = Math.min(R.gap, .15); }
    else if (!tapGate(e.clientX, e.clientY)) move(e.clientX < window.innerWidth / 2 ? -1 : 1); }
  ptr = null; }
gameEl.addEventListener('pointerup', e => endPtr(e, false));
gameEl.addEventListener('pointercancel', e => endPtr(e, true));
gameEl.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key;
  if (curScreen === 'scrStory' && (k === ' ' || k === 'Enter' || k === 'ArrowRight')) { e.preventDefault(); storyNext(); return; }
  if (curScreen === 'scrPlace' && PL && !PL.busy && /^[123]$/.test(k)) { const b = $$('#plOpts button')[+k - 1]; if (b) placeAnswer(b.dataset.pl); return; }
  if (!$('#game').classList.contains('on') || !R) return;
  if (k === 'ArrowLeft' || k === 'a' || k === 'A') { e.preventDefault(); move(-1); }
  else if (k === 'ArrowRight' || k === 'd' || k === 'D') { e.preventDefault(); move(1); }
  else if (k === 'ArrowUp' || k === 'w' || k === 'W') { e.preventDefault(); turbo(); }
  else if (k === 's' || k === 'S') { useVoucher(); }
  else if (k === 'Escape' || k === 'p' || k === 'P') { R.paused ? resumeGame() : pauseGame(); }
  else if ((k === ' ' || k === 'Enter') && R.paused) { e.preventDefault(); resumeGame(); }
});
document.addEventListener('pointerdown', () => ac(), { once: true, capture: true });
document.addEventListener('visibilitychange', () => { if (document.hidden) pauseGame(); });
document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('dblclick', e => e.preventDefault());
window.addEventListener('resize', () => { if ($('#game').classList.contains('on')) layout(); if (R) fitSum(); if (REST) layoutRest(); if (STORYRUN) layoutStory(); });

/* ---------- menu-auto + hoofdlus ---------- */
const menuCv = $('#menuCar'), mctx = menuCv.getContext('2d');
function drawMenuCar(t) {
  const c = mctx, w = menuCv.width, h = menuCv.height; c.clearRect(0, 0, w, h);
  c.fillStyle = 'rgba(93,106,138,.9)'; c.beginPath(); c.moveTo(w * .3, h * .55); c.lineTo(w * .7, h * .55); c.lineTo(w * .98, h); c.lineTo(w * .02, h); c.fill();
  c.fillStyle = '#fff'; for (let i = 0; i < 4; i++) { const p = ((t * 1.4 + i / 4) % 1); const y = h * .55 + p * p * h * .45; c.fillRect(w / 2 - 2 - p * 5, y, 4 + p * 10, 6 + p * 18); }
  drawVehicle(c, P.veh, colorHex(P.col, t), w / 2, h * .95, 250, t, Math.sin(t * 1.5) * .06, true);
}
let last = performance.now();
function frame(now) {
  const dt = Math.min(.05, Math.max(0, (now - last) / 1000)); last = now;
  if ($('#game').classList.contains('on') && R) { if (!R.paused) update(dt); render(); } else TG += dt;
  if (P && curScreen === 'scrMenu' && menuCv.offsetParent !== null) drawMenuCar(TG);
  if (P && curScreen === 'scrGarage' && P.col === 'regenboog') drawGarage(TG);
  if (REST && curScreen === 'scrRest') drawRest(dt);
  if (STORYRUN && curScreen === 'scrStory') drawStory(dt);
  if (curScreen === 'scrPlace') placeTick(dt);
  requestAnimationFrame(frame);
}
show(!G.order.length ? 'scrNew' : !P ? 'scrProfiles' : !P.placed ? 'scrPlace' : 'scrMenu');
requestAnimationFrame(frame);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (R) fitSum(); });

/* ---------- testhaak ---------- */
window.__rr = {
  get G() { return G; }, get P() { return P; }, get R() { return R; }, get PL() { return PL; }, get REST() { return REST; }, get STORYRUN() { return STORYRUN; },
  SK, CAT, WORLDS, LEVELS, SEASONS, VEHICLES, STICKERS, STORY, MAKES, ASSET_FILES, player,
  parseKey, buildItem, makeOptions, pickKey, recordResult, startRide, playLevel, finishLevel, useVoucher, move, turbo, show, openLevel, openOuders,
  placeStart, placeAnswer, placeResult, applyPlacement, estimate, isOpen, nextLevel, setProfile, addProfile, migrateV1, loadG, endRest, storyEnd, storyNext,
  reload() { G = loadG(); P = G.cur ? G.profiles[G.cur] : null; }, get curScreen() { return curScreen; }, qShow, youngItem, tapGate, commit, WORD_SKILLS,
};
