
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminTokenManager } from '../../lib/adminTokenManager';
import { adminApi } from '../../services/adminApi';
import { tokenManager } from '../../lib/tokenManager';
 
interface AdminUser { email: string; name: string; role: string; }
interface AdminAuthState {
  admin: AdminUser | null;
  isAdminAuthenticated: boolean;
  initialized: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
}
 
export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      admin: null, isAdminAuthenticated: false, initialized: false, loading: false, error: null,
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/admin-login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username: email, password }),
          });
          if (response.ok) {
            const data = await response.json();
            // remove any shared user tokens to avoid using user creds for user/private API
            tokenManager.clearTokens();
            adminTokenManager.setTokens(data.access_token, data.refresh_token);

            const meResponse = await adminApi.get('/auth/me');
            if (meResponse.status === 200) {
              const meData = meResponse.data;
              set({ admin: { email: meData.email, name: meData.name, role: meData.role }, isAdminAuthenticated: true, initialized: true, loading: false });
            } else {
              set({ admin: { email, name: 'Admin User', role: 'admin' }, isAdminAuthenticated: true, initialized: true, loading: false });
            }
            return true;
          } else {
            const errorData = await response.json();
            set({ error: errorData.detail || 'Login failed', loading: false });
            return false;
          }
        } catch (error) {
          set({ error: 'Network error', loading: false });
          return false;
        }
      },
      logout: async () => {
        try {
          await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/logout`, {
            method: 'POST',
            credentials: 'include',
          });
        } catch (error) {
          console.error('Logout error:', error);
        }
        adminTokenManager.clearTokens();
        set({ admin: null, isAdminAuthenticated: false, initialized: true });
      },
      initAuth: async () => {
        set({ isAdminAuthenticated: false, initialized: false });
        try {
          if (!adminTokenManager.isAccessValid()) {
            set({ admin: null, isAdminAuthenticated: false, initialized: true });
            return;
          }
          const response = await adminApi.get('/auth/me');
          if (response.status === 200) {
            const data = response.data;
            if (data.role === 'admin') {
              set({ admin: { email: data.email, name: data.name, role: data.role }, isAdminAuthenticated: true, initialized: true });
            } else {
              set({ admin: null, isAdminAuthenticated: false, initialized: true });
            }
          } else {
            set({ admin: null, isAdminAuthenticated: false, initialized: true });
          }
        } catch (error) {
          set({ admin: null, isAdminAuthenticated: false, initialized: true });
        }
      },
    }),
    {
      name: 'freshcart-admin-auth',
      partialize: (state) => ({ admin: state.admin }),
    }
  )
);