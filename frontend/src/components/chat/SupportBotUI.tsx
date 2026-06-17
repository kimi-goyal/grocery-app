export function BotBubble({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div
      className="flex gap-2 items-start"
      style={{ animation: `botSlideUp 0.25s ease ${delay}ms both` }}
    >
      <div className="w-6 h-6 rounded-lg bg-[#ff4d6d]/15 border border-[#ff4d6d]/25 flex items-center justify-center text-sm shrink-0 mt-0.5">
        🛒
      </div>
      <div
        className="px-3 py-2.5 rounded-2xl rounded-tl-sm text-sm text-gray-200 leading-relaxed max-w-[85%]"
        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {children}
      </div>
    </div>
  );
}

export function MenuTile({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all hover:border-[#ff4d6d]/30 hover:bg-[#ff4d6d]/5 active:scale-[0.96] text-center"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-white text-xs font-semibold" style={{ fontFamily: 'Sora,sans-serif' }}>{label}</span>
    </button>
  );
}

export function ActionTile({
  icon, label, sub, onClick, accent = false, danger = false
}: {
  icon: string; label: string; sub: string;
  onClick: () => void; accent?: boolean; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all active:scale-[0.98] text-left"
      style={{
        background: danger ? 'rgba(239,68,68,0.06)' : accent ? 'rgba(255,77,109,0.06)' : 'rgba(255,255,255,0.04)',
        border: danger ? '1px solid rgba(239,68,68,0.2)' : accent ? '1px solid rgba(255,77,109,0.2)' : '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <span className="text-lg shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold truncate"
          style={{
            color: danger ? '#f87171' : '#fff',
            fontFamily: 'Sora,sans-serif',
          }}
        >
          {label}
        </p>
        <p className="text-gray-500 text-[10px] mt-0.5">{sub}</p>
      </div>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </button>
  );
}        