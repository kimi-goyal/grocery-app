
import { useState } from 'react';
import AdminTopbar from '../components/AdminTopbar';
import { useInventoryStore } from '../store/inventoryStore';
import { AlertTriangle, Search } from 'lucide-react';

export default function InventoryPage() {
  const { items, updateStock } = useInventoryStore();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState('');

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.sku.toLowerCase().includes(search.toLowerCase())
  );
  const lowStock = items.filter(i => i.stock <= i.lowStockThreshold);

  const commitEdit = (id: string) => {
    const val = parseInt(editVal);
    if (!isNaN(val) && val >= 0) updateStock(id, val);
    setEditingId(null);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <AdminTopbar title="Inventory Management" />
      <div className="p-6 space-y-4">

        {lowStock.length > 0 && (
          <div className="bg-amber-500/8 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3 animate-fadeUp">
            <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-amber-400 font-semibold text-sm">Low Stock Alert</div>
              <div className="text-[#94A3B8] text-xs mt-0.5">
                {lowStock.length} items are running low: {lowStock.map(i => i.name).join(', ')}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between animate-fadeUp">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or SKU..." className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4D8D]/40 w-64 transition-all" />
          </div>
          <span className="text-[#94A3B8] text-sm">{filtered.length} items</span>
        </div>

        <div className="bg-[rgba(17,25,40,0.75)] border border-white/8 rounded-2xl overflow-hidden animate-fadeUp delay-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8 bg-white/2">
                  {['Product', 'SKU', 'Category', 'Price', 'Stock Level', 'Status', 'Update Stock'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => {
                  const isLow = item.stock <= item.lowStockThreshold;
                  const pct = Math.min((item.stock / (item.lowStockThreshold * 4)) * 100, 100);
                  return (
                    <tr key={item.id} className={`border-b border-white/5 hover:bg-white/2 transition-colors ${isLow ? 'bg-amber-500/3' : ''}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/5 shrink-0">
                            <img src={item.image} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">{item.name}</div>
                            <div className="text-[#94A3B8] text-xs">{item.unit}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#94A3B8] text-xs font-mono">{item.sku}</td>
                      <td className="px-5 py-4">
                        <div className="text-[#94A3B8] text-xs">{item.category}</div>
                        <div className="text-gray-600 text-[10px]">{item.subcategory}</div>
                      </td>
                      <td className="px-5 py-4 text-white text-sm font-bold">₹{item.price}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: isLow ? '#ef4444' : '#22C55E' }} />
                          </div>
                          <span className={`text-xs font-bold ${isLow ? 'text-red-400' : 'text-[#94A3B8]'}`}>{item.stock}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${isLow ? 'bg-red-500/15 text-red-400' : 'bg-green-500/15 text-green-400'}`}>
                          {isLow ? '⚠ Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {editingId === item.id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number" value={editVal} onChange={e => setEditVal(e.target.value)}
                              autoFocus
                              className="w-20 bg-white/5 border border-[#FF4D8D]/40 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none"
                            />
                            <button onClick={() => commitEdit(item.id)} className="text-[#22C55E] hover:text-green-300 text-xs px-2 py-1 bg-green-500/10 rounded-lg transition-colors">✓</button>
                            <button onClick={() => setEditingId(null)} className="text-[#94A3B8] hover:text-white text-xs px-2 py-1 bg-white/5 rounded-lg transition-colors">✕</button>
                          </div>
                        ) : (
                          <button onClick={() => { setEditingId(item.id); setEditVal(String(item.stock)); }}
                            className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white border border-white/10 transition-all">
                            Edit Stock
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
