// import { useState } from "react";
// import { useCartStore } from "../../store/cartStore";

// interface Product {
//   id: string; // ✅ FIXED (IMPORTANT)
//   name: string;
//   price: number;
//   pack_size: number;
//   mrp: number;
//   discount: number;
//   unit: string;
//   rating: number;
//   reviews: number;
//   image: string;
//   badge?: string;
//   inStock: boolean;
// }

// export default function ProductCard({ product }: { product: Product }) {
//   const [imgErr, setImgErr] = useState(false);

//   const { items, addItem, updateQty } = useCartStore();

//   // ✅ FIX: same type comparison
//   const cartItem = items.find((i) => i.id === product.id);

//   return (
//     <div className="glass border border-white/8 rounded-2xl p-4 flex flex-col gap-3 hover:border-white/18 transition-all hover:-translate-y-0.5 group relative">

//       {/* ✅ BADGE */}
//       {product.badge && (
//         <div className="absolute top-3 left-3 z-10 bg-[#ff4d6d]/20 border border-[#ff4d6d]/30 text-[#ff4d6d] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
//           {product.badge}
//         </div>
//       )}

//       {/* IMAGE */}
//       <div className="h-[140px] rounded-xl overflow-hidden bg-white/3 flex items-center justify-center">
//         {!imgErr ? (
//           <img
//             src={product.image}
//             alt={product.name}
//             className="w-full h-full object-cover"
//             onError={() => setImgErr(true)}
//           />
//         ) : (
//           <span className="text-5xl">{product.name.charAt(0)}</span>
//         )}
//       </div>

//       {/* INFO */}
//       <div>
//         <h4 className="text-white text-sm font-semibold truncate">
//           {product.name}
//         </h4>

//         <p className="text-gray-500 text-xs mt-0.5">
//           {product.pack_size} {product.unit}
//         </p>

//         <div className="flex items-center gap-1 mt-1">
//           <span className="text-yellow-400 text-[10px]">★</span>
//           <span className="text-gray-400 text-[10px]">
//             {product.rating} ({product.reviews})
//           </span>
//         </div>

//         {/* ✅ DISCOUNT */}
//         {product.discount > 0 && (
//           <div className="mt-1 inline-block bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
//             {Math.round(product.discount)}% OFF
//           </div>
//         )}
//       </div>

//       {/* BOTTOM */}
//       <div className="flex items-center justify-between mt-auto">

//         {/* PRICE */}
//         <div>
//           <span className="text-white font-bold text-sm">
//             ₹{product.price}
//           </span>

//           {product.mrp > product.price && (
//             <span className="text-gray-500 text-xs line-through ml-1">
//               ₹{product.mrp}
//             </span>
//           )}
//         </div>

//         {/* CART LOGIC */}
//         {!product.inStock ? (
//           <span className="text-gray-500 text-xs">Out of stock</span>

//         ) : cartItem ? (

//           <div className="flex items-center gap-2 bg-[#ff4d6d]/10 border border-[#ff4d6d]/20 rounded-xl px-2 py-1">

//             <button
//               onClick={() => updateQty(product.id, cartItem.qty - 1)}
//               className="text-[#ff4d6d] font-bold text-sm w-5 h-5 flex items-center justify-center hover:bg-[#ff4d6d]/20 rounded-lg"
//             >
//               −
//             </button>

//             <span className="text-white text-sm font-bold w-4 text-center">
//               {cartItem.qty}
//             </span>

//             <button
//               onClick={() => updateQty(product.id, cartItem.qty + 1)}
//               className="text-[#ff4d6d] font-bold text-sm w-5 h-5 flex items-center justify-center hover:bg-[#ff4d6d]/20 rounded-lg"
//             >
//               +
//             </button>

//           </div>

//         ) : (

//           <button
//             onClick={() =>
//               addItem({
//                 id: product.id, // ✅ FIXED
//                 name: product.name,
//                 price: product.price,
//                 unit: product.unit,
//                 image: product.image,
//               })
//             }
//             className="w-8 h-8 rounded-xl bg-[#ff4d6d] hover:bg-[#e63c5a] flex items-center justify-center transition-all hover:scale-110"
//           >
//             +
//           </button>

//         )}
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useCartStore } from "../../store/cartStore";

interface Product {
  id: string 
  name: string;
  price: number;
  pack_size: number;
  mrp: number;
  discount: number;
  unit: string;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  inStock: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  const [imgErr, setImgErr] = useState(false);

  const { items, addItem, updateQty } = useCartStore();

  // ✅ MATCH USING product_id (important)
 const cartItem = items.find(
  i => i.product_id === product.id 
);

  return (
    <div className="glass border border-white/8 rounded-2xl p-4 flex flex-col gap-3 hover:border-white/18 transition-all hover:-translate-y-0.5 group relative">

      {/* Badge */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-10 bg-[#ff4d6d]/20 border border-[#ff4d6d]/30 text-[#ff4d6d] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
          {product.badge}
        </div>
      )}

      {/* Image */}
      <div className="h-[140px] rounded-xl overflow-hidden bg-white/3 flex items-center justify-center">
        {!imgErr ? (
          <img
            src={product.image}
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
          {product.pack_size} {product.unit}
        </p>

        <div className="flex items-center gap-1 mt-1">
          <span className="text-yellow-400 text-[10px]">★</span>
          <span className="text-gray-400 text-[10px]">
            {product.rating} ({product.reviews})
          </span>
        </div>

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
          <span className="text-gray-500 text-xs">Out of stock</span>

        ) : cartItem ? (

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
              className="text-[#ff4d6d] font-bold text-sm w-5 h-5 flex items-center justify-center hover:bg-[#ff4d6d]/20 rounded-lg"
            >
              +
            </button>

          </div>

        ) : (

          <button
            onClick={() => addItem(product.id)} // ✅ FIXED (API call)
            className="w-8 h-8 rounded-xl bg-[#ff4d6d] hover:bg-[#e63c5a] flex items-center justify-center transition-all hover:scale-110"
          >
            +
          </button>

        )}
      </div>
    </div>
  );
}