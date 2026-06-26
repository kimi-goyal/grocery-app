

import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/bgimage.png";
import { useShopStore } from "../../store/shopStore";

export default function HeroBanner() {
  const navigate = useNavigate();
  const categories = useShopStore((s) => s.categories);
  const firstCategory = categories?.[0]?.name || "";

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

            <button
              onClick={() => {
                if (firstCategory) {
                  navigate(`/home?category=${encodeURIComponent(firstCategory)}`);
                } else {
                  navigate('/home');
                }
              }}
              className="btn-social px-5 py-2.5 text-sm border border-white/15">
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