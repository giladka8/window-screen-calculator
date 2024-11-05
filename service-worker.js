const CACHE_NAME = 'window-screen-cache-v3'; // Update version when you make changes
const urlsToCache = [
    '/index.html',
    '/sliding-window.jpg',
    '/dry-keep-window.jpg',
    '/styles.css',
];

// Install event - cache resources
self.addEventListener('install', event => {
    self.skipWaiting(); // Activate the service worker immediately
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch event - serve from cache if available, else fetch from network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

// Activate event - clear old caches
self.addEventListener('activate', event => {
    clients.claim(); // Take control of all clients immediately
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
