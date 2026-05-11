// // store/authStore.ts
// import { create } from "zustand"
// import { persist } from "zustand/middleware"

// type AuthState = {
//   token: string | null
//   isAuthenticated: boolean
//   isGuest: boolean

//   login: () => void
//   logout: () => void
//   continueAsGuest: () => void
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       token: null,
//       isAuthenticated: false,
//       isGuest: false,

//       login: () =>
//         set({
//           token: "dummy-token",
//           isAuthenticated: true,
//           isGuest: false,
//         }),

//       logout: () =>
//         set({
//           token: null,
//           isAuthenticated: false,
//           isGuest: false,
//         }),

//       continueAsGuest: () =>
//         set({
//           token: null,
//           isAuthenticated: false,
//           isGuest: true,
//         }),
//     }),
//     {
//       name: "auth-storage",
//     }
//   )
// )

// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// interface AuthState {
//   isAuthenticated: boolean;
//   isGuest: boolean;
//   user: { name?: string; email?: string } | null;

//   login: (user: { name?: string; email?: string }) => void;
//   logout: () => void;
//   skipAsGuest: () => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       isAuthenticated: false,
//       isGuest: false,
//       user: null,

//       login: (user) =>
//         set({
//           isAuthenticated: true,
//           isGuest: false,
//           user,
//         }),

//       logout: () =>
//         set({
//           isAuthenticated: false,
//           isGuest: false,
//           user: null,
//         }),

//       skipAsGuest: () =>
//         set({
//           isGuest: true,
//           isAuthenticated: false,
//           user: null,
//         }),
//     }),
//     {
//       name: "freshcart-auth",
//     }
//   )
// );


import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  isGuest: boolean;
  user: { name?: string; email?: string } | null;

  login: (user: { name?: string; email?: string }) => void;
  logout: () => void;
  skipAsGuest: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isGuest: false,
      user: null,

      login: (user) =>
        set({
          isAuthenticated: true,
          isGuest: false,
          user,
        }),

      logout: () =>
        set({
          isAuthenticated: false,
          isGuest: false,
          user: null,
        }),

      skipAsGuest: () =>
        set({
          isGuest: true,
          isAuthenticated: false,
          user: null,
        }),
    }),
    {
      name: "freshcart-auth",
    }
  )
);