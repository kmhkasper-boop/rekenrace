/* ===== geluid (WebAudio, geen bestanden) ===== */
let AC = null;
function ac() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; } } if (AC && AC.state === 'suspended') AC.resume().catch(() => { }); return AC; }
function tone(freq, dur, type, vol, when, slide) {
  if (G.muted) return; const a = ac(); if (!a) return;
  try { const t = a.currentTime + (when || 0); const o = a.createOscillator(), g = a.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || .12, t + .012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + dur + .05); } catch (e) { }
}
const SFX = {
  good() { [523, 659, 784, 1047].forEach((f, i) => tone(f, .16, 'triangle', .13, i * .055)); },
  gold() { [659, 784, 988, 1319, 1568].forEach((f, i) => tone(f, .18, 'triangle', .13, i * .05)); },
  coin() { tone(988, .07, 'square', .045, .2); tone(1319, .16, 'square', .045, .27); },
  bad() { tone(240, .28, 'sine', .16, 0, 150); tone(180, .3, 'triangle', .08, .06, 120); },
  lane() { tone(420, .08, 'sine', .05, 0, 760); },
  count() { tone(660, .12, 'triangle', .14); },
  go() { tone(880, .12, 'triangle', .14); tone(1320, .3, 'triangle', .14, .1); },
  click() { tone(720, .05, 'triangle', .07); },
  buy() { [784, 988, 1175, 1568].forEach((f, i) => tone(f, .14, 'square', .05, i * .07)); },
  fanfare() { [523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, .22, 'triangle', .13, i * .12)); },
  speed() { tone(500, .25, 'sawtooth', .03, 0, 1200); },
  combo() { [392, 523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, .12, 'sawtooth', .05, i * .04)); },
  skip() { tone(600, .1, 'triangle', .1); tone(900, .15, 'triangle', .1, .08); },
  page() { tone(540, .06, 'triangle', .06); },
};
function vibrate(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) { } }
