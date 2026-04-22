"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export default function PublicOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      const redirectMap: Record<string, string> = {
        client:      "/portal",
        agency_user: "/dashboard",
        agent:       "/dashboard",
        super_admin: "/super-admin",
      }
      router.replace(redirectMap[user.account_type] ?? "/")
    }
  }, [user, loading, router])

  if (loading) return <>{children}</>
  if (user) return null

  return <>{children}</>
}