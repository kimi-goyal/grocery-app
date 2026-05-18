
import { useCouponStore } from '../../store/couponStore';

export default function NotificationPermissionBanner() {
  const { showNotifBanner, requestPush, dismissBanner } = useCouponStore();
  if (!showNotifBanner) return null;

  return (
    <div className="animate-slideDown relative overflow-hidden rounded-2xl border border-[#ff4d6d]/25 bg-gradient-to-r from-[#ff4d6d]/10 via-[#ff4d6d]/6 to-purple-900/10 p-4 flex items-center justify-between gap-4">
      {/* Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -translate-x-full animate-shimmer pointer-events-none" />

      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-[#ff4d6d]/15 border border-[#ff4d6d]/25 flex items-center justify-center text-xl shrink-0">
          🔔
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-bold" style={{ fontFamily: 'Sora,sans-serif' }}>
            Never miss a deal!
          </p>
          <p className="text-gray-400 text-xs mt-0.5 truncate">
            Get notified when new coupons drop and before they expire
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={dismissBanner}
          className="text-gray-500 hover:text-gray-300 transition-colors p-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        <button
          onClick={requestPush}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg,#ff4d6d,#e63c5a)',
            fontFamily: 'Sora,sans-serif',
            boxShadow: '0 4px 16px rgba(255,77,109,0.35)',
          }}
        >
          Enable Notifications
        </button>
      </div>

      <style>{`
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { to { transform: translateX(200%) } }
        .animate-slideDown { animation: slideDown 0.3s ease forwards }
        .animate-shimmer { animation: shimmer 2s ease infinite }
      `}</style>
    </div>
  );
}
