/* Estos son los archivos que queremoa guardar en la cache */
const cacheName = 'andreslarrotta',
    staticAssets = [
        './',
        'css/main.css',
        'js/main.js',
    ]

/* funcione que instala todos los archvivos al la memoria del navegador */
self.addEventListener('install', async e => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return self.skipWaiting()
})

self.addEventListener('activate', e => {
    self.clients.claim()
})

self.addEventListener('fetch', async e => {
    const req = e.request,
        url = new URL(req.url);

    if (url.origin === location.origin) {
        e.respondWith(cacheFirst(req))
    }
    else {
        e.respondWith(networkAndCache(req))
    }
})

async function cacheFirst(req) {
    const cache = await caches.open(cacheName),
        cached = await cache.match(req)

    return cached || fetch(req)
}
async function networkAndCache(req) {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(req)
        await cache.put(req, fresh.clone())
        return fresh
    } catch (e) {
        const cached = await cache.match(req)
        return cached
    }
}
