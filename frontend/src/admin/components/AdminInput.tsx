import type{ ReactNode } from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  rightEl?: ReactNode;
}

export default function AdminInput({ label, error, hint, rightEl, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[#94A3B8]">{label}</label>
      <div className="relative">
        <input
          className={`w-full bg-white/5 border rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-all pr-10
            ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#FF4D8D]/50 focus:bg-white/7'}`}
          style={{ fontFamily: 'DM Sans,sans-serif' }}
          {...props}
        />
        {rightEl && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>}
      </div>
      {hint && <p className="text-[10px] text-[#94A3B8]">{hint}</p>}
      {error && <p className="text-[10px] text-red-400">{error}</p>}
    </div>
  );
}

