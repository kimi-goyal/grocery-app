import { ShoppingCart, IndianRupee, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import AdminTopbar from '../components/AdminTopbar';
import StatCard from '../components/StatCard';
import MiniChart from '../components/MiniChart';
import { useEffect, useState } from "react";
import { adminApi } from '../../services/adminApi';
 
 
type Stats = {
  total_orders: number;
  total_orders_delta: number;
  total_revenue: number;
  total_revenue_delta: number;
  total_customers: number;
  total_customers_delta: number;
  low_stock_items: number;
  recent_orders?: Array<{ id: string; customer: string; amount: number; status: string; date: string }>;
};
 
type TopProduct = {
  id: string;
  name: string;
  orders: number;
  revenue: number;
  image_url: string;
};
 
type SalesDataPoint = {
  day: string;
  revenue: number;
};
 
export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);
 
  useEffect(() => {
    adminApi.get('/admin/dashboard/stats')
      .then((response) => setStats(response.data))
      .catch((err) => console.error('Failed to load dashboard stats', err));
 
    adminApi.get('/admin/dashboard/top-products?limit=4')
      .then((response) => setTopProducts(response.data))
      .catch((err) => {
        console.error('Failed to load top products', err);
        setTopProducts([]);
      });
 
    adminApi.get('/admin/dashboard/sales?period=week')
      .then((response) => setSalesData(response.data))
      .catch((err) => {
        console.error('Failed to load sales data', err);
        setSalesData([]);
      });
  }, []);
 
 
  return (
    <div className="flex-1 overflow-y-auto">
      <AdminTopbar title="Dashboard Overview" />
      <div className="p-6 space-y-6">
 
        {/* Stat Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 animate-fadeUp">
          <StatCard label="Total Orders" value={stats?.total_orders || 0} delta={stats?.total_orders_delta} icon={ShoppingCart} color="#FF4D8D" />
          <StatCard label="Total Revenue" value={stats?.total_revenue || 0} delta={stats?.total_revenue_delta} icon={IndianRupee} color="#22C55E" prefix="₹" />
          <StatCard label="Customers" value={stats?.total_customers || 0} delta={stats?.total_customers_delta} icon={Users} color="#3b82f6" />
          <StatCard label="Low Stock Items" value={stats?.low_stock_items || 0} icon={AlertTriangle} color="#f59e0b" />
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
            <MiniChart data={salesData} />
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/8">
              {[
                { label: 'This Week', value: salesData.length ? `₹${salesData.reduce((sum, point) => sum + point.revenue, 0).toLocaleString()}` : '—', color: '#FF4D8D' },
                { label: 'Last Week', value: stats ? `₹${Math.round(stats.total_revenue).toLocaleString()}` : '—', color: '#94A3B8' },
                { label: 'Peak Day', value: salesData.length ? salesData.reduce((best, point) => point.revenue > best.revenue ? point : best, salesData[0]).day : '—', color: '#22C55E' },
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
              {topProducts.length ? topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-sm font-semibold text-white shrink-0 overflow-hidden">
                    {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : p.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-xs font-medium truncate">{p.name}</div>
                    <div className="text-[#94A3B8] text-[10px]">{p.orders.toLocaleString()} orders</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#22C55E] text-xs font-bold">₹{Math.round(p.revenue).toLocaleString()}</div>
                    <div className="text-[#94A3B8] text-[10px]">#{i + 1}</div>
                  </div>
                </div>
              )) : (
                <div className="text-[#94A3B8] text-sm">Loading best sellers...</div>
              )}
            </div>
          </div>
        </div>
 
        {/* Recent Orders */}
        <div className="bg-[rgba(17,25,40,0.75)] border rounded-2xl animate-fadeUp delay-200">
          <div className="flex items-center justify-between p-5 ">
            <h3 className="text-white font-bold" style={{ fontFamily: 'Sora,sans-serif' }}>Recent Orders</h3>
            <a href="/management/orders" className="text-[#FF4D8D] text-xs hover:text-pink-300 transition-colors">View all →</a>
          </div>
          {/* <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-[#94A3B8]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats?.recent_orders?.slice(0, 5).map((o) => (
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
          </div> */}
        </div>
      </div>
    </div>
  );
}
 
 
 