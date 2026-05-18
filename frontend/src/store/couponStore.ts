import { create } from 'zustand';
import { couponService } from '../services/couponService';
import { pushService } from '../services/pushService';
import type { UserCoupon } from '../types/coupon.types';

interface CouponState {
  coupons: UserCoupon[];
  loading: boolean;
  pushPermission: NotificationPermission | 'unsupported';
  showNotifBanner: boolean;

  fetchCoupons: () => Promise<void>;
  requestPush: () => Promise<void>;
  dismissBanner: () => void;
}

export const useCouponStore = create<CouponState>((set, get) => ({
  coupons: [],
  loading: false,
  pushPermission: 'default',
  showNotifBanner: false,

  fetchCoupons: async () => {
    set({ loading: true });
    try {
      const data = await couponService.getMyCoupons();
      set({ coupons: data, loading: false });

      // Show notification banner if user hasn't granted push yet
      const supported = await pushService.isSupported();
      if (supported) {
        const perm = await pushService.getPermission();
        set({ pushPermission: perm });
        if (perm === 'default') {
          set({ showNotifBanner: true });
        } else if (perm === 'granted') {
          // Ensure subscription is active (re-subscribes if SW was cleared)
          pushService.subscribe().catch(() => {});
        }
      } else {
        set({ pushPermission: 'unsupported' });
      }
    } catch {
      set({ loading: false });
    }
  },

  requestPush: async () => {
    const granted = await pushService.requestPermission();
    if (granted) {
      await pushService.subscribe();
      set({ pushPermission: 'granted', showNotifBanner: false });
    } else {
      set({ pushPermission: 'denied', showNotifBanner: false });
    }
  },

  dismissBanner: () => set({ showNotifBanner: false }),
}));

