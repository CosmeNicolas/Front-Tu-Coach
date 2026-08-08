/* TuCoach Service Worker — Web Push */
const CACHE_NAME = 'tucoach-push-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      ),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener('push', (event) => {
  let data = {
    title: 'TuCoach',
    body: 'Tenés una nueva notificación',
    icon: '/branding/ZORRO1.png',
    badge: '/branding/ZORRO1.png',
    tag: 'tucoach',
    data: { url: '/' },
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      data = { ...data, ...payload };
      if (payload?.data?.url) {
        data.data = { ...data.data, url: payload.data.url };
      }
    } catch {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'TuCoach', {
      body: data.body,
      icon: data.icon || '/branding/ZORRO1.png',
      badge: data.badge || '/branding/ZORRO1.png',
      tag: data.tag || 'tucoach',
      data: data.data || { url: '/' },
      requireInteraction: false,
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  let urlToOpen = event.notification.data?.url || '/';
  if (urlToOpen.startsWith('/')) {
    urlToOpen = self.location.origin + urlToOpen;
  } else if (!urlToOpen.startsWith('http')) {
    urlToOpen = self.location.origin + '/' + urlToOpen;
  }

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.startsWith(self.location.origin) && 'focus' in client) {
            if (client.url !== urlToOpen && 'navigate' in client) {
              return client.navigate(urlToOpen).then(() => client.focus());
            }
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
        return undefined;
      })
      .catch(() => {
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
        return undefined;
      }),
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
