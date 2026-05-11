// import { Navigate, Outlet } from 'react-router-dom'

// const PublicRoute = () => {
//   const token = localStorage.getItem('token')

//   if (token) {
//     return <Navigate to="/home" replace />
//   }

//   return <Outlet />
// }

// export default PublicRoute
// components/common/PublicRoute.tsx
//  import { Navigate, Outlet } from 'react-router-dom'
// import { useAuthStore } from "../../store/authStore"

// const PublicRoute = () => {
//   const { isAuthenticated, isGuest } = useAuthStore()

//   if (isAuthenticated || isGuest) {
//     return <Navigate to="/home" replace />
//   }

//   return <Outlet />
// }

// export default PublicRoute

import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

