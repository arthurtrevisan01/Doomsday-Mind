const CACHE_NAME = 'doomsday-mind-v1';
const OFFLINE_URL = 'offline.html';

// App shell files to pre-cache
const APP_SHELL = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.webmanifest',
  '/icons/icon-120.png',
  '/icons/icon-152.png',
  '/icons/icon-167.png',
  '/icons/icon-180.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-1024.png'
];

// Install phase: pre-cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
  );
  // Force the waiting service worker to become the active worker
  self.clients.claim();
});

// Activate phase: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys
        .filter((key) => key !== CACHE_NAME)
        .map((key) => caches.delete(key))
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch handler
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  const isGoogleFonts = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  const isSameDomain = url.origin === self.location.origin;

  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // --- Google Fonts: stale-while-revalidate ---
      if (isGoogleFonts) {
        const cached = cachedResponse || null;
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Update cache with fresh response
          if (networkResponse && networkResponse.ok) {
            const cloned = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, cloned);
            });
          }
          return networkResponse;
        });
        return cached ? cached : fetchPromise;
      }

      // --- Other same-domain assets: cache-first ---
      if (isSameDomain && !isGoogleFonts) {
        const cachedResponse = cachedResponse || {};

        if (cachedResponse.ok) {
          // Check if we need to update in background
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              const cloned = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, cloned);
              });
            }
            return networkResponse;
          });

          // Return cached response, but update in background
          return Promise.resolve(cachedResponse).then((r) => {
            return r || fetchPromise;
          });
        }

        // No cache hit, fetch from network
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const cloned = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, cloned);
            });
          }
          return networkResponse;
        });
      }

      // --- Navigation: network-first with offline fallback ---
      if (event.request.mode === 'navigate' || (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))) {
        return fetch(event.request).then((networkResponse) => {
          // Update cache with fresh navigation response
          const cloned = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cloned);
          });
          return networkResponse;
        }).catch(() => {
          // Network failed, try cache
          return caches.match('/index.html').then((cached) => cached || caches.match(OFFLINE_URL));
        });
      }

      // Fallback for other GET requests
      return cachedResponse || fetch(event.request);
    })
  );
});