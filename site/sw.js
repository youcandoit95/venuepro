/* KORTA service worker — cache-first app shell + runtime cache, offline fallback */
const V = "korta-v12";
const CORE = [
  "./", "index.html", "styles.css", "data.js", "app.js",
  "manifest.webmanifest", "icons/icon.svg",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(V).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  e.respondWith(
    caches.match(req).then((hit) =>
      hit ||
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(V).then((c) => { try { c.put(req, copy); } catch (_) {} });
        return res;
      }).catch(() => (req.mode === "navigate" ? caches.match("index.html") : undefined))
    )
  );
});
