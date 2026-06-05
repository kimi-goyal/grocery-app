import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
 
export default function CustomerCarePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
 
  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
 
    try {
      const response = await fetch('http://localhost:8000/api/v1/callback/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          message: formData.message || undefined,
        }),
      });
 
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', message: '' });
        setShowCallbackForm(false);
       
        // Reset success message after 3 seconds
        setTimeout(() => setSubmitStatus('idle'), 3000);
      } else {
        const errorData = await response.json();
        setSubmitStatus('error');
        setErrorMessage(errorData.detail || 'Failed to submit callback request');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
 
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
 
          {/* Success Alert */}
          {submitStatus === 'success' && (
            <div className="mt-6 rounded-3xl border border-green-500/30 bg-green-500/10 p-5">
              <p className="text-green-400 font-semibold">✓ Callback request submitted successfully!</p>
              <p className="text-green-300 text-sm mt-2">Our team will contact you soon at {formData.email}</p>
            </div>
          )}
 
          {/* Error Alert */}
          {submitStatus === 'error' && (
            <div className="mt-6 rounded-3xl border border-red-500/30 bg-red-500/10 p-5">
              <p className="text-red-400 font-semibold">✗ {errorMessage}</p>
            </div>
          )}
 
          {/* Callback Request Section */}
          <div className="mt-6 rounded-3xl border border-white/10 bg-[#121a2d]/80 p-5">
            {!showCallbackForm ? (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400">Need a callback?</p>
                  <p className="text-white font-semibold">Request a callback from our team.</p>
                </div>
                <button
                  onClick={() => setShowCallbackForm(true)}
                  className="rounded-2xl bg-gradient-to-r from-[#ff4d6d] to-[#e63c5a] px-4 py-3 text-sm font-semibold text-white hover:opacity-90 transition whitespace-nowrap"
                >
                  Request now
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-white font-semibold mb-4">Request a Callback</h3>
                <form onSubmit={handleCallbackSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4D8D]/40 transition-all"
                      placeholder="Your name"
                    />
                  </div>
 
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4D8D]/40 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
 
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Phone (Optional)</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4D8D]/40 transition-all"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
 
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Message (Optional)</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4D8D]/40 transition-all resize-none"
                      placeholder="Tell us what you need help with..."
                    />
                  </div>
 
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 rounded-2xl bg-gradient-to-r from-[#ff4d6d] to-[#e63c5a] px-4 py-3 text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
                    >
                      {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCallbackForm(false)}
                      className="rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
 
 