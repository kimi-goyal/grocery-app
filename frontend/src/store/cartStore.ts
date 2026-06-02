import { create } from "zustand";
import { privateApi } from "../services/api";

type CartItem = {
  id: number;
  product_id: string;
  qty: number;

  // optional UI fields (backend se aa sakte)
  name: string;
  price: number;
  image?: string;
  unit?: string;
};

type CartState = {
  items: CartItem[];

  fetchCart: () => Promise<void>;
  addItem: (product_id: string) => Promise<void>;
  updateQty: (product_id: string, qty: number) => Promise<void>;
  removeItem: (product_id: string) => Promise<void>;
  clearCart: () => Promise<void>;

  totalPrice: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  // ✅ FETCH CART
  fetchCart: async () => {
    try {
      const res = await privateApi.get("/cart");
      const data = res.data;
      set({ items: Array.isArray(data) ? data : [] });

    } catch (err) {
      console.error("fetchCart error", err);
    }
  },

  // ✅ ADD ITEM
  addItem: async (product_id) => {
    try {
      await privateApi.post("/cart/add", { product_id, qty: 1 });
    } catch (err) {
      console.error("addItem error", err);
      throw err;
    }

    await get().fetchCart();
    window.dispatchEvent(new Event("cartUpdated"));
  },

  // ✅ UPDATE QTY
  updateQty: async (product_id, qty) => {
    try {
      await privateApi.patch("/cart/update", { product_id, qty });
    } catch (err) {
      console.error("updateQty error", err);
      throw err;
    }

    await get().fetchCart();
    window.dispatchEvent(new Event("cartUpdated"));
  },

  // ✅ REMOVE ITEM
  removeItem: async (product_id) => {
    try {
      await privateApi.delete(`/cart/remove/${product_id}`);
    } catch (err) {
      console.error("removeItem error", err);
      throw err;
    }

    await get().fetchCart();
    window.dispatchEvent(new Event("cartUpdated"));
  },

  // ✅ CLEAR CART
  clearCart: async () => {
    const items = get().items;

    await Promise.all(
      items.map((item) =>
        privateApi.delete(`/cart/remove/${item.product_id}`).catch((err) => {
          console.error("clearCart item remove error", err);
          // continue removing other items even if one fails
        })
      )
    );

    set({ items: [] });
    window.dispatchEvent(new Event("cartUpdated"));
  },

  // ✅ TOTAL PRICE
  totalPrice: () => {
    return get().items.reduce((total, item) => {
      return total + (item.price || 0) * item.qty;
    }, 0);
  },
}));