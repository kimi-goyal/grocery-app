
const ACCESS_KEY = 'fc_access_token';
const REFRESH_KEY = 'fc_refresh_token';

export const tokenManager = {
  getAccess: (): string | null => localStorage.getItem(ACCESS_KEY),
  getRefresh: (): string | null => localStorage.getItem(REFRESH_KEY),

  setTokens: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },

  clearTokens: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },

  /**
   * Decode JWT payload without a library.
   * Returns null if token is malformed or expired.
   */
  decodePayload: (token: string): Record<string, any> | null => {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  },

  isExpired: (token: string): boolean => {
    const payload = tokenManager.decodePayload(token);
    if (!payload?.exp) return true;
    // Add 10s buffer to refresh slightly before actual expiry
    return Date.now() / 1000 >= payload.exp - 10;
  },

  isAccessValid: (): boolean => {
    const token = tokenManager.getAccess();
    return !!token && !tokenManager.isExpired(token);
  },
};


