import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '../../store/orderStore';
import Navbar from '../../components/navbar/Navbar';
import OrderCard from '../../components/orders/OrderCard';
import OrderDetailDrawer from '../../components/orders/OrderDetailDrawer';
import RatingModal from '../../components/orders/RatingModal';
import type { Order } from '../../types/order.types';
 
type Filter = 'All' | 'Pending' | 'Packed' | 'On the Way' | 'Delivered' | 'Cancelled';
 
const FILTERS: Filter[] = ['All', 'Pending', 'Packed', 'On the Way', 'Delivered', 'Cancelled'];
 
export default function OrdersPage() {
  const { orders, total, pages, page, loading, fetchOrders, fetchDetail } = useOrderStore();
  const [filter, setFilter] = useState<Filter>('All');
  const [cartOpen, setCartOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [ratingId, setRatingId] = useState<string | null>(null);
  const [ratingOrder, setRatingOrder] = useState<Order | null>(null);
  const navigate = useNavigate();
 
  useEffect(() => {
    fetchOrders({ status: filter === 'All' ? undefined : filter });
  }, [filter]);
 
  const handleRateOpen = async (id: string) => {
    const order = await fetchDetail(id);
    setRatingOrder(order);
    setRatingId(id);
  };
 
  const pendingRatings = orders.filter(
    o => o.status === 'Delivered' && !o.is_rated
  ).length;
 
  return (
    <div className="min-h-screen bg-[#050816]">
      {/* Ambient glows */}
      <div className="fixed top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[#ff4d6d]/5 blur-[130px] pointer-events-none" />
 
      <Navbar onCartOpen={() => setCartOpen(true)} />
 
      <div className="max-w-3xl mx-auto px-5 py-8 space-y-6 relative z-10">
 
        {/* Page header */}
        <div className="flex items-center justify-between animate-fadeUp">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ff4d6d]/12 border border-[#ff4d6d]/20 flex items-center justify-center text-xl">
              🛒
            </div>
            <div>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'Sora,sans-serif' }}>
                My Orders
              </h1>
              <p className="text-gray-500 text-xs">{total} total orders</p>
            </div>
          </div>
          {pendingRatings > 0 && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer hover:scale-105 transition-transform"
              style={{
                background: 'rgba(255,77,109,0.1)',
                border: '1px solid rgba(255,77,109,0.25)',
              }}
              onClick={() => setFilter('Delivered')}
            >
              <span className="text-sm">⭐</span>
              <span className="text-[#ff4d6d] text-xs font-bold" style={{ fontFamily: 'Sora,sans-serif' }}>
                {pendingRatings} to rate
              </span>
            </div>
          )}
        </div>
 
        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 animate-fadeUp">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0"
              style={{
                background: filter === f ? 'rgba(255,77,109,0.15)' : 'rgba(255,255,255,0.04)',
                border: filter === f ? '1px solid rgba(255,77,109,0.35)' : '1px solid rgba(255,255,255,0.08)',
                color: filter === f ? '#ff4d6d' : 'rgba(255,255,255,0.4)',
                fontFamily: 'Sora,sans-serif',
              }}
            >
              {f}
            </button>
          ))}
        </div>
 
        {/* Orders list */}
        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-44 bg-white/4 border border-white/6 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-5 py-20 text-center animate-fadeUp">
            <div className="text-7xl">📦</div>
            <div>
              <p className="text-white font-black text-xl mb-2" style={{ fontFamily: 'Sora,sans-serif' }}>
                {filter === 'All' ? 'No orders yet' : `No ${filter} orders`}
              </p>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                {filter === 'All'
                  ? 'Start shopping and your orders will appear here'
                  : 'Try a different filter to see your orders'}
              </p>
            </div>
            <button
              onClick={() => navigate('/home')}
              className="px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all"
              style={{
                background: 'linear-gradient(135deg,#ff4d6d,#e63c5a)',
                fontFamily: 'Sora,sans-serif',
                boxShadow: '0 6px 20px rgba(255,77,109,0.3)',
              }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-4 animate-fadeUp">
              {orders.map((order, i) => (
                <div key={order.id} style={{ animationDelay: `${i * 0.05}s` }} className="animate-fadeUp">
                  <OrderCard
                    order={order}
                    onViewDetail={setDetailId}
                    onRate={handleRateOpen}
                  />
                </div>
              ))}
            </div>
 
            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => fetchOrders({ status: filter === 'All' ? undefined : filter, page: page - 1 })}
                  disabled={page <= 1}
                  className="px-4 py-2 rounded-xl text-sm border border-white/10 bg-white/5 text-gray-400 hover:text-white disabled:opacity-30 transition-all"
                >
                  ← Prev
                </button>
                <span className="text-gray-500 text-sm">
                  Page <span className="text-white font-bold">{page}</span> of {pages}
                </span>
                <button
                  onClick={() => fetchOrders({ status: filter === 'All' ? undefined : filter, page: page + 1 })}
                  disabled={page >= pages}
                  className="px-4 py-2 rounded-xl text-sm border border-white/10 bg-white/5 text-gray-400 hover:text-white disabled:opacity-30 transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
 
      {/* Detail drawer */}
      {detailId && (
        <OrderDetailDrawer
          orderId={detailId}
          onClose={() => setDetailId(null)}
          onRate={handleRateOpen}
        />
      )}
 
      {/* Rating modal */}
      {ratingId && ratingOrder && (
        <RatingModal
          order={ratingOrder}
          onClose={() => { setRatingId(null); setRatingOrder(null); }}
          onDone={() => { setRatingId(null); setRatingOrder(null); }}
        />
      )}
 
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .animate-fadeUp { animation: fadeUp 0.35s ease forwards; }
        .scrollbar-hide::-webkit-scrollbar{display:none}
        .scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
      `}</style>
    </div>
  );
}
 
 
 