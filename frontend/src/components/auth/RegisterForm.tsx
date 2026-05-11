// interface Props {
//   onSwitch?: () => void;
// }

// const RegisterForm = ({ onSwitch }: Props) => {
//   return (
//     <div>
//       <div className="mb-8">
//         <h2 className="text-4xl font-bold">Create Account</h2>

//         <p className="text-gray-400 mt-3">
//           Join us and order groceries faster than ever.
//         </p>
//       </div>

//       <form className="space-y-5">
//         <input
//           type="text"
//           placeholder="Full Name"
//           className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-[#ff4d6d]"
//         />

//         <input
//           type="email"
//           placeholder="Email Address"
//           className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-[#ff4d6d]"
//         />

//         <input
//           type="password"
//           placeholder="Create Password"
//           className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-[#ff4d6d]"
//         />

//         <button
//           type="submit"
//           className="w-full bg-[#ff4d6d] hover:bg-[#ff355d] transition-all py-4 rounded-xl font-semibold"
//         >
//           Create Account
//         </button>
//       </form>

//       <p className="text-center text-gray-400 mt-8">
//         Already have an account?

//         <button
//           type="button"
//           onClick={() => onSwitch?.()}
//           className="text-[#ff4d6d] ml-2 font-semibold"
//         >
//           Login
//         </button>
//       </p>
//     </div>
//   )
// }

// export default RegisterForm

// import { useState, useCallback } from 'react';
// import Input from '../common/Input';
// import PasswordStrengthBar from './PasswordStrengthBar';
// import SocialButtons from './SocialButtons';
// import { useAuthStore } from '../../store/authStore';
// import {
//   validateName,
//   validateEmail,
//   validateUsername,
//   validatePassword,
//   validateConfirmPassword,
//   hasErrors,
// } from '../../utils/validators';

// interface Props {
//   onSwitch: () => void;
//   onRegistered: () => void;
// }

// export default function RegisterForm({ onSwitch, onRegistered }: Props) {
//   const [fields, setFields] = useState({
//     name: '', email: '', username: '', password: '', confirm: '',
//   });
//   const [touched, setTouched] = useState({
//     name: false, email: false, username: false, password: false, confirm: false,
//   });
//   const [showPass, setShowPass] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const { register, loading, error, fieldErrors, clearError, clearFieldErrors } = useAuthStore();

//   // Merge live client errors with server fieldErrors
//   const liveErrors = {
//     name: validateName(fields.name),
//     email: validateEmail(fields.email),
//     username: validateUsername(fields.username),
//     password: validatePassword(fields.password),
//     confirm: validateConfirmPassword(fields.password, fields.confirm),
//   };

//   // Server-side field errors override client errors
//   const resolvedErrors = {
//     name: fieldErrors.name || liveErrors.name,
//     email: fieldErrors.email || liveErrors.email,
//     username: fieldErrors.username || liveErrors.username,
//     password: fieldErrors.password || liveErrors.password,
//     confirm: liveErrors.confirm,
//   };

//   const setField = useCallback((key: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
//     clearError();
//     clearFieldErrors();
//     setFields(f => ({ ...f, [key]: e.target.value }));
//   }, [clearError, clearFieldErrors]);

//   const touch = (key: keyof typeof touched) => () =>
//     setTouched(t => ({ ...t, [key]: true }));

//   const touchAll = () =>
//     setTouched({ name: true, email: true, username: true, password: true, confirm: true });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     touchAll();
//     if (hasErrors(liveErrors)) return;

//     try {
//       await register({
//         name: fields.name.trim(),
//         email: fields.email.trim().toLowerCase(),
//         username: fields.username.trim(),
//         password: fields.password,
//       });
//       onRegistered();
//     } catch {
//       // Errors handled in store
//     }
//   };

//   const EyeButton = ({ show, toggle }: { show: boolean; toggle: () => void }) => (
//     <button type="button" onClick={toggle} className="text-gray-500 hover:text-gray-300 transition-colors p-0.5" tabIndex={-1}>
//       {show ? (
//         <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//           <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
//           <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
//           <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
//           <line x1="1" y1="1" x2="23" y2="23" />
//         </svg>
//       ) : (
//         <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//           <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
//         </svg>
//       )}
//     </button>
//   );

//   return (
//     <div>
//       <div>
//         <div className="mb-8">
//           <h2 className="text-4xl font-bold">Create Account</h2>

//           <p className="text-gray-400 mt-3">
//             Join us and order groceries faster than ever.         </p>
//         </div>
//         <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 space-y-5 animate-fadeIn" noValidate>

//           {/* Global API error */}
//           {error && (
//             <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-fadeIn">
//               <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" className="shrink-0 mt-0.5">
//                 <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
//               </svg>
//               <p className="text-red-400 text-xs leading-relaxed">{error}</p>
//             </div>
//           )}

//           <Input
//             label="Full Name"
//             type="text"
//             placeholder="John Doe"
//             value={fields.name}
//             onChange={setField('name')}
//             onBlur={touch('name')}
//             touched={touched.name}
//             error={resolvedErrors.name}
//             autoComplete="name"
//             leftEl={
//               <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
//               </svg>
//             }
//           />

//           <Input
//             label="Email Address"
//             type="email"
//             placeholder="john@example.com"
//             value={fields.email}
//             onChange={setField('email')}
//             onBlur={touch('email')}
//             touched={touched.email}
//             error={resolvedErrors.email}
//             autoComplete="email"
//             leftEl={
//               <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
//               </svg>
//             }
//           />

//           <Input
//             label="Username"
//             type="text"
//             placeholder="johndoe123"
//             value={fields.username}
//             onChange={setField('username')}
//             onBlur={touch('username')}
//             touched={touched.username}
//             error={resolvedErrors.username}
//             autoComplete="username"
//             autoCapitalize="none"
//             hint={!touched.username ? 'Letters, numbers, underscores only' : undefined}
//             leftEl={
//               <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
//               </svg>
//             }
//           />

//           <div className="flex flex-col gap-1">
//             <Input
//               label="Password"
//               type={showPass ? 'text' : 'password'}
//               placeholder="Min 8 chars, 1 uppercase, 1 number"
//               value={fields.password}
//               onChange={setField('password')}
//               onBlur={touch('password')}
//               touched={touched.password}
//               error={resolvedErrors.password}
//               autoComplete="new-password"
//               leftEl={
//                 <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
//                 </svg>
//               }
//               rightEl={<EyeButton show={showPass} toggle={() => setShowPass(v => !v)} />}
//             />
//             {fields.password && <PasswordStrengthBar password={fields.password} />}
//           </div>

//           <Input
//             label="Confirm Password"
//             type={showConfirm ? 'text' : 'password'}
//             placeholder="Repeat your password"
//             value={fields.confirm}
//             onChange={setField('confirm')}
//             onBlur={touch('confirm')}
//             touched={touched.confirm}
//             error={resolvedErrors.confirm}
//             autoComplete="new-password"
//             leftEl={
//               <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
//               </svg>
//             }
//             rightEl={<EyeButton show={showConfirm} toggle={() => setShowConfirm(v => !v)} />}
//           />

//           {/* Terms checkbox */}
//           <label className="flex items-start gap-3 cursor-pointer group">
//             <div className="relative mt-0.5">
//               <input type="checkbox" required className="sr-only peer" />
//               <div className="w-4 h-4 rounded-md border border-white/20 bg-white/5 peer-checked:bg-[#ff4d6d] peer-checked:border-[#ff4d6d] transition-all flex items-center justify-center">
//                 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="opacity-0 peer-checked:opacity-100">
//                   <polyline points="20 6 9 17 4 12" />
//                 </svg>
//               </div>
//             </div>
//             <span className="text-xs text-gray-500 leading-relaxed">
//               I agree to the{' '}
//               <button type="button" className="text-[#ff4d6d] hover:text-pink-300 transition-colors">Terms of Service</button>
//               {' '}and{' '}
//               <button type="button" className="text-[#ff4d6d] hover:text-pink-300 transition-colors">Privacy Policy</button>
//             </span>
//           </label>

//           <button
//             type="submit"
//             disabled={loading}
//             className="relative w-full py-3 rounded-2xl font-semibold text-sm text-white transition-all mt-1 overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed"
//             style={{
//               background: 'linear-gradient(135deg, #ff4d6d, #e63c5a)',
//               boxShadow: loading ? 'none' : '0 8px 25px rgba(255,77,109,0.35)',
//               fontFamily: 'Sora, sans-serif',
//             }}
//           >
//             <span className={`flex items-center justify-center gap-2 transition-opacity ${loading ? 'opacity-0' : 'opacity-100'}`}>
//               Create Account
//             </span>
//             {loading && (
//               <span className="absolute inset-0 flex items-center justify-center gap-2">
//                 <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                 </svg>
//                 Creating account...
//               </span>
//             )}
//             <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12 pointer-events-none" />
//           </button>

//           <SocialButtons />

//           <p className="text-center text-sm text-gray-500">
//             Already have an account?{' '}
//             <button
//               type="button"
//               onClick={onSwitch}
//               className="text-[#ff4d6d] hover:text-pink-300 font-semibold transition-colors"
//             >
//               Login
//             </button>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useState, useCallback } from 'react';
import Input from '../common/Input';
import PasswordStrengthBar from './PasswordStrengthBar';
import SocialButtons from './SocialButtons';
import { useAuthStore } from '../../store/authStore';
 
import {
  validateName,
  validateEmail,
  validateUsername,
  validatePassword,
  validateConfirmPassword,
  hasErrors,
} from '../../utils/validators';
 
interface Props {
  onSwitch: () => void;
  onRegistered: () => void;
}
 
export default function RegisterForm({ onSwitch, onRegistered }: Props) {
  const [fields, setFields] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirm: '',
  });
 
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    username: false,
    password: false,
    confirm: false,
  });
 
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
 
  const {
    register,
    loading,
    error,
    fieldErrors,
    clearError,
    clearFieldErrors,
  } = useAuthStore();
 
  /* ---------------- Validation ---------------- */
 
  const liveErrors = {
    name: validateName(fields.name),
    email: validateEmail(fields.email),
    username: validateUsername(fields.username),
    password: validatePassword(fields.password),
    confirm: validateConfirmPassword(fields.password, fields.confirm),
  };
 
  // Server errors override client errors
  const resolvedErrors = {
    name: fieldErrors.name || liveErrors.name,
    email: fieldErrors.email || liveErrors.email,
    username: fieldErrors.username || liveErrors.username,
    password: fieldErrors.password || liveErrors.password,
    confirm: liveErrors.confirm,
  };
 
  /* ---------------- Helpers ---------------- */
 
  const setField =
    (key: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      clearError();
      clearFieldErrors();
      setFields(prev => ({
        ...prev,
        [key]: e.target.value,
      }));
    };
 
  const touch =
    (key: keyof typeof touched) =>
    () =>
      setTouched(prev => ({
        ...prev,
        [key]: true,
      }));
 
  const touchAll = () =>
    setTouched({
      name: true,
      email: true,
      username: true,
      password: true,
      confirm: true,
    });
 
  /* ---------------- Submit ---------------- */
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    touchAll();
 
    if (hasErrors(liveErrors)) return;
 
    try {
      await register({
        name: fields.name.trim(),
        email: fields.email.trim().toLowerCase(),
        username: fields.username.trim(),
        password: fields.password,
      });
 
      onRegistered();
    } catch {
      // handled inside auth store
    }
  };
 
  /* ---------------- UI Helpers ---------------- */
 
  const EyeButton = ({
    show,
    toggle,
  }: {
    show: boolean;
    toggle: () => void;
  }) => (
    <button
      type="button"
      onClick={toggle}
      tabIndex={-1}
      className="text-gray-500 hover:text-gray-300 transition-colors p-0.5"
    >
      {show ? (
        <svg
          width="15"
          height="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
          <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg
          width="15"
          height="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );
 
  /* ---------------- JSX ---------------- */
 
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-4xl font-bold">Create Account</h2>
        <p className="text-gray-400 mt-3">
          Join us and order groceries faster than ever.
        </p>
      </div>
 
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-3.5 space-y-5 animate-fadeIn"
      >
        {/* Global API error */}
        {error && (
          <div className="flex gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        )}
 
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={fields.name}
          onChange={setField('name')}
          onBlur={touch('name')}
          touched={touched.name}
          error={resolvedErrors.name}
          autoComplete="name"
        />
 
        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          value={fields.email}
          onChange={setField('email')}
          onBlur={touch('email')}
          touched={touched.email}
          error={resolvedErrors.email}
          autoComplete="email"
        />
 
        <Input
          label="Username"
          type="text"
          placeholder="johndoe123"
          value={fields.username}
          onChange={setField('username')}
          onBlur={touch('username')}
          touched={touched.username}
          error={resolvedErrors.username}
          autoComplete="username"
          hint={!touched.username ? 'Letters, numbers, underscores only' : undefined}
        />
 
        <div className="flex flex-col gap-1">
          <Input
            label="Password"
            type={showPass ? 'text' : 'password'}
            placeholder="Min 8 chars, 1 uppercase, 1 number"
            value={fields.password}
            onChange={setField('password')}
            onBlur={touch('password')}
            touched={touched.password}
            error={resolvedErrors.password}
            autoComplete="new-password"
            rightEl={
              <EyeButton
                show={showPass}
                toggle={() => setShowPass(v => !v)}
              />
            }
          />
 
          {fields.password && (
            <PasswordStrengthBar password={fields.password} />
          )}
        </div>
 
        <Input
          label="Confirm Password"
          type={showConfirm ? 'text' : 'password'}
          placeholder="Repeat your password"
          value={fields.confirm}
          onChange={setField('confirm')}
          onBlur={touch('confirm')}
          touched={touched.confirm}
          error={resolvedErrors.confirm}
          autoComplete="new-password"
          rightEl={
            <EyeButton
              show={showConfirm}
              toggle={() => setShowConfirm(v => !v)}
            />
          }
        />
 
        <button
          type="submit"
          disabled={loading}
          className="relative w-full py-3 rounded-2xl font-semibold text-white transition-all disabled:opacity-60"
          style={{
            background: 'linear-gradient(135deg, #ff4d6d, #e63c5a)',
            boxShadow: loading ? 'none' : '0 8px 25px rgba(255,77,109,0.35)',
          }}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
 
        <SocialButtons />
 
        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitch}
            className="text-[#ff4d6d] font-semibold hover:text-pink-300"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}