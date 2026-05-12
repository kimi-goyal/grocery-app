// import { useNavigate } from 'react-router-dom';

// export default function HeroBanner() {
//   const navigate = useNavigate();
//   return (
//     <div className="relative rounded-2xl overflow-hidden border border-white/10 min-h-[220px] flex items-center bg-gradient-to-r from-[#0b1a0f] to-[#0a1a10]"
//       style={{ background: 'linear-gradient(135deg, #0b1a0f 0%, #0d1f12 50%, #0a1408 100%)' }}
//     >
//       {/* bg glow */}
//       <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 via-transparent to-transparent" />
//       <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-transparent to-transparent overflow-hidden">
//         <img
//           src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80"
//           alt="Groceries"
//           className="absolute right-0 bottom-0 h-full w-auto object-cover opacity-80"
//           style={{ filter: 'drop-shadow(-20px 0 40px rgba(0,0,0,0.8))' }}
//           onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
//         />
//       </div>
//       <div className="relative z-10 p-8 max-w-sm">
//         <div className="inline-flex items-center gap-2 bg-[#ff4d6d]/10 border border-[#ff4d6d]/20 rounded-full px-3 py-1 mb-4">
//           <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d6d] animate-pulse" />
//           <span className="text-[#ff4d6d] text-[10px] font-semibold tracking-wider uppercase">Fastest Delivery</span>
//         </div>
//         <h2 className="text-3xl font-bold text-white leading-tight mb-2" style={{ fontFamily: 'Sora,sans-serif' }}>
//           Fresh groceries<br />delivered in{' '}
//           <span className="text-[#ff4d6d]" style={{ textShadow: '0 0 20px rgba(255,77,109,0.5)' }}>
//             10 minutes
//           </span>
//         </h2>
//         <p className="text-gray-400 text-sm mb-5">Get your daily essentials delivered instantly at your doorstep.</p>
//         <div className="flex gap-3">
//           <button className="btn-primary glow-pink-sm px-6 py-2.5 text-sm" style={{ borderRadius: '50px', width: 'auto' }}>
//             Shop Now
//           </button>
//           <button className="btn-social px-5 py-2.5 text-sm border border-white/15">
//             Explore Deals
//           </button>
//         </div>
//       </div>

//       {/* Feature strip */}
//       <div className="absolute bottom-0 left-0 right-0 border-t border-white/5 bg-black/20 backdrop-blur-sm px-6 py-2 grid grid-cols-5 gap-2">
//         {[
//           { icon: '⚡', text: '10 Min Delivery', sub: 'Lightning fast delivery' },
//           { icon: '🚫', text: 'No Min. Order', sub: 'Order anything' },
//           { icon: '🏷️', text: 'Best Prices', sub: 'Unbeatable prices' },
//           { icon: '🌿', text: 'Fresh & Safe', sub: '100% quality assured' },
//           { icon: '↩️', text: 'Easy Returns', sub: 'Hassle free returns' },
//         ].map(f => (
//           <div key={f.text} className="flex items-center gap-2">
//             <span className="text-sm">{f.icon}</span>
//             <div>
//               <div className="text-white text-[10px] font-semibold">{f.text}</div>
//               <div className="text-gray-500 text-[9px]">{f.sub}</div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/bgimage.png";

export default function HeroBanner() {
  const navigate = useNavigate();

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#081c14]">

      {/* MAIN HERO */}
      <div className="relative flex items-center px-8 py-10 min-h-[260px]">

        {/* gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b2a1d] via-[#103a2a] to-[#0b2a1d]" />

      
      

        {/* left content */}
        <div className="relative z-10 max-w-lg">
          <h2
            className="text-4xl font-bold text-white leading-tight"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
           <span className="p-y-5">Fresh groceries </span><br />
           <span> delivered in{" "}</span><br />
            <span className="text-[#ff4d6d] font-semibold">
              10 minutes
            </span>
          </h2>

          <p className="text-gray-400 mt-3 text-sm">
            Get your daily essentials delivered instantly at your doorstep.
          </p>

          <div className="flex gap-3 mt-5">
            <button
              onClick={() => navigate("/")}
              className="btn-primary glow-pink-sm px-6 py-2.5 text-sm"
              style={{ borderRadius: "20px" , width: "35%"}}
            >
              Shop Now
            </button>

            <button className="btn-social px-5 py-2.5 text-sm border border-white/15">
              Explore Deals
            </button>
          </div>
        </div>
          {/* right image */}
        <img src={bgImage} alt="" className="absolute right-0 top-0 h-full object-cover" />

      </div>

        
      {/* ✅ RIBBON / FEATURE STRIP (exact style like image) */}
      <div className="flex justify-between items-center px-6 py-3 border-t border-white/10 bg-[#061710]">

        {[
          { icon: "⚡", title: "10 Min Delivery", sub: "Lightning fast delivery" },
          { icon: "🛒", title: "No Min. Order", sub: "Order anything" },
          { icon: "🏷️", title: "Best Prices", sub: "Unbeatable prices" },
          { icon: "✅", title: "Fresh & Safe", sub: "100% quality assured" },
          { icon: "↩️", title: "Easy Returns", sub: "Hassle free returns" },
        ].map((item) => (
          <div key={item.title} className="flex items-center gap-2">
            <span className="text-lg">{item.icon}</span>
            <div className="leading-tight">
              <div className="text-white text-[11px] font-semibold">
                {item.title}
              </div>
              <div className="text-gray-500 text-[10px]">
                {item.sub}
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}