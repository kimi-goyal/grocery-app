
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '../store/adminAuthStore';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const { login, loading, error } = useAdminAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) navigate('/management/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#07111A] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#FF4D8D]/6 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeUp">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FF4D8D]/15 border border-[#FF4D8D]/30 flex items-center justify-center">
              <ShieldCheck size={22} className="text-[#FF4D8D]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Sora,sans-serif' }}>
            Admin <span className="text-[#FF4D8D]">Portal</span>
          </h1>
          <p className="text-[#94A3B8] text-sm">FreshCart Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[rgba(17,25,40,0.85)] border border-white/10 rounded-2xl p-6 space-y-4 animate-fadeUp delay-100 backdrop-blur-xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-red-400 rounded-full" /> {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#94A3B8]">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@domain.com"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4D8D]/50 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#94A3B8]">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4D8D]/50 transition-all"
              />
              <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all mt-2"
            style={{
              background: loading ? 'rgba(255,77,141,0.4)' : 'linear-gradient(135deg, #FF4D8D, #e63c7a)',
              color: '#fff',
              fontFamily: 'Sora,sans-serif',
              boxShadow: loading ? 'none' : '0 8px 25px rgba(255,77,141,0.3)',
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Authenticating...
              </span>
            ) : 'Login to Admin Panel'}
          </button>

          {/* <p className="text-center text-xs text-[#94A3B8] mt-2">
            Demo: <span className="text-white">vidishakharbanda20@gmail.com</span> / <span className="text-white">admin123</span>
          </p> */}
        </form>
      </div>
    </div>
  );
}


