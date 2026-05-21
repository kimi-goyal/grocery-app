import { useNavigate } from 'react-router-dom';

export default function NotificationPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050816] pb-16">
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-5 text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </button>

        <div className="rounded-3xl border border-white/10 bg-[rgba(11,18,36,0.82)] p-8 backdrop-blur-xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Notifications</p>
          <h1 className="mt-4 text-3xl font-bold text-white" style={{ fontFamily: 'Sora,sans-serif' }}>
            Notifications coming soon
          </h1>
          <p className="mt-4 text-sm text-gray-400 leading-6">
            We’re keeping this section on hold for now. Once it’s ready, you’ll receive updates about deliveries, offers and alerts here.
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="mt-8 rounded-2xl bg-gradient-to-r from-[#ff4d6d] to-[#e63c5a] px-5 py-3 text-sm font-semibold text-white hover:opacity-90 transition"
          >
            Back to profile
          </button>
        </div>
      </div>
    </div>
  );
}
