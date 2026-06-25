
import { useEffect, useState } from 'react';
import AdminTopbar from '../components/AdminTopbar';
import StatusBadge from '../components/StatusBadge';
import { useCustomerStore } from '../store/customerStore';
import { Search } from 'lucide-react';
 
export default function CustomersPage() {
  const { customers, loading, fetchCustomers } = useCustomerStore();
  const [search, setSearch] = useState('');
 
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);
 
  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );
 
  return (
    <div className="flex-1 overflow-y-auto">
      <AdminTopbar title="Customers" />
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between animate-fadeUp">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4D8D]/40 w-64 transition-all" />
          </div>
          <span className="text-[#94A3B8] text-sm">{filtered.length} customers</span>
        </div>
 
        <div className="bg-[rgba(17,25,40,0.75)] border border-white/8 rounded-2xl overflow-hidden animate-fadeUp delay-100">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center text-white text-sm">Loading customers...</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/8 bg-white/2">
                    {['Customer', 'Email', 'Phone', 'Orders', 'Total Spent', 'Joined', 'Status'].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-white/80 text-sm">
                        No customers found. Please ensure you are logged in and the backend is reachable.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(c => (
                      <tr key={c.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF4D8D]/40 to-purple-600/40 flex items-center justify-center text-sm font-bold text-white">
                              {c.name[0]}
                            </div>
                            <span className="text-white text-sm font-medium">{c.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[#94A3B8] text-sm">{c.email}</td>
                        <td className="px-5 py-4 text-[#94A3B8] text-sm">{c.phone}</td>
                        <td className="px-5 py-4 text-white text-sm font-semibold">{c.orderCount}</td>
                        <td className="px-5 py-4 text-[#22C55E] text-sm font-bold">₹{c.totalSpent.toLocaleString()}</td>
                        <td className="px-5 py-4 text-[#94A3B8] text-xs">{c.joinedDate}</td>
                        <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
 
 