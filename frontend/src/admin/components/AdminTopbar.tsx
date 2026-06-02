
import { Bell, Search } from 'lucide-react';
import { useAdminAuthStore } from '../store/adminAuthStore';

export default function AdminTopbar({ title }: { title: string }) {
  const { admin } = useAdminAuthStore();
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/8 bg-[#07111A]/95 backdrop-blur-xl sticky top-0 z-20">
      <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'Sora,sans-serif' }}>{title}</h1>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input placeholder="Search..." className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4D8D]/40 w-52 transition-all" />
        </div>
        <button className="relative w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
          <Bell size={16} className="text-gray-400" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF4D8D] rounded-full" />
        </button>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF4D8D] to-[#e63c7a] flex items-center justify-center text-sm font-bold text-white">
          {admin?.name?.[0] || 'A'}
        </div>
      </div>
    </header>
  );
}

