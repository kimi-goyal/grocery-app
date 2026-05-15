
import { useCartStore } from '../../store/cartStore';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, updateQty, removeItem, totalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  console.log("CartDrawer items", items); // ✅ DEBUG LOG

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
              <div className="text-xs text-gray-400">Available offers</div>

              <div className="flex flex-col gap-2">

                <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 text-xs flex justify-between items-center">
                  <span>🔥 SAVE10 — 10% OFF</span>
                  <button className="text-green-400 font-bold">Apply</button>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2 text-xs flex justify-between items-center">
                  <span>🎉 ₹100 OFF above ₹499</span>
                  <button className="text-blue-400 font-bold">Apply</button>
                </div>

              </div>
            </div>
            {/* ✅ COUPON BOX */}
            <div className="glass border border-white/8 rounded-xl p-3 flex items-center justify-between">
              <input
                type="text"
                placeholder="Apply coupon code"
                className="bg-transparent text-sm text-white outline-none w-full"
              />

              <button className="text-[#ff4d6d] text-xs font-bold ml-2">
                APPLY
              </button>
            </div>
            <div className="glass border border-white/8 rounded-xl p-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span><span className="text-white">₹{totalPrice()}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery Fee</span><span className="text-green-400">FREE</span>
              </div>
              <div className="flex justify-between font-bold border-t border-white/8 pt-2">
                <span className="text-white">Total</span>
                <span className="text-[#ff4d6d]">₹{totalPrice()}</span>
              </div>
            </div>
           <button className="btn-primary glow-pink" onClick={() => { onClose(); navigate('/checkout'); }}>
              Proceed to Checkout — ₹{totalPrice()}
            </button>
          </div>
        )}
      </div>
    </>
  );
}