// hooks/contracts/useGetContracts.ts

import { useState, useEffect } from "react"
import axiosInstance from "@/lib/axios"
import type { Contract, ContractsStats } from "@/types/contracts"

interface UseGetContractsOptions {
  agency_id?: number
}

const DEFAULT_STATS: ContractsStats = {
  total: 0,
  signed: 0,
  pending: 0,
  value: "0.00",
  revision: 0,
}

export function useGetContracts(options?: UseGetContractsOptions) {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [stats, setStats] = useState<ContractsStats>(DEFAULT_STATS)
  const [loading, setLoading] = useState(false)

  const fetchContracts = async () => {
    if (!options?.agency_id) return
    setLoading(true)
    try {
      const res = await axiosInstance.get(`/api/contracts/`,{
        params: {
          agency_id: options.agency_id
        }
      })
      setContracts(res.data?.contracts ?? [])
      setStats(res.data?.stats ?? DEFAULT_STATS)
    } catch (error) {
      setContracts([])
      setStats(DEFAULT_STATS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContracts()
  }, [options?.agency_id])

  return { contracts, stats, loading, refetch: fetchContracts }
}