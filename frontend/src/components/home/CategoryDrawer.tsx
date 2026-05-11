import { useState } from 'react';
import { CATEGORIES, CATEGORY_PRODUCTS } from '../../data/homeData';
import ProductCard from './ProductCard';

interface Props {
  open: boolean;
  onClose: () => void;
  initialCategory?: string;
}

export default function CategoryDrawer({ open, onClose, initialCategory }: Props) {
  const [selected, setSelected] = useState(initialCategory || CATEGORIES[0].name);
  const products = CATEGORY_PRODUCTS[selected] || [];

  // TO FETCH REAL DATA:
  // useEffect(() => {
  // fetch(`http://localhost:8000/api/products?category=${encodeURIComponent(selected)}`)
  // .then(r => r.json())
  // .then(data => setProducts(data.products));
  // }, [selected]);

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={onClose} />}
      <div className={`fixed top-0 left-0 h-full z-50 flex transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`} style={{ width: '780px', maxWidth: '95vw' }}>

        {/* Category list */}
        <div className="w-[220px] shrink-0 bg-[#050816] border-r border-white/8 flex flex-col overflow-y-auto scrollbar-hide">
          <div className="flex items-center justify-between p-4 border-b border-white/8">
            <h3 className="text-white font-bold text-sm" style={{ fontFamily: 'Sora,sans-serif' }}>Categories</h3>
            <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="flex flex-col gap-0.5 p-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelected(cat.name)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all text-left ${
                  selected === cat.name
                    ? 'bg-[#ff4d6d]/10 border border-[#ff4d6d]/20 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                <div>
                  <div className="font-medium text-xs leading-tight">{cat.name}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{cat.count} items</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Products panel */}
        <div className="flex-1 bg-[#0b1220] overflow-y-auto scrollbar-hide">
          <div className="p-5 border-b border-white/8 flex items-center justify-between sticky top-0 bg-[#0b1220]/95 backdrop-blur-sm z-10">
            <div>
              <h3 className="text-white font-bold" style={{ fontFamily: 'Sora,sans-serif' }}>{selected}</h3>
              <p className="text-gray-400 text-xs">{products.length} products</p>
            </div>
            <div className="flex gap-2">
              <select className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none">
                <option>Sort: Popular</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>
          </div>

          <div className="p-5">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
                <span className="text-5xl">{CATEGORIES.find(c => c.name === selected)?.icon}</span>
                <p className="text-gray-400 text-sm">Products coming soon!</p>
                <p className="text-gray-600 text-xs">We're stocking up this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

