
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


import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import AdminRoutes from './admin/routes/AdminRoutes';
import { useAuthStore } from './store/authStore';
import CouponToastContainer from './components/coupons/CouponToastContainer';

export default function App() {
  const { initAuth } = useAuthStore();

  // On every app mount, silently validate stored tokens
  // and hydrate user from /auth/me using refresh if needed
  useEffect(() => {
    initAuth();
  }, []);

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

