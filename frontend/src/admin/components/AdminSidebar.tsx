 
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '../store/adminAuthStore';
import { LayoutDashboard, Package, ShoppingCart, Users, Warehouse, Tag, ChevronLeft, ChevronRight, LogOut, Headphones, Truck } from 'lucide-react';
import { useState } from 'react';
 
const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/management/dashboard' },
  { icon: Package, label: 'Products', to: '/management/products' },
  { icon: ShoppingCart, label: 'Orders', to: '/management/orders' },
  { icon: Users, label: 'Customers', to: '/management/customers' },
  { icon: Warehouse, label: 'Inventory', to: '/management/inventory' },
  { icon: Truck, label: 'Drivers', to: '/management/drivers' },
  { icon: Tag, label: 'Coupons', to: '/management/coupons' },
  { icon: Headphones, label: 'Customer Service', to: '/management/customer-service' },
];
 
export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { admin, logout } = useAdminAuthStore();
  const navigate = useNavigate();
 
  const handleLogout = () => { logout(); navigate('/management/login'); };
 
  return (
    <aside className={`${collapsed ? 'w-[72px]' : 'w-[240px]'} shrink-0 h-screen sticky top-0 flex flex-col bg-[#07111A] border-r border-white/8 transition-all duration-300 z-30`}>
      {/* Logo */}
      <div className={`h-16 flex items-center ${collapsed ? 'justify-center px-4' : 'px-5'} border-b border-white/8`}>
        <div className="w-8 h-8 rounded-xl bg-[#FF4D8D]/15 border border-[#FF4D8D]/30 flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF4D8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </div>
        {!collapsed && (
          <span className="ml-2.5 text-base font-bold" style={{ fontFamily: 'Sora,sans-serif' }}>
            Fresh<span className="text-[#FF4D8D]">Cart</span>
          </span>
        )}
        <button
          onClick={() => setCollapsed(v => !v)}
          className={`${collapsed ? 'hidden' : 'ml-auto'} w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors`}
        >
          <ChevronLeft size={12} />
        </button>
      </div>
 
      {collapsed && (
        <button onClick={() => setCollapsed(false)} className="mx-auto mt-2 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
          <ChevronRight size={12} />
        </button>
      )}
 
      {/* Admin badge */}
      {!collapsed && (
        <div className="mx-3 mt-4 mb-2 p-3 rounded-xl bg-[#FF4D8D]/8 border border-[#FF4D8D]/15">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF4D8D] to-[#e63c7a] flex items-center justify-center text-xs font-bold text-white">
              {admin?.name?.[0] || 'A'}
            </div>
            <div className="min-w-0">
              <div className="text-white text-xs font-semibold truncate" style={{ fontFamily: 'Sora,sans-serif' }}>{admin?.name}</div>
              <div className="text-[#FF4D8D] text-[10px]">Super Admin</div>
            </div>
          </div>
        </div>
      )}
 
      {/* Nav */}
      <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 overflow-y-auto scrollbar-hide">
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${
                collapsed ? 'justify-center' : ''
              } ${isActive
                ? 'bg-[#FF4D8D]/12 text-white border border-[#FF4D8D]/20'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
              }`
            }
            title={collapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                <item.icon size={17} className={isActive ? 'text-[#FF4D8D]' : ''} />
                {!collapsed && <span style={{ fontFamily: isActive ? 'Sora,sans-serif' : 'DM Sans,sans-serif' }}>{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>
 
      {/* Logout */}
      <div className={`p-3 border-t border-white/8`}>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-[#94A3B8] hover:text-[#FF4D8D] hover:bg-[#FF4D8D]/5 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={17} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}