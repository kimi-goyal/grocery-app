import { create } from 'zustand';
import { privateApi } from '../../services/api';

export type Coupon = {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: number;
  type: 'percentage' | 'flat';
  minOrder: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  expiry: string;
  active: boolean;
  pushNotify?: boolean;
  notifyBeforeExpiryHours?: number;
};

interface CouponState {
  coupons: Coupon[];
  loading: boolean;
  fetchCoupons: () => Promise<void>;
  addCoupon: (c: Omit<Coupon, 'id' | 'usedCount'>) => Promise<void>;
  toggleActive: (id: string) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
}

type BackendCoupon = {
  id: string;
  code: string;
  title: string;
  description: string | null;
  discount: number;
  type: 'percentage' | 'flat';
  min_order: number;
  max_discount: number;
  usage_limit: number;
  used_count: number;
  expiry: string;
  active: boolean;
  push_notify?: boolean;
  notify_before_expiry_hours?: number;
};

const mapCoupon = (coupon: BackendCoupon): Coupon => ({
  id: coupon.id,
  code: coupon.code,
  title: coupon.title,
  description: coupon.description || '',
  discount: coupon.discount,
  type: coupon.type,
  minOrder: coupon.min_order,
  maxDiscount: coupon.max_discount,
  usageLimit: coupon.usage_limit,
  usedCount: coupon.used_count,
  expiry: coupon.expiry,
  active: coupon.active,
  pushNotify: coupon.push_notify,
  notifyBeforeExpiryHours: coupon.notify_before_expiry_hours,
});

export const useCouponStore = create<CouponState>((set) => ({
  coupons: [],
  loading: false,
  fetchCoupons: async () => {
    set({ loading: true });
    const response = await privateApi.get<BackendCoupon[]>('/admin/coupons');
    set({ coupons: response.data.map(mapCoupon), loading: false });
  },
  addCoupon: async (coupon) => {
    const payload = {
      code: coupon.code,
      title: coupon.title,
      description: coupon.description,
      discount: coupon.discount,
      type: coupon.type,
      min_order: coupon.minOrder,
      max_discount: coupon.maxDiscount,
      usage_limit: coupon.usageLimit,
      expiry: coupon.expiry,
      active: coupon.active,
      target_type: 'all',
      push_notify: coupon.pushNotify ?? false,
      notify_before_expiry_hours: coupon.notifyBeforeExpiryHours ?? 24,
      image_url: null,
    };

    console.log('Coupon create payload:', JSON.stringify(payload, null, 2));

    try {
      const response = await privateApi.post<BackendCoupon>('/admin/coupons', payload);
      set((state) => ({ coupons: [...state.coupons, mapCoupon(response.data)] }));
    } catch (error: any) {
      console.error('Coupon create error response:', error.response?.data);
      console.error('Coupon create error status:', error.response?.status);
      console.error('Coupon create error message:', error.message);
      alert(`Error creating coupon: ${error.response?.data?.detail || error.message}`);
      throw error;
    }
  },
  toggleActive: async (id) => {
    const response = await privateApi.patch<BackendCoupon>(`/admin/coupons/${id}/toggle`);
    set((state) => ({
      coupons: state.coupons.map((coupon) =>
        coupon.id === id ? mapCoupon(response.data) : coupon,
      ),
    }));
  },
  deleteCoupon: async (id) => {
    await privateApi.delete(`/admin/coupons/${id}`);
    set((state) => ({ coupons: state.coupons.filter((coupon) => coupon.id !== id) }));
  },
}));
