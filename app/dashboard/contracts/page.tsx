"use client"

// app/dashboard/contracts/page.tsx  (ou pages/dashboard/contracts/index.tsx)

import ListingContractsPage from "@/components/dashboard/contracts/page"
import { useAuthAgent } from "@/hooks/agence/useAuthAgent"
import { useGetContracts } from "@/hooks/agence/useGetContracts"

export default function ContractsPage() {
  const { user, loading: authLoading } = useAuthAgent()

  const { contracts, stats, loading: contractsLoading } = useGetContracts({
    agency_id: user?.agency?.id,
  })

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }
  console.log("ContractsPage - contracts:", contracts)

  return (
    <ListingContractsPage
      contracts={contracts}
      stats={stats}
      loading={contractsLoading}
    />
  )
}