export const MOCK_ADMIN = { email: 'admin@freshcart.com', password: 'admin123', name: 'Admin', role: 'admin' }; 

export const MOCK_STATS = {
  totalOrders: 1250, totalOrdersDelta: 12.5,
  totalRevenue: 245000, totalRevenueDelta: 8.2,
  totalCustomers: 3820, totalCustomersDelta: 15.7,
  lowStockItems: 18,
};

export const MOCK_SALES_DATA = [
  { day: 'Mon', revenue: 18000 }, { day: 'Tue', revenue: 22000 },
  { day: 'Wed', revenue: 19500 }, { day: 'Thu', revenue: 24000 },
  { day: 'Fri', revenue: 24500 }, { day: 'Sat', revenue: 32000 },
  { day: 'Sun', revenue: 28000 },
];

export const MOCK_CATEGORIES = [
  { id: 'c1', name: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&q=80', productCount: 120, subcategories: [
    { id: 'sc1', name: 'Apples', categoryId: 'c1', products: [
      { id: 'p1', name: 'Red Apple', price: 120, mrp: 150, stock: 200, unit: '1kg', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=200&q=80', description: 'Fresh red apples from Himachal', categoryId: 'c1', subcategoryId: 'sc1', sku: 'APP-RED-001', active: true },
      { id: 'p2', name: 'Green Apple', price: 140, mrp: 170, stock: 5, unit: '1kg', image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=200&q=80', description: 'Crisp green apples', categoryId: 'c1', subcategoryId: 'sc1', sku: 'APP-GRN-002', active: true },
    ]},
    { id: 'sc2', name: 'Tomatoes', categoryId: 'c1', products: [
      { id: 'p3', name: 'Cherry Tomato', price: 60, mrp: 75, stock: 150, unit: '250g', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaad337?w=200&q=80', description: 'Sweet cherry tomatoes', categoryId: 'c1', subcategoryId: 'sc2', sku: 'TOM-CHR-003', active: true },
    ]},
  ]},
  { id: 'c2', name: 'Dairy & Eggs', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&q=80', productCount: 85, subcategories: [
    { id: 'sc3', name: 'Milk', categoryId: 'c2', products: [
      { id: 'p4', name: 'Amul Full Cream Milk', price: 56, mrp: 60, stock: 300, unit: '1L', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&q=80', description: 'Rich and creamy full cream milk', categoryId: 'c2', subcategoryId: 'sc3', sku: 'MLK-AMU-001', active: true },
      { id: 'p5', name: 'Vita Skimmed Milk', price: 48, mrp: 55, stock: 8, unit: '1L', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&q=80', description: 'Low fat skimmed milk', categoryId: 'c2', subcategoryId: 'sc3', sku: 'MLK-VIT-002', active: true },
    ]},
    { id: 'sc4', name: 'Eggs', categoryId: 'c2', products: [
      { id: 'p6', name: 'Brown Eggs', price: 85, mrp: 90, stock: 200, unit: '6 pcs', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&q=80', description: 'Farm fresh brown eggs', categoryId: 'c2', subcategoryId: 'sc4', sku: 'EGG-BRN-001', active: true },
    ]},
  ]},
  { id: 'c3', name: 'Snacks & Munchies', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&q=80', productCount: 200, subcategories: [
    { id: 'sc5', name: 'Chips', categoryId: 'c3', products: [
      { id: 'p7', name: "Lay's Classic Salted", price: 20, mrp: 20, stock: 500, unit: '52g', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&q=80', description: 'Classic salted potato chips', categoryId: 'c3', subcategoryId: 'sc5', sku: 'CHI-LAY-001', active: true },
    ]},
  ]},
];

export const MOCK_ORDERS = [
  { id: '#FC123456', customer: 'Ananya Sharma', email: 'ananya@email.com', phone: '9876543210', amount: 256, status: 'On the Way', date: '20 May, 11:30 AM', items: 3, address: '12, MG Road, Mumbai' },
  { id: '#FC123455', customer: 'Rohit Verma', email: 'rohit@email.com', phone: '9123456780', amount: 842, status: 'Packed', date: '20 May, 11:20 AM', items: 5, address: '45, Andheri West, Mumbai' },
  { id: '#FC123454', customer: 'Neha Patil', email: 'neha@email.com', phone: '9988776655', amount: 589, status: 'Delivered', date: '20 May, 10:50 AM', items: 4, address: '8, Bandra, Mumbai' },
  { id: '#FC123453', customer: 'Karan Singh', email: 'karan@email.com', phone: '9001234567', amount: 1299, status: 'Cancelled', date: '20 May, 10:30 AM', items: 7, address: '22, Powai, Mumbai' },
  { id: '#FC123452', customer: 'Priya Mehta', email: 'priya@email.com', phone: '9876001234', amount: 430, status: 'Pending', date: '20 May, 10:00 AM', items: 2, address: '3, Juhu, Mumbai' },
  { id: '#FC123451', customer: 'Arjun Nair', email: 'arjun@email.com', phone: '9112233445', amount: 780, status: 'Delivered', date: '19 May, 09:30 AM', items: 6, address: '17, Colaba, Mumbai' },
];

export const MOCK_CUSTOMERS = [
  { id: 'cu1', name: 'Ananya Sharma', email: 'ananya@email.com', phone: '9876543210', orderCount: 12, totalSpent: 4560, joinedDate: '01 Jan 2024', status: 'Active' },
  { id: 'cu2', name: 'Rohit Verma', email: 'rohit@email.com', phone: '9123456780', orderCount: 8, totalSpent: 3200, joinedDate: '15 Feb 2024', status: 'Active' },
  { id: 'cu3', name: 'Neha Patil', email: 'neha@email.com', phone: '9988776655', orderCount: 5, totalSpent: 1890, joinedDate: '10 Mar 2024', status: 'Active' },
  { id: 'cu4', name: 'Karan Singh', email: 'karan@email.com', phone: '9001234567', orderCount: 2, totalSpent: 560, joinedDate: '20 Apr 2024', status: 'Inactive' },
  { id: 'cu5', name: 'Priya Mehta', email: 'priya@email.com', phone: '9876001234', orderCount: 18, totalSpent: 7800, joinedDate: '05 Jan 2024', status: 'Active' },
];

export const MOCK_COUPONS = [
  { id: 'cp1', code: 'FIRST20', discount: 20, type: 'percentage', minOrder: 100, maxDiscount: 100, usageLimit: 1000, usedCount: 456, expiry: '2025-12-31', active: true, description: 'First order discount' },
  { id: 'cp2', code: 'FLAT50', discount: 50, type: 'flat', minOrder: 200, maxDiscount: 50, usageLimit: 500, usedCount: 234, expiry: '2025-06-30', active: true, description: 'Flat ₹50 off' },
  { id: 'cp3', code: 'SAVE100', discount: 100, type: 'flat', minOrder: 500, maxDiscount: 100, usageLimit: 200, usedCount: 189, expiry: '2025-05-31', active: false, description: '₹100 off on orders above ₹500' },
  { id: 'cp4', code: 'FRESH15', discount: 15, type: 'percentage', minOrder: 150, maxDiscount: 75, usageLimit: 750, usedCount: 102, expiry: '2025-09-30', active: true, description: '15% off on fresh items' },
];

export const MOCK_INVENTORY = MOCK_CATEGORIES.flatMap(cat =>
  cat.subcategories.flatMap(sub =>
    sub.products.map(p => ({
      id: p.id, name: p.name, sku: p.sku, category: cat.name,
      subcategory: sub.name, stock: p.stock, unit: p.unit,
      lowStockThreshold: 10, price: p.price, image: p.image,
    }))
  )
);
