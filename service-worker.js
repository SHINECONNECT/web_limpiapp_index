const CACHE_NAME = 'limpiapp-web-index-v1';

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
  '/cookies-consent.js',
  '/manifest.json',
  '/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        PRECACHE_URLS.map((url) => cache.add(url))
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Solo GET del mismo origen; nunca interceptar APIs, sesiones, auth ni pagos
  if (
    request.method !== 'GET' ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('stripe') ||
    url.pathname.includes('checkout') ||
    url.pathname.includes('auth') ||
    url.pathname.includes('session')
  ) {
    return;
  }

  const isHtmlOrJs =
    request.mode === 'navigate' ||
    request.headers.get('accept')?.includes('text/html') ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.js');

  // Network-first para HTML y JS para reflejar cambios de planes, textos o redirección a la app
  if (isHtmlOrJs) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('/index.html'))
        )
    );
    return;
  }

  // Cache-first para manifiesto e imágenes del repositorio
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
