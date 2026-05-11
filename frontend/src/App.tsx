
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import AdminRoutes from './admin/routes/AdminRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/management/*" element={<AdminRoutes />} />
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
