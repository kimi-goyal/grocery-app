
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_ADMIN } from '../data/mockData';

interface AdminUser { email: string; name: string; role: string; }
interface AdminAuthState {
  admin: AdminUser | null;
  isAdminAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      admin: null, isAdminAuthenticated: false, loading: false, error: null,
      login: async (email, password) => {
        set({ loading: true, error: null });
        // Future API consumption flow:
        // 1. POST /management/auth/login with { email, password }
        // 2. Validate role === 'admin' from response
        // 3. Store JWT token in localStorage
        // 4. Set admin state from response.data.admin
        await new Promise(r => setTimeout(r, 800));
        if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
          set({ admin: { email, name: MOCK_ADMIN.name, role: 'admin' }, isAdminAuthenticated: true, loading: false });
          return true;
        }
        set({ error: 'Invalid credentials', loading: false });
        return false;
      },
      logout: () => set({ admin: null, isAdminAuthenticated: false }),
    }),
    { name: 'freshcart-admin-auth' }
  )
);

