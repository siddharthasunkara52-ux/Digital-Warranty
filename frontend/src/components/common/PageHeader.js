
import React from 'react';
import Button from '../ui/Button';

function PageHeader({ title, subtitle, actionLabel, onAction, icon: Icon }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {actionLabel && onAction && (
        <Button type="button" onClick={onAction} variant="primary" size="md">
          {Icon ? <Icon className="h-4 w-4" /> : null}
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default PageHeader;
