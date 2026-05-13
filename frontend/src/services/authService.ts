import { publicApi, privateApi } from "./api";
import { tokenManager } from "../lib/tokenManager";

export interface RegisterPayload {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface LoginPayload {
  username: string; // email or username
  password: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface MeResponse {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  is_verified: boolean;
  phone?: string;
  avatar?: string;
}

export const authService = {
  register: (data: RegisterPayload) =>
    publicApi.post("/auth/register", data).then((r) => r.data),

  login: async (data: LoginPayload): Promise<AuthTokens> => {
    const res = await publicApi.post<AuthTokens>("/auth/login", data);
    tokenManager.setTokens(res.data.access_token, res.data.refresh_token);
    return res.data;
  },

  verifyOtp: (email: string, otp: string) =>
    publicApi.post("/auth/verify-otp", { email, otp }).then((r) => r.data),

  resendOtp: (email: string) =>
    publicApi.post("/auth/resend-otp", { email }).then((r) => r.data),

  getMe: (): Promise<MeResponse> =>
    privateApi.get("/auth/me").then((r) => r.data),

  refresh: (refreshToken: string) =>
    publicApi
      .post<AuthTokens>("/auth/refresh", { refresh_token: refreshToken })
      .then((r) => r.data),

  logout: () => {
    tokenManager.clearTokens();
  },
 googleLogin: async (idToken: string): Promise<AuthTokens> => {
  const res = await publicApi.post<AuthTokens>("/auth/google", {
    id_token: idToken,
  });

  tokenManager.setTokens(res.data.access_token, res.data.refresh_token);
  return res.data;
},
};
