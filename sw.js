'use strict';
// Cache only the connection notice and college icons, never API or admin data.
const cachePrefix = 'srnr-next-offline:' + self.registration.scope + ':';
const cacheName = cachePrefix + 'v3';
const offlineUrl = new URL('offline.html',self.registration.scope).href;
const assets = ['offline.html','app-icon-180.png','app-icon-192.png','app-icon-512.png','app-icon-maskable-512.png'].map(name => new URL(name,self.registration.scope).href);
self.addEventListener('install',event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assets)).then(() => self.skipWaiting()));
});
self.addEventListener('activate',event => {
  event.waitUntil(caches.keys().then(names => Promise.all(names.filter(name => name.startsWith(cachePrefix) && name !== cacheName).map(name => caches.delete(name)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch',event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  if (request.mode !== 'navigate') {
    if (assets.includes(url.href)) event.respondWith(caches.open(cacheName).then(async cache => await cache.match(url.href) || fetch(request)));
    return;
  }
  event.respondWith(fetch(request).catch(async () => {
    const cache = await caches.open(cacheName);
    return await cache.match(offlineUrl) || Response.error();
  }));
});
