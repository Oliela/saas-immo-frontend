"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const {
    user,
    redirectPath,
    loading,
  } = useAuth()

  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace("/login")
      return
    }

    if (user.account_type !== "super_admin") {
      router.replace(redirectPath ?? "/")
    }
  }, [user, redirectPath, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user || user.account_type !== "super_admin") {
    return null
  }

  return <>{children}</>
}