
import { create } from 'zustand'; 
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  unit: string;
  image: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find(i => i.id === item.id);
        if (existing) {
          set(s => ({ items: s.items.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) }));
        } else {
          set(s => ({ items: [...s.items, { ...item, qty: 1 }] }));
        }
      },
      removeItem: (id) => set(s => ({ items: s.items.filter(i => i.id !== id) })),
      updateQty: (id, qty) => {
        if (qty <= 0) {
          set(s => ({ items: s.items.filter(i => i.id !== id) }));
        } else {
          set(s => ({ items: s.items.map(i => i.id === id ? { ...i, qty } : i) }));
        }
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((s, i) => s + i.qty, 0),
      totalPrice: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
    }),
    { name: 'freshcart-cart' }
  )
);
