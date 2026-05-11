
import { create } from 'zustand';
import { MOCK_CUSTOMERS } from '../data/mockData';

export type Customer = { id: string; name: string; email: string; phone: string; orderCount: number; totalSpent: number; joinedDate: string; status: string; };

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  fetchCustomers: () => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: MOCK_CUSTOMERS,
  loading: false,
  fetchCustomers: () => {
    // Future: GET /api/admin/customers?page=1&limit=50
    set({ loading: true });
    setTimeout(() => set({ customers: MOCK_CUSTOMERS, loading: false }), 300);
  },
}));

