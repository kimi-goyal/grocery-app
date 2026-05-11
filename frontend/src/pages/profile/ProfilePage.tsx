// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuthStore } from '../../store/authStore';

// const MENU = [
//   {
//     label: 'My Orders', path: '/orders',
//     color: 'text-orange-400', bg: 'from-orange-500/20 to-orange-600/10', border: 'border-orange-500/20',
//     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
//   },
//   {
//     label: 'Addresses', path: '/addresses',
//     color: 'text-blue-400', bg: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/20',
//     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
//   },
//   {
//     label: 'Payment Methods', path: '/payment-methods',
//     color: 'text-purple-400', bg: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/20',
//     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
//   },
//   {
//     label: 'Coupons', path: '/coupons',
//     color: 'text-green-400', bg: 'from-green-500/20 to-green-600/10', border: 'border-green-500/20',
//     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
//   },
//   {
//     label: 'Notifications', path: '/notifications',
//     color: 'text-yellow-400', bg: 'from-yellow-500/20 to-yellow-600/10', border: 'border-yellow-500/20',
//     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
//   },
//   {
//     label: 'Help & Support', path: '/help',
//     color: 'text-teal-400', bg: 'from-teal-500/20 to-teal-600/10', border: 'border-teal-500/20',
//     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
//   },
//   {
//     label: 'Settings', path: '/settings',
//     color: 'text-gray-400', bg: 'from-gray-500/20 to-gray-600/10', border: 'border-gray-500/20',
//     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
//   },
// ];

// export default function ProfilePage() {
//   const navigate = useNavigate();
//   const { user, isAuthenticated, logout } = useAuthStore();

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate('/auth', { replace: true });
//     }
//   }, [isAuthenticated, navigate]);

//   const handleLogout = () => {
//     logout();
//     navigate('/auth');
//   };

//   const name = user?.name;
//   const email = user?.email;
//   const username = user?.username;
//   const firstName = name?.split(' ')[0] ?? 'there';

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-[#050816] flex items-center justify-center">
//         <svg className="w-8 h-8 animate-spin text-[#ff4d6d]" viewBox="0 0 24 24" fill="none">
//           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//         </svg>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#050816] relative overflow-hidden" style={{ fontFamily: 'Sora, sans-serif' }}>
//       <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-[#ff4d6d]/8 blur-[100px] pointer-events-none" />
//       <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-purple-900/15 blur-[100px] pointer-events-none" />

//       <div className="max-w-md mx-auto px-4 pt-8 pb-12 relative z-10">
//         <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6 text-sm">
//           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
//           Back
//         </button>

//         <div className="rounded-3xl border border-white/8 bg-white/3 backdrop-blur-sm p-6 mb-4 relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-40 h-40 bg-[#ff4d6d]/5 rounded-full blur-2xl pointer-events-none" />

//           <div className="flex items-center gap-4 relative">
//             <div className="relative flex-shrink-0">
//               <div className="rounded-2xl overflow-hidden flex items-center justify-center" style={{ width: 72, height: 72, background: 'linear-gradient(135deg,#ff4d6d22,#ff4d6d44)', border: '2px solid rgba(255,77,109,0.25)' }}>
//                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff4d6d" strokeWidth="2">
//                   <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
//                   <circle cx="12" cy="7" r="4" />
//                 </svg>
//               </div>
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-white font-semibold text-base truncate">Hi, {firstName} 👋</p>
//               <p className="text-gray-500 text-xs mt-0.5 truncate">{email}</p>
//               {username && <p className="text-[#ff4d6d]/70 text-xs mt-0.5">@{username}</p>}
//             </div>
//           </div>

//           <div className="mt-5 grid grid-cols-3 gap-2">
//             {[{ label: 'Orders', value: '0' }, { label: 'Wishlist', value: '0' }, { label: 'Reviews', value: '0' }].map((s) => (
//               <div key={s.label} className="rounded-2xl border border-white/8 bg-white/3 py-3 text-center">
//                 <p className="text-white font-semibold text-base">{s.value}</p>
//                 <p className="text-gray-600 text-xs mt-0.5">{s.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="rounded-3xl border border-white/8 bg-white/3 backdrop-blur-sm overflow-hidden mb-4">
//           {MENU.map((item, idx) => (
//             <button
//               key={item.path}
//               onClick={() => navigate(item.path)}
//               className={`w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/5 active:bg-white/8 transition-all group ${idx < MENU.length - 1 ? 'border-b border-white/5' : ''}`}
//             >
//               <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${item.bg} border ${item.border} ${item.color} group-hover:scale-105 transition-transform`}>
//                 {item.icon}
//               </div>
//               <span className="flex-1 text-gray-300 text-sm font-medium group-hover:text-white transition-colors">{item.label}</span>
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-700 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all"><polyline points="9 18 15 12 9 6"/></svg>
//             </button>
//           ))}
//         </div>

//         <div className="rounded-3xl border border-red-500/15 bg-red-500/5 overflow-hidden">
//           <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-red-500/10 transition-all group">
//             <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/25 text-red-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
//             </div>
//             <span className="flex-1 text-red-400 text-sm font-medium group-hover:text-red-300 transition-colors">Logout</span>
//             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500/40 group-hover:translate-x-0.5 transition-all"><polyline points="9 18 15 12 9 6"/></svg>
//           </button>
//         </div>

//         <p className="text-center text-gray-700 text-xs mt-8">FreshCart v1.0.0</p>
//       </div>
//     </div>
//   );
// }
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const MENU = [
  { label: 'My Orders', path: '/orders' },
  { label: 'Addresses', path: '/addresses' },
  { label: 'Payment Methods', path: '/payment-methods' },
  { label: 'Coupons', path: '/coupons' },
  { label: 'Notifications', path: '/notifications' },
  { label: 'Help & Support', path: '/help' },
  { label: 'Settings', path: '/settings' },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) navigate('/auth', { replace: true });
  }, [isAuthenticated, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#ff4d6d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const name = user?.name || 'User';
  const firstName = name.split(' ')[0];

  return (
    <div className="min-h-screen bg-[#050816] px-4 py-8">
      <div className="max-w-md mx-auto">

        {/* 🔙 Back */}
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 text-sm mb-5"
        >
          ← Back
        </button>

        {/* ✅ PROFILE HEADER (MATCHES IMAGE) */}
        <div className="rounded-3xl bg-[#0b1224]/70 backdrop-blur-xl border border-white/10 p-5 mb-4">
          <div className="flex items-center gap-4">

            {/* Avatar */}
            <div className="w-14 h-14 rounded-full overflow-hidden border border-white/20">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#ff4d6d]/20 text-[#ff4d6d]">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="7" r="4" />
                    <path d="M3 21c0-4 4-7 8-7s8 3 8 7" />
                  </svg>
                </div>
              )}
            </div>

            {/* Name */}
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">
                Hi, {firstName} 👋
              </p>
              <button
                onClick={() => navigate('/settings')}
                className="text-xs text-gray-400 hover:text-[#ff4d6d] transition"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* ✅ MENU LIST */}
        <div className="rounded-3xl bg-[#0b1224]/70 backdrop-blur-xl border border-white/10 overflow-hidden mb-4">
          {MENU.map((item, i) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full px-5 py-4 flex justify-between items-center text-sm text-gray-300 hover:bg-white/5 transition ${
                i !== MENU.length - 1 ? 'border-b border-white/5' : ''
              }`}
            >
              {item.label}
              <span className="text-gray-600">›</span>
            </button>
          ))}
        </div>

        {/* ✅ LOGOUT */}
        <div className="rounded-3xl border border-red-500/20 bg-red-500/5">
          <button
            onClick={() => {
              logout();
              navigate('/auth');
            }}
            className="w-full px-5 py-4 text-left text-sm text-red-400 hover:bg-red-500/10 transition"
          >
            Logout
          </button>
        </div>

        {/* ✅ FOOTER */}
        <p className="text-center text-gray-600 text-xs mt-8">
          FreshCart v1.0.0
        </p>

      </div>
    </div>
  );
}