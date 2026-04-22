"use client"

import PortalContractsTable from "@/components/portal/contracts/page"
import { useGetContracts } from "@/hooks/clients/useGetContracts"
import { useAuth } from "@/hooks/useAuth"

export default function PortalContractsPage() {
  const { user, loading: authLoading } = useAuth()

  // Accès sécurisé — undefined si user est null/undefined
  const clientId = user?.profile?.id

  const { contracts, stats, loading: contractsLoading } = useGetContracts({
    client_id: clientId,
  })

  // console.log("authLoading:", authLoading)
  // console.log("user:", user)
  // console.log("clientId:", clientId)
  // console.log("contracts:", contracts)
  // console.log("stats:", stats)

  if (authLoading) return <div>Chargement de l'authentification...</div>

  if (!clientId) return <div>Utilisateur non trouvé.</div>

  return (
    <PortalContractsTable
      contracts={contracts}
      stats={stats}
      loading={contractsLoading}
    />
  )
}