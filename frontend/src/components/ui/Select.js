import React from 'react';

function Select({ label, hint, error, className = '', options = [], ...props }) {
  return (
    <label className={`block ${className}`}>
      {label ? <span className="block text-sm font-medium text-slate-700 mb-1">{label}</span> : null}
      <select
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 ${
          error
            ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
            : 'border-slate-300 focus:border-indigo-400 focus:ring-indigo-100'
        }`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      {error ? (
        <p className="mt-1 text-xs text-rose-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
      ) : null}
    </label>
  );
}

export default Select;

