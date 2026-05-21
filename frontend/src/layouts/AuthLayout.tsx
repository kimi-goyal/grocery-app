import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import OtpForm from '../components/auth/OtpForm';
import groceryImage from "../assets/bgimage.png"

type Tab = 'login' | 'register';

export default function AuthLayout() {
  const [tab, setTab] = useState<Tab>('login');
  const { skipAsGuest, authStep, pendingEmail, isAuthenticated, clearError, clearFieldErrors } = useAuthStore();
  const navigate = useNavigate();

  const showOtp = authStep === 'pending_otp' && !!pendingEmail;

  useEffect(() => {
    if (isAuthenticated) navigate('/home', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSkip = () => { skipAsGuest(); navigate('/home'); };

  const switchTab = (newTab: Tab) => {
    clearError();
    clearFieldErrors();
    setTab(newTab);
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#ff4d6d]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative z-10">
        <div className="hidden lg:flex flex-col justify-between p-12 relative">

          <div className="absolute inset-0 opacity-20
         bg-black" />

          <div className="relative z-10">
            <h1 className="text-5xl font-bold leading-tight">
              Fresh groceries delivered in
              <span className="text-[#ff4d6d]"> 10 minutes</span>
            </h1>
            <p className="text-gray-400 mt-6 text-lg">
              Order fresh groceries instantly at your doorstep.
            </p>
          </div>

          <img
            src={groceryImage}
            className="relative z-10 w-[90%] mx-auto"
          />
        </div>
        {/* ── RIGHT AUTH ── */}
        <div className="p-8 md:p-12 bg-[radial-gradient(circle_at_left,#ff4d6d10,transparent_60%)] flex flex-col justify-center">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden mb-6">
            <div className="w-8 h-8 rounded-xl bg-[#ff4d6d]/20 border border-[#ff4d6d]/30 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff4d6d" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
            <span className="font-bold">
              Fresh<span className="text-[#ff4d6d]">Cart</span>
            </span>
          </div>

          {showOtp ? (
            /* ✅ OTP SCREEN */
            <div className="max-w-md w-full">
              <div className="mb-6">
                <button
                  onClick={() => {
                    useAuthStore.getState().clearError();
                    useAuthStore.setState({
                      authStep: 'idle',
                      pendingEmail: null,
                      error: null,
                    });
                  }}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4"
                >
                  ← Back
                </button>

                <h2 className="text-2xl font-bold text-white mb-1">
                  Verify Email ✉️
                </h2>
                <p className="text-gray-400 text-sm">
                  We sent a 6-digit code to your inbox
                </p>
              </div>

              <OtpForm email={pendingEmail!} />

              <button
                onClick={handleSkip}
                className="mt-6 text-sm text-gray-400 hover:text-white w-full text-center"
              >
                Skip for now
              </button>
            </div>
          ) : (
            /* ✅ LOGIN / REGISTER */
            <div className="max-w-md w-full">
              {/* ✅ CLEAN TABS (only one set) */}
              <div className="flex gap-6 mb-6 text-lg">
                <button
                  onClick={() => switchTab('login')}
                  className={`${tab === 'login'
                      ? 'text-[#ff4d6d] border-b border-[#ff4d6d]'
                      : 'text-gray-400'
                    } pb-1`}
                >
                  Login
                </button>

                <button
                  onClick={() => switchTab('register')}
                  className={`${tab === 'register'
                      ? 'text-[#ff4d6d] border-b border-[#ff4d6d]'
                      : 'text-gray-400'
                    } pb-1`}
                >
                  Signup
                </button>
              </div>

              {tab === 'login' ? (
                <LoginForm
                  onSwitch={() => switchTab('register')}
                  onNeedsOtp={() => { /* authStore already handles state */ }}
                />
              ) : (
                <RegisterForm
                  onSwitch={() => switchTab('login')} 
                  onRegistered={() => { /* authStore sets authStep=pending_otp */ }} />
              )}

              {/* ✅ SKIP (single) */}
              <button
                onClick={handleSkip}
                className="mt-6 text-sm text-gray-400 hover:text-white"
              >
                Skip for now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// {tab === 'login' ? (
//               <LoginForm
//                 onSwitch={() => switchTab('register')}
//                 onNeedsOtp={() => { /* authStore already handles state */ }}
//               />
//             ) : (
//               <RegisterForm
//                 onSwitch={() => switchTab('login')}
//                 onRegistered={() => { /* authStore sets authStep=pending_otp */ }}
//               />
//             )}