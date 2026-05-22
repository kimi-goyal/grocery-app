
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/home/Sidebar';
import HeroBanner from '../../components/home/HeroBanner';
import CategorySlider from '../../components/home/CategorySlider';
import ProductCard from '../../components/home/ProductCard';
import CartDrawer from '../../components/home/CartDrawer';
import CategoryDrawer from '../../components/home/CategoryDrawer';
import { useAuthStore } from '../../store/authStore';
import { useShopStore } from '../../store/shopStore';
import { useCartStore } from '../../store/cartStore';

export default function HomePage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState('home');

  const { isAuthenticated, isGuest } = useAuthStore();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ✅ GLOBAL STORE
  const { categories, fetchData, setSelected } = useShopStore();
  
  const fetchCart = useCartStore((s) => s.fetchCart);

  const searchTerm = searchParams.get('search')?.trim() || '';
  const normalizedSearch = searchTerm.toLowerCase();

  useEffect(() => {
    fetchCart();  // ✅ THIS IS THE MISSING PIECE
  }, []);


  useEffect(() => {
    fetchData();
  }, []);

  // Open category drawer when navigated with ?category=Name
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelected(cat);
      setCategoryDrawerOpen(true);
    }
  }, [searchParams, setSelected]);

  // ✅ flatten all products
  const allProducts = categories.flatMap(c => c.products);

  // ✅ featured products (top 8)
  const featuredProducts = allProducts.slice(0, 8);

  const filteredProducts = searchTerm
    ? allProducts.filter((p) => p.name.toLowerCase().includes(normalizedSearch))
    : [];

  const handleCategorySelect = (cat: string) => {
    setSelected(cat); // ✅ important
    setCategoryDrawerOpen(true);
  };

  const handleSidebarSelect = (key: string) => {
    setActiveSidebar(key);
    if (key === 'offers') {
      navigate('/offers');
      return;
    }
    if (key === 'flash') {
      const defaultCategory = categories[0]?.name || '';
      handleCategorySelect(defaultCategory);
      return;
    }
    if (key !== 'home' && key !== 'categories') {
      handleCategorySelect(key);
    } else if (key === 'categories') {
      handleCategorySelect(categories[0]?.name || '');
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

          {/* ✅ Category slider (dynamic categories pass kar optionally later) */}
          <div className="animate-fadeUp delay-100">
            <CategorySlider
              onViewAll={() => handleCategorySelect(categories[0]?.name || '')}
              onSelect={handleCategorySelect}
            />
          </div>

          {searchTerm ? (
            <div className="animate-fadeUp delay-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Search results for “{searchTerm}”</h3>
                  <p className="text-gray-400 text-xs">Showing items that match your search.</p>
                </div>
                <button
                  onClick={() => navigate('/home')}
                  className="text-[#ff4d6d] text-sm font-medium hover:text-pink-300 flex gap-1"
                >
                  Clear search
                </button>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-gray-300">
                  No products found for <span className="text-white">"{searchTerm}"</span>.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map((p, i) => (
                    <div key={p.id} className="animate-fadeUp" style={{ animationDelay: `${i * 0.04}s` }}>
                      <ProductCard
                        product={{
                          id: (p.id),
                          name: p.name,
                          price: p.price,
                          mrp: p.mrp,
                          image: p.image,
                          pack_size: p.pack_size ?? 0,
                          unit: p.unit,
                          discount: p.discount,
                          badge: p.discount > 0 ? `${Math.round(p.discount)}% OFF` : "",
                          inStock: p.stock > 0,
                          rating: 4.2,
                          reviews: 120,
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="animate-fadeUp delay-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Featured Products</h3>

                <button
                  onClick={() => handleCategorySelect(categories[0]?.name || '')}
                  className="text-[#ff4d6d] text-sm font-medium hover:text-pink-300 flex gap-1"
                >
                  View all →
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {featuredProducts.map((p, i) => (
                  <div key={p.id} className="animate-fadeUp" style={{ animationDelay: `${i * 0.04}s` }}>
                    <ProductCard
                      product={{
                        id: (p.id),
                        name: p.name,
                        price: p.price,
                        mrp: p.mrp,
                        image: p.image,
                        pack_size: p.pack_size ?? 0,
                        unit: p.unit,
                        discount: p.discount,
                        badge: p.discount > 0 ? `${Math.round(p.discount)}% OFF` : "",
                        inStock: p.stock > 0,
                        rating: 4.2,
                        reviews: 120,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ✅ Guest CTA */}
          {isGuest && !isAuthenticated && (
            <div className="rounded-2xl border border-[#ff4d6d]/20 bg-[#ff4d6d]/5 p-6 flex justify-between">
              <div>
                <h4 className="text-white font-bold">
                  Login to place orders & track deliveries
                </h4>
                <p className="text-gray-400 text-sm mt-1">
                  Create an account and enjoy a seamless shopping experience.
                </p>
              </div>

              <a
                href="/auth"
                className="text-[#ff4d6d] text-sm font-medium hover:text-pink-300 flex gap-1"
              >
                Login / Sign Up
              </a>
            </div>
          )}

        </main>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <CategoryDrawer
        open={categoryDrawerOpen}
        onClose={() => setCategoryDrawerOpen(false)}
      />
    </div>
  );
}