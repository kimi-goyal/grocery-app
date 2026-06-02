import { Navigate } from 'react-router-dom';
import { useAdminAuthStore } from '../store/adminAuthStore';
 
export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdminAuthenticated, initialized } = useAdminAuthStore();
  if (!initialized) return null;
  if (!isAdminAuthenticated) return <Navigate to="/management/login" replace />;
  return <>{children}</>;
}
 
 