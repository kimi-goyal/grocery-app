 
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useEffect } from 'react';
// import AdminLoginPage from '../pages/AdminLoginPage';
// import AdminLayout from '../components/AdminLayout';
// import AdminProtectedRoute from '../components/AdminProtectedRoute';
// import DashboardPage from '../pages/DashboardPage';
// import ProductsPage from '../pages/ProductPage';
// import OrdersPage from '../pages/OrderPage';
// import CustomersPage from '../pages/CustomersPage';
// import InventoryPage from '../pages/InventoryPage';
// import CouponsPage from '../pages/CouponsPage';
// import CustomerServicePage from '../pages/CustomerServicePage';
// import { useAdminAuthStore } from '../store/adminAuthStore';
 
// export default function AdminRoutes() {
//   const { initAuth } = useAdminAuthStore();
 
//   useEffect(() => {
//     initAuth();
//   }, []);
 
//   return (
//     <Routes>
//       <Route path="login" element={<AdminLoginPage />} />
//       <Route element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
//         <Route path="dashboard" element={<DashboardPage />} />
//         <Route path="products" element={<ProductsPage />} />
//         <Route path="orders" element={<OrdersPage />} />
//         <Route path="customers" element={<CustomersPage />} />
//         <Route path="inventory" element={<InventoryPage />} />
//         <Route path="coupons" element={<CouponsPage />} />
//         <Route path="customer-service" element={<CustomerServicePage />} />
//         <Route index element={<Navigate to="dashboard" replace />} />
     
//       </Route>
//     </Routes>
//   );
// }
 
 
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import AdminLoginPage from '../pages/AdminLoginPage';
import AdminLayout from '../components/AdminLayout';
import AdminProtectedRoute from '../components/AdminProtectedRoute';
import DashboardPage from '../pages/DashboardPage';
import ProductsPage from '../pages/ProductPage';
import OrdersPage from '../pages/OrderPage';
import CustomersPage from '../pages/CustomersPage';
import InventoryPage from '../pages/InventoryPage';
import CouponsPage from '../pages/CouponsPage';
import DriversPage from '../pages/DriversPage';
import CustomerServicePage from '../pages/CustomerServicePage';
import { useAdminAuthStore } from '../store/adminAuthStore';

export default function AdminRoutes() {
  const { initAuth } = useAdminAuthStore();

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="coupons" element={<CouponsPage />} />
        <Route path="drivers" element={<DriversPage />} />
        <Route path="customer-service" element={<CustomerServicePage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      
      </Route>
    </Routes>
  );
}
