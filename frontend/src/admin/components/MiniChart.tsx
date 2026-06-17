 
import { MOCK_SALES_DATA } from '../data/mockData';
 
export default function MiniChart({ data }: { data?: { day: string; revenue: number }[] }) {
  const H = 80;
  const W = 100;
const D =
  data && data.length > 1 && data.some((d) => d.revenue > 0)
    ? data
    : MOCK_SALES_DATA;
<<<<<<< HEAD

const max = Math.max(...D.map(d => d.revenue));
const min = Math.min(...D.map(d => d.revenue));

const range = max - min;
const isFlat = range === 0;

=======
 
const max = Math.max(...D.map(d => d.revenue));
const min = Math.min(...D.map(d => d.revenue));
 
const range = max - min;
const isFlat = range === 0;
 
>>>>>>> 31a2dbd3e0a6c7e40477f3b407361ac4a72ab154
const pts = D.map((d, i) => {
  const x = (i / Math.max(D.length - 1, 1)) * W;
  const y = isFlat
    ? H / 2
    : H - ((d.revenue - min) / range) * H;
<<<<<<< HEAD

  return `${x},${y}`;
}).join(" ");

=======
 
  return `${x},${y}`;
}).join(" ");
 
>>>>>>> 31a2dbd3e0a6c7e40477f3b407361ac4a72ab154
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
        {D.map((d, i) => {
          const x = (i / (D.length - 1 || 1)) * W;
          const y = H - ((d.revenue - min) / range) * H;
          return <circle key={i} cx={x} cy={y} r="1.5" fill="#FF4D8D" />;
        })}
      </svg>
      <div className="flex justify-between mt-1">
        {D.map(d => (
          <span key={d.day} className="text-[10px] text-[#94A3B8]">{d.day}</span>
        ))}
      </div>
    </div>
  );
}
 
 
 
