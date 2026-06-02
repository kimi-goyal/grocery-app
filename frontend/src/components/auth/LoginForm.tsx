// // import { Link } from 'react-router-dom'
// // import { FcGoogle } from 'react-icons/fc'
// // import { FaApple } from 'react-icons/fa'

// // const LoginForm = () => {
// //   return (
// //     <div>
// //       <div className="mb-8">
// //         <h2 className="text-4xl font-bold">Welcome Back 👋</h2>

// //         <p className="text-gray-400 mt-3">
// //           Login to continue shopping fresh groceries.
// //         </p>
// //       </div>

// //       <form className="space-y-5">
// //         <div>
// //           <label className="text-sm text-gray-300 mb-2 block">
// //             Email Address
// //           </label>

// //           <input
// //             type="email"
// //             placeholder="Enter your email"
// //             className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-[#ff4d6d] transition-all"
// //           />
// //         </div>

// //         <div>
// //           <div className="flex items-center justify-between mb-2">
// //             <label className="text-sm text-gray-300">Password</label>

// //             <button
// //               type="button"
// //               className="text-sm text-[#ff4d6d] hover:underline"
// //             >
// //               Forgot Password?
// //             </button>
// //           </div>

// //           <input
// //             type="password"
// //             placeholder="Enter password"
// //             className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-[#ff4d6d] transition-all"
// //           />
// //         </div>

// //         <button
// //           type="submit"
// //           className="w-full bg-[#ff4d6d] hover:bg-[#ff355d] transition-all py-4 rounded-xl font-semibold"
// //         >
// //           Login
// //         </button>
// //       </form>

// //       <div className="flex items-center gap-4 my-7">
// //         <div className="h-px flex-1 bg-white/10" />
// //         <span className="text-gray-400 text-sm">or continue with</span>
// //         <div className="h-px flex-1 bg-white/10" />
// //       </div>

// //       <div className="grid grid-cols-2 gap-4">
// //         <button className="bg-[#0f172a] border border-white/10 py-4 rounded-xl flex items-center justify-center gap-2 hover:border-[#ff4d6d] transition-all">
// //           <FcGoogle size={22} />
// //           Google
// //         </button>

// //         <button className="bg-[#0f172a] border border-white/10 py-4 rounded-xl flex items-center justify-center gap-2 hover:border-[#ff4d6d] transition-all">
// //           <FaApple size={20} />
// //           Apple
// //         </button>
// //       </div>

// //       <div className="mt-8 space-y-4">
// //         <p className="text-center text-gray-400">
// //           Don't have an account?
// //           <Link
// //             to="/signup"
// //             className="text-[#ff4d6d] ml-2 font-semibold"
// //           >
// //             Create Account
// //           </Link>
// //         </p>

// //         <Link
// //           to="/home"
// //           className="block text-center text-sm text-gray-400 hover:text-white transition-all"
// //         >
// //           Skip for now
// //         </Link>
// //       </div>
// //     </div>
// //   )
// // }

// // export default LoginForm
// // components/auth/LoginForm.tsx

// // import { useState } from "react";
// // import { useAuthStore } from "../../store/authStore";
// // import { useNavigate } from "react-router-dom";

// // interface Props {
// //   onSwitch?: () => void;
// // }

// // const LoginForm = ({ onSwitch }: Props) => {
// //   const { login } = useAuthStore();
// //   const navigate = useNavigate();

// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();

// //     // ✅ store only accepts email/name
// //     login({ email });

// //     navigate("/home");
// //   };

// //   return (
// //     <div>
// //       <form onSubmit={handleSubmit} className="space-y-5">
// //         <input
// //           type="email"
// //           placeholder="Email"
// //           className="input"
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //         />

// //         <input
// //           type="password"
// //           placeholder="Password"
// //           className="input"
// //           value={password}
// //           onChange={(e) => setPassword(e.target.value)}
// //         />

// //         <button type="submit" className="btn-primary">
// //           Login
// //         </button>
// //       </form>

// //       <p className="text-center text-gray-400 mt-8">
// //         Don't have an account?
// //         <button
// //           type="button"
// //           onClick={() => onSwitch?.()}
// //           className="text-[#ff4d6d] ml-2 font-semibold"
// //         >
// //           Create Account
// //         </button>
// //       </p>
// //     </div>
// //   );
// // };

// // export default LoginForm;
// // components/auth/LoginForm.tsx

// import { useState } from "react"
// import { useAuthStore } from "../../store/authStore"
// import { useNavigate } from "react-router-dom"

// interface Props {
//   onSwitch: () => void
// }

// export default function LoginForm({ onSwitch }: Props) {
//   const { login } = useAuthStore()
//   const navigate = useNavigate()

//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [showPass, setShowPass] = useState(false)

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!email || !password) return

//     login({ email })  // now matches store
//     navigate("/home")
//   }

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col gap-5">

//       <div>
//         <label className="text-sm text-gray-400 mb-2 block">
//           Email / Phone
//         </label>
//         <input
//             className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-[#ff4d6d]"
//           placeholder="Enter email or phone"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//       </div>

//       <div>
//         <label className="text-sm text-gray-400 mb-2 block">
//           Password
//         </label>

//         <div className="relative">
//           <input
//             type={showPass ? "text" : "password"}
//               className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-[#ff4d6d]"
//             placeholder="Enter password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <button
//             type="button"
//             onClick={() => setShowPass(!showPass)}
//             className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
//           >
//             {showPass ? "🙈" : "👁️"}
//           </button>
//         </div>
//       </div>

//       <div className="flex justify-end">
//         <button className="text-xs text-[#ff4d6d] hover:underline">
//           Forgot password?
//         </button>
//       </div>

//       <button className="btn-primary">
//         Login
//       </button>

//       <p className="text-center text-sm text-gray-500">
//         Don't have an account?
//         <button
//           onClick={onSwitch}
//           type="button"
//           className="ml-2 text-[#ff4d6d] font-medium"
//         >
//           Sign up
//         </button>
//       </p>
//     </form>
//   )
// }

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import GoogleButton from "../../components/auth/GoogleButton";

import { useAuthStore } from '../../store/authStore';
import {
  validateIdentifier,
  validateLoginPassword,
  validateLoginForm,
  hasErrors,
} from '../../utils/validators';
import { useCartStore } from '../../store/cartStore';


interface Props {
  onSwitch: () => void;
  onNeedsOtp?: () => void;
}

export default function LoginForm({ onSwitch, onNeedsOtp }: Props) {
  const [fields, setFields] = useState({ identifier: '', password: '' });
  const [touched, setTouched] = useState({ identifier: false, password: false });
  const [showPass, setShowPass] = useState(false);
  const { fetchCart } = useCartStore(); 
  const { login, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  // Live inline errors (only show for touched fields)
  const liveErrors = {
    identifier: validateIdentifier(fields.identifier),
    password: validateLoginPassword(fields.password),
  };

  const setField = useCallback((key: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    setFields(f => ({ ...f, [key]: e.target.value }));
  }, [clearError]);

  const touch = (key: keyof typeof touched) => () =>
    setTouched(t => ({ ...t, [key]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Touch all fields to show all errors at once on submit
    setTouched({ identifier: true, password: true });

    const errors = validateLoginForm(fields.identifier, fields.password);
    if (hasErrors(errors)) return;

    try {
      await login({ username: fields.identifier.trim(), password: fields.password });
      await fetchCart();
      navigate('/home');
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 403 && onNeedsOtp) onNeedsOtp();
    }
  };



  const isFormClean = !hasErrors(validateLoginForm(fields.identifier, fields.password));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-fadeIn" noValidate>

      {/* Global API error */}
      {error && (
        <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-fadeIn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p className="text-red-400 text-xs leading-relaxed">{error}</p>
        </div>
      )}

      <Input
        label="Email or Username"
        type="text"
        placeholder="Enter your email or username"
        value={fields.identifier}
        onChange={setField('identifier')}
        onBlur={touch('identifier')}
        touched={touched.identifier}
        error={liveErrors.identifier}
        autoComplete="username"
        autoCapitalize="none"
        leftEl={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        }
      />

      <Input
        label="Password"
        type={showPass ? 'text' : 'password'}
        placeholder="Enter your password"
        value={fields.password}
        onChange={setField('password')}
        onBlur={touch('password')}
        touched={touched.password}
        error={liveErrors.password}
        autoComplete="current-password"
        leftEl={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
        }
        rightEl={
          <button
            type="button"
            onClick={() => setShowPass(v => !v)}
            className="text-gray-500 hover:text-gray-300 transition-colors p-0.5"
            tabIndex={-1}
          >
            {showPass ? (
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                <path d="M14.12 14.12a3 3 0 11-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        }
      />

      <div className="flex justify-end -mt-2">
        <button
          type="button"
          className="text-xs text-[#ff4d6d] hover:text-pink-300 transition-colors font-medium"
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="relative w-full py-3 rounded-2xl font-semibold text-sm text-white transition-all mt-1 overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: 'linear-gradient(135deg, #ff4d6d, #e63c5a)',
          boxShadow: loading ? 'none' : '0 8px 25px rgba(255,77,109,0.35)',
          fontFamily: 'Sora, sans-serif',
        }}
      >
        <span className={`flex items-center justify-center gap-2 transition-opacity ${loading ? 'opacity-0' : 'opacity-100'}`}>
          Login
        </span>
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Logging in...
          </span>
        )}
        {/* Hover shimmer */}
        
        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12 pointer-events-none" />
      </button>
    
   <GoogleButton label="Login with Google" />
      <p className="text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="text-[#ff4d6d] hover:text-pink-300 font-semibold transition-colors"
        >
          Sign up
        </button>
      </p>
    </form>
  );
}

