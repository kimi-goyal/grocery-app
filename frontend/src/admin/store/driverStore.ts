
import { create } from 'zustand';
import { driverService } from '../../services/driverService';
import type { Driver, DriverCreate, DriverUpdate } from '../../types/driver.types';

interface DriverState {
  drivers: Driver[];
  loading: boolean;
  error: string | null;
  
  fetchDrivers: (activeOnly?: boolean) => Promise<void>;
  createDriver: (data: DriverCreate) => Promise<Driver>;
  updateDriver: (id: string, data: DriverUpdate) => Promise<Driver>;
  deleteDriver: (id: string) => Promise<void>;
  toggleAvailability: (id: string) => Promise<void>;
}

export const useDriverStore = create<DriverState>((set) => ({
  drivers: [],
  loading: false,
  error: null,

  fetchDrivers: async (activeOnly = false) => {
    set({ loading: true, error: null });
    try {
      const drivers = await driverService.getDrivers(activeOnly);
      set({ drivers, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch drivers', loading: false });
    }
  },

  createDriver: async (data: DriverCreate) => {
    set({ loading: true, error: null });
    try {
      const newDriver = await driverService.createDriver(data);
      set(state => ({
        drivers: [newDriver, ...state.drivers],
        loading: false,
      }));
      return newDriver;
    } catch (error: any) {
      set({ error: error.message || 'Failed to create driver', loading: false });
      throw error;
    }
  },

  updateDriver: async (id: string, data: DriverUpdate) => {
    set({ loading: true, error: null });
    try {
      const updatedDriver = await driverService.updateDriver(id, data);
      set(state => ({
        drivers: state.drivers.map(d => d.id === id ? updatedDriver : d),
        loading: false,
      }));
      return updatedDriver;
    } catch (error: any) {
      set({ error: error.message || 'Failed to update driver', loading: false });
      throw error;
    }
  },

  deleteDriver: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await driverService.deleteDriver(id);
      set(state => ({
        drivers: state.drivers.filter(d => d.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete driver', loading: false });
      throw error;
    }
  },

  toggleAvailability: async (id: string) => {
    try {
      const updatedDriver = await driverService.toggleAvailability(id);
      set(state => ({
        drivers: state.drivers.map(d => d.id === id ? updatedDriver : d),
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to toggle availability' });
      throw error;
    }
  },
}));
