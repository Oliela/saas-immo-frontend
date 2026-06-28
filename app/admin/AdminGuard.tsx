"use client"

import { useAuth } from "@/hooks/useAuth"
import { redirect } from "next/navigation"

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user || user.account_type !== "super_admin") {
    redirect("/login")
  }

  return <>{children}</>
}
