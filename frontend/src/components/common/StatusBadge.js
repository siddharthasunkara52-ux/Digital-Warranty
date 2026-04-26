import { STATUS_COLORS } from '../../utils/constants';

function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-200/60',
    dot: 'bg-gray-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide shadow-sm backdrop-blur-sm ${colors.bg} ${colors.text} ${colors.border} transition-all hover:opacity-90`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${colors.dot} animate-pulse`} />
      {status}
    </span>
  );
}

export default StatusBadge;
