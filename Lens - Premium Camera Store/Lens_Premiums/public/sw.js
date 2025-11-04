const CACHE_NAME = 'camera-glaze-static-v1';

// Cache GET product pages (simple read-only cache strategy)
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Cache product pages and static assets
  if (url.pathname.startsWith('/product') || url.pathname.startsWith('/product/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        try {
          const response = await fetch(req);
          cache.put(req, response.clone());
          return response;
        } catch (err) {
          const cached = await cache.match(req);
          return cached || fetch(req);
        }
      })
    );
  }
});
