
import { create } from "zustand";

const API = "http://localhost:8000/api/v1/admin";

export type Product = {
  id: string;
  name: string;
  price: number;
  selling_count: number;
  mrp: number;
  stock: number;
  unit: string;
  image: string;
  description: string;
  categoryId: string;
  subcategoryId: string;
  sku: string;
  active: boolean;
};

export type Subcategory = {
  id: string;
  name: string;
  categoryId: string;
  products: Product[];
  isActive: boolean;
};

export type Category = {
  id: string;
  name: string;
  image: string;
  productCount: number;
  subcategories: Subcategory[];
  isActive: boolean;
};

interface CategoryState {
  categories: Category[];
  loading: boolean;

  fetchCategories: () => Promise<void>;

  addCategory: (cat: { name: string; image: string }) => Promise<void>;
  addSubcategory: (sub: { name: string; categoryId: string }) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  deleteSubcategory: (id: string) => Promise<void>;
  toggleCategory: (id: string, isActive: boolean) => Promise<void>;
  toggleSubcategory: (id: string, isActive: boolean) => Promise<void>;

  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loading: false,

  // ✅ FETCH ALL (categories → subcategories → products)
  fetchCategories: async () => {
    set({ loading: true });

    try {
      const res = await fetch("http://localhost:8000/api/v1/admin/categories");
      const data = await res.json();

      const formatted = data.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        image: cat.image_url,
        productCount: cat.product_count,
        isActive: cat.is_active,
        subcategories: (cat.subcategories || []).map((sc: any) => ({
          id: sc.id,
          name: sc.name,
          categoryId: sc.category_id,
          isActive: sc.is_active,
          products: (sc.products || []).map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            selling_count: p.selling_count,
            mrp: p.mrp,
            stock: p.stock,
            unit: p.unit,
            image: p.image_url,
            description: p.description || "",
            categoryId: p.category_id,
            subcategoryId: p.subcategory_id,
            sku: p.sku,
            active: p.active,
          })),
        })),
      }));

      set({ categories: formatted, loading: false });
    } catch (err) {
      console.error(err);
      set({ loading: false });
    }
  },

  // ✅ CATEGORY
  addCategory: async (cat) => {
    await fetch(`${API}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: cat.name,
        image_url: cat.image,
      }),
    });

    get().fetchCategories();
  },
  deleteCategory: async (id: string) => {
    await fetch(`${API}/categories/${id}`, {
      method: "DELETE",
    });
    get().fetchCategories();
  },
  toggleCategory: async (id: string, isActive: boolean) => {
    await fetch(`${API}/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !isActive }),
    });
    get().fetchCategories();
  },

  // ✅ SUBCATEGORY
  addSubcategory: async (sub) => {
    await fetch(`${API}/subcategories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: sub.name,
        category_id: sub.categoryId,
      }),
    });

    get().fetchCategories();
  },
  deleteSubcategory: async (id: string) => {
    await fetch(`${API}/subcategories/${id}`, {
      method: "DELETE",
    });

    get().fetchCategories();
  },

  toggleSubcategory: async (id: string, isActive: boolean) => {
    await fetch(`${API}/subcategories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !isActive }),
    });
    get().fetchCategories();
  },

  // ✅ ADD PRODUCT
  addProduct: async (product) => {
    await fetch(`${API}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: product.name,
        description: product.description,
        price: product.price,
        selling_count: product.selling_count,
        mrp: product.mrp,
        stock: product.stock,
        unit: product.unit,
        sku: product.sku,
        image_url: product.image,
        category_id: product.categoryId,
        subcategory_id: product.subcategoryId,
        active: product.active,
      }),
    });

    get().fetchCategories();
  },

  // ✅ UPDATE PRODUCT
  updateProduct: async (id, data) => {
    await fetch(`${API}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        image_url: data.image,
        category_id: data.categoryId,
        subcategory_id: data.subcategoryId,
      }),
    });

    get().fetchCategories();
  },

  // ✅ DELETE PRODUCT
  deleteProduct: async (id) => {
    await fetch(`${API}/products/${id}`, {
      method: "DELETE",
    });

    get().fetchCategories();
  },
}));
