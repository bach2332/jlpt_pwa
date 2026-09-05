/* JLPT挑戦 — Service Worker
   ----------------------------------------------------------------------
   IMPORTANT: bump CACHE_VERSION to today's date (YYYY-MM-DD) every time
   you push a change to index.html / manifest.json / icon.svg. This is
   the same date used for APP_VERSION inside index.html — keep them in
   sync so the version shown in Settings always matches what's cached.

   Even without remembering to bump this, updates should still show up
   quickly: navigation requests use a network-first strategy below, so
   the browser always tries to fetch the latest index.html first and
   only falls back to the cached copy when offline. Bumping the version
   just makes sure the OLD cached copy gets cleaned up on activate.
------------------------------------------------------------------------- */
const CACHE_VERSION = 'jlpt-quiz-v2026-09-05';

const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // don't wait for old tabs to close before activating
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim()) // take control of already-open tabs immediately
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Page navigations: try the network first so a fresh deploy is loaded
  // right away; fall back to the cached shell only when offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Everything else (manifest, icon, fonts, etc.): cache-first, filling
  // the cache on first use, so the app keeps working offline.
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && req.url.startsWith(self.location.origin)) {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, clone));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
