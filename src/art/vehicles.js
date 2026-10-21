/* ===== voertuigen (procedureel; veh_<id>.webp vervangt de tekening als die er is) ===== */
function wheels(c, u, w) { c.fillStyle = '#22283a'; const ww = w || .13; rr(c, -u * .36, -u * .15, u * ww, u * .15, u * .03); c.fill(); rr(c, u * (.36 - ww), -u * .15, u * ww, u * .15, u * .03); c.fill(); }
function kart(c, u, col, dark, boost) {
  wheels(c, u);
  c.fillStyle = col; c.strokeStyle = dark; rr(c, -u * .3, -u * .26, u * .6, u * .2, u * .07); c.fill(); c.stroke();
  c.fillStyle = '#1f2a44'; rr(c, -u * .27, -u * .1, u * .54, u * .05, u * .02); c.fill();
  c.fillStyle = boost ? '#ffef5a' : '#ff3b3b'; rr(c, -u * .26, -u * .22, u * .08, u * .05, u * .02); c.fill(); rr(c, u * .18, -u * .22, u * .08, u * .05, u * .02); c.fill();
}
function driver(c, u, y) { // speler-avatar als bestuurder
  const av = (typeof P !== 'undefined' && P && P.av) || '🙂';
  c.fillStyle = (P && P.avc) || '#4cc3ff'; circ(c, 0, y, u * .1);
  c.font = `${u * .15}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(av, 0, y + u * .005);
}
const VDRAW = {
  bliksem(c, u, col, dark, light, t, boost) {
    const hov = Math.sin(t * 5) * u * .03; c.translate(0, -u * .42 + hov);
    const P2 = [[.15, -.8], [-.45, .1], [-.05, .1], [-.2, .8], [.45, -.15], [.05, -.15], [.3, -.8]], k = u * .32;
    c.fillStyle = boost ? 'rgba(255,255,190,.6)' : 'rgba(255,255,255,.4)'; poly(c, P2, k * 1.22, 0, 0); c.fill();
    c.fillStyle = col; c.strokeStyle = dark; poly(c, P2, k, 0, 0); c.fill(); c.stroke();
    c.strokeStyle = light; c.lineWidth = Math.max(1, u * .015); c.beginPath(); c.moveTo(.2 * k, -.7 * k); c.lineTo(-.3 * k, .02 * k); c.stroke();
    eye(c, -.12 * k, -.04 * k, .08 * k); eye(c, .15 * k, -.04 * k, .08 * k);
    c.fillStyle = '#fff7b0'; for (let i = 0; i < 3; i++) { const a = t * 7 + i * 2.1; circ(c, Math.cos(a) * k * .45, k * .95 + Math.sin(a * 1.3) * k * .12, k * .05); }
  },
  raceauto(c, u, col, dark, light, t, boost) {
    c.translate(0, Math.sin(t * 22) * u * .005);
    c.fillStyle = '#22283a'; rr(c, -u * .36, -u * .17, u * .13, u * .17, u * .03); c.fill(); rr(c, u * .23, -u * .17, u * .13, u * .17, u * .03); c.fill();
    c.fillStyle = col; c.strokeStyle = dark; rr(c, -u * .32, -u * .31, u * .64, u * .23, u * .08); c.fill(); c.stroke();
    c.fillStyle = dark; rr(c, -u * .19, -u * .44, u * .38, u * .17, u * .07); c.fill();
    c.fillStyle = '#bfe9ff'; rr(c, -u * .15, -u * .42, u * .3, u * .1, u * .04); c.fill();
    driver(c, u, -u * .38);
    c.fillStyle = dark; rr(c, -u * .37, -u * .53, u * .74, u * .06, u * .025); c.fill();
    c.fillStyle = '#1f2a44'; c.fillRect(-u * .22, -u * .5, u * .03, u * .08); c.fillRect(u * .19, -u * .5, u * .03, u * .08);
    c.fillStyle = boost ? '#ffef5a' : '#ff3b3b'; rr(c, -u * .28, -u * .25, u * .11, u * .06, u * .02); c.fill(); rr(c, u * .17, -u * .25, u * .11, u * .06, u * .02); c.fill();
    c.fillStyle = '#fff'; rr(c, -u * .08, -u * .2, u * .16, u * .07, u * .015); c.fill();
    c.fillStyle = '#1f2a44'; c.font = `700 ${u * .055}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('RR', 0, -u * .163);
  },
  raket(c, u, col, dark, light, t, boost) {
    const hov = Math.sin(t * 4) * u * .035; c.translate(0, -u * .14 + hov);
    const fl = u * (.16 + .06 * Math.sin(t * 30)) * (boost ? 1.7 : 1);
    c.fillStyle = '#ff8a2a'; c.beginPath(); c.moveTo(-u * .07, -u * .07); c.quadraticCurveTo(0, fl * 1.2, u * .07, -u * .07); c.fill();
    c.fillStyle = '#ffe066'; c.beginPath(); c.moveTo(-u * .04, -u * .07); c.quadraticCurveTo(0, fl * .7, u * .04, -u * .07); c.fill();
    c.fillStyle = dark; tri(c, -u * .12, -u * .26, -u * .25, -u * .05, -u * .09, -u * .1); tri(c, u * .12, -u * .26, u * .25, -u * .05, u * .09, -u * .1);
    c.fillStyle = col; c.strokeStyle = dark; c.beginPath(); c.ellipse(0, -u * .38, u * .14, u * .3, 0, 0, Math.PI * 2); c.fill(); c.stroke();
    c.fillStyle = '#7fe7ff'; c.beginPath(); c.ellipse(0, -u * .38, u * .14, u * .3, 0, Math.PI * 1.2, Math.PI * 1.8); c.closePath(); c.fill();
    c.fillStyle = '#fff'; circ(c, 0, -u * .4, u * .075); c.fillStyle = '#4cc3ff'; circ(c, 0, -u * .4, u * .05);
    c.fillStyle = 'rgba(255,255,255,.9)'; for (let i = 0; i < 4; i++) circ(c, Math.sin(t * 3 + i * 1.6) * u * .3, -u * (.3 + i * .12), u * .012);
  },
  eenhoorn(c, u, col, dark, light, t, boost) {
    c.translate(0, Math.sin(t * 22) * u * .005); kart(c, u, col, dark, boost);
    c.fillStyle = '#fff'; c.strokeStyle = '#cdbfe6'; rr(c, -u * .11, -u * .38, u * .22, u * .15, u * .07); c.fill(); c.stroke();
    c.beginPath(); c.arc(0, -u * .46, u * .12, 0, Math.PI * 2); c.fill(); c.stroke();
    c.fillStyle = '#ffd23f'; c.strokeStyle = '#d99a00'; c.beginPath(); c.moveTo(-u * .035, -u * .56); c.lineTo(u * .035, -u * .56); c.lineTo(0, -u * .76); c.closePath(); c.fill(); c.stroke();
    const mc = ['#ff6fb5', '#ffb03b', '#4cc3ff', '#9b59ff']; c.lineWidth = u * .035;
    mc.forEach((m, i) => { c.strokeStyle = m; c.beginPath(); const sx = -u * .045 + i * u * .03, sw = Math.sin(t * 6 + i) * u * .02; c.moveTo(sx, -u * .56); c.quadraticCurveTo(sx + sw, -u * .45, sx - u * .02 + sw * 2, -u * .3); c.stroke(); });
  },
  dino(c, u, col, dark, light, t, boost) {
    c.translate(0, Math.sin(t * 22) * u * .005);
    c.fillStyle = '#4caf50'; c.beginPath(); c.moveTo(u * .2, -u * .2); c.quadraticCurveTo(u * .45, -u * .22, u * .48 + Math.sin(t * 6) * u * .03, -u * .38); c.quadraticCurveTo(u * .38, -u * .26, u * .18, -u * .28); c.fill();
    kart(c, u, col, dark, boost);
    c.fillStyle = '#4caf50'; c.strokeStyle = '#2e7d32'; rr(c, -u * .12, -u * .38, u * .24, u * .16, u * .07); c.fill(); c.stroke();
    c.beginPath(); c.arc(0, -u * .47, u * .13, 0, Math.PI * 2); c.fill(); c.stroke();
    c.fillStyle = '#ffb03b'; for (let i = 0; i < 4; i++) { const yy = -u * (.6 - i * .085); tri(c, -u * .035, yy + u * .04, 0, yy - u * .03, u * .035, yy + u * .04); }
  },
  lieveheer(c, u, col, dark, light, t, boost) {
    c.translate(0, Math.sin(t * 20) * u * .006); wheels(c, u);
    c.fillStyle = '#e8322f'; c.strokeStyle = '#8f1512'; c.beginPath(); c.ellipse(0, -u * .27, u * .33, u * .2, 0, Math.PI, 0); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = '#1f2a44'; c.lineWidth = u * .02; c.beginPath(); c.moveTo(0, -u * .47); c.lineTo(0, -u * .27); c.stroke();
    c.fillStyle = '#1f2a44'; [[-.18, -.34], [.18, -.34], [-.1, -.42], [.1, -.42], [-.26, -.29], [.26, -.29]].forEach(([x, y]) => circ(c, u * x, u * y, u * .04));
    c.fillStyle = col; c.strokeStyle = dark; rr(c, -u * .3, -u * .27, u * .6, u * .12, u * .05); c.fill(); c.stroke();
    driver(c, u, -u * .5);
    c.strokeStyle = '#1f2a44'; c.lineWidth = u * .015; [-1, 1].forEach(s => { c.beginPath(); c.moveTo(s * u * .05, -u * .58); c.quadraticCurveTo(s * u * .12, -u * .72, s * u * .16, -u * .7); c.stroke(); circ(c, s * u * .16, -u * .7, u * .02); });
  },
  bloembus(c, u, col, dark, light, t, boost) {
    c.translate(0, Math.sin(t * 16) * u * .006); wheels(c, u, .15);
    c.fillStyle = col; c.strokeStyle = dark; rr(c, -u * .34, -u * .5, u * .68, u * .4, u * .09); c.fill(); c.stroke();
    c.fillStyle = '#fff'; rr(c, -u * .34, -u * .3, u * .68, u * .09, u * .02); c.fill();
    c.fillStyle = '#bfe9ff'; rr(c, -u * .24, -u * .46, u * .48, u * .13, u * .04); c.fill();
    driver(c, u, -u * .41);
    const fc = ['#ff6fb5', '#ffd23f', '#9b59ff', '#ff8a2a'];
    for (let i = 0; i < 5; i++) { const x = -u * .26 + i * u * .13; c.fillStyle = fc[i % 4]; for (let k = 0; k < 5; k++) { const a = k * 1.256 + t; circ(c, x + Math.cos(a) * u * .03, -u * .55 + Math.sin(a) * u * .03, u * .025); } c.fillStyle = '#fff3a0'; circ(c, x, -u * .55, u * .02); }
  },
  bij(c, u, col, dark, light, t, boost) {
    const hov = Math.sin(t * 6) * u * .03; c.translate(0, -u * .1 + hov);
    c.fillStyle = 'rgba(220,245,255,.8)'; const fl = Math.sin(t * 40) * .3; ell(c, -u * .2, -u * .42, u * .16, u * .08, -.5 + fl); ell(c, u * .2, -u * .42, u * .16, u * .08, .5 - fl);
    c.fillStyle = '#ffd23f'; c.strokeStyle = '#1f2a44'; c.lineWidth = u * .02; c.beginPath(); c.ellipse(0, -u * .26, u * .25, u * .18, 0, 0, Math.PI * 2); c.fill(); c.stroke();
    c.fillStyle = '#1f2a44'; c.fillRect(-u * .1, -u * .43, u * .06, u * .34); c.fillRect(u * .05, -u * .43, u * .06, u * .34);
    c.fillStyle = '#22283a'; circ(c, -u * .14, -u * .07, u * .06); circ(c, u * .14, -u * .07, u * .06);
    driver(c, u, -u * .48);
    c.fillStyle = col; rr(c, -u * .1, -u * .08, u * .2, u * .04, u * .02); c.fill();
  },
  ijscokar(c, u, col, dark, light, t, boost) {
    c.translate(0, Math.sin(t * 18) * u * .006); wheels(c, u, .15);
    c.fillStyle = '#fff'; c.strokeStyle = '#c9d3e6'; rr(c, -u * .34, -u * .4, u * .68, u * .3, u * .06); c.fill(); c.stroke();
    c.fillStyle = col; rr(c, -u * .34, -u * .22, u * .68, u * .08, u * .02); c.fill();
    for (let i = 0; i < 4; i++) { c.fillStyle = i % 2 ? '#ff6fb5' : '#fff'; c.beginPath(); c.moveTo(-u * .34 + i * u * .17, -u * .4); c.lineTo(-u * .34 + (i + 1) * u * .17, -u * .4); c.lineTo(-u * .34 + (i + .5) * u * .17, -u * .48); c.fill(); }
    c.fillStyle = '#e0a060'; tri(c, -u * .06, -u * .5, u * .06, -u * .5, 0, -u * .36);
    c.fillStyle = '#ff9ac8'; circ(c, 0, -u * .55, u * .08); c.fillStyle = '#fff3c4'; circ(c, -u * .03, -u * .63, u * .06); c.fillStyle = '#e8322f'; circ(c, u * .02, -u * .69, u * .02);
    driver(c, u, -u * .3);
  },
  surf(c, u, col, dark, light, t, boost) {
    const bob = Math.sin(t * 4) * u * .02; c.translate(0, bob);
    c.fillStyle = 'rgba(255,255,255,.75)'; for (let i = 0; i < 5; i++) circ(c, Math.sin(t * 5 + i) * u * .35, -u * .02, u * (.05 + (i % 2) * .02));
    c.fillStyle = col; c.strokeStyle = dark; c.beginPath(); c.ellipse(0, -u * .1, u * .38, u * .08, 0, 0, Math.PI * 2); c.fill(); c.stroke();
    c.fillStyle = '#fff'; c.fillRect(-u * .3, -u * .11, u * .6, u * .02);
    c.fillStyle = '#ffd23f'; c.strokeStyle = '#d99a00'; c.beginPath(); c.moveTo(0, -u * .18); c.lineTo(0, -u * .7); c.lineTo(u * .26, -u * .24); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = '#1f2a44'; c.lineWidth = u * .02; c.beginPath(); c.moveTo(0, -u * .14); c.lineTo(0, -u * .72); c.stroke();
    driver(c, u, -u * .27);
  },
  paddo(c, u, col, dark, light, t, boost) {
    c.translate(0, Math.sin(t * 20) * u * .006); kart(c, u, col, dark, boost);
    c.fillStyle = '#fff3e0'; rr(c, -u * .08, -u * .42, u * .16, u * .18, u * .04); c.fill();
    c.fillStyle = '#e8322f'; c.strokeStyle = '#8f1512'; c.beginPath(); c.ellipse(0, -u * .44, u * .28, u * .17, 0, Math.PI, 0); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#fff'; [[-.14, -.5], [.12, -.52], [0, -.57], [-.02, -.47], [.2, -.46]].forEach(([x, y]) => circ(c, u * x, u * y, u * .03));
    driver(c, u, -u * .32);
  },
  pompoen(c, u, col, dark, light, t, boost) {
    c.translate(0, Math.sin(t * 18) * u * .006); wheels(c, u, .14);
    c.fillStyle = '#ff8a2a'; c.strokeStyle = '#b85a10'; c.lineWidth = u * .02;
    for (const [x, r] of [[-.17, .2], [.17, .2], [0, .23]]) { c.beginPath(); c.ellipse(u * x, -u * .3, u * r * .75, u * .25, 0, 0, Math.PI * 2); c.fill(); c.stroke(); }
    c.fillStyle = '#4a8f2a'; rr(c, -u * .03, -u * .62, u * .06, u * .1, u * .02); c.fill();
    c.fillStyle = '#ffe066'; tri(c, -u * .14, -u * .36, -u * .06, -u * .36, -u * .1, -u * .42); tri(c, u * .06, -u * .36, u * .14, -u * .36, u * .1, -u * .42);
    c.beginPath(); c.moveTo(-u * .12, -u * .25); c.quadraticCurveTo(0, -u * .16, u * .12, -u * .25); c.quadraticCurveTo(0, -u * .2, -u * .12, -u * .25); c.fill();
    c.fillStyle = col; rr(c, -u * .3, -u * .12, u * .6, u * .05, u * .02); c.fill();
  },
  uilvlieger(c, u, col, dark, light, t, boost) {
    const hov = Math.sin(t * 3) * u * .04; c.translate(0, -u * .2 + hov);
    c.fillStyle = col; c.strokeStyle = dark; c.beginPath(); c.moveTo(-u * .48, -u * .3); c.quadraticCurveTo(0, -u * .52, u * .48, -u * .3); c.quadraticCurveTo(0, -u * .38, -u * .48, -u * .3); c.fill(); c.stroke();
    c.fillStyle = '#a0704a'; c.strokeStyle = '#6b4526'; c.beginPath(); c.ellipse(0, -u * .2, u * .14, u * .18, 0, 0, Math.PI * 2); c.fill(); c.stroke();
    c.fillStyle = '#f3dcb5'; ell(c, 0, -u * .16, u * .08, u * .1);
    eye(c, -u * .055, -u * .28, u * .045); eye(c, u * .055, -u * .28, u * .045);
    c.fillStyle = '#ffb03b'; tri(c, -u * .02, -u * .24, u * .02, -u * .24, 0, -u * .2);
    c.fillStyle = '#6b4526'; tri(c, -u * .12, -u * .36, -u * .06, -u * .36, -u * .11, -u * .43); tri(c, u * .12, -u * .36, u * .06, -u * .36, u * .11, -u * .43);
  },
  slee(c, u, col, dark, light, t, boost) {
    c.translate(0, Math.sin(t * 14) * u * .004);
    c.strokeStyle = '#8a93a6'; c.lineWidth = u * .03; c.beginPath(); c.moveTo(-u * .36, -u * .03); c.lineTo(u * .3, -u * .03); c.quadraticCurveTo(u * .42, -u * .03, u * .4, -u * .14); c.stroke();
    c.fillStyle = col; c.strokeStyle = dark; c.lineWidth = u * .02; rr(c, -u * .32, -u * .2, u * .62, u * .13, u * .04); c.fill(); c.stroke();
    c.fillStyle = '#e8322f'; rr(c, -u * .14, -u * .34, u * .28, u * .1, u * .04); c.fill();
    driver(c, u, -u * .4);
    c.fillStyle = '#fff'; for (let i = 0; i < 4; i++) { const p = (t * 2 + i / 4) % 1; c.globalAlpha = 1 - p; circ(c, -u * .38 - p * u * .2, -u * .03 + Math.sin(i) * u * .03, u * (.02 + p * .04)); } c.globalAlpha = 1;
  },
  ijsbeer(c, u, col, dark, light, t, boost) {
    c.translate(0, Math.sin(t * 16) * u * .006); wheels(c, u, .16);
    c.fillStyle = col; c.strokeStyle = dark; rr(c, -u * .36, -u * .36, u * .72, u * .26, u * .06); c.fill(); c.stroke();
    c.fillStyle = '#bfe9ff'; rr(c, -u * .2, -u * .33, u * .4, u * .1, u * .03); c.fill();
    c.fillStyle = '#f7fbff'; c.strokeStyle = '#c9d3e6'; circ(c, 0, -u * .5, u * .15); c.beginPath(); c.arc(0, -u * .5, u * .15, 0, Math.PI * 2); c.stroke();
    circ(c, -u * .12, -u * .62, u * .05); circ(c, u * .12, -u * .62, u * .05);
    c.fillStyle = '#1f2a44'; circ(c, -u * .05, -u * .52, u * .02); circ(c, u * .05, -u * .52, u * .02); ell(c, 0, -u * .45, u * .035, u * .025);
    c.fillStyle = '#ffd23f'; rr(c, -u * .3, -u * .2, u * .08, u * .05, u * .02); c.fill(); rr(c, u * .22, -u * .2, u * .08, u * .05, u * .02); c.fill();
  },
  scooter(c, u, col, dark, light, t, boost) {
    c.translate(0, Math.sin(t * 18) * u * .006);
    c.fillStyle = '#8a93a6'; rr(c, -u * .36, -u * .06, u * .2, u * .05, u * .02); c.fill(); rr(c, u * .16, -u * .06, u * .2, u * .05, u * .02); c.fill();
    c.fillStyle = '#22283a'; rr(c, -u * .24, -u * .14, u * .48, u * .09, u * .03); c.fill();
    c.fillStyle = col; c.strokeStyle = dark; c.beginPath(); c.moveTo(-u * .28, -u * .14); c.lineTo(u * .28, -u * .14); c.lineTo(u * .2, -u * .34); c.lineTo(-u * .2, -u * .34); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#bfe9ff'; tri(c, -u * .12, -u * .34, u * .12, -u * .34, 0, -u * .48);
    driver(c, u, -u * .42);
    c.fillStyle = boost ? '#ffef5a' : '#fff6c9'; circ(c, -u * .14, -u * .24, u * .035); circ(c, u * .14, -u * .24, u * .035);
  },
};
function drawVehicle(c, type, col, x, y, u, t, tilt, boost, ghost) {
  c.save(); c.translate(x, y); c.rotate(tilt || 0);
  if (ghost) c.globalAlpha = .45;
  c.fillStyle = 'rgba(20,30,50,.22)'; ell(c, 0, 0, u * .34, u * .07);
  const im = ART.img('veh_' + type);
  if (im) { c.translate(0, Math.sin(t * 20) * u * .005); drawImgBottom(c, im, 0, u * .02, u * .85); }
  else {
    const dark = shade(col, -.32), light = shade(col, .4);
    c.lineJoin = 'round'; c.lineCap = 'round'; c.lineWidth = Math.max(1.5, u * .025);
    if (boost) { c.fillStyle = 'rgba(255,170,40,.85)'; for (const sx of [-.12, .12]) { const L = u * (.12 + .06 * Math.sin(t * 40 + sx * 9)); c.beginPath(); c.moveTo(u * sx - u * .05, -u * .06); c.lineTo(u * sx + u * .05, -u * .06); c.lineTo(u * sx, -u * .06 + L); c.fill(); } }
    (VDRAW[type] || VDRAW.bliksem)(c, u, ghost ? '#e9f3ff' : col, ghost ? '#8aa0c0' : dark, light, t, boost);
  }
  c.restore();
}
