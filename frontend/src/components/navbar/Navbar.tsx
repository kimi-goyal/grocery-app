
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useEffect, useState } from "react";

export default function Navbar({ onCartOpen }: { onCartOpen: () => void }) {
const items = useCartStore(state => state.items);
const cartCount = items.reduce((acc, item) => acc + item.qty, 0);
const { isAuthenticated, user } = useAuthStore();
const navigate = useNavigate();
const [search, setSearch] = useState('');



  return (
    <nav className="sticky top-0 z-50 border-b border-white/8 bg-[#050816]/90 backdrop-blur-xl">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center gap-6">

        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => navigate('/home')}>
          <div className="w-8 h-8 rounded-xl bg-[#ff4d6d]/15 border border-[#ff4d6d]/30 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff4d6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <span className="text-lg font-bold" style={{ fontFamily: 'Sora,sans-serif' }}>
            Fresh<span className="text-[#ff4d6d]">Cart</span>
          </span>
        </div>

        {/* Deliver to */}

        {isAuthenticated && (
          <button className="hidden md:flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ff4d6d" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
            <div className="text-left">
              <div className="text-[10px] text-gray-500">Deliver to</div>
              <div className="text-white font-medium text-xs flex items-center gap-1">Mumbai, Maharashtra <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg></div>
            </div>

          </button>
        )}

        {!isAuthenticated && (
          <button onClick={() => navigate('/auth')} className="hidden md:flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ff4d6d" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
            <div className="text-left">
              <div className="text-[10px] text-gray-500">Deliver to</div>
              <div className="text-white font-medium text-xs flex items-center gap-1">Add Address Now <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg></div>
            </div>
          </button>
        )}
        {/* Search */}
        <div className="flex-1 relative max-w-xl">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder='Search for "milk, eggs, potato..."'
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff4d6d]/40 focus:bg-white/7 transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <NavAction icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
          } label="Offers" badge={undefined} onClick={() => { }} />

          <button onClick={onCartOpen} className="relative flex flex-col items-center gap-0.5 p-2 rounded-xl hover:bg-white/5 transition-colors group">
            <div className="relative">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 group-hover:text-white transition-colors"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6" /></svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#ff4d6d] rounded-full text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-500">Cart</span>
          </button>

          <button
            onClick={() => isAuthenticated ? navigate('/profile') : navigate('/auth')}
            className="flex flex-col items-center gap-0.5 p-2 rounded-xl hover:bg-white/5 transition-colors group"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 group-hover:text-white transition-colors"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            <span className="text-[10px] text-gray-500">{isAuthenticated ? (user?.name?.split(' ')[0] || 'Profile') : 'Login'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavAction({ icon, label, badge, onClick }: { icon: React.ReactNode; label: string; badge?: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="relative hidden sm:flex flex-col items-center gap-0.5 p-2 rounded-xl hover:bg-white/5 transition-colors group">
      <div className="relative text-gray-300 group-hover:text-white transition-colors">
        {icon}
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#ff4d6d] rounded-full text-[9px] font-bold flex items-center justify-center">{badge}</span>
        )}
      </div>
      <span className="text-[10px] text-gray-500">{label}</span>
    </button>
  );
}
