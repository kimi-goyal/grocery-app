
export type OrderStatus = 'Pending' | 'Packed' | 'On the Way' | 'Delivered' | 'Cancelled'; 

export interface Address {
  id: number;
  tag: 'Home' | 'Work' | 'Other';
  name: string;
  line1: string;
  line2: string;
  phone: string;
  lat?: number;
  lng?: number;
  is_default: boolean;
}

export interface CouponResult {
  valid: boolean;
  discount_amount: number;
  message: string;
}

export type AddressCreate = {
  tag: 'Home' | 'Work' | 'Other';
  name: string;
  line1: string;
  line2: string;
  phone: string;
  lat?: number;
  lng?: number;
};

export type PaymentMethod = 'razorpay' | 'cod';

export type CheckoutStep = 1 | 2 | 3 | 4;

