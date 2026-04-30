"use client"

import ListingContractsPage from "@/components/dashboard/contracts/page"
import { useAuthAgent } from "@/hooks/agence/useAuthAgent"
import { useGetContracts } from "@/hooks/agence/useGetContracts"

export default function ContractsPage() {
  const { user, loading: authLoading } = useAuthAgent()

  const { contracts, stats, loading: contractsLoading } = useGetContracts({
    agency_id: user?.agency?.id,
  })

  return (
    <ListingContractsPage
      contracts={contracts}
      stats={stats}
      loading={authLoading || contractsLoading}
    />
  )
}