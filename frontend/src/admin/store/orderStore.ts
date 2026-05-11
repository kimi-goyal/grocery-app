

import { create } from 'zustand';
import { MOCK_ORDERS } from '../data/mockData';

export type OrderStatus = 'Pending' | 'Packed' | 'On the Way' | 'Delivered' | 'Cancelled';
export type Order = { id: string; customer: string; email: string; phone: string; amount: number; status: OrderStatus; date: string; items: number; address: string; };

interface OrderState {
  orders: Order[];
  loading: boolean;
  fetchOrders: () => void;
  updateStatus: (id: string, status: OrderStatus) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: MOCK_ORDERS as Order[],
  loading: false,
  fetchOrders: () => {
    // Future: GET /api/admin/orders?page=1&limit=50, paginate store
    set({ loading: true });
    setTimeout(() => set({ orders: MOCK_ORDERS as Order[], loading: false }), 300);
  },
  updateStatus: (id, status) => {
    // Future: PATCH /api/admin/orders/:id/status, optimistic update + toast
    set(s => ({ orders: s.orders.map(o => o.id === id ? { ...o, status } : o) }));
  },
}));

