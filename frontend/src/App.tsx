
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import AppRoutes from './routes/AppRoutes';
// import AdminRoutes from './admin/routes/AdminRoutes';

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/management/*" element={<AdminRoutes />} />
//         <Route path="/*" element={<AppRoutes />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import AdminRoutes from './admin/routes/AdminRoutes';
import { useAuthStore } from './store/authStore';
import { wsService } from './services/wsService';
import CouponToastContainer from './components/coupons/CouponToastContainer';
import SupportBot from './components/chat/SupportBot';

export default function App() {
  const initAuth = useAuthStore((state) => state.initAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // On every app mount, silently validate stored tokens
  // and hydrate user from /auth/me using refresh if needed
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      wsService.connect();
    } else {
      wsService.disconnect();
    }
    return () => {
      wsService.disconnect();
    };
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/management/*" element={<AdminRoutes />} />
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
      <CouponToastContainer />
     
    </BrowserRouter>
  );
}

