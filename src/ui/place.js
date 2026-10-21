/* ===== instaptest: 12 adaptieve vragen (~2 min) ===== */
const PL_STEPS = [3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1], PL_N = 12, PL_CAP = 20;
let PL = null;
function placeIntro() {
  PL = null; $('#plIntro').style.display = ''; $('#plRun').style.display = 'none'; $('#plDone').style.display = 'none';
  $('#plName').textContent = P ? P.name : '';
}
function placeStart() {
  PL = { i: 0, w: 4, res: {}, t: 0, it: null, busy: false, log: [] };
  $('#plIntro').style.display = 'none'; $('#plRun').style.display = ''; placeQ();
}
function placeQ() {
  const w = WORLDS[PL.w], sks = w.sk.flat(), s = pickOne(sks), k = SK[s].gen(), young = PL.w <= 1, it = young ? youngItem(buildItem(k)) : buildItem(k);
  PL.it = it; PL.s = s; PL.t = 0; PL.busy = false;
  $('#plProg').style.width = (PL.i / PL_N * 100) + '%';
  $('#plCount').textContent = `Vraag ${PL.i + 1} van ${PL_N}`;
  const qq = qShow(it, young); $('#plQ').textContent = qq; $('#plQ').style.display = qq ? '' : 'none'; $('#plQ').classList.toggle('long', qq.length > 22);
  const vc = $('#plVis'); if (it.vis) { vc.style.display = ''; drawVisInto(vc, it.vis); } else vc.style.display = 'none';
  $('#plOpts').innerHTML = makeOptions(it).map(o => `<button class="btn plopt" data-pl="${esc(o)}">${young && it.dotGates && +o <= 10 ? `<span class="pldots">${'●'.repeat(+o)}</span>` : esc(o)}</button>`).join('');
}
function drawVisInto(cn, v) { const d = Math.min(2, devicePixelRatio || 1), r = cn.getBoundingClientRect(); cn.width = Math.max(10, r.width * d); cn.height = Math.max(10, r.height * d); const c = cn.getContext('2d'); c.clearRect(0, 0, cn.width, cn.height); drawVis(c, v, cn.width, cn.height); }
function placeAnswer(val) {
  if (!PL || PL.busy) return; PL.busy = true;
  const ok = val === PL.it.ans, r = PL.res[PL.w] || (PL.res[PL.w] = { c: 0, f: 0 });
  ok ? r.c++ : r.f++; PL.log.push([PL.w, ok]);
  ok ? SFX.good() : SFX.bad();
  $$('#plOpts button').forEach(b => { if (b.dataset.pl === PL.it.ans) b.classList.add('right'); else if (b.dataset.pl === val) b.classList.add('wrong'); });
  const st = PL_STEPS[PL.i] || 1; PL.w = clamp(PL.w + (ok ? st : -st), 0, WORLDS.length - 1);
  PL.i++;
  setTimeout(() => PL && (PL.i >= PL_N ? placeFinish() : placeQ()), ok ? 450 / SNEL : 900 / SNEL);
}
function placeResult(res) {
  let h = -1; for (const w in res) { const r = res[w]; if (r.c >= 1 && r.c >= r.f && +w > h) h = +w; }
  return Math.max(0, h);
}
function applyPlacement(start) {
  // werelden onder start: gehaald via instaptest (1 ster, pl); nooit voortgang weghalen
  for (let w = 0; w < start; w++) for (let l = 0; l < LPW; l++) { const id = w * LPW + l; if (!P.lv[id] || !P.lv[id].cl) P.lv[id] = Object.assign(P.lv[id] || { plays: 0, best: 0 }, { st: 1, cl: 1, pl: 1 }); }
  P.open = Math.max(P.open, start * LPW);
  P.placed = { world: start, date: dayKey() }; save();
}
function placeFinish() {
  const start = placeResult(PL.res); applyPlacement(start); PL.done = start;
  $('#plRun').style.display = 'none'; $('#plDone').style.display = '';
  const w = WORLDS[start];
  $('#plResult').innerHTML = `Jij start in <b>${SEASONS[w.s].icon} ${w.name}</b><br><small>(${w.groep})</small>`;
  SFX.fanfare(); confetti();
}
function placeSkip() { if (!P.placed) P.placed = { world: 0, date: dayKey(), skipped: 1 }; save(); afterPlace(); }
function afterPlace() { if (!P.story.intro) playStory('intro', () => show('scrMenu')); else show('scrMenu'); }
function placeTick(dt) {
  if (!PL || PL.busy || PL.i >= PL_N || curScreen !== 'scrPlace' || $('#plRun').style.display === 'none') return;
  PL.t += dt * SNEL; $('#plTime').style.width = Math.max(0, 100 - PL.t / PL_CAP * 100) + '%';
  if (PL.t >= PL_CAP) placeAnswer('__tijd__');
}
