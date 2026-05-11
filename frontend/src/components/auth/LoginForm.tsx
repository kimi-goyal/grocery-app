// import { Link } from 'react-router-dom'
// import { FcGoogle } from 'react-icons/fc'
// import { FaApple } from 'react-icons/fa'

// const LoginForm = () => {
//   return (
//     <div>
//       <div className="mb-8">
//         <h2 className="text-4xl font-bold">Welcome Back 👋</h2>

//         <p className="text-gray-400 mt-3">
//           Login to continue shopping fresh groceries.
//         </p>
//       </div>

//       <form className="space-y-5">
//         <div>
//           <label className="text-sm text-gray-300 mb-2 block">
//             Email Address
//           </label>

//           <input
//             type="email"
//             placeholder="Enter your email"
//             className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-[#ff4d6d] transition-all"
//           />
//         </div>

//         <div>
//           <div className="flex items-center justify-between mb-2">
//             <label className="text-sm text-gray-300">Password</label>

//             <button
//               type="button"
//               className="text-sm text-[#ff4d6d] hover:underline"
//             >
//               Forgot Password?
//             </button>
//           </div>

//           <input
//             type="password"
//             placeholder="Enter password"
//             className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-[#ff4d6d] transition-all"
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-[#ff4d6d] hover:bg-[#ff355d] transition-all py-4 rounded-xl font-semibold"
//         >
//           Login
//         </button>
//       </form>

//       <div className="flex items-center gap-4 my-7">
//         <div className="h-px flex-1 bg-white/10" />
//         <span className="text-gray-400 text-sm">or continue with</span>
//         <div className="h-px flex-1 bg-white/10" />
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <button className="bg-[#0f172a] border border-white/10 py-4 rounded-xl flex items-center justify-center gap-2 hover:border-[#ff4d6d] transition-all">
//           <FcGoogle size={22} />
//           Google
//         </button>

//         <button className="bg-[#0f172a] border border-white/10 py-4 rounded-xl flex items-center justify-center gap-2 hover:border-[#ff4d6d] transition-all">
//           <FaApple size={20} />
//           Apple
//         </button>
//       </div>

//       <div className="mt-8 space-y-4">
//         <p className="text-center text-gray-400">
//           Don't have an account?
//           <Link
//             to="/signup"
//             className="text-[#ff4d6d] ml-2 font-semibold"
//           >
//             Create Account
//           </Link>
//         </p>

//         <Link
//           to="/home"
//           className="block text-center text-sm text-gray-400 hover:text-white transition-all"
//         >
//           Skip for now
//         </Link>
//       </div>
//     </div>
//   )
// }

// export default LoginForm
// components/auth/LoginForm.tsx

// import { useState } from "react";
// import { useAuthStore } from "../../store/authStore";
// import { useNavigate } from "react-router-dom";

// interface Props {
//   onSwitch?: () => void;
// }

// const LoginForm = ({ onSwitch }: Props) => {
//   const { login } = useAuthStore();
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     // ✅ store only accepts email/name
//     login({ email });

//     navigate("/home");
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit} className="space-y-5">
//         <input
//           type="email"
//           placeholder="Email"
//           className="input"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="input"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button type="submit" className="btn-primary">
//           Login
//         </button>
//       </form>

//       <p className="text-center text-gray-400 mt-8">
//         Don't have an account?
//         <button
//           type="button"
//           onClick={() => onSwitch?.()}
//           className="text-[#ff4d6d] ml-2 font-semibold"
//         >
//           Create Account
//         </button>
//       </p>
//     </div>
//   );
// };

// export default LoginForm;
// components/auth/LoginForm.tsx

import { useState } from "react"
import { useAuthStore } from "../../store/authStore"
import { useNavigate } from "react-router-dom"

interface Props {
  onSwitch: () => void
}

export default function LoginForm({ onSwitch }: Props) {
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) return

    login({ email })  // now matches store
    navigate("/home")
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      <div>
        <label className="text-sm text-gray-400 mb-2 block">
          Email / Phone
        </label>
        <input
            className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-[#ff4d6d]"
          placeholder="Enter email or phone"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm text-gray-400 mb-2 block">
          Password
        </label>

        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
              className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-[#ff4d6d]"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPass ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="text-xs text-[#ff4d6d] hover:underline">
          Forgot password?
        </button>
      </div>

      <button className="btn-primary">
        Login
      </button>

      <p className="text-center text-sm text-gray-500">
        Don't have an account?
        <button
          onClick={onSwitch}
          type="button"
          className="ml-2 text-[#ff4d6d] font-medium"
        >
          Sign up
        </button>
      </p>
    </form>
  )
}
