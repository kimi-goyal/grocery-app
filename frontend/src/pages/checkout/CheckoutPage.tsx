import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import RazorpayButton from "../../components/checkout/RazorpayButton";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const total = totalPrice();

  return (
    <div className="min-h-screen bg-[#090b13] text-white py-10 px-4 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-gray-400 mt-1">Review your cart and complete payment.</p>
          </div>
          <button
            onClick={() => navigate('/home')}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
          >
            Continue Shopping
          </button>
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <p className="text-gray-400">Your cart is empty.</p>
            <button
              onClick={() => navigate('/home')}
              className="mt-6 rounded-full bg-[#10b981] px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="h-20 w-20 rounded-2xl object-cover" />
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">{item.name}</h2>
                      <p className="text-sm text-gray-400">{item.unit}</p>
                      <p className="mt-2 text-sm text-gray-300">Qty: {item.qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">₹{item.price * item.qty}</p>
                      <p className="text-xs text-gray-500">₹{item.price} each</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div>
                <h3 className="text-xl font-semibold">Order Summary</h3>
                <p className="text-sm text-gray-400 mt-1">Pay securely with Razorpay.</p>
              </div>

              <div className="space-y-3 rounded-3xl bg-[#0f1720] p-4">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery</span>
                  <span className="text-green-400">FREE</span>
                </div>
                <div className="flex justify-between pt-2 text-white">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">₹{total}</span>
                </div>
              </div>

              <RazorpayButton
                amount={total}
                onSuccess={() => {
                  clearCart();
                  navigate('/home');
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
