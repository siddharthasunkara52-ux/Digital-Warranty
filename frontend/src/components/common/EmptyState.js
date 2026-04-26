import { PackageOpen } from 'lucide-react';
import Button from '../ui/Button';


function EmptyState({ icon: Icon = PackageOpen, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-white p-8 text-center">
      <div className="rounded-lg bg-gray-100 p-3 text-gray-400">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-gray-800">{title || 'Nothing here yet'}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>}
      {actionLabel && onAction && (
        <Button
          type="button"
          onClick={onAction}
          className="mt-4"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
