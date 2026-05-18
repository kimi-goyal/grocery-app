

export type DiscountType = 'percentage' | 'flat';
export type TargetType = 'all' | 'new_user' | 'specific';

export interface UserCoupon {
  id: string;
  code: string;
  title: string;
  description: string | null;
  discount: number;
  type: DiscountType;
  min_order: number;
  max_discount: number;
  expiry: string;
  image_url: string | null;
  is_used: boolean;
  hours_left: number | null; // null = more than 48h left
}

export interface CouponValidateResponse {
  valid: boolean;
  discount_amount: number;
  message: string;
  coupon: UserCoupon | null;
}

