import React from 'react';

function StatTile({ label, value, icon: Icon, tone = 'neutral', helper }) {
  const tones = {
    neutral: { chip: 'bg-gray-50 text-gray-700 ring-gray-200/50', icon: 'text-gray-600' },
    good: { chip: 'bg-green-50 text-green-700 ring-green-200/50', icon: 'text-green-600' },
    warn: { chip: 'bg-amber-50 text-amber-700 ring-amber-200/50', icon: 'text-amber-600' },
    bad: { chip: 'bg-red-50 text-red-700 ring-red-200/50', icon: 'text-red-600' },
    brand: { chip: 'bg-indigo-50 text-indigo-700 ring-indigo-200/50', icon: 'text-indigo-600' },
  };
  const t = tones[tone] || tones.neutral;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-gray-300/60">
      <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10 bg-gradient-to-br ${t.chip.split(' ')[0].replace('bg-', 'from-').replace('-50', '-100')} to-transparent pointer-events-none`} />
      
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2.5 text-3xl font-bold tracking-tight text-gray-900">{value ?? 0}</p>
          {helper ? <p className="mt-2 text-xs font-medium text-gray-500">{helper}</p> : null}
        </div>
        {Icon ? (
          <div className={`inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ring-1 shadow-sm transition-transform duration-300 group-hover:scale-110 ${t.chip}`}>
            <Icon className={`h-6 w-6 ${t.icon}`} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default StatTile;
