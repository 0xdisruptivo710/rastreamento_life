'use client'

export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="skeleton h-8 w-64 mb-2" />
            <div className="skeleton h-4 w-48" />
          </div>
          <div className="skeleton h-10 w-32 rounded-lg" />
        </div>

        {/* KPI cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-xl" />
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="skeleton h-[420px] rounded-xl" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="skeleton h-[480px] rounded-xl" />
          <div className="skeleton h-[480px] rounded-xl" />
        </div>
      </div>
    </div>
  )
}
