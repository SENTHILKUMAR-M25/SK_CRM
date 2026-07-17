export default function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="card">
            <div className="space-y-3">
              <div className="skeleton h-3 w-20" />
              <div className="skeleton h-8 w-16" />
              <div className="skeleton h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card"><div className="skeleton h-64 w-full" /></div>
        <div className="card"><div className="skeleton h-64 w-full" /></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card"><div className="skeleton h-64 w-full" /></div>
        <div className="card"><div className="skeleton h-64 w-full" /></div>
      </div>
    </div>
  );
}
