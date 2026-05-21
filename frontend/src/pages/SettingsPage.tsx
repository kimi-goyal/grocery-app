import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{7,15}$/;

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, updateMe } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setStatus('');

    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (phone && !phoneRegex.test(phone)) {
      setError('Phone number should be 7 to 15 digits.');
      return;
    }

    setSaving(true);
    try {
      await updateMe({ name: name.trim(), email: email.trim(), phone: phone.trim() });
      setStatus('Profile updated successfully.');
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Unable to save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050816] text-white px-4 py-10">
        <div className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-[#0b1224]/90 p-8 text-center">
          <p className="text-sm text-gray-400">Please log in to manage your profile settings.</p>
          <button
            onClick={() => navigate('/auth')}
            className="mt-6 rounded-full bg-[#ff4d6d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff6f86]"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,77,109,0.18),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.14),_transparent_35%),#050816] text-white py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white mb-6"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </button>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-[#0b1224]/60">
          <div className="space-y-3 mb-8">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Account</p>
            <h1 className="text-4xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
              Profile Settings
            </h1>
            <p className="max-w-xl text-sm text-slate-300 leading-7">
              Update your name, email, and phone number for your logged-in profile. Changes will be saved securely and reflected across your FreshCart account.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[1.75rem] border border-white/10 bg-[#07101f]/95 p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-[0.16em]">Profile information</p>
                  <h2 className="mt-2 text-xl font-semibold">Personal details</h2>
                </div>
                <div className="rounded-3xl bg-[#0f172a] px-4 py-2 text-xs text-slate-300">Editable</div>
              </div>

              <form className="space-y-5" onSubmit={handleSave}>
                <label className="block">
                  <span className="text-sm text-slate-300">Full name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your full name"
                    className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#ff4d6d] focus:ring-2 focus:ring-[#ff4d6d]/20"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-slate-300">Email address</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-slate-300">Phone number</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="1234567890"
                    className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#c084fc] focus:ring-2 focus:ring-[#c084fc]/20"
                  />
                </label>

                {error && (
                  <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                {status && (
                  <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                    {status}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff4d6d] to-[#f97316] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
              </form>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-[#07101f]/95 p-6">
              <h3 className="text-lg font-semibold text-white">Profile preview</h3>
              <p className="mt-2 text-sm text-slate-400">
                This is your logged-in profile information, which we use for orders, notifications, and account access.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Name</p>
                  <p className="mt-2 text-base font-medium text-white">{name || user.name}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Email</p>
                  <p className="mt-2 text-base font-medium text-white">{email || user.email}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Phone</p>
                  <p className="mt-2 text-base font-medium text-white">{phone || user.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
