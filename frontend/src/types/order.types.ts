export type OrderStatus =
  | 'Pending'
  | 'Packed'
  | 'On the Way'
  | 'Delivered'
  | 'Cancelled';
 
export interface OrderItem {
  id: string;
  product_id: string | null;
  name: string;
  price: number;
  quantity: number;
  unit: string | null;
  image_url: string | null;
  item_rating: number | null;
}
 
export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  total_amount: number;
  status: OrderStatus;
  coupon_code: string | null;
  discount_amount: number;
  delivery_fee: number;
  payment_method: string;
  payment_id: string | null;
  estimated_time: string | null;
  items: OrderItem[];
  items_count: number;
  is_rated: boolean;
  overall_rating: number | null;
  delivery_rating: number | null;
  quality_rating: number | null;
  packaging_rating: number | null;
  review_text: string | null;
  rated_at: string | null;
  created_at: string;
  updated_at: string | null;
}
 
export interface OrderListItem {
  id: string;
  order_number: string;
  total_amount: number;
  status: OrderStatus;
  items_count: number;
  payment_method: string;
  is_rated: boolean;
  overall_rating: number | null;
  created_at: string;
  items_preview: OrderItem[];
}
 
export interface RatingPayload {
  overall_rating: number;
  delivery_rating?: number;
  quality_rating?: number;
  packaging_rating?: number;
  review_text?: string;
  item_ratings?: Record<string, number>;
}
 