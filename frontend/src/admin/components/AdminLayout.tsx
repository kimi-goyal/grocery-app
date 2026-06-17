
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

import { useEffect } from 'react';
import { wsService } from '../../services/wsService';
import { useAdminAuthStore } from '../store/adminAuthStore';
import AdminSupportToast from './AdminSupportToast';

export default function AdminLayout() {
  const isAdminAuthenticated = useAdminAuthStore((s) => s.isAdminAuthenticated);

  useEffect(() => {
    if (isAdminAuthenticated) {
      void wsService.connect();
    } else {
      wsService.disconnect();
    }
    return () => { wsService.disconnect(); };
  }, [isAdminAuthenticated]);

  return (
    <div className="flex min-h-screen bg-[#07111A]">
      <AdminSidebar />
     
      <AdminSupportToast />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Outlet />
      </div>
    
    </div>
  );
}
