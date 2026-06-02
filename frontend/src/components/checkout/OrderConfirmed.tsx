import { useCheckoutStore } from '../../store/checkoutStore';
import { useAddressStore } from '../../store/addressStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
 
export default function OrderConfirmed() {
  const { orderNumber, selectedAddressId, paymentMethod, couponResult, reset } = useCheckoutStore();
  const { addresses } = useAddressStore();
  const navigate = useNavigate();
  const addr = addresses.find(a => a.id === selectedAddressId);
 
  // Clean up checkout state when navigating away
  useEffect(() => {
    return () => { /* don't reset yet so user can see details */ };
  }, []);
 
 
 
 
  return (
    <div className="flex flex-col items-center text-center py-10 px-4 animate-fadeUp space-y-6">
      {/* Success ring */}
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center"
        style={{
          background: 'rgba(34,197,94,0.1)',
          border: '2px solid rgba(34,197,94,0.4)',
          boxShadow: '0 0 40px rgba(34,197,94,0.2)',
          animation: 'pulse 2.5s ease infinite',
        }}
      >
        <span className="text-green-400 text-4xl font-bold">✓</span>
      </div>
 
      <div>
        <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Sora,sans-serif' }}>
          Order Placed! 🎉
        </h2>
        <p className="text-gray-400 text-sm">Your fresh groceries are being packed and will arrive in</p>
        <p className="text-[#ff4d6d] font-bold text-lg mt-1" style={{ fontFamily: 'Sora,sans-serif' }}>10 Minutes ⚡</p>
      </div>
 
      {/* Order details card */}
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{ background: 'rgba(17,25,40,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="p-4 border-b border-white/6">
          <p className="text-gray-500 text-xs uppercase tracking-widest">Order ID</p>
          <p className="text-white font-mono font-bold text-lg mt-1" style={{ fontFamily: 'Sora,sans-serif' }}>
            {orderNumber || '#FC' + Date.now().toString().slice(-6)}
          </p>
        </div>
        <div className="divide-y divide-white/5">
          {[
            { label: 'Payment', value: paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Paid via Razorpay' },
            { label: 'Deliver to', value: addr ? `${addr.tag} — ${addr.line1}` : '—' },
            { label: 'Estimated Time', value: '10 Minutes', highlight: true },
            ...(couponResult?.valid ? [{ label: 'Discount Applied', value: `−₹${couponResult.discount_amount}`, highlight: true }] : []),
          ].map(row => (
            <div key={row.label} className="flex justify-between items-center px-4 py-3">
              <span className="text-gray-500 text-xs">{row.label}</span>
              <span
                className="text-xs font-semibold max-w-[180px] text-right truncate"
                style={{
                  color: row.highlight ? '#22c55e' : '#fff',
                  fontFamily: 'Sora,sans-serif',
                }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
 
      <div className="flex gap-3 w-full max-w-sm">
        <button
 
          onClick={() => {
            navigate('/orders');
           
          }}
 
          className="flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all"
          style={{
            background: 'linear-gradient(135deg,#ff4d6d,#e63c5a)',
            fontFamily: 'Sora,sans-serif',
            boxShadow: '0 8px 24px rgba(255,77,109,0.3)',
          }}
        >
          Track Order
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex-1 py-3 rounded-2xl text-sm font-semibold border border-white/10 bg-white/4 text-white hover:bg-white/8 transition-all"
          style={{ fontFamily: 'Sora,sans-serif' }}
        >
          Shop More
        </button>
      </div>
    </div>
  );
}
 
 