
import { ShoppingCart, IndianRupee, Users, AlertTriangle, TrendingUp, Package } from 'lucide-react';
import AdminTopbar from '../components/AdminTopbar';
import StatCard from '../components/StatCard';
import MiniChart from '../components/MiniChart';
import StatusBadge from '../components/StatusBadge';
import { MOCK_STATS, MOCK_ORDERS, MOCK_SALES_DATA } from '../data/mockData';

export default function DashboardPage() {
  const topProducts = [
    { name: 'Red Apples', orders: 1200, revenue: 144000, emoji: '🍎' },
    { name: 'Banana', orders: 980, revenue: 58800, emoji: '🍌' },
    { name: 'Amul Milk', orders: 890, revenue: 49840, emoji: '🥛' },
    { name: 'Potato', orders: 670, revenue: 26800, emoji: '🥔' },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <AdminTopbar title="Dashboard Overview" />
      <div className="p-6 space-y-6">

        {/* Stat Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 animate-fadeUp">
          <StatCard label="Total Orders" value={MOCK_STATS.totalOrders} delta={MOCK_STATS.totalOrdersDelta} icon={ShoppingCart} color="#FF4D8D" />
          <StatCard label="Total Revenue" value={MOCK_STATS.totalRevenue} delta={MOCK_STATS.totalRevenueDelta} icon={IndianRupee} color="#22C55E" prefix="₹" />
          <StatCard label="Customers" value={MOCK_STATS.totalCustomers} delta={MOCK_STATS.totalCustomersDelta} icon={Users} color="#3b82f6" />
          <StatCard label="Low Stock Items" value={MOCK_STATS.lowStockItems} icon={AlertTriangle} color="#f59e0b" />
        </div>

        {/* Chart + Top Products */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 animate-fadeUp delay-100">
          <div className="xl:col-span-2 bg-[rgba(17,25,40,0.75)] border border-white/8 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-bold" style={{ fontFamily: 'Sora,sans-serif' }}>Sales Overview</h3>
                <p className="text-[#94A3B8] text-xs mt-0.5">This Week</p>
              </div>
              <div className="flex items-center gap-2 text-[#22C55E] text-sm font-medium">
                <TrendingUp size={16} />
                <span>+8.2%</span>
              </div>
            </div>
            <MiniChart />
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/8">
              {[
                { label: 'This Week', value: '₹1,68,000', color: '#FF4D8D' },
                { label: 'Last Week', value: '₹1,55,200', color: '#94A3B8' },
                { label: 'Peak Day', value: 'Saturday', color: '#22C55E' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-[10px] text-[#94A3B8]">{s.label}</div>
                  <div className="text-sm font-bold mt-0.5" style={{ color: s.color, fontFamily: 'Sora,sans-serif' }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[rgba(17,25,40,0.75)] border border-white/8 rounded-2xl p-5">
            <h3 className="text-white font-bold mb-4" style={{ fontFamily: 'Sora,sans-serif' }}>Top Selling Products</h3>
            <div className="flex flex-col gap-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-lg shrink-0">{p.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-xs font-medium truncate">{p.name}</div>
                    <div className="text-[#94A3B8] text-[10px]">{p.orders.toLocaleString()} orders</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#22C55E] text-xs font-bold">₹{(p.revenue / 1000).toFixed(0)}k</div>
                    <div className="text-[#94A3B8] text-[10px]">#{i + 1}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-[rgba(17,25,40,0.75)] border border-white/8 rounded-2xl animate-fadeUp delay-200">
          <div className="flex items-center justify-between p-5 border-b border-white/8">
            <h3 className="text-white font-bold" style={{ fontFamily: 'Sora,sans-serif' }}>Recent Orders</h3>
            <a href="/management/orders" className="text-[#FF4D8D] text-xs hover:text-pink-300 transition-colors">View all →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-[#94A3B8]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_ORDERS.slice(0, 5).map(o => (
                  <tr key={o.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3 text-[#FF4D8D] text-sm font-mono">{o.id}</td>
                    <td className="px-5 py-3 text-white text-sm">{o.customer}</td>
                    <td className="px-5 py-3 text-white text-sm font-semibold">₹{o.amount}</td>
                    <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-3 text-[#94A3B8] text-xs">{o.date}</td>
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


