
import { useEffect, useState } from 'react';
import AdminTopbar from '../components/AdminTopbar';
import { useDriverStore } from '../store/driverStore';
import { Search, Plus, Edit2, Trash2, X, Power, Bike } from 'lucide-react';
import type { DriverCreate, DriverUpdate } from '../../types/driver.types';

export default function DriversPage() {
  const { drivers, loading, fetchDrivers, createDriver, updateDriver, deleteDriver, toggleAvailability } = useDriverStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<DriverCreate>({
    name: '',
    phone: '',
    email: '',
    vehicle_number: '',
    vehicle_type: 'bike',
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const filtered = drivers.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.phone.includes(search) ||
    (d.vehicle_number && d.vehicle_number.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDriver(editingId, formData);
      } else {
        await createDriver(formData);
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save driver:', error);
    }
  };

  const handleEdit = (driver: any) => {
    setEditingId(driver.id);
    setFormData({
      name: driver.name,
      phone: driver.phone,
      email: driver.email || '',
      vehicle_number: driver.vehicle_number || '',
      vehicle_type: driver.vehicle_type || 'bike',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this driver?')) {
      try {
        await deleteDriver(id);
      } catch (error) {
        console.error('Failed to delete driver:', error);
      }
    }
  };

  const handleToggleAvailability = async (id: string) => {
    try {
      await toggleAvailability(id);
    } catch (error) {
      console.error('Failed to toggle availability:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      vehicle_number: '',
      vehicle_type: 'bike',
    });
    setEditingId(null);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <AdminTopbar title="Drivers" />
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between animate-fadeUp">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search drivers..."
              className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4D8D]/40 w-64 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#94A3B8] text-sm">{filtered.length} drivers</span>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#FF4D8D] to-[#FF6B9D] rounded-xl text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#FF4D8D]/30 transition-all"
            >
              <Plus size={16} />
              Add Driver
            </button>
          </div>
        </div>

        <div className="bg-[rgba(17,25,40,0.75)] border border-white/8 rounded-2xl overflow-hidden animate-fadeUp delay-100">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF4D8D]"></div>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/8 bg-white/2">
                    {['Driver', 'Phone', 'Vehicle', 'Deliveries', 'Status', 'Availability', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(driver => (
                    <tr key={driver.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF4D8D]/40 to-purple-600/40 flex items-center justify-center text-sm font-bold text-white">
                            {driver.name[0]}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{driver.name}</p>
                            {driver.email && <p className="text-[#94A3B8] text-xs">{driver.email}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#94A3B8] text-sm">{driver.phone}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Bike size={14} className="text-[#94A3B8]" />
                          <div>
                            <p className="text-white text-sm">{driver.vehicle_number || 'N/A'}</p>
                            <p className="text-[#94A3B8] text-xs capitalize">{driver.vehicle_type || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-white text-sm font-semibold">{driver.total_deliveries}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            driver.is_active
                              ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                              : 'bg-red-500/10 text-red-500 border border-red-500/20'
                          }`}
                        >
                          {driver.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleToggleAvailability(driver.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                            driver.is_available
                              ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20'
                              : 'bg-gray-500/10 text-gray-500 border border-gray-500/20 hover:bg-gray-500/20'
                          }`}
                        >
                          <Power size={12} />
                          {driver.is_available ? 'Available' : 'Busy'}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(driver)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-[#94A3B8] hover:text-white"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(driver.id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-[#94A3B8] hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fadeUp">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">{editingId ? 'Edit Driver' : 'Add New Driver'}</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4D8D]/40"
                  placeholder="Enter driver name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4D8D]/40"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4D8D]/40"
                  placeholder="Enter email (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Vehicle Number</label>
                <input
                  type="text"
                  value={formData.vehicle_number}
                  onChange={e => setFormData({ ...formData, vehicle_number: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4D8D]/40"
                  placeholder="e.g., MH01AB1234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Vehicle Type</label>
                <select
                  value={formData.vehicle_type}
                  onChange={e => setFormData({ ...formData, vehicle_type: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF4D8D]/40"
                >
                  <option value="bike">Bike</option>
                  <option value="scooter">Scooter</option>
                  <option value="car">Car</option>
                  <option value="van">Van</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#FF4D8D] to-[#FF6B9D] rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-[#FF4D8D]/30 transition-all"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
