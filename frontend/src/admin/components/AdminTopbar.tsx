 
import { Bell, Search } from 'lucide-react';
import { useAdminAuthStore } from '../store/adminAuthStore';
import { useAdminCallbackStore } from '../store/adminCallbackStore';
import { useEffect, useState } from 'react';
 
export default function AdminTopbar({ title }: { title: string }) {
  const { admin } = useAdminAuthStore();
  const { pendingCount, fetchPendingCallbacks, callbacks } = useAdminCallbackStore();
  const [showCallbackDropdown, setShowCallbackDropdown] = useState(false);
 
  useEffect(() => {
    // Fetch callbacks on mount
    fetchPendingCallbacks();
 
    // Polling every 30 seconds for new callbacks
    const interval = setInterval(() => {
      fetchPendingCallbacks();
    }, 30000);
 
    return () => clearInterval(interval);
  }, [fetchPendingCallbacks]);
 
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/8 bg-[#07111A]/95 backdrop-blur-xl sticky top-0 z-20">
      <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'Sora,sans-serif' }}>{title}</h1>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input placeholder="Search..." className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4D8D]/40 w-52 transition-all" />
        </div>
       
        {/* Callback Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowCallbackDropdown(!showCallbackDropdown)}
            className="relative w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Bell size={16} className="text-gray-400" />
            {pendingCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#FF4D8D] rounded-full text-white text-xs font-bold flex items-center justify-center">
                {pendingCount > 9 ? '9+' : pendingCount}
              </span>
            )}
          </button>
 
          {/* Dropdown Menu */}
          {showCallbackDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0b1224] border border-white/10 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-white font-semibold">Callback Requests ({pendingCount})</h3>
              </div>
 
              {callbacks.length === 0 ? (
                <div className="p-4 text-center text-gray-400 text-sm">
                  No pending callback requests
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {callbacks.filter(cb => cb.status !== 'resolved').slice(0, 5).map((callback) => (
                    <div key={callback.id} className="p-3 hover:bg-white/5 transition-colors">
                      <div className="mb-2">
                        <p className="text-white font-semibold text-sm">{callback.name}</p>
                        <p className="text-gray-400 text-xs">{callback.email}</p>
                        {callback.phone && (
                          <p className="text-gray-400 text-xs">📞 {callback.phone}</p>
                        )}
                      </div>
                      {callback.message && (
                        <p className="text-gray-300 text-xs mb-2 line-clamp-2">{callback.message}</p>
                      )}
                      <p className="text-gray-500 text-xs">
                        {new Date(callback.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
 
              {callbacks.filter(cb => cb.status !== 'resolved').length > 5 && (
                <div className="p-3 border-t border-white/10 text-center">
                  <p className="text-gray-400 text-xs">+{callbacks.filter(cb => cb.status !== 'resolved').length - 5} more requests</p>
                </div>
              )}
            </div>
          )}
        </div>
 
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF4D8D] to-[#e63c7a] flex items-center justify-center text-sm font-bold text-white">
          {admin?.name?.[0] || 'A'}
        </div>
      </div>
    </header>
  );
}
 
 
 