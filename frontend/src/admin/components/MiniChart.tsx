
import { MOCK_SALES_DATA } from '../data/mockData';

export default function MiniChart() {
  const max = Math.max(...MOCK_SALES_DATA.map(d => d.revenue));
  const min = Math.min(...MOCK_SALES_DATA.map(d => d.revenue));
  const range = max - min;
  const H = 80;
  const W = 100;
  const pts = MOCK_SALES_DATA.map((d, i) => {
    const x = (i / (MOCK_SALES_DATA.length - 1)) * W;
    const y = H - ((d.revenue - min) / range) * H;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H + 4}`} preserveAspectRatio="none" className="w-full h-20">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF4D8D" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FF4D8D" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,${H} ${pts} ${W},${H}`}
          fill="url(#chartGrad)"
        />
        <polyline
          points={pts}
          fill="none"
          stroke="#FF4D8D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {MOCK_SALES_DATA.map((d, i) => {
          const x = (i / (MOCK_SALES_DATA.length - 1)) * W;
          const y = H - ((d.revenue - min) / range) * H;
          return <circle key={i} cx={x} cy={y} r="1.5" fill="#FF4D8D" />;
        })}
      </svg>
      <div className="flex justify-between mt-1">
        {MOCK_SALES_DATA.map(d => (
          <span key={d.day} className="text-[10px] text-[#94A3B8]">{d.day}</span>
        ))}
      </div>
    </div>
  );
}

