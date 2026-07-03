import { useEffect, useState } from 'react';
import { productService, type ProductRec } from '../../services/productService';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

interface Props {
  productId: string;
  productName: string;
}

export default function FrequentlyBoughtTogether({ productId, productName }: Props) {
  const [products, setProducts] = useState<ProductRec[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { items, addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    productService.getFrequentlyBought(productId, 4).then(data => {
      setProducts(data);
      setSelected(new Set(data.map(p => p.id)));
    });
  }, [productId]);

  if (products.length === 0) return null;

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectedProducts = products.filter(p => selected.has(p.id));
  const bundleTotal = selectedProducts.reduce((s, p) => s + p.price, 0);
  const bundleMrp = selectedProducts.reduce((s, p) => s + p.mrp, 0);
  const bundleSave = bundleMrp - bundleTotal;

  const handleAddAll = () => {
    if (!isAuthenticated) { navigate('/auth'); return; }
    selectedProducts.forEach(p => {
      if (!items.find(i => i.product_id === p.id)) {
        addItem(p.id);
        productService.trackCartAdd(p.id);
      }
    });
  };

  return (
    <div
      className="rounded-3xl p-5 mt-4"
      style={{ background: 'rgba(17,25,40,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🛍️</span>
        <h3 className="text-white font-bold text-sm" style={{ fontFamily: 'Sora,sans-serif' }}>
          Frequently Bought Together
        </h3>
      </div>

      {/* Product chain */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
        {products.map((p, i) => {
          const isSelected = selected.has(p.id);
          const inCart = !!items.find(ci => ci.product_id === p.id);
          return (
            <div key={p.id} className="flex items-center gap-2 shrink-0">
              <div
                onClick={() => toggleSelect(p.id)}
                className={`relative w-[90px] rounded-2xl p-2 cursor-pointer transition-all border ${
                  isSelected
                    ? 'border-[#ff4d6d]/50 bg-[#ff4d6d]/6'
                    : 'border-white/8 bg-white/3 opacity-60'
                }`}
              >
                {/* Checkbox */}
                <div
                  className="absolute top-1.5 left-1.5 w-4 h-4 rounded-md flex items-center justify-center transition-all"
                  style={{
                    background: isSelected ? '#ff4d6d' : 'rgba(255,255,255,0.1)',
                    border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  {isSelected && (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>

                {inCart && (
                  <div className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-green-500 border border-[#0b1220]" />
                )}

                <div className="h-16 rounded-xl overflow-hidden bg-white/5 mt-4">
                  <img src={p.image_url || ''} alt={p.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
                <p className="text-white text-[9px] font-semibold mt-1.5 line-clamp-2 text-center" style={{ fontFamily: 'Sora,sans-serif' }}>
                  {p.name}
                </p>
                <p className="text-[#ff4d6d] text-[10px] font-bold text-center mt-0.5">₹{p.price}</p>
              </div>

              {i < products.length - 1 && (
                <span className="text-gray-600 text-sm font-bold shrink-0">+</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Bundle price + add all */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/6">
        <div>
          <p className="text-gray-400 text-xs">
            {selectedProducts.length} item{selectedProducts.length !== 1 ? 's' : ''} selected
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-white font-black text-base" style={{ fontFamily: 'Sora,sans-serif' }}>
              ₹{bundleTotal.toFixed(0)}
            </span>
            {bundleSave > 0 && (
              <span className="text-green-400 text-xs font-semibold">
                Save ₹{bundleSave.toFixed(0)}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleAddAll}
          disabled={selectedProducts.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white transition-all disabled:opacity-40 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg,#ff4d6d,#e63c5a)',
            fontFamily: 'Sora,sans-serif',
            boxShadow: '0 4px 14px rgba(255,77,109,0.3)',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
          </svg>
          Add All to Cart
        </button>
      </div>

      <style>{`
        .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .scrollbar-hide::-webkit-scrollbar{display:none}
        .scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
      `}</style>
    </div>
  );
}
