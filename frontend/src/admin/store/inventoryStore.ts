
import { create } from 'zustand';
import { MOCK_INVENTORY } from '../data/mockData';

export type InventoryItem = { id: string; name: string; sku: string; category: string; subcategory: string; stock: number; unit: string; lowStockThreshold: number; price: number; image: string; };

interface InventoryState {
  items: InventoryItem[];
  loading: boolean;
  fetchInventory: () => void;
  updateStock: (id: string, stock: number) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  items: MOCK_INVENTORY,
  loading: false,
  fetchInventory: () => {
    // Future: GET /api/admin/inventory -> populate store, poll every 60s
    set({ loading: true });
    setTimeout(() => set({ items: MOCK_INVENTORY, loading: false }), 300);
  },
  updateStock: (id, stock) => {
    // Future: PATCH /api/admin/inventory/:id, sync store
    set(s => ({ items: s.items.map(i => i.id === id ? { ...i, stock } : i) }));
  },
}));
