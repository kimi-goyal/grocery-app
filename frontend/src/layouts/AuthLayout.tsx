// // // import type { ReactNode } from 'react'
// // // import groceryImage from '../assets/grocery-banner.png'

// // // interface Props {
// // //   children: ReactNode
// // // }

// // // const AuthLayout = ({ children }: Props) => {
// // //   return (
// // //     <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-4 py-8">
// // //       <div className="w-full max-w-7xl grid lg:grid-cols-2 bg-[#0b1220] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
// // //         <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#09101f] relative overflow-hidden">
// // //           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,#ff4d6d,transparent_40%)]" />

// // //           <div className="relative z-10">
// // //             <h1 className="text-5xl font-bold leading-tight">
// // //               Fresh groceries delivered in
// // //               <span className="text-[#ff4d6d]"> 10 minutes</span>
// // //             </h1>

// // //             <p className="text-gray-400 mt-6 text-lg leading-relaxed">
// // //               Order fresh groceries instantly at your doorstep.
// // //             </p>
// // //           </div>

// // //           <div className="relative z-10 flex justify-center">
// // //             <img
// // //               src={groceryImage}
// // //               alt="grocery"
// // //               className="w-[85%] object-contain"
// // //             />
// // //           </div>
// // //         </div>

// // //         <div className="flex items-center justify-center p-6 md:p-12 bg-[#07101d]">
// // //           <div className="w-full max-w-md">{children}</div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // // export default AuthLayout
// // // import { useState } from "react";
// // // import LoginForm from "../components/auth/LoginForm";
// // // import RegisterForm from "../components/auth/RegisterForm";
// // // import { useAuthStore } from "../store/authStore";
// // // import { useNavigate } from "react-router-dom";

// // // export default function AuthLayout() {
// // //   const [tab, setTab] = useState<"login" | "register">("login");
// // //   const { skipAsGuest } = useAuthStore();
// // //   const navigate = useNavigate();

// // //   return (
// // //     <div className="min-h-screen flex items-center justify-center bg-[#050816]">

// // //       <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-[#0b1220] rounded-3xl overflow-hidden border border-white/10">

// // //         {/* LEFT */}
// // //         <div className="p-10 hidden lg:flex flex-col justify-center">
// // //           <h1 className="text-4xl font-bold">
// // //             Fresh groceries in{" "}
// // //             <span className="text-[#ff4d6d]">
// // //               10 minutes
// // //             </span>
// // //           </h1>
// // //         </div>

// // //         {/* RIGHT */}
// // //         <div className="p-8">

// // //           <div className="flex gap-6 mb-6">
// // //             <button
// // //               onClick={() => setTab("login")}
// // //               className={
// // //                 tab === "login"
// // //                   ? "text-[#ff4d6d]"
// // //                   : "text-gray-400"
// // //               }
// // //             >
// // //               Login
// // //             </button>

// // //             <button
// // //               onClick={() => setTab("register")}
// // //               className={
// // //                 tab === "register"
// // //                   ? "text-[#ff4d6d]"
// // //                   : "text-gray-400"
// // //               }
// // //             >
// // //               Signup
// // //             </button>
// // //           </div>

// // //           {tab === "login" ? (
// // //             <LoginForm onSwitch={() => setTab("register")} />
// // //           ) : (
// // //             <RegisterForm onSwitch={() => setTab("login")} />
// // //           )}

// // //           <button
// // //             onClick={() => {
// // //               skipAsGuest();
// // //               navigate("/home");
// // //             }}
// // //             className="text-sm text-gray-400 mt-6"
// // //           >
// // //             Skip for now
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // import { useState } from "react";
// // import LoginForm from "../components/auth/LoginForm";
// // import RegisterForm from "../components/auth/RegisterForm";
// // import { useAuthStore } from "../store/authStore";
// // import { useNavigate } from "react-router-dom";

// // export default function AuthLayout() {
// //   const [tab, setTab] = useState<"login" | "register">("login");
// //   const { skipAsGuest } = useAuthStore();
// //   const navigate = useNavigate();

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-[#050816]">
// //       <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-[#0b1220] rounded-3xl overflow-hidden border border-white/10">

// //         {/* LEFT */}
// //         <div className="p-10 hidden lg:flex flex-col justify-center">
// //           <h1 className="text-4xl font-bold">
// //             Fresh groceries in{" "}
// //             <span className="text-[#ff4d6d]">10 minutes</span>
// //           </h1>
// //         </div>

// //         {/* RIGHT */}
// //         <div className="p-8">
// //           {/* Tabs */}
// //           <div className="flex gap-6 mb-6">
// //             <button
// //               onClick={() => setTab("login")}
// //               className={
// //                 tab === "login"
// //                   ? "text-[#ff4d6d] font-semibold"
// //                   : "text-gray-400"
// //               }
// //             >
// //               Login
// //             </button>

// //             <button
// //               onClick={() => setTab("register")}
// //               className={
// //                 tab === "register"
// //                   ? "text-[#ff4d6d] font-semibold"
// //                   : "text-gray-400"
// //               }
// //             >
// //               Signup
// //             </button>
// //           </div>

// //           {/* Forms */}
// //           {tab === "login" ? (
// //             <LoginForm onSwitch={() => setTab("register")} />
// //           ) : (
// //             <RegisterForm onSwitch={() => setTab("login")} />
// //           )}

// //           {/* Skip */}
// //           <button
// //             onClick={() => {
// //               skipAsGuest();
// //               navigate("/home");
// //             }}
// //             className="text-sm text-gray-400 mt-6"
// //           >
// //             Skip for now
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// // layouts/AuthLayout.tsx

// import { useState } from "react"
// import LoginForm from "../components/auth/LoginForm"
// import RegisterForm from "../components/auth/RegisterForm"
// import { useAuthStore } from "../store/authStore"
// import { useNavigate } from "react-router-dom"
// import groceryImage from "../assets/bgimage.png"

// export default function AuthLayout() {
//   const [tab, setTab] = useState<"login" | "register">("login")
//   const { skipAsGuest } = useAuthStore()
//   const navigate = useNavigate()

//   return (
//     <div className="min-h-screen flex items-center justify-center px-6
//       bg-[radial-gradient(circle_at_top_right,#0b1220,#050816)]">

//       <div className="w-full max-w-6xl grid lg:grid-cols-2
//         bg-[#0b1220] border border-white/10
//         rounded-3xl overflow-hidden shadow-2xl">

//         {/* LEFT SIDE */}
//         <div className="hidden lg:flex flex-col justify-between p-12 relative">

//           <div className="absolute inset-0 opacity-20
//           bg-black" /> 

//           <div className="relative z-10">
//             <h1 className="text-5xl font-bold leading-tight">
//               Fresh groceries delivered in
//               <span className="text-[#ff4d6d]"> 10 minutes</span>
//             </h1>

//             <p className="text-gray-400 mt-6 text-lg">
//               Order fresh groceries instantly at your doorstep.
//             </p>
//           </div>

//           <img
//             src={groceryImage}
//             className="relative z-10 w-[90%] mx-auto"
//           />
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="p-8 md:p-12 bg-[radial-gradient(left,#ff4d6d,transparent_60%)]">

//           {/* TABS */}
//           <div className="flex gap-6 mb-8 text-lg">
//             <button
//               onClick={() => setTab("login")}
//               className={`${
//                 tab === "login"
//                   ? "text-[#ff4d6d] border-b border-[#ff4d6d]"
//                   : "text-gray-400"
//               } pb-1`}
//             >
//               Login
//             </button>

//             <button
//               onClick={() => setTab("register")}
//               className={`${
//                 tab === "register"
//                   ? "text-[#ff4d6d] border-b border-[#ff4d6d]"
//                   : "text-gray-400"
//               } pb-1`}
//             >
//               Signup
//             </button>
//           </div>

//           {/* FORM */}
//           {tab === "login" ? (
//             <LoginForm onSwitch={() => setTab("register")} />
//           ) : (
//             <RegisterForm onSwitch={() => setTab("login")} />
//           )}

//           {/* SKIP */}
//           <button
//             onClick={() => {
//               skipAsGuest()
//               navigate("/home")
//             }}
//             className="mt-6 text-sm text-gray-400 hover:text-white"
//           >
//             Skip for now
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
// // [radial-gradient(circle,#ff4d6d,transparent_60%)]


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import OtpForm from '../components/auth/OtpForm';
import groceryImage from "../assets/bgimage.png"

type Tab = 'login' | 'register';

export default function AuthLayout() {
  const [tab, setTab] = useState<Tab>('login');
  const { skipAsGuest, authStep, pendingEmail, isAuthenticated, clearError, clearFieldErrors } = useAuthStore();
  const navigate = useNavigate();

  const showOtp = authStep === 'pending_otp' && !!pendingEmail;

  useEffect(() => {
    if (isAuthenticated) navigate('/home', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSkip = () => { skipAsGuest(); navigate('/home'); };

  const switchTab = (newTab: Tab) => {
    clearError();
    clearFieldErrors();
    setTab(newTab);
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#ff4d6d]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative z-10">
 <div className="hidden lg:flex flex-col justify-between p-12 relative">

          <div className="absolute inset-0 opacity-20
         bg-black" /> 

           <div className="relative z-10">
            <h1 className="text-5xl font-bold leading-tight">
               Fresh groceries delivered in
              <span className="text-[#ff4d6d]"> 10 minutes</span>
           </h1>
          <p className="text-gray-400 mt-6 text-lg">
              Order fresh groceries instantly at your doorstep.
            </p>
          </div>

          <img
            src={groceryImage}
            className="relative z-10 w-[90%] mx-auto"
          />
        </div>
        {/* ── RIGHT AUTH ── */}
        <div className="glass-dark border-l border-white/8 p-8 flex flex-col justify-center min-h-[600px] max-h-[90vh] overflow-y-auto scrollbar-hide">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden mb-6">
            <div className="w-8 h-8 rounded-xl bg-[#ff4d6d]/20 border border-[#ff4d6d]/30 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff4d6d" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
            </div>
            <span className="font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Fresh<span className="text-[#ff4d6d]">Cart</span></span>
          </div>

          {showOtp ? (
            /* ── OTP SCREEN ── */
            <div>
              <div className="mb-6">
                <button
                  onClick={() => {
                    useAuthStore.getState().clearError()
                    useAuthStore.setState({ authStep: 'idle', pendingEmail: null, error: null })
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                  Back
                </button>
                <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>Verify Email ✉️</h2>
                <p className="text-gray-400 text-sm">We sent a 6-digit code to your inbox</p>
              </div>
              <OtpForm email={pendingEmail!} />
              <button onClick={handleSkip} className="mt-5 text-xs text-gray-600 hover:text-gray-400 transition-colors w-full text-center">
                Skip verification for now
              </button>
            </div>
          ) : (
            /* ── LOGIN / REGISTER ── */
            <>
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {tab === 'login' ? 'Welcome Back 👋' : 'Create Account 🛒'}
                </h2>
                <p className="text-gray-400 text-sm">
                  {tab === 'login' ? 'Sign in to continue shopping.' : 'Join FreshCart for free.'}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex mb-6 bg-white/5 rounded-2xl p-1 gap-1">
                {(['login', 'register'] as Tab[]).map(t => (
                  <button
                    key={t}
                    onClick={() => switchTab(t)}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${tab === t
                        ? 'bg-[#ff4d6d] text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                      }`}
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    {t === 'login' ? 'Login' : 'Sign Up'}
                  </button>
                ))}
              </div>

              {tab === 'login' ? (
                <LoginForm
                  onSwitch={() => switchTab('register')}
                  onNeedsOtp={() => { /* authStore already handles state */ }}
                />
              ) : (
                <RegisterForm
                  onSwitch={() => switchTab('login')}
                  onRegistered={() => { /* authStore sets authStep=pending_otp */ }}
                />
              )}

              <button onClick={handleSkip} className="mt-5 text-xs text-gray-600 hover:text-gray-400 transition-colors w-full text-center">
                Skip for now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
