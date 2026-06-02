
import { useEffect, useState } from 'react';
import AdminTopbar from '../components/AdminTopbar';
import Modal from '../components/Modal';
import AdminInput from '../components/AdminInput';
import AdminSelect from '../components/AdminSelect';
import { useCouponStore } from '../store/couponStore';
import { Plus, Trash2, ToggleLeft, ToggleRight, Tag } from 'lucide-react';

export default function CouponsPage() {
  const { coupons, loading, fetchCoupons, addCoupon, toggleActive, deleteCoupon } = useCouponStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: '', title: '', discount: '', type: 'percentage' as 'percentage' | 'flat', targetType: 'all' as 'all' | 'new_user', minOrder: '', maxDiscount: '', usageLimit: '', expiry: '', description: '', active: true, pushNotify: false, notifyBeforeExpiryHours: '24' });
  const set = (k: string, v: string | boolean | number) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!form.code.trim()) return console.error('Code is required');
    if (!form.title.trim()) return console.error('Title is required');
    if (!form.discount || Number(form.discount) <= 0) return console.error('Discount must be > 0');
    if (!form.minOrder && form.minOrder !== '0') return console.error('Min order is required');
    if (!form.maxDiscount && form.maxDiscount !== '0') return console.error('Max discount is required');
    if (!form.usageLimit && form.usageLimit !== '0') return console.error('Usage limit is required');
    if (!form.expiry) return console.error('Expiry date is required');
    
    const expiryDate = new Date(form.expiry);
    if (isNaN(expiryDate.getTime())) return console.error('Invalid expiry date');
    
    await addCoupon({
      code: form.code.toUpperCase(),
      title: form.title,
      discount: Number(form.discount),
      type: form.type,
      targetType: form.targetType,
      minOrder: Number(form.minOrder),
      maxDiscount: Number(form.maxDiscount),
      usageLimit: Number(form.usageLimit),
      expiry: expiryDate.toISOString(),
      description: form.description,
      active: form.active,
      pushNotify: form.pushNotify,
      notifyBeforeExpiryHours: Number(form.notifyBeforeExpiryHours),
    });
    setOpen(false);
    setForm({ code: '', title: '', discount: '', type: 'percentage', targetType: 'all', minOrder: '', maxDiscount: '', usageLimit: '', expiry: '', description: '', active: true, pushNotify: false, notifyBeforeExpiryHours: '24' });
  };

  const activeCount = coupons.filter(c => c.active).length;

  return (
    <div className="flex-1 overflow-y-auto">
      <AdminTopbar title="Coupons & Offers" />
      <div className="p-6 space-y-4">

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 animate-fadeUp">
          {[
            { label: 'Total Coupons', value: coupons.length, color: '#FF4D8D' },
            { label: 'Active', value: activeCount, color: '#22C55E' },
            { label: 'Total Uses', value: coupons.reduce((a, c) => a + c.usedCount, 0), color: '#3b82f6' },
          ].map(s => (
            <div key={s.label} className="bg-[rgba(17,25,40,0.75)] border border-white/8 rounded-2xl p-4">
              <div className="text-[#94A3B8] text-xs mb-1">{s.label}</div>
              <div className="text-2xl font-bold" style={{ color: s.color, fontFamily: 'Sora,sans-serif' }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between animate-fadeUp">
          <p className="text-[#94A3B8] text-sm">{coupons.length} coupons</p>
          <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg,#FF4D8D,#e63c7a)', fontFamily: 'Sora,sans-serif' }}>
            <Plus size={15} /> Create Coupon
          </button>
        </div>

        {loading ? (
          <div className="text-sm text-gray-400">Loading coupons…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-fadeUp delay-100">
            {coupons.map(c => {
              const usagePct = c.usageLimit > 0 ? Math.min((c.usedCount / c.usageLimit) * 100, 100) : 0;
              return (
                <div key={c.id} className={`bg-[rgba(17,25,40,0.75)] border rounded-2xl p-5 flex flex-col gap-4 transition-all ${c.active ? 'border-white/8 hover:border-[#FF4D8D]/20' : 'border-white/5 opacity-60'}`}>
                  {/* Code */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Tag size={14} className="text-[#FF4D8D]" />
                        <span className="text-[#FF4D8D] font-bold font-mono text-lg tracking-widest">{c.code}</span>
                      </div>
                      <div className="text-sm font-semibold text-white">{c.title}</div>
                      <p className="text-[#94A3B8] text-xs">{c.description}</p>
                    </div>
                    <button onClick={() => toggleActive(c.id)}>
                      {c.active
                        ? <ToggleRight size={22} className="text-[#22C55E]" />
                        : <ToggleLeft size={22} className="text-gray-600" />
                      }
                    </button>
                  </div>

                  {/* Discount info */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/3 rounded-xl p-3">
                      <div className="text-[#94A3B8] text-[10px]">Discount</div>
                      <div className="text-white font-bold text-sm mt-0.5">
                        {c.type === 'percentage' ? `${c.discount}%` : `₹${c.discount}`} off
                      </div>
                    </div>
                    <div className="bg-white/3 rounded-xl p-3">
                      <div className="text-[#94A3B8] text-[10px]">Min Order</div>
                      <div className="text-white font-bold text-sm mt-0.5">₹{c.minOrder}</div>
                    </div>
                    <div className="bg-white/3 rounded-xl p-3">
                      <div className="text-[#94A3B8] text-[10px]">Max Discount</div>
                      <div className="text-white font-bold text-sm mt-0.5">₹{c.maxDiscount}</div>
                    </div>
                    <div className="bg-white/3 rounded-xl p-3">
                      <div className="text-[#94A3B8] text-[10px]">Expires</div>
                      <div className="text-white text-xs mt-0.5">{new Date(c.expiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</div>
                    </div>
                  </div>

                  {/* Usage bar */}
                  <div>
                    <div className="flex justify-between text-[10px] text-[#94A3B8] mb-1.5">
                      <span>Usage: {c.usedCount} / {c.usageLimit}</span>
                      <span>{usagePct.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${usagePct}%`, background: usagePct > 80 ? '#ef4444' : '#FF4D8D' }} />
                    </div>
                  </div>

                  <button
                    onClick={() => deleteCoupon(c.id)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/8 hover:bg-red-500/15 text-red-400 text-xs transition-all"
                  >
                    <Trash2 size={12} /> Delete Coupon
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create New Coupon" size="lg">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <AdminInput label="Coupon Code *" placeholder="e.g. SAVE20" value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} required hint="Will be uppercased automatically" />
          </div>
          <div className="col-span-2">
            <AdminInput label="Coupon Title *" placeholder="e.g. Summer Sale" value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>
          <AdminSelect label="Discount Type" value={form.type} onChange={e => set('type', e.target.value)} options={[{ value: 'percentage', label: 'Percentage (%)' }, { value: 'flat', label: 'Flat Amount (₹)' }]} />
          <AdminSelect label="Coupon Target" value={form.targetType} onChange={e => set('targetType', e.target.value)} options={[{ value: 'all', label: 'All users' }, { value: 'new_user', label: 'First order users only' }]} />
          <AdminInput label={form.type === 'percentage' ? 'Discount % *' : 'Flat Amount (₹) *'} type="number" placeholder={form.type === 'percentage' ? '20' : '50'} value={form.discount} onChange={e => set('discount', e.target.value)} required />
          <AdminInput label="Min Order Value (₹) *" type="number" placeholder="100" value={form.minOrder} onChange={e => set('minOrder', e.target.value)} required />
          <AdminInput label="Max Discount (₹) *" type="number" placeholder="100" value={form.maxDiscount} onChange={e => set('maxDiscount', e.target.value)} required />
          <AdminInput label="Usage Limit *" type="number" placeholder="1000" value={form.usageLimit} onChange={e => set('usageLimit', e.target.value)} required />
          <AdminInput label="Expiry Date *" type="date" value={form.expiry} onChange={e => set('expiry', e.target.value)} required />
          <div className="col-span-2">
            <label className="text-xs font-medium text-[#94A3B8] block mb-1.5">Description</label>
            <textarea placeholder="Brief description..." value={form.description} onChange={e => set('description', e.target.value)} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4D8D]/50 transition-all resize-none" />
          </div>
          <div className="col-span-2 flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-white">
              <input type="checkbox" checked={form.pushNotify} onChange={e => set('pushNotify', e.target.checked)} className="h-4 w-4 rounded border-white/20 bg-slate-800 text-[#FF4D8D] focus:ring-[#FF4D8D]" />
              Send push notification to users when created
            </label>
          </div>
          {form.pushNotify && (
            <AdminInput label="Notify Before Expiry (hours)" type="number" placeholder="24" value={form.notifyBeforeExpiryHours} onChange={e => set('notifyBeforeExpiryHours', e.target.value)} hint="Send expiry warning N hours before expiry" />
          )}
          <div className="col-span-2 flex gap-3 pt-1">
            <button type="button" onClick={() => setOpen(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-[#94A3B8] hover:text-white text-sm transition-all">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg,#FF4D8D,#e63c7a)', fontFamily: 'Sora,sans-serif' }}>Create Coupon</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
