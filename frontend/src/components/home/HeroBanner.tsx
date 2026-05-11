import { useNavigate } from 'react-router-dom';

export default function HeroBanner() {
  const navigate = useNavigate();
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 min-h-[220px] flex items-center bg-gradient-to-r from-[#0b1a0f] to-[#0a1a10]"
      style={{ background: 'linear-gradient(135deg, #0b1a0f 0%, #0d1f12 50%, #0a1408 100%)' }}
    >
      {/* bg glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 via-transparent to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-transparent to-transparent overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80"
          alt="Groceries"
          className="absolute right-0 bottom-0 h-full w-auto object-cover opacity-80"
          style={{ filter: 'drop-shadow(-20px 0 40px rgba(0,0,0,0.8))' }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
      <div className="relative z-10 p-8 max-w-sm">
        <div className="inline-flex items-center gap-2 bg-[#ff4d6d]/10 border border-[#ff4d6d]/20 rounded-full px-3 py-1 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d6d] animate-pulse" />
          <span className="text-[#ff4d6d] text-[10px] font-semibold tracking-wider uppercase">Fastest Delivery</span>
        </div>
        <h2 className="text-3xl font-bold text-white leading-tight mb-2" style={{ fontFamily: 'Sora,sans-serif' }}>
          Fresh groceries<br />delivered in{' '}
          <span className="text-[#ff4d6d]" style={{ textShadow: '0 0 20px rgba(255,77,109,0.5)' }}>
            10 minutes
          </span>
        </h2>
        <p className="text-gray-400 text-sm mb-5">Get your daily essentials delivered instantly at your doorstep.</p>
        <div className="flex gap-3">
          <button className="btn-primary glow-pink-sm px-6 py-2.5 text-sm" style={{ borderRadius: '50px', width: 'auto' }}>
            Shop Now
          </button>
          <button className="btn-social px-5 py-2.5 text-sm border border-white/15">
            Explore Deals
          </button>
        </div>
      </div>

      {/* Feature strip */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/5 bg-black/20 backdrop-blur-sm px-6 py-2 grid grid-cols-5 gap-2">
        {[
          { icon: '⚡', text: '10 Min Delivery', sub: 'Lightning fast delivery' },
          { icon: '🚫', text: 'No Min. Order', sub: 'Order anything' },
          { icon: '🏷️', text: 'Best Prices', sub: 'Unbeatable prices' },
          { icon: '🌿', text: 'Fresh & Safe', sub: '100% quality assured' },
          { icon: '↩️', text: 'Easy Returns', sub: 'Hassle free returns' },
        ].map(f => (
          <div key={f.text} className="flex items-center gap-2">
            <span className="text-sm">{f.icon}</span>
            <div>
              <div className="text-white text-[10px] font-semibold">{f.text}</div>
              <div className="text-gray-500 text-[9px]">{f.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

