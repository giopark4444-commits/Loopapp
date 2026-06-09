/* Loopapp service worker — cache simple para uso offline */
const CACHE = 'loopapp-v38';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './config.js',
  './manifest.webmanifest',
  './icon.svg',
];

self.addEventListener('install', (e) => {
  // allSettled: aunque algún asset no cargue (p.ej. servido desde un CDN), el SW
  // igual se instala. Esto es clave para que las notificaciones push funcionen.
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.allSettled(ASSETS.map((a) => c.add(a))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // No interceptar peticiones a otros orígenes (Supabase API, generador de QR):
  // deben ir siempre a la red para mostrar datos frescos.
  if (new URL(e.request.url).origin !== self.location.origin) return;
  // stale-while-revalidate: responde AL INSTANTE desde la caché (carga fiable,
  // nunca pantalla en negro por un titubeo de red) y, en paralelo, baja la
  // versión nueva por detrás para la próxima vez. Si no hay nada en caché,
  // espera a la red. Lo mejor de ambos mundos: estable y fresco.
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(e.request);
      const network = fetch(e.request).then((res) => {
        cache.put(e.request, res.clone()).catch(() => {});
        return res;
      }).catch(() => null);
      return cached || (await network) || fetch(e.request);
    })
  );
});

/* ---------- Push (avisos con la app cerrada) ---------- */
self.addEventListener('push', (e) => {
  let data = {};
  try { data = e.data ? e.data.json() : {}; } catch (_) {}
  const title = data.title || 'Loopapp';
  const body = data.body || 'Tienes un recordatorio.';
  e.waitUntil(self.registration.showNotification(title, {
    body, icon: './icon.svg', badge: './icon.svg',
    data: { url: data.url || './' },
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) { if ('focus' in c) return c.focus(); }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
