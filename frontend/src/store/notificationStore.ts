import { create } from 'zustand';
import { tokenManager } from '../lib/tokenManager';

export type NotificationEventType = 'coupon_added' | 'order_status';

export interface NotificationItem {
  id: string;
  type: NotificationEventType;
  title: string;
  body: string;
  code?: string;
  orderNumber?: string;
  status?: string;
  createdAt: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  addNotification: (notification: Omit<NotificationItem, 'createdAt'>) => void;
  clearNotifications: () => void;
}

const baseStorageKey = 'freshcart_notifications';

const getUserScopedKey = (): string => {
  try {
    const raw = tokenManager.getAccess();
    const payload = raw ? tokenManager.decodePayload(raw) : null;
    const id = payload?.user_id ?? payload?.userId ?? 'anon';
    return `${baseStorageKey}_${String(id)}`;
  } catch {
    return `${baseStorageKey}_anon`;
  }
};

const loadNotifications = (): NotificationItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const key = getUserScopedKey();
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveNotifications = (notifications: NotificationItem[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const key = getUserScopedKey();
    localStorage.setItem(key, JSON.stringify(notifications));
  } catch {
    // ignore localStorage failures
  }
};

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: loadNotifications(),
  addNotification: (notification) =>
    set((state) => {
      const alreadyExists = state.notifications.some((existing) =>
        existing.type === notification.type &&
        existing.title === notification.title &&
        existing.body === notification.body &&
        existing.code === notification.code &&
        existing.orderNumber === notification.orderNumber &&
        existing.status === notification.status,
      );
      if (alreadyExists) {
        return state;
      }

      const notifications = [
        {
          ...notification,
          createdAt: new Date().toISOString(),
        },
        ...state.notifications,
      ].slice(0, 50);

      saveNotifications(notifications);
      return { notifications };
    }),
  clearNotifications: () => {
    saveNotifications([]);
    return set({ notifications: [] });
  },
}));
