// Service Worker para PWA - Cache First Strategy
const CACHE_NAME = 'padel-manager-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/config/constants.js',
  '/js/security/Sanitizer.js',
  '/js/storage/VersionedStorage.js',
  '/js/scoring/ScoringEngine.js',
  '/js/scoring/NormalScoring.js',
  '/js/scoring/ShortScoring.js',
  '/js/scoring/ProScoring.js',
  '/js/scoring/ChampionsScoring.js',
  '/js/formats/Elimination.js',
  '/js/formats/League.js',
  '/js/formats/Groups.js',
  '/js/formats/Americano.js',
  '/js/formats/Mexicano.js',
  '/js/formats/Swiss.js',
  '/js/ui/CalendarManager.js',
  '/js/ui/Renderer.js',
  '/js/ui/ModalManager.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).then(fetchResponse => {
        if (!fetchResponse || fetchResponse.status !== 200) return fetchResponse;
        const responseToCache = fetchResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return fetchResponse;
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});
