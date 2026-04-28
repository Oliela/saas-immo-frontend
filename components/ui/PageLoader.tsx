// components/ui/PageLoader.tsx
import { ReactNode } from "react"

interface PageLoaderProps {
  loading: boolean
  error?: string | null
  skeleton: ReactNode
  children: ReactNode
}

export function PageLoader({ loading, error, skeleton, children }: PageLoaderProps) {
  if (loading) return <>{skeleton}</>
  if (error) return (
    <div className="flex items-center justify-center p-12 text-destructive">
      <p>{error}</p>
    </div>
  )
  return <>{children}</>
}