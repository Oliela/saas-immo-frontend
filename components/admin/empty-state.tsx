import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon?: LucideIcon
  title?: string
  message: string
  className?: string
}

export function EmptyState({ icon: Icon, title, message, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
      {title && (
        <p className="text-sm font-medium text-foreground mb-1">{title}</p>
      )}
      <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
    </div>
  )
}
