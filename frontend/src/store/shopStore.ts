
import { create } from "zustand";
import { persist } from "zustand/middleware";

const API = `${import.meta.env.VITE_API_URL}/api/v1/admin`;

export type Product = {
  id: string;
  name: string;
  pack_size: number;
  price: number;
  mrp: number;
  image: string;
  unit: string;
  discount: number;
  stock: number;
  rating: number;
  reviews_count: number;
  created_at?: string | null;
};

export type Subcategory = { id: string; name: string; products: Product[]; };
export type Category = { id: string; name: string; image: string; subcategories: Subcategory[]; products: Product[]; };

interface Store {
  categories: Category[];
  selected: string; // persisted — remembers last open category
  setSelected: (name: string) => void;
  fetchData: () => Promise<void>;
}

export const useShopStore = create<Store>()(
  persist(
    (set, get) => ({
      categories: [],
      selected: "", // will be loaded from localStorage on mount

      setSelected: (name) => set({ selected: name }),

      fetchData: async () => {
        try {
          const res = await fetch(`${API}/categories`);
          const data = await res.json();

          const formatted: Category[] = data.map((cat: any) => {
            const subcategories: Subcategory[] = (cat.subcategories || []).map((sub: any) => ({
              id: sub.id,
              name: sub.name,
              products: (sub.products || []).map((p: any) => ({
                id: p.id,
                name: p.name,
                price: p.price,
                pack_size: p.pack_size || 1, // ← default 1 not 0
                mrp: p.mrp,
                image: p.image_url || '',
                unit: p.unit || '',
                discount: p.discount || 0,
                stock: p.stock || 0,
                rating: p.rating || 0,
                reviews_count: p.reviews_count || 0,
                created_at: p.created_at || null,
              })),
            }));

            const allProducts = subcategories.flatMap(s => s.products);

            return {
              id: cat.id,
              name: cat.name,
              image: cat.image_url || '',
              subcategories,
              products: allProducts,
            };
          });

          const currentSelected = get().selected;
          // Only reset selected if it doesn't exist in new data
          const stillValid = formatted.some(c => c.name === currentSelected);

          set({
            categories: formatted,
            // Keep remembered selection if still valid, else pick first
            selected: stillValid ? currentSelected : (formatted[0]?.name || ""),
          });
        } catch (err) {
          console.error("fetchData error:", err);
        }
      },
    }),
    {
      name: 'freshcart-shop',
      partialize: (s) => ({ selected: s.selected }), // only persist selected
    }
  )
);
