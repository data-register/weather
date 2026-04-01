const CACHE_NAME = 'meteo-v1';
const ASSETS = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // API requests - always go to network
  if (url.hostname === 'api.weather.com') {
    return;
  }

  // App files - cache first, fallback to network
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
