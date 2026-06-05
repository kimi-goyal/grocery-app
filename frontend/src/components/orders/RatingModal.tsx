import { useState } from 'react';
import { useOrderStore } from '../../store/orderStore';
import StarRating from './StarRating';
import type { Order } from '../../types/order.types';
import { useShopStore } from '../../store/shopStore';

interface Props {
  order: Order;
  onClose: () => void;
  onDone: () => void;
}

const CATEGORIES = [
  { key: 'delivery_rating', icon: '🚀', label: 'Delivery Speed' },
  { key: 'quality_rating', icon: '🌿', label: 'Freshness & Quality' },
  { key: 'packaging_rating', icon: '📦', label: 'Packaging' },
] as const;
 
const QUICK_REVIEWS = [
  'Super fast delivery! 🚀',
  'Everything was fresh 🌿',
  'Great packaging 📦',
  'Will order again! 🛒',
  'Exactly as described ✅',
  'Loved the quality ❤️',
];
 
export default function RatingModal({ order, onClose, onDone }: Props) {
  const { fetchData } = useShopStore();
  const { submitRating, ratingLoading } = useOrderStore();
  const [overall, setOverall] = useState(0);
  const [delivery, setDelivery] = useState(0);
  const [quality, setQuality] = useState(0);
  const [packaging, setPackaging] = useState(0);
  const [review, setReview] = useState('');
  const [itemRatings, setItemRatings] = useState<Record<string, number>>({});
  const [step, setStep] = useState<'main' | 'items' | 'done'>('main');
  const [error, setError] = useState('');
 
  const handleQuickReview = (text: string) => {
    setReview(prev => prev ? `${prev} ${text}` : text);
  };
 
  const handleSubmit = async () => {
    if (overall === 0) { setError('Please give an overall rating.'); return; }
    setError('');
    try {
      await submitRating(order.id, {
        overall_rating: overall,
        delivery_rating: delivery || undefined,
        quality_rating: quality || undefined,
        packaging_rating: packaging || undefined,
        review_text: review.trim() || undefined,
        item_ratings: Object.keys(itemRatings).length ? itemRatings : undefined,
      });
      await fetchData();
      setStep('done');
      setTimeout(onDone, 1800);
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Failed to submit rating.');
    }
  };
 
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
      />
 
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-slideUp"
          style={{
            background: 'rgba(11,18,32,0.98)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(24px)',
          }}
        >
          {/* ── DONE state ── */}
          {step === 'done' ? (
            <div className="flex flex-col items-center justify-center py-14 px-8 text-center gap-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
                style={{
                  background: 'rgba(34,197,94,0.12)',
                  border: '2px solid rgba(34,197,94,0.35)',
                  boxShadow: '0 0 40px rgba(34,197,94,0.2)',
                  animation: 'pulse 2s ease infinite',
                }}
              >
                ⭐
              </div>
              <h3 className="text-white text-xl font-black" style={{ fontFamily: 'Sora,sans-serif' }}>
                Thanks for your feedback!
              </h3>
              <p className="text-gray-400 text-sm">Your review helps us serve you better.</p>
            </div>
          ) : step === 'items' ? (
            /* ── ITEM RATINGS ── */
            <div className="flex flex-col max-h-[80vh]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
                <button
                  onClick={() => setStep('main')}
                  className="text-gray-500 hover:text-white transition-colors flex items-center gap-1 text-sm"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                  Back
                </button>
                <h3 className="text-white font-bold text-sm" style={{ fontFamily: 'Sora,sans-serif' }}>
                  Rate Each Item
                </h3>
                <button onClick={onClose} className="text-gray-600 hover:text-gray-300 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
 
              <div className="overflow-y-auto flex-1 p-4 space-y-3 scrollbar-hide">
                {order.items.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-2xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 shrink-0">
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
                    </div>
                    <StarRating
                      value={itemRatings[item.id] || 0}
                      size="sm"
                      onChange={v => setItemRatings(r => ({ ...r, [item.id]: v }))}
                    />
                  </div>
                ))}
              </div>
 
              <div className="p-4 border-t border-white/6">
                <button
                  onClick={handleSubmit}
                  disabled={ratingLoading}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg,#ff4d6d,#e63c5a)', fontFamily: 'Sora,sans-serif', boxShadow: '0 6px 20px rgba(255,77,109,0.3)' }}
                >
                  {ratingLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </div>
          ) : (
            /* ── MAIN RATING ── */
            <div className="flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
                <div>
                  <h3 className="text-white font-black text-base" style={{ fontFamily: 'Sora,sans-serif' }}>
                    Rate Your Order
                  </h3>
                  <p className="text-gray-500 text-xs mt-0.5">{order.order_number}</p>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 transition-colors">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
 
              <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6 scrollbar-hide">
                {/* Overall — big stars */}
                <div className="flex flex-col items-center gap-3">
                  <p className="text-gray-400 text-sm">How was your overall experience?</p>
                  <StarRating value={overall} size="lg" onChange={setOverall} />
                  <p className="text-sm font-semibold transition-colors" style={{
                    fontFamily: 'Sora,sans-serif',
                    color: overall === 0 ? 'transparent'
                      : overall <= 2 ? '#ef4444'
                      : overall <= 3 ? '#eab308'
                      : overall <= 4 ? '#ff4d6d'
                      : '#22c55e',
                  }}>
                    {['', 'Poor 😞', 'Okay 😐', 'Good 🙂', 'Great 😊', 'Excellent 🤩'][Math.round(overall)] || ''}
                  </p>
                </div>
 
                {/* Category ratings */}
                <div className="space-y-3">
                  {CATEGORIES.map(cat => {
                    const val = { delivery_rating: delivery, quality_rating: quality, packaging_rating: packaging }[cat.key];
                    const setter = { delivery_rating: setDelivery, quality_rating: setQuality, packaging_rating: setPackaging }[cat.key];
                    return (
                      <div
                        key={cat.key}
                        className="flex items-center justify-between p-3.5 rounded-2xl"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{cat.icon}</span>
                          <span className="text-gray-300 text-sm font-medium">{cat.label}</span>
                        </div>
                        <StarRating value={val} size="sm" onChange={setter} />
                      </div>
                    );
                  })}
                </div>
 
                {/* Quick tags */}
                <div>
                  <p className="text-gray-500 text-xs mb-2 uppercase tracking-wider">Quick feedback</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_REVIEWS.map(t => {
                      const active = review.includes(t);
                      return (
                        <button
                          key={t}
                          onClick={() => {
                            if (active) setReview(r => r.replace(t, '').trim());
                            else handleQuickReview(t);
                          }}
                          className="text-xs px-3 py-1.5 rounded-xl transition-all"
                          style={{
                            background: active ? 'rgba(255,77,109,0.15)' : 'rgba(255,255,255,0.04)',
                            border: active ? '1px solid rgba(255,77,109,0.4)' : '1px solid rgba(255,255,255,0.08)',
                            color: active ? '#ff4d6d' : 'rgba(255,255,255,0.45)',
                            fontFamily: 'DM Sans,sans-serif',
                          }}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
 
                {/* Text review */}
                <div>
                  <p className="text-gray-500 text-xs mb-2 uppercase tracking-wider">Write a review (optional)</p>
                  <textarea
                    value={review}
                    onChange={e => setReview(e.target.value)}
                    placeholder="Tell us what you loved or what we can improve..."
                    rows={3}
                    className="w-full bg-white/4 border border-white/8 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ff4d6d]/40 resize-none transition-all"
                    style={{ fontFamily: 'DM Sans,sans-serif' }}
                  />
                  <p className="text-right text-[10px] text-gray-600 mt-1">{review.length}/500</p>
                </div>
 
                {/* Rate items link */}
                <button
                  onClick={() => setStep('items')}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl transition-all hover:bg-white/5"
                  style={{ border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🌟</span>
                    <span className="text-gray-300 text-sm">Rate individual items</span>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
 
                {error && (
                  <p className="text-red-400 text-xs flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {error}
                  </p>
                )}
              </div>
 
              {/* Submit */}
              <div className="px-6 pb-6 pt-3 border-t border-white/6">
                <button
                  onClick={handleSubmit}
                  disabled={ratingLoading || overall === 0}
                  className="w-full py-4 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg,#ff4d6d,#e63c5a)',
                    fontFamily: 'Sora,sans-serif',
                    boxShadow: overall > 0 ? '0 8px 24px rgba(255,77,109,0.35)' : 'none',
                  }}
                >
                  {ratingLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    `Submit ${overall > 0 ? `${overall}★ ` : ''}Review`
                  )}
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12 pointer-events-none" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
 
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.3)} 50%{box-shadow:0 0 0 14px rgba(34,197,94,0)} }
        .animate-slideUp { animation: slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .scrollbar-hide::-webkit-scrollbar{display:none}
        .scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
      `}</style>
    </>
  );
}