import { useState } from "react"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"

interface UpdateAgentPayload {
  nom?: string
  prenom?: string
  email?: string
  phone?: string
  is_active?: number
  role?: string
  first_name?: string
  last_name?: string
  bio?: string
  specialization?: string
  license_number?: string
  commission_rate?: number | string
  address?: string
}

export function useUpdateAgent() {
  const [loading, setLoading] = useState(false)

  const updateAgent = async (
    agentId: string | number,
    payload: UpdateAgentPayload,
    onSuccess?: () => void
  ) => {
    setLoading(true)
    try {
      const res = await axiosInstance.put(`/api/agent/${agentId}/update`, payload)
      toast.success("Agent mis à jour avec succès.")
      onSuccess?.()
      return res.data
    } catch (error: any) {
      const message =
        error.response?.data?.error ??
        error.response?.data?.message ??
        "Erreur lors de la mise à jour."
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { updateAgent, loading }
}
