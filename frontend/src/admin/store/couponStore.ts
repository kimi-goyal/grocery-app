
import { create } from 'zustand';
import { MOCK_COUPONS } from '../data/mockData';

export type Coupon = { id: string; code: string; discount: number; type: 'percentage' | 'flat'; minOrder: number; maxDiscount: number; usageLimit: number; usedCount: number; expiry: string; active: boolean; description: string; };

interface CouponState {
  coupons: Coupon[];
  loading: boolean;
  fetchCoupons: () => void;
  addCoupon: (c: Omit<Coupon, 'id' | 'usedCount'>) => void;
  toggleActive: (id: string) => void;
  deleteCoupon: (id: string) => void;
}

export const useCouponStore = create<CouponState>((set) => ({
  coupons: MOCK_COUPONS as Coupon[],
  loading: false,
  fetchCoupons: () => {
    // Future: GET /api/admin/coupons -> populate store
    set({ loading: true });
    setTimeout(() => set({ coupons: MOCK_COUPONS as Coupon[], loading: false }), 300);
  },
  addCoupon: (c) => {
    // Future: POST /api/admin/coupons, optimistic insert
    set(s => ({ coupons: [...s.coupons, { ...c, id: `cp${Date.now()}`, usedCount: 0 }] }));
  },
  toggleActive: (id) => {
    // Future: PATCH /api/admin/coupons/:id/toggle
    set(s => ({ coupons: s.coupons.map(c => c.id === id ? { ...c, active: !c.active } : c) }));
  },
  deleteCoupon: (id) => {
    // Future: DELETE /api/admin/coupons/:id
    set(s => ({ coupons: s.coupons.filter(c => c.id !== id) }));
  },
}));
