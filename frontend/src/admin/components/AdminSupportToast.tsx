import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminSupportToast() {
  const [msg, setMsg] = useState<{ from?: string; text: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const payload = e.detail as any;
      setMsg({ from: payload.from_name || `User ${payload.from_user_id}`, text: payload.text || '' });
      // auto-hide after 8s
      setTimeout(() => setMsg(null), 8000);
    };

    window.addEventListener('support:message', handler as EventListener);
    return () => window.removeEventListener('support:message', handler as EventListener);
  }, []);

  if (!msg) return null;

  return (
    <div className="fixed top-6 right-6 z-50 w-[320px]">
      <div className="p-3 rounded-2xl shadow-xl bg-white/6 border border-white/10 backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#FF4D6D]/20 flex items-center justify-center">🛒</div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">New support message</div>
            <div className="text-xs text-gray-300">{msg.from}</div>
            <div className="text-sm text-gray-100 mt-2 truncate">{msg.text}</div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => { navigate('/management/customer-service'); setMsg(null); }}
                className="px-3 py-1 rounded-md bg-[#ff4d6d] text-white text-sm"
              >Open</button>
              <button onClick={() => setMsg(null)} className="px-3 py-1 rounded-md bg-white/8 text-gray-200 text-sm">Dismiss</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
