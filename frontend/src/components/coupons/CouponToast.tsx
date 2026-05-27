
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface ToastData {
  id: string;
  type: 'new_coupon' | 'expiry_warning';
  title: string;
  body: string;
  code?: string;
  hours?: number;
}

interface Props {
  toast: ToastData;
  onClose: (id: string) => void;
}

export function CouponToast({ toast, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 50);
    const t2 = setTimeout(() => handleClose(), 7000); // auto-dismiss
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleClose = () => {
    setLeaving(true);
    setTimeout(() => onClose(toast.id), 400);
  };

  const handleApply = () => {
    navigate('/checkout');
    handleClose();
  };

  const isUrgent = toast.type === 'expiry_warning';

  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-2xl max-w-sm w-full"
      style={{
        background: isUrgent
          ? 'rgba(30,8,8,0.97)'
          : 'rgba(11,18,32,0.97)',
        border: isUrgent
          ? '1px solid rgba(239,68,68,0.35)'
          : '1px solid rgba(255,77,109,0.3)',
        transform: `translateX(${visible && !leaving ? '0' : '110%'})`,
        opacity: visible && !leaving ? 1 : 0,
        transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
        backdropFilter: 'blur(24px)',
      }}
    >
      {/* Progress bar */}
      <div
        className="absolute top-0 left-0 h-0.5 rounded-full"
        style={{
          background: isUrgent ? '#ef4444' : '#ff4d6d',
          animation: 'shrink 7s linear forwards',
          width: '100%',
        }}
      />

      <div className="p-4 flex gap-3">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{
            background: isUrgent ? 'rgba(239,68,68,0.12)' : 'rgba(255,77,109,0.12)',
            border: isUrgent ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(255,77,109,0.25)',
          }}
        >
          {isUrgent ? '⏰' : '🎁'}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-bold leading-tight" style={{ fontFamily: 'Sora,sans-serif' }}>
            {toast.title}
          </p>
          <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{toast.body}</p>

          {toast.code && (
            <div className="flex items-center gap-2 mt-2.5">
              <code
                className="text-xs font-black tracking-widest px-2 py-1 rounded-lg"
                style={{
                  color: isUrgent ? '#ef4444' : '#ff4d6d',
                  background: isUrgent ? 'rgba(239,68,68,0.1)' : 'rgba(255,77,109,0.1)',
                  border: `1px dashed ${isUrgent ? 'rgba(239,68,68,0.3)' : 'rgba(255,77,109,0.3)'}`,
                }}
              >
                {toast.code}
              </code>
              <button
                onClick={handleApply}
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg text-white"
                style={{
                  background: isUrgent ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'linear-gradient(135deg,#ff4d6d,#e63c5a)',
                  fontFamily: 'Sora,sans-serif',
                }}
              >
                Use Now
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleClose}
          className="text-gray-600 hover:text-gray-400 transition-colors shrink-0 self-start"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <style>{`@keyframes shrink { from{width:100%} to{width:0%} }`}</style>
    </div>
  );
}
