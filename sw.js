// ============================================
//   MOBIFLIX SERVICE WORKER
//   Cache para mabilis mag-load at offline-ish
// ============================================

const CACHE_NAME = 'mobiflix-v1';
const CACHE_URLS = [
  './',
  './index.html',
  './home.css',
  './home.js',
  './auth.js',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// ===== INSTALL =====
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHE_URLS).catch(function(err) {
        console.warn('[SW] Some files failed to cache:', err);
      });
    })
  );
  self.skipWaiting();
});

// ===== ACTIVATE =====
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) {
          return key !== CACHE_NAME;
        }).map(function(key) {
          return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// ===== FETCH =====
self.addEventListener('fetch', function(event) {
  const url = event.request.url;

  // Huwag i-cache ang TMDB API at video embeds — kailangan laging fresh
  if (
    url.includes('api.themoviedb.org') ||
    url.includes('image.tmdb.org') ||
    url.includes('zxcstream') ||
    url.includes('vidstuck') ||
    url.includes('vidlink') ||
    url.includes('111movies') ||
    url.includes('vidsrc') ||
    url.includes('2embed')
  ) {
    return; // hayaan yung browser mag-handle
  }

  // Static files: cache-first
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;
      return fetch(event.request).then(function(response) {
        // I-cache yung bagong fetch kung GET lang
        if (event.request.method === 'GET' && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(function() {
        // Offline fallback
        return caches.match('./index.html');
      });
    })
  );
});