"use client"

import { useCallback, useEffect, useState } from "react"
import { getSubscriptions } from "@/services/adminSubscriptionService"
import type { AdminSubscription } from "@/types/subscription"

export function useAdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([])
  const [stats, setStats] = useState({ active: 0, expired: 0, revenue: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getSubscriptions()
      setSubscriptions(data.subscriptions)
      setStats(data.stats)
    } catch {
      setError("Impossible de charger les abonnements.")
    } finally {
      setLoading(false)
    }
  }, [])

  // The initial API synchronization intentionally starts when the hook mounts.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void refresh() }, [refresh])
  return { subscriptions, stats, loading, error, refresh }
}
