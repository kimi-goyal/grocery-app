
interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> { label: string; options: { value: string; label: string }[]; }

export default function AdminSelect({ label, options, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[#94A3B8]">{label}</label>
      <select className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF4D8D]/50 transition-all" style={{ fontFamily: 'DM Sans,sans-serif' }} {...props}>
        <option value="">Select {label}</option>
        {options.map(o => <option key={o.value} value={o.value} className="bg-[#0d1b2a]">{o.label}</option>)}
      </select>
    </div>
  );
}
