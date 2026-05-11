
import type { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string | number;
  delta?: number;
  icon: LucideIcon;
  color: string;
  prefix?: string;
}

export default function StatCard({ label, value, delta, icon: Icon, color, prefix = '' }: Props) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[rgba(17,25,40,0.75)] p-5 flex flex-col gap-3 hover:border-white/15 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-[#94A3B8] text-sm">{label}</span>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon size={17} style={{ color }} />
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-white" style={{ fontFamily: 'Sora,sans-serif' }}>
          {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}
        </div>
        {delta !== undefined && (
          <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${delta >= 0 ? 'text-[#22C55E]' : 'text-[#FF4D8D]'}`}>
            <span>{delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}%</span>
            <span className="text-[#94A3B8] font-normal">from yesterday</span>
          </div>
        )}
      </div>
    </div>
  );
}
