"use client"

import {
  useCallback,
  useEffect,
  useState,
} from "react"

import {
  getUpgradeRequests,
} from "@/services/adminSubscriptionService"

import type {
  AdminUpgradeRequest,
  UpgradeRequestStatus,
} from "@/types/subscription"

export function useAdminUpgradeRequests(
  status?: UpgradeRequestStatus
) {
  const [requests, setRequests] =
    useState<AdminUpgradeRequest[]>([])

  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] =
    useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response =
        await getUpgradeRequests(status)

      setRequests(response.requests)
      setStats(response.stats)
    } catch {
      setError(
        "Impossible de charger les demandes de mise à niveau."
      )
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh()
  }, [refresh])

  return {
    requests,
    stats,
    loading,
    error,
    refresh,
  }
}