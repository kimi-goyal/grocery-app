import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { tokenManager } from '../lib/tokenManager';

const BASE_URL = 'http://localhost:8000/api/v1';

// Public client — no auth, no refresh
export const publicApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Private client — auto-attaches token, handles 401 refresh
export const privateApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Track ongoing refresh to avoid parallel refresh storms
let refreshPromise: Promise<string> | null = null;

async function doRefresh(): Promise<string> {
  const refreshToken = tokenManager.getRefresh();
  if (!refreshToken) throw new Error('No refresh token');

  const res = await publicApi.post('/auth/refresh', { refresh_token: refreshToken });
  const { access_token, refresh_token: newRefresh } = res.data;

  tokenManager.setTokens(access_token, newRefresh ?? refreshToken);
  return access_token;
}

// REQUEST interceptor — attach access token, silently refresh if expired
privateApi.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (!tokenManager.isAccessValid()) {
    // Access token missing or expired — try to refresh before the request
    if (!refreshPromise) {
      refreshPromise = doRefresh().finally(() => { refreshPromise = null; });
    }
    try {
      await refreshPromise;
    } catch {
      // Refresh failed — let the request go without a token (will 401)
      tokenManager.clearTokens();
      return config;
    }
  }

  const token = tokenManager.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// RESPONSE interceptor — handle 401 mid-flight by retrying once after refresh
privateApi.interceptors.response.use(
  res => res,
  async (error) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (!refreshPromise) {
        refreshPromise = doRefresh().finally(() => { refreshPromise = null; });
      }

      try {
        const newToken = await refreshPromise;
        original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newToken}` };
        return privateApi(original);
      } catch {
        // Refresh exhausted — force logout
        tokenManager.clearTokens();
        // Emit a custom event so authStore can react without circular imports
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

