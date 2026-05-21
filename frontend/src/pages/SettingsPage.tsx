import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [lightMode, setLightMode] = useState(false);

  useEffect(() => {
    const previous = document.body.style.backgroundColor;
    document.body.style.backgroundColor = lightMode ? '#f8fafc' : '#050816';
    return () => {
      document.body.style.backgroundColor = previous;
    };
  }, [lightMode]);

  return (
    <div className={`${lightMode ? 'bg-[#f8fafc]' : 'bg-[#050816]'} min-h-screen pb-16`}>
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <button
          onClick={() => navigate(-1)}
          className={`${lightMode ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'} inline-flex items-center gap-2 transition-colors mb-5 text-sm`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </button>

        <div className={`${lightMode ? 'bg-white/90 border-slate-200 text-slate-900' : 'bg-[rgba(11,18,36,0.82)] border-white/10 text-white'} rounded-3xl border p-6 backdrop-blur-xl`}>
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Settings</p>
            <h1 className="mt-3 text-3xl font-bold" style={{ fontFamily: 'Sora,sans-serif' }}>
              Appearance & preferences
            </h1>
            <p className={`${lightMode ? 'text-slate-600' : 'text-gray-400'} mt-3 text-sm leading-6`}>
              Switch between dark and light mode on this page, and preview a cleaner UI layout for your settings.
            </p>
          </div>

          <div className={`${lightMode ? 'bg-white' : 'bg-[#0b1224]/90'} rounded-3xl border p-5`} style={{ borderColor: lightMode ? 'rgba(148,163,184,0.2)' : 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className={`${lightMode ? 'text-slate-900' : 'text-white'} text-base font-semibold`}>Theme mode</p>
                <p className={`${lightMode ? 'text-slate-500' : 'text-gray-400'} text-sm mt-1`}>Use light mode for a brighter look.</p>
              </div>
              <button
                onClick={() => setLightMode((prev) => !prev)}
                className={`${lightMode ? 'bg-slate-900 text-white' : 'bg-[#ff4d6d] text-white'} rounded-full px-4 py-2 text-sm font-semibold transition`}
              >
                {lightMode ? 'Dark mode' : 'Light mode'}
              </button>
            </div>
          </div>

          <div className={`${lightMode ? 'bg-slate-50' : 'bg-[#121a2d]/90'} mt-6 rounded-3xl border p-5`} style={{ borderColor: lightMode ? 'rgba(148,163,184,0.2)' : 'rgba(255,255,255,0.08)' }}>
            <p className={`${lightMode ? 'text-slate-900' : 'text-white'} text-sm font-semibold`}>Notification preferences</p>
            <p className={`${lightMode ? 'text-slate-500' : 'text-gray-400'} mt-2 text-sm`}>We’ll keep the original notification layout but the page will look lighter when toggled.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
