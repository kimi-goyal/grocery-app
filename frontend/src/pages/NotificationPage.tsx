import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../store/notificationStore';

const getBadgeStyles = (type: string) => {
  if (type === 'coupon_added') {
    return 'bg-amber-500/10 text-amber-300 border border-amber-500/20';
  }
  return 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20';
};

export default function NotificationPage() {
  const navigate = useNavigate();
  const notifications = useNotificationStore((state) => state.notifications);
  const clearNotifications = useNotificationStore((state) => state.clearNotifications);

  const hasNotifications = notifications.length > 0;
  const heading = hasNotifications ? 'Your notifications' : 'No notifications yet';

  const formattedNotifications = useMemo(
    () =>
      notifications.map((notification) => ({
        ...notification,
        createdAt: new Date(notification.createdAt).toLocaleString(),
      })),
    [notifications],
  );

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-16 relative overflow-hidden">
      <div className="absolute left-[-120px] top-[-100px] w-[280px] h-[280px] rounded-full bg-[#ff4d6d]/15 blur-[120px] pointer-events-none" />
      <div className="absolute right-[-120px] bottom-[-100px] w-[260px] h-[260px] rounded-full bg-[#3b82f6]/15 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="flex items-center gap-3 mb-5 text-sm text-gray-400">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <strong className="text-white">{notifications.length}</strong>
            {notifications.length === 1 ? 'notification' : 'notifications'} received
          </span>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-[rgba(11,18,36,0.86)] p-8 shadow-2xl shadow-[#050816]/40 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Notifications</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                {heading}
              </h1>
              <p className="mt-4 max-w-xl text-sm text-gray-300 leading-7">
                Real-time coupon and delivery updates are stored here for easy access. Tap any notification to review its details and stay on top of your order progress.
              </p>
            </div>
            {hasNotifications && (
              <button
                onClick={clearNotifications}
                className="rounded-3xl bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Clear all
              </button>
            )}
          </div>

          {hasNotifications ? (
            <div className="mt-10 grid gap-4">
              {formattedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="group overflow-hidden rounded-[28px] border border-white/10 bg-[#08101f]/90 p-6 transition hover:-translate-y-0.5 hover:border-[#ff4d6d]/20"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${getBadgeStyles(notification.type)}`}>
                        {notification.type === 'coupon_added' ? 'Offer' : 'Order update'}
                      </div>
                      <h2 className="mt-4 text-2xl font-semibold text-white">{notification.title}</h2>
                    </div>
                    <p className="text-xs uppercase tracking-[0.35em] text-gray-500 sm:text-right">
                      {notification.createdAt}
                    </p>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-gray-300">{notification.body}</p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {notification.code && (
                      <div className="overflow-hidden rounded-3xl bg-white/5 px-4 py-3 text-sm text-white shadow-sm shadow-black/10">
                        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Coupon code</p>
                        <p className="mt-2 font-semibold">{notification.code}</p>
                      </div>
                    )}
                    {notification.orderNumber && (
                      <div className="overflow-hidden rounded-3xl bg-white/5 px-4 py-3 text-sm text-white shadow-sm shadow-black/10">
                        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Order number</p>
                        <p className="mt-2 font-semibold">{notification.orderNumber}</p>
                        {notification.status && (
                          <span className="mt-3 inline-flex rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                            {notification.status}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[28px] border border-dashed border-white/10 bg-white/5 p-12 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-3xl text-[#ff4d6d] shadow-inner shadow-[#ff4d6d]/5">
                🔔
              </div>
              <p className="mt-6 text-base text-gray-300">You’ll see coupon announcements and delivery updates here once they arrive.</p>
              <button
                onClick={() => navigate('/offers')}
                className="mt-8 inline-flex rounded-full bg-gradient-to-r from-[#ff4d6d] to-[#e63c5a] px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-[#ff4d6d]/20 transition hover:opacity-95"
              >
                Browse offers
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
