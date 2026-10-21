/* ===== tekenhulpjes ===== */
const FONT = "'Fredoka','Baloo 2','Nunito','Comic Sans MS','Trebuchet MS',sans-serif";
function rr(c, x, y, w, h, r) { r = Math.max(0, Math.min(r, w / 2, h / 2)); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function circ(c, x, y, r) { c.beginPath(); c.arc(x, y, Math.max(.1, r), 0, Math.PI * 2); c.fill(); }
function ell(c, x, y, rx, ry, rot) { c.beginPath(); c.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot || 0, 0, Math.PI * 2); c.fill(); }
function poly(c, P, k, ox, oy) { c.beginPath(); P.forEach(([x, y], i) => i ? c.lineTo(ox + x * k, oy + y * k) : c.moveTo(ox + x * k, oy + y * k)); c.closePath(); }
function tri(c, x1, y1, x2, y2, x3, y3) { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.lineTo(x3, y3); c.closePath(); c.fill(); }
function hsl2hex(h, s, l) { s /= 100; l /= 100; const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = n => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1)))).toString(16).padStart(2, '0'); return '#' + f(0) + f(8) + f(4); }
function colorHex(id, t) { if (id === 'regenboog') return hsl2hex((t * 70) % 360, 85, 58); const c = COLORS.find(c => c.id === id); return c ? c.hex : '#ffd23f'; }
function shade(hex, amt) { const c = hex.replace('#', ''); let r = parseInt(c.substr(0, 2), 16), g = parseInt(c.substr(2, 2), 16), b = parseInt(c.substr(4, 2), 16);
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt); r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b); return `rgb(${r},${g},${b})`; }
function eye(c, x, y, r, look) { c.fillStyle = '#fff'; circ(c, x, y, r); c.fillStyle = '#1f2a44'; circ(c, x + r * (look || .2), y + r * .1, r * .5); c.fillStyle = '#fff'; circ(c, x + r * .35, y - r * .15, r * .18); }
/* afbeelding 'contain' tekenen, onderkant-midden op (x,y) */
function drawImgBottom(c, im, x, y, w) { const h = w * im.height / im.width; c.drawImage(im, x - w / 2, y - h, w, h); }
function drawImgCover(c, im, x, y, w, h, ox) { const s = Math.max(w / im.width, h / im.height), iw = im.width * s, ih = im.height * s; c.drawImage(im, x + (w - iw) / 2 + (ox || 0), y + (h - ih), iw, ih); }
