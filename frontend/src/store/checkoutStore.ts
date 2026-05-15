import { create } from 'zustand';
import type { CheckoutStep, PaymentMethod, CouponResult } from '../types/checkout.types';

interface CheckoutState {
  step: CheckoutStep;
  selectedAddressId: number | null;
  paymentMethod: PaymentMethod;
  couponCode: string;
  couponResult: CouponResult | null;
  orderNumber: string | null;

  setStep: (s: CheckoutStep) => void;
  setSelectedAddress: (id: number) => void;
  setPaymentMethod: (m: PaymentMethod) => void;
  setCouponCode: (c: string) => void;
  setCouponResult: (r: CouponResult | null) => void;
  setOrderNumber: (n: string) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  step: 1,
  selectedAddressId: null,
  paymentMethod: 'razorpay',
  couponCode: '',
  couponResult: null,
  orderNumber: null,

  setStep: (step) => set({ step }),
  setSelectedAddress: (id) => set({ selectedAddressId: id }),
  setPaymentMethod: (m) => set({ paymentMethod: m }),
  setCouponCode: (c) => set({ couponCode: c }),
  setCouponResult: (r) => set({ couponResult: r }),
  setOrderNumber: (n) => set({ orderNumber: n }),
  reset: () => set({
    step: 1, selectedAddressId: null,
    paymentMethod: 'razorpay', couponCode: '',
    couponResult: null, orderNumber: null,
  }),
}));


