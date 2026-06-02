
import { useState } from 'react';
import type { UserCoupon } from '../../types/coupon.types';

interface Props {
  coupon: UserCoupon;
  onApply?: (code: string) => void;
  compact?: boolean;
}

export default function CouponCard({ coupon, onApply, compact = false }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(coupon.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const discountLabel = coupon.type === 'percentage'
    ? `${coupon.discount}% OFF`
    : `₹${coupon.discount} OFF`;

  const expiry = new Date(coupon.expiry);
  const isUrgent = coupon.hours_left !== null && coupon.hours_left <= 24;
  const isExpiringSoon = coupon.hours_left !== null;

  const expiryText = (() => {
    if (coupon.hours_left === null) {
      return `Expires ${expiry.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
    }
    if (coupon.hours_left < 1) return `Expires in ${Math.round(coupon.hours_left * 60)} mins`;
    if (coupon.hours_left < 24) return `Expires in ${Math.floor(coupon.hours_left)}h ${Math.round((coupon.hours_left % 1) * 60)}m`;
    return `Expires in ${Math.ceil(coupon.hours_left / 24)}d`;
  })();

  if (compact) {
    return (
      <div
        className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5 ${
          coupon.is_used ? 'opacity-50' : ''
        }`}
        style={{
          background: 'rgba(17,25,40,0.8)',
          border: isUrgent
            ? '1.5px solid rgba(239,68,68,0.4)'
            : '1.5px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Dashed divider */}
        <div className="absolute left-[72px] top-0 bottom-0 w-px border-l-2 border-dashed border-white/8" />

        <div className="flex">
          {/* Left color slab */}
          <div
            className="w-[72px] flex flex-col items-center justify-center py-4 gap-1 shrink-0"
            style={{
              background: isUrgent
                ? 'linear-gradient(180deg,rgba(239,68,68,0.15),rgba(239,68,68,0.08))'
                : 'linear-gradient(180deg,rgba(255,77,109,0.15),rgba(255,77,109,0.08))',
            }}
          >
            <span className="text-xl font-black leading-none" style={{
              color: isUrgent ? '#ef4444' : '#ff4d6d',
              fontFamily: 'Sora,sans-serif',
            }}>
              {coupon.type === 'percentage' ? `${coupon.discount}%` : `₹${coupon.discount}`}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider" style={{
              color: isUrgent ? 'rgba(239,68,68,0.7)' : 'rgba(255,77,109,0.7)',
            }}>OFF</span>
          </div>

          {/* Right content */}
          <div className="flex-1 px-3 py-3 min-w-0">
            <p className="text-white text-sm font-bold truncate" style={{ fontFamily: 'Sora,sans-serif' }}>
              {coupon.title}
            </p>
            <p className="text-gray-500 text-[10px] mt-0.5">Min ₹{coupon.min_order} · Use code:</p>
            <div className="flex items-center gap-2 mt-1.5">
              <code
                className="text-xs font-bold tracking-widest px-2 py-1 rounded-lg"
                style={{
                  color: '#ff4d6d',
                  background: 'rgba(255,77,109,0.1)',
                  border: '1px dashed rgba(255,77,109,0.3)',
                  fontFamily: 'monospace',
                }}
              >
                {coupon.code}
              </code>
              <button
                onClick={handleCopy}
                className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Expiry badge */}
          <div className="flex flex-col items-center justify-center pr-3 pl-1 shrink-0">
            <span className={`text-[9px] font-bold px-1.5 py-1 rounded-lg text-center leading-tight ${
              isUrgent
                ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                : isExpiringSoon
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                : 'bg-white/5 text-gray-500 border border-white/8'
            }`}>
              {expiryText.replace('Expires ', '')}
            </span>
          </div>
        </div>

        {coupon.is_used && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] rounded-2xl">
            <span className="text-green-400 text-xs font-bold bg-green-500/15 border border-green-500/25 px-3 py-1 rounded-full">
              ✓ Used
            </span>
          </div>
        )}
      </div>
    );
  }

  // Full card
  return (
    <div
      className={`relative rounded-3xl overflow-hidden transition-all hover:-translate-y-1 ${coupon.is_used ? 'opacity-60' : ''}`}
      style={{
        background: 'rgba(17,25,40,0.85)',
        border: isUrgent
          ? '1.5px solid rgba(239,68,68,0.35)'
          : '1.5px solid rgba(255,255,255,0.08)',
        boxShadow: isUrgent ? '0 0 30px rgba(239,68,68,0.08)' : 'none',
      }}
    >
      {/* Top gradient strip */}
      <div
        className="h-1.5 w-full"
        style={{
          background: isUrgent
            ? 'linear-gradient(90deg,#ef4444,#dc2626)'
            : 'linear-gradient(90deg,#ff4d6d,#a855f7)',
        }}
      />

      {/* Expiry warning ribbon */}
      {isUrgent && (
        <div className="bg-red-500/12 border-b border-red-500/15 px-4 py-2 flex items-center gap-2">
          <span className="animate-ping inline-flex w-2 h-2 rounded-full bg-red-400 opacity-75" />
          <span className="text-red-400 text-xs font-semibold">
            ⏰ Expiring in {coupon.hours_left !== null ? `${Math.floor(coupon.hours_left)}h` : 'soon'} — use it now!
          </span>
        </div>
      )}

      {isExpiringSoon && !isUrgent && (
        <div className="bg-amber-500/10 border-b border-amber-500/12 px-4 py-1.5 flex items-center gap-2">
          <span className="text-amber-400 text-[10px] font-medium">
            ⚡ {expiryText}
          </span>
        </div>
      )}

      <div className="p-5">
        {/* Discount badge + title */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div
              className="text-3xl font-black mb-1"
              style={{
                color: isUrgent ? '#ef4444' : '#ff4d6d',
                fontFamily: 'Sora,sans-serif',
                textShadow: isUrgent ? '0 0 20px rgba(239,68,68,0.3)' : '0 0 20px rgba(255,77,109,0.3)',
              }}
            >
              {discountLabel}
            </div>
            <h3 className="text-white font-bold text-base leading-tight" style={{ fontFamily: 'Sora,sans-serif' }}>
              {coupon.title}
            </h3>
          </div>

          {/* Image or emoji */}
          {coupon.image_url ? (
            <img
              src={coupon.image_url}
              alt=""
              className="w-14 h-14 rounded-2xl object-cover border border-white/8 shrink-0"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff4d6d]/15 to-purple-900/15 border border-white/8 flex items-center justify-center text-2xl shrink-0">
              🎁
            </div>
          )}
        </div>

        {coupon.description && (
          <p className="text-gray-400 text-xs mb-4 leading-relaxed">{coupon.description}</p>
        )}

        {/* Details row */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {coupon.min_order > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-gray-500 bg-white/4 border border-white/8 px-2 py-1 rounded-lg">
              <span>Min order</span>
              <span className="text-white font-semibold">₹{coupon.min_order}</span>
            </div>
          )}
          {coupon.max_discount > 0 && coupon.type === 'percentage' && (
            <div className="flex items-center gap-1 text-[10px] text-gray-500 bg-white/4 border border-white/8 px-2 py-1 rounded-lg">
              <span>Max save</span>
              <span className="text-white font-semibold">₹{coupon.max_discount}</span>
            </div>
          )}
          {!isExpiringSoon && (
            <div className="text-[10px] text-gray-500 bg-white/4 border border-white/8 px-2 py-1 rounded-lg">
              {expiryText}
            </div>
          )}
        </div>

        {/* Dashed coupon code row */}
        <div
          className="rounded-xl border-2 border-dashed p-3 flex items-center justify-between"
          style={{ borderColor: isUrgent ? 'rgba(239,68,68,0.25)' : 'rgba(255,77,109,0.25)' }}
        >
          <code
            className="text-base font-black tracking-[0.15em]"
            style={{
              color: isUrgent ? '#ef4444' : '#ff4d6d',
              fontFamily: 'monospace',
            }}
          >
            {coupon.code}
          </code>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,77,109,0.12)',
                border: copied ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,77,109,0.25)',
                color: copied ? '#22c55e' : '#ff4d6d',
                fontFamily: 'Sora,sans-serif',
              }}
            >
              {copied ? '✓ Copied!' : 'Copy Code'}
            </button>
            {onApply && !coupon.is_used && (
              <button
                onClick={() => onApply(coupon.code)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg,#ff4d6d,#e63c5a)',
                  fontFamily: 'Sora,sans-serif',
                }}
              >
                Apply
              </button>
            )}
          </div>
        </div>

        {coupon.is_used && (
          <div className="mt-3 text-center text-xs text-green-400 flex items-center justify-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Already used
          </div>
        )}
      </div>
    </div>
  );
}
