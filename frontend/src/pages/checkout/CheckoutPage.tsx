// import { useNavigate } from "react-router-dom";
// import { useCartStore } from "../../../../store/cartStore";
// import RazorpayButton from "../../../../components/checkout/RazorpayButton";
 
// export default function CheckoutPage() {
//   const { items, totalPrice, clearCart } = useCartStore();
//   const navigate = useNavigate();
//   const total = totalPrice();
 
//   return (
//     <div className="min-h-screen bg-[#090b13] text-white py-10 px-4 sm:px-8">
//       <div className="mx-auto max-w-6xl">
//         <div className="mb-6 flex items-center justify-between gap-3">
//           <div>
//             <h1 className="text-3xl font-bold">Checkout</h1>
//             <p className="text-gray-400 mt-1">Review your cart and complete payment.</p>
//           </div>
//           <button
//             onClick={() => navigate('/home')}
//             className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
//           >
//             Continue Shopping
//           </button>
//         </div>
 
//         {items.length === 0 ? (
//           <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
//             <p className="text-gray-400">Your cart is empty.</p>
//             <button
//               onClick={() => navigate('/home')}
//               className="mt-6 rounded-full bg-[#10b981] px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
//             >
//               Shop Now
//             </button>
//           </div>
//         ) : (
//           <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
//             <div className="space-y-4">
//               {items.map(item => (
//                 <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
//                   <div className="flex items-center gap-4">
//                     <img src={item.image} alt={item.name} className="h-20 w-20 rounded-2xl object-cover" />
//                     <div className="flex-1">
//                       <h2 className="text-lg font-semibold">{item.name}</h2>
//                       <p className="text-sm text-gray-400">{item.unit}</p>
//                       <p className="mt-2 text-sm text-gray-300">Qty: {item.qty}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-lg font-bold">₹{item.price * item.qty}</p>
//                       <p className="text-xs text-gray-500">₹{item.price} each</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
 
//             <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
//               <div>
//                 <h3 className="text-xl font-semibold">Order Summary</h3>
//                 <p className="text-sm text-gray-400 mt-1">Pay securely with Razorpay.</p>
//               </div>
 
//               <div className="space-y-3 rounded-3xl bg-[#0f1720] p-4">
//                 <div className="flex justify-between text-gray-400">
//                   <span>Subtotal</span>
//                   <span>₹{total}</span>
//                 </div>
//                 <div className="flex justify-between text-gray-400">
//                   <span>Delivery</span>
//                   <span className="text-green-400">FREE</span>
//                 </div>
//                 <div className="flex justify-between pt-2 text-white">
//                   <span className="font-semibold">Total</span>
//                   <span className="font-semibold">₹{total}</span>
//                 </div>
//               </div>
 
//               <RazorpayButton
//                 amount={total}
//                 onSuccess={() => {
//                   clearCart();
//                   navigate('/home');
//                 }}
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
 
import { useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useCheckoutStore } from '../../store/checkoutStore';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import CheckoutStepBar from '../../components/checkout/CheckoutStepBar';
import CartReviewStep from '../../components/checkout/CartReviewStep';
import AddressStep from '../../components/checkout/AddressStep';
import PaymentStep from '../../components/checkout/PaymentStep';
import OrderConfirmed from '../../components/checkout/OrderConfirmed';
import OrderSummaryPanel from '../../components/checkout/OrderSummaryPanel';
 
 
 
export default function CheckoutPage() {
  const { step, setStep, orderNumber, setCouponCode, setCouponResult } = useCheckoutStore();
  const { items, fetchCart } = useCartStore();
  const { isAuthenticated, isGuest } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
 
  // Handle coupon code from navigation state (from CouponPage)
  useEffect(() => {
    const state = location.state as { couponCode?: string } | null;
    if (state?.couponCode) {
      setCouponCode(state.couponCode);
      // Auto-validate the coupon
      (async () => {
        try {
          const { checkoutService } = await import('../../services/checkoutService');
          const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
          const res = await checkoutService.validateCoupon(state.couponCode!, subtotal);
          setCouponResult(res);
        } catch {
          setCouponResult({ valid: false, discount_amount: 0, message: 'Failed to validate coupon.' });
        }
      })();
      // Clear the state so it doesn't re-apply on browser back
      window.history.replaceState({}, document.title);
    }
  }, [location.state, items.length]);
 
  // Sync cart from backend on mount
  // useEffect(() => {
  //   fetchCart();
  //   return () => { /* don't reset on unmount — user might navigate back */ };
  // }, []);
  useEffect(() => {
  // ✅ DO NOT fetch cart after order is placed
  if (step === 4) return;
 
  fetchCart();
}, [step]);
 
  const [searchParams] = useSearchParams();
 
  // Set active checkout step from query string
  useEffect(() => {
    const target = searchParams.get('step');
    if (target === '2' || target === '3') {
      const stepIndex = Number(target) as 2 | 3;
      if (step !== stepIndex) {
        setStep(stepIndex);
      }
    }
  }, [searchParams, step, setStep]);
 
  // Redirect guests to login
  useEffect(() => {
    if (!isAuthenticated && !isGuest) {
      navigate('/auth', { replace: true });
    }
  }, [isAuthenticated, isGuest, navigate]);
 
  // Redirect if cart is empty and not on confirmed step
 
 
useEffect(() => {
  if (!location.pathname.startsWith('/checkout')) return;
 
  // ✅ only redirect if user genuinely comes to empty checkout
  if (items.length === 0 && step === 1 && !orderNumber) {
    navigate('/home');
  }
}, [items, step, orderNumber, navigate, location.pathname]);
  const isConfirmed = step === 4;
 
  const reset = useCheckoutStore(state => state.reset);
 
useEffect(() => {
  return () => {
    reset();  
  };
}, []);
 
  return (
    <div className="min-h-screen bg-[#050816] relative overflow-hidden">
      {/* Ambient glows */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#ff4d6d]/6 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-purple-900/8 blur-[120px] pointer-events-none" />
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />
 
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/6 bg-[#050816]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
            <div className="w-7 h-7 rounded-lg bg-[#ff4d6d]/15 border border-[#ff4d6d]/30 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff4d6d" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
            <span className="text-base font-bold" style={{ fontFamily: 'Sora,sans-serif' }}>
              Fresh<span className="text-[#ff4d6d]">Cart</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-green-400 font-medium">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Secure Checkout
          </div>
        </div>
      </header>
 
      {/* Step bar — hide on confirmed */}
      {!isConfirmed && <CheckoutStepBar step={step} />}
 
      {/* Main */}
      <div className="max-w-6xl mx-auto px-5 pb-16 relative z-10">
        {isConfirmed ? (
          <OrderConfirmed />
        ) : (
          <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
            {/* Left — step content */}
            <div className="bg-[rgba(17,25,40,0.55)] border border-white/7 rounded-3xl p-6 backdrop-blur-xl">
              {step === 1 && <CartReviewStep />}
              {step === 2 && <AddressStep />}
              {step === 3 && <PaymentStep />}
            </div>
 
            {/* Right — order summary */}
            <div className="lg:sticky lg:top-20">
              {/* Coupon only visible on step 1 */}
              <OrderSummaryPanel showCoupon={step === 1} />
            </div>
          </div>
        )}
      </div>
 
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.3)} 50%{box-shadow:0 0 0 14px rgba(34,197,94,0)} }
        .animate-fadeUp { animation: fadeUp 0.35s ease forwards; }
        .scrollbar-hide::-webkit-scrollbar { display:none; }
        .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>
    </div>
  );
}
 
 
 
 