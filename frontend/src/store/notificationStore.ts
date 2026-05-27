import { create } from 'zustand';

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

const STORAGE_KEY = 'freshcart_notifications';

const loadNotifications = (): NotificationItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
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
