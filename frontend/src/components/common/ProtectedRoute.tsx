// import { Navigate, Outlet } from 'react-router-dom'

// const ProtectedRoute = () => {
//   const token = localStorage.getItem('token')

//   if (!token) {
//     return <Navigate to="/login" replace />
//   }

//   return <Outlet />
// }

// export default ProtectedRoute
// components/common/ProtectedRoute.tsx
// import { Navigate, Outlet } from "react-router-dom"
// import { useAuthStore } from "../../store/authStore"

// const ProtectedRoute = () => {
//   const { isAuthenticated, isGuest } = useAuthStore()

//   if (!isAuthenticated && !isGuest) {
//     return <Navigate to="/" replace />
//   }

//   return <Outlet />
// }

// export default ProtectedRoute

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
