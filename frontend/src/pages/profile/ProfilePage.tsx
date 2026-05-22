
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuthStore } from '../../store/authStore';

// const MENU = [
//   { label: 'My Orders', path: '/orders' },
//   { label: 'Addresses', path: '/addresses' },
//   { label: 'Payment Methods', path: '/payment-methods' },
//   { label: 'Coupons', path: '/coupons' },
//   { label: 'Notifications', path: '/notifications' },
//   { label: 'Help & Support', path: '/help' },
//   { label: 'Settings', path: '/settings' },
// ];

// export default function ProfilePage() {
//   const navigate = useNavigate();
//   const { user, isAuthenticated, logout } = useAuthStore();

//   useEffect(() => {
//     if (!isAuthenticated) navigate('/auth', { replace: true });
//   }, [isAuthenticated, navigate]);

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-[#050816] flex items-center justify-center">
//         <div className="w-6 h-6 border-2 border-[#ff4d6d] border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   const name = user?.name || 'User';
//   const firstName = name.split(' ')[0];

//   return (
//     <div className="min-h-screen bg-[#050816] px-4 py-8">
//       <div className="max-w-md mx-auto">

//         {/* 🔙 Back */}
//         <button
//           onClick={() => navigate(-1)}
//           className="text-gray-400 text-sm mb-5"
//         >
//           ← Back
//         </button>

//         {/* ✅ PROFILE HEADER (MATCHES IMAGE) */}
//         <div className="rounded-3xl bg-[#0b1224]/70 backdrop-blur-xl border border-white/10 p-5 mb-4">
//           <div className="flex items-center gap-4">

//             {/* Avatar */}
//             <div className="w-14 h-14 rounded-full overflow-hidden border border-white/20">
//               {user?.avatar ? (
//                 <img
//                   src={user.avatar}
//                   alt="profile"
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center bg-[#ff4d6d]/20 text-[#ff4d6d]">
//                   <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
//                     <circle cx="11" cy="7" r="4" />
//                     <path d="M3 21c0-4 4-7 8-7s8 3 8 7" />
//                   </svg>
//                 </div>
//               )}
//             </div>

//             {/* Name */}
//             <div className="flex-1">
//               <p className="text-white font-semibold text-sm">
//                 Hi, {firstName} 👋
//               </p>
//               <button
//                 onClick={() => navigate('/settings')}
//                 className="text-xs text-gray-400 hover:text-[#ff4d6d] transition"
//               >
//                 Edit Profile
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* ✅ MENU LIST */}
//         <div className="rounded-3xl bg-[#0b1224]/70 backdrop-blur-xl border border-white/10 overflow-hidden mb-4">
//           {MENU.map((item, i) => (
//             <button
//               key={item.path}
//               onClick={() => navigate(item.path)}
//               className={`w-full px-5 py-4 flex justify-between items-center text-sm text-gray-300 hover:bg-white/5 transition ${
//                 i !== MENU.length - 1 ? 'border-b border-white/5' : ''
//               }`}
//             >
//               {item.label}
//               <span className="text-gray-600">›</span>
//             </button>
//           ))}
//         </div>

//         {/* ✅ LOGOUT */}
//         <div className="rounded-3xl border border-red-500/20 bg-red-500/5">
//           <button
//             onClick={() => {
//               logout();
//               navigate('/auth');
//             }}
//             className="w-full px-5 py-4 text-left text-sm text-red-400 hover:bg-red-500/10 transition"
//           >
//             Logout
//           </button>
//         </div>

//         {/* ✅ FOOTER */}
//         <p className="text-center text-gray-600 text-xs mt-8">
//           FreshCart v1.0.0
//         </p>

//       </div>
//     </div>
//   );
// }

 
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { orderService } from '../../services/orderService';
import { couponService } from '../../services/couponService';
 
const MENU = [
  {
    label: 'My Orders',
    path: '/orders',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
    color: 'text-orange-400',
    bg: 'rgba(249,115,22,0.1)',
    border: 'rgba(249,115,22,0.2)',
    description: 'Track and manage your orders',
  },
  {
    label: 'My Coupons',
    path: '/offers',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
    color: 'text-green-400',
    bg: 'rgba(34,197,94,0.1)',
    border: 'rgba(34,197,94,0.2)',
    description: 'View and apply your coupons',
  },
  {
    label: 'Addresses',
    path: '/addresses',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    color: 'text-blue-400',
    bg: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.2)',
    description: 'Manage delivery addresses',
  },
  {
    label: 'Payment Methods',
    path: '/payment-methods',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
    color: 'text-purple-400',
    bg: 'rgba(168,85,247,0.1)',
    border: 'rgba(168,85,247,0.2)',
    description: 'Cards, UPI and wallets',
  },
  {
    label: 'Notifications',
    path: '/notifications',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>
    ),
    color: 'text-yellow-400',
    bg: 'rgba(234,179,8,0.1)',
    border: 'rgba(234,179,8,0.2)',
    description: 'Delivery and offer alerts',
  },
  {
    label: 'Help & Support',
    path: '/help',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    color: 'text-teal-400',
    bg: 'rgba(20,184,166,0.1)',
    border: 'rgba(20,184,166,0.2)',
    description: 'FAQs and contact support',
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
    color: 'text-gray-400',
    bg: 'rgba(148,163,184,0.1)',
    border: 'rgba(148,163,184,0.2)',
    description: 'App preferences',
  },
];
 
export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [ordersCount, setOrdersCount] = useState(0);
  const [couponsCount, setCouponsCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);
 
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth', { replace: true });
      return;
    }

    let active = true;
    const loadCounts = async () => {
      setStatsLoading(true);
      try {
        const [firstPage, coupons] = await Promise.all([
          orderService.getMyOrders({ page: 1, limit: 50 }),
          couponService.getMyCoupons(),
        ]);

        if (!active) return;

        const ordersTotal = firstPage.total ?? firstPage.orders.length;
        let ratedCount = firstPage.orders.filter((order) => order.is_rated).length;

        if (firstPage.pages > 1) {
          const pagesToFetch = [];
          for (let page = 2; page <= firstPage.pages; page += 1) {
            pagesToFetch.push(orderService.getMyOrders({ page, limit: 50 }));
          }

          const remainingPages = await Promise.all(pagesToFetch);
          if (!active) return;

          ratedCount += remainingPages.reduce((sum, pageResult) => (
            sum + pageResult.orders.filter((order) => order.is_rated).length
          ), 0);
        }

        setOrdersCount(ordersTotal);
        setCouponsCount(coupons.length);
        setReviewsCount(ratedCount);
      } catch (err) {
        console.error('Unable to load profile stats', err);
      } finally {
        if (active) setStatsLoading(false);
      }
    };

    loadCounts();
    return () => {
      active = false;
    };
  }, [isAuthenticated, navigate]);
 
  if (!user) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#ff4d6d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
 
  const firstName = user.name?.split(' ')[0] ?? 'there';
 
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
 
  return (
    <div className="min-h-screen bg-[#050816] relative overflow-hidden pb-24 sm:pb-8">
      {/* Ambient glows */}
      <div className="fixed top-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-[#ff4d6d]/6 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-purple-900/10 blur-[100px] pointer-events-none" />
 
      <div className="max-w-md mx-auto px-4 pt-6 pb-12 relative z-10">
 
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-5 text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </button>
 
        {/* Profile hero card */}
        <div
          className="rounded-3xl p-5 mb-4 relative overflow-hidden"
          style={{
            background: 'rgba(11,18,36,0.7)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Pink glow top-right */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#ff4d6d]/5 rounded-full blur-2xl pointer-events-none" />
 
          <div className="flex items-center gap-4 relative">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full overflow-hidden border border-white/20 bg-[#ff4d6d]/10 text-[#ff4d6d] flex items-center justify-center">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="7" r="4" />
                <path d="M3 21c0-4 4-7 8-7s8 3 8 7" />
              </svg>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-base truncate" style={{ fontFamily: 'Sora,sans-serif' }}>
                Hi, {firstName} 👋
              </p>
              <p className="text-gray-500 text-xs truncate mt-0.5">{user.email}</p>
              {user.username && (
                <p className="text-[#ff4d6d]/60 text-xs mt-0.5">@{user.username}</p>
              )}
              <div className="flex items-center gap-1.5 mt-2">
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: user.is_verified ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                    border: user.is_verified ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(239,68,68,0.25)',
                    color: user.is_verified ? '#22c55e' : '#ef4444',
                  }}
                >
                  {user.is_verified ? '✓ Verified' : '⚠ Unverified'}
                </span>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(255,77,109,0.1)',
                    border: '1px solid rgba(255,77,109,0.2)',
                    color: '#ff4d6d',
                  }}
                >
                  {user.role === 'admin' ? 'Admin' : 'Customer'}
                </span>
              </div>
            </div>
          </div>
 
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2 mt-5">
            {[
              {
                label: 'Orders',
                value: statsLoading ? '...' : ordersCount.toString(),
                path: '/orders',
              },
              {
                label: 'Coupons',
                value: statsLoading ? '...' : couponsCount.toString(),
                path: '/offers',
              },
              {
                label: 'Reviews',
                value: statsLoading ? '...' : reviewsCount.toString(),
                path: '/orders',
              },
            ].map(s => (
              <button
                key={s.label}
                onClick={() => navigate(s.path)}
                className="rounded-2xl py-3 text-center transition-all hover:bg-white/5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="text-white font-bold text-base" style={{ fontFamily: 'Sora,sans-serif' }}>{s.value}</p>
                <p className="text-gray-600 text-xs mt-0.5">{s.label}</p>
              </button>
            ))}
          </div>
        </div>
 
        {/* Menu items */}
        <div
          className="rounded-3xl overflow-hidden mb-4"
          style={{
            background: 'rgba(11,18,36,0.7)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {MENU.map((item, idx) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-all hover:bg-white/4 active:bg-white/6 group ${idx < MENU.length - 1 ? 'border-b border-white/5' : ''
                }`}
            >
              {/* Icon box */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                style={{
                  background: item.bg,
                  border: `1px solid ${item.border}`,
                }}
              >
                <span className={item.color}>{item.icon}</span>
              </div>
 
              {/* Label + description */}
              <div className="flex-1 min-w-0">
                <p className="text-gray-200 text-sm font-medium group-hover:text-white transition-colors">
                  {item.label}
                </p>
                <p className="text-gray-600 text-[10px] mt-0.5 truncate">{item.description}</p>
              </div>
 
              {/* Arrow */}
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className="text-gray-700 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all shrink-0"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))}
        </div>
 
        {/* Logout */}
        <div
          className="rounded-3xl overflow-hidden mb-6"
          style={{
            background: 'rgba(239,68,68,0.05)',
            border: '1px solid rgba(239,68,68,0.15)',
          }}
        >
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 text-left transition-all hover:bg-red-500/8 group"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
            <span className="flex-1 text-red-400 text-sm font-medium group-hover:text-red-300 transition-colors">
              Logout
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500/30 group-hover:translate-x-0.5 transition-all">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
 
        <p className="text-center text-gray-700 text-xs">FreshCart v1.0.0</p>
      </div>
    </div>
  );
}