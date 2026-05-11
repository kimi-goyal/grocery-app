// import React from "react";

// interface InputProps
//   extends React.InputHTMLAttributes<HTMLInputElement> {
//   label?: string;
//   rightEl?: React.ReactNode;
// }

// export default function Input({
//   label,
//   rightEl,
//   ...props
// }: InputProps) {
//   return (
//     <div className="flex flex-col gap-1.5">
//       {label && (
//         <label className="text-xs text-gray-400 px-1">
//           {label}
//         </label>
//       )}

//       <div className="relative">
//         <input className="input-field pr-10" {...props} />

//         {rightEl && (
//           <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
//             {rightEl}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  touched?: boolean;
  hint?: string;
  rightEl?: React.ReactNode;
  leftEl?: React.ReactNode;
}

export default function Input({ label, error, touched, hint, rightEl, leftEl, className = '', ...props }: InputProps) {
  const showError = touched && error;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className={`text-xs font-medium px-0.5 transition-colors ${showError ? 'text-red-400' : 'text-gray-400'}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {leftEl && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            {leftEl}
          </div>
        )}
        <input
          className={`
            w-full bg-white/5 border rounded-xl py-3 text-sm text-white placeholder-gray-600
            focus:outline-none transition-all duration-200
            ${leftEl ? 'pl-10' : 'pl-4'}
            ${rightEl ? 'pr-10' : 'pr-4'}
            ${showError
              ? 'border-red-500/60 bg-red-500/5 focus:border-red-500/80 focus:ring-2 focus:ring-red-500/10'
              : 'border-white/10 focus:border-[#ff4d6d]/50 focus:bg-white/7 focus:ring-2 focus:ring-[#ff4d6d]/10'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          style={{ fontFamily: 'DM Sans, sans-serif' }}
          {...props}
        />
        {rightEl && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightEl}
          </div>
        )}
      </div>

      {/* Error or hint */}
      <div className="min-h-[16px] px-0.5">
        {showError ? (
          <p className="text-xs text-red-400 flex items-center gap-1 animate-fadeIn">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </p>
        ) : hint ? (
          <p className="text-xs text-gray-600">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}
