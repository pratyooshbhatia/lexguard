/* LexGuard service worker
 *
 * Minimal, hand-rolled SW. Kept tiny so it's auditable and doesn't compete
 * with a future build-pipeline-generated worker (next-pwa, serwist).
 *
 * Strategy:
 *   - Pre-cache the offline shell on install.
 *   - Network-first for navigations (fall back to offline page).
 *   - Stale-while-revalidate for static assets.
 *   - Never cache /api/* — analysis must be fresh and isn't safe to replay.
 */

const VERSION = "lexguard-v1";
const SHELL = ["/", "/offline", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.pathname.startsWith("/api/")) return; // never cache API calls

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/offline"))
    );
    return;
  }

  if (request.method === "GET" && url.origin === self.location.origin) {
    event.respondWith(
      caches.open(VERSION).then(async (cache) => {
        const cached = await cache.match(request);
        const fetched = fetch(request)
          .then((res) => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || fetched;
      })
    );
  }
});
