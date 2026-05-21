
import { useNavigate } from 'react-router-dom'; 
import { useAuthStore } from '../../store/authStore';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { skipAsGuest } = useAuthStore();

  const handleSkip = () => {
    skipAsGuest();
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center relative overflow-hidden">

      {/* Ambient glows */}
      <div className="absolute top-[-15%] left-[-5%] w-[700px] h-[700px] rounded-full bg-[#ff4d6d]/8 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-900/12 blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[#ff4d6d]/3 blur-[200px] pointer-events-none" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Main two-column layout */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center min-h-screen py-16">

        {/* LEFT: Branding + Image */}
        <div className="flex flex-col items-start gap-8 animate-fadeUp">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ff4d6d]/15 border border-[#ff4d6d]/30 flex items-center justify-center shadow-lg">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff4d6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
              Fresh<span className="text-[#ff4d6d]">Cart</span>
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-4 animate-fadeUp delay-100">
            <div className="inline-flex items-center gap-2 bg-[#ff4d6d]/10 border border-[#ff4d6d]/20 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ff4d6d] animate-pulse" />
              <span className="text-[#ff4d6d] text-xs font-semibold tracking-wider uppercase">Now delivering in your city</span>
            </div>
            <h1 className="text-5xl xl:text-6xl font-bold leading-[1.1] text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
              Fresh groceries,<br />
              delivered in{' '}
              <span
                className="text-[#ff4d6d] relative"
                style={{ textShadow: '0 0 40px rgba(255,77,109,0.4)' }}
              >
                minutes
              </span>
              .
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Get your daily essentials — fruits, vegetables, dairy & more — delivered straight to your doorstep.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4 animate-fadeUp delay-200">
            <button
              onClick={() => navigate('/auth')}
              className="btn-primary glow-pink px-10 py-4 text-base"
              style={{ borderRadius: '50px', width: 'auto', minWidth: '180px' }}
            >
              Get Started
            </button>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 group"
            >
              Skip for now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6 animate-fadeUp delay-300 pt-2">
            {[
              { icon: '⚡', value: '10 Min', label: 'Delivery' },
              { icon: '🌿', value: '100%', label: 'Fresh & Safe' },
              { icon: '↩️', value: 'Free', label: 'Easy Returns' },
              { icon: '🏷️', value: 'Best', label: 'Prices' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1 text-center">
                <div className="text-2xl">{s.icon}</div>
                <div className="text-white font-bold text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>{s.value}</div>
                <div className="text-gray-500 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Hero Image */}
        <div className="relative flex items-center justify-center animate-fadeUp delay-200">

          {/* Outer decorative ring */}
          <div className="absolute w-[480px] h-[480px] rounded-full border border-[#ff4d6d]/10" />
          <div className="absolute w-[560px] h-[560px] rounded-full border border-white/4" />

          {/* Glow blob behind image */}
          <div className="absolute w-[400px] h-[400px] rounded-full bg-[#ff4d6d]/12 blur-[80px]" />

          {/* Image container */}
          <div className="relative z-10 animate-float">
            <div
              className="w-[420px] h-[420px] rounded-full overflow-hidden border-2 border-white/10 animate-pulseGlow"
              style={{ boxShadow: '0 30px 100px rgba(0,0,0,0.6), 0 0 60px rgba(255,77,109,0.15)' }}
            >
              <img
                src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=85"
                alt="Fresh Groceries"
                className="w-full h-full object-cover"
                onError={e => {
                  const el = e.target as HTMLImageElement;
                  el.parentElement!.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#0b1220;font-size:160px;">🛒</div>';
                }}
              />
            </div>

            {/* Floating badges */}
            <div
              className="absolute -top-4 -left-8 glass border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2 shadow-xl animate-fadeUp delay-300"
            >
              <span className="text-xl">🚀</span>
              <div>
                <div className="text-white text-xs font-bold" style={{ fontFamily: 'Sora,sans-serif' }}>Express Delivery</div>
                <div className="text-gray-400 text-[10px]">In 10 minutes</div>
              </div>
            </div>

            <div
              className="absolute -bottom-0 -right-6 glass border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2 shadow-xl animate-fadeUp delay-400"
            >
              <span className="text-xl">🥦</span>
              <div>
                <div className="text-white text-xs font-bold" style={{ fontFamily: 'Sora,sans-serif' }}>100% Fresh</div>
                <div className="text-gray-400 text-[10px]">Farm to door</div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/5 py-4 px-8 flex items-center justify-between">
        <p className="text-gray-600 text-xs">© 2025 FreshCart. All rights reserved.</p>
        <div className="flex items-center gap-6">
          {['Privacy Policy', 'Terms', 'Support'].map(l => (
            <button key={l} className="text-gray-600 hover:text-gray-400 text-xs transition-colors">{l}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
