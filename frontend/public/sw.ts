/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

export {};

sw.addEventListener('push', (event: PushEvent) => {
  if (!event.data) return;

  let payload: any;

  try {
    payload = event.data.json();
  } catch {
    payload = { title: 'FreshCart', body: event.data.text() };
  }

  const { title, body, type, code, url } = payload;

  const iconMap: Record<string, string> = {
    new_coupon: '/icons/coupon-icon.png',
    expiry_warning: '/icons/warning-icon.png',
  };

  const options = {
    body,
    icon: iconMap[type] || '/icons/logo-192.png',
    badge: '/icons/badge-72.png',
    tag: `freshcart-${type}-${code}`,
    requireInteraction: type === 'expiry_warning',
    vibrate: [200, 100, 200],
    data: { url: url || '/', code, type },
    actions:
      type === 'new_coupon'
        ? [
            { action: 'apply', title: '🛒 Use Now' },
            { action: 'view', title: '👀 View Coupons' },
          ]
        : [{ action: 'apply', title: '⚡ Apply Before Expiry' }],
  } as NotificationOptions; // ✅ fixes renotify error

  event.waitUntil(
    sw.registration.showNotification(title, options)
  );
});

sw.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  const action = event.action;
  const { url, code } = event.notification.data || {};

  let target = '/';
  if (action === 'apply') target = '/checkout';
  else if (action === 'view') target = '/coupons';
  else if (url) target = url;

  event.waitUntil(
    sw.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients: readonly WindowClient[]) => {

        for (const client of windowClients) {
          if ('focus' in client) {
            client.focus();
            client.postMessage({ type: 'COUPON_NOTIFICATION', code, action });
            return;
          }
        }

        if (sw.clients.openWindow) {
          return sw.clients.openWindow(target);
        }
      })
  );
});

sw.addEventListener('install', () => {
  sw.skipWaiting();
});

sw.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(sw.clients.claim());
});