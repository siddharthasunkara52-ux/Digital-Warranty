import React from 'react';

const VARIANTS = {
  primary:
    'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 focus-visible:ring-indigo-500',
  secondary:
    'bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-gray-500',
  outline:
    'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 shadow-sm focus-visible:ring-gray-400',
  ghost: 
    'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-400',
  danger:
    'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 focus-visible:ring-red-400 shadow-sm',
};

const SIZES = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-6 text-base',
};

function Button({
  as: Comp = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  children,
  ...props
}) {
  return (
    <Comp
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 disabled:hover:translate-y-0 disabled:hover:shadow-none ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </Comp>
  );
}

export default Button;
