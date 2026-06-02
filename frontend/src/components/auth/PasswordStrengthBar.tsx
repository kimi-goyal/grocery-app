
import { getPasswordStrength } from '../../utils/validators';

export default function PasswordStrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const { score, label, color } = getPasswordStrength(password);
  const pct = (score / 5) * 100;

  return (
    <div className="space-y-1 animate-fadeIn">
      <div className="h-1 bg-white/8 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-gray-600">Password strength</p>
        <p className="text-[10px] font-semibold" style={{ color }}>{label}</p>
      </div>
    </div>
  );
}

