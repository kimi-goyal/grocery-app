
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { authService } from '../services/authService';
import { tokenManager } from '../lib/tokenManager';
import type { RegisterPayload, LoginPayload, MeResponse } from '../services/authService';

export type AuthStep = 'idle' | 'pending_otp';

interface AuthState {
  user: MeResponse | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  loading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
  pendingEmail: string | null;
  authStep: AuthStep;
  otpSuccess: boolean;

  // Actions
  register: (data: RegisterPayload) => Promise<void>;
  login: (data: LoginPayload) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  logout: () => void;
  skipAsGuest: () => void;
  initAuth: () => Promise<void>;

  // Error helpers
  clearError: () => void;
  setFieldError: (field: string, msg: string) => void;
  clearFieldErrors: () => void;
}

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isGuest: false,
        loading: false,
        error: null,
        fieldErrors: {},
        pendingEmail: null,
        authStep: 'idle',
        otpSuccess: false,

        // ─── Register ────────────────────────────────────────────────────────
        register: async (data) => {
          set({ loading: true, error: null, fieldErrors: {} });
          try {
            await authService.register(data);
            // Backend sends OTP email; transition to OTP step
            set({
              loading: false,
              pendingEmail: data.email.toLowerCase().trim(),
              authStep: 'pending_otp',
            });
          } catch (err: any) {
            const status = err?.response?.status;
            const detail = err?.response?.data?.detail;
            let errorMsg = 'Registration failed. Please try again.';
            const fieldErrs: Record<string, string> = {};

            if (status === 400) {
              if (typeof detail === 'string') {
                if (detail.toLowerCase().includes('email')) fieldErrs.email = detail;
                else if (detail.toLowerCase().includes('username')) fieldErrs.username = detail;
                else errorMsg = detail;
              } else if (Array.isArray(detail)) {
                // FastAPI validation error array
                detail.forEach((d: any) => {
                  const field = d.loc?.[d.loc.length - 1];
                  if (field) fieldErrs[field] = d.msg;
                });
                errorMsg = '';
              }
            } else if (status === 422) {
              if (Array.isArray(detail)) {
                detail.forEach((d: any) => {
                  const field = d.loc?.[d.loc.length - 1];
                  if (field) fieldErrs[field] = d.msg.replace('Value error, ', '');
                });
                errorMsg = '';
              }
            } else if (status === 0 || !err?.response) {
              errorMsg = 'Cannot reach server. Check your connection.';
            }

            set({ loading: false, error: errorMsg || null, fieldErrors: fieldErrs });
            throw err;
          }
        },

        // ─── Login ───────────────────────────────────────────────────────────
        login: async (data) => {
          set({ loading: true, error: null, fieldErrors: {} });
          try {
            await authService.login(data); // sets tokens via tokenManager
            const me = await authService.getMe();
            set({
              loading: false,
              isAuthenticated: true,
              isGuest: false,
              user: me,
              authStep: 'idle',
              pendingEmail: null,
              error: null,
            });
          } catch (err: any) {
            const status = err?.response?.status;
            const detail = err?.response?.data?.detail;
            let errorMsg = 'Login failed. Please try again.';

            if (status === 401) {
              errorMsg = 'Incorrect email/username or password.';
            } else if (status === 403) {
              // Unverified email — route to OTP
              const identifier = data.username;
              const emailGuess = identifier.includes('@') ? identifier : null;
              set({
                loading: false,
                error: null,
                pendingEmail: emailGuess,
                authStep: 'pending_otp',
              });
              return;
            } else if (status === 404) {
              errorMsg = 'Account not found. Please sign up.';
            } else if (status === 429) {
              errorMsg = 'Too many attempts. Please wait and try again.';
            } else if (!err?.response) {
              errorMsg = 'Cannot reach server. Check your connection.';
            } else if (typeof detail === 'string') {
              errorMsg = detail;
            }

            set({ loading: false, error: errorMsg });
            throw err;
          }
        },

        // ─── Verify OTP ──────────────────────────────────────────────────────
        verifyOtp: async (email, otp) => {
          set({ loading: true, error: null });
          try {
            await authService.verifyOtp(email, otp);
            set({
              loading: false,
              otpSuccess: true,
              authStep: 'idle',
              pendingEmail: null,
            });
            // Reset success flag after 2s
            setTimeout(() => set({ otpSuccess: false }), 2000);
          } catch (err: any) {
            const status = err?.response?.status;
            const detail = err?.response?.data?.detail;
            let msg = 'Invalid or expired OTP. Please try again.';

            if (status === 400) msg = typeof detail === 'string' ? detail : msg;
            else if (status === 404) msg = 'User not found.';
            else if (!err?.response) msg = 'Network error. Check your connection.';

            set({ loading: false, error: msg });
            throw err;
          }
        },

        // ─── Resend OTP ──────────────────────────────────────────────────────
        resendOtp: async (email) => {
          set({ loading: true, error: null });
          try {
            await authService.resendOtp(email);
            set({ loading: false });
          } catch (err: any) {
            const status = err?.response?.status;
            const detail = err?.response?.data?.detail;
            let msg = 'Failed to resend OTP.';

            if (status === 400) msg = typeof detail === 'string' ? detail : msg;
            else if (status === 404) msg = 'Email not found.';
            else if (!err?.response) msg = 'Network error.';

            set({ loading: false, error: msg });
            throw err;
          }
        },

        // ─── Init (app start) ────────────────────────────────────────────────
        // Called on app mount to validate stored token and hydrate user
        initAuth: async () => {
          if (!tokenManager.getAccess() && !tokenManager.getRefresh()) return;
          try {
            const me = await authService.getMe();
            set({ user: me, isAuthenticated: true, isGuest: false });
          } catch {
            // tokens invalid / refresh failed → clean state
            tokenManager.clearTokens();
            set({ user: null, isAuthenticated: false });
          }
        },

        // ─── Logout ──────────────────────────────────────────────────────────
        logout: () => {
          authService.logout();
          set({
            user: null,
            isAuthenticated: false,
            isGuest: false,
            authStep: 'idle',
            pendingEmail: null,
            error: null,
            fieldErrors: {},
          });
        },

        skipAsGuest: () => set({ isGuest: true, isAuthenticated: false }),

        // ─── Error helpers ───────────────────────────────────────────────────
        clearError: () => set({ error: null }),
        setFieldError: (field, msg) => set(s => ({ fieldErrors: { ...s.fieldErrors, [field]: msg } })),
        clearFieldErrors: () => set({ fieldErrors: {} }),
      }),
      {
        name: 'freshcart-auth',
        partialize: (s) => ({
          user: s.user,
          isAuthenticated: s.isAuthenticated,
          isGuest: s.isGuest,
          pendingEmail: s.pendingEmail,
          authStep: s.authStep,
        }),
      }
    )
  )
);

// Listen for forced logout event emitted by axios response interceptor
window.addEventListener('auth:logout', () => {
  useAuthStore.getState().logout();
});

