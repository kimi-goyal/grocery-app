import { useEffect, useState } from 'react';
import type { UserCoupon } from '../../types/coupon.types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (coupon: UserCoupon) => void;
  subtotal: number;
  appliedCoupon?: UserCoupon | null;
}

export default function CouponSelectorModal({ open, onClose, onSelect, subtotal, appliedCoupon }: Props) {
  const [coupons, setCoupons] = useState<UserCoupon[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  useEffect(() => {
    if (open && coupons.length === 0) {
      fetchCoupons();
    }
  }, [open]);

  const fetchCoupons = async () => {
    setLoadingCoupons(true);
    try {
      const { couponService } = await import('../../services/couponService');
      const userCoupons = await couponService.getMyCoupons();
      // Hide coupons already used by the user so they don't appear in the selector
      setCoupons(userCoupons.filter((c: UserCoupon) => !c.is_used));
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setLoadingCoupons(false);
    }
  };

  const getDiscount = (coupon: UserCoupon): number => {
    if (coupon.type === 'percentage') {
      const discount = (subtotal * coupon.discount) / 100;
      return Math.min(discount, coupon.max_discount);
    }
    return Math.min(coupon.discount, coupon.max_discount);
  };

  const isEligible = (coupon: UserCoupon): boolean => {
    return subtotal >= coupon.min_order;
  };

  const applicableCoupons = coupons.filter(isEligible).sort((a, b) => {
    if (a.discount !== b.discount) return b.discount - a.discount;
    return (a.hours_left ?? Number.MAX_SAFE_INTEGER) - (b.hours_left ?? Number.MAX_SAFE_INTEGER);
  });

  const unusableCoupons = coupons.filter(c => !isEligible(c));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[rgba(11,15,25,0.95)] border border-white/8 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/6">
          <div>
            <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Sora,sans-serif' }}>
              Available Offers
            </h2>
            <p className="text-gray-500 text-xs mt-0.5">Choose a coupon to apply</p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/8 text-gray-400 hover:text-white transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loadingCoupons ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-[#ff4d6d]/30 border-t-[#ff4d6d] animate-spin" />
              <p className="text-gray-500 text-xs">Loading offers...</p>
            </div>
          ) : applicableCoupons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 px-4 text-center">
              <div className="text-4xl">🎟️</div>
              <p className="text-gray-400 text-sm font-medium">No applicable coupons</p>
              {subtotal > 0 && (
                <p className="text-gray-600 text-xs">
                  {unusableCoupons.length > 0
                    ? `Some coupons require a minimum order of ₹${Math.min(...unusableCoupons.map(c => c.min_order))}`
                    : 'Check back later for new offers!'}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {/* Applicable Coupons */}
              {applicableCoupons.map(coupon => {
                const discount = getDiscount(coupon);
                const isApplied = appliedCoupon?.id === coupon.id;
                return (
                  <button
                    key={coupon.id}
                    onClick={() => {
                      onSelect(coupon);
                      onClose();
                    }}
                    className="w-full p-4 rounded-xl border-2 transition-all text-left hover:border-[#ff4d6d]/40 hover:bg-[#ff4d6d]/5"
                    style={{
                      border: isApplied ? '2px solid #ff4d6d' : '2px solid rgba(255,77,109,0.1)',
                      background: isApplied ? 'rgba(255,77,109,0.08)' : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-white font-bold text-sm" style={{ fontFamily: 'Sora,sans-serif' }}>
                            {coupon.code}
                          </p>
                          {isApplied && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/15 border border-green-500/30 rounded-lg text-[10px] font-bold text-green-400">
                              ✓ Applied
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs mb-2">{coupon.title}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-green-400 font-bold">Save ₹{discount.toFixed(0)}</span>
                          {coupon.min_order > 0 && (
                            <span className="text-gray-600">Min: ₹{coupon.min_order}</span>
                          )}
                          {coupon.hours_left && coupon.hours_left < 24 && (
                            <span className="text-orange-400 font-semibold">Expires in {coupon.hours_left}h</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg border border-[#ff4d6d]/20 bg-[#ff4d6d]/8 shrink-0">
                        <span className="text-xl">🏷️</span>
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* Unusable Coupons */}
              {unusableCoupons.length > 0 && (
                <>
                  <div className="py-2 px-1">
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Not Applicable</p>
                  </div>
                  {unusableCoupons.slice(0, 3).map(coupon => (
                    <div
                      key={coupon.id}
                      className="p-3 rounded-xl border border-white/5 bg-white/2 opacity-50"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-gray-500 font-semibold text-xs">{coupon.code}</p>
                          <p className="text-gray-600 text-[10px] mt-0.5">
                            {coupon.is_used ? 'Already used' : `Min order ₹${coupon.min_order} (you have ₹${subtotal})`}
                          </p>
                        </div>
                        <span className="text-gray-600 text-xs">Locked</span>
                      </div>
                    </div>
                  ))}
                  {unusableCoupons.length > 3 && (
                    <p className="text-center text-gray-600 text-[10px] py-2">
                      +{unusableCoupons.length - 3} more offers
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/6 p-4">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-white/8 hover:bg-white/12 transition-all"
            style={{ fontFamily: 'Sora,sans-serif' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
