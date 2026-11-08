/* DEEN — সার্ভিস ওয়ার্কার
   • ওয়েবসাইটের মূল ফাইলগুলো (শেল) ক্যাশে রাখে, যাতে দুর্বল ইন্টারনেটেও খোলে
   • সবসময় আগে নেটওয়ার্ক থেকে নতুন সংস্করণ নেয়; নেটওয়ার্ক না থাকলে ক্যাশ দেখায়
   • অন্য ওয়েবসাইট (Supabase, Google Fonts, CDN) কখনো ক্যাশ করে না — তথ্য সবসময় সরাসরি আসে */

var VERSION = 'deen-v2';
var SHELL = [
  './', './index.html', './deen.css', './deen.js', './cms.css', './cms.js',
  './manifest.json', './icon.svg', './images/logo.jpg'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(VERSION).then(function (cache) {
      // একটি ফাইল না থাকলেও যেন পুরো ইনস্টল ব্যর্থ না হয়
      return Promise.all(SHELL.map(function (u) {
        return cache.add(u).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== VERSION; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;

  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // বাইরের সব সেবা সরাসরি

  event.respondWith(
    fetch(req).then(function (res) {
      if (res && res.ok) {
        var copy = res.clone();
        caches.open(VERSION).then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) {
        if (hit) return hit;
        if (req.mode === 'navigate') return caches.match('./index.html');
        return Response.error();
      });
    })
  );
});
