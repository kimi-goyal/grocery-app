
// import { useNavigate } from 'react-router-dom';
// import { useAuthStore } from '../../store/authStore';
// import { useCartStore } from '../../store/cartStore';
// import { useState } from "react";

// export default function Navbar({ onCartOpen }: { onCartOpen: () => void }) {
// const items = useCartStore(state => state.items);
// const cartCount = items.reduce((acc, item) => acc + item.qty, 0);
// const { isAuthenticated, user } = useAuthStore();
// const navigate = useNavigate();
// const [search, setSearch] = useState('');



//   return (
//     <nav className="sticky top-0 z-50 border-b border-white/8 bg-[#050816]/90 backdrop-blur-xl">
//       <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center gap-6">

//         {/* Logo */}
//         <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => navigate('/home')}>
//           <div className="w-8 h-8 rounded-xl bg-[#ff4d6d]/15 border border-[#ff4d6d]/30 flex items-center justify-center">
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff4d6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
//             </svg>
//           </div>
//           <span className="text-lg font-bold" style={{ fontFamily: 'Sora,sans-serif' }}>
//             Fresh<span className="text-[#ff4d6d]">Cart</span>
//           </span>
//         </div>

//         {/* Deliver to */}

//         {isAuthenticated && (
//           <button className="hidden md:flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors shrink-0">
//             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ff4d6d" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
//             <div className="text-left">
//               <div className="text-[10px] text-gray-500">Deliver to</div>
//               <div className="text-white font-medium text-xs flex items-center gap-1">Mumbai, Maharashtra <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg></div>
//             </div>

//           </button>
//         )}

//         {!isAuthenticated && (
//           <button onClick={() => navigate('/auth')} className="hidden md:flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors shrink-0">
//             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ff4d6d" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
//             <div className="text-left">
//               <div className="text-[10px] text-gray-500">Deliver to</div>
//               <div className="text-white font-medium text-xs flex items-center gap-1">Add Address Now <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg></div>
//             </div>
//           </button>
//         )}
//         {/* Search */}
//         <div className="flex-1 relative max-w-xl">
//           <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
//           <input
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             placeholder='Search for "milk, eggs, potato..."'
//             className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff4d6d]/40 focus:bg-white/7 transition-all"
//           />
//         </div>

//         {/* Actions */}
//         <div className="flex items-center gap-2 ml-auto shrink-0">
//           <NavAction icon={
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
//           } label="Offers" badge={undefined} onClick={() => isAuthenticated && navigate('/offers')} />

//           <button onClick={onCartOpen} className="relative flex flex-col items-center gap-0.5 p-2 rounded-xl hover:bg-white/5 transition-colors group">
//             <div className="relative">
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 group-hover:text-white transition-colors"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6" /></svg>
//               {cartCount > 0 && (
//                 <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#ff4d6d] rounded-full text-[9px] font-bold flex items-center justify-center">
//                   {cartCount}
//                 </span>
//               )}
//             </div>
//             <span className="text-[10px] text-gray-500">Cart</span>
//           </button>

//           <button
//             onClick={() => isAuthenticated ? navigate('/profile') : navigate('/auth')}
//             className="flex flex-col items-center gap-0.5 p-2 rounded-xl hover:bg-white/5 transition-colors group"
//           >
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 group-hover:text-white transition-colors"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
//             <span className="text-[10px] text-gray-500">{isAuthenticated ? (user?.name?.split(' ')[0] || 'Profile') : 'Login'}</span>
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }

// function NavAction({ icon, label, badge, onClick }: { icon: React.ReactNode; label: string; badge?: number; onClick: () => void }) {
//   return (
//     <button onClick={onClick} className="relative hidden sm:flex flex-col items-center gap-0.5 p-2 rounded-xl hover:bg-white/5 transition-colors group">
//       <div className="relative text-gray-300 group-hover:text-white transition-colors">
//         {icon}
//         {badge !== undefined && badge > 0 && (
//           <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#ff4d6d] rounded-full text-[9px] font-bold flex items-center justify-center">{badge}</span>
//         )}
//       </div>
//       <span className="text-[10px] text-gray-500">{label}</span>
//     </button>
//   );
// }

import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
 
export default function Navbar({ onCartOpen }: { onCartOpen: () => void }) {
  const [search, setSearch] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const items = useCartStore(state => state.items);
  const { isAuthenticated, user, logout } = useAuthStore();
  const totalItems = items.reduce((acc, item) => acc + item.qty, 0);
 
  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
 
  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    navigate('/');
  };
 
  const isActive = (path: string) => location.pathname === path;
 
  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-white/8 bg-[#050816]/90 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center gap-6">
 
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => navigate('/home')}>
            <div className="w-8 h-8 rounded-xl bg-[#ff4d6d]/15 border border-[#ff4d6d]/30 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff4d6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
            <span className="text-lg font-bold" style={{ fontFamily: 'Sora,sans-serif' }}>
              Fresh<span className="text-[#ff4d6d]">Cart</span>
            </span>
          </div>
 
          {/* Deliver to */}
          {isAuthenticated ? (
            <button className="hidden md:flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ff4d6d" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-gray-500">Deliver to</div>
                <div className="text-white font-medium text-xs flex items-center gap-1">
                  Mumbai, Maharashtra
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="hidden md:flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors shrink-0"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ff4d6d" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-gray-500">Deliver to</div>
                <div className="text-white font-medium text-xs flex items-center gap-1">
                  Add Address Now
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </button>
          )}
 
          {/* Search */}
          <div className="flex-1 relative max-w-xl">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='Search for "milk, eggs, potato..."'
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff4d6d]/40 focus:bg-white/7 transition-all"
            />
          </div>
 
          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto shrink-0">
 
            {/* Offers — navigates to /offers */}
            <button
              onClick={() => navigate('/offers')}
              className={`relative hidden sm:flex flex-col items-center gap-0.5 p-2 rounded-xl hover:bg-white/5 transition-colors group ${isActive('/coupons') ? 'bg-[#ff4d6d]/8' : ''}`}
            >
              <svg
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className={`transition-colors ${isActive('/coupons') ? 'text-[#ff4d6d]' : 'text-gray-300 group-hover:text-white'}`}
              >
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              <span className={`text-[10px] ${isActive('/coupons') ? 'text-[#ff4d6d]' : 'text-gray-500'}`}>Offers</span>
            </button>
 
            {/* Orders — navigates to /orders */}
            <button
              onClick={() => navigate('/orders')}
              className={`relative hidden sm:flex flex-col items-center gap-0.5 p-2 rounded-xl hover:bg-white/5 transition-colors group ${isActive('/orders') ? 'bg-[#ff4d6d]/8' : ''}`}
            >
              <svg
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className={`transition-colors ${isActive('/orders') ? 'text-[#ff4d6d]' : 'text-gray-300 group-hover:text-white'}`}
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <span className={`text-[10px] ${isActive('/orders') ? 'text-[#ff4d6d]' : 'text-gray-500'}`}>Orders</span>
            </button>
 
            {/* Cart */}
            <button
              onClick={onCartOpen}
              className="relative flex flex-col items-center gap-0.5 p-2 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <div className="relative">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 group-hover:text-white transition-colors">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#ff4d6d] rounded-full text-[9px] font-bold flex items-center justify-center text-white">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-gray-500 group-hover:text-gray-400 transition-colors">Cart</span>
            </button>
 
 
 
            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() =>
                  isAuthenticated ? setProfileOpen((v) => !v) : navigate('/auth')
                }
                className={`flex flex-col items-center gap-0.5 p-2 rounded-xl hover:bg-white/5 transition-colors group ${profileOpen ? 'bg-white/5' : ''
                  }`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-300 group-hover:text-white transition-colors"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
 
                <span className="text-[10px] text-gray-500">
                  {isAuthenticated
                    ? user?.name?.split(' ')[0] || 'Profile'
                    : 'Login'}
                </span>
              </button>
 
              {/* Dropdown */}
              {profileOpen && isAuthenticated && (
                <div
                  className="absolute right-0 top-[58px] w-56 rounded-2xl shadow-2xl overflow-hidden z-50"
                  style={{
                    background: 'rgba(11,18,32,0.98)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(24px)',
                    animation: 'fadeDown 0.15s ease forwards',
                  }}
                >
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-white/6">
                    <p className="text-white text-sm font-bold truncate">
                      {user?.name}
                    </p>
                    <p className="text-gray-500 text-xs truncate mt-0.5">
                      {user?.email}
                    </p>
                  </div>
 
                  {/* Links */}
                  <div className="p-1.5">
                    {[
                      { label: 'My Orders', path: '/orders' },
                      { label: 'My Coupons', path: '/coupons' },
                      { label: 'Profile', path: '/profile' },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          navigate(item.path);
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/6 text-gray-300 hover:text-white transition"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
 
                  {/* Logout */}
                  <div className="p-1.5 border-t border-white/6">
                    <button
                      onClick={handleLogout}
                      className="w-full px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 text-left"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
 
      {/* Mobile bottom nav bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden border-t border-white/8 bg-[#050816]/95 backdrop-blur-xl">
        <div className="flex items-center justify-around px-1 py-2">
          {[
            {
              label: 'Home', path: '/home',
              icon: (active: boolean) => (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={active ? 'text-[#ff4d6d]' : 'text-gray-500'}>
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              ),
            },
            {
              label: 'Offers', path: '/offers',
              icon: (active: boolean) => (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={active ? 'text-[#ff4d6d]' : 'text-gray-500'}>
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              ),
            },
            {
              label: 'Cart', path: 'cart',
              icon: (_active: boolean) => (
                <div className="relative">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6" />
                  </svg>
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#ff4d6d] rounded-full text-[8px] font-bold flex items-center justify-center text-white">
                      {totalItems > 9 ? '9+' : totalItems}
                    </span>
                  )}
                </div>
              ),
            },
            {
              label: 'Orders', path: '/orders',
              icon: (active: boolean) => (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={active ? 'text-[#ff4d6d]' : 'text-gray-500'}>
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              ),
            },
            {
              label: isAuthenticated ? (user?.name?.split(' ')[0] || 'Me') : 'Login',
              path: '/profile',
              icon: (_active: boolean) => isAuthenticated && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )
            },
          ].map(item => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => item.path === 'cart' ? onCartOpen() : navigate(item.path)}
                className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all min-w-[44px]"
              >
                {item.icon(active)}
                <span
                  className="text-[9px] font-semibold leading-none"
                  style={{
                    color: active ? '#ff4d6d' : 'rgba(255,255,255,0.3)',
                    fontFamily: 'Sora,sans-serif',
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
 
      <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
 