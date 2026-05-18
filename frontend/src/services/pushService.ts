import { privateApi, publicApi } from './api';

const SW_PATH = '/sw.js';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

export const pushService = {
  async getVapidKey(): Promise<string> {
    const res = await publicApi.get('/push/vapid-public-key');
    return res.data.key;
  },

  async isSupported(): Promise<boolean> {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  },

  async getPermission(): Promise<NotificationPermission> {
    return Notification.permission;
  },

  async requestPermission(): Promise<boolean> {
    const result = await Notification.requestPermission();
    return result === 'granted';
  },

  async subscribe(): Promise<PushSubscription | null> {
    if (!(await this.isSupported())) return null;

    const reg = await navigator.serviceWorker.register(SW_PATH);
    await navigator.serviceWorker.ready;

    const vapidKey = await this.getVapidKey();
    if (!vapidKey) return null;

    const existing = await reg.pushManager.getSubscription();
    if (existing) return existing;

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
    });

    // Send to backend
    const json = sub.toJSON();
    await privateApi.post('/push/subscribe', {
      endpoint: json.endpoint,
      p256dh: json.keys?.p256dh,
      auth: json.keys?.auth,
      user_agent: navigator.userAgent,
    });

    return sub;
  },

  async unsubscribe(): Promise<void> {
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) return;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return;
    await privateApi.delete(`/push/unsubscribe?endpoint=${encodeURIComponent(sub.endpoint)}`);
    await sub.unsubscribe();
  },
};

