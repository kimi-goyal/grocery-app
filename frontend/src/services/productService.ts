
import { publicApi, privateApi } from './api';

export interface ProductRec {
  id: string;
  name: string;
  price: number;
  mrp: number;
  discount: number;
  stock: number;
  unit: string;
  pack_size: number;
  image_url: string | null;
  rating: number;
  reviews_count: number;
  is_featured: boolean;
  is_bestseller: boolean;
  selling_count: number;
  cart_count: number;
  view_count: number;
  category_id: string;
  subcategory_id:string;
  tags: string;
  created_at: string | null;
  active: boolean;
}

export const productService = {
  trackView: (id: string) =>
    publicApi.post(`/products/${id}/view`).catch(() => {}),

  trackCartAdd: (id: string) =>
    publicApi.post(`/products/${id}/cart-add`).catch(() => {}),

  getSimilar: (id: string, limit = 8): Promise<ProductRec[]> =>
    publicApi.get(`/products/${id}/similar?limit=${limit}`).then(r => r.data),

  getFrequentlyBought: (id: string, limit = 4): Promise<ProductRec[]> =>
    publicApi.get(`/products/${id}/frequently-bought?limit=${limit}`).then(r => r.data),

  getRecommended: (userId?: string, limit = 12): Promise<ProductRec[]> =>
    publicApi.get(`/products/recommended?limit=${limit}${userId ? `&user_id=${userId}` : ''}`).then(r => r.data),

  getHotDeals: (limit = 12): Promise<ProductRec[]> =>
    publicApi.get(`/products/hot-deals?limit=${limit}`).then(r => r.data),

  getNewArrivals: (limit = 12): Promise<ProductRec[]> =>
    publicApi.get(`/products/new-arrivals?limit=${limit}`).then(r => r.data),
};

