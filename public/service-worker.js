// PashtoSkills Service Worker
const CACHE_VERSION = 'V3';
const CACHE_NAME = `app-cache-${CACHE_VERSION}`;

// Static shell pages to pre-cache on install
const FILES_TO_CACHE = [
  '/',
  '/manifest',
];

// ─── Install ────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const file of FILES_TO_CACHE) {
        try {
          await cache.add(new Request(file, { cache: 'reload' }));
        } catch (err) {
          console.warn('[SW] Pre-cache failed for', file, err);
        }
      }
    })
  );
});

// ─── Activate ───────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  // Clean up old caches only — do NOT call clients.claim() here.
  // skipWaiting() + clients.claim() together cause a race: the SW takes over
  // existing tabs mid-session, interrupting in-flight fetches and producing
  // empty responses that throw "Unexpected end of JSON input".
  // The SW will take control naturally on the next page navigation.
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  console.log('[SW] Activated');
});


// ─── Fetch ──────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;

  // Only handle same-origin GET requests
  if (request.method !== 'GET' || !url.startsWith(self.location.origin)) return;

  // Bypass: auth, dynamic APIs, admin, upload, Next.js internal chunks, auth pages
  const shouldBypass =
    url.includes('/api/auth/') ||
    url.includes('/api/payment') ||
    url.includes('/api/admin') ||
    url.includes('/api/upload') ||
    url.includes('/api/progress') ||
    url.includes('/api/video/') ||
    url.includes('/api/courses') ||
    url.includes('/api/debug') ||
    url.includes('/_next/static/chunks/') ||
    url.includes('/login') ||
    url.includes('/register');

  if (shouldBypass) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((networkResponse) => {
          // Only cache successful, same-origin, basic responses
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic'
          ) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone)).catch(() => {});
          }
          return networkResponse;
        })
        .catch(() => {
          // ── Offline fallback ──────────────────────────────────────────────
          // Return JSON for API-like requests, HTML for navigation requests
          if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/') || new Response(
              '<html><body><p>You are offline.</p></body></html>',
              { headers: { 'Content-Type': 'text/html' } }
            );
          }
          // JSON fallback so .json() callers don't throw "Unexpected end of JSON"
          return new Response(
            JSON.stringify({ error: 'offline', message: 'You are offline.' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
          );
        });
    })
  );
});

// ─── Messages ────────────────────────────────────────────────────────────────
self.addEventListener('message', (event) => {
  const msg = event.data || {};

  if (msg.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (msg.type === 'CLEAR_CACHES') {
    event.waitUntil(
      caches.keys()
        .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        .then(() =>
          self.clients.matchAll({ includeUncontrolled: true }).then((clients) =>
            clients.forEach((c) => c.postMessage({ type: 'CACHES_CLEARED' }))
          )
        )
    );
  }
});
