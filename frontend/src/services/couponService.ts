
import { privateApi, publicApi } from './api';
import type { UserCoupon, CouponValidateResponse } from '../types/coupon.types';

export const couponService = {
  // User-facing
  getMyCoupons: (): Promise<UserCoupon[]> =>
    privateApi.get('/coupons').then(r => r.data),

  validate: (code: string, order_amount: number): Promise<CouponValidateResponse> =>
    privateApi.post('/coupons/validate', { code, order_amount }).then(r => r.data),
};

