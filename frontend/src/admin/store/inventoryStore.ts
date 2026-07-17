import { create } from "zustand";

const API = `${import.meta.env.VITE_API_URL}/api/v1/admin`;

export type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  category: string;
  subcategory: string;
  stock: number;
  unit: string;
  lowStockThreshold: number;
  price: number;
  image: string;
};

interface InventoryState {
  items: InventoryItem[];
  loading: boolean;
  fetchInventory: () => void;
  updateStock: (id: string, stock: number) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  items: [],
  loading: false,

  fetchInventory: async () => {
    set({ loading: true });

    const res = await fetch(`${API}/inventory-all`, {
      credentials: "include",
    });

    const data = await res.json();

    set({ items: data, loading: false });
  },

 
updateStock: async (id, stock) => {
  const res = await fetch(`${API}/inventory/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ stock }),
  });

  const updated = await res.json();

  set((s) => ({
    items: s.items.map((i) =>
      i.id === id ? { ...i, stock: updated.stock } : i
    ),
  }));
},

}));