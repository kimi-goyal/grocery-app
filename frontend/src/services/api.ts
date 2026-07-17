import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { tokenManager } from '../lib/tokenManager';
 
const BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;
 
interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
 
// Public client — no auth, sends cookies for login/refresh/logout
export const publicApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});
 
// Private client — auto-attaches token, handles 401 refresh
export const privateApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});
 
privateApi.interceptors.request.use((config) => {
  const accessToken = tokenManager.getAccess();
  if (accessToken) {
    const headers = config.headers as any;
    headers.Authorization = `Bearer ${accessToken}`;
    config.headers = headers;
  }
  return config;
});
 
let refreshPromise: Promise<void> | null = null;
 
async function doRefresh(): Promise<void> {
  const refreshToken = tokenManager.getRefresh();
  if (!refreshToken) throw new Error('Refresh token missing');
 
  const response = await publicApi.post<AuthTokens>('/auth/refresh', {
    refresh_token: refreshToken,
  });
 
  tokenManager.setTokens(response.data.access_token, response.data.refresh_token);
}
 
privateApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
 
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
 
      if (!refreshPromise) {
        refreshPromise = doRefresh().finally(() => { refreshPromise = null; });
      }
 
      try {
        await refreshPromise;
        const newAccess = tokenManager.getAccess();
        if (newAccess) {
          original.headers = {
            ...(original.headers as Record<string, string | undefined>),
            Authorization: `Bearer ${newAccess}`,
          };
        }
        return privateApi(original);
      } catch {
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(error);
      }
    }
 
    return Promise.reject(error);
  },
);
 
 
 