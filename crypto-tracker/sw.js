// 2. sw.js (в корне)
self.addEventListener('install', (event) => {
    console.log('✅ Service Worker установлен');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker активирован');
    event.waitUntil(self.clients.claim());
});