/* ===== personages (procedureel; char_<id>.webp vervangt de tekening als die er is) =====
   (x,y) = voeten, s = hoogte. mood: 0 blij, 1 verbaasd, 2 boos/verdrietig */
function mouth(c, x, y, r, mood) {
  c.strokeStyle = '#1f2a44'; c.lineWidth = Math.max(1.5, r * .25); c.lineCap = 'round'; c.beginPath();
  if (mood === 1) { c.fillStyle = '#5a1a1a'; ell(c, x, y, r * .5, r * .65); return; }
  if (mood === 2) c.arc(x, y + r * .7, r, Math.PI * 1.15, Math.PI * 1.85); else c.arc(x, y - r * .3, r, Math.PI * .15, Math.PI * .85);
  c.stroke();
}
const CDRAW = {
  opa(c, s, mood, t) {
    c.fillStyle = '#3d6fd1'; rr(c, -s * .2, -s * .55, s * .4, s * .5, s * .08); c.fill();                 // overall
    c.fillStyle = '#2a4fa0'; c.fillRect(-s * .17, -s * .08, s * .13, s * .08); c.fillRect(s * .04, -s * .08, s * .13, s * .08);
    c.fillStyle = '#ffd9b8'; circ(c, 0, -s * .7, s * .2);                                                   // hoofd
    c.fillStyle = '#e8322f'; c.beginPath(); c.arc(0, -s * .76, s * .2, Math.PI, 0); c.fill(); c.fillRect(-s * .05, -s * .79, s * .3, s * .05); // pet
    eye(c, -s * .07, -s * .7, s * .035); eye(c, s * .07, -s * .7, s * .035);
    c.fillStyle = '#f4f4f4'; const tw = Math.sin(t * 3) * .15; ell(c, -s * .07, -s * .62, s * .09, s * .035, -.3 + tw); ell(c, s * .07, -s * .62, s * .09, s * .035, .3 + .2); // scheve snor
    mouth(c, 0, -s * .56, s * .03, mood);
    c.fillStyle = '#ffd9b8'; circ(c, -s * .26, -s * .35, s * .05); circ(c, s * .26, -s * .35, s * .05);
    c.save(); c.translate(s * .3, -s * .35); c.rotate(Math.sin(t * 2) * .3 - .5); c.fillStyle = '#b8c2d6'; rr(c, -s * .02, -s * .25, s * .04, s * .22, s * .02); c.fill(); c.beginPath(); c.arc(0, -s * .27, s * .05, 0, Math.PI * 2); c.fill(); c.restore();
  },
  pim(c, s, mood, t) {
    c.fillStyle = '#7a5640'; ell(c, 0, -s * .35, s * .28, s * .35);
    c.fillStyle = '#a07a5e'; ell(c, 0, -s * .3, s * .17, s * .22);
    c.fillStyle = '#ff8ac0'; circ(c, 0, -s * .52, s * .06);
    c.strokeStyle = '#1f2a44'; c.lineWidth = s * .02; c.fillStyle = 'rgba(200,235,255,.6)';
    for (const sx of [-1, 1]) { c.beginPath(); c.arc(sx * s * .1, -s * .62, s * .075, 0, Math.PI * 2); c.fill(); c.stroke(); }
    c.beginPath(); c.moveTo(-s * .025, -s * .62); c.lineTo(s * .025, -s * .62); c.stroke();
    c.fillStyle = '#1f2a44'; circ(c, -s * .1 + Math.sin(t) * s * .01, -s * .62, s * .02); circ(c, s * .1 + Math.sin(t) * s * .01, -s * .62, s * .02);
    mouth(c, 0, -s * .44, s * .04, mood);
    c.fillStyle = '#ffc2d6'; ell(c, -s * .26, -s * .1, s * .09, s * .05); ell(c, s * .26, -s * .1, s * .09, s * .05);
    c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(0, -s * .72, s * .2, Math.PI * 1.1, Math.PI * 1.9); c.fill(); // helmpje
  },
  chaos(c, s, mood, t) {
    const sw = Math.sin(t * 2) * s * .03;
    c.fillStyle = '#4b1f7a'; c.beginPath(); c.moveTo(-s * .12, -s * .62); c.lineTo(-s * .34 - sw, 0); c.lineTo(s * .34 + sw, 0); c.lineTo(s * .12, -s * .62); c.fill();
    c.fillStyle = '#c92a5a'; c.beginPath(); c.moveTo(-s * .1, -s * .6); c.lineTo(-s * .24, -s * .05); c.lineTo(s * .24, -s * .05); c.lineTo(s * .1, -s * .6); c.fill();
    c.fillStyle = '#e6d3ff'; circ(c, 0, -s * .7, s * .16);
    c.fillStyle = '#1f2a44'; rr(c, -s * .13, -s * 1.0, s * .26, s * .2, s * .02); c.fill(); rr(c, -s * .2, -s * .82, s * .4, s * .04, s * .02); c.fill();
    c.fillStyle = '#ffd23f'; c.fillRect(-s * .13, -s * .86, s * .26, s * .03);
    eye(c, -s * .06, -s * .72, s * .035); eye(c, s * .06, -s * .72, s * .035);
    c.strokeStyle = '#ffd23f'; c.lineWidth = s * .012; c.beginPath(); c.arc(s * .06, -s * .72, s * .05, 0, Math.PI * 2); c.stroke();
    c.strokeStyle = '#1f2a44'; c.lineWidth = s * .025; c.beginPath(); c.moveTo(-s * .14, -s * .6); c.quadraticCurveTo(-s * .05, -s * .67, 0, -s * .63); c.quadraticCurveTo(s * .05, -s * .67, s * .14, -s * .6); c.stroke();
    if (mood === 2) { c.beginPath(); c.moveTo(-s * .1, -s * .79); c.lineTo(-s * .02, -s * .76); c.moveTo(s * .1, -s * .79); c.lineTo(s * .02, -s * .76); c.stroke(); }
    mouth(c, 0, -s * .58, s * .03, mood);
  },
  kikker(c, s, mood, t) {
    const hop = Math.abs(Math.sin(t * 3)) * s * .04; c.translate(0, -hop);
    c.fillStyle = '#3fae49'; ell(c, 0, -s * .3, s * .32, s * .28);
    c.fillStyle = '#a6e38a'; ell(c, 0, -s * .22, s * .2, s * .16);
    c.fillStyle = '#3fae49'; circ(c, -s * .15, -s * .56, s * .1); circ(c, s * .15, -s * .56, s * .1);
    eye(c, -s * .15, -s * .57, s * .07); eye(c, s * .15, -s * .57, s * .07);
    mouth(c, 0, -s * .36, s * .12, mood);
    c.fillStyle = '#ffd23f'; c.beginPath(); c.moveTo(-s * .14, -s * .66); c.lineTo(-s * .14, -s * .8); c.lineTo(-s * .07, -s * .72); c.lineTo(0, -s * .84); c.lineTo(s * .07, -s * .72); c.lineTo(s * .14, -s * .8); c.lineTo(s * .14, -s * .66); c.closePath(); c.fill();
    c.fillStyle = '#ff6fb5'; circ(c, 0, -s * .74, s * .025);
  },
  victor(c, s, mood, t) {
    for (let i = 0; i < 5; i++) { const a = t * 6 + i; c.fillStyle = i % 2 ? '#ffd23f' : '#ff8a2a'; tri(c, -s * .25 + i * s * .12, -s * .62, -s * .2 + i * s * .12, -s * (.8 + .08 * Math.sin(a)), -s * .15 + i * s * .12, -s * .62); }
    c.fillStyle = '#5b2a2a'; c.beginPath(); c.moveTo(-s * .36, 0); c.quadraticCurveTo(-s * .38, -s * .7, 0, -s * .68); c.quadraticCurveTo(s * .38, -s * .7, s * .36, 0); c.fill();
    c.strokeStyle = '#ff7a1a'; c.lineWidth = s * .03; c.beginPath(); c.moveTo(-s * .2, -s * .1); c.lineTo(-s * .12, -s * .3); c.lineTo(-s * .2, -s * .45); c.moveTo(s * .22, -s * .15); c.lineTo(s * .14, -s * .3); c.stroke();
    eye(c, -s * .1, -s * .48, s * .06); eye(c, s * .1, -s * .48, s * .06);
    c.fillStyle = '#ff7a1a'; mouth(c, 0, -s * .3, s * .1, mood);
  },
  uil(c, s, mood, t) {
    c.fillStyle = '#8b5a3c'; ell(c, 0, -s * .38, s * .26, s * .36);
    c.fillStyle = '#f3dcb5'; ell(c, 0, -s * .3, s * .17, s * .22);
    c.fillStyle = '#8b5a3c'; tri(c, -s * .22, -s * .62, -s * .1, -s * .66, -s * .2, -s * .8); tri(c, s * .22, -s * .62, s * .1, -s * .66, s * .2, -s * .8);
    c.fillStyle = '#fff'; circ(c, -s * .1, -s * .55, s * .09); circ(c, s * .1, -s * .55, s * .09);
    const bl = (Math.sin(t * 1.3) > .96) ? .2 : 1;
    c.fillStyle = '#1f2a44'; ell(c, -s * .1, -s * .55, s * .045, s * .045 * bl); ell(c, s * .1, -s * .55, s * .045, s * .045 * bl);
    c.fillStyle = '#ffb03b'; tri(c, -s * .035, -s * .48, s * .035, -s * .48, 0, -s * .41);
    c.fillStyle = '#1f2a44'; circ(c, s * .28, -s * .7, s * .035); c.beginPath(); c.moveTo(s * .3, -s * .69); c.quadraticCurveTo(s * .31, -s * .62, s * .25, -s * .58); c.lineTo(s * .27, -s * .66); c.fill(); // komma-pluim
    if (mood === 1) { c.fillStyle = '#ff6fb5'; c.font = `${s * .15}px ${FONT}`; c.textAlign = 'center'; c.fillText('?', -s * .3, -s * .7); }
  },
  player(c, s, mood, t) {
    const col = (P && P.avc) || '#4cc3ff';
    c.fillStyle = col; rr(c, -s * .2, -s * .5, s * .4, s * .48, s * .1); c.fill();
    c.fillStyle = '#fff'; rr(c, -s * .08, -s * .45, s * .16, s * .12, s * .03); c.fill();
    c.fillStyle = '#1f2a44'; c.font = `700 ${s * .08}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('1', 0, -s * .39);
    c.fillStyle = '#fff'; circ(c, 0, -s * .68, s * .2); c.fillStyle = col; c.beginPath(); c.arc(0, -s * .68, s * .2, 0, Math.PI * 2); c.lineWidth = s * .03; c.strokeStyle = col; c.stroke();
    c.font = `${s * .28}px ${FONT}`; c.textBaseline = 'middle'; c.fillText((P && P.av) || '🙂', 0, -s * .67);
  },
};
function drawChar(c, id, x, y, s, mood, t, flip) {
  c.save(); c.translate(x, y); if (flip) c.scale(-1, 1);
  c.fillStyle = 'rgba(0,0,0,.15)'; ell(c, 0, 0, s * .3, s * .05);
  const im = ART.img('char_' + id) || (id !== 'player' && ART.img('boss_' + id));
  if (im) { c.translate(0, Math.sin(t * 2) * s * .01); drawImgBottom(c, im, 0, 0, s * .8 * im.width / Math.max(im.width, im.height) * (im.height > im.width ? 1 : 1.25)); }
  else { c.lineJoin = 'round'; (CDRAW[id] || CDRAW.pim)(c, s, mood || 0, t || 0); }
  c.restore();
}
