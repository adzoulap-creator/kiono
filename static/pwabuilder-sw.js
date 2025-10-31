importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE = "pwabuilder-page-v1";
const offlineFallbackPage = "/kiono/index.html";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll([
        '/kiono/index.html',  // ✅ on ajoute explicitement la page principale
        '/kiono/static/unique.css',
        '/kiono/static/unique.js',
        '/kiono/static/img/cadre/cadre1.jpg',
        '/kiono/static/img/cadre/cadre2.jpg',
        '/kiono/static/img/cadre/cadre3.jpg',
        '/kiono/static/img/cadre/cadre4.png',
        '/kiono/static/img/cacher/cacher1.jpg'
      ]))
  );
  self.skipWaiting();
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // ✅ Si la ressource est dans le cache, on la renvoie
        if (cachedResponse) {
          return cachedResponse;
        }

        // ✅ Sinon, on tente de la récupérer sur le réseau
        return fetch(event.request).catch(async () => {
          // ⚠️ Si échec réseau (hors ligne), on sert la page de secours
          const cache = await caches.open(CACHE);
          return cache.match(offlineFallbackPage);
        });
      })
  );
});
