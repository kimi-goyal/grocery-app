
import { Routes, Route, Navigate } from "react-router-dom";
import WelcomePage from "../pages/entry/WelcomePage";
import AuthLayout from "../layouts/AuthLayout";
import HomePage from "../pages/home/HomePage";
import CheckoutPage from "../pages/checkout/CheckoutPage";
import ProfilePage from "../pages/profile/ProfilePage";
import AddressesPage from "../pages/AddressesPage";
import PaymentMethodsPage from "../pages/PaymentMethodsPage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import PublicRoute from "../components/common/PublicRoute";
import CouponsPage from "../pages/CouponPage";
import OrdersPage from "../pages/orders/OrderPage";
import CustomerCarePage from "../pages/CustomerCarePage";
import SettingsPage from "../pages/SettingsPage";
import NotificationPage from "../pages/NotificationPage";
import SupportBot from "../components/chat/SupportBot";

export default function AppRoutes() {
  return (
    <>
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
            <HomePage />
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
        <Route
          path="/addresses"
          element={
            <ProtectedRoute>
              <AddressesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-methods"
          element={
            <ProtectedRoute>
              <PaymentMethodsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/offers" element={<ProtectedRoute><CouponsPage /></ProtectedRoute>} />
        <Route path="/help" element={<ProtectedRoute><CustomerCarePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
      <ProtectedRoute>
        <SupportBot />
      </ProtectedRoute>

    </>
  );
}

