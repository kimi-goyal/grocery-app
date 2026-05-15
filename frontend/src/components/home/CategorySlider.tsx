
// import { useRef } from 'react';
// import { CATEGORIES } from '../../data/homeData';

// interface Props {
//   onViewAll: () => void;
//   onSelect: (cat: string) => void;
// }

// export default function CategorySlider({ onViewAll, onSelect }: Props) {
//   const ref = useRef<HTMLDivElement>(null);

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Sora,sans-serif' }}>Shop by Categories</h3>
//         <button
//           onClick={onViewAll}
//           className="text-[#ff4d6d] text-sm font-medium hover:text-pink-300 transition-colors flex items-center gap-1"
//         >
//           View all
//           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
//         </button>
//       </div>

//       <div ref={ref} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
//         {CATEGORIES.map((cat, i) => (
//           <button
//             key={cat.id}
//             onClick={() => onSelect(cat.name)}
//             className="flex flex-col items-center gap-3 shrink-0 group animate-fadeUp"
//             style={{ animationDelay: `${i * 0.05}s` }}
//           >
//             <div
//               className="w-[80px] h-[80px] rounded-2xl border border-white/10 flex items-center justify-center text-3xl transition-all group-hover:border-white/25 group-hover:scale-105 group-hover:-translate-y-1"
//               style={{ background: `radial-gradient(circle at 30% 30%, ${cat.color}18, rgba(11,18,32,0.8))` }}
//             >
//               {cat.icon}
//             </div>
//             <div className="text-center">
//               <div className="text-white text-xs font-medium leading-tight" style={{ fontFamily: 'Sora,sans-serif', maxWidth: '80px' }}>
//                 {cat.name}
//               </div>
//               <div className="text-gray-500 text-[10px] mt-0.5">{cat.count} items</div>
//             </div>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }
import { useRef } from 'react';
import { useShopStore } from '../../store/shopStore';

interface Props {
  onViewAll: () => void;
  onSelect: (cat: string) => void;
}

export default function CategorySlider({ onViewAll, onSelect }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const { categories } = useShopStore(); // ✅ dynamic

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Shop by Categories</h3>
        <button
          onClick={onViewAll}
          className="text-[#ff4d6d] text-sm font-medium hover:text-pink-300 flex items-center gap-1"
        >
          View all →
        </button>
      </div>

      {/* Categories */}
      <div ref={ref} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {categories.map((cat, i) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.name)}
            className="flex flex-col items-center gap-3 shrink-0 group animate-fadeUp"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {/* ✅ Image instead of icon */}
            <div className="w-[90px] h-[90px] rounded-2xl overflow-hidden border border-white/10 bg-white/5 group-hover:border-white/25 group-hover:scale-105 transition-all">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
             
            </div>

            {/* ✅ Text */}
            <div className="text-center">
              <div className="text-white text-xs font-medium leading-tight max-w-[90px]">
                {cat.name}
              </div>

              <div className="text-gray-500 text-[10px] mt-0.5">
                {cat.products.length} items
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}