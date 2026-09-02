"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export default function ProtectedRoute({
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

    if (user.account_type !== "client") {
      router.replace(redirectPath ?? "/")
    }
  }, [user, redirectPath, loading, router])

  if (loading) {
    return null
  }

  if (!user || user.account_type !== "client") {
    return null
  }

  return <>{children}</>
}