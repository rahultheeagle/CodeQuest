// Service Worker for PWA
const CACHE_NAME = 'codequest-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/editor.html',
    '/challenges.html',
    '/resources.html',
    '/css/main.css',
    '/css/components.css',
    '/css/editor.css',
    '/css/animations.css',
    '/js/app.js',
    '/js/editor.js',
    '/js/challenges.js',
    '/js/validation.js',
    '/js/storage.js',
    '/js/achievements.js',
    '/js/utils.js',
    '/js/progress-tracker.js',
    '/data/challenges.json'
];

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});