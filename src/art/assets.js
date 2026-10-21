/* ===== art-haken =====
   De build zet hier de lijst met afbeeldingen uit /assets (webp, zelfde domein, door de service worker gecachet).
   Elke tekenfunctie vraagt eerst ART.img(naam); is die er niet (nog niet geladen of niet aanwezig), dan tekenen we procedureel.
   Namen: bg_<seizoen>[_w<0-3>] (lucht+horizon), map_<seizoen>, veh_<voertuig-id>, char_<personage>, boss_<baas>, decor_<type>, rest_<scène>, ui_logo */
const ASSET_FILES = /*@ASSETS*/[];
const ART = {
  imgs: {}, n: 0,
  load() { for (const n of ASSET_FILES) { const im = new Image(); im.decoding = 'async'; im.onload = () => { this.imgs[n] = im; this.n++; }; im.src = 'assets/' + n + '.webp'; } },
  img(n) { return this.imgs[n] || null; },
  has(n) { return ASSET_FILES.includes(n); },
};
ART.load();
