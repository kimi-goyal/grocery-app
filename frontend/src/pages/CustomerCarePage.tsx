import { useNavigate } from 'react-router-dom';

export default function CustomerCarePage() {
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

        <div className="rounded-3xl border border-white/10 bg-[rgba(11,18,36,0.82)] p-6 backdrop-blur-xl">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Customer Care</p>
            <h1 className="mt-3 text-3xl font-bold text-white" style={{ fontFamily: 'Sora,sans-serif' }}>
              We're here to help
            </h1>
            <p className="mt-3 text-sm text-gray-400 leading-6">
              Have a question about orders, delivery, or your account? Our customer care team is available to support you.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                label: 'Live chat',
                value: 'Chat with our support team in real time.',
                icon: '💬',
              },
              {
                label: 'Call Us',
                value: '+91 98765 43210\nMon - Fri, 9am - 8pm',
                icon: '📞',
              },
              {
                label: 'Email',
                value: 'support@freshcart.com\nResponse in 1 business day',
                icon: '✉️',
              },
              {
                label: 'FAQs',
                value: 'Find answers for orders, coupons and payments.',
                icon: '❓',
              },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-[#0b1224]/90 p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-[10px] uppercase tracking-[0.35em] text-gray-500">{item.label}</span>
                </div>
                <p className="mt-4 text-sm text-gray-300 whitespace-pre-line">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-[#121a2d]/80 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-400">Need a callback?</p>
                <p className="text-white font-semibold">Request a callback from our team.</p>
              </div>
              <button
                onClick={() => alert('Customer care callback requested!')}
                className="rounded-2xl bg-gradient-to-r from-[#ff4d6d] to-[#e63c5a] px-4 py-3 text-sm font-semibold text-white hover:opacity-90 transition"
              >
                Request now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
