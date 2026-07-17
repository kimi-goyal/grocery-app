import { create } from "zustand";

const API = `${import.meta.env.VITE_API_URL}/api/v1/admin`;

export type OrderStatus =
  | "Pending"
  | "Packed"
  | "On the Way"
  | "Delivered"
  | "Cancelled";

export type Order = {
  id: string;
  customer: string;
  phone: string;
  amount: number;
  status: OrderStatus;
  date: string;
  items: number;
};

interface OrderState {
  orders: Order[];
  loading: boolean;
  fetchOrders: () => Promise<void>;
  updateStatus: (id: string, status: OrderStatus) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  loading: false,

  fetchOrders: async () => {
    set({ loading: true });
    try {
      const res = await fetch(`${API}`, {
        credentials: "include", // ✅ important for cookies
      });
      const data = await res.json();
      set({ orders: data, loading: false });
    } catch (e) {
      console.error(e);
      set({ loading: false });
    }
  },

  updateStatus: async (id, status) => {
    try {
      await fetch(`${API}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });

      // ✅ optimistic update
      set((s) => ({
        orders: s.orders.map((o) =>
          o.id === id ? { ...o, status } : o
        ),
      }));
    } catch (e) {
      console.error(e);
    }
  },
}));