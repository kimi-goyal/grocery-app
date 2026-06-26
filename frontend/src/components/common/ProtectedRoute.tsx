

import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isGuest } = useAuthStore();

  if (!isAuthenticated && !isGuest) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
