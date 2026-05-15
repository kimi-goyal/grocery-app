import { useEffect, useState } from 'react';
import { useAddressStore } from '../../store/addressStore';
import { useCheckoutStore } from '../../store/checkoutStore';
import AddressForm from './AddressForm';
import type { Address } from '../../types/checkout.types';

export default function AddressStep() {
  const { addresses, loading, fetchAddresses, deleteAddress } = useAddressStore();
  const { selectedAddressId, setSelectedAddress, setStep } = useCheckoutStore();
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Auto-select default or first
  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      const def = addresses.find(a => a.is_default) || addresses[0];
      setSelectedAddress(def.id);
    }
  }, [addresses]);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
    await deleteAddress(id);
    setDeletingId(null);
    if (selectedAddressId === id && addresses.length > 1) {
      const next = addresses.find(a => a.id !== id);
      if (next) setSelectedAddress(next.id);
    }
  };

  const handleContinue = () => {
    if (!selectedAddressId) return;
    setStep(3);
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        {[1, 2].map(i => (
          <div key={i} className="h-28 bg-white/4 border border-white/6 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeUp">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Sora,sans-serif' }}>Delivery Address</h2>
          <p className="text-gray-500 text-xs mt-0.5">Choose where we deliver your order</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#ff4d6d] border border-[#ff4d6d]/25 bg-[#ff4d6d]/8 hover:bg-[#ff4d6d]/15 transition-all"
            style={{ fontFamily: 'Sora,sans-serif' }}
          >
            <span className="text-sm">+</span> Add Address
          </button>
        )}
      </div>

      {/* Add form */}
      {showForm && (
        <AddressForm
          onClose={() => setShowForm(false)}
          onSaved={(addr) => { setSelectedAddress(addr.id); setShowForm(false); }}
        />
      )}

      {/* Address list */}
      {addresses.length === 0 && !showForm ? (
        <div
          onClick={() => setShowForm(true)}
          className="flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-[#ff4d6d]/25 hover:bg-[#ff4d6d]/3 transition-all"
        >
          <div className="text-4xl">📍</div>
          <p className="text-gray-400 text-sm font-medium">No saved addresses</p>
          <p className="text-gray-600 text-xs">Click to add your first delivery address</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {addresses.map(addr => {
            const selected = selectedAddressId === addr.id;
            return (
              <div
                key={addr.id}
                onClick={() => setSelectedAddress(addr.id)}
                className="relative rounded-2xl p-4 cursor-pointer transition-all"
                style={{
                  border: selected ? '1.5px solid rgba(255,77,109,0.5)' : '1.5px solid rgba(255,255,255,0.07)',
                  background: selected ? 'rgba(255,77,109,0.05)' : 'rgba(255,255,255,0.02)',
                  boxShadow: selected ? '0 0 20px rgba(255,77,109,0.08)' : 'none',
                }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{addr.tag === 'Home' ? '🏠' : addr.tag === 'Work' ? '💼' : '📍'}</span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider"
                      style={{
                        color: selected ? '#ff4d6d' : 'rgba(255,255,255,0.35)',
                        background: selected ? 'rgba(255,77,109,0.12)' : 'rgba(255,255,255,0.05)',
                        border: selected ? '1px solid rgba(255,77,109,0.25)' : '1px solid rgba(255,255,255,0.06)',
                        fontFamily: 'Sora,sans-serif',
                      }}
                    >
                      {addr.tag}
                    </span>
                    {addr.is_default && (
                      <span className="text-[9px] font-bold text-green-400 bg-green-500/12 border border-green-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Delete */}
                    <button
                      onClick={(e) => handleDelete(addr.id, e)}
                      disabled={deletingId === addr.id}
                      className="w-6 h-6 rounded-lg bg-red-500/8 hover:bg-red-500/20 border border-red-500/15 flex items-center justify-center text-red-400 opacity-60 hover:opacity-100 transition-all"
                    >
                      {deletingId === addr.id ? (
                        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                      ) : (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                        </svg>
                      )}
                    </button>
                    {/* Radio */}
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center transition-all"
                      style={{
                        border: selected ? '2px solid #ff4d6d' : '2px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      {selected && <div className="w-2 h-2 rounded-full bg-[#ff4d6d]" />}
                    </div>
                  </div>
                </div>

                <p className="text-white text-sm font-semibold mb-1" style={{ fontFamily: 'Sora,sans-serif' }}>{addr.name}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{addr.line1}</p>
                {addr.line2 && <p className="text-gray-500 text-xs">{addr.line2}</p>}
                <p className="text-gray-600 text-[10px] mt-2">{addr.phone}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Continue */}
      <button
        onClick={handleContinue}
        disabled={!selectedAddressId}
        className="w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{
          background: 'linear-gradient(135deg,#ff4d6d,#e63c5a)',
          fontFamily: 'Sora,sans-serif',
          boxShadow: selectedAddressId ? '0 8px 24px rgba(255,77,109,0.3)' : 'none',
        }}
      >
        Continue to Payment
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
    </div>
  );
}



