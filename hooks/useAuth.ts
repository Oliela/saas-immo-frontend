"use client"

import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axios"
import type {
  AccountStatus,
  AgencyAccountSummary,
  CurrentUserResponse,
} from "@/types/auth"

export function useAuth() {
  const [user, setUser] = useState<CurrentUserResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get<CurrentUserResponse>(
          "/api/user"
        )

        if (active) {
          setUser(response.data)
        }
      } catch {
        if (active) {
          setUser(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchUser()

    return () => {
      active = false
    }
  }, [])

  const loginCount = user?.login_count ?? 0
  const agency: AgencyAccountSummary | null = user?.agency ?? null
  const accountStatus: AccountStatus | null =
    user?.account_status ?? null
  const redirectPath = user?.redirect ?? null

  return {
    user,
    agency,
    accountStatus,
    redirectPath,
    loading,
    loginCount,
  }
}