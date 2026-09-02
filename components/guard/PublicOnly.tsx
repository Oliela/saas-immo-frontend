"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export default function PublicOnly({
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
    if (!loading && user) {
      router.replace(redirectPath ?? "/")
    }
  }, [user, redirectPath, loading, router])

  if (loading) {
    return <>{children}</>
  }

  if (user) {
    return null
  }

  return <>{children}</>
}