const ADMIN_ACCESS_KEY = 'fc_admin_access_token';
const ADMIN_REFRESH_KEY = 'fc_admin_refresh_token';

export const adminTokenManager = {
  getAccess: (): string | null => localStorage.getItem(ADMIN_ACCESS_KEY),
  getRefresh: (): string | null => localStorage.getItem(ADMIN_REFRESH_KEY),

  setTokens: (access: string, refresh: string) => {
    localStorage.setItem(ADMIN_ACCESS_KEY, access);
    localStorage.setItem(ADMIN_REFRESH_KEY, refresh);
  },

  clearTokens: () => {
    localStorage.removeItem(ADMIN_ACCESS_KEY);
    localStorage.removeItem(ADMIN_REFRESH_KEY);
  },

  decodePayload: (token: string): Record<string, any> | null => {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  },

  isExpired: (token: string): boolean => {
    const payload = adminTokenManager.decodePayload(token);
    if (!payload?.exp) return true;
    return Date.now() / 1000 >= payload.exp - 10;
  },

  isAccessValid: (): boolean => {
    const token = adminTokenManager.getAccess();
    return !!token && !adminTokenManager.isExpired(token);
  },
};
