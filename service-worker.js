
const CACHE_NAME = "deen-pwa-v1";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./offline.html",
  "./deen.css",
  "./cms.css",
  "./deen.js",
  "./images/logo.jpg"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key =>
            key.startsWith("deen-pwa-") &&
            key !== CACHE_NAME
          )
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch
self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);

  // Only GET requests from this website
  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin
  ) return;

  // Never cache login, dashboard or private pages
  if (
    /\/(login|admin|admin-dashboard|teacher-dashboard|dashboard|apply)(\.html)?$/i.test(url.pathname)
  ) return;

  // Pages: network first, offline fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        return await caches.match("./offline.html");
      })
    );
    return;
  }

  // Cache only approved public static files
  const allowed = [
    "./deen.css",
    "./cms.css",
    "./deen.js",
    "./images/logo.jpg"
  ];

  const relativePath =
    url.pathname.replace(/.*\/DEEN-\//, "./");

  if (!allowed.includes(relativePath)) return;

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
