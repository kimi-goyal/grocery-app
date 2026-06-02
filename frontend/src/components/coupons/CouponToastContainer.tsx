
import { useEffect, useState, useCallback } from 'react';
import { CouponToast } from './CouponToast';
import type { ToastData } from './CouponToast';

let _addToast: ((t: ToastData) => void) | null = null;

export function triggerCouponToast(toast: Omit<ToastData, 'id'>) {
  if (_addToast) _addToast({ ...toast, id: `toast-${Date.now()}` });
}

export default function CouponToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((t: ToastData) => {
    setToasts(prev => {
      const duplicate = prev.some((existing) =>
        existing.type === t.type &&
        existing.title === t.title &&
        existing.body === t.body &&
        existing.code === t.code,
      );
      if (duplicate) return prev;
      return [...prev.slice(-2), t]; // max 3 stacked
    });
  }, []);

  useEffect(() => {
    _addToast = addToast;

    // Listen for push messages forwarded from service worker
    const handleSWMessage = (event: MessageEvent) => {
      if (event.data?.type === 'COUPON_NOTIFICATION') {
        addToast({
          id: `sw-${Date.now()}`,
          type: 'new_coupon',
          title: '🎁 Coupon Available',
          body: `Use code ${event.data.code} on your next order!`,
          code: event.data.code,
        });
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleSWMessage);
    return () => {
      _addToast = null;
      navigator.serviceWorker?.removeEventListener('message', handleSWMessage);
    };
  }, [addToast]);

  const remove = (id: string) => setToasts(p => p.filter(t => t.id !== id));

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <CouponToast toast={t} onClose={remove} />
        </div>
      ))}
    </div>
  );
}
