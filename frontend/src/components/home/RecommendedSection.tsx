
import { useEffect, useState } from 'react';
import { productService,type ProductRec } from '../../services/productService';
import { useAuthStore } from '../../store/authStore';
// import { useCartStore } from '../../store/cartStore';
// import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';

interface Props {
  title?: string;
  type: 'recommended' | 'hot-deals' | 'new-arrivals';
  icon?: string;
}

export default function RecommendedSection({ title, type, icon }: Props) {
  const [products, setProducts] = useState<ProductRec[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    const fetch = type === 'recommended'
      ? productService.getRecommended(user?.id, 8)
      : type === 'hot-deals'
      ? productService.getHotDeals(12)
      : productService.getNewArrivals(12);

    fetch.then(setProducts).finally(() => setLoading(false));
  }, [type, user?.id]);

  if (!loading && products.length === 0) return null;

  const defaults: Record<string, { title: string; icon: string }> = {
    'recommended': { title: 'Recommended For You', icon: '✨' },
    'hot-deals': { title: 'Hot Deals 🔥', icon: '🔥' },
    'new-arrivals': { title: 'New Arrivals', icon: '🆕' },
  };

  const label = title || defaults[type].title;
  const emoji = icon || defaults[type].icon;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Sora,sans-serif' }}>
          <span>{emoji}</span> {label}
        </h3>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-52 bg-white/4 border border-white/6 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map(p => (
            <ProductCard
              key={p.id}
              product={{
                id: p.id,
                name: p.name,
                price: p.price,
                mrp: p.mrp,
                discount: p.discount,
                stock: p.stock,
                unit: p.unit,
                pack_size: p.pack_size,
                image: p.image_url || '',
                rating: p.rating,
                reviews_count: p.reviews_count,
                inStock: p.stock > 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

