"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthAgent } from "@/hooks/agence/useAuthAgent"

export default function ProtectedDashboard({
  children,
}: {
  children: React.ReactNode
}) {
  const {
    user,
    accountStatus,
    redirectPath,
    loading,
  } = useAuthAgent()

  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace("/login")
      return
    }

    if (user.user.account_type !== "agency_user") {
      router.replace(redirectPath ?? "/")
      return
    }

    if (accountStatus !== "active") {
      router.replace(redirectPath ?? "/account-status")
    }
  }, [
    user,
    accountStatus,
    redirectPath,
    loading,
    router,
  ])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (
    !user ||
    user.user.account_type !== "agency_user" ||
    accountStatus !== "active"
  ) {
    return null
  }

  return <>{children}</>
}