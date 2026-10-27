const CACHE_NAME = 'gest-boutique-v1';
const urlsToCache = [
  '/',
  '/css/style.css',
  '/css/mobile.css',
  '/js/mobile-menu.js',
  '/auth/login'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
