// components/ui/skeletons/ListSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border divide-y">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <Skeleton className="h-10 w-10 rounded-md shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  )
}