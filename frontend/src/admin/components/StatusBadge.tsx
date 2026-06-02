
const CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  'Pending': { bg: 'bg-yellow-500/15', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  'Packed': { bg: 'bg-blue-500/15', text: 'text-blue-400', dot: 'bg-blue-400' },
  'On the Way': { bg: 'bg-[#FF4D8D]/15', text: 'text-[#FF4D8D]', dot: 'bg-[#FF4D8D]' },
  'Delivered': { bg: 'bg-green-500/15', text: 'text-green-400', dot: 'bg-green-400' },
  'Cancelled': { bg: 'bg-red-500/15', text: 'text-red-400', dot: 'bg-red-400' },
  'Active': { bg: 'bg-green-500/15', text: 'text-green-400', dot: 'bg-green-400' },
  'Inactive': { bg: 'bg-gray-500/15', text: 'text-gray-400', dot: 'bg-gray-400' },
};

export default function StatusBadge({ status }: { status: string }) {
  const c = CONFIG[status] || { bg: 'bg-white/10', text: 'text-white', dot: 'bg-white' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}

