import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useCheckoutStore } from '../../store/checkoutStore';
import type { UserCoupon } from '../../types/coupon.types';

interface Props {
  showCoupon: boolean; // only true on step 1
}

export default function OrderSummaryPanel({ showCoupon }: Props) {
  const navigate = useNavigate();
  const { items, updateQty, removeItem, totalPrice } = useCartStore();
  const {
    couponCode, couponResult,
    setCouponCode, setCouponResult,
    step,
  } = useCheckoutStore();
  const [showCouponList, setShowCouponList] = useState(false);
  const [coupons, setCoupons] = useState<UserCoupon[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  const subtotal = totalPrice();
  const delivery = subtotal >= 299 ? 0 : 20;
  const discount = couponResult?.valid ? couponResult.discount_amount : 0;
  const total = subtotal + delivery - discount;

  useEffect(() => {
    if (showCoupon && showCouponList && coupons.length === 0) {
      fetchCoupons();
    }
  }, [showCoupon, showCouponList]);

  const fetchCoupons = async () => {
    setLoadingCoupons(true);
    try {
      const { couponService } = await import('../../services/couponService');
      const userCoupons = await couponService.getMyCoupons();
      setCoupons(userCoupons);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setLoadingCoupons(false);
    }
  };

  const handleSelectCoupon = async (coupon: UserCoupon) => {
    setCouponCode(coupon.code);
    try {
      const { checkoutService } = await import('../../services/checkoutService');
      const res = await checkoutService.validateCoupon(coupon.code, subtotal);
      setCouponResult(res);
    } catch {
      setCouponResult({ valid: false, discount_amount: 0, message: 'Failed to validate coupon.' });
    }
  };

  const getDiscount = (coupon: UserCoupon): number => {
    if (coupon.type === 'percentage') {
      const disc = (subtotal * coupon.discount) / 100;
      return Math.min(disc, coupon.max_discount);
    }
    return Math.min(coupon.discount, coupon.max_discount);
  };

  const isEligible = (coupon: UserCoupon): boolean => {
    return !coupon.is_used && subtotal >= coupon.min_order;
  };

  const applicableCoupons = coupons.filter(isEligible).sort((a, b) => {
    if (a.discount !== b.discount) return b.discount - a.discount;
    return (a.hours_left ?? Number.MAX_SAFE_INTEGER) - (b.hours_left ?? Number.MAX_SAFE_INTEGER);
  });

  return (
    <div className="bg-[rgba(17,25,40,0.7)] border border-white/8 rounded-2xl overflow-hidden backdrop-blur-xl">
      <div className="p-5 border-b border-white/6">
        <h3 className="text-white font-bold text-base" style={{ fontFamily: 'Sora,sans-serif' }}>
          Order Summary
        </h3>
      </div>

      {/* Items — editable only on step 1 */}
      <div className="p-4 flex flex-col gap-3 max-h-64 overflow-y-auto scrollbar-hide">
        {items.map(item => (
          <div key={item.product_id} className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/8 shrink-0">
              <img
                src={item.image || undefined}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#ff4d6d] rounded-full text-[9px] font-bold text-white flex items-center justify-center border border-[#050816]">
                {item.qty}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate" style={{ fontFamily: 'Sora,sans-serif' }}>{item.name}</p>
              <p className="text-gray-500 text-[10px]">{item.unit}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="text-white text-xs font-bold">₹{item.price * item.qty}</span>
              {step === 1 ? (
                <div className="flex items-center gap-1 bg-[#ff4d6d]/10 border border-[#ff4d6d]/20 rounded-lg px-1.5 py-0.5">
                  <button
                    onClick={() => item.qty === 1 ? removeItem(item.product_id) : updateQty(item.product_id, item.qty - 1)}
                    className="text-[#ff4d6d] font-bold text-xs w-4 h-4 flex items-center justify-center hover:text-pink-300 transition-colors"
                  >
                    {item.qty === 1 ? '×' : '−'}
                  </button>
                  <span className="text-white text-[10px] font-bold w-3 text-center">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.product_id, item.qty + 1)}
                    className="text-[#ff4d6d] font-bold text-xs w-4 h-4 flex items-center justify-center hover:text-pink-300 transition-colors"
                  >+</button>
                </div>
              ) : (
                <span className="text-gray-600 text-[10px]">×{item.qty}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Coupon — only step 1 */}
      {showCoupon && (
        <div className="px-4 py-3 border-t border-white/6 space-y-2">
          {/* Applied coupon or toggle button */}
          <button
            onClick={() => setShowCouponList(!showCouponList)}
            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all"
            style={{
              background: couponResult?.valid ? 'rgba(34,197,94,0.12)' : 'rgba(255,77,109,0.12)',
              border: couponResult?.valid ? '1.5px solid rgba(34,197,94,0.3)' : '1.5px solid rgba(255,77,109,0.3)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={couponResult?.valid ? '#22c55e' : '#ff4d6d'} strokeWidth="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            <div className="flex-1 text-left">
              <p className="text-xs font-bold text-white" style={{ fontFamily: 'Sora,sans-serif' }}>
                {couponResult?.valid ? `Coupon: ${couponCode}` : 'Available Offers'}
              </p>
              {couponResult?.valid && (
                <p className="text-[10px] text-green-400 mt-0.5">🎉 Save ₹{discount}</p>
              )}
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: couponResult?.valid ? '#22c55e' : '#ff4d6d', transform: showCouponList ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
          {couponResult && !couponResult.valid && (
            <p className="text-[10px] text-red-400 px-1">⚠ {couponResult.message}</p>
          )}

          {/* Inline coupon list */}
          {showCouponList && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {loadingCoupons ? (
                <div className="flex items-center justify-center py-6 gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-[#ff4d6d]/30 border-t-[#ff4d6d] animate-spin" />
                  <p className="text-gray-500 text-xs">Loading offers...</p>
                </div>
              ) : applicableCoupons.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-xs">No applicable coupons</p>
                </div>
              ) : (
                applicableCoupons.map(coupon => {
                  const disc = getDiscount(coupon);
                  const isApplied = couponResult?.valid && couponCode === coupon.code;
                  return (
                    <button
                      key={coupon.id}
                      onClick={() => handleSelectCoupon(coupon)}
                      className="w-full p-2.5 rounded-lg border transition-all text-left text-xs"
                      style={{
                        border: isApplied ? '1.5px solid #ff4d6d' : '1px solid rgba(255,255,255,0.1)',
                        background: isApplied ? 'rgba(255,77,109,0.08)' : 'rgba(255,255,255,0.02)',
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold text-xs" style={{ fontFamily: 'Sora,sans-serif' }}>
                            {coupon.code}
                          </p>
                          <p className="text-gray-400 text-[10px]">{coupon.title}</p>
                          <p className="text-green-400 font-semibold text-[10px] mt-1">Save ₹{disc.toFixed(0)}</p>
                        </div>
                        {isApplied && (
                          <span className="text-green-400 font-bold text-xs">✓</span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
              
              {/* Browse all offers link */}
              {applicableCoupons.length > 0 && (
                <button
                  onClick={() => navigate('/offers')}
                  className="w-full py-2 px-3 rounded-lg text-xs font-bold text-[#ff4d6d] border border-[#ff4d6d]/20 bg-[#ff4d6d]/5 hover:bg-[#ff4d6d]/10 transition-all text-center"
                  style={{ fontFamily: 'Sora,sans-serif' }}
                >
                  Browse All Offers →
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Price breakdown */}
      <div className="px-4 py-3 border-t border-white/6 space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
          <span className="text-gray-300">₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Delivery</span>
          <span className={delivery === 0 ? 'text-green-400 font-semibold' : 'text-gray-300'}>
            {delivery === 0 ? 'FREE' : `₹${delivery}`}
          </span>
        </div>
        {couponResult?.valid && (
          <div className="flex justify-between text-xs text-green-400">
            <span>Coupon ({couponCode})</span>
            <span>−₹{discount}</span>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t border-white/6">
          <span className="text-sm font-bold text-white" style={{ fontFamily: 'Sora,sans-serif' }}>Total</span>
          <span className="text-xl font-black text-[#ff4d6d]" style={{ fontFamily: 'Sora,sans-serif' }}>₹{total}</span>
        </div>
        {couponResult?.valid && (
          <div className="text-center text-[10px] text-green-400 bg-green-500/8 border border-green-500/15 rounded-lg py-1.5">
            🎉 You save ₹{discount + (delivery === 0 ? 20 : 0)} on this order
          </div>
        )}
      </div>
    </div>
  );
}
