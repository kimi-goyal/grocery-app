import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { adminTokenManager } from '../lib/adminTokenManager';
import { publicApi } from './api';

const BASE_URL = 'http://localhost:8000/api/v1';

export const adminApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

adminApi.interceptors.request.use((config) => {
  const accessToken = adminTokenManager.getAccess();
  if (accessToken) {
    const headers = config.headers as any;
    headers.Authorization = `Bearer ${accessToken}`;
    config.headers = headers;
  }
  return config;
});

let refreshPromise: Promise<void> | null = null;

async function doRefresh(): Promise<void> {
  const refreshToken = adminTokenManager.getRefresh();
  if (!refreshToken) throw new Error('Refresh token missing');

  const response = await publicApi.post('/auth/refresh', {
    refresh_token: refreshToken,
  });

  const data = response.data as { access_token: string; refresh_token: string };
  adminTokenManager.setTokens(data.access_token, data.refresh_token);
}

adminApi.interceptors.response.use(
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
        const newAccess = adminTokenManager.getAccess();
        if (newAccess) {
          original.headers = {
            ...(original.headers as Record<string, string | undefined>),
            Authorization: `Bearer ${newAccess}`,
          };
        }
        return adminApi(original);
      } catch {
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
