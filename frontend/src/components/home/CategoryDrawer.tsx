// import { useEffect, useState } from 'react';
// import { useShopStore } from "../../store/shopStore";
// import ProductCard from './ProductCard';

// interface Props {
//   open: boolean;
//   onClose: () => void;
//   initialCategory?: string;
// }

// export default function CategoryDrawer({ open, onClose, initialCategory }: Props) {
//   const { categories, selected, setSelected, fetchData } = useShopStore();

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const current = categories.find(c => c.name === selected);
//   const products = current?.products || [];
//   // TO FETCH REAL DATA:
//   // useEffect(() => {
//   // fetch(`http://localhost:8000/api/products?category=${encodeURIComponent(selected)}`)
//   // .then(r => r.json())
//   // .then(data => setProducts(data.products));
//   // }, [selected]);



//   return (
//     <>
//       {open && <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={onClose} />}
//       <div className={`fixed top-0 left-0 h-full z-50 flex transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`} style={{ width: '780px', maxWidth: '95vw' }}>

//         {/* Category list */}
//         <div className="w-[220px] shrink-0 bg-[#050816] border-r border-white/8 flex flex-col overflow-y-auto scrollbar-hide">
//           <div className="flex items-center justify-between p-4 border-b border-white/8">
//             <h3 className="text-white font-bold text-sm" style={{ fontFamily: 'Sora,sans-serif' }}>Categories</h3>
//             <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center">
//               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
//             </button>
//           </div>
//           <div className="flex flex-col gap-0.5 p-2">
//             {categories.map(cat => (
//               <button
//                 key={cat.id}
//                 onClick={() => setSelected(cat.name)}
//                 className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all text-left ${selected === cat.name
//                   ? 'bg-[#ff4d6d]/10 border border-[#ff4d6d]/20 text-white'
//                   : 'text-gray-400 hover:text-white hover:bg-white/5'
//                   }`}
//               >
//                 <span className="text-xl">{cat.image}</span>
//                 <div>
//                   <div className="font-medium text-xs leading-tight">{cat.name}</div>
//                   <div className="text-[10px] text-gray-500 mt-0.5">{cat.products.length} items</div>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Products panel */}
//         <div className="flex-1 bg-[#0b1220] overflow-y-auto scrollbar-hide">
//           <div className="p-5 border-b border-white/8 flex items-center justify-between sticky top-0 bg-[#0b1220]/95 backdrop-blur-sm z-10">
//             <div>
//               <h3 className="text-white font-bold" style={{ fontFamily: 'Sora,sans-serif' }}>{selected}</h3>
//               <p className="text-gray-400 text-xs">{products.length} products</p>
//             </div>
//             <div className="flex gap-2">
//               <select className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none">
//                 <option>Sort: Popular</option>
//                 <option>Price: Low to High</option>
//                 <option>Price: High to Low</option>
//                 <option>Newest First</option>
//               </select>
//             </div>
//           </div>

//           <div className="p-5">
//             {products.length === 0 ? (
//               <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
//                 <span className="text-5xl">{categories.find(c => c.name === selected)?.image}</span>
//                 <p className="text-gray-400 text-sm">Products coming soon!</p>
//                 <p className="text-gray-600 text-xs">We're stocking up this category.</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-3 gap-4">
//                 {products.map(p => (
//                   <ProductCard
//                     key={p.id}
//                     product={{
//                       id: Number(p.id),
//                       name: p.name,
//                       price: p.price,
//                       mrp: p.mrp,
//                       image: p.image,

//                       // ✅ required extras
//                       unit: p.unit || "kg",
//                       discount: p.discount ?? Math.round(((p.mrp - p.price) / p.mrp) * 100),

//                       // ✅ FIXED MISSING FIELDS
//                       badge: p.discount > 0 ? `${Math.round(p.discount)}% OFF` : "",
//                       inStock: p.stock > 0,

//                       // ✅ dummy UI props
//                       rating: 4.2,
//                       reviews: 120
//                     }}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import { useEffect } from "react";
import { useShopStore } from "../../store/shopStore";
import ProductCard from "./ProductCard";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CategoryDrawer({ open, onClose }: Props) {
  const { categories, selected, setSelected, fetchData } = useShopStore();

  useEffect(() => {
    fetchData();
  }, []);

  const current = categories.find((c) => c.name === selected);
  const products = current?.products || [];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full z-50 flex transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
          }`}
        style={{ width: "900px", maxWidth: "95vw" }}
      >
        {/* Category List */}
        <div className="w-[260px] bg-[#050816] border-r border-white/8 flex flex-col overflow-y-auto scrollbar-hide">
          <div className="flex items-center justify-between p-4 border-b border-white/8">
            <h3 className="text-white font-bold text-sm">Categories</h3>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-1 p-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelected(cat.name)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-left ${selected === cat.name
                    ? "bg-[#ff4d6d]/10 border border-[#ff4d6d]/20 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                {/* <span><img src={cat.image} alt={cat.name} className="w-6 h-6 object-contain" /></span> */}

                <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 bg-white/5 shrink-0">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>


                <div>
                  <div className="text-xs font-medium">{cat.name}</div>
                  <div className="text-[10px] text-gray-500">
                    {cat.products.length} items
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Products Panel */}
        <div className="flex-1 bg-[#0b1220] overflow-y-auto scrollbar-hide">
          {/* Header */}
          <div className="p-5 border-b border-white/8 flex justify-between">
            <div>
              <h3 className="text-white font-bold">{selected}</h3>
              <p className="text-gray-400 text-xs">
                {products.length} products
              </p>
            </div>
          </div>

          {/* Products */}
          <div className="p-5">
            {products.length === 0 ? (
              <div className="text-center text-gray-400">
                No products yet
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={{
                      id: (p.id),
                      name: p.name,
                      price: p.price,
                      pack_size: p.pack_size,
                      mrp: p.mrp,
                      image: p.image,

                      // ✅ backend fields
                      unit: p.unit,
                      discount: p.discount,

                      // ✅ UI required fields
                      badge:undefined,
                       
                      inStock: p.stock > 0,

                      // ✅ dummy extras
                      rating: 4.2,
                      reviews: 120,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}