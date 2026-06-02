import type { OrderListItem } from '../../types/order.types';
import StarRating from './StarRating';
 
const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string; dot: string; icon: string }> = {
  'Pending': { color: '#eab308', bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.25)', dot: '#eab308', icon: '🕐' },
  'Packed': { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', dot: '#3b82f6', icon: '📦' },
  'On the Way': { color: '#ff4d6d', bg: 'rgba(255,77,109,0.12)', border: 'rgba(255,77,109,0.25)', dot: '#ff4d6d', icon: '🚀' },
  'Delivered': { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.25)', dot: '#22c55e', icon: '✅' },
  'Cancelled': { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)', dot: '#ef4444', icon: '❌' },
};
 
interface Props {
  order: OrderListItem;
  onViewDetail: (id: string) => void;
  onRate: (id: string) => void;
}
 
export default function OrderCard({ order, onViewDetail, onRate }: Props) {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['Pending'];
  const date = new Date(order.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
  const isDelivered = order.status === 'Delivered';
 
  return (
    <div
      className="rounded-3xl overflow-hidden transition-all hover:border-white/15 group"
      style={{
        background: 'rgba(17,25,40,0.7)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Top stripe */}
      <div
        className="h-0.5 w-full transition-all"
        style={{ background: `linear-gradient(90deg, ${cfg.color}, transparent)` }}
      />
 
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="font-black text-sm tracking-wide"
                style={{ color: '#ff4d6d', fontFamily: 'Sora,sans-serif' }}
              >
                {order.order_number}
              </span>
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
              >
                {cfg.icon} {order.status}
              </span>
            </div>
            <p className="text-gray-600 text-xs">{date}</p>
          </div>
 
          <div className="text-right shrink-0">
            <p className="text-white font-black text-lg" style={{ fontFamily: 'Sora,sans-serif' }}>
              ₹{order.total_amount}
            </p>
            <p className="text-gray-600 text-[10px]">
              {order.payment_method === 'cod' ? '💵 COD' : '💳 Online'}
            </p>
          </div>
        </div>
 
        {/* Items preview */}
        {order.items_preview.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex -space-x-2">
              {order.items_preview.slice(0, 3).map((item, i) => (
                <div
                  key={item.id}
                  className="w-10 h-10 rounded-xl overflow-hidden bg-white/5 border-2"
                  style={{ borderColor: 'rgba(11,18,32,0.9)', zIndex: 3 - i }}
                >
                  <img
                    src={item.image_url || ''}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              ))}
              {order.items_count > 3 && (
                <div
                  className="w-10 h-10 rounded-xl bg-white/8 border-2 flex items-center justify-center text-[10px] text-gray-400 font-bold"
                  style={{ borderColor: 'rgba(11,18,32,0.9)' }}
                >
                  +{order.items_count - 3}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate" style={{ fontFamily: 'Sora,sans-serif' }}>
                {order.items_preview[0]?.name}
                {order.items_count > 1 ? ` + ${order.items_count - 1} more` : ''}
              </p>
              <p className="text-gray-600 text-[10px]">{order.items_count} item{order.items_count > 1 ? 's' : ''}</p>
            </div>
          </div>
        )}
 
        {/* Rating display (if rated) */}
        {order.is_rated && order.overall_rating && (
          <div
            className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.15)' }}
          >
            <StarRating value={order.overall_rating} size="sm" readonly showValue />
            <span className="text-green-400 text-[10px] font-medium">You rated this order</span>
          </div>
        )}
 
        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetail(order.id)}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-white/10 bg-white/4 text-gray-300 hover:text-white hover:bg-white/8 transition-all"
            style={{ fontFamily: 'Sora,sans-serif' }}
          >
            View Details
          </button>
 
          {isDelivered && !order.is_rated && (
            <button
              onClick={() => onRate(order.id)}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-all relative overflow-hidden group/btn"
              style={{
                background: 'linear-gradient(135deg,#ff4d6d,#e63c5a)',
                fontFamily: 'Sora,sans-serif',
                boxShadow: '0 4px 14px rgba(255,77,109,0.3)',
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-1.5">
                ⭐ Rate Order
              </span>
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500 skew-x-12 pointer-events-none" />
            </button>
          )}
 
          {isDelivered && order.is_rated && (
            <button
              onClick={() => onViewDetail(order.id)}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-green-400 transition-all"
              style={{
                background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.2)',
                fontFamily: 'Sora,sans-serif',
              }}
            >
              ✓ Rated
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
 
 
 