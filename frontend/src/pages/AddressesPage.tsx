import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddressStore } from '../store/addressStore';
import AddressForm from '../components/checkout/AddressForm';
//import type { Address } from '../types/checkout.types';

export default function AddressesPage() {
  const navigate = useNavigate();
  const { addresses, loading, fetchAddresses, deleteAddress } = useAddressStore();
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
    await deleteAddress(id);
    setDeletingId(null);
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#ff4d6d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
            Saved Addresses
          </h1>
          <p className="text-gray-400 text-sm">Manage your delivery addresses</p>
        </div>

        {/* Add Address Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[#ff4d6d] border border-[#ff4d6d]/25 bg-[#ff4d6d]/8 hover:bg-[#ff4d6d]/15 transition-all"
            style={{ fontFamily: 'Sora,sans-serif' }}
          >
            <span className="text-base">+</span> Add New Address
          </button>
        )}

        {/* Add Form */}
        {showForm && (
          <div className="mb-6">
            <AddressForm
              onClose={() => setShowForm(false)}
              onSaved={() => {
                setShowForm(false);
                fetchAddresses();
              }}
            />
          </div>
        )}

        {/* Address List */}
        {addresses.length === 0 && !showForm ? (
          <div
            onClick={() => setShowForm(true)}
            className="flex flex-col items-center justify-center gap-3 p-12 border-2 border-dashed border-white/10 rounded-3xl cursor-pointer hover:border-[#ff4d6d]/25 hover:bg-[#ff4d6d]/3 transition-all"
          >
            <div className="text-5xl">📍</div>
            <p className="text-gray-400 text-base font-medium">No saved addresses</p>
            <p className="text-gray-600 text-sm">Click to add your first delivery address</p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map(addr => (
              <div
                key={addr.id}
                className="rounded-2xl p-4 border transition-all"
                style={{
                  border: '1.5px solid rgba(255,255,255,0.07)',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{addr.tag === 'Home' ? '🏠' : addr.tag === 'Work' ? '💼' : '📍'}</span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider"
                      style={{
                        color: 'rgba(255,255,255,0.6)',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.06)',
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
                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDelete(addr.id, e)}
                    disabled={deletingId === addr.id}
                    className="w-6 h-6 rounded-lg bg-red-500/8 hover:bg-red-500/20 border border-red-500/15 flex items-center justify-center text-red-400 opacity-60 hover:opacity-100 transition-all"
                  >
                    {deletingId === addr.id ? (
                      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4h6v2" />
                      </svg>
                    )}
                  </button>
                </div>

                <p className="text-white text-sm font-semibold mb-1" style={{ fontFamily: 'Sora,sans-serif' }}>
                  {addr.name}
                </p>
                <p className="text-gray-400 text-xs leading-relaxed">{addr.line1}</p>
                {addr.line2 && <p className="text-gray-500 text-xs">{addr.line2}</p>}
                <p className="text-gray-600 text-[10px] mt-2">{addr.phone}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
