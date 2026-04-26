import React from 'react';

function Card({ className = '', children, hover = false }) {
  return (
    <div className={`rounded-2xl border border-gray-200/60 bg-white shadow-sm transition-all duration-300 ${hover ? 'hover:shadow-lg hover:border-gray-300/60' : ''} ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ className = '', title, subtitle, action }) {
  return (
    <div className={`flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5 ${className}`}>
      <div className="min-w-0">
        {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {action ? <div className="flex-shrink-0">{action}</div> : null}
    </div>
  );
}

function CardBody({ className = '', children }) {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
}

export { Card, CardHeader, CardBody };
