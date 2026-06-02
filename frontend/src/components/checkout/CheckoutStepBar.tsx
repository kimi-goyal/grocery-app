const STEPS = ['Cart', 'Address', 'Payment', 'Confirmed'];

export default function CheckoutStepBar({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-0 py-6 px-4 max-w-lg mx-auto">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const active = step === n;
        const done = step > n;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                done
                  ? 'bg-green-500 border-2 border-green-500 text-white shadow-[0_0_12px_rgba(34,197,94,0.4)]'
                  : active
                  ? 'bg-[#ff4d6d] border-2 border-[#ff4d6d] text-white shadow-[0_0_16px_rgba(255,77,109,0.5)]'
                  : 'bg-white/5 border-2 border-white/10 text-gray-500'
              }`} style={{ fontFamily: 'Sora,sans-serif' }}>
                {done ? '✓' : n}
              </div>
              <span className={`text-[10px] font-semibold tracking-wider uppercase transition-colors ${
                active ? 'text-white' : done ? 'text-green-400' : 'text-gray-600'
              }`} style={{ fontFamily: 'Sora,sans-serif' }}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 mt-[-14px] rounded transition-all duration-500 ${
                done ? 'bg-green-500/60' : 'bg-white/8'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

