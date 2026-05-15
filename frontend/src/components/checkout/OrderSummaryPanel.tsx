import { useCartStore } from '../../store/cartStore';
import { useCheckoutStore } from '../../store/checkoutStore';

interface Props {
  showCoupon: boolean; // only true on step 1
}

export default function OrderSummaryPanel({ showCoupon }: Props) {
  const { items, updateQty, removeItem, totalPrice } = useCartStore();
  const {
    couponCode, couponResult,
    setCouponCode, setCouponResult,
    step,
  } = useCheckoutStore();

  const subtotal = totalPrice();
  const delivery = subtotal >= 299 ? 0 : 20;
  const discount = couponResult?.valid ? couponResult.discount_amount : 0;
  const total = subtotal + delivery - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const { checkoutService } = await import('../../services/checkoutService');
      const res = await checkoutService.validateCoupon(couponCode, subtotal);
      setCouponResult(res);
    } catch {
      setCouponResult({ valid: false, discount_amount: 0, message: 'Failed to validate coupon.' });
    }
  };

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
                src={item.image}
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
        <div className="px-4 pb-3 border-t border-white/6 pt-3">
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-white/4 border border-white/8 rounded-xl px-3 py-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
              <input
                value={couponCode}
                onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponResult(null); }}
                placeholder="COUPON CODE"
                className="flex-1 bg-transparent text-white text-xs outline-none placeholder-gray-600 tracking-widest font-mono"
                style={{ fontFamily: 'Sora,sans-serif' }}
              />
            </div>
            <button
              onClick={handleApplyCoupon}
              className="px-3 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                background: couponResult?.valid ? 'rgba(34,197,94,0.15)' : 'rgba(255,77,109,0.15)',
                border: couponResult?.valid ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,77,109,0.3)',
                color: couponResult?.valid ? '#22c55e' : '#ff4d6d',
                fontFamily: 'Sora,sans-serif',
              }}
            >
              {couponResult?.valid ? '✓' : 'Apply'}
            </button>
          </div>
          {couponResult && (
            <p className={`text-[10px] mt-1.5 px-1 ${couponResult.valid ? 'text-green-400' : 'text-red-400'}`}>
              {couponResult.valid ? '🎉 ' : '⚠ '}{couponResult.message}
            </p>
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
