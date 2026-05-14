
import { useState } from 'react';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/home/Sidebar';
import HeroBanner from '../../components/home/HeroBanner';
import CategorySlider from '../../components/home/CategorySlider';
import ProductCard from '../../components/home/ProductCard';
import CartDrawer from '../../components/home/CartDrawer';
import CategoryDrawer from '../../components/home/CategoryDrawer';
import { FEATURED_PRODUCTS } from '../../data/homeData';
import { useAuthStore } from '../../store/authStore';

// TO FETCH REAL DATA from FastAPI:
// const [products, setProducts] = useState([]);
// useEffect(() => {
// fetch('http://localhost:8000/api/products?limit=8')
// .then(r => r.json())
// .then(data => setProducts(data.products));
// }, []);

export default function HomePage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { isAuthenticated, isGuest, user, logout } = useAuthStore();

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCategoryDrawerOpen(true);
  };

  const handleSidebarSelect = (key: string) => {
    setActiveSidebar(key);
    if (key !== 'home' && key !== 'categories') {
      handleCategorySelect(key);
    } else if (key === 'categories') {
      setCategoryDrawerOpen(true);
      setSelectedCategory('Fruits & Vegetables');
    }
  };

  return (
    <div className="min-h-screen bg-[#050816]">
      <Navbar onCartOpen={() => setCartOpen(true)} />

      <div className="flex max-w-[1400px] mx-auto">
        <Sidebar active={activeSidebar} onSelect={handleSidebarSelect} />

        {/* Main content */}
        <main className="flex-1 p-6 space-y-8 min-w-0">

          {/* Hero */}
          <div className="animate-fadeUp">
            <HeroBanner />
          </div>

          {/* Category slider */}
          <div className="animate-fadeUp delay-100">
            <CategorySlider
              onViewAll={() => { setSelectedCategory('Fruits & Vegetables'); setCategoryDrawerOpen(true); }}
              onSelect={handleCategorySelect}
            />
          </div>

          {/* Featured Products */}
          <div className="animate-fadeUp delay-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Sora,sans-serif' }}>Featured Products</h3>
              <button
                onClick={() => { setSelectedCategory('Fruits & Vegetables'); setCategoryDrawerOpen(true); }}
                className="text-[#ff4d6d] text-sm font-medium hover:text-pink-300 transition-colors flex items-center gap-1"
              >
                View all
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {FEATURED_PRODUCTS.map((p, i) => (
                <div key={p.id} className="animate-fadeUp" style={{ animationDelay: `${i * 0.04}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>

          {/* Promo banner row */}
          <div className="grid grid-cols-2 gap-4 animate-fadeUp delay-300">
            <div className="rounded-2xl border border-white/8 p-6 bg-gradient-to-br from-purple-900/20 to-[#050816] relative overflow-hidden flex flex-col gap-3">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
              <span className="text-3xl">🎁</span>
              <div>
                <h4 className="text-white font-bold text-lg" style={{ fontFamily: 'Sora,sans-serif' }}>Refer & Earn</h4>
                <p className="text-gray-400 text-sm mt-1">Invite friends and earn ₹50 cashback on every referral.</p>
              </div>
              <button className="btn-social w-fit px-5 py-2 text-sm border-purple-500/30 text-purple-300">
                Invite Friends
              </button>
            </div>
            <div className="rounded-2xl border border-[#ff4d6d]/15 p-6 bg-gradient-to-br from-[#ff4d6d]/10 to-[#050816] relative overflow-hidden flex flex-col gap-3">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff4d6d]/8 rounded-full blur-3xl" />
              <span className="text-3xl">⚡</span>
              <div>
                <h4 className="text-white font-bold text-lg" style={{ fontFamily: 'Sora,sans-serif' }}>Flash Deals</h4>
                <p className="text-gray-400 text-sm mt-1">Limited time offers. Up to 50% off on selected items.</p>
              </div>
              <button className="btn-primary glow-pink-sm w-fit px-5 py-2 text-sm" style={{ borderRadius: '50px' }}>
                Shop Now
              </button>
            </div>
          </div>

          {/* Guest CTA */}
          {isGuest && !isAuthenticated && (
            <div className="rounded-2xl border border-[#ff4d6d]/20 bg-[#ff4d6d]/5 p-6 flex items-center justify-between animate-fadeUp">
              <div>
                <h4 className="text-white font-bold" style={{ fontFamily: 'Sora,sans-serif' }}>Login to place orders & track deliveries</h4>
                <p className="text-gray-400 text-sm mt-1">Create an account and enjoy a seamless shopping experience.</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <a href="/auth" className="btn-primary glow-pink-sm px-6 py-2.5 text-sm" style={{ borderRadius: '50px', width: 'auto', display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
                  Login / Sign Up
                </a>
              </div>
            </div>
          )}

          
        </main>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <CategoryDrawer
        open={categoryDrawerOpen}
        onClose={() => setCategoryDrawerOpen(false)}
        initialCategory={selectedCategory}
      />
    </div>
  );
}
