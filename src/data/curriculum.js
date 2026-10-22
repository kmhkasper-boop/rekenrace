/* ===== 4 seizoenen × 4 werelden × (8 levels + eindbaas) = 144 levels =====
   Volgorde volgens SLO/TULE-inhoudslijnen en de gebruikelijke leerlijn (zie rekenrace_plan/voorstel.md). */
const SEASONS = [
  { id: 0, key: 'lente', name: 'Lente', icon: '🌷', col: '#5fd27d', col2: '#ffb3d1', boss: 'kikker', bossName: 'Kikkerkoning', crystal: '#ff7eb6' },
  { id: 1, key: 'zomer', name: 'Zomer', icon: '☀️', col: '#ffb03b', col2: '#4cc3ff', boss: 'victor', bossName: 'Vulkaan-Victor', crystal: '#ffd23f' },
  { id: 2, key: 'herfst', name: 'Herfst', icon: '🍂', col: '#e07a2e', col2: '#a0522d', boss: 'egel', bossName: 'Egel-ridder', crystal: '#ff8a2a' },
  { id: 3, key: 'winter', name: 'Winter', icon: '❄️', col: '#4cc3ff', col2: '#b98aff', boss: 'chaos', bossName: 'Graaf Chaos', crystal: '#7fe7ff' },
];
/* sk: vier groepjes nieuwe vaardigheden per wereld; groep = 'schatting' van het passende leerjaar; cito = vergelijkbaar functioneringsniveau (schatting) */
const WORLDS = [
  /* v2.5: de hoofdroute begint op groep-3-niveau; Lente = groep 3-4 verdeeld over 4 werelden (groep 1-2 = aparte Kleuter-modus, zie KWORLDS) */
  { s: 0, name: 'Splits-sloot', icon: '🦆', art: 'icon_w1', groep: 'groep 3', cito: 'B3', sk: [['splits10'], ['plus10', 'min10'], ['dubbel'], ['na20', 'tel20']], len: 10, T: [12, 7, 15] },
  { s: 0, name: 'Bruggetje', icon: '🌉', art: 'icon_w2', groep: 'groep 3', cito: 'M3', sk: [['plus20', 'min20'], ['plus20x'], ['min20x'], ['plus20x', 'min20x']], len: 12, T: [9, 4.5, 12] },
  { s: 0, name: 'Tulpentuin', icon: '🌷', art: 'icon_w0', groep: 'groep 3', cito: 'E3', sk: [['klokuur'], ['geld1'], ['tien'], ['klokhalf']], len: 12, T: [11, 6, 14] },
  { s: 0, name: 'Klokkentoren', icon: '🕰️', art: 'icon_w3', groep: 'groep 3-4', cito: 'E3', sk: [['klokhalf'], ['plus100e', 'min100e'], ['tienerbij'], ['klokuur', 'geld1']], len: 12, T: [11, 6, 14] },
  { s: 1, name: 'Honderd-haven', icon: '⚓', groep: 'groep 4', cito: 'M4', sk: [['tien'], ['plus100e', 'min100e'], ['tienerbij'], ['plus100x', 'min100x']], len: 12, T: [10, 5, 13] },
  { s: 1, name: 'Tafelstrand', icon: '🏖️', groep: 'groep 4', cito: 'E4', sk: [['tafA'], ['tafB'], ['tafAB'], ['meer100']], len: 12, T: [8.5, 4, 11] },
  { s: 1, name: 'IJskraam', icon: '🍦', groep: 'groep 4-5', cito: 'M5', sk: [['geld2'], ['kwartier'], ['half'], ['terug']], len: 12, T: [12, 7, 15] },
  { s: 1, name: 'Vulkaaneiland', icon: '🌋', groep: 'groep 5', cito: 'E5', sk: [['tafC'], ['deelA'], ['deelB'], ['deelC', 'tafAll']], len: 12, T: [8.5, 4, 11.5] },
  { s: 2, name: 'Duizend-dennen', icon: '🌲', groep: 'groep 5', cito: 'M6', sk: [['plus100', 'min100'], ['duizend'], ['plus1000', 'min1000'], ['handig']], len: 12, T: [11, 6, 14] },
  { s: 2, name: 'Meetmoeras', icon: '📏', groep: 'groep 5-6', cito: 'M6', sk: [['meten1'], ['klok5'], ['digitaal'], ['meten1b']], len: 12, T: [12, 7, 15] },
  { s: 2, name: 'Nullen-heuvel', icon: '⛰️', groep: 'groep 6', cito: 'E6', sk: [['nullen1'], ['deelAll'], ['nullen2'], ['rest']], len: 12, T: [11, 6, 14] },
  { s: 2, name: 'Breukenbos', icon: '🥧', groep: 'groep 6', cito: 'E6', sk: [['bdeel'], ['bvan'], ['bvgl'], ['bgel']], len: 12, T: [12, 7, 15] },
  { s: 3, name: 'Komma-kristal', icon: '💎', groep: 'groep 6-7', cito: 'M7', sk: [['kommageld'], ['komma1'], ['komma10'], ['bkomma']], len: 12, T: [12, 7, 15] },
  { s: 3, name: 'Procentenpiek', icon: '🏔️', groep: 'groep 7', cito: 'E7', sk: [['pct1'], ['pct2'], ['pbreuk'], ['groot']], len: 12, T: [12, 7, 15] },
  { s: 3, name: 'Verhoudings-gletsjer', icon: '🧊', groep: 'groep 7-8', cito: 'M8', sk: [['verh'], ['prijskilo'], ['schaal'], ['tijdsduur']], len: 12, T: [14, 8, 18] },
  { s: 3, name: 'Noorderlicht-finale', icon: '🌌', groep: 'groep 8', cito: 'E8 (1F/1S)', sk: [['volgorde'], ['gemiddelde'], ['meten2'], ['context']], len: 12, T: [14, 8, 18] },
];
const NW = WORLDS.length; // 16 werelden in de hoofdroute
/* Kleuter-modus (groep 1-2): eigen werelden en levels, achter de hoofdroute (ids 16-17 / levels 144-161); alleen plaatjes */
const KWORLDS = [
  { s: 0, name: 'Tel-tuin', icon: '🐞', art: 'icon_w0', groep: 'groep 1-2', cito: 'groep 2', sk: [['tel5'], ['na10'], ['tel10'], ['meer10']], len: 8, T: [13, 8, 16], kl: 1 },
  { s: 0, name: 'Splits-sloot', icon: '🦆', art: 'icon_w1', groep: 'groep 2', cito: 'groep 2', sk: [['splits5'], ['plus5'], ['splits10'], ['plus10', 'min10']], len: 10, T: [12, 7, 15], kl: 1 },
];
WORLDS.push(...KWORLDS);
WORLDS.forEach((w, i) => { w.id = i; w.wi = i % 4; w.boss = w.wi === 3 && !w.kl ? SEASONS[w.s].boss : 'chaos'; });
for (let i = 0; i < NW; i++) if (!WORLDS[i].art) WORLDS[i].art = 'icon_w' + i;
const MAINW = WORLDS.slice(0, NW);
const LPW = 9; // levels per wereld (8 + eindbaas)
const NLEV = NW * LPW;          // 144 levels in de hoofdroute
const KLEV0 = NLEV, KLEVN = KWORLDS.length * LPW; // kleuter-levels 144..161
/* level-opbouw binnen een wereld (g = groepjes 0..3):
   1-3 introductie (rustig), 4-6 oefenen, 7-8 mixen met de vorige wereld en sneller, 9 = eindbaas */
const LEVEL_PLAN = [
  { g: [[0, 1]], sp: 0 }, { g: [[0, .5], [1, 1]], sp: .1 }, { g: [[1, 1], [0, .4]], sp: .15 },
  { g: [[2, 1], [0, .3], [1, .3]], sp: .2 }, { g: [[2, .6], [3, 1]], sp: .25 }, { g: [[3, 1], [2, .4]], sp: .3 },
  { g: [[0, 1], [1, 1], [2, 1], [3, 1], ['prev', 1]], sp: .4 }, { g: [[0, 1], [1, 1], [2, 1], [3, 1.3], ['prev', .8]], sp: .5 },
  { g: [[0, 1], [1, 1], [2, 1.2], [3, 1.4]], sp: .55, boss: true },
];
const LEVELS = [];
for (const w of WORLDS) for (let l = 0; l < LPW; l++) {
  const P = LEVEL_PLAN[l], mix = [];
  for (const [g, wt] of P.g) {
    if (g === 'prev') { if (w.id > 0 && w.id !== NW) { const pw = WORLDS[w.id - 1]; const all = pw.sk.flat(); all.forEach(s => mix.push([s, wt / all.length])); } continue; }
    w.sk[g].forEach(s => mix.push([s, wt / w.sk[g].length]));
  }
  const T0 = w.T[0] * (1 - P.sp * .35);
  LEVELS.push({ id: w.id * LPW + l, w: w.id, s: w.s, l, boss: !!P.boss, mix, len: P.boss ? w.len + 4 : w.len,
    T: [+T0.toFixed(2), w.T[1], w.T[2]], name: P.boss ? 'Eindbaas' : `Level ${l + 1}` });
}
const isKl = lv => !!(lv && WORLDS[lv.w].kl);
const worldSkills = w => WORLDS[w].sk.flat();
const levelOf = (w, l) => LEVELS[w * LPW + l];
