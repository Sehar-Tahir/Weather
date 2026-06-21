// ============================================================
// WEATHERVERSE — Loading Skeleton Components
// ============================================================

export function WeatherCardSkeleton() {
  return (
    <div className="weather-hero-card p-6 sm:p-8 animate-fade-in">
      {/* Top row */}
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-2">
          <div className="skeleton h-5 w-24 rounded-full" />
          <div className="skeleton h-7 w-48 rounded-lg" />
          <div className="skeleton h-4 w-32 rounded-lg" />
        </div>
        <div className="skeleton h-8 w-20 rounded-full" />
      </div>

      {/* Temp + Icon */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-3">
          <div className="skeleton h-20 w-44 rounded-xl" />
          <div className="skeleton h-4 w-36 rounded-lg" />
        </div>
        <div className="skeleton h-24 w-24 rounded-2xl" />
      </div>

      {/* Stat pills */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-20 rounded-2xl" />
        ))}
      </div>

      {/* Bottom row */}
      <div className="flex gap-4">
        <div className="skeleton h-20 flex-1 rounded-2xl" />
        <div className="skeleton h-20 flex-1 rounded-2xl" />
      </div>
    </div>
  );
}

export function ForecastSkeleton() {
  return (
    <div className="glass-card p-5">
      <div className="skeleton h-6 w-40 rounded-lg mb-4" />
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="skeleton h-36 w-24 shrink-0 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function GraphSkeleton() {
  return (
    <div className="graph-container">
      <div className="flex items-center justify-between mb-6">
        <div className="skeleton h-7 w-40 rounded-lg" />
        <div className="flex gap-2">
          {[1,2,3].map(i => (
            <div key={i} className="skeleton h-8 w-20 rounded-full" />
          ))}
        </div>
      </div>
      <div className="skeleton h-64 rounded-xl" />
    </div>
  );
}
