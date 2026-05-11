import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function OtpForm({ email }: { email: string }) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const { verifyOtp, resendOtp, loading, error, otpSuccess, clearError } = useAuthStore();

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Auto-navigate after successful verification
  useEffect(() => {
    if (otpSuccess) {
      const t = setTimeout(() => navigate('/auth'), 1800);
      return () => clearTimeout(t);
    }
  }, [otpSuccess, navigate]);

  const handleChange = useCallback((index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    clearError();

    setDigits(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });

    if (value && index < 5) {
      setTimeout(() => refs.current[index + 1]?.focus(), 0);
    }
  }, [clearError]);

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        handleChange(index, '');
      } else if (index > 0) {
        refs.current[index - 1]?.focus();
        handleChange(index - 1, '');
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 0) return;

    const next = ['', '', '', '', '', ''];
    pasted.split('').forEach((ch, i) => { if (i < 6) next[i] = ch; });
    setDigits(next);

    const focusIdx = Math.min(pasted.length, 5);
    setTimeout(() => refs.current[focusIdx]?.focus(), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length < 6) return;
    try {
      await verifyOtp(email, otp);
    } catch {
      // Shake the inputs
      setDigits(['', '', '', '', '', '']);
      setTimeout(() => refs.current[0]?.focus(), 50);
    }
  };

  const handleResend = async () => {
    if (!canResend || resendLoading) return;
    setResendLoading(true);
    try {
      await resendOtp(email);
      setCountdown(30);
      setCanResend(false);
      setDigits(['', '', '', '', '', '']);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
      refs.current[0]?.focus();
    } finally {
      setResendLoading(false);
    }
  };

  const otp = digits.join('');
  const isFilled = otp.length === 6;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 animate-fadeIn" noValidate>

      {/* Header */}
      <div className="text-center space-y-1">
        <div className="text-4xl mb-3">📬</div>
        <p className="text-gray-300 text-sm font-medium">Verification code sent to</p>
        <p className="text-white font-semibold text-sm">{email}</p>
        <p className="text-gray-600 text-xs">Check your inbox (and spam folder)</p>
      </div>

      {/* OTP boxes */}
      <div className="flex gap-2.5 justify-center" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={d}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            onFocus={e => e.target.select()}
            className={`
              w-12 h-13 text-center text-xl font-bold rounded-2xl border-2 transition-all duration-200
              focus:outline-none focus:scale-105
              ${otpSuccess
                ? 'border-green-500 bg-green-500/10 text-green-400'
                : error
                  ? 'border-red-500/60 bg-red-500/8 text-white'
                  : d
                    ? 'border-[#ff4d6d]/70 bg-[#ff4d6d]/10 text-white'
                    : 'border-white/15 bg-white/5 text-white focus:border-[#ff4d6d]/60 focus:bg-[#ff4d6d]/8'
              }
            `}
            style={{ height: '52px' }}
            disabled={loading || otpSuccess}
          />
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-fadeIn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" className="shrink-0">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )}

      {/* Success banner */}
      {otpSuccess && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 animate-fadeIn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" className="shrink-0">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <p className="text-green-400 text-xs font-medium">Email verified! Redirecting to login...</p>
        </div>
      )}

      {/* Resend success */}
      {resendSuccess && !error && (
        <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 animate-fadeIn">
          <p className="text-blue-400 text-xs">A new OTP has been sent to your email.</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!isFilled || loading || otpSuccess}
        className="relative w-full py-3 rounded-2xl font-semibold text-sm text-white transition-all overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: otpSuccess
            ? 'linear-gradient(135deg, #22c55e, #16a34a)'
            : 'linear-gradient(135deg, #ff4d6d, #e63c5a)',
          boxShadow: '0 8px 25px rgba(255,77,109,0.3)',
          fontFamily: 'Sora, sans-serif',
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Verifying...
          </span>
        ) : otpSuccess ? '✓ Verified!' : 'Verify OTP'}
        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12 pointer-events-none" />
      </button>

      {/* Resend row */}
      <p className="text-center text-xs text-gray-600">
        Didn't get the code?{' '}
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="text-[#ff4d6d] hover:text-pink-300 font-semibold transition-colors disabled:opacity-50"
          >
            {resendLoading ? 'Sending...' : 'Resend OTP'}
          </button>
        ) : (
          <span className="text-gray-500">
            Resend in <span className="text-white font-medium tabular-nums">{countdown}s</span>
          </span>
        )}
      </p>
    </form>
  );
}

