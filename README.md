# ⚡ Rekenrace

Een hoofdrekenspel voor **groep 1 t/m 8**: kies je eigen racenaam en avatar en race door de poort met het goede antwoord!

**Speel direct:** https://kmhkasper-boop.github.io/rekenrace/ (werkt ook offline als app)

## Het verhaal: De Gestolen Seizoenen
Graaf Chaos heeft de vier seizoenskristallen gestolen. Samen met Opa Tandwiel en Pim de mol race jij door **Lente, Zomer, Herfst en Winter** om ze terug te halen. Elk seizoen heeft 4 werelden met 8 levels en een eindbaas (Kikkerkoning, Vulkaan-Victor, Uil Komma en Graaf Chaos): **144 levels** in totaal, van tellen tot 5 tot procenten, verhoudingen en contextsommen (groep 8).

## Hoe speel je?
- Bovenaan staat een som. Er komen drie poorten aan: rijd door de poort met het goede antwoord.
- 👆 Veeg links/rechts (of tik links/rechts). Op de computer: pijltjes of A/D. Veeg omhoog (↑) voor **turbo**.
- Fout? Je krijgt een tip en de som komt later terug (Leitner-herhaling).
- 🎟️ **Overslaan-bon**: ongeveer 1 per 3 levels (max. 3). De overgeslagen som komt later in de rit terug.
- 🔥 **Combo-turbo** na 5 goed op rij.
- ⚡ **Versnellen**: stuur naar de goede baan en veeg omhoog (of houd je vinger ~0,35 s vast; op de computer W, ↑ of spatie). Snel goed = +1 munt.
- 📖 **Verhaaltjessommen** zijn optioneel (bij het maken van het profiel, bij de eerste wereld en bij Ouders). Uit = dezelfde som, kaal. De speler kan dit zelf omzetten met het 📖-knopje naast de som (en op het levelscherm); in de strip zet 📖 naast de ballon het verhaal aan/uit.
- 🧒 **Groep 1-2** (Lente-werelden 1-2): plaatjes in plaats van tekst (stippen, appels, getallenlijn), stippen-poorten, een wijzende hand als uitleg, iconen-menu en een plaatjesverhaal.

## Extra
- 🧭 **Instaptest** (optioneel, 12 vragen, ±2 min): begint op jouw niveau. Overslaan = start bij Lente level 1. Opnieuw doen kan per profiel.
- 👻 **Spookrace** tegen je eigen beste rit of tegen een ander profiel op dit apparaat.
- 👥 Meerdere **profielen** op één apparaat.
- 🌷 Het menu volgt het **echte seizoen** (bonusmunt in levels van het huidige seizoen).
- 🚗 **Garage** met 16 voertuigen (4 per seizoen; de eindbazen geven een speciaal voertuig) en kleuren.
- 🏷️ **Stickerboek**, ⭐ **sterrenkaart**, ⏱️ **dagrecord**.
- ☕ **Rustmomenten** tussen levels en een **adempauze** na elke 3 levels.
- 🧘 **Rustige modus** zonder tijdsdruk.
- 👪 **Voor ouders** (2 sec. vasthouden): sterke en zwakke onderwerpen, een *geschat* niveau (vergelijkbaar met Cito; geen officiële toets), tempo, rustige modus, focus op tafels, instaptest opnieuw, profiel wissen.

## Techniek
- Broncode in `src/` (`engine/`, `data/`, `art/`, `ui/`). `node tools/build.js` maakt er één `index.html` plus `sw.js` van.
- Afbeeldingen in `assets/*.webp` worden automatisch opgenomen en offline gecachet. Zonder afbeelding tekent het spel alles zelf (canvas).
- Geen externe verzoeken: het lettertype staat in `fonts/`. Voortgang staat alleen in de browser (localStorage `rekenrace_v2`; v1-voortgang wordt automatisch overgenomen).
- Tests: `tests/v2.test.js` (Playwright): generatoren, instaptest, voortgang, bonnen, profielen, migratie en lay-outs.

## Art (Grog, deel 1-7)
`python3 tools/art.py` zet `/workspace/rekenrace_assets` om naar `assets/*.webp` (136 bestanden, ±5,7 MB, zelfde domein, door de service worker gecachet) en schrijft `src/data/strips.js` uit `bubbles.json`. Elke tekenfunctie valt terug op de procedurele tekening als een afbeelding ontbreekt.
- Achtergrond: far (landschap/portret), mid-laag met parallax, near-sprites in de berm. Wegtexturen worden (nog) niet gebruikt.
- Voertuigen: grijze sprites, ingekleurd met multiply + alfamasker (cache per kleur); herfst_3 (eenhoorn) eerst ontkleurd.
- Personages: char_<id>_<0 blij|1 verrast|2 boos>; speler a/b/c volgt de avatar; speler_b bijgesneden tot buste. Herfstbaas is nu de Egel-ridder (Uil Komma verschijnt in de winter), zoals in de strips.
- Verhaal: 16 strips (STRIP_FOR in data/story.js), paneel voor paneel, tekst in de ballon, met naam van de speler; groep 1-2 ziet pictogrammen in de ballon. Lege vlakken (strip 01/04/13) worden weggeknipt. Verhalen zonder strip gebruiken de oude scène.
- Rustmomenten: 8 animaties (4 frames, 6 fps).
- UI: poortbogen (normaal/goed/fout), munt, ster, bon, kristallen, embleem, wereldiconen, garage-achtergrond. De knop-sprites worden niet gebruikt (CSS-knoppen blijven).

## v2.5: Kleuters apart, Zelf kiezen, tel-rijtjes
- **Hoofdroute begint bij groep 3.** Lente: Splits-sloot (splitsen tot 10, +/− tot 10, dubbel, buurgetallen tot 20) → Bruggetje (plus/min tot 20, over de 10) → Tulpentuin (hele/halve uren, geld tot € 10, tientallen) → Klokkentoren (halve uren, +/− tot 100 zonder overschrijden, tientallen erbij/eraf; Kikkerkoning). Zomer t/m Winter ongewijzigd.
- **Kleuters** (🧸, menu en instaptest): de oude Tel-tuin en Splits-sloot (groep 1-2), levels 144-161, met alleen plaatjes, de hand-uitleg en eigen sterren. Geen verhaal, telt niet mee voor de hoofdroute.
- **Migratie (v2.4 → v2.5, `migrate25`)**: oud w0/w1 → kleuter-levels; oud Bruggetje (w2) → nieuw w1; Klokkentoren en verder blijven gelijk. Splits-sloot en Tulpentuin worden 'gehaald via instap' (0 sterren) als je al verder was. Sterren, munten en feiten blijven bewaard.
- **Zelf kiezen** (🎛️): soort som, getallen tot (10 … 10.000), moeilijk (🙂 😎 🔥), en onder 'meer' extra's en tafels. 🎲 = maakt niet uit. 15 sommen op het baan van het huidige seizoen, 40% munten, geen verhaal of voortgang. De laatste keuze wordt per profiel bewaard.
- **Tel-plaatjes**: stippen en appels in rijtjes van 3 (een rij van 4 als er anders 1 overblijft), boven 10 in tienvakken.
