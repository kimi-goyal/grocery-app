// // pages/entry/EntryPage.tsx
// import { useNavigate } from "react-router-dom"
// import groceryImage from "../../assets/grocery-banner.png"
// import { useAuthStore } from "../../store/authStore"

// const EntryPage = () => {
//   const navigate = useNavigate()
//   const { continueAsGuest } = useAuthStore()

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#050816] px-6">
//       <div className="max-w-6xl w-full grid lg:grid-cols-2 bg-[#0b1220] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">

//         {/* LEFT */}
//         <div className="p-12 flex flex-col justify-between relative">
//           <div>
//             <h1 className="text-5xl font-bold leading-tight">
//               Fresh groceries delivered in
//               <span className="text-[#ff4d6d]"> 10 minutes</span>
//             </h1>

//             <p className="text-gray-400 mt-6 text-lg">
//               Fastest grocery delivery with real time tracking.
//             </p>
//           </div>

//           <img src={groceryImage} className="w-[80%]" />
//         </div>

//         {/* RIGHT */}
//         <div className="flex flex-col justify-center items-center p-12 space-y-6">

//           <button
//             onClick={() => navigate("/login")}
//             className="w-full bg-[#ff4d6d] py-4 rounded-xl font-semibold hover:bg-[#ff2e5c]"
//           >
//             Get Started
//           </button>

//           <button
//             onClick={() => {
//               continueAsGuest()
//               navigate("/home")
//             }}
//             className="w-full border border-white/10 py-4 rounded-xl hover:border-[#ff4d6d]"
//           >
//             Skip for now
//           </button>

//         </div>
//       </div>
//     </div>
//   )
// }

// export default EntryPage

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";


export default function WelcomePage() {
  const navigate = useNavigate();
  const { skipAsGuest } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center p-4">

      <div className="w-full max-w-sm bg-[#0b1220] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-8">

        <h1 className="text-2xl font-bold mb-4">
          FreshCart
        </h1>

        <p className="text-gray-400 text-sm mb-6">
          Fresh groceries delivered in 10 minutes
        </p>

        <button
          onClick={() => navigate("/auth")}
          className="btn-primary mb-4"
        >
          Get Started
        </button>

        <button
          onClick={() => {
            skipAsGuest();
            navigate("/home");
          }}
          className="text-gray-400 text-sm w-full"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}