import { create } from 'zustand';
import { orderService } from '../services/orderService';
import type { Order, OrderListItem, RatingPayload } from '../types/order.types';

 
interface OrderState {
  orders: OrderListItem[];
  total: number;
  page: number;
  pages: number;
  loading: boolean;
  detailCache: Record<string, Order>; // order_id → full detail
  ratingLoading: boolean;
 
  fetchOrders: (params?: { status?: string; page?: number }) => Promise<void>;
  fetchDetail: (id: string) => Promise<Order>;
  submitRating: (id: string, data: RatingPayload) => Promise<Order>;
  clearCache: () => void;
}
 
export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  total: 0,
  page: 1,
  pages: 1,
  loading: false,
  detailCache: {},
  ratingLoading: false,
 
  fetchOrders: async (params = {}) => {
    set({ loading: true });
    try {
      const res = await orderService.getMyOrders({ page: 1, limit: 10, ...params });
      set({
        orders: res.orders,
        total: res.total,
        page: res.page,
        pages: res.pages,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },
 
  fetchDetail: async (id) => {
    const cached = get().detailCache[id];
    if (cached) return cached;
 
    const order = await orderService.getOrderDetail(id);
    set(s => ({ detailCache: { ...s.detailCache, [id]: order } }));
    return order;
  },
 
  submitRating: async (id, data) => {
    set({ ratingLoading: true });
    try {
      const updated = await orderService.submitRating(id, data);
      // Update in list
      set(s => ({
        ratingLoading: false,
        orders: s.orders.map(o =>
          o.id === id
            ? { ...o, is_rated: true, overall_rating: data.overall_rating }
            : o
        ),
        detailCache: { ...s.detailCache, [id]: updated },
      }));
      return updated;
    } catch (err) {
      set({ ratingLoading: false });
      throw err;
    }
  },
 
  clearCache: () => set({ detailCache: {} }),
}));