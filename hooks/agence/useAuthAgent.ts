"use client"

import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axios"
import type { AuthAgentData } from "@/types/auth"

export function useAuthAgent() {
  const [user, setUser] = useState<AuthAgentData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get<AuthAgentData>(
          "/api/agent/user"
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

  return {
    user,
    agency: user?.agency ?? null,
    accountStatus: user?.account_status ?? null,
    redirectPath: user?.redirect ?? null,
    loading,
  }
}