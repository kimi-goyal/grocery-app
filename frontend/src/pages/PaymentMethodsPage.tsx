import { useNavigate } from 'react-router-dom';

export default function PaymentMethodsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050816] pb-16">
      <div className="max-w-2xl mx-auto px-4 pt-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6 text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Sora,sans-serif' }}>
            Payment Methods
          </h1>
          <p className="text-gray-400 text-sm">Manage your saved cards, UPI, and wallets</p>
        </div>

        {/* Coming Soon */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
          <div className="text-5xl mb-4">💳</div>
          <p className="text-gray-300 text-lg font-semibold mb-2">Payment Methods Coming Soon</p>
          <p className="text-gray-500 text-sm mb-6">
            You can add and manage payment methods during checkout
          </p>
          <button
            onClick={() => navigate('/checkout')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white transition-all"
            style={{
              background: 'linear-gradient(135deg,#ff4d6d,#e63c5a)',
              boxShadow: '0 8px 24px rgba(255,77,109,0.3)',
            }}
          >
            Go to Checkout
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
