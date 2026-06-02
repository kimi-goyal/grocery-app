import { privateApi } from './api';
import type { Address, CouponResult } from '../types/checkout.types';

export const checkoutService = {
  // Address endpoints
  getAddresses: (): Promise<Address[]> =>
    privateApi.get('/addresses').then(r => r.data),

  createAddress: (data: Omit<Address, 'id'>): Promise<Address> =>
    privateApi.post('/addresses', data).then(r => r.data),

  deleteAddress: (id: number): Promise<void> =>
    privateApi.delete(`/addresses/${id}`).then(r => r.data),

  setDefaultAddress: (id: number): Promise<void> =>
    privateApi.patch(`/addresses/${id}/default`).then(r => r.data),

  // Coupon validation (only on step 1)
  validateCoupon: (code: string, order_amount: number): Promise<CouponResult> =>
    privateApi.post('/coupons/validate', { code, order_amount }).then(r => r.data),

  // Place order
  placeOrder: (payload: {
    address_id: number;
    payment_method: 'razorpay' | 'cod';
    coupon_code?: string;
    razorpay_payment_id?: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }) => privateApi.post('/orders', payload).then(r => r.data),

  // Create Razorpay order (backend generates order_id)
  createRazorpayOrder: (amount: number) =>
    privateApi.post('/orders/razorpay/create', { amount }).then(r => r.data),
};

