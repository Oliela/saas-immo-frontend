// hooks/clients/useGetContracts.ts

import { useState, useEffect } from "react"
import axiosInstance from "@/lib/axios"
import type { Contract, ContractsStats } from "@/types/contracts"

interface UseGetContractsOptions {
  client_id?: number
}

const DEFAULT_STATS: ContractsStats = {
  total: 0,
  signed: 0,
  pending: 0,
  revision: 0,
  value: "0.00",
}

export function useGetContracts(options?: UseGetContractsOptions) {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [stats, setStats] = useState<ContractsStats>(DEFAULT_STATS)
  const [loading, setLoading] = useState(false)

  const fetchContracts = async () => {
    if (!options?.client_id) return
    setLoading(true)
    try {
      const res = await axiosInstance.get(`/api/contracts/client/${options.client_id}`)
      // Réponse : { success, message, data: { contracts, stats } }
      const payload = res.data?.data
      // console.log("Hook payload:", payload)
      setContracts(payload?.contracts ?? [])
      setStats(payload?.stats ?? DEFAULT_STATS)
    } catch (error) {
      console.error("Erreur lors de la récupération des contrats :", error)
      setContracts([])
      setStats(DEFAULT_STATS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContracts()
  }, [options?.client_id])

  return { contracts, stats, loading, refetch: fetchContracts }
}