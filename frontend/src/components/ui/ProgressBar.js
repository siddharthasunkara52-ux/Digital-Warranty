import React from 'react';

function ProgressBar({ value = 0, tone = 'good' }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  const toneClass =
    tone === 'bad'
      ? 'bg-red-500 shadow-red-500/40'
      : tone === 'warn'
      ? 'bg-amber-500 shadow-amber-500/40'
      : 'bg-green-500 shadow-green-500/40';

  return (
    <div className="w-full">
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 shadow-inner">
        <div 
          className={`h-full rounded-full shadow-sm transition-all duration-700 ease-out ${toneClass}`} 
          style={{ width: `${v}%` }} 
        />
      </div>
    </div>
  );
}

export default ProgressBar;
