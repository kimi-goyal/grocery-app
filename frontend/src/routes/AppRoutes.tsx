
import { Routes, Route, Navigate } from "react-router-dom";
import WelcomePage from "../pages/entry/WelcomePage";
import AuthLayout from "../layouts/AuthLayout";
import HomePage from "../pages/home/HomePage";
import CheckoutPage from "../pages/checkout/CheckoutPage";
import ProfilePage from "../pages/profile/ProfilePage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import PublicRoute from "../components/common/PublicRoute";

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

      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}
