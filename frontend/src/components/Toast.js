import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const STYLES = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-gray-700',
};

function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [message]);

  if (!message) return null;

  const Icon = ICONS[type] || ICONS.info;
  const bgColor = STYLES[type] || STYLES.info;

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex max-w-xs items-center gap-2.5 rounded-lg px-4 py-3 text-white shadow-lg ${bgColor} ${
        visible ? 'animate-toast-in' : ''
      }`}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <p className="flex-1 text-sm">{message}</p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="rounded p-0.5 transition hover:bg-white/20"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export default Toast;
