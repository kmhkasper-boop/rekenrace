/* ===== verhaal: De Gestolen Seizoenen =====
   panels: [links, rechts, wie praat ('l'|'r'|'n' = verteller), tekst]. {naam} = naam van de speler. */
const STORY = {
  intro: { s: 0, title: 'De Gestolen Seizoenen', p: [
    ['opa', 'pim', 'l', 'Welkom in mijn garage, {naam}! Ik ben Opa Tandwiel. Mijn snor zit scheef, maar mijn moersleutel niet.'],
    ['opa', 'pim', 'r', 'En ik ben Pim de mol! Ik zie niet zo goed… Is dat jouw racewagen of een broodrooster?'],
    ['chaos', 'pim', 'l', 'MWAHAHA! Ik ben Graaf Chaos! Ik heb de vier Seizoenskristallen gestolen. Rekenen is veel te netjes!'],
    ['opa', 'player', 'l', 'Zonder kristallen raken de seizoenen in de war. Alleen een snelle rekenracer kan ze terugwinnen…'],
    ['opa', 'player', 'r', 'Dat ben ik! Gas erop! 🏁'] ] },
  w0: { s: 0, title: 'Tel-tuin', p: [['pim', 'opa', 'l', 'Help! Chaos heeft alle lieveheersbeestjes door elkaar gehusseld. Hoeveel stippen zijn er nou?'], ['pim', 'opa', 'r', 'Tellen, Pim. Gewoon tellen. Met je vingers, niet met je neus.']] },
  w1: { s: 0, title: 'Splits-sloot', p: [['pim', 'opa', 'l', 'De eendjes zijn gesplitst! Vijf eendjes: twee hier, en… hoeveel daar?'], ['opa', 'pim', 'l', 'Kwak-tisch rekenen, {naam}! Splits ze maar.']] },
  w2: { s: 0, title: 'Bruggetje', p: [['chaos', 'pim', 'l', 'Ik heb het bruggetje van 10 opgeblazen! Nu kom je nooit over de 10!'], ['opa', 'player', 'r', 'Dan bouw ik er zelf een: 8 + 7 = 8 + 2 + 5!']] },
  w3: { s: 0, title: 'Klokkentoren', p: [['opa', 'pim', 'r', 'Hoe laat is het? Ik zie twee wijzers en drie Opa\'s…'], ['kikker', 'pim', 'l', 'KWAAK! Ik ben de Kikkerkoning. Chaos gaf mij het Lentekristal. Versla mij als je durft. Kwaak kwaak!']] },
  b0: { s: 0, title: 'Het Lentekristal', p: [['kikker', 'player', 'l', 'Kwaak… je bent snel. Hier, het Lentekristal. De tulpen mogen weer rechtop.'], ['opa', 'pim', 'r', 'Joepie! Op naar de zomer! Wie heeft mijn zonnebril? O, die zit op mijn neus.']] },
  w4: { s: 1, title: 'Honderd-haven', p: [['pim', 'opa', 'l', 'Chaos heeft alle boten genummerd tot 100… en de nummers omgedraaid!'], ['opa', 'player', 'l', 'Met tientallen springen, {naam}. Dan vaar je zo de haven in.']] },
  w5: { s: 1, title: 'Tafelstrand', p: [['pim', 'opa', 'l', 'Ik heb 5 zandkastelen gebouwd met elk 4 torens. Hoeveel torens? Ik tel er 3 en een krab.'], ['opa', 'pim', 'r', 'De tafels, Pim! 5 × 4. Je hoeft de krab niet mee te tellen.']] },
  w6: { s: 1, title: 'IJskraam', p: [['chaos', 'pim', 'l', 'Mijn ijskraam vraagt € 99 voor één bolletje! Teruggeven? Nooit!'], ['opa', 'player', 'r', 'Wij tellen het wisselgeld wel na. Eerlijk is eerlijk!']] },
  w7: { s: 1, title: 'Vulkaaneiland', p: [['victor', 'pim', 'l', 'BLUBBER-BOEM! Ik ben Vulkaan-Victor! Ik spuw tafels van 6, 7, 8 en 9. HEET HEET HEET!'], ['opa', 'player', 'r', 'Ik ken de tafels. En de deeltafels er gratis bij!']] },
  b1: { s: 1, title: 'Het Zomerkristal', p: [['victor', 'player', 'l', 'Pfff… ik ben afgekoeld. Neem het Zomerkristal maar. En een ijsje.'], ['pim', 'opa', 'l', 'De zon schijnt weer goed! Maar… waarom vallen er nu blaadjes?']] },
  w8: { s: 2, title: 'Duizend-dennen', p: [['pim', 'opa', 'l', 'Er staan hier wel duizend dennen. Ik heb er 999 geteld. En toen ben ik tegen nummer 1000 gelopen.'], ['opa', 'player', 'r', 'Handig rekenen: 999 is bijna 1000!']] },
  w9: { s: 2, title: 'Meetmoeras', p: [['chaos', 'pim', 'l', 'Ik heb alle meetlinten door de war gegooid! Zijn het meters? Centimeters? Spaghetti?'], ['opa', 'pim', 'r', '1 meter is 100 centimeter. Dat weet zelfs mijn snor.']] },
  w10: { s: 2, title: 'Nullen-heuvel', p: [['pim', 'opa', 'l', 'Overal rollen nullen de heuvel af! 30 × 40… hoeveel nullen moeten erachter?'], ['opa', 'player', 'r', 'Eerst 3 × 4, dan de nullen terug. Makkie!']] },
  w11: { s: 2, title: 'Breukenbos', p: [['egel', 'pim', 'l', 'En garde! Ik ben de Egel-ridder. Geen doorgang zonder de juiste breuk!'], ['player', 'egel', 'l', 'Een half bos vol prikkels? Ik verdeel de breuken eerlijk!']] },
  b2: { s: 2, title: 'Het Herfstkristal', p: [['egel', 'player', 'l', 'Oei, ik zie alles in vieren… Je verdient het Herfstkristal!'], ['pim', 'opa', 'l', 'Brrr… het wordt koud. Ik ruik sneeuw. Of is het Opa\'s sok?']] },
  w12: { s: 3, title: 'Komma-kristal', p: [['chaos', 'pim', 'l', 'Ik heb overal komma\'s gestrooid! 2,5 of 25? Niemand weet het meer!'], ['opa', 'player', 'r', 'Een komma op de goede plek is goud waard. Op naar het ijs!']] },
  w13: { s: 3, title: 'Procentenpiek', p: [['pim', 'opa', 'l', 'De berg is voor 50% beklommen. Of 75%? Ik ben vooral 100% moe.'], ['opa', 'pim', 'r', '50% is de helft, Pim. Nog even doorzetten!']] },
  w14: { s: 3, title: 'Verhoudings-gletsjer', p: [['chaos', 'opa', 'l', 'Op mijn kaart is de finish maar 3 centimeter ver! Haha, jullie verdwalen toch.'], ['opa', 'player', 'r', 'Schaal 1 : 100.000… dan is dat 3 kilometer. Kom op!']] },
  w15: { s: 3, title: 'Noorderlicht-finale', p: [['chaos', 'player', 'l', 'De laatste race! Alles door elkaar: breuken, procenten, klokken! Dit win je nooit!'], ['player', 'chaos', 'l', 'Ik heb alle seizoenen geoefend. Gas erop!']] },
  b3: { s: 3, title: 'Het Winterkristal', p: [
    ['chaos', 'player', 'l', 'Je… je hebt gewonnen. Weet je waarom ik de kristallen pakte? Niemand wilde ooit met mij rekenen.'],
    ['player', 'chaos', 'l', 'Dan rekenen we vanaf nu samen! Race je mee?'],
    ['opa', 'pim', 'n', 'Alle vier de seizoenen zijn weer in orde. En Graaf Chaos? Die heet nu gewoon Graaf Gezellig. 🎉'] ] },
};
const CHAR_NAMES = { opa: 'Opa Tandwiel', pim: 'Pim de mol', chaos: 'Graaf Chaos', kikker: 'Kikkerkoning', victor: 'Vulkaan-Victor', uil: 'Uil Komma', egel: 'Egel-ridder', player: '' };
/* Grogs verhaalstrips (deel 7): welke strips bij welk verhaal horen; elke strip = 3 panelen = 3 stappen */
const STRIP_FOR = { intro: [1], w0: [2], w3: [3], b0: [4], w4: [5], w7: [6], b1: [7], w8: [8], w11: [9], b2: [10], w12: [11, 12], w14: [13], w15: [14], b3: [15, 16] };
const STRIP_PICS = {
  1: ['💎💎💎💎 ❓', '🦹 😂', '🏎️💨 🦹'], 2: ['🌷🙃', '🦹 🙈 1 2 3', '☝️ 1 2 3 🙂'], 3: ['🐸 ✋ 🛑', '🐸 2️⃣ ✖️', '🏎️ 👍 2️⃣'], 4: ['🐸 💎', '💎 1/4 ✅', '🦹 😠 ☀️'],
  5: ['🍦 💶💶💶', '🍦 💧', '🏎️ 🧮 ✅'], 6: ['🌋 😠', '🌋 🔥 ✖️', '🏎️ 6️⃣7️⃣ 👍'], 7: ['🌋 😎', '💎 ☀️', '🔧 🔥 🎉'], 8: ['🦹 💨🍂', '🥧 💨 😱', '🏎️ 🥧 ✋'],
  9: ['🦔 🛑 ½', '🦔 ⚔️', '🐹 👍'], 10: ['🦔 😵 ¼', '🦔 💎 🍂', '🏎️ ❄️ ➡️'], 11: ['🐹 🥶', '🔧 ⛓️ 🏎️', '🏎️ 🌌'], 12: ['🦉 ❓ ,', '🦉 😵‍💫', '🏎️ 🤝 🦉'],
  13: ['🦉 💡', '🦉 💎 ❄️', '🦉 🤝 🏎️'], 14: ['🦹 🏁 😈', '🦹 🌀', '🏎️ 🧮 ✅'], 15: ['🦹 😢', '🦹 🧩', '🏎️ 🤝 🦹'], 16: ['🌷☀️🍂❄️ 🎉', '🦹 🏎️ ❓', '🎉 🎉 🎉'],
};
/* plaatjesversie voor groep 1-2 (geen lezen nodig) */
const STORY_PICS = {
  intro: ['👋 🔧 🏎️', '👋 🐹 👓', '🦹 💎💎💎💎 ➡️ 👜', '🌷☀️🍂❄️ ❓ ➡️ 🏎️💨', '🏎️💨 🏁 👍'],
  w0: ['🐞🐞🐞 ❓', '☝️ 1 2 3 … 🙂'],
  w1: ['🦆🦆 + 🦆🦆🦆 ❓', '✋ = ✌️ + 🤟 👍'],
  b0: ['🐸 ➡️ 💎 🌷', '🎉 ➡️ ☀️ 😎'],
};
