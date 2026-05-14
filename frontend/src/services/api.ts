import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1';

// Public client — no auth, sends cookies for login/refresh/logout
export const publicApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Private client — sends auth cookies automatically and retries on 401
export const privateApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

async function doRefresh(): Promise<void> {
  await publicApi.post('/auth/refresh');
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
        return privateApi(original);
      } catch {
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

