 
import { Routes, Route, Navigate } from "react-router-dom";
import WelcomePage from "../pages/entry/WelcomePage";
import AuthLayout from "../layouts/AuthLayout";
import HomePage from "../pages/home/HomePage";
import CheckoutPage from "../pages/checkout/CheckoutPage";
import ProfilePage from "../pages/profile/ProfilePage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import PublicRoute from "../components/common/PublicRoute";
import CouponsPage from "../pages/CouponPage";
import OrdersPage from "../pages/orders/OrderPage";
 
 
export default function AppRoutes() {
  return (
    <Routes>
 
      <Route
        path="/"
        element={
          <PublicRoute>
            <WelcomePage />
          </PublicRoute>
        }
      />
 
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }
      />
 
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
 
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
 
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
     <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
      <Route path="/offers" element={<ProtectedRoute><CouponsPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
 
    </Routes>
  );
}
 
