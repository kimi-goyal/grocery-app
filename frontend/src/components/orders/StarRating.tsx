import { useState } from 'react';
 
interface Props {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  onChange?: (v: number) => void;
  showValue?: boolean;
}
 
const SIZES = { sm: 14, md: 20, lg: 28 };
 
export default function StarRating({
  value, max = 5, size = 'md', readonly = false,
  onChange, showValue = false
}: Props) {
  const [hovered, setHovered] = useState(0);
  const px = SIZES[size];
  const display = hovered || value;
 
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const star = i + 1;
        const half = star - 0.5;
        const filled = display >= star;
        const halfFilled = !filled && display >= half;
 
        return (
          <div
            key={i}
            className={`relative ${readonly ? '' : 'cursor-pointer'}`}
            style={{ width: px, height: px }}
            onMouseMove={!readonly ? (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              setHovered(x < rect.width / 2 ? half : star);
            } : undefined}
            onMouseLeave={!readonly ? () => setHovered(0) : undefined}
            onClick={!readonly ? () => onChange?.(hovered || star) : undefined}
          >
            {/* Background star */}
            <svg width={px} height={px} viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="rgba(255,255,255,0.08)"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            </svg>
            {/* Filled star (full or half) */}
            {(filled || halfFilled) && (
              <svg
                width={px}
                height={px}
                viewBox="0 0 24 24"
                fill="none"
                className="absolute inset-0"
                style={halfFilled ? { clipPath: 'inset(0 50% 0 0)' } : undefined}
              >
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill={display >= 4 ? '#22c55e' : display >= 3 ? '#eab308' : '#ff4d6d'}
                  style={{ filter: `drop-shadow(0 0 4px ${display >= 4 ? 'rgba(34,197,94,0.5)' : display >= 3 ? 'rgba(234,179,8,0.5)' : 'rgba(255,77,109,0.5)'})` }}
                />
              </svg>
            )}
          </div>
        );
      })}
      {showValue && value > 0 && (
        <span className="text-white font-bold text-sm ml-1" style={{ fontFamily: 'Sora,sans-serif' }}>
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
 
 