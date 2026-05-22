
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useCheckoutStore } from '../../store/checkoutStore';
import { couponService } from '../../services/couponService';
import type { UserCoupon } from '../../types/coupon.types';

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, updateQty, removeItem, totalPrice, clearCart } = useCartStore();
  const { couponCode, couponResult, setCouponCode, setCouponResult } = useCheckoutStore();
  const navigate = useNavigate();
  const subtotal = totalPrice();
  const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  const firstOrderCoupon = useMemo(
    () => userCoupons.find((coupon) => coupon.code === 'FIRST20' && !coupon.is_used && subtotal >= coupon.min_order),
    [userCoupons, subtotal],
  );

  const applicableCoupons = useMemo(() =>
    userCoupons
      .filter((coupon) => coupon.code !== 'FIRST20' && !coupon.is_used && subtotal >= coupon.min_order)
      .sort((a, b) => {
        if (a.discount !== b.discount) return b.discount - a.discount;
        return (a.hours_left ?? Number.MAX_SAFE_INTEGER) - (b.hours_left ?? Number.MAX_SAFE_INTEGER);
      })
      .slice(0, 2),
    [userCoupons, subtotal],
  );

  useEffect(() => {
    if (!open || items.length === 0) {
      setUserCoupons([]);
      setLoadingCoupons(false);
      return;
    }

    let cancelled = false;
    setLoadingCoupons(true);
    couponService.getMyCoupons()
      .then((coupons) => {
        if (cancelled) return;
        setUserCoupons(coupons);
      })
      .catch(() => {
        if (cancelled) return;
        setUserCoupons([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingCoupons(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, items.length]);

  const applyCoupon = async (code: string) => {
    if (!code.trim()) return;
    setCouponLoading(true);
    setCouponMessage(null);

    try {
      const response = await couponService.validate(code, subtotal);
      setCouponCode(code.toUpperCase());
      setCouponResult(response);
      setCouponMessage(response.message);
    } catch (error) {
      setCouponResult({ valid: false, discount_amount: 0, message: 'Failed to validate coupon.' });
      setCouponMessage('Failed to validate coupon.');
    } finally {
      setCouponLoading(false);
    }
  };

  const activeCouponApplied = couponResult?.valid;
  const availableOfferCount = (firstOrderCoupon ? 1 : 0) + applicableCoupons.length;

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-[380px] z-50 flex flex-col bg-[#0b1220] border-l border-white/10 shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <div>
            <h3 className="text-white font-bold text-lg" style={{ fontFamily: 'Sora,sans-serif' }}>My Cart</h3>
            <p className="text-gray-400 text-xs">{items.reduce((acc, i) => acc + i.qty, 0)} item(s)</p>
          </div>
          <div className="flex gap-2">
            {items.length > 0 && (
              <button onClick={clearCart} className="text-xs text-[#ff4d6d] hover:text-pink-300 transition-colors px-2 py-1">Clear All</button>
            )}
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-hide">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
              <div className="text-6xl">🛒</div>
              <p className="text-gray-400 text-sm">Your cart is empty</p>
              <button onClick={onClose} className="btn-primary glow-pink-sm mt-2" style={{ width: 'auto', padding: '10px 24px' }}>
                Start Shopping
              </button>
            </div>
          ) : items.map(item => (
            <div key={item.id} className="glass border border-white/8 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate" style={{ fontFamily: 'Sora,sans-serif' }}>{item.name}</p>
                <p className="text-gray-500 text-xs">{item.unit}</p>
                <p className="text-[#ff4d6d] text-sm font-bold mt-1">₹{item.price * item.qty}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button onClick={() => removeItem(item.product_id)}  className="text-gray-600 hover:text-[#ff4d6d] transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
                <div className="flex items-center gap-1.5 bg-[#ff4d6d]/10 border border-[#ff4d6d]/20 rounded-lg px-2 py-0.5">
                  <button onClick={() => updateQty(item.product_id, item.qty - 1)} className="text-[#ff4d6d] font-bold text-sm">−</button>
                  <span className="text-white text-xs font-bold w-4 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.product_id, item.qty + 1)} className="text-[#ff4d6d] font-bold text-sm">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-white/8 space-y-3">
            {/* ✅ COUPON SUGGESTIONS */}
            <div className="space-y-2">
              <div className="text-xs text-gray-400 flex items-center justify-between">
                <span>Available offers</span>
                <span className="text-[10px] text-gray-500">
                  {loadingCoupons ? 'Loading...' : `${availableOfferCount} coupon${availableOfferCount === 1 ? '' : 's'} available`}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {loadingCoupons ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-gray-400">Checking offers...</div>
                ) : (
                  <>
                    {firstOrderCoupon && (
                      <div className="rounded-2xl border border-[#ff4d6d]/20 bg-[#1a1620] p-3 text-xs text-white">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-semibold text-white" style={{ fontFamily: 'Sora,sans-serif' }}>
                              Flat 20% OFF on your first order
                            </p>
                            <p className="text-gray-400 text-[11px] mt-1">
                              USE CODE: <span className="text-[#ff4d6d] font-bold">FIRST20</span>
                            </p>
                          </div>
                          <button
                            onClick={() => applyCoupon(firstOrderCoupon.code)}
                            disabled={couponLoading}
                            className="text-[#ff4d6d] font-bold text-xs rounded-full px-3 py-1 bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                        <p className="text-gray-500 text-[10px] mt-2">
                          Available for your first order only. If you're eligible, it will appear here automatically.
                        </p>
                      </div>
                    )}
                    {applicableCoupons.length > 0 ? (
                      applicableCoupons.map((coupon) => (
                        <div key={coupon.id} className="bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-xs">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-semibold text-white truncate" style={{ fontFamily: 'Sora,sans-serif' }}>
                                {coupon.code} · {coupon.type === 'percentage' ? `${coupon.discount}% OFF` : `₹${coupon.discount} OFF`}
                              </div>
                              <p className="text-gray-400 text-[11px] mt-1">
                                Min order ₹{coupon.min_order}{coupon.max_discount > 0 && coupon.type === 'percentage' ? ` · max ₹${coupon.max_discount}` : ''}
                              </p>
                            </div>
                            <button
                              onClick={() => applyCoupon(coupon.code)}
                              disabled={couponLoading}
                              className="text-[#ff4d6d] font-bold text-xs rounded-full px-3 py-1 bg-white/5 hover:bg-white/10 transition-colors"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-gray-400">
                        No coupons available for this cart yet.
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* ✅ COUPON BOX */}
            <div className="glass border border-white/8 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <input
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setCouponResult(null);
                    setCouponMessage(null);
                  }}
                  type="text"
                  placeholder="Apply coupon code"
                  className="bg-transparent text-sm text-white outline-none w-full"
                />
                <button
                  onClick={() => applyCoupon(couponCode)}
                  disabled={couponLoading}
                  className="text-[#ff4d6d] text-xs font-bold ml-2"
                >
                  {couponLoading ? 'Applying...' : 'APPLY'}
                </button>
              </div>
              {couponMessage && (
                <p className={`text-[11px] mt-2 ${activeCouponApplied ? 'text-green-400' : 'text-red-400'}`}>
                  {activeCouponApplied ? '🎉' : '⚠️'} {couponMessage}
                </p>
              )}
            </div>

            <div className="glass border border-white/8 rounded-xl p-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span><span className="text-white">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery Fee</span><span className="text-green-400">{subtotal >= 299 ? 'FREE' : '₹20'}</span>
              </div>
              {activeCouponApplied && (
                <div className="flex justify-between text-xs text-green-400">
                  <span>Coupon ({couponCode})</span>
                  <span>−₹{couponResult?.discount_amount ?? 0}</span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t border-white/8 pt-2">
                <span className="text-white">Total</span>
                <span className="text-[#ff4d6d]">₹{subtotal + (subtotal >= 299 ? 0 : 20) - (couponResult?.valid ? couponResult.discount_amount : 0)}</span>
              </div>
            </div>
            <button
              className="btn-primary glow-pink"
              onClick={() => {
                onClose();
                navigate('/checkout');
              }}
            >
              Proceed to Checkout — ₹{subtotal + (subtotal >= 299 ? 0 : 20) - (couponResult?.valid ? couponResult.discount_amount : 0)}
            </button>
          </div>
        )}
      </div>
    </>
  );
}