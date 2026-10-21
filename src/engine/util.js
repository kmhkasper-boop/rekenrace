/* ===== util ===== */
const Q = new URLSearchParams(location.search);
const SNEL = Math.max(0.2, Math.min(20, parseFloat(Q.get('snel')) || 1));   // test: alles sneller
const DUUR = Math.max(3, Math.min(600, parseFloat(Q.get('duur')) || 60));    // test: dagrecord-lengte (s)
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const rnd = (a, b) => a + Math.random() * (b - a);
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));      // geheel getal a..b
const pickOne = arr => arr[Math.floor(Math.random() * arr.length)];
const range = (a, b, s = 1) => { const o = []; for (let i = a; i <= b; i += s) o.push(i); return o; };
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function wpick(list) { // [[value, weight], ...]
  let tot = 0; for (const x of list) tot += x[1];
  let r = Math.random() * tot; for (const x of list) { r -= x[1]; if (r <= 0) return x[0]; }
  return list[list.length - 1][0];
}
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
/* Nederlandse getalnotatie: komma voor decimalen, punt als duizendtal-scheiding vanaf 10.000 */
function nl(x) {
  if (typeof x === 'string') return x;
  const neg = x < 0; x = Math.abs(x);
  const r = Math.round(x * 1000) / 1000;
  let [i, f] = String(r).split('.');
  if (i.length > 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (neg ? '−' : '') + i + (f ? ',' + f : '');
}
const eur = c => '€ ' + nl(Math.floor(c / 100)) + ',' + String(Math.round(c) % 100).padStart(2, '0');
const two = n => String(n).padStart(2, '0');
function dayKey(d) { d = d || new Date(); return d.getFullYear() + '-' + two(d.getMonth() + 1) + '-' + two(d.getDate()); }
/* het echte seizoen van vandaag (astronomisch, afgerond) */
function realSeason(d) {
  d = d || new Date(); const md = (d.getMonth() + 1) * 100 + d.getDate();
  if (md >= 321 && md < 621) return 0; if (md >= 621 && md < 923) return 1; if (md >= 923 && md < 1221) return 2; return 3;
}
