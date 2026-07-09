import { Card } from "@/components/ui/card";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-6">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-800/60 rounded"></div>
          <div className="h-4 w-64 bg-slate-800/40 rounded"></div>
        </div>
        <div className="h-10 w-28 bg-slate-800/60 rounded-md"></div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-slate-800 bg-slate-900/20 p-6 space-y-3">
            <div className="h-3 w-20 bg-slate-800/60 rounded"></div>
            <div className="h-8 w-14 bg-slate-800/80 rounded"></div>
            <div className="h-3 w-32 bg-slate-800/40 rounded"></div>
          </Card>
        ))}
      </div>

      {/* Analytics & Lists Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-slate-800 bg-slate-900/20 p-6 space-y-4">
          <div className="h-5 w-32 bg-slate-800/60 rounded"></div>
          <div className="h-44 bg-slate-800/40 rounded-md"></div>
        </Card>
        <Card className="lg:col-span-2 border-slate-800 bg-slate-900/20 p-6 space-y-4">
          <div className="h-5 w-40 bg-slate-800/60 rounded"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-800/40 rounded-md"></div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
