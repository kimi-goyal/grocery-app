
import { useEffect, useState } from 'react';
import { useOrderStore } from '../../store/orderStore';
import StarRating from './StarRating';
import type { Order } from '../../types/order.types';
 
const TIMELINE = [
  { status: 'Pending', icon: '🕐', label: 'Order Placed' },
  { status: 'Packed', icon: '📦', label: 'Being Packed' },
  { status: 'On the Way', icon: '🚀', label: 'Out for Delivery' },
  { status: 'Delivered', icon: '✅', label: 'Delivered' },
];
 
interface Props {
  orderId: string;
  onClose: () => void;
  onRate: (id: string) => void;
}
 
export default function OrderDetailDrawer({ orderId, onClose, onRate }: Props) {
  const { fetchDetail } = useOrderStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    fetchDetail(orderId).then(o => { setOrder(o); setLoading(false); });
  }, [orderId]);
 
  const currentStep = TIMELINE.findIndex(t => t.status === order?.status);
  const isCancelled = order?.status === 'Cancelled';
 
  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="fixed top-0 right-0 h-full w-full max-w-[440px] z-50 flex flex-col shadow-2xl"
        style={{ background: 'rgba(7,12,24,0.98)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
          <div>
            <h3 className="text-white font-black text-base" style={{ fontFamily: 'Sora,sans-serif' }}>
              Order Details
            </h3>
            <p className="text-[#ff4d6d] text-xs font-mono mt-0.5">{order?.order_number}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
 
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <svg className="w-8 h-8 animate-spin text-[#ff4d6d]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          </div>
        ) : order && (
          <div className="flex-1 overflow-y-auto scrollbar-hide">
 
            {/* ── Order timeline ── */}
            {!isCancelled && (
              <div className="px-6 py-5 border-b border-white/6">
                <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-4">Order Progress</p>
                <div className="relative">
                  {/* Track line */}
                  <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-white/8" />
                  <div
                    className="absolute left-[15px] top-4 w-0.5 bg-gradient-to-b from-[#ff4d6d] to-[#ff4d6d]/30 transition-all duration-700"
                    style={{ height: `${Math.max(0, currentStep) * 25}%` }}
                  />
 
                  <div className="space-y-6">
                    {TIMELINE.map((step, i) => {
                      const done = i < currentStep || (order.status === 'Delivered' && i <= currentStep);
                      const active = i === currentStep;
                      return (
                        <div key={step.status} className="flex items-start gap-4 relative">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 relative z-10 transition-all duration-300"
                            style={{
                              background: done || active
                                ? active ? 'rgba(255,77,109,0.2)' : 'rgba(34,197,94,0.15)'
                                : 'rgba(255,255,255,0.05)',
                              border: done || active
                                ? active ? '2px solid #ff4d6d' : '2px solid rgba(34,197,94,0.5)'
                                : '2px solid rgba(255,255,255,0.1)',
                              boxShadow: active ? '0 0 16px rgba(255,77,109,0.35)' : 'none',
                            }}
                          >
                            {step.icon}
                          </div>
                          <div className="pt-1">
                            <p
                              className="text-sm font-semibold"
                              style={{
                                fontFamily: 'Sora,sans-serif',
                                color: done || active ? '#fff' : 'rgba(255,255,255,0.3)',
                              }}
                            >
                              {step.label}
                            </p>
                            {active && (
                              <p className="text-[#ff4d6d] text-[10px] mt-0.5 font-medium animate-pulse">
                                Current status
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
 
            {isCancelled && (
              <div className="mx-6 my-4 rounded-2xl p-4 flex items-center gap-3"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <span className="text-2xl">❌</span>
                <div>
                  <p className="text-red-400 font-bold text-sm" style={{ fontFamily: 'Sora,sans-serif' }}>Order Cancelled</p>
                  <p className="text-red-400/60 text-xs">Refund will be processed in 5–7 business days</p>
                </div>
              </div>
            )}
 
            {/* ── Items ── */}
            <div className="px-6 py-4 border-b border-white/6">
              <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-3">
                Items ({order.items_count})
              </p>
              <div className="space-y-3">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/8 shrink-0">
                      <img
                        src={item.image_url || ''}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate" style={{ fontFamily: 'Sora,sans-serif' }}>{item.name}</p>
                      <p className="text-gray-500 text-xs">{item.unit} × {item.quantity}</p>
                      {item.item_rating && (
                        <div className="mt-1">
                          <StarRating value={item.item_rating} size="sm" readonly />
                        </div>
                      )}
                    </div>
                    <span className="text-white font-bold text-sm shrink-0" style={{ fontFamily: 'Sora,sans-serif' }}>
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
 
            {/* ── Price breakdown ── */}
            <div className="px-6 py-4 border-b border-white/6 space-y-2">
              <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-3">Price Breakdown</p>
              {[
                { label: 'Subtotal', value: `₹${(order.total_amount + order.discount_amount - order.delivery_fee).toFixed(0)}` },
                { label: 'Delivery', value: order.delivery_fee === 0 ? 'FREE' : `₹${order.delivery_fee}`, green: order.delivery_fee === 0 },
                ...(order.discount_amount > 0 ? [{ label: `Coupon (${order.coupon_code})`, value: `-₹${order.discount_amount}`, green: true }] : []),
              ].map(row => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{row.label}</span>
                  <span style={{ color: row.green ? '#22c55e' : '#fff' }} className="font-medium">{row.value}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t border-white/6">
                <span className="text-white font-bold" style={{ fontFamily: 'Sora,sans-serif' }}>Total</span>
                <span className="text-[#ff4d6d] font-black text-lg" style={{ fontFamily: 'Sora,sans-serif' }}>₹{order.total_amount}</span>
              </div>
            </div>
 
            {/* ── Delivery address ── */}
            <div className="px-6 py-4 border-b border-white/6">
              <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-2">Delivered To</p>
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">📍</span>
                <div>
                  <p className="text-white text-sm font-medium" style={{ fontFamily: 'Sora,sans-serif' }}>{order.customer_name}</p>
                  <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{order.address}</p>
                  {order.phone && <p className="text-gray-600 text-[10px] mt-1">{order.phone}</p>}
                </div>
              </div>
            </div>
            {/* ── Driver info ── */}
            {order.driver && (
              <div className="px-6 py-4 border-b border-white/6">
                <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-2">Delivery Partner</p>
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">🚴</span>
                  <div>
                    <p className="text-white text-sm font-medium" style={{ fontFamily: 'Sora,sans-serif' }}>{order.driver.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{order.driver.phone}</p>
                    {order.driver.vehicle_number && (
                      <p className="text-gray-600 text-[10px] mt-1">
                        {order.driver.vehicle_type && <span className="capitalize">{order.driver.vehicle_type} • </span>}
                        {order.driver.vehicle_number}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
 
            {/* ── Rating section ── */}
            {order.is_rated && (
              <div className="px-6 py-4 border-b border-white/6">
                <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-3">Your Rating</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <StarRating value={order.overall_rating || 0} size="md" readonly showValue />
                    <span className="text-gray-400 text-xs">Overall</span>
                  </div>
                  {[
                    { label: 'Delivery', val: order.delivery_rating },
                    { label: 'Quality', val: order.quality_rating },
                    { label: 'Packing', val: order.packaging_rating },
                  ].filter(r => r.val).map(r => (
                    <div key={r.label} className="flex items-center gap-3">
                      <StarRating value={r.val!} size="sm" readonly />
                      <span className="text-gray-500 text-xs">{r.label}</span>
                    </div>
                  ))}
                  {order.review_text && (
                    <div
                      className="rounded-xl p-3 mt-2"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <p className="text-gray-300 text-xs leading-relaxed italic">"{order.review_text}"</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
 
        {/* Bottom CTA */}
        {order && order.status === 'Delivered' && !order.is_rated && (
          <div className="px-6 py-4 border-t border-white/6">
            <button
              onClick={() => { onClose(); onRate(order.id); }}
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-white relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg,#ff4d6d,#e63c5a)',
                fontFamily: 'Sora,sans-serif',
                boxShadow: '0 6px 20px rgba(255,77,109,0.3)',
              }}
            >
              <span className="relative z-10">⭐ Rate This Order</span>
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-600 skew-x-12 pointer-events-none" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
 