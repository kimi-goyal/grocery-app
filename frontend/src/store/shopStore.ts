import { create } from "zustand";

const API = "http://localhost:8000/api/v1/admin";

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
};

export type Category = {
  id: string;
  name: string;
  image: string;
  products: Product[];
};

interface Store {
  categories: Category[];
  selected: string;

  setSelected: (name: string) => void;
  fetchData: () => Promise<void>;
}

export const useShopStore = create<Store>((set) => ({
  categories: [],
  selected: "",

  setSelected: (name) => set({ selected: name }),

  fetchData: async () => {
    try {
      const res = await fetch(`${API}/categories`);
      const data = await res.json();

      const formatted = data.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        image: cat.image_url,

        // ✅ flatten products from subcategories
        products: (cat.subcategories || []).flatMap((sub: any) =>
          (sub.products || []).map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            pack_size: p.pack_size,
            mrp: p.mrp,
            image: p.image_url,
            unit: p.unit,
            discount: p.discount,
            stock: p.stock,
          }))
        ),
      }));

      set({
        categories: formatted,
        selected: formatted[0]?.name || "",
      });

    } catch (err) {
      console.error("Fetch categories error:", err);
    }
  },
}));

