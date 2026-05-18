import { create } from 'zustand';
import { privateApi } from '../../services/api';
 
export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
  joinedDate: string;
  status: string;
};
 
interface CustomerState {
  customers: Customer[];
  loading: boolean;
  fetchCustomers: () => Promise<void>;
}
 
export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  loading: false,
  fetchCustomers: async () => {
    set({ loading: true });
    try {
      const res = await privateApi.get('/admin/customers');
      const customers = res.data.customers.map((customer: any) => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '-',
        orderCount: customer.order_count ?? 0,
        totalSpent: customer.total_spent ?? 0,
        joinedDate: customer.joined_date || '',
        status: customer.status || 'Inactive',
      }));
      set({ customers, loading: false });
    } catch (error) {
      console.error('Failed to fetch customers', error);
      set({ loading: false, customers: [] });
    }
  },
}));
 
 