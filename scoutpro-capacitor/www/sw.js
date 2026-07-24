/**
 * ScoutPro Service Worker — v1.0.0
 * Strategy:
 *   • Shell (HTML/JS/CSS)   → Cache-First  (instant loads, background refresh)
 *   • API / dynamic data    → Network-First (fresh, fallback to cache)
 *   • CDN assets            → Stale-While-Revalidate
 *   • Offline fallback      → Served from cache when network fails
 */

const CACHE_NAME        = 'scoutpro-v1';
const RUNTIME_CACHE     = 'scoutpro-runtime-v1';
const CDN_CACHE         = 'scoutpro-cdn-v1';

/* ─── App Shell Files ─────────────────────────────────────────────────────── */
const SHELL_ASSETS = [
  './',
  './index.html',
  './app.js',
  './data.js',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
];

/* ─── CDN Assets to Pre-Cache ─────────────────────────────────────────────── */
const CDN_ASSETS = [
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js',
];

/* ─── Install: cache the app shell ───────────────────────────────────────── */
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const shellCache = await caches.open(CACHE_NAME);
      // Cache shell assets (ignore individual failures so install always succeeds)
      await Promise.allSettled(
        SHELL_ASSETS.map(url =>
          shellCache.add(url).catch(err => console.warn('[SW] Shell cache miss:', url, err))
        )
      );

      const cdnCache = await caches.open(CDN_CACHE);
      await Promise.allSettled(
        CDN_ASSETS.map(url =>
          cdnCache.add(url).catch(err => console.warn('[SW] CDN cache miss:', url, err))
        )
      );

      console.log('[SW] Install complete — ScoutPro v1 cached');
      // Force new SW to activate immediately (skip waiting for old SW to exit)
      self.skipWaiting();
    })()
  );
});

/* ─── Activate: clean up old caches ──────────────────────────────────────── */
self.addEventListener('activate', (event) => {
  const VALID_CACHES = [CACHE_NAME, RUNTIME_CACHE, CDN_CACHE];
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(key => !VALID_CACHES.includes(key))
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      );
      // Take control of all open clients immediately
      await self.clients.claim();
      console.log('[SW] Activate complete — old caches cleared');
    })()
  );
});

/* ─── Fetch: routing strategies ──────────────────────────────────────────── */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and browser-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') return;

  // ── CDN assets (Tailwind, FontAwesome, Chart.js) → Stale-While-Revalidate ─
  if (isCDNAsset(url)) {
    event.respondWith(staleWhileRevalidate(request, CDN_CACHE));
    return;
  }

  // ── App Shell (HTML, JS files in same origin) → Cache-First ───────────────
  if (isShellAsset(url)) {
    event.respondWith(cacheFirst(request, CACHE_NAME));
    return;
  }

  // ── Everything else (images, fonts, misc) → Network-First ─────────────────
  event.respondWith(networkFirst(request, RUNTIME_CACHE));
});

/* ─── Strategy: Cache-First ───────────────────────────────────────────────── */
async function cacheFirst(request, cacheName) {
  const cache    = await caches.open(cacheName);
  const cached   = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    // If totally offline and not cached, return a minimal offline page
    return offlineFallback();
  }
}

/* ─── Strategy: Network-First ─────────────────────────────────────────────── */
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached || offlineFallback();
  }
}

/* ─── Strategy: Stale-While-Revalidate ────────────────────────────────────── */
async function staleWhileRevalidate(request, cacheName) {
  const cache    = await caches.open(cacheName);
  const cached   = await cache.match(request);

  const fetchPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);

  return cached || (await fetchPromise) || offlineFallback();
}

/* ─── Offline Fallback Page ───────────────────────────────────────────────── */
function offlineFallback() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ScoutPro — Offline</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: #0f172a; color: #f1f5f9;
      font-family: system-ui, -apple-system, sans-serif;
      text-align: center; padding: 2rem;
    }
    .icon { font-size: 5rem; margin-bottom: 1.5rem; }
    h1 { font-size: 2rem; font-weight: 700; color: #10b981; margin-bottom: 0.75rem; }
    p  { color: #94a3b8; max-width: 360px; line-height: 1.6; margin-bottom: 1.5rem; }
    button {
      background: #10b981; color: #fff;
      border: none; border-radius: 0.5rem;
      padding: 0.75rem 2rem; font-size: 1rem;
      cursor: pointer; font-weight: 600;
    }
    button:hover { background: #059669; }
  </style>
</head>
<body>
  <div class="icon">⚽</div>
  <h1>You're Offline</h1>
  <p>ScoutPro can't reach the network right now. Your saved data is safe in local storage — reconnect to continue scouting.</p>
  <button onclick="location.reload()">Try Again</button>
</body>
</html>`;

  return new Response(html, {
    status:  200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function isCDNAsset(url) {
  return (
    url.hostname.includes('cdn.tailwindcss.com') ||
    url.hostname.includes('cdnjs.cloudflare.com') ||
    url.hostname.includes('cdn.jsdelivr.net') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  );
}

function isShellAsset(url) {
  // Same origin requests for the main JS/HTML files
  return (
    url.hostname === self.location.hostname &&
    (url.pathname.endsWith('.html') ||
     url.pathname.endsWith('.js') ||
     url.pathname.endsWith('.json') ||
     url.pathname.endsWith('.css') ||
     url.pathname.endsWith('/'))
  );
}

/* ─── Background Sync (placeholder — requires Workbox for full support) ──── */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-evaluations') {
    console.log('[SW] Background sync triggered for evaluations');
    // Extend here if a real backend sync is added in future
  }
});

/* ─── Push Notifications (placeholder) ───────────────────────────────────── */
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? { title: 'ScoutPro', body: 'New scouting update.' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body:    data.body,
      icon:    './icons/icon-192x192.png',
      badge:   './icons/icon-96x96.png',
      vibrate: [200, 100, 200],
      tag:     'scoutpro-notification',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('index.html') && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./index.html');
    })
  );
});
