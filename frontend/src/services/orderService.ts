import { privateApi } from './api';
import type { Order, OrderListItem, RatingPayload } from '../types/order.types';
 
interface PaginatedOrders {
  orders: OrderListItem[];
  total: number;
  page: number;
  pages: number;
}
 
export const orderService = {
  getMyOrders: (params: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedOrders> =>
    privateApi.get('/orders/my', { params }).then(r => r.data),
 
  getOrderDetail: (id: string): Promise<Order> =>
    privateApi.get(`/orders/my/${id}`).then(r => r.data),
 
  submitRating: (id: string, data: RatingPayload): Promise<Order> =>
    privateApi.post(`/orders/my/${id}/rate`, data).then(r => r.data),
};
 