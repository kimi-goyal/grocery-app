// DUMMY DATA — replace with API calls to http://localhost:8000

export const CATEGORIES = [
  { id: 1, name: 'Fruits & Vegetables', icon: '🥦', color: '#22c55e', count: 120 },
  { id: 2, name: 'Dairy & Eggs', icon: '🥛', color: '#facc15', count: 85 },
  { id: 3, name: 'Snacks & Munchies', icon: '🍿', color: '#f97316', count: 200 },
  { id: 4, name: 'Beverages', icon: '🧃', color: '#3b82f6', count: 95 },
  { id: 5, name: 'Personal Care', icon: '🧴', color: '#a78bfa', count: 140 },
  { id: 6, name: 'Household', icon: '🧹', color: '#06b6d4', count: 110 },
  { id: 7, name: 'Baby Care', icon: '🍼', color: '#f43f5e', count: 60 },
  { id: 8, name: 'Meat & Seafood', icon: '🥩', color: '#ef4444', count: 75 },
];

export const FEATURED_PRODUCTS = [
  { id: 1, name: 'Red Apples', category: 'Fruits & Vegetables', price: 120, mrp: 150, discount: 20, unit: '1 kg', rating: 4.6, reviews: 128, image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=200&q=80', badge: 'Fresh', inStock: true },
  { id: 2, name: 'Amul Full Cream Milk', category: 'Dairy & Eggs', price: 56, mrp: 60, discount: 7, unit: '1 L', rating: 4.8, reviews: 340, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&q=80', badge: 'Best Seller', inStock: true },
  { id: 3, name: 'Banana', category: 'Fruits & Vegetables', price: 60, mrp: 70, discount: 14, unit: '1 Dozen', rating: 4.5, reviews: 89, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&q=80', badge: '', inStock: true },
  { id: 4, name: 'Lay\'s Classic Salted', category: 'Snacks & Munchies', price: 20, mrp: 20, discount: 0, unit: '52g', rating: 4.3, reviews: 512, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&q=80', badge: '', inStock: true },
  { id: 5, name: 'Tropicana Orange', category: 'Beverages', price: 99, mrp: 120, discount: 18, unit: '1 L', rating: 4.4, reviews: 201, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&q=80', badge: 'Sale', inStock: true },
  { id: 6, name: 'Brown Eggs', category: 'Dairy & Eggs', price: 85, mrp: 90, discount: 6, unit: '6 pcs', rating: 4.7, reviews: 175, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&q=80', badge: 'Farm Fresh', inStock: true },
  { id: 7, name: 'Spinach Leaves', category: 'Fruits & Vegetables', price: 30, mrp: 40, discount: 25, unit: '250g', rating: 4.2, reviews: 67, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&q=80', badge: 'Organic', inStock: true },
  { id: 8, name: 'Whole Wheat Bread', category: 'Snacks & Munchies', price: 45, mrp: 50, discount: 10, unit: '400g', rating: 4.5, reviews: 290, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80', badge: '', inStock: false },
];

export const CATEGORY_PRODUCTS: Record<string, typeof FEATURED_PRODUCTS> = {
  'Fruits & Vegetables': [
    { id: 1, name: 'Red Apples', category: 'Fruits & Vegetables', price: 120, mrp: 150, discount: 20, unit: '1 kg', rating: 4.6, reviews: 128, image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=200&q=80', badge: 'Fresh', inStock: true },
    { id: 3, name: 'Banana', category: 'Fruits & Vegetables', price: 60, mrp: 70, discount: 14, unit: '1 Dozen', rating: 4.5, reviews: 89, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&q=80', badge: '', inStock: true },
    { id: 7, name: 'Spinach Leaves', category: 'Fruits & Vegetables', price: 30, mrp: 40, discount: 25, unit: '250g', rating: 4.2, reviews: 67, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&q=80', badge: 'Organic', inStock: true },
    { id: 9, name: 'Tomatoes', category: 'Fruits & Vegetables', price: 40, mrp: 50, discount: 20, unit: '500g', rating: 4.3, reviews: 145, image: 'https://images.unsplash.com/photo-1546094096-0df4bcaad337?w=200&q=80', badge: '', inStock: true },
    { id: 10, name: 'Carrots', category: 'Fruits & Vegetables', price: 35, mrp: 40, discount: 13, unit: '500g', rating: 4.4, reviews: 98, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200&q=80', badge: '', inStock: true },
    { id: 11, name: 'Mangoes', category: 'Fruits & Vegetables', price: 199, mrp: 250, discount: 20, unit: '1 kg', rating: 4.8, reviews: 310, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=200&q=80', badge: 'Season', inStock: true },
  ],
  'Dairy & Eggs': [
    { id: 2, name: 'Amul Full Cream Milk', category: 'Dairy & Eggs', price: 56, mrp: 60, discount: 7, unit: '1 L', rating: 4.8, reviews: 340, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&q=80', badge: 'Best Seller', inStock: true },
    { id: 6, name: 'Brown Eggs', category: 'Dairy & Eggs', price: 85, mrp: 90, discount: 6, unit: '6 pcs', rating: 4.7, reviews: 175, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&q=80', badge: 'Farm Fresh', inStock: true },
    { id: 12, name: 'Amul Butter', category: 'Dairy & Eggs', price: 55, mrp: 60, discount: 8, unit: '100g', rating: 4.6, reviews: 420, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=200&q=80', badge: '', inStock: true },
  ],
  'Snacks & Munchies': [
    { id: 4, name: "Lay's Classic Salted", category: 'Snacks & Munchies', price: 20, mrp: 20, discount: 0, unit: '52g', rating: 4.3, reviews: 512, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&q=80', badge: '', inStock: true },
    { id: 8, name: 'Whole Wheat Bread', category: 'Snacks & Munchies', price: 45, mrp: 50, discount: 10, unit: '400g', rating: 4.5, reviews: 290, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80', badge: '', inStock: false },
  ],
  'Beverages': [
    { id: 5, name: 'Tropicana Orange', category: 'Beverages', price: 99, mrp: 120, discount: 18, unit: '1 L', rating: 4.4, reviews: 201, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&q=80', badge: 'Sale', inStock: true },
  ],
  'Personal Care': [],
  'Household': [],
  'Baby Care': [],
  'Meat & Seafood': [],
};

