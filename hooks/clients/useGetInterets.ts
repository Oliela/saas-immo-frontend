import { useState, useEffect } from "react"
import axiosInstance from "@/lib/axios"
import type { Interet, InteretsStats } from "@/types/interetsClient"

interface UseGetInteretOptions {
  clientId?: number
}

const DEFAULT_STATS: InteretsStats = {
  total: 0,
  confirmed: 0,
  pending: 0,
  rejected: 0,
}

export function useGetInterets(options?: UseGetInteretOptions) {
  const [interets, setInterets] = useState<Interet[]>([])
  const [stats, setStats] = useState<InteretsStats>(DEFAULT_STATS)
  const [loading, setLoading] = useState(false)

  const fetchInterets = async () => {
    if (!options?.clientId) return
    setLoading(true)
    try {
      const res = await axiosInstance.get(`/api/interets/client/${options.clientId}`)
      setInterets(res.data?.interets ?? [])
      setStats(res.data?.stats ?? DEFAULT_STATS)
    } catch (error) {
      setInterets([])
      setStats(DEFAULT_STATS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInterets()
  }, [options?.clientId])

  return { interets, stats, loading, refetch: fetchInterets }
}