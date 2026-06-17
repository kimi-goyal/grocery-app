import { triggerCouponToast } from '../components/coupons/CouponToastContainer';
import { tokenManager } from '../lib/tokenManager';
import { adminTokenManager } from '../lib/adminTokenManager';
import { authService } from './authService';
import { useNotificationStore } from '../store/notificationStore';

const getWebSocketUrl = () => {
  const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const rawToken = tokenManager.getAccess();
  const token = rawToken && !tokenManager.isExpired(rawToken) ? rawToken : null;
  // Prefer admin token if present and valid (so admin dashboards connect as admin)
  const adminRaw = adminTokenManager.getAccess();
  const adminToken = adminRaw && !adminTokenManager.isExpired(adminRaw) ? adminRaw : null;
  const base = `${scheme}://localhost:8000/ws/notifications`;
  if (adminToken) return `${base}?token=${encodeURIComponent(adminToken)}`;
  return token ? `${base}?token=${encodeURIComponent(token)}` : base;
};

const ensureAccessToken = async () => {
  const accessToken = tokenManager.getAccess();
  if (accessToken && !tokenManager.isExpired(accessToken)) {
    return;
  }

  const refreshToken = tokenManager.getRefresh();
  if (!refreshToken) {
    return;
  }

  try {
    const tokens = await authService.refresh();
    tokenManager.setTokens(tokens.access_token, tokens.refresh_token);
  } catch {
    // ignore refresh failure; socket will attempt without token or fail fast
  }
};

let socket: WebSocket | null = null;
let reconnectTimeout: number | null = null;

const handleMessage = (event: MessageEvent) => {
  try {
    const payload = JSON.parse(event.data);
    // If an order_status payload is received, ensure it belongs to this user.
    if (payload.type === 'order_status') {
      const raw = tokenManager.getAccess();
      const me = raw ? tokenManager.decodePayload(raw) : null;
      const myId = me?.user_id ?? me?.userId ?? null;
      if (!payload.userId || !myId || String(payload.userId) !== String(myId)) {
        // Order updates are only for the owning user.
        return;
      }
    }
    const state = useNotificationStore.getState();
    const addNotification = state.addNotification;

    const createNotification = <T extends Record<string, unknown>>(base: T) => ({
      id: `notif-${Date.now()}`,
      ...base,
    });

    const isDuplicate = (candidate: Record<string, unknown>) =>
      state.notifications.some((existing) =>
        existing.type === candidate.type &&
        existing.title === candidate.title &&
        existing.body === candidate.body &&
        existing.code === candidate.code &&
        existing.orderNumber === candidate.orderNumber &&
        existing.status === candidate.status,
      );

    if (payload.type === 'coupon_added') {
      const notification = {
        type: 'coupon_added' as const,
        title: payload.title ?? 'New coupon available',
        body: payload.body ?? `Use ${payload.code} on your next order!`,
        code: payload.code,
      };

      if (isDuplicate(notification)) {
        return;
      }

      const newNotification = createNotification(notification);
      addNotification(newNotification);
      triggerCouponToast({
        type: 'new_coupon',
        title: newNotification.title as string,
        body: newNotification.body as string,
        code: newNotification.code as string | undefined,
      });
      return;
    }

    if (payload.type === 'order_status') {
      const notification = {
        type: 'order_status' as const,
        title: payload.title ?? 'Delivery status updated',
        body: payload.body ?? `Order ${payload.orderNumber} is now ${payload.status}.`,
        orderNumber: payload.orderNumber,
        status: payload.status,
      };

      if (isDuplicate(notification)) {
        return;
      }

      const newNotification = createNotification(notification);
      addNotification(newNotification);
      triggerCouponToast({
        type: 'expiry_warning',
        title: newNotification.title as string,
        body: newNotification.body as string,
        code: '',
      });
      return;
    }

    // Support chat messages from admin
    if (payload.type === 'support_chat') {
      try {
        console.debug('[wsService] support_chat received', payload);
        window.dispatchEvent(new CustomEvent('support:message', { detail: payload }));
      } catch (e) {
        console.error('[wsService] failed to dispatch support:message', e);
      }
      return;
    }
  } catch {
    // Ignore malformed messages.
  }
};

const createSocket = async () => {
  if (socket && socket.readyState !== WebSocket.CLOSED) {
    return;
  }

  await ensureAccessToken();
  const wsUrl = getWebSocketUrl();
  console.debug('[wsService] connecting to', wsUrl);
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.debug('[wsService] connected');
  };

  socket.onmessage = handleMessage;
  socket.onclose = () => {
    console.debug('[wsService] closed');
    socket = null;
    if (reconnectTimeout === null) {
      reconnectTimeout = window.setTimeout(() => {
        reconnectTimeout = null;
        void createSocket();
      }, 5000);
    }
  };
  socket.onerror = (event) => {
    console.error('[wsService] socket error', event);
    if (socket) {
      socket.close();
    }
  };
};

export const wsService = {
  connect: async () => {
    await createSocket();
  },
  disconnect: () => {
    if (reconnectTimeout !== null) {
      window.clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
    if (socket) {
      socket.close();
    }
  },
};
