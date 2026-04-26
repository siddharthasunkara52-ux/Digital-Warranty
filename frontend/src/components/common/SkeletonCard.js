
function SkeletonCard() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2.5">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-5 w-44 rounded" />
          <div className="skeleton h-3 w-32 rounded" />
        </div>
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
      <div className="mt-4 skeleton h-1.5 w-full rounded" />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="skeleton h-12 rounded" />
        <div className="skeleton h-12 rounded" />
      </div>
    </div>
  );
}

export default SkeletonCard;
