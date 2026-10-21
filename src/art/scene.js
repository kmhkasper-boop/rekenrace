/* ===== racebaan per seizoen (pseudo-3D) ===== */
const THEMES = [
  [ // lente
    { sky: ['#7fd0ff', '#e0f6ff'], grass: ['#86dd5c', '#79d14f'], road: ['#6a7796', '#63708e'], rumble: ['#ff6fb5', '#ffffff'], hill: ['#5cbf4f', '#9be37a'], decor: ['tulip', 'tulip', 'tree', 'ladybug'], far: 'windmill', wx: 'petal', sun: '#fff3a0' },
    { sky: ['#8fd8ff', '#eaf9ff'], grass: ['#7fd45a', '#73c94e'], road: ['#677596', '#5f6d8d'], rumble: ['#ffd23f', '#ffffff'], hill: ['#56b44c', '#8fdc72'], decor: ['reed', 'duck', 'tulip', 'tree'], far: 'windmill', wx: 'petal', sun: '#fff3a0', ditch: true },
    { sky: ['#78c8ff', '#ddf3ff'], grass: ['#8adf60', '#7dd354'], road: ['#6a7796', '#63708e'], rumble: ['#9b59ff', '#ffffff'], hill: ['#4fb446', '#86da68'], decor: ['tree', 'tulip', 'tree', 'bridge'], far: 'windmill', wx: 'petal', sun: '#fff3a0' },
    { sky: ['#8ec9ff', '#ffe9c9'], grass: ['#80d65a', '#74ca4e'], road: ['#626f8f', '#5b6888'], rumble: ['#ff8a2a', '#ffffff'], hill: ['#5cb050', '#8fd474'], decor: ['tulip', 'tower', 'tree', 'tulip'], far: 'tower', wx: 'petal', sun: '#fff0b0' },
  ],
  [ // zomer
    { sky: ['#3fb8ff', '#c9f1ff'], grass: ['#ffe39e', '#f8d88a'], road: ['#5f7192', '#58698a'], rumble: ['#4cc3ff', '#ffffff'], hill: ['#2fa8e0', '#5cc6f0'], decor: ['palm', 'boat', 'parasol', 'palm'], sea: true, wx: 'sparkle', sun: '#fff3a0' },
    { sky: ['#4fc0ff', '#d6f5ff'], grass: ['#ffe8a8', '#f9dc92'], road: ['#5f7192', '#58698a'], rumble: ['#ff6fb5', '#ffffff'], hill: ['#2fa8e0', '#5cc6f0'], decor: ['parasol', 'palm', 'castle', 'parasol'], sea: true, wx: 'sparkle', sun: '#fff3a0' },
    { sky: ['#5ac8ff', '#ffeede'], grass: ['#ffe39e', '#f8d88a'], road: ['#66779a', '#5f6f91'], rumble: ['#ff9ac8', '#ffffff'], hill: ['#2fa8e0', '#5cc6f0'], decor: ['icecream', 'palm', 'parasol', 'icecream'], sea: true, wx: 'sparkle', sun: '#fff7d6' },
    { sky: ['#2d1a5a', '#ff9364'], grass: ['#5b4a70', '#524266'], road: ['#352e47', '#2f2940'], rumble: ['#ff7a1a', '#ffd23f'], hill: ['#24183a', '#3e2a58'], decor: ['rock', 'palm', 'rock'], volcano: true, wx: 'ember', sun: '#ffb36b' },
  ],
  [ // herfst
    { sky: ['#f3b47a', '#ffeed8'], grass: ['#9fae4a', '#93a142'], road: ['#5d6584', '#566079'], rumble: ['#e07a2e', '#ffffff'], hill: ['#c76a2a', '#e39a4a'], decor: ['autumn', 'pine', 'autumn', 'mushroom'], wx: 'leaf', sun: '#fff0c0' },
    { sky: ['#b9c9a8', '#eef2df'], grass: ['#7f9a4a', '#738e42'], road: ['#5a6378', '#535b70'], rumble: ['#a0c040', '#ffffff'], hill: ['#6f8a4a', '#94ad66'], decor: ['reed', 'mushroom', 'autumn', 'sign'], wx: 'leaf', sun: '#fbffe0', fog: true, ditch: true },
    { sky: ['#e8a06a', '#ffe4c4'], grass: ['#a7a04c', '#9b9444'], road: ['#5d6584', '#566079'], rumble: ['#ff8a2a', '#ffffff'], hill: ['#b5652e', '#d48d4c'], decor: ['autumn', 'rock2', 'pumpkin', 'autumn'], wx: 'leaf', sun: '#fff0c0' },
    { sky: ['#6b4a7a', '#e8b68a'], grass: ['#6f7a3a', '#646e34'], road: ['#4a4f66', '#43485e'], rumble: ['#ffd23f', '#ffffff'], hill: ['#4a3a5a', '#6a5070'], decor: ['autumn', 'owltree', 'mushroom', 'pumpkin'], wx: 'leaf', sun: '#fff0c0', moon: true },
  ],
  [ // winter
    { sky: ['#a8dbff', '#f0faff'], grass: ['#f5fbff', '#e3f0fa'], road: ['#66779a', '#5f6f91'], rumble: ['#7fe7ff', '#ffffff'], hill: ['#cfe4f5', '#ffffff'], decor: ['pine', 'crystal', 'pine', 'snowman'], wx: 'snow', sun: '#fffbe0' },
    { sky: ['#9ad6ff', '#eef9ff'], grass: ['#f5fbff', '#e6f2fb'], road: ['#66779a', '#5f6f91'], rumble: ['#3d8bfd', '#ffffff'], hill: ['#c3dcf2', '#f4faff'], decor: ['pine', 'flag', 'pine', 'snowman'], wx: 'snow', sun: '#fffbe0', peaks: true },
    { sky: ['#8ecff5', '#e6f6ff'], grass: ['#eef8ff', '#ddeefa'], road: ['#5f7194', '#58698c'], rumble: ['#b98aff', '#ffffff'], hill: ['#bfe2f7', '#e8f6ff'], decor: ['ice', 'pine', 'igloo', 'pine'], wx: 'snow', sun: '#fffbe0', peaks: true },
    { sky: ['#0b1a3a', '#2a3f7a'], grass: ['#dfeaf7', '#cfdcee'], road: ['#3e4866', '#38415e'], rumble: ['#5fff8a', '#ffffff'], hill: ['#1d2a50', '#33457a'], decor: ['pine', 'igloo', 'pine', 'crystal'], wx: 'snow', sun: '#f4f8ff', aurora: true, moon: true },
  ],
];
const LANE_COL = ['#ff6fb5', '#4cc3ff', '#ffb03b'];
const cv = $('#cv'), ctx = cv.getContext('2d');
let W = 0, H = 0, DPR = 1, HOR = 0, PY = 0, F = 0, LANE = 0, CX = 0, ZNEAR = 1;
const ZP = 4, ZS = 10, ZFAR = 70, SEG = 2;
let skyGrad = null, skyKey = '';
let theme = THEMES[0][0], themeS = 0, themeW = 0, dist = 0, camX = 0, TG = 0;
const player = { x: 0, lane: 1, tilt: 0, hop: 0 };
let decor = [], nextDecor = 0, parts = [], rows = [], wx = [];
let boostT = 0, bumpT = 0, shakeT = 0, comboT = 0;
function setTheme(s, w) { themeS = s; themeW = w; theme = THEMES[s][w]; skyKey = ''; wx = []; }
function layout() {
  DPR = Math.min(2, window.devicePixelRatio || 1); W = window.innerWidth; H = window.innerHeight;
  cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); cv.style.width = W + 'px'; cv.style.height = H + 'px';
  LANE = Math.min(W * .3, H * .4, 260); F = LANE * ZP; CX = W / 2;
  const hb = ($('#hudTop').getBoundingClientRect().bottom) || 120;
  PY = H - Math.max(46, Math.min(H * .14, LANE * .7));
  HOR = Math.max(hb + 12, H * (H >= W ? .3 : .26));
  if (PY - HOR < 140) HOR = PY - 140;
  ZNEAR = ZP * (PY - HOR) / (H - HOR + 2); skyKey = '';
}
const gy = z => HOR + (PY - HOR) * ZP / z;
const sc = z => F / z;
function quad(xl0, xr0, y0, xl1, xr1, y1, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(xl0, y0 + .6); ctx.lineTo(xr0, y0 + .6); ctx.lineTo(xr1, y1); ctx.lineTo(xl1, y1); ctx.closePath(); ctx.fill(); }

function drawSky() {
  const th = theme, m = Math.min(W, H);
  const key = th.sky.join() + H + HOR;
  if (key !== skyKey) { skyGrad = ctx.createLinearGradient(0, 0, 0, HOR); skyGrad.addColorStop(0, th.sky[0]); skyGrad.addColorStop(1, th.sky[1]); skyKey = key; }
  ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, W, HOR + 2);
  const key2 = SEASONS[themeS].key, bg = ART.img(`bg_${key2}_w${themeW}`) || ART.img('bg_' + key2);
  if (bg) { drawImgCover(ctx, bg, -W * .05, 0, W * 1.1, HOR + 3, -camX * 12); if (R && R.lv && R.lv.boss) drawBoss(W * .66 - camX * 10, HOR + 2, m * .11); return; }
  if (th.aurora) { for (let i = 0; i < 3; i++) { const g = ctx.createLinearGradient(0, HOR * .1, 0, HOR * .7); const cA = ['rgba(95,255,138,', 'rgba(127,231,255,', 'rgba(185,138,255,'][i]; g.addColorStop(0, cA + '0)'); g.addColorStop(.5, cA + '.45)'); g.addColorStop(1, cA + '0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, HOR * .6); for (let x = 0; x <= W + 20; x += 20) ctx.lineTo(x, HOR * (.25 + .12 * Math.sin(x * .01 + TG * .6 + i * 2)) + i * 12); ctx.lineTo(W, HOR * .7); ctx.lineTo(0, HOR * .7); ctx.fill(); } }
  if (th.moon || th.aurora) { ctx.fillStyle = '#fff'; for (let i = 0; i < 30; i++) { const x = (i * 97.3) % W, y = (i * 53.7) % (HOR * .8); ctx.globalAlpha = .4 + .4 * Math.sin(TG * 2 + i); circ(ctx, x, y, 1.3); } ctx.globalAlpha = 1; }
  const sx = W * .8 - camX * 6, sy = HOR * .5;
  ctx.fillStyle = 'rgba(255,255,255,.35)'; circ(ctx, sx, sy, m * .085); ctx.fillStyle = th.sun; circ(ctx, sx, sy, m * .06);
  if (th.moon) { ctx.fillStyle = th.sky[0]; circ(ctx, sx + m * .025, sy - m * .015, m * .052); }
  if (!th.aurora) { ctx.fillStyle = th.volcano ? '#9c5a86' : th.fog ? '#f4f7ec' : '#f7fcff';
    for (let i = 0; i < 4; i++) { const cw = m * (.12 + i * .02), x = ((i * 0.31 * W + TG * (8 + i * 4)) % (W + cw * 3)) - cw * 1.5 - camX * 3, y = HOR * (.25 + (i % 2) * .3) + 10;
      circ(ctx, x, y, cw * .35); circ(ctx, x + cw * .35, y - cw * .12, cw * .3); circ(ctx, x + cw * .7, y, cw * .28); ctx.fillRect(x, y, cw * .7, cw * .25); } }
  if (th.volcano) { const vx = W * .25 - camX * 8, vw = m * .5, vh = m * .3;
    ctx.fillStyle = '#1c1230'; ctx.beginPath(); ctx.moveTo(vx - vw / 2, HOR + 2); ctx.lineTo(vx - vw * .1, HOR - vh); ctx.lineTo(vx + vw * .1, HOR - vh); ctx.lineTo(vx + vw / 2, HOR + 2); ctx.fill();
    ctx.fillStyle = '#ff7a1a'; ctx.beginPath(); ctx.moveTo(vx - vw * .1, HOR - vh); ctx.lineTo(vx - vw * .04, HOR - vh * .7); ctx.lineTo(vx + vw * .02, HOR - vh * .85); ctx.lineTo(vx + vw * .1, HOR - vh); ctx.fill();
    ctx.fillStyle = 'rgba(80,60,100,.5)'; for (let i = 0; i < 3; i++) { const p = (TG * .3 + i / 3) % 1; circ(ctx, vx + Math.sin(p * 6 + i) * 10, HOR - vh - p * vh * .8, m * (.02 + p * .04)); } }
  if (th.peaks) { ctx.fillStyle = '#dbe9f7'; for (let i = 0; i < 4; i++) { const px = (i * W / 3.2) - camX * 6, ph = m * (.18 + (i % 2) * .08); tri(ctx, px - m * .2, HOR + 2, px, HOR - ph, px + m * .2, HOR + 2); ctx.fillStyle = '#fff'; tri(ctx, px - m * .06, HOR - ph * .7, px, HOR - ph, px + m * .06, HOR - ph * .7); ctx.fillStyle = '#dbe9f7'; } }
  if (th.sea) { ctx.fillStyle = th.hill[0]; ctx.fillRect(0, HOR - m * .035, W, m * .035 + 2);
    ctx.fillStyle = 'rgba(255,255,255,.7)'; for (let i = 0; i < 6; i++) { const x = ((i * W / 6 + TG * 12) % W); ctx.fillRect(x, HOR - m * .02 + (i % 2) * 4, m * .05, 2); } }
  else for (let L = 0; L < 2; L++) { ctx.fillStyle = th.hill[L]; ctx.beginPath(); ctx.moveTo(0, HOR + 2);
    const amp = m * (L ? .05 : .085), off = -camX * (L ? 18 : 10);
    for (let x = 0; x <= W + 20; x += 20) ctx.lineTo(x, HOR - amp * (.55 + .45 * Math.sin((x + off) * (L ? .011 : .007) + L * 2)));
    ctx.lineTo(W, HOR + 2); ctx.closePath(); ctx.fill(); }
  if (th.far) drawFar(th.far, W * .18 - camX * 14, HOR + 1, m * .13);
  if (R && R.lv && R.lv.boss) drawBoss(W * .66 - camX * 10, HOR + 2, m * .11);
}
function drawFar(type, x, y, s) {
  const c = ctx;
  if (type === 'windmill') { c.fillStyle = '#8a5a3a'; tri(c, x - s * .25, y, x, y - s * 1.1, x + s * .25, y); c.fillStyle = '#c94a3a'; tri(c, x - s * .14, y - s * .85, x, y - s * 1.2, x + s * .14, y - s * .85);
    c.save(); c.translate(x, y - s * 1); c.rotate(TG * .8); c.fillStyle = '#f4f0e8'; for (let i = 0; i < 4; i++) { c.rotate(Math.PI / 2); c.fillRect(-s * .04, 0, s * .08, s * .55); } c.restore(); }
  else if (type === 'tower') { c.fillStyle = '#b07a5a'; c.fillRect(x - s * .14, y - s * 1.1, s * .28, s * 1.1); c.fillStyle = '#5a3a6a'; tri(c, x - s * .2, y - s * 1.1, x, y - s * 1.45, x + s * .2, y - s * 1.1);
    c.fillStyle = '#fff'; circ(c, x, y - s * .85, s * .1); c.strokeStyle = '#1f2a44'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y - s * .85); c.lineTo(x, y - s * .92); c.moveTo(x, y - s * .85); c.lineTo(x + s * .05, y - s * .85); c.stroke(); }
}
function drawBoss(x, y, s) {
  const hit = R && R.bossHit > 0 ? R.bossHit : 0, hp = R ? Math.max(.25, 1 - R.correct / R.bossNeed) : 1;
  const id = R.lv.w % 4 === 3 ? SEASONS[R.lv.s].boss : 'chaos';
  const wob = Math.sin(TG * 3) * s * .05 + (hit ? Math.sin(TG * 60) * s * .08 : 0);
  ctx.save(); if (hit) ctx.globalAlpha = .7 + .3 * Math.sin(TG * 40);
  drawChar(ctx, id, x + wob, y, s * 1.6 * (.7 + .3 * hp), hit ? 2 : 0, TG);
  ctx.restore();
}
function drawGround() {
  const th = theme;
  ctx.fillStyle = th.grass[0]; ctx.fillRect(0, HOR, W, H - HOR);
  const zf = ZFAR, yf = gy(zf), sf = sc(zf), xf = CX - camX * sf;
  ctx.fillStyle = th.road[0]; ctx.beginPath(); ctx.moveTo(xf - 1.78 * sf, yf + 1); ctx.lineTo(xf + 1.78 * sf, yf + 1); ctx.lineTo(CX, HOR); ctx.closePath(); ctx.fill();
  const k0 = Math.floor((dist + ZNEAR) / SEG), k1 = Math.floor((dist + ZFAR) / SEG);
  for (let k = k1; k >= k0; k--) {
    let z0 = k * SEG - dist, z1 = z0 + SEG;
    if (z0 < ZNEAR) z0 = ZNEAR; if (z1 > ZFAR) z1 = ZFAR; if (z1 <= z0) continue;
    const y0 = gy(z0), y1 = gy(z1), s0 = sc(z0), s1 = sc(z1), x0 = CX - camX * s0, x1 = CX - camX * s1, alt = k & 1;
    if (z1 < 46) { ctx.fillStyle = th.grass[alt]; ctx.fillRect(0, y1, W, y0 - y1 + 1); }
    if (th.ditch) { quad(x0 - 3.2 * s0, x0 - 2.5 * s0, y0, x1 - 3.2 * s1, x1 - 2.5 * s1, y1, alt ? '#5cb8e8' : '#6cc4ef'); quad(x0 + 2.5 * s0, x0 + 3.2 * s0, y0, x1 + 2.5 * s1, x1 + 3.2 * s1, y1, alt ? '#5cb8e8' : '#6cc4ef'); }
    quad(x0 - 1.78 * s0, x0 + 1.78 * s0, y0, x1 - 1.78 * s1, x1 + 1.78 * s1, y1, th.rumble[alt]);
    quad(x0 - 1.6 * s0, x0 + 1.6 * s0, y0, x1 - 1.6 * s1, x1 + 1.6 * s1, y1, th.road[alt]);
    if (!alt) for (const lx of [-.5, .5]) quad(x0 + (lx - .035) * s0, x0 + (lx + .035) * s0, y0, x1 + (lx - .035) * s1, x1 + (lx + .035) * s1, y1, 'rgba(255,255,255,.85)');
  }
}
function drawDecor(d, z) {
  const s = sc(z) * d.size; if (s < 2) return;
  const x = CX + (d.X - camX) * sc(z), y = gy(z), c = ctx;
  c.fillStyle = 'rgba(0,0,0,.12)'; ell(c, x, y, s * .35, s * .08);
  const im = ART.img('decor_' + d.type); if (im) { drawImgBottom(c, im, x, y, s * .9); return; }
  switch (d.type) {
    case 'tree': c.fillStyle = '#8b5a2b'; c.fillRect(x - s * .06, y - s * .45, s * .12, s * .45); c.fillStyle = '#3fae49'; circ(c, x, y - s * .7, s * .32); circ(c, x - s * .2, y - s * .55, s * .22); circ(c, x + s * .2, y - s * .55, s * .22);
      c.fillStyle = themeS === 0 ? '#ffc2dc' : '#62cf5d'; circ(c, x - s * .1, y - s * .8, s * .07); circ(c, x + s * .12, y - s * .66, s * .06); circ(c, x - s * .2, y - s * .55, s * .05); break;
    case 'tulip': for (let i = -1; i <= 1; i++) { const tx = x + i * s * .16; c.strokeStyle = '#3f9a3a'; c.lineWidth = Math.max(1, s * .03); c.beginPath(); c.moveTo(tx, y); c.lineTo(tx, y - s * .32); c.stroke(); c.fillStyle = d.col; c.beginPath(); c.moveTo(tx - s * .07, y - s * .42); c.lineTo(tx - s * .07, y - s * .32); c.quadraticCurveTo(tx, y - s * .26, tx + s * .07, y - s * .32); c.lineTo(tx + s * .07, y - s * .42); c.lineTo(tx + s * .035, y - s * .37); c.lineTo(tx, y - s * .43); c.lineTo(tx - s * .035, y - s * .37); c.closePath(); c.fill(); } break;
    case 'ladybug': c.fillStyle = '#3fae49'; ell(c, x, y - s * .05, s * .22, s * .07); c.fillStyle = '#e8322f'; c.beginPath(); c.arc(x, y - s * .08, s * .11, Math.PI, 0); c.fill(); c.fillStyle = '#1f2a44'; circ(c, x - s * .04, y - s * .12, s * .02); circ(c, x + s * .05, y - s * .11, s * .02); circ(c, x + s * .12, y - s * .1, s * .04); break;
    case 'reed': c.strokeStyle = '#6b8a3a'; c.lineWidth = Math.max(1, s * .03); for (let i = 0; i < 4; i++) { const rx = x + (i - 1.5) * s * .08; c.beginPath(); c.moveTo(rx, y); c.quadraticCurveTo(rx + s * .05, y - s * .3, rx + s * .02 * Math.sin(TG + i), y - s * .55); c.stroke(); c.fillStyle = '#7a5230'; ell(c, rx + s * .02 * Math.sin(TG + i), y - s * .5, s * .025, s * .07); } break;
    case 'duck': { const bob = Math.sin(TG * 3 + d.X) * s * .02; c.fillStyle = '#fff'; ell(c, x, y - s * .1 + bob, s * .16, s * .09); circ(c, x + s * .12, y - s * .22 + bob, s * .07); c.fillStyle = '#ffb03b'; tri(c, x + s * .18, y - s * .23 + bob, x + s * .26, y - s * .21 + bob, x + s * .18, y - s * .19 + bob); c.fillStyle = '#1f2a44'; circ(c, x + s * .14, y - s * .24 + bob, s * .015); break; }
    case 'bridge': c.fillStyle = '#b07a5a'; c.beginPath(); c.arc(x, y, s * .4, Math.PI, 0); c.lineTo(x + s * .3, y); c.arc(x, y, s * .3, 0, Math.PI, true); c.fill(); c.fillStyle = '#fff'; c.font = `700 ${s * .2}px ${FONT}`; c.textAlign = 'center'; c.fillText('10', x, y - s * .45); break;
    case 'tower': drawFar('tower', x, y, s * .6); break;
    case 'palm': c.strokeStyle = '#9a6a3a'; c.lineWidth = Math.max(1, s * .09); c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + s * .15 * d.lean, y - s * .5, x + s * .1 * d.lean, y - s * .95); c.stroke();
      c.fillStyle = '#2fae5a'; for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * .6; ell(c, x + s * .1 * d.lean + Math.cos(a) * s * .25, y - s * .95 + Math.sin(a) * s * .12 + s * .06, s * .28, s * .07, a); } break;
    case 'parasol': c.strokeStyle = '#fff'; c.lineWidth = Math.max(1, s * .03); c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - s * .6); c.stroke();
      for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? '#fff' : d.col; c.beginPath(); c.moveTo(x, y - s * .7); c.arc(x, y - s * .55, s * .35, Math.PI + i * Math.PI / 6, Math.PI + (i + 1) * Math.PI / 6); c.closePath(); c.fill(); } c.fillStyle = '#ff9f6b'; rr(c, x - s * .2, y - s * .06, s * .4, s * .06, s * .02); c.fill(); break;
    case 'castle': c.fillStyle = '#f2c46d'; c.fillRect(x - s * .2, y - s * .25, s * .4, s * .25); for (let i = -1; i <= 1; i++) c.fillRect(x + i * s * .14 - s * .04, y - s * .35, s * .08, s * .1); c.fillStyle = '#ff5a5f'; tri(c, x, y - s * .5, x, y - s * .4, x + s * .1, y - s * .45); break;
    case 'boat': { const bob = Math.sin(TG * 2 + d.X) * s * .02; c.fillStyle = '#c94a3a'; c.beginPath(); c.moveTo(x - s * .3, y - s * .12 + bob); c.lineTo(x + s * .3, y - s * .12 + bob); c.lineTo(x + s * .2, y + bob); c.lineTo(x - s * .2, y + bob); c.fill(); c.fillStyle = '#fff'; tri(c, x, y - s * .7 + bob, x, y - s * .15 + bob, x + s * .25, y - s * .15 + bob); break; }
    case 'icecream': c.fillStyle = '#fff'; c.fillRect(x - s * .25, y - s * .35, s * .5, s * .35); c.fillStyle = d.col; c.fillRect(x - s * .28, y - s * .45, s * .56, s * .1); c.fillStyle = '#e0a060'; tri(c, x - s * .06, y - s * .55, x + s * .06, y - s * .55, x, y - s * .38); c.fillStyle = '#ff9ac8'; circ(c, x, y - s * .6, s * .08); break;
    case 'rock': c.fillStyle = '#3a2d4f'; c.beginPath(); c.moveTo(x - s * .35, y); c.lineTo(x - s * .25, y - s * .35); c.lineTo(x + s * .05, y - s * .5); c.lineTo(x + s * .3, y - s * .3); c.lineTo(x + s * .38, y); c.closePath(); c.fill(); c.strokeStyle = '#ff8a2a'; c.lineWidth = Math.max(1, s * .03); c.beginPath(); c.moveTo(x - s * .1, y - s * .05); c.lineTo(x, y - s * .25); c.lineTo(x + s * .1, y - s * .35); c.stroke(); break;
    case 'rock2': c.fillStyle = '#8a8a8a'; c.beginPath(); c.moveTo(x - s * .3, y); c.lineTo(x - s * .2, y - s * .3); c.lineTo(x + s * .1, y - s * .38); c.lineTo(x + s * .3, y); c.closePath(); c.fill(); c.fillStyle = '#fff'; c.font = `700 ${s * .14}px ${FONT}`; c.textAlign = 'center'; c.fillText('0', x, y - s * .12); break;
    case 'autumn': c.fillStyle = '#7a4a2a'; c.fillRect(x - s * .06, y - s * .45, s * .12, s * .45); c.fillStyle = d.col2; circ(c, x, y - s * .7, s * .32); circ(c, x - s * .2, y - s * .55, s * .22); circ(c, x + s * .2, y - s * .55, s * .22); c.fillStyle = 'rgba(255,255,255,.18)'; circ(c, x - s * .08, y - s * .8, s * .12); break;
    case 'mushroom': c.fillStyle = '#fff3e0'; c.fillRect(x - s * .05, y - s * .2, s * .1, s * .2); c.fillStyle = '#e8322f'; c.beginPath(); c.ellipse(x, y - s * .2, s * .18, s * .12, 0, Math.PI, 0); c.fill(); c.fillStyle = '#fff'; circ(c, x - s * .07, y - s * .25, s * .025); circ(c, x + s * .06, y - s * .27, s * .03); break;
    case 'pumpkin': c.fillStyle = '#ff8a2a'; ell(c, x - s * .08, y - s * .12, s * .1, s * .12); ell(c, x + s * .08, y - s * .12, s * .1, s * .12); ell(c, x, y - s * .12, s * .1, s * .13); c.fillStyle = '#4a8f2a'; c.fillRect(x - s * .015, y - s * .3, s * .03, s * .06); break;
    case 'owltree': c.fillStyle = '#5a3a24'; c.fillRect(x - s * .08, y - s * .9, s * .16, s * .9); c.fillStyle = '#3a2416'; circ(c, x, y - s * .55, s * .06); c.fillStyle = '#ffd23f'; circ(c, x - s * .02, y - s * .56, s * .015); circ(c, x + s * .02, y - s * .56, s * .015); c.fillStyle = '#c76a2a'; circ(c, x, y - s * .95, s * .25); break;
    case 'sign': c.fillStyle = '#8b5a2b'; c.fillRect(x - s * .02, y - s * .4, s * .04, s * .4); c.fillStyle = '#ffe39e'; rr(c, x - s * .2, y - s * .5, s * .4, s * .14, s * .03); c.fill(); c.fillStyle = '#1f2a44'; c.font = `700 ${s * .09}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('1 m = 100 cm', x, y - s * .43); break;
    case 'pine': c.fillStyle = '#7a5230'; c.fillRect(x - s * .05, y - s * .2, s * .1, s * .2);
      for (let i = 0; i < 3; i++) { const w = s * (.38 - i * .09), yy = y - s * (.15 + i * .25); c.fillStyle = themeS === 2 ? '#3f7a4a' : '#2f8a57'; tri(c, x - w, yy, x, yy - s * .38, x + w, yy); if (themeS === 3) { c.fillStyle = '#fff'; tri(c, x - w * .4, yy - s * .23, x, yy - s * .38, x + w * .4, yy - s * .23); } } break;
    case 'snowman': c.fillStyle = '#fff'; circ(c, x, y - s * .14, s * .15); circ(c, x, y - s * .38, s * .11); c.fillStyle = '#1f2a44'; circ(c, x - s * .04, y - s * .41, s * .015); circ(c, x + s * .04, y - s * .41, s * .015); c.fillStyle = '#ff8a2a'; tri(c, x, y - s * .38, x + s * .1, y - s * .37, x, y - s * .35); c.fillStyle = '#f4f4f4'; ell(c, x, y - s * .34, s * .06, s * .015); c.fillStyle = '#e8322f'; c.fillRect(x - s * .1, y - s * .29, s * .2, s * .04); break;
    case 'igloo': c.fillStyle = '#f4faff'; c.beginPath(); c.arc(x, y, s * .3, Math.PI, 0); c.fill(); c.strokeStyle = '#c9dcef'; c.lineWidth = 1; for (let i = 1; i < 3; i++) { c.beginPath(); c.arc(x, y, s * .3 * i / 3, Math.PI, 0); c.stroke(); } c.fillStyle = '#9bb6d6'; c.beginPath(); c.arc(x, y, s * .09, Math.PI, 0); c.fill(); break;
    case 'crystal': c.fillStyle = 'rgba(127,231,255,.85)'; c.beginPath(); c.moveTo(x, y - s * .5); c.lineTo(x + s * .12, y - s * .2); c.lineTo(x, y); c.lineTo(x - s * .12, y - s * .2); c.closePath(); c.fill(); c.fillStyle = 'rgba(255,255,255,.6)'; tri(c, x, y - s * .5, x + s * .05, y - s * .2, x - s * .03, y - s * .2); break;
    case 'flag': c.fillStyle = '#8a93a6'; c.fillRect(x - s * .015, y - s * .6, s * .03, s * .6); c.fillStyle = d.col; tri(c, x, y - s * .6, x + s * .22, y - s * .52, x, y - s * .44); break;
    case 'ice': c.fillStyle = 'rgba(200,235,255,.9)'; c.beginPath(); c.moveTo(x - s * .3, y); c.lineTo(x - s * .2, y - s * .35); c.lineTo(x + s * .05, y - s * .45); c.lineTo(x + s * .3, y - s * .2); c.lineTo(x + s * .32, y); c.closePath(); c.fill(); break;
  }
}
function spawnDecor(upTo) {
  while (nextDecor < upTo) {
    const side = Math.random() < .5 ? -1 : 1;
    decor.push({ s: nextDecor, X: side * rnd(2.3, theme.ditch ? 5.2 : 4.6) + (theme.ditch && Math.random() < .3 ? side * .5 : 0), type: pickOne(theme.decor), size: rnd(.8, 1.3), lean: side,
      col: pickOne(['#ff6fb5', '#ffd23f', '#e8322f', '#9b59ff', '#ff8a2a']), col2: pickOne(['#e07a2e', '#c94a3a', '#f2b33d', '#b5651d']) });
    nextDecor += rnd(1.2, 3.2);
  }
  decor = decor.filter(d => d.s - dist > ZNEAR);
}
/* weer: blaadjes, sneeuw, bloesem, vonkjes */
function updateWeather(dt) {
  const want = theme.wx === 'snow' ? 60 : theme.wx === 'leaf' ? 22 : theme.wx === 'petal' ? 18 : 14;
  while (wx.length < want) wx.push({ x: Math.random() * W, y: Math.random() * H - H, v: rnd(30, 90), a: rnd(0, 6), r: rnd(2, 5), c: pickOne(['#ffc2dc', '#fff', '#ffe066', '#e07a2e', '#c94a3a', '#f2b33d']) });
  for (const p of wx) { p.y += p.v * dt * (theme.wx === 'sparkle' ? .3 : 1); p.x += Math.sin(TG + p.a) * 20 * dt - (boostT > 0 ? 60 * dt : 0); p.a += dt; if (p.y > H) { p.y = -10; p.x = Math.random() * W; } }
}
function drawWeather() {
  for (const p of wx) {
    if (theme.wx === 'snow') { ctx.fillStyle = 'rgba(255,255,255,.9)'; circ(ctx, p.x, p.y, p.r * .7); }
    else if (theme.wx === 'leaf') { ctx.fillStyle = [ '#e07a2e', '#c94a3a', '#f2b33d'][Math.floor(p.r) % 3]; ell(ctx, p.x, p.y, p.r * 1.6, p.r * .7, p.a * 2); }
    else if (theme.wx === 'petal') { ctx.fillStyle = 'rgba(255,194,220,.9)'; ell(ctx, p.x, p.y, p.r, p.r * .6, p.a); }
    else if (theme.wx === 'ember') { ctx.fillStyle = 'rgba(255,150,60,.7)'; circ(ctx, p.x, H - p.y % H, p.r * .5); }
    else { ctx.globalAlpha = .5 + .5 * Math.sin(TG * 4 + p.a); ctx.fillStyle = '#fff'; circ(ctx, p.x, p.y % (HOR || 1), p.r * .35); ctx.globalAlpha = 1; }
  }
}
function fitGateFont(texts, s) { // past tekst in de poort (breedte max ~0.95 rijbaan)
  let fs = Math.max(14, .42 * s); ctx.font = `700 ${fs}px ${FONT}`;
  const mw = Math.max(...texts.map(t => ctx.measureText(t).width)), lim = s * .92 - 14;
  if (mw > lim) fs = Math.max(10, fs * lim / mw);
  return fs;
}
function drawGateRow(r) {
  const z = r.z; if (z <= ZNEAR * .8 || z > ZS + .01) return;
  const s = sc(z), g = gy(z);
  let alpha = Math.min(1, r.age / .25);
  if (z < ZP) alpha *= clamp((z - ZP * .72) / (ZP * .28), 0, 1);
  if (r.resolved) alpha *= clamp(1 - (TG - r.tRes) / .5, 0, 1);
  if (alpha <= 0.01) return;
  ctx.save(); ctx.globalAlpha = alpha;
  const bob = Math.sin(TG * 3 + r.cl) * .03;
  const fs = fitGateFont(r.opts, s) * (r.big ? 1.35 : 1);
  ctx.font = `700 ${fs}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (let i = 0; i < 3; i++) {
    const X = i - 1, x = CX + (X - camX) * s, txt = String(r.opts[i]), tw = ctx.measureText(txt).width;
    const pw = Math.min(s * .97, Math.max(.9 * s, tw + 14)), ph = Math.max(r.dots ? .75 * s : .6 * s, fs * 1.3);
    const yb = g - (.52 + bob) * s, yt = yb - ph;
    ctx.fillStyle = 'rgba(0,0,0,.14)'; ell(ctx, x, g, pw * .45, s * .07);
    const beam = r.golden ? 'rgba(255,214,64,.45)' : 'rgba(255,255,255,.4)';
    ctx.fillStyle = beam; ctx.fillRect(x - pw / 2 + 2, yb, Math.max(2, s * .06), g - yb); ctx.fillRect(x + pw / 2 - 2 - Math.max(2, s * .06), yb, Math.max(2, s * .06), g - yb);
    let fill = '#ffffff', border = LANE_COL[i], ink = '#1f2a44';
    if (r.golden) { fill = '#ffe066'; border = '#f5a600'; }
    if (r.resolved) { if (r.skipped) { ctx.globalAlpha = alpha * .4; } else if (i === r.cl) { fill = '#3ccf6e'; border = '#1d8f45'; ink = '#fff'; } else if (i === r.chosen) { fill = '#ff7b7b'; border = '#d64545'; ink = '#fff'; } else ctx.globalAlpha = alpha * .45; }
    ctx.fillStyle = 'rgba(31,42,68,.25)'; rr(ctx, x - pw / 2, yt + Math.max(2, s * .05), pw, ph, Math.max(6, s * .16)); ctx.fill();
    ctx.fillStyle = border; rr(ctx, x - pw / 2, yt, pw, ph, Math.max(6, s * .16)); ctx.fill();
    const bw = Math.max(3, s * .06);
    ctx.fillStyle = fill; rr(ctx, x - pw / 2 + bw, yt + bw, pw - bw * 2, ph - bw * 2, Math.max(4, s * .12)); ctx.fill();
    if (r.golden && !r.resolved) { ctx.fillStyle = '#fff6c9'; for (let k = 0; k < 3; k++) { const a = TG * 4 + k * 2.1 + i; circ(ctx, x + Math.cos(a) * pw * .55, yt + ph / 2 + Math.sin(a) * ph * .7, Math.max(1.5, s * .03)); } }
    if (r.dots && /^\d+$/.test(txt) && +txt <= 10) drawDotPic(ctx, +txt, x, yt + ph / 2, pw - bw * 3, ph - bw * 3, ink === '#fff' ? '#fff' : '#ff5a5f'); else { ctx.fillStyle = ink; ctx.fillText(txt, x, yt + ph / 2 + fs * .04); }
    ctx.globalAlpha = alpha;
  }
  ctx.restore();
}
function drawPlayer() { const sP = F / ZP, x = CX + (player.x - camX) * sP, y = PY - player.hop; drawVehicle(ctx, P.veh, colorHex(P.col, TG), x, y, LANE * 1.25, TG, player.tilt, boostT > 0 || comboT > 0); }
function drawGhost() {
  if (!R || !R.ghost) return; const g = R.ghostState; if (!g || g.diff < 0) return;
  const z = clamp(ZP + g.diff * 1.6 + .3, ZP + .2, ZS - .5), s = sc(z), x = CX + (g.x - camX) * s;
  drawVehicle(ctx, R.ghost.veh || 'bliksem', '#e9f3ff', x, gy(z), LANE * 1.25 * s / sc(ZP), TG, 0, false, true);
  ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.font = `700 ${Math.max(11, s * .12)}px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText('👻 ' + (R.ghost.name || ''), x, gy(z) - s * .62);
}
function drawParticles() {
  for (const p of parts) {
    if (p.t < 0) continue;
    if (p.type === 'coin') { const k = Math.min(1, p.t / p.dur), e = k * k * (3 - 2 * k); const x = p.x0 + (p.tx - p.x0) * e, y = p.y0 + (p.ty - p.y0) * e - Math.sin(k * Math.PI) * 80; const r = (p.gold ? 13 : 11) * (1 - k * .4);
      ctx.fillStyle = '#d99a00'; circ(ctx, x, y + 2, r); ctx.fillStyle = '#ffd23f'; circ(ctx, x, y, r); ctx.fillStyle = '#fff3b0'; circ(ctx, x - r * .3, y - r * .3, r * .3); }
    else { const a = 1 - p.t / p.dur; ctx.globalAlpha = Math.max(0, a); ctx.fillStyle = p.col; circ(ctx, p.x, p.y, p.r * (p.type === 'puff' ? (1 + p.t * 2) : a)); ctx.globalAlpha = 1; }
  }
}
function drawSpeedLines() {
  const k = Math.max(boostT, comboT > 0 ? .8 : 0); if (k <= 0) return;
  ctx.strokeStyle = comboT > 0 ? `rgba(255,190,60,${Math.min(.8, k)})` : `rgba(255,255,255,${Math.min(.7, k)})`; ctx.lineWidth = 3;
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2 + i * .7, r0 = Math.min(W, H) * (.35 + ((TG * 3 + i * .37) % 1) * .4), r1 = r0 + Math.min(W, H) * .12;
    ctx.beginPath(); ctx.moveTo(CX + Math.cos(a) * r0, HOR + (PY - HOR) * .4 + Math.sin(a) * r0 * .7); ctx.lineTo(CX + Math.cos(a) * r1, HOR + (PY - HOR) * .4 + Math.sin(a) * r1 * .7); ctx.stroke(); }
}
function render() {
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  let sx = 0, sy = 0; if (shakeT > 0) { sx = (Math.random() - .5) * 18 * shakeT; sy = (Math.random() - .5) * 12 * shakeT; }
  ctx.save(); ctx.translate(sx, sy);
  drawSky(); drawGround();
  const spr = [];
  for (const d of decor) { const z = d.s - dist; if (z > ZNEAR && z < ZFAR) spr.push({ z, d }); }
  for (const r of rows) if (r.z > ZP) spr.push({ z: r.z, r });
  spr.sort((a, b) => b.z - a.z);
  for (const o of spr) o.d ? drawDecor(o.d, o.z) : drawGateRow(o.r);
  drawGhost(); drawPlayer();
  for (const r of rows) if (r.z <= ZP) drawGateRow(r);
  drawParticles(); drawSpeedLines(); drawWeather(); drawTutor();
  if (theme.fog) { ctx.fillStyle = 'rgba(240,245,230,.18)'; ctx.fillRect(0, HOR - 20, W, (PY - HOR) * .5); }
  ctx.restore();
}
function burstCoins(n, gold) { const sP = F / ZP, x = CX + (player.x - camX) * sP, y = PY - LANE * .5; const tg = $('#hudCoins').getBoundingClientRect();
  for (let i = 0; i < n; i++) parts.push({ type: 'coin', x0: x + rnd(-20, 20), y0: y, tx: tg.left + tg.width / 2, ty: tg.top + tg.height / 2, t: -i * .07, dur: .65, gold }); }
function burst(x, y, col, n, type) { for (let i = 0; i < n; i++) { const a = rnd(0, Math.PI * 2), v = rnd(60, 260); parts.push({ type: type || 'spark', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 80, t: 0, dur: rnd(.4, .8), r: rnd(3, 7), col: Array.isArray(col) ? pickOne(col) : col }); } }
function updateParticles(dt) { for (const p of parts) { p.t += dt; if (p.t < 0 || p.type === 'coin') continue; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 400 * dt; if (p.type === 'puff') { p.vx *= .9; p.vy = p.vy * .9 - 30 * dt; } } parts = parts.filter(p => p.t < p.dur); }

/* beeld-uitleg zonder tekst: een hand wijst naar de goede poort en veegt erheen */
function drawTutor() { // hand: eerst naar de goede baan, dan omhoog vegen
  if (!R || !R.tutor || R.done >= 3 || R.phase !== 'run') return; const r = R.row; if (!r || r.resolved) return;
  const s = sc(r.z), g = gy(r.z), sP = F / ZP, px = CX + (player.x - camX) * sP, tx = CX + (r.cl - 1 - camX) * sP, base = PY - LANE * .25;
  const k = (TG * .6) % 1; let x, y;
  if (player.lane !== r.cl) { const e = Math.min(1, k / .6); x = px + (tx - px) * e; y = base; }
  else { const e = Math.min(1, k / .55); x = px; y = base - e * LANE * 1.1;
    ctx.save(); ctx.globalAlpha = .85 * e; ctx.fillStyle = '#ffd23f'; ctx.font = `700 ${Math.max(30, LANE * .4)}px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText('⬆️', x, base - LANE * 1.35); ctx.restore(); }
  ctx.save(); ctx.globalAlpha = k < .85 ? 1 : (1 - k) / .15; ctx.font = `${Math.max(34, LANE * .55)}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillStyle = 'rgba(255,255,255,.7)'; circ(ctx, CX + (r.cl - 1 - camX) * s, g - s * .85, s * .55 * (.8 + .2 * Math.sin(TG * 6))); ctx.fillText('👆', x, y); ctx.restore();
}
