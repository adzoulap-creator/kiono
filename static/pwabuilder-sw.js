importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE = "pwabuilder-page-v1";
const offlineFallbackPage = "/kiono/"; // page principale pour le fallback

// Gestion du skipWaiting
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Installation du service worker et mise en cache des fichiers
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => {
        return cache.addAll([
          '/kiono/',                  // page principale
          '/kiono/index.html',        // facultatif, peut rester
          '/kiono/static/unique.css',
          '/kiono/static/unique.js',
          '/kiono/static/img/cadre/cadre1.jpg',
          '/kiono/static/img/cadre/cadre2.jpg',
          '/kiono/static/img/cadre/cadre3.jpg',
          '/kiono/static/img/cadre/cadre4.png',
          '/kiono/static/img/cacher/cacher1.jpg'
        ]);
      })
      .catch(err => console.error('Erreur lors du cache:', err))
  );
  self.skipWaiting();
});

// Activer la précharge de navigation si supportée
if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

// Gestion des requêtes fetch
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    // Pour les pages HTML (navigation)
    event.respondWith(
      fetch(event.request).catch(() => caches.match(offlineFallbackPage))
    );
  } else {
    // Pour CSS, JS, images, etc.
    event.respondWith(
      caches.match(event.request).then((response) => response || fetch(event.request))
    );
  }
});
