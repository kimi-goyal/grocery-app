import React from "react";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  rightEl?: React.ReactNode;
}

export default function Input({
  label,
  rightEl,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs text-gray-400 px-1">
          {label}
        </label>
      )}

      <div className="relative">
        <input className="input-field pr-10" {...props} />

        {rightEl && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {rightEl}
          </div>
        )}
      </div>
    </div>
  );
}