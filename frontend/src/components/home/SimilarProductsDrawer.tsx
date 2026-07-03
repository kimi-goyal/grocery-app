
import { useEffect, useState } from 'react';
import { productService, type ProductRec} from '../../services/productService';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

interface Props {
  product: { id: string; name: string; image_url?: string; image?: string };
  open: boolean;
  onClose: () => void;
}

export default function SimilarProductsDrawer({ product, open, onClose }: Props) {
  const [similar, setSimilar] = useState<ProductRec[]>([]);
  const [loading, setLoading] = useState(false);
  const { items, addItem, updateQty } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open || !product.id) return;
    setLoading(true);
    productService.getSimilar(product.id, 8)
      .then(setSimilar)
      .finally(() => setLoading(false));
  }, [open, product.id]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-350
          ${open ? 'translate-y-0' : 'translate-y-full'}`}
        style={{
          background: 'rgba(9,12,26,0.98)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px 24px 0 0',
          backdropFilter:'blur(24px)',
          maxHeight: '82vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-white/15 rounded-full" />
        </div>

        {/* Header — source product */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-white/6 shrink-0">
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/5 border border-white/8 shrink-0">
            <img
              src={product.image_url || product.image || ''}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-400 text-[10px] uppercase tracking-widest font-semibold">Similar to</p>
            <p className="text-white text-sm font-bold truncate" style={{ fontFamily: 'Sora,sans-serif' }}>
              {product.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Products grid */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-52 bg-white/4 rounded-2xl animate-pulse border border-white/6" />
              ))}
            </div>
          ) : similar.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
              <span className="text-4xl">🔍</span>
              <p className="text-gray-400 text-sm">No similar products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {similar.map(p => {
                const cartItem = items.find(i => i.product_id === p.id);
                const remainingStock = p.stock - (cartItem?.qty ?? 0);
                const inStock = p.stock > 0;

                return (
                  <div
                    key={p.id}
                    className="rounded-2xl p-3 flex flex-col gap-2.5 border border-white/7 hover:border-white/15 transition-all"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    {/* Image */}
                    <div className="relative h-28 rounded-xl overflow-hidden bg-white/4">
                      <img
                        src={p.image_url || ''}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      {p.discount >= 25 && (
                        <span className="absolute top-1.5 left-1.5 text-[8px] font-bold text-white px-1.5 py-0.5 rounded-full"
                          style={{ background: 'rgba(255,77,109,0.9)' }}>
                          {Math.round(p.discount)}% OFF
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <p className="text-white text-xs font-semibold leading-tight line-clamp-2" style={{ fontFamily: 'Sora,sans-serif' }}>
                        {p.name}
                      </p>
                      <p className="text-gray-500 text-[10px] mt-0.5">{p.pack_size || 1} {p.unit}</p>
                      {p.rating > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-yellow-400 text-[9px]">★</span>
                          <span className="text-gray-500 text-[9px]">{p.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    {/* Price + cart */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white text-xs font-bold">₹{p.price}</span>
                        {p.mrp > p.price && (
                          <span className="text-gray-600 text-[9px] line-through ml-1">₹{p.mrp}</span>
                        )}
                      </div>

                      {!inStock ? (
                        <span className="text-gray-600 text-[9px]">OOS</span>
                      ) : cartItem ? (
                        <div className="flex items-center gap-1 bg-[#ff4d6d]/10 border border-[#ff4d6d]/20 rounded-lg px-1.5 py-0.5">
                          <button
                            onClick={() => updateQty(p.id, cartItem.qty - 1)}
                            className="text-[#ff4d6d] font-bold text-xs w-4 h-4 flex items-center justify-center"
                          >−</button>
                          <span className="text-white text-[10px] font-bold w-3 text-center">{cartItem.qty}</span>
                          <button
                            onClick={() => remainingStock > 0 && updateQty(p.id, cartItem.qty + 1)}
                            disabled={remainingStock <= 0}
                            className="text-[#ff4d6d] font-bold text-xs w-4 h-4 flex items-center justify-center disabled:opacity-40"
                          >+</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            if (!isAuthenticated) { navigate('/auth'); return; }
                            addItem(p.id);
                            productService.trackCartAdd(p.id);
                          }}
                          className="w-7 h-7 rounded-lg bg-[#ff4d6d] hover:bg-[#e63c5a] flex items-center justify-center transition-all hover:scale-110"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                            <path d="M12 5v14M5 12h14"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <style>{`
          .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
          .scrollbar-hide::-webkit-scrollbar{display:none}
          .scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
        `}</style>
      </div>
    </>
  );
}
