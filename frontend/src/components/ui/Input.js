import React from 'react';

function Input({
  label,
  hint,
  error,
  leftIcon: LeftIcon,
  className = '',
  inputClassName = '',
  ...props
}) {
  return (
    <label className={`block ${className}`}>
      {label ? <span className="block text-sm font-medium text-gray-700 mb-1.5">{label}</span> : null}
      <div className="relative group">
        {LeftIcon ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
            <LeftIcon className="h-5 w-5" />
          </div>
        ) : null}
        <input
          className={`w-full rounded-xl border bg-gray-50/50 hover:bg-white focus:bg-white py-2.5 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:ring-4 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
              : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/10'
          } ${LeftIcon ? 'pl-11 pr-4' : 'px-4'} ${inputClassName}`}
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
      ) : null}
    </label>
  );
}

export default Input;
