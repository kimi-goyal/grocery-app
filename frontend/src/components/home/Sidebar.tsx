
// import { CATEGORIES } from '../../data/homeData';

// interface Props {
//   active: string;
//   onSelect: (cat: string) => void;
// }

// export default function Sidebar({ active, onSelect }: Props) {
//   const navLinks = [
//     { icon: '🏠', label: 'Home', key: 'home' },
//     { icon: '📋', label: 'Categories', key: 'categories' },
//     ...CATEGORIES.map(c => ({ icon: c.icon, label: c.name, key: c.name })),
//     { icon: '🏷️', label: 'Best Offers', key: 'offers', badge: 'Hot' },
//     { icon: '⚡', label: 'Flash Deals', key: 'flash', badge: 'New' },
//   ];

//   return (
//     <aside className="w-[220px] shrink-0 hidden lg:flex flex-col border-r border-white/8 bg-[#050816] pt-4 min-h-[calc(100vh-64px)] sticky top-16">
//       {/* First Order Banner */}
//       <div className="mx-3 mb-4 rounded-2xl p-4 border border-[#ff4d6d]/20 bg-gradient-to-br from-[#ff4d6d]/10 to-transparent relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-16 h-16 bg-[#ff4d6d]/10 rounded-bl-3xl" />
//         <div className="text-[#ff4d6d] font-bold text-lg" style={{ fontFamily: 'Sora,sans-serif' }}>Flat 20% OFF</div>
//         <div className="text-gray-300 text-xs mt-0.5">On Your First Order</div>
//         <div className="mt-2 bg-[#ff4d6d]/15 border border-[#ff4d6d]/30 rounded-lg px-2 py-1 text-[10px] font-mono text-[#ff4d6d] tracking-widest w-fit">
//           USE CODE: FIRST20
//         </div>
//       </div>

//       <nav className="flex flex-col gap-0.5 px-2 overflow-y-auto scrollbar-hide pb-8">
//         {navLinks.map(item => (
//           <button
//             key={item.key}
//             onClick={() => onSelect(item.key)}
//             className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${
//               active === item.key
//                 ? 'bg-[#ff4d6d]/10 text-white border border-[#ff4d6d]/20'
//                 : 'text-gray-400 hover:text-white hover:bg-white/5'
//             }`}
//           >
//             <div className="flex items-center gap-3">
//               <span className="text-base">{item.icon}</span>
//               <span className="font-medium" style={{ fontFamily: active === item.key ? 'Sora,sans-serif' : 'DM Sans,sans-serif' }}>
//                 {item.label}
//               </span>
//             </div>
//             {(item as any).badge && (
//               <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${(item as any).badge === 'Hot' ? 'bg-[#ff4d6d]/20 text-[#ff4d6d]' : 'bg-green-500/20 text-green-400'}`}>
//                 {(item as any).badge}
//               </span>
//             )}
//           </button>
//         ))}
//       </nav>
//     </aside>
//   );
// }

import { useEffect } from "react";
import { useCouponStore } from "../../store/couponStore";
import { useAuthStore } from "../../store/authStore";
import { useShopStore } from "../../store/shopStore";

interface Props {
  active: string;
  onSelect: (cat: string) => void;
}

export default function Sidebar({ active, onSelect }: Props) {
  const categories = useShopStore(state => state.categories);
  const { coupons, fetchCoupons } = useCouponStore();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  type NavItem = {
    label: string;
    key: string;
    image?: string;
    icon?: string;
    badge?: string;
  };
  // const navLinks = [
  //   { label: "Home", key: "home" },
  //   { label: "Categories", key: "categories" },

  //   // ✅ dynamic categories
  //   ...categories.map(c => ({
  //     label: c.name,
  //     key: c.name,
  //     image: c.image,
  //   })),

  //   { label: "Best Offers", key: "offers", badge: "Hot" },
  //   { label: "Flash Deals", key: "flash", badge: "New" },
  // ];
  const navLinks: NavItem[] = [
    { label: "Home", key: "home", icon: "🏠" },
    { label: "Categories", key: "categories", icon: "📋" },

    ...categories.map(c => ({
      label: c.name,
      key: c.name,
      image: c.image,
    })),

    { label: "Best Offers", key: "offers", icon: "🏷️", badge: "Hot" },
    { label: "Flash Deals", key: "flash", icon: "⚡", badge: "New" },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchCoupons().catch(() => {});
    }
  }, [isAuthenticated, fetchCoupons]);

  return (
    <aside className="w-[220px] shrink-0 hidden lg:flex flex-col border-r border-white/8 bg-[#050816] pt-4 min-h-[calc(100vh-64px)] fixed left-0 top-16 h-[calc(100vh-64px)] overflow-y-auto">
     {coupons.length > 0 && (<div className="mx-3 mb-4 rounded-2xl p-4 border border-[#ff4d6d]/20 bg-gradient-to-br from-[#ff4d6d]/10 to-transparent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-[#ff4d6d]/10 rounded-bl-3xl" />
        <div className="text-[#ff4d6d] font-bold text-lg">{coupons[0]?.title }</div>
        <div className="text-gray-300 text-xs mt-0.5">{coupons[0]?.description }</div>
        <div className="mt-2 bg-[#ff4d6d]/15 border border-[#ff4d6d]/30 rounded-lg px-2 py-1 text-[10px] font-mono text-[#ff4d6d] tracking-widest w-fit">
          USE CODE: {coupons[0]?.code }
        </div>
      </div>)}
      {/* Coupon banner */}
      

      <nav className="flex flex-col gap-0.5 px-2 overflow-y-auto pb-8">

        {navLinks.map(item => (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${active === item.key
                ? "bg-[#ff4d6d]/10 text-white border border-[#ff4d6d]/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
          >

            <div className="flex items-center gap-3">

               {/* ✅ show category image if available */}
              {/* {item.image ? (
               
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 bg-white/5 shrink-0">
                  <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
                </div>
              ) : (
                <span className="text-base">{item.icon}</span>
              )}  */}

              <span className="font-medium">
                {item.label}
              </span>
            </div>

            {/* badge */}
            {(item as any).badge && (
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${(item as any).badge === "Hot"
                  ? "bg-[#ff4d6d]/20 text-[#ff4d6d]"
                  : "bg-green-500/20 text-green-400"
                }`}>
                {(item as any).badge}
              </span>
            )}

          </button>
        ))}

      </nav>
    </aside>
  );
}