const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), O = '/workspace/rekenrace/screenshots/v25/', errs = [];
  let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : (fail++, console.log('FAIL', m)); };
  const ctx = await b.newContext({ viewport: { width: 360, height: 640 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 }); const p = await ctx.newPage();
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('http://127.0.0.1:8765/?snel=1'); await p.waitForTimeout(500);
  // generatoren binnen bereik
  const g = await p.evaluate(() => { const bad = []; let n = 0;
    for (const op of ['add', 'sub', 'mul', 'div']) for (const max of [10, 20, 100, 1000, 10000, 0]) for (const diff of ['mak', 'nor', 'moe', '']) for (let i = 0; i < 60; i++) {
      const spec = { ops: [op], max, diff, ex: [], taf: [] }, k = __rr.cuGen(op, spec), [m, a, c] = k.split(':'), A = +a, B = +c, it = __rr.buildItem(k); n++;
      const res = m === 'add' ? A + B : m === 'sub' ? A - B : m === 'mul' ? A * B : A / B, lim = max || 1000;
      if (m !== op || !Number.isInteger(res) || res < 0 || String(res) !== String(it.ans).replace(/\./g, '') || ((m === 'add' || m === 'mul') ? res : A) > lim || A <= 0 || B <= 0) bad.push([spec, k, it.ans]); }
    for (const t of [3, 7]) for (let i = 0; i < 50; i++) { const k = __rr.cuGen('mul', { ops: ['mul'], max: 0, diff: '', taf: [t] }); n++; if (+k.split(':')[1] !== t) bad.push(k); }
    for (const e of ['breuk', 'komma', 'pct', 'klok', 'geld']) for (const d of ['mak', 'nor', 'moe']) { const mix = __rr.customMix({ ops: [], max: 0, diff: d, ex: [e], taf: [] }); if (!mix.length) bad.push(e + d); }
    return { n, bad: bad.slice(0, 5), nb: bad.length }; });
  ok(g.nb === 0, 'zelf kiezen: ' + g.n + ' sommen binnen bereik ' + JSON.stringify(g.bad));
  // migratie v2.4 → v2.5
  const mg = await p.evaluate(() => { const LPW = 9, lv = {}; for (let i = 0; i < 40; i++) lv[i] = { st: 1 + i % 3, cl: 1, plays: 1 }; lv[40] = { st: 0, plays: 1 };
    const pr = { name: 'Oud', lv, open: 40, placed: { world: 2 }, story: { intro: 1, w0: 1, w1: 1, w2: 1, w3: 1 }, owned: { veh: ['bliksem'], col: ['geel'] } }; __rr.migrate25(pr);
    const st = o => Object.values(o).reduce((a, r) => a + (r.st || 0), 0);
    return { kl: [144, 152, 153, 161].map(i => pr.lv[i] && pr.lv[i].st), w1: pr.lv[9].st, w3: pr.lv[27].st, w4: pr.lv[36].st, w0pl: pr.lv[0].pl, w2pl: pr.lv[18].pl, open: pr.open, sOld: st(lv), sNew: st(pr.lv), placed: pr.placed.world, story: pr.story }; });
  ok(mg.kl.every(x => x > 0) && mg.w1 === 1 && mg.w3 === 1 && mg.w4 === 1 && mg.w0pl && mg.w2pl && mg.open === 40 && mg.sOld === mg.sNew && mg.placed === 1 && mg.story.w0 && mg.story.w1 && !mg.story.w2, 'migratie zonder verlies ' + JSON.stringify(mg));
  // jonge kleuter-profiel: alleen kleuter-voortgang
  const mk = await p.evaluate(() => { const pr = { lv: { 0: { st: 2, cl: 1 }, 1: { st: 1, cl: 1 } }, open: 2, placed: { world: 0, skipped: 1 }, story: {}, owned: { veh: ['bliksem'], col: ['geel'] } }; __rr.migrate25(pr); return [pr.kleuter, pr.lv[144].st, pr.open, !!pr.lv[0]]; });
  ok(mk[0] === true && mk[1] === 2 && mk[2] === 0 && !mk[3], 'migratie: kleuter-profiel ' + JSON.stringify(mk));
  // modi gescheiden
  const ms = await p.evaluate(() => { __rr.addProfile('Sam', '🐼', '#ff6b6b'); const P = __rr.P; P.placed = { world: 0, skipped: 1 }; P.story.intro = 1; for (let i = 0; i < 16; i++) P.story['w' + i] = 1;
    return { lv: __rr.LEVELS.length, w0: __rr.WORLDS[0].groep, next: __rr.nextLevel(), kl: __rr.nextKleuter(), main: __rr.LEVELS.slice(0, 144).every(l => !__rr.isKl(l)), klOpen: [144, 145].map(i => __rr.isOpen ? 0 : 0) }; });
  ok(ms.lv === 162 && /groep 3/.test(ms.w0) && ms.next === 0 && ms.kl === 144 && ms.main, 'modi: hoofdroute start bij groep 3, kleuters apart ' + JSON.stringify(ms));
  await p.evaluate(() => __rr.show('scrMenu')); await p.waitForTimeout(600); await p.screenshot({ path: O + 'menu_360.png' });
  ok(await p.evaluate(() => !!document.querySelector('#btnKleuter') && !!document.querySelector('#btnCustom') && !document.body.classList.contains('young')), 'menu: knoppen Kleuters + Zelf kiezen');
  // kleuter
  await p.click('#btnKleuter'); await p.waitForTimeout(400); await p.screenshot({ path: O + 'kleuter_kaart.png' });
  ok(await p.evaluate(() => document.body.classList.contains('young') && document.querySelectorAll('.klbtn').length === 18), 'kleuters: 18 levels, plaatjes-modus');
  await p.click('[data-kl="144"]'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => __rr.R && __rr.R.young && __rr.R.tutor && __rr.R.lv.id === 144 && __rr.curScreen === 'game'), 'kleuters: rit met hand-uitleg');
  await p.evaluate(() => __rr.endRest && 0); await p.waitForTimeout(3500);
  // stippen in rijtjes: zoek een rij met stippen
  for (let i = 0; i < 30; i++) { const d = await p.evaluate(() => __rr.R.row && __rr.R.row.dots && !__rr.R.row.resolved && __rr.R.row.z < 14); if (d) break; await p.waitForTimeout(300); }
  await p.screenshot({ path: O + 'kleuter_poorten_360.png' });
  const lay = await p.evaluate(() => [1, 3, 4, 5, 6, 7, 8, 9, 10].map(n => countRows(n).join('+'))); ok(lay.join(' ') === '1 3 4 3+2 3+3 3+4 3+3+2 3+3+3 3+3+4', 'tel-rijtjes ' + lay.join(' '));
  // fout-feedback met stippen
  await p.evaluate(() => { const r = __rr.R.row; if (r && !r.resolved) { const wrong = [0, 1, 2].find(i => i !== r.cl); __rr.R.row.chosen = wrong; } });
  await p.evaluate(() => { __rr.R = null; __rr.show('scrMenu'); });
  // tip kaart direct testen
  await p.evaluate(() => { __rr.startRide('level', 145); }); await p.waitForTimeout(3800);
  for (let i = 0; i < 40; i++) { const st = await p.evaluate(() => { const r = __rr.R.row; if (r && !r.resolved && r.z < 16) { const w = [0, 1, 2].find(i => i !== r.cl); __rr.move(w - __rr.player.lane); __rr.commit(r); return 1; } return 0; }); if (st) break; await p.waitForTimeout(250); }
  await p.waitForTimeout(900); await p.screenshot({ path: O + 'kleuter_fout_tip.png' });
  ok(await p.evaluate(() => !!document.querySelector('#tipSum .cdots') || !__rr.R.results.some(r => !r.ok)), 'fout-feedback: stippen in rijtjes');
  await p.evaluate(() => { __rr.R = null; __rr.show('scrMenu'); });
  // zelf kiezen
  await p.click('#btnCustom'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => JSON.stringify(__rr.P.custom) === JSON.stringify({ ops: ['add', 'sub'], max: 20, diff: '', ex: [], taf: [] })), 'zelf kiezen: standaard');
  await p.click('[data-cu="ops"][data-v="mul"]'); await p.click('[data-cu="max"][data-v="100"]'); await p.click('[data-cu="diff"][data-v="moe"]'); await p.click('#cuMore summary'); await p.click('[data-cu="taf"][data-v="7"]');
  await p.waitForTimeout(200); await p.screenshot({ path: O + 'zelf_kiezen_360.png' });
  const cs = await p.evaluate(() => __rr.P.custom); ok(cs.ops.join() === 'add,sub,mul' && cs.max === 100 && cs.diff === 'moe' && cs.taf.join() === '7', 'zelf kiezen: opgeslagen ' + JSON.stringify(cs));
  const before = await p.evaluate(() => ({ open: __rr.P.open, lv: Object.keys(__rr.P.lv).length, story: JSON.stringify(__rr.P.story) }));
  await p.click('#btnCuGo'); await p.waitForTimeout(4200); await p.screenshot({ path: O + 'zelf_rit_360.png' });
  ok(await p.evaluate(() => __rr.R.mode === 'custom' && __rr.R.total === 15 && __rr.R.mix.every(m => /^cu_/.test(m[0]))), 'zelf kiezen: rit 15 sommen');
  // speel rit uit
  for (let i = 0; i < 200; i++) { const f = await p.evaluate(() => { if (__rr.curScreen !== 'game') return 1; const r = __rr.R.row; if (r && !r.resolved && !r.committed) { __rr.move(r.cl - __rr.player.lane); __rr.commit(r); } return 0; }); if (f) break; await p.waitForTimeout(150); }
  await p.waitForTimeout(500); await p.screenshot({ path: O + 'zelf_einde.png' });
  const after = await p.evaluate(() => ({ open: __rr.P.open, lv: Object.keys(__rr.P.lv).length, story: JSON.stringify(__rr.P.story), scr: __rr.curScreen, coins: __rr.R.coins, n: __rr.R.done }));
  ok(after.scr === 'scrEnd' && after.open === before.open && after.lv === before.lv && after.story === before.story && after.coins > 0 && after.coins <= after.n * 2, 'zelf kiezen: geen voortgang/verhaal, minder munten ' + JSON.stringify(after));
  // instaptest: kleuter-keuze
  await p.evaluate(() => { __rr.addProfile('Kim', '🦊', '#ff6b6b'); __rr.show('scrPlace'); }); await p.waitForTimeout(300); await p.screenshot({ path: O + 'instap_keuze.png' });
  await p.click('#btnPlKleuter'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => __rr.curScreen === 'scrKleuter' && __rr.P.kleuter && __rr.P.placed), 'instaptest: kleuter-keuze');
  await p.evaluate(() => { __rr.addProfile('Lex', '🦊', '#ff6b6b'); __rr.show('scrPlace'); __rr.placeStart(); __rr.PL.w = 0; }); 
  await p.evaluate(() => { __rr.PL.i = 0; }); await p.evaluate(() => { const PL = __rr.PL; PL.w = 0; }); 
  await p.evaluate(() => { document.querySelector('#plOpts').innerHTML = ''; }); await p.evaluate(() => { __rr.placeAnswer('__x__'); }); await p.waitForTimeout(1200);
  for (let i = 0; i < 8; i++) { const d = await p.evaluate(() => !!document.querySelector('#plOpts .cdots')); if (d) break; await p.evaluate(() => __rr.placeAnswer('__x__')); await p.waitForTimeout(1000); }
  await p.screenshot({ path: O + 'instap_laag.png' });
  console.log(pass + ' geslaagd, ' + fail + ' mislukt'); console.log(errs.join('\n') || 'geen JS-fouten'); await b.close();
})();
