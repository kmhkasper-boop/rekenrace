// Rekenrace v2 – end-to-end tests (playwright-core + Chrome). Gebruik: node v2.test.js [url]
const { chromium } = require('playwright-core');
const URL0 = process.argv[2] || 'http://localhost:8765/';
const SHOTS = '/workspace/rekenrace/screenshots/v2/';
let pass = 0, fail = 0; const fails = [];
const ok = (c, m) => { if (c) pass++; else { fail++; fails.push(m); console.log('  ✗', m); } };
const LAYOUTS = [[360, 640], [375, 667], [390, 844], [1280, 800]];
(async () => {
  require('fs').mkdirSync(SHOTS, { recursive: true });
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ext = [], errs = [];
  async function page(vp, url = URL0 + '?snel=8', init) {
    const ctx = await b.newContext({ viewport: { width: vp[0], height: vp[1] }, hasTouch: vp[0] < 800, deviceScaleFactor: 2 });
    const pg = await ctx.newPage();
    pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    pg.on('request', r => { const u = r.url(); if (!u.startsWith(URL0.replace(/\/[^/]*$/, '')) && !u.startsWith('data:')) ext.push(u); });
    if (init) await pg.addInitScript(init);
    await pg.goto(url); await pg.waitForFunction(() => window.__rr); return pg;
  }
  const shot = async (pg, name) => { await pg.waitForTimeout(450); await pg.evaluate(() => document.querySelectorAll('.confetti').forEach(e => e.remove())); await pg.screenshot({ path: SHOTS + name }); };
  const quickProfile = (pg, name = 'Testje') => pg.evaluate(n => { __rr.addProfile(n, '🦊', '#4cc3ff'); __rr.P.placed = { world: 0, skipped: 1 }; __rr.P.story.intro = 1; for (let i = 0; i < 16; i++) __rr.P.story['w' + i] = 1; show('scrMenu'); }, name);
  async function drive(pg, right = 1) { // stuur naar goede (of foute) baan tot einde
    for (let i = 0; i < 1500; i++) {
      const st = await pg.evaluate(right => { const R = __rr.R; if (!R) return 'none'; if (R.row && !R.row.resolved) { const c = R.row.opts.indexOf(R.row.it.ans); const want = right ? c : (c + 1) % 3; const d = want - __rr.player.lane; if (d) move(Math.sign(d)); else turbo(); } return R.phase; }, right);
      if (st === 'end' || st === 'none') return; await pg.waitForTimeout(40);
    }
  }

  /* 1. generatoren: antwoord klopt (onafhankelijke controle), 3 verschillende opties, bereik per vaardigheid */
  console.log('▶ generatoren');
  { const pg = await page([390, 844]);
    const r = await pg.evaluate(() => {
      const num = s => { s = String(s).replace(/€\s?/g, '').trim(); if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, ''); return parseFloat(s.replace(',', '.')); };
      const bad = [], range = [], n = {}; const CAP = { tel5: 5, tel10: 10, tel20: 20, na10: 10, na20: 20, meer10: 10, splits5: 5, splits10: 10, plus5: 5, plus10: 10, min10: 10, dubbel: 20, plus20: 20, min20: 20, plus20x: 20, min20x: 20, plus100e: 100, min100e: 100, plus100x: 100, min100x: 100, tienerbij: 100, tien: 100, plus100: 100, min100: 100, duizend: 1000, plus1000: 1000, min1000: 1000, meer100: 100, deelA: 100, deelB: 100, deelC: 100, deelAll: 100 };
      for (const s in __rr.SK) for (let i = 0; i < 300; i++) {
        const k = __rr.SK[s].gen(), it = __rr.buildItem(k), o = __rr.makeOptions(it), q = it.q;
        if (o.length !== 3 || new Set(o).size !== 3 || !o.includes(it.ans) || o.some(x => /NaN|undefined|\?/.test(x))) bad.push(s + ': opties ' + q + ' ' + o);
        let m, exp = null;
        if ((m = q.match(/^(€ )?([\d.,]+) ([+−×:]) (€ )?([\d.,]+)$/)) && !/rest/.test(it.ans)) { const a = num(m[2]), c = num(m[5]); exp = { '+': a + c, '−': a - c, '×': a * c, ':': a / c }[m[3]]; }
        else if ((m = q.match(/^(\d+)% van ([\d.]+)$/))) exp = num(m[1]) * num(m[2]) / 100;
        else if ((m = q.match(/^(\d+)\/(\d+) van ([\d.]+)$/))) exp = num(m[1]) * num(m[3]) / num(m[2]);
        else if ((m = q.match(/^(De helft|Een kwart|Een derde) van ([\d.]+)$/))) exp = num(m[2]) / { 'De helft': 2, 'Een kwart': 4, 'Een derde': 3 }[m[1]];
        else if ((m = q.match(/^([\d.,]+) = ([\d.,]+) \+ \?$/))) exp = num(m[1]) - num(m[2]);
        else if ((m = q.match(/^Welk getal komt (na|vóór) (\d+)\?$/))) exp = +m[2] + (m[1] === 'na' ? 1 : -1);
        else if ((m = q.match(/^(\d+) : (\d+)$/)) && /rest/.test(it.ans)) { const a = +m[1], c = +m[2]; exp = null; if (it.ans !== `${Math.floor(a / c)} rest ${a % c}`) bad.push(s + ': ' + q + ' => ' + it.ans); }
        else if ((m = q.match(/^gemiddelde/i)) || (m = q.match(/gemiddelde van ([\d, en]+)\?$/))) { const xs = m[1].split(/, | en /).map(Number); exp = xs.reduce((a, c) => a + c, 0) / xs.length; }
        else if ((m = q.match(/^([\d.]+) ([+−]) ([\d.]+) ([×:]) ([\d.]+)$/))) { const a = num(m[1]), x = num(m[3]), y = num(m[5]), p = m[4] === '×' ? x * y : x / y; exp = m[2] === '+' ? a + p : a - p; }
        else if ((m = q.match(/^Het kost € ([\d,]+)\. Je betaalt € ([\d,]+)\./))) exp = num(m[2]) - num(m[1]);
        if (exp != null) { n[s] = (n[s] || 0) + 1; const got = num(it.ans); if (Math.abs(got - exp) > 1e-9) bad.push(`${s}: ${q} => ${it.ans} (verwacht ${exp})`); }
        if (CAP[s] != null) { const nums = (q + ' ' + it.ans).match(/\d[\d.]*/g) || [it.a]; const mx = Math.max(...nums.map(num), it.a || 0); if (mx > CAP[s]) range.push(`${s}: ${q}=${it.ans} > ${CAP[s]}`); }
        if (/^taf(A|B|C)$/.test(s)) { const [, a, c] = q.match(/(\d+) × (\d+)/).map(Number); const set = { tafA: [1, 2, 5, 10], tafB: [3, 4], tafC: [6, 7, 8, 9] }[s]; if (!set.includes(a) && !set.includes(c)) range.push(`${s}: ${q}`); }
        if (it.ans < 0 || /^−|^-/.test(it.ans)) range.push(`${s}: negatief ${q}`);
      }
      // 144 levels, mix verwijst naar bestaande vaardigheden, boss op elke 9e
      const lv = __rr.LEVELS; const lvOk = lv.length === 144 && lv.every((l, i) => l.mix.every(m => __rr.SK[m[0]]) && l.boss === (i % 9 === 8));
      return { bad: bad.slice(0, 15), nbad: bad.length, range: range.slice(0, 10), nrange: range.length, checked: Object.values(n).reduce((a, c) => a + c, 0), skills: Object.keys(n).length, lvOk };
    });
    console.log(`  ${r.checked} antwoorden onafhankelijk nagerekend over ${r.skills} vaardigheden`);
    ok(r.nbad === 0, 'generator fouten: ' + r.bad.join(' | ')); ok(r.nrange === 0, 'bereik: ' + r.range.join(' | ')); ok(r.checked > 8000, 'te weinig nagerekend'); ok(r.lvOk, '144 levels/boss-structuur');
    // moeilijkheid loopt op: gemiddelde T per wereld daalt niet en getallen worden groter
    const ramp = await pg.evaluate(() => __rr.WORLDS.map(w => { let mx = 0; for (let i = 0; i < 200; i++) { const s = w.sk.flat()[i % w.sk.flat().length], it = __rr.buildItem(__rr.SK[s].gen()); const ns = (it.q + ' ' + it.ans).replace(/(\d)\.(\d{3})/g, '$1$2').match(/\d+/g) || [0]; mx = Math.max(mx, ...ns.map(Number)); } return mx; }));
    ok(ramp[0] <= 10 && ramp[1] <= 10 && ramp[4] <= 100 && ramp[13] >= 1000, 'moeilijkheidsopbouw ' + ramp);
    await pg.context().close(); }

  /* 2. nieuw profiel + instaptest */
  console.log('▶ profiel + instaptest');
  { const pg = await page([390, 844]);
    ok(await pg.evaluate(() => __rr.curScreen) === 'scrNew', 'start op nieuw-profiel');
    await pg.fill('#newName', 'Mila'); await pg.click('#avPick button:nth-child(3)'); await pg.click('#btnNewGo');
    ok(await pg.evaluate(() => __rr.curScreen) === 'scrPlace', 'naar instaptest');
    await shot(pg, 'instaptest_intro.png');
    await pg.click('#btnPlStart');
    // simuleer: kan alles t/m wereld 6, daarboven fout
    let shot1 = false; const seen = [];
    for (let i = 0; i < 12; i++) {
      await pg.waitForFunction(() => __rr.PL && !__rr.PL.busy && document.querySelector('#plOpts button'));
      if (i === 3 && !shot1) { await shot(pg, 'instaptest_vraag.png'); shot1 = true; }
      const w = await pg.evaluate(() => { const PL = __rr.PL; const right = PL.w <= 6; const b = [...document.querySelectorAll('#plOpts button')].find(x => right ? x.dataset.pl === PL.it.ans : x.dataset.pl !== PL.it.ans); b.click(); return PL.log[PL.log.length - 1][0]; });
      seen.push(w);
    }
    await pg.waitForSelector('#plDone', { state: 'visible' });
    const placed = await pg.evaluate(() => __rr.P.placed.world);
    ok(placed === 6, 'instaptest plaatst in wereld 6 (kreeg ' + placed + ', pad ' + seen + ')');
    ok(await pg.evaluate(() => __rr.isOpen(54) && !__rr.isOpen(56) && __rr.P.lv[53].pl === 1 && !__rr.P.lv[54]), 'levels onder start gemarkeerd, rest dicht');
    await shot(pg, 'instaptest_resultaat.png');
    // time cap
    const capOk = await pg.evaluate(() => { __rr.placeStart(); __rr.PL.t = 19.99; return true; });
    await pg.waitForFunction(() => __rr.PL.log.length === 1, null, { timeout: 5000 }); ok(capOk && await pg.evaluate(() => __rr.PL.log[0][1] === false), 'tijdslimiet telt als fout');
    // opnieuw doen haalt niets weg
    const rd = await pg.evaluate(() => { const before = Object.keys(__rr.P.lv).length; __rr.applyPlacement(0); return [before, Object.keys(__rr.P.lv).length, __rr.isOpen(54)]; });
    ok(rd[0] === rd[1] && rd[2], 'opnieuw instaptest haalt geen voortgang weg');
    // overslaan → Lente L1
    await pg.evaluate(() => { __rr.addProfile('Ozzy', '🐼', '#ff6b6b'); show('scrPlace'); }); await pg.click('#btnPlSkip');
    ok(await pg.evaluate(() => __rr.nextLevel() === 0 && __rr.P.placed && __rr.P.placed.skipped), 'overslaan → Lente L1');
    ok(await pg.evaluate(() => __rr.curScreen) === 'scrStory', 'intro-verhaal na overslaan');
    await shot(pg, 'verhaal_intro.png');
    await pg.click('#btnStoryNext'); await pg.waitForTimeout(250); await shot(pg, 'verhaal_intro_2.png');
    // placement-resultaatfunctie
    const pr = await pg.evaluate(() => [__rr.placeResult({ 4: { c: 0, f: 1 }, 1: { c: 1, f: 0 }, 2: { c: 1, f: 1 }, 3: { c: 0, f: 1 } }), __rr.placeResult({ 4: { c: 0, f: 1 }, 1: { c: 0, f: 1 } }), __rr.placeResult({ 15: { c: 2, f: 0 } })]);
    ok(pr.join() === '2,0,15', 'placeResult ' + pr);
    await pg.context().close(); }

  /* 3. voortgang, sterren, ontgrendelen, bonnen, spook */
  console.log('▶ voortgang + bon + spook');
  { const pg = await page([390, 844]); await quickProfile(pg);
    ok(await pg.evaluate(() => !__rr.isOpen(1)), 'L2 dicht bij start');
    await pg.evaluate(() => __rr.startRide('level', 0, 'none')); await drive(pg, 1); await pg.waitForFunction(() => __rr.curScreen === 'scrEnd');
    ok(await pg.evaluate(() => __rr.P.lv[0].st === 3 && __rr.isOpen(1) && !__rr.isOpen(2)), '3 sterren + L2 open');
    ok(await pg.evaluate(() => !!__rr.P.lv[0].ghost && __rr.P.lv[0].ghost.c > 0), 'beste rit bewaard als spook');
    // fout rijden → 0 sterren geen unlock
    await pg.evaluate(() => __rr.startRide('level', 1, 'none')); await drive(pg, 0); await pg.waitForFunction(() => __rr.curScreen === 'scrEnd');
    ok(await pg.evaluate(() => !__rr.P.lv[1].cl && !__rr.isOpen(2)), 'alles fout → niet gehaald');
    // bon: na 3 clears +1 (start 1)
    await pg.evaluate(() => { __rr.startRide('level', 1, 'none'); }); await drive(pg, 1); await pg.waitForFunction(() => __rr.curScreen === 'scrEnd');
    await pg.evaluate(() => { __rr.startRide('level', 2, 'self'); }); await drive(pg, 1); await pg.waitForFunction(() => __rr.curScreen === 'scrEnd');
    ok(await pg.evaluate(() => __rr.P.clears === 3 && __rr.P.vouchers === 2), 'bon na 3 levels (' + await pg.evaluate(() => __rr.P.clears + '/' + __rr.P.vouchers) + ')');
    // bon gebruiken in rit: som komt terug, telt niet als fout
    await pg.evaluate(() => __rr.startRide('level', 3, 'none'));
    await pg.waitForFunction(() => __rr.R && __rr.R.phase === 'run' && __rr.R.row && !__rr.R.row.resolved);
    await shot(pg, 'race_bon_knop.png');
    const sk = await pg.evaluate(() => { const k = __rr.R.row.it.k; document.querySelector('#btnVoucher').click(); return { k, v: __rr.P.vouchers, sk: __rr.R.skips }; });
    ok(sk.v === 1 && sk.sk === 1, 'bon verbruikt');
    let back = false; for (let i = 0; i < 600 && !back; i++) { back = await pg.evaluate(k => { const R = __rr.R; if (!R) return false; if (R.row && !R.row.resolved) { if (R.row.it.k === k) return true; const c = R.row.opts.indexOf(R.row.it.ans), d = c - __rr.player.lane; if (d) move(Math.sign(d)); else turbo(); } return false; }, sk.k); if (!back) await pg.waitForTimeout(40); }
    ok(back, 'overgeslagen som komt terug');
    await drive(pg, 1); await pg.waitForFunction(() => __rr.curScreen === 'scrEnd');
    ok(await pg.evaluate(() => __rr.P.lv[3].st === 3), 'overslaan telt niet als fout');
    // max 3 bonnen
    ok(await pg.evaluate(() => { __rr.P.vouchers = 3; __rr.P.clears = 5; __rr.startRide('level', 4, 'none'); return true; }));
    await drive(pg, 1); await pg.waitForFunction(() => __rr.curScreen === 'scrEnd'); ok(await pg.evaluate(() => __rr.P.vouchers === 3), 'max 3 bonnen');
    // spook tegen andere profiel
    const ghostOpt = await pg.evaluate(() => { const me = __rr.G.cur; __rr.addProfile('Broer', '🐯', '#5fd27d'); __rr.P.placed = { world: 0 }; __rr.P.story.intro = 1; __rr.P.story.w0 = 1; show('scrMap'); __rr.openLevel(0); const o = [...document.querySelectorAll('#lvGhost button')].map(b => b.dataset.ghost); return { o, me }; });
    ok(ghostOpt.o.includes(ghostOpt.me), 'spook van ander profiel kiesbaar');
    await shot(pg, 'level_spookkeuze.png');
    await pg.evaluate(me => { document.querySelector(`#lvGhost button[data-ghost="${me}"]`).click(); document.querySelector('#btnLvGo').click(); }, ghostOpt.me);
    await pg.waitForFunction(() => __rr.R && __rr.R.ghost); ok(await pg.evaluate(() => !!__rr.R.ghost && !__rr.R.ghost.self), 'spookrace tegen ander profiel');
    await drive(pg, 1); await pg.waitForFunction(() => __rr.curScreen === 'scrEnd');
    // rustmoment + ademhalingspauze elke 3e
    const rests = []; for (let i = 0; i < 3; i++) { await pg.evaluate(() => goNext()); await pg.waitForFunction(() => __rr.REST); rests.push(await pg.evaluate(() => __rr.REST.type)); if (i === 0) await shot(pg, 'rustmoment.png'); if (rests[i] === 'adem') { await pg.waitForTimeout(800); await shot(pg, 'adempauze.png'); } await pg.evaluate(() => __rr.endRest()); await pg.waitForTimeout(100); while (await pg.evaluate(() => __rr.curScreen) === 'scrStory') await pg.evaluate(() => __rr.storyEnd()); await pg.evaluate(() => { if (__rr.R) { __rr.R.phase = 'end'; } show('scrMenu'); }); }
    ok(rests.filter(x => x === 'adem').length === 1, 'ademhalingspauze 1 op 3: ' + rests);
    const restDur = await pg.evaluate(() => { let d = []; for (let i = 0; i < 2; i++) { runRest(() => { }); d.push(__rr.REST.dur * 8); __rr.endRest(); } return d; });
    ok(restDur.every(d => d >= 5 && d <= 10), 'rustmoment duur ' + restDur);
    // rustige modus: poort wacht
    await pg.evaluate(() => { __rr.P.calm = true; __rr.startRide('level', 0, 'none'); });
    await pg.waitForFunction(() => document.querySelector('#calmGo').classList.contains('show'), null, { timeout: 15000 });
    const z1 = await pg.evaluate(() => __rr.R.row.z); await pg.waitForTimeout(600); const z2 = await pg.evaluate(() => [__rr.R.row.z, __rr.R.row.resolved]);
    ok(Math.abs(z1 - z2[0]) < 1e-6 && !z2[1], 'rustige modus: poort wacht');
    await pg.click('#calmGo'); await pg.waitForFunction(() => __rr.R.row.resolved || __rr.R.results.length > 0); ok(true);
    await pg.evaluate(() => { __rr.P.calm = false; __rr.R.phase = 'end'; show('scrMenu'); });
    // combo turbo na 5 goed
    await pg.evaluate(() => __rr.startRide('level', 2, 'none'));
    let combo = false; for (let i = 0; i < 600 && !combo; i++) { combo = await pg.evaluate(() => { const R = __rr.R; if (comboT > 0) return true; if (R.row && !R.row.resolved) { const c = R.row.opts.indexOf(R.row.it.ans), d = c - __rr.player.lane; if (d) move(Math.sign(d)); else turbo(); } return false; }); await pg.waitForTimeout(40); }
    ok(combo, 'combo-turbo na 5 goed'); await pg.evaluate(() => { __rr.R.phase = 'end'; show('scrMenu'); });
    // seizoensbaas → voertuig + volgend seizoen
    await pg.evaluate(() => { for (let i = 0; i < 35; i++) __rr.P.lv[i] = { st: 2, cl: 1, plays: 1, best: 1 }; __rr.P.open = 35; __rr.P.story.b0 = 0; __rr.startRide('level', 35, 'none'); });
    await drive(pg, 1); await pg.waitForFunction(() => __rr.curScreen === 'scrEnd');
    ok(await pg.evaluate(() => __rr.P.owned.veh.includes('bij') && __rr.isOpen(36) && __rr.P.seasonsDone.includes(0)), 'Kikkerkoning verslagen → Bij + Zomer open');
    await pg.evaluate(() => goNext()); await pg.waitForFunction(() => __rr.REST); await pg.evaluate(() => __rr.endRest()); await pg.waitForTimeout(100);
    ok(await pg.evaluate(() => __rr.curScreen === 'scrStory' && __rr.STORYRUN.key === 'b0'), 'baasverhaal');
    await pg.waitForTimeout(300); await shot(pg, 'verhaal_kikkerkoning.png'); await pg.evaluate(() => __rr.storyEnd());
    await pg.evaluate(() => { if (__rr.R) __rr.R.phase = 'end'; show('scrMenu'); });
    // stickers
    ok(await pg.evaluate(() => Object.keys(__rr.P.stickers).length >= 3), 'stickers verdiend: ' + await pg.evaluate(() => Object.keys(__rr.P.stickers)));
    // dagrecord
    await pg.evaluate(() => __rr.startRide('dag')); await drive(pg, 1); await pg.waitForFunction(() => __rr.curScreen === 'scrDagEnd', null, { timeout: 30000 });
    ok(await pg.evaluate(() => __rr.P.allTime > 0), 'dagrecord');
    await pg.context().close(); }

  /* 4. v1-migratie */
  console.log('▶ v1-migratie');
  { const v1 = { coins: 345, owned: { veh: ['bliksem', 'raket'], col: ['geel', 'rood', 'blauw'] }, veh: 'raket', col: 'blauw', worlds: { 1: { stars: 3 }, 2: { stars: 2 }, 3: { stars: 1 } }, facts: { '7x8': { b: 3, n: 5, c: 4 }, '23+45': { b: 1, n: 2, c: 1 } }, days: ['2026-10-19', '2026-10-20'], daily: { '2026-10-20': 14 }, allTime: 17, rides: 12, muted: false, focus: [7], pace: 'normaal' };
    const pg = await page([390, 844], URL0 + '?snel=8', `localStorage.setItem('rekenrace_v1', ${JSON.stringify(JSON.stringify(v1))})`);
    const m = await pg.evaluate(() => { const P = __rr.P; return { name: P && P.name, coins: P && P.coins, veh: P && P.veh, owned: P && P.owned.veh, w0: P && !!(P.lv[0] && P.lv[0].cl), open: P && __rr.isOpen(36), facts: P && Object.keys(P.facts), all: P && P.allTime, cur: __rr.curScreen }; });
    console.log('  ', JSON.stringify(m));
    ok(m.coins === 345 && m.veh === 'raket' && m.owned.includes('raket') && m.all === 17, 'munten/voertuigen/records gemigreerd');
    ok(m.w0 && m.open, 'werelden gemigreerd (zomer open)');
    ok(m.facts.some(k => k.startsWith('mul:7:8')), 'feiten gemigreerd');
    await pg.reload(); ok(await pg.evaluate(() => __rr.P && __rr.P.coins === 345 && Object.keys(__rr.G.profiles).length === 1), 'migratie eenmalig');
    await pg.context().close(); }

  /* 5. ouderscherm */
  console.log('▶ ouders');
  { const pg = await page([390, 844]); await quickProfile(pg);
    const est = await pg.evaluate(() => { const P = __rr.P; for (let i = 0; i < 6 * 9 + 6; i++) P.lv[i] = { st: 3, cl: 1, plays: 1, best: 10 };
      for (let i = 0; i < 40; i++) { __rr.recordResult('mul:' + (1 + i % 10) + ':' + (1 + (i * 3) % 10), 'tafAll', true, 2, true); __rr.recordResult('dec:' + i, 'komma1', i % 3 === 0, 5, false); }
      __rr.openOuders(); return [__rr.estimate(P), document.querySelector('#oudEst').textContent, document.querySelector('#oudTopics').textContent]; });
    ok(est[0] === 7 && /Geschat niveau: groep 5/.test(est[1]) && /schatting/.test(est[1]) && /geen officiële Cito/.test(est[1]), 'schatting: ' + est[1]);
    ok(/Sterk:.*Tafels/.test(est[2]) && /Oefenen:.*Komma/.test(est[2]), 'sterk/zwak: ' + est[2]);
    await pg.waitForTimeout(500); await shot(pg, 'ouders.png');
    await pg.click('#segCalm button[data-v="1"]'); ok(await pg.evaluate(() => __rr.P.calm === true), 'rustige modus via ouders');
    await pg.click('#btnDelProf'); await pg.click('#btnDelProf'); ok(await pg.evaluate(() => Object.keys(__rr.G.profiles).length === 0 && __rr.curScreen === 'scrNew'), 'profiel verwijderen');
    await pg.context().close(); }

  /* 6. menu volgt echt seizoen */
  { const pg = await page([390, 844], URL0 + '?snel=8', `{const D=Date;Date=class extends D{constructor(...a){super(...(a.length?a:[2026,0,15,12]))}static now(){return new D(2026,0,15,12).getTime()}}}`);
    await quickProfile(pg); ok(await pg.evaluate(() => /winter/.test(document.querySelector('#menuSeason').textContent) && document.body.dataset.season === '3'), 'januari → winter');
    await pg.context().close(); }

  /* 7. lay-outs + screenshots */
  console.log('▶ lay-outs');
  for (const vp of LAYOUTS) {
    const tag = vp.join('x'), pg = await page(vp, URL0 + '?snel=1');
    await quickProfile(pg, 'Robin'); await pg.evaluate(() => { const P = __rr.P; P.unlockAll = true; P.coins = 900; for (let i = 0; i < 40; i++) P.lv[i] = { st: 1 + i % 3, cl: 1, plays: 1, best: 9 }; P.open = 40; P.owned.veh.push('bij', 'lieveheer'); P.veh = 'bij'; show('scrMenu'); });
    const chk = async name => { const o = await pg.evaluate(() => { const vis = [...document.querySelectorAll('.overlay.show button, #game.on button')].filter(b => b.offsetParent && getComputedStyle(b).visibility !== 'hidden'); const W = innerWidth; const off = vis.filter(b => { const r = b.getBoundingClientRect(); return r.right > W + 1 || r.left < -1; }).map(b => b.id || b.textContent.trim().slice(0, 14)); const sc = document.documentElement.scrollWidth > W + 1; return { off, sc }; }); ok(!o.off.length && !o.sc, `${tag} ${name}: knoppen buiten beeld ${o.off}`); };
    await pg.waitForTimeout(300); await chk('menu'); await shot(pg, `menu_${tag}.png`);
    for (let s = 0; s < 4; s++) { await pg.evaluate(s => { mapSeason = s; show('scrMap'); }, s); await pg.waitForTimeout(200); await chk('kaart' + s); if (tag === '390x844' || tag === '1280x800') await shot(pg, `kaart_${['lente', 'zomer', 'herfst', 'winter'][s]}_${tag}.png`); }
    await pg.evaluate(() => show('scrGarage')); await pg.waitForTimeout(300); await chk('garage'); await shot(pg, `garage_${tag}.png`);
    await pg.evaluate(() => show('scrStickers')); await chk('stickers'); if (tag === '390x844') await shot(pg, `stickers_${tag}.png`);
    await pg.evaluate(() => show('scrKaart')); await chk('sterrenkaart');
    for (const s of [0, 1, 2, 3]) {
      const id = [2, 43, 82, 141][s];
      await pg.evaluate(id => { __rr.P.calm = false; __rr.startRide('level', id, 'none'); }, id);
      await pg.waitForFunction(() => __rr.R && __rr.R.phase === 'run' && __rr.R.row && __rr.R.row.z < 7.5, null, { timeout: 20000 });
      await chk('race' + s);
      const fit = await pg.evaluate(() => { const e = document.querySelector('#sumText'), c = document.querySelector('#sumCard').getBoundingClientRect(); return e.scrollWidth <= e.clientWidth + 2 && c.bottom < innerHeight * .6; });
      ok(fit, `${tag} race${s}: som past`);
      if (tag === '390x844' || tag === '1280x800' || tag === '360x640') await shot(pg, `race_${['lente', 'zomer', 'herfst', 'winter'][s]}_${tag}.png`);
      await pg.evaluate(() => { __rr.R.phase = 'end'; show('scrMenu'); });
    }
    await pg.evaluate(() => { const lv = 107; __rr.startRide('level', lv, 'none'); }); await pg.waitForFunction(() => __rr.R && __rr.R.phase === 'run' && __rr.R.row && __rr.R.row.z < 7.5, null, { timeout: 20000 });
    await pg.evaluate(() => { const R = __rr.R; const row = R.row; const c = row.opts.indexOf(row.it.ans); move(((c + 1) % 3) - __rr.player.lane > 0 ? 1 : -1); });
    await pg.waitForFunction(() => document.querySelector('#tipCard').classList.contains('show') || __rr.R.results.length, null, { timeout: 20000 }).catch(() => { });
    await pg.evaluate(() => { __rr.R.phase = 'end'; show('scrMenu'); });
    await pg.evaluate(() => __rr.openOuders()); await pg.waitForTimeout(500); await chk('ouders'); if (tag !== '390x844') await shot(pg, `ouders_${tag}.png`);
    await pg.evaluate(() => { $('#mdOuders').classList.remove('show'); playStory('w6', () => show('scrMenu')); }); await pg.waitForTimeout(400); await chk('verhaal'); await shot(pg, `verhaal_${tag}.png`);
    await pg.evaluate(() => { __rr.storyEnd(); show('scrPlace'); }); await chk('instaptest');
    await pg.context().close();
  }

  /* 8. v2.1: vroeg kiezen, verhaaltjessommen, groep 1-2 */
  console.log('▶ v2.1');
  { const pg = await page([390, 844], URL0 + '?snel=1'); await quickProfile(pg, 'Snel');
    await pg.evaluate(() => { __rr.P.unlockAll = true; __rr.P.wordsAsked = 1; __rr.P.seenHint = 9; __rr.startRide('level', 40, 'none'); });
    await pg.waitForFunction(() => __rr.R.phase === 'run' && __rr.R.row && !__rr.R.row.resolved && __rr.R.row.age > .2, null, { timeout: 15000 });
    const t0 = await pg.evaluate(() => { const r = __rr.R.row, c = r.cl, d = c - __rr.player.lane; if (d) move(Math.sign(d)); return { z: r.z, coins: __rr.P.coins, lane: __rr.player.lane, cl: c }; });
    ok(t0.lane === t0.cl, 'sturen naar goede baan');
    await pg.waitForTimeout(600);
    ok(await pg.evaluate(() => !__rr.R.row.committed && !__rr.R.row.resolved), 'baan wisselen versnelt NIET meer');
    await pg.keyboard.press('ArrowUp'); await pg.waitForTimeout(150); await pg.screenshot({ path: SHOTS + 'v21_vroeg_versnellen.png' });
    ok(await pg.evaluate(() => __rr.R.results.length >= 1 || __rr.R.row.committed), '↑ = versnellen');
    await pg.waitForFunction(() => __rr.R.results.length >= 1, null, { timeout: 3000 }).catch(() => { });
    const c2 = await pg.evaluate(() => ({ n: __rr.R.results.length, ok: __rr.R.results[0] && __rr.R.results[0].ok, fastN: __rr.R.fastN, coins: __rr.P.coins }));
    ok(c2.n === 1 && c2.ok, 'na ↑ poort binnen ~1 s bereikt (' + JSON.stringify(c2) + ')');
    ok(c2.fastN === 1 && c2.coins - t0.coins >= 3, 'snelle bonus (+1 munt)');
    // tik op poort = alleen sturen; vasthouden = versnellen
    await pg.waitForFunction(() => __rr.R.row && !__rr.R.row.resolved && __rr.R.row.age > .3, null, { timeout: 15000 });
    let g = await pg.evaluate(() => { const r = __rr.R.row, want = (__rr.player.lane + 1) % 3, s = sc(r.z), y = gy(r.z) - s * .8, x = CX + (want - 1 - camX) * s; return { x, y, want }; });
    await pg.mouse.click(g.x, g.y); await pg.waitForTimeout(500);
    ok(await pg.evaluate(w => __rr.player.lane === w && !__rr.R.row.committed && !__rr.R.row.resolved, g.want), 'tik op poort = sturen, niet versnellen');
    g = await pg.evaluate(() => { const r = __rr.R.row, want = (__rr.player.lane + 2) % 3, s = sc(r.z), y = gy(r.z) - s * .8, x = CX + (want - 1 - camX) * s; return { x, y, want }; });
    await pg.mouse.move(g.x, g.y); await pg.mouse.down(); await pg.waitForTimeout(500); await pg.mouse.up();
    ok(await pg.evaluate(w => __rr.player.lane === w && (__rr.R.row.committed || __rr.R.results.length >= 3), g.want), 'vasthouden op poort = sturen + versnellen');
    // vegen omhoog (aanraking) vs. opzij
    await pg.waitForFunction(() => __rr.R.row && !__rr.R.row.resolved && !__rr.R.row.committed && __rr.R.row.age > .3, null, { timeout: 15000 });
    const sw = await pg.evaluate(async () => { const el = document.querySelector('#game'), ev = (t, x, y) => el.dispatchEvent(new PointerEvent(t, { pointerId: 7, clientX: x, clientY: y, bubbles: true }));
      const l0 = __rr.player.lane; ev('pointerdown', 200, 600); ev('pointermove', 205, 560); ev('pointermove', 210, 520); ev('pointerup', 210, 520); return { same: __rr.player.lane === l0, c: __rr.R.row.committed }; });
    ok(sw.same && sw.c, 'veeg omhoog = versnellen zonder baanwissel');
    await pg.waitForFunction(() => __rr.R.row && !__rr.R.row.resolved && !__rr.R.row.committed && __rr.R.row.age > .3, null, { timeout: 15000 });
    const sw2 = await pg.evaluate(() => { const el = document.querySelector('#game'), ev = (t, x, y) => el.dispatchEvent(new PointerEvent(t, { pointerId: 8, clientX: x, clientY: y, bubbles: true }));
      const l0 = __rr.player.lane; ev('pointerdown', 200, 600); ev('pointermove', 260, 580); ev('pointerup', 260, 580); return { moved: __rr.player.lane !== l0 || l0 === 2, c: !!__rr.R.row.committed }; });
    ok(sw2.moved && !sw2.c, 'schuine veeg opzij = alleen sturen');
    await pg.evaluate(() => { __rr.R.phase = 'end'; __rr.P.seenHint = 0; __rr.startRide('level', 40, 'none'); });
    await pg.waitForFunction(() => __rr.R.phase === 'run' && __rr.R.row && __rr.R.row.age > .4, null, { timeout: 15000 });
    ok(await pg.evaluate(() => /⬆️/.test(document.querySelector('#swipeHint').textContent) && /✋/.test(document.querySelector('#swipeHint').textContent) && document.querySelector('#swipeHint').classList.contains('show')), 'hint toont ⬆️ / ✋');
    await pg.screenshot({ path: SHOTS + 'v23_hint_versnellen.png' });
    await pg.evaluate(() => { __rr.R.phase = 'end'; show('scrMenu'); });
    // verhaaltjessommen uit
    const w = await pg.evaluate(() => { __rr.P.words = false; const out = []; for (const s of __rr.WORD_SKILLS) for (let i = 0; i < 60; i++) { const it = __rr.buildItem(__rr.SK[s].gen()), q = __rr.qShow(it, false); out.push([s, !!it.bare, /[a-z]{5,}/i.test(q.replace(/€|min|uur|km/g, '')), q]); } return out.filter(x => !x[1] || x[2]).slice(0, 5); });
    ok(w.length === 0, 'kale som zonder verhaal: ' + JSON.stringify(w));
    await pg.evaluate(() => __rr.startRide('level', 15 * 9 + 3, 'none'));
    await pg.waitForFunction(() => __rr.R.row && __rr.R.row.it.bare, null, { timeout: 30000 }).catch(() => { });
    ok(await pg.evaluate(() => !__rr.R.row.it.bare || document.querySelector('#sumText').textContent === __rr.R.row.it.bare), 'race toont kale som');
    await pg.evaluate(() => { __rr.R.phase = 'end'; show('scrMenu'); __rr.P.words = true; __rr.P.wordsAsked = 0; for (let i = 0; i < 16; i++) __rr.P.story['w' + i] = 1; __rr.playLevel(6 * 9); });
    ok(await pg.evaluate(() => document.querySelector('#mdWords').classList.contains('show')), 'keuzevraag verhaaltjessommen bij eerste wereld');
    await shot(pg, 'v21_keuze_verhaaltjes.png');
    await pg.click('#btnWordsOff'); ok(await pg.evaluate(() => __rr.P.words === false && __rr.P.wordsAsked === 1 && !!__rr.R), 'kale sommen gekozen → rit start');
    await pg.evaluate(() => { __rr.R.phase = 'end'; show('scrMenu'); __rr.openOuders(); });
    ok(await pg.evaluate(() => document.querySelector('#segWords button.on').dataset.v === '0'), 'ouders: schakelaar staat uit');
    await pg.click('#segWords button[data-v="1"]'); ok(await pg.evaluate(() => __rr.P.words === true), 'ouders: aanzetten');
    await pg.click('#segStory button[data-v="0"]'); ok(await pg.evaluate(() => __rr.P.showStory === false), 'ouders: verhaal uit');
    await pg.evaluate(() => document.querySelector('#segWords').scrollIntoView({ block: 'center' })); await shot(pg, 'v21_ouders_schakelaars.png');
    await pg.evaluate(() => { $('#mdOuders').classList.remove('show'); __rr.P.story.w9 = 0; __rr.P.wordsAsked = 1; __rr.playLevel(9 * 9); });
    ok(await pg.evaluate(() => __rr.curScreen === 'game'), 'verhaal uit → direct racen');
    await pg.evaluate(() => { __rr.R.phase = 'end'; show('scrMenu'); });
    // rust: tik = verder, adempauze pas na 3 s
    await pg.evaluate(() => { __rr.P.restN = 0; runRest(() => show('scrMenu')); }); await pg.click('#restCv'); ok(await pg.evaluate(() => !__rr.REST), 'rustmoment: tik = verder');
    await pg.evaluate(() => { __rr.P.restN = 2; runRest(() => show('scrMenu')); }); await pg.waitForTimeout(300);
    ok(await pg.evaluate(() => getComputedStyle(document.querySelector('#btnRestSkip')).visibility === 'hidden'), 'adempauze: overslaan pas na 3 s');
    await pg.click('#restCv'); ok(await pg.evaluate(() => !!__rr.REST), 'adempauze: tik vóór 3 s doet niets');
    await pg.waitForTimeout(2900); await pg.click('#btnRestSkip'); ok(await pg.evaluate(() => !__rr.REST), 'adempauze: na 3 s over te slaan');
    await pg.context().close(); }
  { const pg = await page([390, 844], URL0 + '?snel=1'); await quickProfile(pg, 'Kleuter');
    ok(await pg.evaluate(() => document.body.classList.contains('young') && !!document.querySelector('#btnPlay .yico')), 'groep 1-2: menu met iconen');
    await shot(pg, 'v21_groep1_menu.png');
    await pg.evaluate(() => { __rr.P.story.intro = 0; __rr.P.showStory = true; playStory('w0', () => show('scrMenu')); }); await pg.waitForTimeout(300);
    ok(await pg.evaluate(() => __rr.STORYRUN && __rr.STORYRUN.strip ? document.body.classList.contains('young') && STRIP_PICS[2][0].length > 0 && __rr.STORYRUN.n === 3 : document.querySelector('#bubble').classList.contains('pics') && document.querySelector('#bubblePic').textContent.length > 0), 'groep 1-2: verhaal als plaatjes (strip met pictogrammen)');
    ok(await pg.evaluate(() => __rr.ASSET_FILES.length >= 130 && ['strip_01', 'strip_16', 'rest_r01', 'veh_eenhoorn', 'char_speler_b_0', 'icon_w15', 'ui_gate_goed'].every(n => __rr.ASSET_FILES.includes(n))), 'art: alle onderdelen (deel 1-7) in de precache-lijst');
    ok(await pg.evaluate(() => [...document.querySelectorAll('#hud img.aimg, h1.logo img.emb')].length >= 1), 'art: munt/embleem als afbeelding');
    await shot(pg, 'v21_groep1_verhaal.png'); await pg.evaluate(() => __rr.storyEnd());
    await pg.evaluate(() => __rr.startRide('level', 0, 'none'));
    await pg.waitForFunction(() => __rr.R.phase === 'run' && __rr.R.row && __rr.R.row.z < 8.5, null, { timeout: 15000 });
    const y = await pg.evaluate(() => ({ tutor: __rr.R.tutor, dots: __rr.R.row.dots, pic: document.querySelector('#sumCard').classList.contains('pic'), txt: document.querySelector('#sumText').textContent, vis: getComputedStyle(document.querySelector('#sumVis')).display }));
    ok(y.tutor && y.dots && y.pic && y.vis === 'block', 'groep 1: stippen-vraag, stippen-poorten, wijzende hand ' + JSON.stringify(y));
    await pg.waitForTimeout(500); await shot(pg, 'v21_groep1_vraag.png');
    // plus met appels (wereld 1)
    const ap = await pg.evaluate(() => { const it = __rr.youngItem(__rr.buildItem('add:3:2')); return [it.vis && it.vis.type, __rr.qShow(it, true), it.ans]; });
    ok(ap[0] === 'apples' && ap[1] === '' && ap[2] === '5', 'groep 1-2: 3 appels + 2 appels');
    await pg.evaluate(() => { __rr.R.phase = 'end'; __rr.startRide('level', 9 + 1, 'none'); });
    await pg.waitForFunction(() => __rr.R.phase === 'run' && __rr.R.row && __rr.R.row.it.vis && __rr.R.row.it.vis.type === 'apples' && __rr.R.row.z < 8.5, null, { timeout: 40000 }).catch(() => { });
    await pg.waitForTimeout(300); await shot(pg, 'v21_groep1_appels.png');
    await pg.evaluate(() => { __rr.R.phase = 'end'; show('scrMenu'); });
    await pg.evaluate(() => { show('scrPlace'); __rr.placeStart(); __rr.PL.w = 0; placeQ(); });
    ok(await pg.evaluate(() => getComputedStyle(document.querySelector('#plQ')).display === 'none' || document.querySelector('#plQ').textContent.length < 6), 'instaptest lage band zonder tekst');
    await pg.context().close(); }

  /* 9. v2.2: speler-schakelaars naast de ballon */
  console.log('▶ v2.2');
  for (const vp of [[360, 640], [390, 844]]) { const tag = vp.join('x'); const pg = await page(vp, URL0 + '?snel=1'); await quickProfile(pg, 'Zelf');
    // (a) verhaal
    await pg.evaluate(() => { __rr.P.showStory = true; playStory('w6', () => show('scrMenu')); }); await pg.waitForTimeout(350);
    const sb = await pg.evaluate(() => { const b = document.querySelector('#btnStoryToggle').getBoundingClientRect(), u = document.querySelector('#bubble').getBoundingClientRect(); return { w: b.width, h: b.height, ok: b.right <= innerWidth && b.left >= 0 && b.bottom <= u.top + 6 }; });
    ok(sb.w >= 44 && sb.h >= 44 && sb.ok, `${tag} verhaal-knop groot genoeg, naast ballon ` + JSON.stringify(sb));
    await pg.click('#btnStoryToggle'); await pg.waitForTimeout(250);
    ok(await pg.evaluate(() => __rr.P.showStory === false && document.querySelector('#btnStoryToggle').classList.contains('off') && __rr.curScreen === 'scrStory'), `${tag} verhaal uit via ballon (scène blijft)`);
    if (tag === '390x844') await pg.screenshot({ path: SHOTS + 'v22_verhaal_schakelaar.png' });
    await pg.evaluate(() => __rr.openOuders()); ok(await pg.evaluate(() => document.querySelector('#segStory button.on').dataset.v === '0'), `${tag} gesynchroniseerd met ouders`);
    await pg.evaluate(() => $('#mdOuders').classList.remove('show')); await pg.click('#btnStoryToggle'); ok(await pg.evaluate(() => __rr.P.showStory === true), `${tag} verhaal weer aan`);
    await pg.evaluate(() => __rr.storyEnd());
    // (b) verhaaltjessom in de race
    await pg.evaluate(() => { __rr.P.words = true; __rr.P.wordsAsked = 1; __rr.P.unlockAll = true; __rr.P.calm = true; __rr.startRide('level', 15 * 9 + 5, 'none'); });
    await pg.waitForFunction(() => { const r = __rr.R.row; if (r && !r.resolved && !r.it.bare && __rr.R.phase === 'run') __rr.commit(r); return r && !r.resolved && r.it.bare && r.age > .3; }, null, { timeout: 60000, polling: 100 });
    await pg.waitForTimeout(200);
    const wb = await pg.evaluate(() => { const b = document.querySelector('#btnWords').getBoundingClientRect(), r = __rr.R.row, s = sc(Math.min(r.z, ZP + 1.6)), gt = gy(Math.min(r.z, ZP + 1.6)) - s * 1.4; return { w: b.width, h: b.height, inView: b.right <= innerWidth + 1 && b.top >= 0, aboveGates: b.bottom < gt, txt: document.querySelector('#sumText').textContent, q: r.it.q }; });
    ok(wb.w >= 44 && wb.inView && wb.aboveGates && wb.txt === wb.q, `${tag} verhaaltjes-knop naast som, niet over poorten ` + JSON.stringify(wb));
    if (tag === '390x844' || tag === '360x640') await pg.screenshot({ path: SHOTS + `v22_som_schakelaar_aan_${tag}.png` });
    await pg.click('#btnWords'); await pg.waitForTimeout(250);
    const off = await pg.evaluate(() => ({ w: __rr.P.words, txt: document.querySelector('#sumText').textContent, bare: __rr.R.row.it.bare, offc: document.querySelector('#btnWords').classList.contains('off'), lane: __rr.player.lane, paused: __rr.R.paused, inView: (() => { const b = document.querySelector('#btnWords').getBoundingClientRect(), c = document.querySelector('#hudCoins').getBoundingClientRect(); return b.right <= innerWidth + 1 && c.right <= innerWidth + 1 && b.right <= c.left + 2; })() }));
    ok(off.w === false && off.txt === off.bare && off.offc && off.lane === 1 && !off.paused && off.inView, `${tag} tik = meteen kale som, auto stuurt niet ` + JSON.stringify(off));
    await pg.screenshot({ path: SHOTS + `v22_som_schakelaar_uit_${tag}.png` });
    await pg.click('#btnWords'); ok(await pg.evaluate(() => __rr.P.words === true && document.querySelector('#sumText').textContent === __rr.R.row.it.q), `${tag} zelfde plek: weer aan`);
    await pg.click('#btnWords');
    await pg.evaluate(() => { __rr.R.phase = 'end'; __rr.P.calm = false; show('scrMap'); __rr.openLevel(15 * 9); });
    ok(await pg.evaluate(() => getComputedStyle(document.querySelector('#lvWords')).display !== 'none' && document.querySelector('#lvWords').classList.contains('off')), `${tag} levelscherm toont schakelaar (uit)`);
    if (tag === '390x844') await shot(pg, 'v22_level_schakelaar.png');
    await pg.click('#lvWords'); ok(await pg.evaluate(() => __rr.P.words === true), `${tag} levelscherm: weer aan`);
    ok(await pg.evaluate(() => { __rr.openLevel(0); return getComputedStyle(document.querySelector('#lvWords')).display === 'none'; }), `${tag} geen schakelaar in wereld zonder verhaaltjes`);
    await pg.context().close(); }
  ok(ext.length === 0, 'externe verzoeken: ' + [...new Set(ext)].join(', '));
  ok(errs.length === 0, 'console-fouten: ' + [...new Set(errs)].slice(0, 5).join(' | '));
  await b.close();
  console.log(`\n${pass} geslaagd, ${fail} mislukt`); if (fail) { console.log(fails.join('\n')); process.exit(1); }
})().catch(e => { console.error(e); process.exit(2); });
