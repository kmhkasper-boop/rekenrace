/* Rekenrace service worker – gegenereerd door tools/build.js. Alleen eigen bestanden, geen externe verzoeken. */
const VERSION = 'v2-1f6c94f751';
const CACHE = 'rekenrace-' + VERSION;
const FILES = [
 "./",
 "index.html",
 "manifest.webmanifest",
 "fonts/fredoka-latin.woff2",
 "icons/apple-touch-icon.png",
 "icons/favicon-48.png",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/icon-maskable-512.png",
 "icons/icon.svg",
 "assets/bg_herfst.webp",
 "assets/bg_lente.webp",
 "assets/bg_winter.webp",
 "assets/bg_zomer.webp"
];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('rekenrace-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url); if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).then(res => { if (res.ok && res.type === 'basic') { const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); } return res; }).catch(() => e.request.mode === 'navigate' ? caches.match('index.html') : undefined)));
});
