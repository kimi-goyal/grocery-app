
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCouponStore } from '../store/couponStore';
import CartDrawer from '../components/home/CartDrawer';
import CouponCard from '../components/coupons/CouponCard';
import NotificationPermissionBanner from '../components/coupons/NotificationPermissionBanner';
import Navbar from '../components/navbar/Navbar';

type Filter = 'all' | 'available' | 'expiring' | 'used';

export default function CouponsPage() {
  const { coupons, loading, fetchCoupons } = useCouponStore();
  const [filter, setFilter] = useState<Filter>('all');
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchCoupons(); }, []);

  const filtered = coupons.filter(c => {
    if (filter === 'available') return !c.is_used && c.hours_left === null;
    if (filter === 'expiring') return !c.is_used && c.hours_left !== null;
    if (filter === 'used') return c.is_used;
    return true;
  });

  const expiringCount = coupons.filter(c => !c.is_used && c.hours_left !== null).length;

  const handleApply = (code: string) => navigate('/checkout', { state: { couponCode: code } });

  const FILTERS: { key: Filter; label: string; count?: number }[] = [
    { key: 'all', label: 'All Offers', count: coupons.length },
    { key: 'available', label: 'Available', count: coupons.filter(c => !c.is_used).length },
    { key: 'expiring', label: '⏰ Expiring', count: expiringCount },
    { key: 'used', label: 'Used', count: coupons.filter(c => c.is_used).length },
  ];

  return (
    <div className="min-h-screen bg-[#050816]">
      <Navbar onCartOpen={() => setCartOpen(true)} />

      {/* Ambient */}
      <div className="fixed top-0 left-0 w-[500px] h-[400px] bg-[#ff4d6d]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-5 py-8 space-y-6 relative z-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fadeUp">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-[#ff4d6d]/12 border border-[#ff4d6d]/20 flex items-center justify-center text-xl">
              🎁
            </div>
            <div>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'Sora,sans-serif' }}>
                My Coupons
              </h1>
              <p className="text-gray-500 text-xs">{coupons.filter(c => !c.is_used).length} active offers waiting for you</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/home')}
            className="px-4 py-2 rounded-2xl text-sm font-semibold text-white transition-all"
            style={{
              background: 'linear-gradient(135deg,#ff4d6d,#e63c5a)',
              fontFamily: 'Sora,sans-serif',
              boxShadow: '0 6px 20px rgba(255,77,109,0.3)',
            }}
          >
            Back to Home
          </button>
        </div>

        {/* Notification banner */}
        <NotificationPermissionBanner />

        {/* Expiry alert strip */}
        {expiringCount > 0 && (
          <div
            className="rounded-2xl p-4 flex items-center justify-between gap-4 animate-fadeUp"
            style={{
              background: 'linear-gradient(135deg,rgba(239,68,68,0.1),rgba(239,68,68,0.04))',
              border: '1px solid rgba(239,68,68,0.25)',
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-red-300 font-bold text-sm" style={{ fontFamily: 'Sora,sans-serif' }}>
                  {expiringCount} coupon{expiringCount > 1 ? 's' : ''} expiring soon!
                </p>
                <p className="text-red-400/60 text-xs">Use them before they're gone</p>
              </div>
            </div>
            <button
              onClick={() => setFilter('expiring')}
              className="text-xs font-bold text-red-400 bg-red-500/15 border border-red-500/25 px-3 py-1.5 rounded-xl hover:bg-red-500/25 transition-all shrink-0"
              style={{ fontFamily: 'Sora,sans-serif' }}
            >
              View Now
            </button>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0"
              style={{
                background: filter === f.key ? 'rgba(255,77,109,0.15)' : 'rgba(255,255,255,0.04)',
                border: filter === f.key ? '1px solid rgba(255,77,109,0.35)' : '1px solid rgba(255,255,255,0.08)',
                color: filter === f.key ? '#ff4d6d' : 'rgba(255,255,255,0.4)',
                fontFamily: 'Sora,sans-serif',
              }}
            >
              {f.label}
              {f.count !== undefined && (
                <span
                  className="px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                  style={{
                    background: filter === f.key ? 'rgba(255,77,109,0.2)' : 'rgba(255,255,255,0.08)',
                    color: filter === f.key ? '#ff4d6d' : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-52 bg-white/4 border border-white/6 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="text-6xl">🎟️</div>
            <p className="text-white font-bold text-lg" style={{ fontFamily: 'Sora,sans-serif' }}>
              {filter === 'used' ? 'No used coupons yet' : 'No coupons here'}
            </p>
            <p className="text-gray-500 text-sm max-w-xs">
              {filter === 'used'
                ? 'Use a coupon at checkout to see it here'
                : 'New offers are added regularly — check back soon!'}
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#ff4d6d] border border-[#ff4d6d]/25 bg-[#ff4d6d]/8 hover:bg-[#ff4d6d]/15 transition-all"
                style={{ fontFamily: 'Sora,sans-serif' }}
              >
                View All Coupons
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeUp">
            {filtered.map((coupon, i) => (
              <div key={coupon.id} style={{ animationDelay: `${i * 0.05}s` }}>
                <CouponCard coupon={coupon} onApply={handleApply} />
              </div>
            ))}
          </div>
        )}
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .animate-fadeUp { animation: fadeUp 0.35s ease forwards; }
        .scrollbar-hide::-webkit-scrollbar{display:none}
        .scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
      `}</style>
    </div>
  );
}
