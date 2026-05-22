
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import { MOCK_ADMIN } from '../data/mockData';

// interface AdminUser { email: string; name: string; role: string; }
// interface AdminAuthState {
//   admin: AdminUser | null;
//   isAdminAuthenticated: boolean;
//   loading: boolean;
//   error: string | null;
//   login: (email: string, password: string) => Promise<boolean>;
//   logout: () => Promise<void>;
//   initAuth: () => Promise<void>;
// }

// export const useAdminAuthStore = create<AdminAuthState>()(
//   persist(
//     (set, get) => ({
//       admin: null, isAdminAuthenticated: false, loading: false, error: null,
//       login: async (email, password) => {
//         set({ loading: true, error: null });
//         try {
//           const response = await fetch('/api/v1/auth/admin-login', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             credentials: 'include',
//             body: JSON.stringify({ username: email, password }),
//           });
//           if (response.ok) {
//             const data = await response.json();
//             // Get user info from /auth/me
//             const meResponse = await fetch('/api/v1/auth/me', {
//               credentials: 'include',
//             });
//             if (meResponse.ok) {
//               const meData = await meResponse.json();
//               set({ admin: { email: meData.email, name: meData.name, role: meData.role }, isAdminAuthenticated: true, loading: false });
//             } else {
//               set({ admin: { email, name: 'Admin User', role: 'admin' }, isAdminAuthenticated: true, loading: false });
//             }
//             return true;
//           } else {
//             const errorData = await response.json();
//             set({ error: errorData.detail || 'Login failed', loading: false });
//             return false;
//           }
//         } catch (error) {
//           set({ error: 'Network error', loading: false });
//           return false;
//         }
//       },
//       logout: async () => {
//         try {
//           await fetch('/api/v1/auth/logout', {
//             method: 'POST',
//             credentials: 'include',
//           });
//         } catch (error) {
//           console.error('Logout error:', error);
//         }
//         set({ admin: null, isAdminAuthenticated: false });
//       },
//       initAuth: async () => {
//         try {
//           const response = await fetch('/api/v1/auth/me', {
//             credentials: 'include',
//           });
//           if (response.ok) {
//             const data = await response.json();
//             if (data.role === 'admin') {
//               set({ admin: { email: data.email, name: data.name, role: data.role }, isAdminAuthenticated: true });
//             } else {
//               set({ admin: null, isAdminAuthenticated: false });
//             }
//           } else {
//             set({ admin: null, isAdminAuthenticated: false });
//           }
//         } catch (error) {
//           set({ admin: null, isAdminAuthenticated: false });
//         }
//       },
//     }),
//     { name: 'freshcart-admin-auth' }
//   )
// );

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_ADMIN } from '../data/mockData';
import { adminTokenManager } from '../../lib/adminTokenManager';
import { adminApi } from '../../services/adminApi';
 
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
    (set, get) => ({
      admin: null, isAdminAuthenticated: false, initialized: false, loading: false, error: null,
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('http://localhost:8000/api/v1/auth/admin-login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username: email, password }),
          });
          if (response.ok) {
            const data = await response.json();
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
          await fetch('http://localhost:8000/api/v1/auth/logout', {
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