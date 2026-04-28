// components/ui/skeletons/ProfileSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton" // ← ton fichier existant

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-6 rounded-xl border">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
      <div className="p-6 rounded-xl border space-y-3">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-3 w-full" />
      </div>
      <div className="rounded-xl border p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}