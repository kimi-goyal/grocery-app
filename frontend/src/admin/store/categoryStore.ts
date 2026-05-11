

import { create } from 'zustand';
import { MOCK_CATEGORIES } from '../data/mockData';

export type Product = { id: string; name: string; price: number; mrp: number; stock: number; unit: string; image: string; description: string; categoryId: string; subcategoryId: string; sku: string; active: boolean; };
export type Subcategory = { id: string; name: string; categoryId: string; products: Product[]; };
export type Category = { id: string; name: string; image: string; productCount: number; subcategories: Subcategory[]; };

interface CategoryState {
  categories: Category[];
  loading: boolean;
  fetchCategories: () => void;
  addCategory: (cat: Omit<Category, 'id' | 'productCount' | 'subcategories'>) => void;
  addSubcategory: (sub: Omit<Subcategory, 'id' | 'products'>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: MOCK_CATEGORIES as Category[],
  loading: false,
  fetchCategories: () => {
    // Future: GET /api/admin/categories -> set categories into store
    set({ loading: true });
    setTimeout(() => set({ categories: MOCK_CATEGORIES as Category[], loading: false }), 300);
  },
  addCategory: (cat) => {
    // Future: POST /api/admin/categories, then optimistically update store
    const newCat: Category = { ...cat, id: `c${Date.now()}`, productCount: 0, subcategories: [] };
    set(s => ({ categories: [...s.categories, newCat] }));
  },
  addSubcategory: (sub) => {
    // Future: POST /api/admin/subcategories, sync store after response
    const newSub: Subcategory = { ...sub, id: `sc${Date.now()}`, products: [] };
    set(s => ({ categories: s.categories.map(c => c.id === sub.categoryId ? { ...c, subcategories: [...c.subcategories, newSub] } : c) }));
  },
  addProduct: (product) => {
    // Future: POST /api/admin/products, optimistic update then revalidate
    const newProd: Product = { ...product, id: `p${Date.now()}` };
    set(s => ({ categories: s.categories.map(c => c.id === product.categoryId ? { ...c, subcategories: c.subcategories.map(sc => sc.id === product.subcategoryId ? { ...sc, products: [...sc.products, newProd] } : sc) } : c) }));
  },
  updateProduct: (id, data) => {
    // Future: PUT /api/admin/products/:id, sync Zustand after success
    set(s => ({ categories: s.categories.map(c => ({ ...c, subcategories: c.subcategories.map(sc => ({ ...sc, products: sc.products.map(p => p.id === id ? { ...p, ...data } : p) })) })) }));
  },
  deleteProduct: (id) => {
    // Future: DELETE /api/admin/products/:id, remove from store optimistically
    set(s => ({ categories: s.categories.map(c => ({ ...c, subcategories: c.subcategories.map(sc => ({ ...sc, products: sc.products.filter(p => p.id !== id) })) })) }));
  },
}));
