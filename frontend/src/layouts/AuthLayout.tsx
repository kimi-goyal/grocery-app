// // import type { ReactNode } from 'react'
// // import groceryImage from '../assets/grocery-banner.png'

// // interface Props {
// //   children: ReactNode
// // }

// // const AuthLayout = ({ children }: Props) => {
// //   return (
// //     <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-4 py-8">
// //       <div className="w-full max-w-7xl grid lg:grid-cols-2 bg-[#0b1220] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
// //         <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#09101f] relative overflow-hidden">
// //           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,#ff4d6d,transparent_40%)]" />

// //           <div className="relative z-10">
// //             <h1 className="text-5xl font-bold leading-tight">
// //               Fresh groceries delivered in
// //               <span className="text-[#ff4d6d]"> 10 minutes</span>
// //             </h1>

// //             <p className="text-gray-400 mt-6 text-lg leading-relaxed">
// //               Order fresh groceries instantly at your doorstep.
// //             </p>
// //           </div>

// //           <div className="relative z-10 flex justify-center">
// //             <img
// //               src={groceryImage}
// //               alt="grocery"
// //               className="w-[85%] object-contain"
// //             />
// //           </div>
// //         </div>

// //         <div className="flex items-center justify-center p-6 md:p-12 bg-[#07101d]">
// //           <div className="w-full max-w-md">{children}</div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default AuthLayout
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
// //             <span className="text-[#ff4d6d]">
// //               10 minutes
// //             </span>
// //           </h1>
// //         </div>

// //         {/* RIGHT */}
// //         <div className="p-8">

// //           <div className="flex gap-6 mb-6">
// //             <button
// //               onClick={() => setTab("login")}
// //               className={
// //                 tab === "login"
// //                   ? "text-[#ff4d6d]"
// //                   : "text-gray-400"
// //               }
// //             >
// //               Login
// //             </button>

// //             <button
// //               onClick={() => setTab("register")}
// //               className={
// //                 tab === "register"
// //                   ? "text-[#ff4d6d]"
// //                   : "text-gray-400"
// //               }
// //             >
// //               Signup
// //             </button>
// //           </div>

// //           {tab === "login" ? (
// //             <LoginForm onSwitch={() => setTab("register")} />
// //           ) : (
// //             <RegisterForm onSwitch={() => setTab("login")} />
// //           )}

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

// import { useState } from "react";
// import LoginForm from "../components/auth/LoginForm";
// import RegisterForm from "../components/auth/RegisterForm";
// import { useAuthStore } from "../store/authStore";
// import { useNavigate } from "react-router-dom";

// export default function AuthLayout() {
//   const [tab, setTab] = useState<"login" | "register">("login");
//   const { skipAsGuest } = useAuthStore();
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#050816]">
//       <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-[#0b1220] rounded-3xl overflow-hidden border border-white/10">

//         {/* LEFT */}
//         <div className="p-10 hidden lg:flex flex-col justify-center">
//           <h1 className="text-4xl font-bold">
//             Fresh groceries in{" "}
//             <span className="text-[#ff4d6d]">10 minutes</span>
//           </h1>
//         </div>

//         {/* RIGHT */}
//         <div className="p-8">
//           {/* Tabs */}
//           <div className="flex gap-6 mb-6">
//             <button
//               onClick={() => setTab("login")}
//               className={
//                 tab === "login"
//                   ? "text-[#ff4d6d] font-semibold"
//                   : "text-gray-400"
//               }
//             >
//               Login
//             </button>

//             <button
//               onClick={() => setTab("register")}
//               className={
//                 tab === "register"
//                   ? "text-[#ff4d6d] font-semibold"
//                   : "text-gray-400"
//               }
//             >
//               Signup
//             </button>
//           </div>

//           {/* Forms */}
//           {tab === "login" ? (
//             <LoginForm onSwitch={() => setTab("register")} />
//           ) : (
//             <RegisterForm onSwitch={() => setTab("login")} />
//           )}

//           {/* Skip */}
//           <button
//             onClick={() => {
//               skipAsGuest();
//               navigate("/home");
//             }}
//             className="text-sm text-gray-400 mt-6"
//           >
//             Skip for now
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
// layouts/AuthLayout.tsx

import { useState } from "react"
import LoginForm from "../components/auth/LoginForm"
import RegisterForm from "../components/auth/RegisterForm"
import { useAuthStore } from "../store/authStore"
import { useNavigate } from "react-router-dom"
import groceryImage from "../assets/bgimage.png"

export default function AuthLayout() {
  const [tab, setTab] = useState<"login" | "register">("login")
  const { skipAsGuest } = useAuthStore()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center px-6
      bg-[radial-gradient(circle_at_top_right,#0b1220,#050816)]">

      <div className="w-full max-w-6xl grid lg:grid-cols-2
        bg-[#0b1220] border border-white/10
        rounded-3xl overflow-hidden shadow-2xl">

        {/* LEFT SIDE */}
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

        {/* RIGHT SIDE */}
        <div className="p-8 md:p-12 bg-[radial-gradient(left,#ff4d6d,transparent_60%)]">

          {/* TABS */}
          <div className="flex gap-6 mb-8 text-lg">
            <button
              onClick={() => setTab("login")}
              className={`${
                tab === "login"
                  ? "text-[#ff4d6d] border-b border-[#ff4d6d]"
                  : "text-gray-400"
              } pb-1`}
            >
              Login
            </button>

            <button
              onClick={() => setTab("register")}
              className={`${
                tab === "register"
                  ? "text-[#ff4d6d] border-b border-[#ff4d6d]"
                  : "text-gray-400"
              } pb-1`}
            >
              Signup
            </button>
          </div>

          {/* FORM */}
          {tab === "login" ? (
            <LoginForm onSwitch={() => setTab("register")} />
          ) : (
            <RegisterForm onSwitch={() => setTab("login")} />
          )}

          {/* SKIP */}
          <button
            onClick={() => {
              skipAsGuest()
              navigate("/home")
            }}
            className="mt-6 text-sm text-gray-400 hover:text-white"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}
// [radial-gradient(circle,#ff4d6d,transparent_60%)]