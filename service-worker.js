/* LIMPIAPP · Service worker
   Estrategia:
   - HTML, JS, CSS, JSON  → red primero (si hay conexión, siempre ves la última versión);
                            si no hay conexión, se sirve la copia guardada.
   - Fuentes, iconos, logo → caché primero (casi nunca cambian).
   - /api/, otros dominios y peticiones que no son GET → no se tocan.
   Como el contenido propio va "red primero", NO hace falta subir el número de versión en
   cada despliegue. Súbelo solo si cambias la lista PRECACHE o la estrategia. */

const VERSION = 'v4';
const CACHE_NAME = 'limpiapp-web-' + VERSION;

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/clientes.html',
  '/registro.html',
  '/login.html',
  '/aviso-legal.html',
  '/privacidad.html',
  '/terminos.html',
  '/cookies.html',
  '/condiciones-profesionales.html',
  '/offline.html',
  '/cookies-consent.js',
  '/waitlist-config.js',
  '/waitlist-i18n.js',
  '/waitlist.js',
  '/manifest.json',
  '/fonts/inter.css',
  '/logo.png',
  '/icons/icon-192.png'
];

const STATIC_ASSET = /\.(?:woff2?|png|jpe?g|webp|svg|ico)$/i;
const NEVER_CACHE = /^\/(?:api\/|.*(?:stripe|checkout|session|app-redirect))/i;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url))).then((results) => {
        results.forEach((r, i) => {
          if (r.status === 'rejected') console.warn('[SW] No se pudo precachear', PRECACHE_URLS[i]);
        });
      })
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function putInCache(request, response) {
  if (response && response.status === 200 && response.type === 'basic') {
    const copy = response.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || NEVER_CACHE.test(url.pathname)) return;

  // Imágenes, fuentes e iconos: caché primero
  if (STATIC_ASSET.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((res) => putInCache(request, res)))
    );
    return;
  }

  // Todo lo demás (HTML, JS, CSS, JSON): red primero, con copia de respaldo sin conexión
  event.respondWith(
    fetch(request)
      .then((res) => putInCache(request, res))
      .catch(() =>
        caches.match(request, { ignoreSearch: true }).then((cached) => {
          if (cached) return cached;
          if (request.mode === 'navigate') return caches.match('/offline.html');
          return Response.error();
        })
      )
  );
});
