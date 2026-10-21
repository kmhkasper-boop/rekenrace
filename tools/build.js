#!/usr/bin/env node
// Bouwt src/* tot één index.html + sw.js (geen externe verzoeken).
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.join(__dirname, '..'), src = p => fs.readFileSync(path.join(root, 'src', p), 'utf8');
const ORDER = ['engine/util', 'engine/gen', 'engine/skills', 'data/curriculum', 'data/rewards', 'data/story', 'data/strips', 'engine/save', 'engine/audio',
  'art/assets', 'art/draw', 'art/vehicles', 'art/chars', 'art/vis', 'art/scene', 'engine/race', 'ui/flow', 'ui/screens', 'ui/place', 'ui/main'];
const assetDir = path.join(root, 'assets');
const assets = fs.existsSync(assetDir) ? fs.readdirSync(assetDir).filter(f => f.endsWith('.webp')).sort() : [];
let js = ORDER.map(f => `/* ---- ${f}.js ---- */\n` + src(f + '.js')).join('\n');
js = js.replace('/*@ASSETS*/[]', JSON.stringify(assets.map(f => f.replace(/\.webp$/, ''))));
const parts = { '/*@CSS*/': src('base.css') + '\n' + src('v2.css'), '/*@PWA*/': src('pwa.js'), '/*@JS*/': '"use strict";\n' + js };
let html = src('shell.html'); for (const k in parts) html = html.split(k).join(parts[k]);
if (/https?:\/\/(?!www\.w3\.org)/.test(html.replace(/\/\/[^\n]*$/gm, ''))) { const m = html.match(/https?:\/\/[^\s'"`)]+/g).filter(u => !u.includes('w3.org')); if (m.length) { console.error('Externe URL gevonden:', m); process.exit(1); } }
fs.writeFileSync(path.join(root, 'index.html'), html);
const files = ['./', 'index.html', 'manifest.webmanifest', 'fonts/fredoka-latin.woff2',
  ...fs.readdirSync(path.join(root, 'icons')).filter(f => /\.(png|svg)$/.test(f)).map(f => 'icons/' + f), ...assets.map(f => 'assets/' + f)];
const hash = crypto.createHash('sha1'); for (const f of files.slice(1)) hash.update(fs.readFileSync(path.join(root, f)));
const VERSION = 'v2-' + hash.digest('hex').slice(0, 10);
fs.writeFileSync(path.join(root, 'sw.js'), `/* Rekenrace service worker – gegenereerd door tools/build.js. Alleen eigen bestanden, geen externe verzoeken. */
const VERSION = '${VERSION}';
const CACHE = 'rekenrace-' + VERSION;
const FILES = ${JSON.stringify(files, null, 1)};
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('rekenrace-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url); if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).then(res => { if (res.ok && res.type === 'basic') { const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); } return res; }).catch(() => e.request.mode === 'navigate' ? caches.match('index.html') : undefined)));
});
`);
console.log('index.html', (html.length / 1024).toFixed(0) + ' KB', '· assets', assets.length, '·', VERSION);
