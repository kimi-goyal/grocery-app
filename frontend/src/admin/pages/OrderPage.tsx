

import { useState } from 'react';
import AdminTopbar from '../components/AdminTopbar';
import StatusBadge from '../components/StatusBadge';
import { useOrderStore } from '../store/orderStore';
import type { OrderStatus } from '../store/orderStore';
import { Search, ChevronDown } from 'lucide-react';

const STATUSES: OrderStatus[] = ['Pending', 'Packed', 'On the Way', 'Delivered', 'Cancelled'];

export default function OrdersPage() {
  const { orders, updateStatus } = useOrderStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const filtered = orders.filter(o =>
    (filterStatus === 'All' || o.status === filterStatus) &&
    (o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <AdminTopbar title="Orders Management" />
      <div className="p-6 space-y-4">

        {/* Filters */}
        <div className="flex flex-wrap gap-3 animate-fadeUp">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4D8D]/40 transition-all w-64"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['All', ...STATUSES].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${filterStatus === s ? 'bg-[#FF4D8D]/15 border border-[#FF4D8D]/30 text-[#FF4D8D]' : 'bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white'}`}
              >
                {s}
              </button>
            ))}
          </div>
          <span className="text-[#94A3B8] text-sm self-center ml-auto">{filtered.length} orders</span>
        </div>

        {/* Table */}
        <div className="bg-[rgba(17,25,40,0.75)] border border-white/8 rounded-2xl overflow-hidden animate-fadeUp delay-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8 bg-white/2">
                  {['Order ID', 'Customer', 'Items', 'Amount', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-4 text-[#FF4D8D] text-sm font-mono font-medium">{o.id}</td>
                    <td className="px-5 py-4">
                      <div className="text-white text-sm font-medium">{o.customer}</div>
                      <div className="text-[#94A3B8] text-xs">{o.phone}</div>
                    </td>
                    <td className="px-5 py-4 text-[#94A3B8] text-sm">{o.items} items</td>
                    <td className="px-5 py-4 text-white text-sm font-bold">₹{o.amount}</td>
                    <td className="px-5 py-4"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-4 text-[#94A3B8] text-xs">{o.date}</td>
                    <td className="px-5 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === o.id ? null : o.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white text-xs transition-all border border-white/10"
                        >
                          Update <ChevronDown size={11} />
                        </button>
                        {activeDropdown === o.id && (
                          <div className="absolute right-0 top-8 z-20 bg-[#0d1b2a] border border-white/12 rounded-xl py-1 shadow-2xl min-w-[140px]">
                            {STATUSES.map(s => (
                              <button
                                key={s}
                                onClick={() => { updateStatus(o.id, s); setActiveDropdown(null); }}
                                className={`w-full text-left px-4 py-2 text-xs hover:bg-white/5 transition-colors ${o.status === s ? 'text-[#FF4D8D]' : 'text-[#94A3B8] hover:text-white'}`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

