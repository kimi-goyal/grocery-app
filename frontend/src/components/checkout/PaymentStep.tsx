import { useState } from 'react';
import { useCheckoutStore } from '../../store/checkoutStore';
import { useAddressStore } from '../../store/addressStore';
import { useCartStore } from '../../store/cartStore';
import { checkoutService } from '../../services/checkoutService';
import { useAuthStore } from '../../store/authStore';

declare global {
    interface Window { Razorpay: any; }
}

export default function PaymentStep() {
    const { selectedAddressId, paymentMethod, couponCode, couponResult, setPaymentMethod, setStep, setOrderNumber } = useCheckoutStore();
    const { addresses } = useAddressStore();
    const { items, totalPrice, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const [placing, setPlacing] = useState(false);
    const [error, setError] = useState('');

    const selectedAddr = addresses.find(a => a.id === selectedAddressId);
    const subtotal = totalPrice();
    const delivery = subtotal >= 299 ? 0 : 20;
    const discount = couponResult?.valid ? couponResult.discount_amount : 0;
    const total = subtotal + delivery - discount;

    const getApiErrorMessage = (error: unknown, fallback: string) => {
        const err = error as { response?: { data?: { detail?: unknown } } };
        const detail = err?.response?.data?.detail;
        if (typeof detail === 'string') return detail;
        if (Array.isArray(detail)) {
            return detail.map(item => {
                if (typeof item === 'string') return item;
                if (item && typeof item === 'object' && 'msg' in item && typeof (item as { msg?: unknown }).msg === 'string') {
                    return (item as { msg?: unknown }).msg;
                }
                return JSON.stringify(item);
            }).join('; ');
        }
        if (detail !== undefined && detail !== null) return String(detail);
        return fallback;
    };

    const handleCOD = async () => {
        setPlacing(true);
        setError('');
        try {
            const res = await checkoutService.placeOrder({
                address_id: selectedAddressId!,
                payment_method: 'cod',
                coupon_code: couponResult?.valid ? couponCode : undefined,
            });
            setOrderNumber(res.order_number);
            setStep(4);
            await clearCart();
        } catch (e: unknown) {
            setError(getApiErrorMessage(e, 'Failed to place order. Please try again.'));
        } finally {
            setPlacing(false);
        }
    };

    //   const handleRazorpay = async () => {
    //     setPlacing(true);
    //     setError('');
    //     try {
    //       // 1. Create Razorpay order on backend
    //       const rzpOrder = await checkoutService.createRazorpayOrder(total);

    //       // 2. Open Razorpay checkout
    //       const options = {
    //         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    //         amount: rzpOrder.amount,
    //         currency: 'INR',
    //         name: 'FreshCart',
    //         description: 'Grocery Order',
    //         order_id: rzpOrder.id,
    //         prefill: {
    //           name: user?.name || '',
    //           email: user?.email || '',
    //         },
    //         theme: { color: '#ff4d6d' },
    //         handler: async (response: any) => {
    //           // 3. Verify + place order on backend
    //           const res = await checkoutService.placeOrder({
    //             address_id: selectedAddressId!,
    //             payment_method: 'razorpay',
    //             coupon_code: couponResult?.valid ? couponCode : undefined,
    //             razorpay_payment_id: response.razorpay_payment_id,
    //             razorpay_order_id: response.razorpay_order_id,
    //             razorpay_signature: response.razorpay_signature,
    //           });
    //           setOrderNumber(res.order_number);
    //           await clearCart();
    //           setStep(4);
    //           setPlacing(false);
    //         },
    //         modal: {
    //           ondismiss: () => setPlacing(false),
    //         },
    //       };

    //       const rzp = new window.Razorpay(options);
    //       rzp.on('payment.failed', (resp: any) => {
    //         setError(resp.error?.description || 'Payment failed. Please try again.');
    //         setPlacing(false);
    //       });
    //       rzp.open();
    //     } catch (e: unknown) {
    //       setError(getApiErrorMessage(e, 'Failed to initiate payment.'));
    //       setPlacing(false);
    //     }
    //   };

    const handleRazorpay = async () => {
        setPlacing(true);
        setError('');

        try {
            if (!total || total <= 0) {
                setError("Invalid amount");
                return;
            }

            // ✅ 1. Create Razorpay order
            const order = await checkoutService.createRazorpayOrder(total);

            // ✅ 2. Open Razorpay
            const options = {
                key: order.key,
                amount: order.amount,
                currency: order.currency,
                name: "FreshCart",
                description: "Order Payment",
                order_id: order.id,

                handler: async (response: any) => {
                    try {
                        // ✅ 3. VERIFY + PLACE ORDER TOGETHER
                        const res = await checkoutService.placeOrder({
                            address_id: selectedAddressId!,
                            payment_method: "razorpay",
                            coupon_code: couponResult?.valid ? couponCode : undefined,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        setOrderNumber(res.order_number);
                        setStep(4);
                        await clearCart();

                    } catch (err: any) {
                        setError(getApiErrorMessage(err, "Order failed after payment."));
                    }
                },

                prefill: {
                    name: user?.name || '',
                    email: user?.email || '',
                },

                theme: { color: "#ff4d6d" },
            };

            const rzp = new window.Razorpay(options);

            rzp.on("payment.failed", (resp: any) => {
                setError(resp.error?.description || "Payment failed");
                setPlacing(false);
            });

            rzp.open();

        } catch (e: any) {
            setError(getApiErrorMessage(e, "Razorpay init failed"));
            setPlacing(false);
        }
    };

    return (
        <div className="space-y-4 animate-fadeUp">
            <div>
                <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Sora,sans-serif' }}>Payment</h2>
                <p className="text-gray-500 text-xs mt-0.5">Choose your preferred payment method</p>
            </div>

            {/* Address summary */}
            {selectedAddr && (
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-white/7 bg-white/3">
                    <div className="flex items-center gap-3">
                        <span className="text-lg">{selectedAddr.tag === 'Home' ? '🏠' : selectedAddr.tag === 'Work' ? '💼' : '📍'}</span>
                        <div>
                            <div className="text-white text-sm font-semibold" style={{ fontFamily: 'Sora,sans-serif' }}>
                                {selectedAddr.tag} — {selectedAddr.name}
                            </div>
                            <div className="text-gray-500 text-xs truncate max-w-[260px]">
                                {selectedAddr.line1}{selectedAddr.line2 ? `, ${selectedAddr.line2}` : ''}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setStep(2)}
                        className="text-xs font-semibold text-[#ff4d6d] bg-[#ff4d6d]/10 border border-[#ff4d6d]/20 px-3 py-1.5 rounded-lg hover:bg-[#ff4d6d]/20 transition-colors shrink-0"
                        style={{ fontFamily: 'Sora,sans-serif' }}
                    >
                        Change
                    </button>
                </div>
            )}

            {/* Payment options */}
            <div className="space-y-3">
                {/* Razorpay */}
                <div
                    onClick={() => setPaymentMethod('razorpay')}
                    className="rounded-2xl p-4 cursor-pointer transition-all"
                    style={{
                        border: paymentMethod === 'razorpay' ? '1.5px solid rgba(255,77,109,0.5)' : '1.5px solid rgba(255,255,255,0.07)',
                        background: paymentMethod === 'razorpay' ? 'rgba(255,77,109,0.04)' : 'rgba(255,255,255,0.02)',
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#2962ff]/12 border border-[#2962ff]/20 flex items-center justify-center shrink-0">
                                <svg width="20" height="20" viewBox="0 0 50 50" fill="none">
                                    <rect width="50" height="50" rx="8" fill="#2962FF" />
                                    <path d="M13 35L22 10h8L20 35H13zM28 10h8l-5 12 5 13h-8L18 22l10-12z" fill="white" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-white text-sm font-semibold" style={{ fontFamily: 'Sora,sans-serif' }}>Razorpay</div>
                                <div className="text-gray-500 text-xs">UPI · Cards · Net Banking · Wallets</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-bold text-blue-400 bg-blue-500/12 border border-blue-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider hidden sm:block">
                                Recommended
                            </span>
                            <RadioDot active={paymentMethod === 'razorpay'} />
                        </div>
                    </div>
                    {paymentMethod === 'razorpay' && (
                        <div className="mt-3 pt-3 border-t border-white/6 space-y-2">
                            <div className="flex flex-wrap gap-2">
                                {['UPI', 'Visa', 'Mastercard', 'Net Banking', 'Wallets', 'EMI'].map(m => (
                                    <span key={m} className="text-[10px] px-2 py-1 rounded-md bg-white/5 border border-white/8 text-gray-400">{m}</span>
                                ))}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-green-400/70">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                256-bit SSL encrypted · PCI DSS compliant
                            </div>
                        </div>
                    )}
                </div>

                {/* COD */}
                <div
                    onClick={() => setPaymentMethod('cod')}
                    className="rounded-2xl p-4 cursor-pointer transition-all"
                    style={{
                        border: paymentMethod === 'cod' ? '1.5px solid rgba(255,77,109,0.5)' : '1.5px solid rgba(255,255,255,0.07)',
                        background: paymentMethod === 'cod' ? 'rgba(255,77,109,0.04)' : 'rgba(255,255,255,0.02)',
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-xl shrink-0">💵</div>
                            <div>
                                <div className="text-white text-sm font-semibold" style={{ fontFamily: 'Sora,sans-serif' }}>Cash on Delivery</div>
                                <div className="text-gray-500 text-xs">Pay when your order arrives</div>
                            </div>
                        </div>
                        <RadioDot active={paymentMethod === 'cod'} />
                    </div>
                    {paymentMethod === 'cod' && (
                        <div className="mt-3 pt-3 border-t border-white/6 flex items-start gap-2 text-[11px] text-amber-400/80">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5">
                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            Please keep exact change ready. Delivery partner may not carry change.
                        </div>
                    )}
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    {error}
                </div>
            )}

            {/* CTA */}
            <button
                onClick={paymentMethod === 'razorpay' ? handleRazorpay : handleCOD}
                disabled={placing || !selectedAddressId}
                className="w-full py-4 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                style={{
                    background: 'linear-gradient(135deg,#ff4d6d,#e63c5a)',
                    fontFamily: 'Sora,sans-serif',
                    boxShadow: '0 8px 28px rgba(255,77,109,0.35)',
                }}
            >
                <span className={`flex items-center justify-center gap-2 transition-opacity ${placing ? 'opacity-0' : 'opacity-100'}`}>
                    {paymentMethod === 'razorpay' ? `Pay ₹${total} with Razorpay` : `Place Order — ₹${total} (COD)`}
                </span>
                {placing && (
                    <span className="absolute inset-0 flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {paymentMethod === 'razorpay' ? 'Opening Razorpay...' : 'Placing Order...'}
                    </span>
                )}
                {/* shimmer */}
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12 pointer-events-none" />
            </button>

            <p className="text-center text-[10px] text-gray-600 leading-relaxed">
                By placing this order you agree to FreshCart's{' '}
                <span className="text-[#ff4d6d] cursor-pointer">Terms of Service</span> and{' '}
                <span className="text-[#ff4d6d] cursor-pointer">Privacy Policy</span>.
            </p>
        </div>
    );
}

function RadioDot({ active }: { active: boolean }) {
    return (
        <div
            className="w-4 h-4 rounded-full flex items-center justify-center transition-all shrink-0"
            style={{ border: active ? '2px solid #ff4d6d' : '2px solid rgba(255,255,255,0.2)' }}
        >
            {active && <div className="w-2 h-2 rounded-full bg-[#ff4d6d]" />}
        </div>
    );
}


