

import { useEffect, useMemo, useState } from "react";
import { useShopStore } from "../../store/shopStore";
import ProductCard from "./ProductCard";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CategoryDrawer({ open, onClose }: Props) {
  const { categories, selected, setSelected, fetchData } = useShopStore();

  useEffect(() => {
    fetchData();
  }, []);

  const current = categories.find((c) => c.name === selected);
  const products = current?.products || [];
  // Sorting & filtering state
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "price-asc" | "price-desc" | "newest">("popular");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  const priceError = useMemo(() => {
    if (minPrice !== undefined && maxPrice !== undefined && maxPrice < minPrice) {
      return "Max price must be greater than or equal to Min price.";
    }
    return null;
  }, [minPrice, maxPrice]);

  const adjustInvalidPriceRange = () => {
    if (minPrice !== undefined && maxPrice !== undefined && maxPrice < minPrice) {
      setMaxPrice(minPrice);
    }
  };

  const displayedProducts = useMemo(() => {
    let list = products.slice();

    // Filter: search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p: any) => (p.name || "").toLowerCase().includes(q));
    }

    // Filter: in stock
    if (inStockOnly) {
      list = list.filter((p: any) => Number(p.stock) > 0);
    }

    // Filter: price range
    if (minPrice !== undefined) {
      list = list.filter((p: any) => Number(p.price) >= minPrice);
    }
    if (maxPrice !== undefined) {
      list = list.filter((p: any) => Number(p.price) <= maxPrice);
    }

    // Sort
    if (sortBy === "price-asc") {
      list.sort((a: any, b: any) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-desc") {
      list.sort((a: any, b: any) => Number(b.price) - Number(a.price));
    } else if (sortBy === "newest") {
      // assume higher id = newer
      list.sort((a: any, b: any) => Number(b.id) - Number(a.id));
    } else {
      // popular: try rating -> discount -> keep order
      list.sort((a: any, b: any) => {
        const ra = Number(a.rating ?? 0);
        const rb = Number(b.rating ?? 0);
        if (rb !== ra) return rb - ra;
        const da = Number(a.discount ?? 0);
        const db = Number(b.discount ?? 0);
        return db - da;
      });
    }

    return list;
  }, [products, search, sortBy, inStockOnly, minPrice, maxPrice]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full z-50 flex transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
          }`}
        style={{ width: "900px", maxWidth: "95vw" }}
      >
        {/* Category List */}
        <div className="w-[260px] bg-[#050816] border-r border-white/8 flex flex-col overflow-y-auto scrollbar-hide">
          <div className="flex items-center justify-between p-4 border-b border-white/8">
            <h3 className="text-white font-bold text-sm">Categories</h3>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-1 p-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelected(cat.name)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-left ${selected === cat.name
                    ? "bg-[#ff4d6d]/10 border border-[#ff4d6d]/20 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                {/* <span><img src={cat.image} alt={cat.name} className="w-6 h-6 object-contain" /></span> */}

                <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 bg-white/5 shrink-0">
                  <img src={cat.image || undefined} alt={cat.name} className="w-full h-full object-cover" />
                </div>


                <div>
                  <div className="text-xs font-medium">{cat.name}</div>
                  <div className="text-[10px] text-gray-500">
                    {cat.products.length} items
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Products Panel */}
        <div className="flex-1 bg-[#0b1220] overflow-y-auto scrollbar-hide">
          {/* Header + Controls */}
          <div className="p-5 border-b border-white/8 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold">{selected}</h3>
                <p className="text-gray-400 text-xs">{products.length} total • showing {displayedProducts.length}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products"
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none"
                />
                <div className="relative min-w-[130px]">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="appearance-none bg-[#0b1220] border border-white/10 rounded-xl px-3 py-2.5 pr-8 text-xs text-white focus:outline-none focus:border-[#ff4d6d]/40 transition-all">
                    <option value="popular" className="bg-[#0b1220] text-white">Sort: Popular</option>
                    <option value="price-asc" className="bg-[#0b1220] text-white">Price: Low to High</option>
                    <option value="price-desc" className="bg-[#0b1220] text-white">Price: High to Low</option>
                    <option value="newest" className="bg-[#0b1220] text-white">Newest First</option>
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-gray-400">▾</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* <label className="text-xs text-gray-300 flex items-center gap-2">
                <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} /> In stock
              </label> */}

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min Price"
                  min={0}
                  value={minPrice ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "") return setMinPrice(undefined);
                    const n = Number(v);
                    if (isNaN(n)) return setMinPrice(undefined);
                    setMinPrice(Math.max(0, n));
                  }}
                  onBlur={adjustInvalidPriceRange}
                  className="w-24 bg-white/5 border border-white/10 rounded-xl text-center px-2 py-1 text-xs text-gray-200"
                />
                <span className="text-gray-500">—</span>
                <input
                  type="number"
                  placeholder="Max Price"
                  min={0}
                  value={maxPrice ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "") return setMaxPrice(undefined);
                    const n = Number(v);
                    if (isNaN(n) || n < 0) return setMaxPrice(undefined);
                    setMaxPrice(n);
                  }}
                  onBlur={adjustInvalidPriceRange}
                  className="w-24 bg-white/5 border border-white/10 rounded-xl text-center px-2 py-1 text-xs text-gray-200"
                />
              </div>

              {priceError && (
                <p className="text-rose-300" style={{ fontSize: '0.75rem' }}>
                  {priceError}
                </p>
              )}

              <button onClick={() => { setSearch(""); setMinPrice(undefined); setMaxPrice(undefined); setInStockOnly(false); setSortBy("popular"); }} className="ml-auto text-xs text-gray-400 hover:text-white">Reset</button>
            </div>
          </div>

          {/* Products */}
          <div className="p-5">
            {displayedProducts.length === 0 ? (
              <div className="text-center text-gray-400">
                No products found
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {displayedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={{
                      id: (p.id),
                      name: p.name,
                      price: p.price,
                      pack_size: p.pack_size,
                      mrp: p.mrp,
                      image: p.image,

                      // ✅ backend fields
                      unit: p.unit,
                      discount: p.discount,
                      stock: p.stock,

                      // ✅ UI required fields
                      badge: undefined,
                      inStock: p.stock > 0,

                      // ✅ dummy extras
                      rating: 4.2,
                      reviews: 120,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}