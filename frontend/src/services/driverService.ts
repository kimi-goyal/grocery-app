
import { adminApi } from './adminApi';
import type { Driver, DriverCreate, DriverUpdate } from '../types/driver.types';

export const driverService = {
  // Get all drivers
  getDrivers: (activeOnly: boolean = false): Promise<Driver[]> =>
    adminApi.get('/admin/drivers', { params: { active_only: activeOnly } }).then(r => r.data),

  // Get single driver
  getDriver: (id: string): Promise<Driver> =>
    adminApi.get(`/admin/drivers/${id}`).then(r => r.data),

  // Create driver
  createDriver: (data: DriverCreate): Promise<Driver> =>
    adminApi.post('/admin/drivers', data).then(r => r.data),

  // Update driver
  updateDriver: (id: string, data: DriverUpdate): Promise<Driver> =>
    adminApi.put(`/admin/drivers/${id}`, data).then(r => r.data),

  // Delete driver (soft delete)
  deleteDriver: (id: string): Promise<void> =>
    adminApi.delete(`/admin/drivers/${id}`).then(r => r.data),

  // Toggle availability
  toggleAvailability: (id: string): Promise<Driver> =>
    adminApi.patch(`/admin/drivers/${id}/toggle-availability`).then(r => r.data),

  // Assign driver to order
  assignDriver: (driverId: string, orderId: string): Promise<{ message: string }> =>
    adminApi.post(`/admin/drivers/${driverId}/assign/${orderId}`).then(r => r.data),
};
