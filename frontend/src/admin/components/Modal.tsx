
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props { open: boolean; onClose: () => void; title: string; children: ReactNode; size?: 'sm' | 'md' | 'lg'; }

export default function Modal({ open, onClose, title, children, size = 'md' }: Props) {
  if (!open) return null;
  const w = size === 'sm' ? 'max-w-sm' : size === 'lg' ? 'max-w-2xl' : 'max-w-lg';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 w-full ${w} bg-[#0d1b2a] border border-white/12 rounded-2xl shadow-2xl animate-fadeUp`}>
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <h3 className="text-white font-bold text-base" style={{ fontFamily: 'Sora,sans-serif' }}>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            <X size={14} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

