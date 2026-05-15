import { useCartStore } from '../../store/cartStore';
import { useCheckoutStore } from '../../store/checkoutStore';
import { useNavigate } from 'react-router-dom';

export default function CartReviewStep() {
  const { items, updateQty, removeItem, totalPrice } = useCartStore();
  const { setStep } = useCheckoutStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="text-6xl">🛒</div>
        <p className="text-white font-bold text-lg" style={{ fontFamily: 'Sora,sans-serif' }}>Your cart is empty</p>
        <button
          onClick={() => navigate('/home')}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: 'linear-gradient(135deg,#ff4d6d,#e63c5a)', fontFamily: 'Sora,sans-serif' }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeUp">
      <div>
        <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Sora,sans-serif' }}>Review Your Cart</h2>
        <p className="text-gray-500 text-xs mt-0.5">Edit quantities before proceeding</p>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <div
            key={item.product_id}
            className="flex items-center gap-4 p-4 rounded-2xl border border-white/7 bg-white/2 hover:border-white/12 transition-all"
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/8 shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate" style={{ fontFamily: 'Sora,sans-serif' }}>{item.name}</p>
              <p className="text-gray-500 text-xs mt-0.5">{item.unit}</p>
              <p className="text-[#ff4d6d] text-sm font-bold mt-1">₹{item.price * item.qty}</p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <button
                onClick={() => removeItem(item.product_id)}
                className="text-gray-600 hover:text-red-400 transition-colors"
                aria-label="Remove item"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </button>
              <div className="flex items-center gap-1.5 bg-[#ff4d6d]/10 border border-[#ff4d6d]/20 rounded-xl px-2 py-1">
                <button
                  onClick={() => updateQty(item.product_id, item.qty - 1)}
                  className="text-[#ff4d6d] font-bold text-sm w-5 h-5 flex items-center justify-center hover:text-pink-300 transition-colors"
                >
                  −
                </button>
                <span className="text-white text-xs font-bold w-5 text-center">{item.qty}</span>
                <button
                  onClick={() => updateQty(item.product_id, item.qty + 1)}
                  className="text-[#ff4d6d] font-bold text-sm w-5 h-5 flex items-center justify-center hover:text-pink-300 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setStep(2)}
        disabled={items.length === 0}
        className="w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-40 flex items-center justify-center gap-2"
        style={{
          background: 'linear-gradient(135deg,#ff4d6d,#e63c5a)',
          fontFamily: 'Sora,sans-serif',
          boxShadow: '0 8px 24px rgba(255,77,109,0.3)',
        }}
      >
        Continue to Address
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  );
}



