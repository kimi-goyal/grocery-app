import { create } from "zustand";

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
      const res = await fetch("http://localhost:8000/api/v1/cart", {
        credentials: "include",
      });

      const data = await res.json();
      set({ items: Array.isArray(data) ? data : [] });

    } catch (err) {
      console.error("fetchCart error", err);
    }
  },

  // ✅ ADD ITEM
  addItem: async (product_id) => {
    await fetch("http://localhost:8000/api/v1/cart/add", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id,
        qty: 1,
      }),
    });

    await get().fetchCart();
    window.dispatchEvent(new Event("cartUpdated"));
  },

  // ✅ UPDATE QTY
  updateQty: async (product_id, qty) => {
    await fetch("http://localhost:8000/api/v1/cart/update", {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id,
        qty,
      }),
    });

    await get().fetchCart();
    window.dispatchEvent(new Event("cartUpdated"));
  },

  // ✅ REMOVE ITEM
  removeItem: async (product_id) => {
    await fetch(`http://localhost:8000/api/v1/cart/remove/${product_id}`, {
      method: "DELETE",
      credentials: "include",
    });

    await get().fetchCart();
    window.dispatchEvent(new Event("cartUpdated"));
  },

  // ✅ CLEAR CART
  clearCart: async () => {
    const items = get().items;

    await Promise.all(
      items.map((item) =>
        fetch(`http://localhost:8000/api/v1/cart/remove/${item.product_id}`, {
          method: "DELETE",
          credentials: "include",
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