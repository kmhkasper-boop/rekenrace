/* ===== voertuigen, kleuren, stickers, rustmomenten ===== */
const VEHICLES = [
  { id: 'bliksem', name: 'Bliksem', s: 0, how: 'start', price: 0 },
  { id: 'lieveheer', name: 'Lieveheersbeestje-kart', s: 0, how: 'coins', price: 60 },
  { id: 'bloembus', name: 'Bloemenbus', s: 0, how: 'coins', price: 120 },
  { id: 'bij', name: 'Bijen-scooter', s: 0, how: 'boss', price: 0 },
  { id: 'raceauto', name: 'Raceauto', s: 1, how: 'coins', price: 50 },
  { id: 'ijscokar', name: 'IJscokar', s: 1, how: 'coins', price: 150 },
  { id: 'surf', name: 'Surfplank-racer', s: 1, how: 'coins', price: 220 },
  { id: 'dino', name: 'Dino-kart', s: 1, how: 'boss', price: 300 },
  { id: 'paddo', name: 'Paddenstoel-buggy', s: 2, how: 'coins', price: 180 },
  { id: 'pompoen', name: 'Pompoenwagen', s: 2, how: 'coins', price: 260 },
  { id: 'eenhoorn', name: 'Eenhoorn', s: 2, how: 'coins', price: 320 },
  { id: 'uilvlieger', name: 'Uil-zweefvlieger', s: 2, how: 'boss', price: 0 },
  { id: 'slee', name: 'Slee', s: 3, how: 'coins', price: 300 },
  { id: 'ijsbeer', name: 'IJsbeer-truck', s: 3, how: 'coins', price: 400 },
  { id: 'scooter', name: 'Sneeuwscooter', s: 3, how: 'coins', price: 450 },
  { id: 'raket', name: 'Noorderlicht-raket', s: 3, how: 'boss', price: 0 },
];
const COLORS = [
  { id: 'geel', name: 'Geel', hex: '#ffd23f', price: 0 }, { id: 'rood', name: 'Rood', hex: '#ff4d4d', price: 0 },
  { id: 'blauw', name: 'Blauw', hex: '#3d8bfd', price: 20 }, { id: 'groen', name: 'Groen', hex: '#2ecc71', price: 20 },
  { id: 'oranje', name: 'Oranje', hex: '#ff9f1c', price: 25 }, { id: 'roze', name: 'Roze', hex: '#ff6fb5', price: 30 },
  { id: 'paars', name: 'Paars', hex: '#9b59ff', price: 30 }, { id: 'wit', name: 'Sneeuwwit', hex: '#f4f8ff', price: 40 },
  { id: 'goud', name: 'Goud', hex: '#f5b800', price: 150 }, { id: 'regenboog', name: 'Regenboog', hex: '#ff6fb5', price: 300 },
];
const AVATARS = ['🦊', '🐼', '🐯', '🐸', '🦄', '🐙', '🐵', '🐨', '🐰', '🦁', '🐧', '🐲'];
const AVCOLS = ['#ff6fb5', '#4cc3ff', '#ffb03b', '#5fd27d', '#9b59ff', '#ff5f5f'];

/* stickers: id, icoon, naam, uitleg, test(P, ctx) */
const STICKERS = [
  ['eerste', '🏁', 'Eerste rit', 'Rijd je eerste level', P => P.rides >= 1],
  ['tien', '🔟', '10 goed', '10 sommen goed in totaal', P => P.tot.c >= 10],
  ['honderd', '💯', '100 goed', '100 sommen goed in totaal', P => P.tot.c >= 100],
  ['vijfhonderd', '🏅', '500 goed', '500 sommen goed in totaal', P => P.tot.c >= 500],
  ['duizend', '🏆', '1000 goed', '1000 sommen goed in totaal', P => P.tot.c >= 1000],
  ['combo', '🔥', 'Combo-turbo', '5 goed op rij in één rit', P => P.bestStreak >= 5],
  ['combo10', '☄️', 'Superreeks', '10 goed op rij in één rit', P => P.bestStreak >= 10],
  ['combo20', '🌠', 'Onstuitbaar', '20 goed op rij in één rit', P => P.bestStreak >= 20],
  ['drie', '⭐', 'Drie sterren', 'Haal 3 sterren in een level', P => Object.values(P.lv).some(l => l.st >= 3 && !l.pl)],
  ['tiendrie', '🌟', 'Sterrenregen', '10 levels met 3 sterren', P => Object.values(P.lv).filter(l => l.st >= 3 && !l.pl).length >= 10],
  ['dag3', '📅', '3 dagen', '3 dagen op rij geoefend', P => streakOf(P).n >= 3],
  ['dag7', '🗓️', 'Hele week', '7 dagen op rij geoefend', P => streakOf(P).n >= 7],
  ['spook', '👻', 'Spookjager', 'Versla een spook-race', P => P.ghostWins >= 1],
  ['spook5', '🎃', 'Spookmeester', 'Versla 5 spook-races', P => P.ghostWins >= 5],
  ['voucher', '🎟️', 'Slim overgeslagen', 'Gebruik een overslaan-bon', P => !!P.usedVoucher],
  ['check', '🧭', 'Snelle check', 'Doe de instaptest', P => !!P.placed],
  ['garage', '🚗', 'Nieuwe wagen', 'Koop een voertuig', P => P.owned.veh.length >= 2],
  ['vloot', '🚚', 'Wagenpark', 'Heb 8 voertuigen', P => P.owned.veh.length >= 8],
  ['dagrecord', '⏱️', 'Minuutracer', 'Speel een Dagrecord', P => P.allTime > 0],
  ['dag20', '⚡', 'Bliksemsnel', '20 punten in een Dagrecord', P => P.allTime >= 20],
  ['lente', '🌷', 'Lentekristal', 'Versla de Kikkerkoning', P => P.seasonsDone.includes(0)],
  ['zomer', '☀️', 'Zomerkristal', 'Versla Vulkaan-Victor', P => P.seasonsDone.includes(1)],
  ['herfst', '🍂', 'Herfstkristal', 'Versla de Egel-ridder', P => P.seasonsDone.includes(2)],
  ['winter', '❄️', 'Winterkristal', 'Versla Graaf Chaos', P => P.seasonsDone.includes(3)],
];
/* rustmomenten tussen levels (5-8 s) */
const RESTS = ['pitstop', 'wasstraat', 'ijsje', 'eekhoorn', 'sneeuwpop', 'tanken', 'vlieger', 'picknick'];
const REST_TXT = { pitstop: 'Pitstop! Opa Tandwiel wisselt je banden.', wasstraat: 'Even door de wasstraat… blub blub!', ijsje: 'Pim haalt een ijsje… oeps!', eekhoorn: 'Een eekhoorn verstopt nootjes langs de baan.',
  sneeuwpop: 'Pim bouwt een sneeuwpop. Hij lijkt op Opa!', tanken: 'Tanken met rekenkracht: vol = 100%!', vlieger: 'Opa laat een vlieger op. Het waait hard!', picknick: 'Picknick! Wie heeft de laatste boterham?' };
/* Grogs rustmoment-animaties (deel 6): sheet met 4 frames, ~6 fps */
const REST_ANIM = { r01: 'Opa Tandwiel draait de laatste bout vast.', r02: 'Pim graaft een tunneltje… waar komt hij boven?', r03: 'De Kikkerkoning springt een rondje!', r04: 'Pim likt aan een ijsje. Mmm!',
  r05: 'Vulkaan-Victor zet zijn zonnebril op. Cool!', r06: 'De Egel-ridder vangt een vallend blad.', r07: 'Opa geeft je motor een druppeltje olie.', r08: 'Uil Komma knoopt zijn sjaal om.' };
const REST_ANIM_BY_SEASON = [['r01', 'r02', 'r03'], ['r04', 'r05', 'r07'], ['r06', 'r01', 'r02', 'r07'], ['r08', 'r07', 'r01']];
const REST_BY_SEASON = [['pitstop', 'wasstraat', 'vlieger', 'picknick'], ['ijsje', 'wasstraat', 'pitstop', 'tanken'], ['eekhoorn', 'vlieger', 'pitstop', 'tanken'], ['sneeuwpop', 'pitstop', 'tanken', 'wasstraat']];
