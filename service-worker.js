/*
 * Service Worker for Diraasti
 *
 * This basic service worker implements an offline shell for static assets.  It
 * pre‑caches the application shell on install and serves cached files when
 * offline.  Requests to external AI endpoints (e.g. Google Generative AI)
 * bypass the cache and always go to the network.  See MDN for background on
 * service workers: service workers act as proxy servers that sit between the
 * application, the browser and the network, allowing you to intercept
 * requests and provide offline experiences【87356029003546†L109-L123】.
 */

const CACHE_NAME = 'diraasti-cache-v2';

// List of URLs to cache on install.  Include the root, index and key assets.
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/App.js',
  '/manifest.webmanifest',
  '/assets/logo.svg',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  '/assets/favicon.png'
];

// Install event: cache static resources.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event: clean up old caches.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: serve from cache when possible.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // Bypass caching for external AI and streaming calls.  If the request
  // contains 'googleapis.com' or other AI endpoints, let it hit the network.
  if (/generative|googleapis/gi.test(url.hostname)) {
    return; // allow network fetch
  }
  // For navigation requests, respond with the cached index.html to support
  // client‑side routing.  Otherwise try cache then network.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then((response) => response || fetch(event.request))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          // If both cache and network fail, return nothing
          return undefined;
        })
      );
    })
  );
});