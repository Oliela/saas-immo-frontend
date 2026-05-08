import { useState, useEffect } from "react"
import axiosInstance from "@/lib/axios"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AgentProfile {
  id: number
  user_id: number
  first_name: string
  last_name: string
  address: string | null
  phone: string
  commission_rate: number | null
  bio: string | null
  specialization: string | null
  license_number: string
  created_at: string
  updated_at: string
}

export interface AgentRole {
  id: number
  name: string
  guard_name: string
  created_at: string
  updated_at: string
}

export interface AgentDetails {
  id: number
  nom: string
  prenom: string
  email: string
  phone: string
  is_active: number
  profile: AgentProfile
  roles: AgentRole[]
}

export interface AgentStats {
  totalVisites: number
  visitesEffectuees: number
  interetsConfirmes: number
}

export interface VisiteClient {
  nom: string
  status: string
  done: number
  feedback: string | null
}

export interface VisiteRecente {
  id: number
  bien: string
  type_bien: string
  listing_type: string
  prix: string
  date: string
  start_time: string
  end_time: string
  status: string
  clients: VisiteClient[]
}

export interface Avis {
  client: string
  feedback: string
  notes: string | null
  date: string
}

export interface AgentDetailsData {
  agent: AgentDetails | null
  stats: AgentStats
  visitesRecentes: VisiteRecente[]
  avis: Avis[]
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGetAgentDetails(agentId: string | number | null) {
  const [data, setData] = useState<AgentDetailsData>({
    agent: null,
    stats: { totalVisites: 0, visitesEffectuees: 0, interetsConfirmes: 0 },
    visitesRecentes: [],
    avis: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAgentDetails = async () => {
    if (!agentId) return
    setLoading(true)
    setError(null)
    try {
      const res = await axiosInstance.get(`/api/agent/${agentId}/details`)
      setData({
        agent: res.data.agent ?? null,
        stats: res.data.stats ?? { totalVisites: 0, visitesEffectuees: 0, interetsConfirmes: 0 },
        visitesRecentes: res.data.visitesRecentes ?? [],
        avis: res.data.avis ?? [],
      })
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Erreur lors du chargement de l'agent.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgentDetails()
  }, [agentId])

  return { data, loading, error, refetch: fetchAgentDetails }
}