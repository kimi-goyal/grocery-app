import { useState } from 'react';
import MapPicker from './MapPicker';
import { useAddressStore } from '../../store/addressStore';
import type { Address } from '../../types/checkout.types';

interface Props {
  onClose: () => void;
  onSaved: (addr: Address) => void;
}

export default function AddressForm({ onClose, onSaved }: Props) {
  const { addAddress } = useAddressStore();
  const [form, setForm] = useState({
    tag: 'Home' as 'Home' | 'Work' | 'Other',
    name: '', line1: '', line2: '', phone: '',
    lat: 0, lng: 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleMapSelect = (lat: number, lng: number, address: string) => {
    setForm(f => ({ ...f, lat, lng, line1: address }));
  };

  const getApiErrorMessage = (error: unknown, fallback: string) => {
    const err = error as { response?: { data?: { detail?: unknown } } };
    const detail = err?.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail.map(item => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object' && 'msg' in item && typeof (item as { msg?: unknown }).msg === 'string') {
          return (item as { msg?: unknown }).msg;
        }
        return JSON.stringify(item);
      }).join('; ');
    }
    if (detail !== undefined && detail !== null) return String(detail);
    return fallback;
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.line1.trim() || !form.phone.trim()) {
      setError('Please fill Name, Address, and Phone.');
      return;
    }
    setSaving(true);
    setError('');
    try {
    //   const saved = await addAddress({ ...form, is_default: false });
      const saved = await addAddress(form);
      onSaved(saved);
    } catch (e: unknown) {
      setError(getApiErrorMessage(e, 'Failed to save address.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-[rgba(11,18,32,0.9)] animate-fadeUp">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
        <h4 className="text-white font-bold text-sm" style={{ fontFamily: 'Sora,sans-serif' }}>
          New Delivery Address
        </h4>
        <button onClick={onClose} className="w-7 h-7 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 transition-colors">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Map picker */}
        <MapPicker onLocationSelect={handleMapSelect} />

        {/* Tag selector */}
        <div>
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest block mb-2">
            Address Type
          </label>
          <div className="flex gap-2">
            {(['Home', 'Work', 'Other'] as const).map(t => (
              <button
                key={t}
                onClick={() => setForm(f => ({ ...f, tag: t }))}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: form.tag === t ? 'rgba(255,77,109,0.12)' : 'rgba(255,255,255,0.04)',
                  border: form.tag === t ? '1px solid rgba(255,77,109,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  color: form.tag === t ? '#ff4d6d' : 'rgba(255,255,255,0.4)',
                  fontFamily: 'Sora,sans-serif',
                }}
              >
                {t === 'Home' ? '🏠' : t === 'Work' ? '💼' : '📍'} {t}
              </button>
            ))}
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Full Name *" placeholder="John Doe" value={form.name} onChange={set('name')} />
          <Field label="Phone *" placeholder="+91 99999 99999" value={form.phone} onChange={set('phone')} />
          <div className="col-span-2">
            <Field label="Address Line 1 *" placeholder="Flat, Building, Street" value={form.line1} onChange={set('line1')} />
          </div>
          <div className="col-span-2">
            <Field label="Area, City, Pincode" placeholder="Bandra West, Mumbai — 400050" value={form.line2} onChange={set('line2')} />
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm transition-all">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg,#ff4d6d,#e63c5a)', fontFamily: 'Sora,sans-serif', boxShadow: '0 6px 20px rgba(255,77,109,0.3)' }}
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Saving...
              </span>
            ) : 'Save Address'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder, value, onChange }: {
  label: string; placeholder: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">{label}</label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-white/5 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ff4d6d]/40 focus:bg-white/7 transition-all"
        style={{ fontFamily: 'DM Sans,sans-serif' }}
      />
    </div>
  );
}




