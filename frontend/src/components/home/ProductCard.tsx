
// import { useMemo, useState } from "react";
// import { useCartStore } from "../../store/cartStore";
// import { useAuthStore } from "../../store/authStore";
// import { useNavigate } from "react-router-dom";
// import { productService } from "../../services/productService";
// import SimilarProductsDrawer from "./SimilarProductsDrawer";

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   pack_size: number;
//   mrp: number;
//   discount: number;
//   unit: string;
//   rating: number;
//   reviews_count: number;
//   image: string;
//   badge?: string;
//   inStock: boolean;
//   stock: number;
//   created_at?: string | null;
// }

// export default function ProductCard({ product }: { product: Product }) {
//   const [imgErr, setImgErr] = useState(false);
//   const [showSimilar, setShowSimilar] = useState(false);
//   const { isAuthenticated } = useAuthStore();
//   const navigate = useNavigate();
//   const { items, addItem, updateQty } = useCartStore();

//   const cartItem = items.find(i => i.product_id === product.id);
//   const cartQty = cartItem?.qty ?? 0;
//   const remainingStock = product.stock - cartQty;
//   const canAddMore = remainingStock > 0;

//   // Fixed "Recently Added" — use created_at date not numeric ID
//   const isRecentlyAdded = useMemo(() => {
//     if (!product.created_at) return false;
//     const created = new Date(product.created_at).getTime();
//     const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
//     return created > sevenDaysAgo;
//   }, [product.created_at]);

//   const productTag = useMemo(() => {
//     if (product.stock <= 0) return { label: "Out of Stock", tone: "red" };
//     if (remainingStock <= 0) return { label: "Stock Finished", tone: "red" };
//     if (remainingStock <= 10) return { label: "Low Stock", tone: "red" };
//     if (product.discount >= 25) return { label: "Hot Deal 🔥", tone: "red" };
//     if (product.rating >= 4.5 && product.reviews_count >= 100)
//                                 return { label: "Popular ⭐", tone: "green" };
//     if (product.reviews_count >= 60)
//                                 return { label: "Highly Ordered", tone: "green" };
//     if (isRecentlyAdded) return { label: "New 🆕", tone: "green" };
//     return null;
//   }, [product, remainingStock, isRecentlyAdded]);

//   const tagClasses = productTag?.tone === "red"
//     ? "bg-red-500/15 border border-red-500/30 text-red-300"
//     : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300";

//   // Fixed pack label — pack_size defaults to 1 not 0
//   const packLabel = (() => {
//     const unit = product.unit?.trim() ?? '';
//     const packSize = product.pack_size || 1;
//     if (!unit) return `${packSize} pcs`;
//     if (/^[0-9]/.test(unit)) return unit;
//     return `${packSize} ${unit}`;
//   })();

//   const handleAddToCart = () => {
//     if (!isAuthenticated) { navigate('/auth'); return; }
//     addItem(product.id);
//     productService.trackCartAdd(product.id); // ← increments cart_count
//   };

//   return (
//     <>
//       <div className="glass border border-white/8 rounded-2xl p-4 flex flex-col gap-3 hover:border-white/18 transition-all hover:-translate-y-0.5 group relative">

//         {/* Badge */}
//         {product.badge && (
//           <div className="absolute top-3 left-3 z-10 bg-[#ff4d6d]/20 border border-[#ff4d6d]/30 text-[#ff4d6d] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
//             {product.badge}
//           </div>
//         )}

//         {productTag && (
//           <div className="absolute top-3 right-3 z-10">
//             <span className={`${tagClasses} text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide`}>
//               {productTag.label}
//             </span>
//           </div>
//         )}

//         {/* Image + similar button */}
//         <div className="relative h-[140px] rounded-xl overflow-hidden bg-white/3 flex items-center justify-center">
//           {!imgErr ? (
//             <img
//               src={product.image || undefined}
//               alt={product.name}
//               className="w-full h-full object-cover"
//               onError={() => setImgErr(true)}
//             />
//           ) : (
//             <span className="text-5xl">{product.name.charAt(0)}</span>
//           )}

//           {/* Similar products button — bottom left like Shein screenshot */}
//           <button
//             onClick={e => { e.stopPropagation(); setShowSimilar(true); }}
//             className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-xl transition-all hover:scale-105 active:scale-95"
//             style={{
//               background: 'rgba(9,12,26,0.85)',
//               border: '1px solid rgba(255,255,255,0.15)',
//               backdropFilter: 'blur(8px)',
//             }}
//             title="View similar products"
//           >
//             <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2">
//               <rect x="2" y="3" width="7" height="7"/><rect x="15" y="3" width="7" height="7"/>
//               <rect x="2" y="14" width="7" height="7"/><rect x="15" y="14" width="7" height="7"/>
//             </svg>
//             <span className="text-white/70 text-[9px] font-medium leading-none">Similar</span>
//           </button>
//         </div>

//         {/* Info */}
//         <div>
//           <h4 className="text-white text-sm font-semibold truncate">{product.name}</h4>
//           <p className="text-gray-500 text-xs mt-0.5">{packLabel}</p>

//           {product.rating > 0 && product.reviews_count > 0 ? (
//             <div className="flex items-center gap-1 mt-1">
//               <span className="text-yellow-400 text-[10px]">★</span>
//               <span className="text-gray-400 text-[10px]">{product.rating.toFixed(1)} ({product.reviews_count})</span>
//             </div>
//           ) : (
//             <div className="flex items-center gap-1 mt-1">
//               <span className="text-gray-600 text-[10px]">★</span>
//               <span className="text-gray-500 text-[10px]">No ratings yet</span>
//             </div>
//           )}

//           {product.discount > 0 && (
//             <div className="mt-1 inline-block bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
//               {Math.round(product.discount)}% OFF
//             </div>
//           )}
//         </div>

//         {/* Bottom */}
//         <div className="flex items-center justify-between mt-auto">
//           <div>
//             <span className="text-white font-bold text-sm">₹{product.price}</span>
//             {product.mrp > product.price && (
//               <span className="text-gray-500 text-xs line-through ml-1">₹{product.mrp}</span>
//             )}
//           </div>

//           {!product.inStock ? (
//             <button disabled className="px-3 py-1.5 rounded-xl bg-gray-700/70 text-gray-400 text-xs cursor-not-allowed">
//               Out of stock
//             </button>
//           ) : cartItem ? (
//             <div className="flex flex-col gap-1.5">
//               <div className="flex items-center gap-2 bg-[#ff4d6d]/10 border border-[#ff4d6d]/20 rounded-xl px-2 py-1">
//                 <button
//                   onClick={() => updateQty(product.id, cartItem.qty - 1)}
//                   className="text-[#ff4d6d] font-bold text-sm w-5 h-5 flex items-center justify-center hover:bg-[#ff4d6d]/20 rounded-lg"
//                 >−</button>
//                 <span className="text-white text-sm font-bold w-4 text-center">{cartItem.qty}</span>
//                 <button
//                   onClick={() => canAddMore && updateQty(product.id, cartItem.qty + 1)}
//                   disabled={!canAddMore}
//                   className={`text-[#ff4d6d] font-bold text-sm w-5 h-5 flex items-center justify-center rounded-lg ${canAddMore ? 'hover:bg-[#ff4d6d]/20' : 'opacity-40 cursor-not-allowed'}`}
//                 >+</button>
//               </div>
//               {!canAddMore && (
//                 <span className="text-rose-300 text-[10px] font-semibold">Stock limit reached</span>
//               )}
//             </div>
//           ) : (
//             <button
//               onClick={handleAddToCart}
//               className="w-8 h-8 rounded-xl bg-[#ff4d6d] hover:bg-[#e63c5a] flex items-center justify-center transition-all hover:scale-110"
//             >
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
//                 <path d="M12 5v14M5 12h14"/>
//               </svg>
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Similar products bottom sheet */}
//       <SimilarProductsDrawer
//         product={{ id: product.id, name: product.name, image: product.image }}
//         open={showSimilar}
//         onClose={() => setShowSimilar(false)}
//       />
//     </>
//   );
// }


import { useMemo, useState } from "react";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
interface Product {
  id: string
  name: string;
  price: number;
  pack_size: number;
  mrp: number;
  discount: number;
  unit: string;
  rating: number;
  reviews_count: number;
  image: string;
  badge?: string;
  inStock: boolean;
  stock: number;
}
 
export default function ProductCard({ product }: { product: Product }) {
  const [imgErr, setImgErr] = useState(false);
  const {  isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { items, addItem, updateQty } = useCartStore();
 
  // ✅ match using product_id (important)
  const cartItem = items.find((i) => i.product_id === product.id);
  const cartQty = cartItem?.qty ?? 0;
  const remainingStock = product.stock - cartQty;
  const canAddMore = remainingStock > 0;
 
  const productTag = useMemo(() => {
    if (product.stock <= 0) {
      return { label: "Out of Stock", tone: "red" };
    }
 
    if (remainingStock <= 0) {
      return { label: "Stock Finished", tone: "red" };
    }
 
    if (remainingStock <= 10) {
      return { label: "Low Stock", tone: "red" };
    }
 
    if (product.discount >= 25) {
      return { label: "Hot Deal", tone: "red" };
    }
 
    if (product.rating >= 4.5 && product.reviews_count >= 100) {
      return { label: "Popular", tone: "green" };
    }
 
    if (product.reviews_count >= 60) {
      return { label: "Highly Ordered", tone: "green" };
    }
 
    const numericId = Number(product.id);
    if (!Number.isNaN(numericId) && numericId % 2 === 0) {
      return { label: "Recently Added", tone: "green" };
    }
 
    return null;
  }, [product, remainingStock]);
 
  const tagClasses = useMemo(() => {
    if (!productTag) return "";
    return productTag.tone === "red"
      ? "bg-red-500/15 border border-red-500/30 text-red-300"
      : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300";
  }, [productTag]);
 
  const packLabel = (() => {
    const unit = product.unit?.trim() ?? '';
    if (!unit) return `${product.pack_size || 1} pcs`;
    if (/^[0-9]/.test(unit)) return unit;
    return `${product.pack_size || 1} ${unit}`;
  })();
 
  return (
    <div className="glass border border-white/8 rounded-2xl p-4 flex flex-col gap-3 hover:border-white/18 transition-all hover:-translate-y-0.5 group relative">
 
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-10 bg-[#ff4d6d]/20 border border-[#ff4d6d]/30 text-[#ff4d6d] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
          {product.badge}
        </div>
      )}
 
      {productTag && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1">
          <span className={`${tagClasses} text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide`}>
            {productTag.label}
          </span>
        </div>
      )}
 
      {/* Image */}
      <div className="h-[140px] rounded-xl overflow-hidden bg-white/3 flex items-center justify-center">
        {!imgErr ? (
          <img
            src={product.image || undefined}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImgErr(true)}
          />
        ) : (
          <span className="text-5xl">{product.name.charAt(0)}</span>
        )}
      </div>
 
      {/* Info */}
      <div>
        <h4 className="text-white text-sm font-semibold truncate">
          {product.name}
        </h4>
 
        <p className="text-gray-500 text-xs mt-0.5">
          {packLabel}
        </p>
 
        {/* {product.rating > 0 && product.reviews_count > 0 ? (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-yellow-400 text-[10px]">★</span>
            <span className="text-gray-400 text-[10px]">
              {product.rating.toFixed(1)} ({product.reviews_count})
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-gray-600 text-[10px]">★</span>
            <span className="text-gray-500 text-[10px]">No ratings yet</span>
          </div>
        )} */}
        {product.rating > 0 && product.reviews_count > 0 ? (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-yellow-400 text-[10px]">★</span>
            <span className="text-gray-400 text-[10px]">
              {product.rating.toFixed(1)} ({product.reviews_count})
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-gray-600 text-[10px]">★</span>
            <span className="text-gray-500 text-[10px]">No ratings yet</span>
          </div>
        )}
 
        {product.discount > 0 && (
          <div className="mt-1 inline-block bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {Math.round(product.discount)}% OFF
          </div>
        )}
      </div>
 
      {/* Bottom */}
      <div className="flex items-center justify-between mt-auto">
 
        {/* Price */}
        <div>
          <span className="text-white font-bold text-sm">
            ₹{product.price}
          </span>
 
          {product.mrp > product.price && (
            <span className="text-gray-500 text-xs line-through ml-1">
              ₹{product.mrp}
            </span>
          )}
        </div>
 
        {/* Cart */}
        {!product.inStock ? (
          <button
            disabled
            className="w-full rounded-xl bg-gray-700/70 text-gray-300 text-xs py-2 cursor-not-allowed"
          >
            Out of stock
          </button>
 
        ) : cartItem ? (
 
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 bg-[#ff4d6d]/10 border border-[#ff4d6d]/20 rounded-xl px-2 py-1">
 
              {/* minus */}
              <button
                onClick={() => updateQty(product.id, cartItem.qty - 1)}
                className="text-[#ff4d6d] font-bold text-sm w-5 h-5 flex items-center justify-center hover:bg-[#ff4d6d]/20 rounded-lg"
              >
                −
              </button>
 
              {/* qty */}
              <span className="text-white text-sm font-bold w-4 text-center">
                {cartItem.qty}
              </span>
 
              {/* plus */}
              <button
                onClick={() => updateQty(product.id, cartItem.qty + 1)}
                disabled={!canAddMore}
                className={`text-[#ff4d6d] font-bold text-sm w-5 h-5 flex items-center justify-center rounded-lg ${canAddMore ? 'hover:bg-[#ff4d6d]/20' : 'opacity-40 cursor-not-allowed'}`}
              >
                +
              </button>
 
            </div>
 
            {!canAddMore && (
              <span className="text-rose-300 text-[10px] font-semibold">
                Stock finished for this item
              </span>
            )}
          </div>
 
        ) : (
 
          <button
            onClick={() => {
 
              if (!isAuthenticated) {
                navigate('/auth');
                return;
              }
 
              addItem(product.id)
            }} // ✅ FIXED (API call)
            className="w-8 h-8 rounded-xl bg-[#ff4d6d] hover:bg-[#e63c5a] flex items-center justify-center transition-all hover:scale-110"
          >
            +
          </button>
 
        )}
      </div>
    </div>
  );
}
 