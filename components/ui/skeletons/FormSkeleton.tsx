// components/ui/skeletons/FormSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"

export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="rounded-xl border p-6 space-y-5">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-32" />
    </div>
  )
}