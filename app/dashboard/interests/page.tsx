"use client"

import ListingInterestsPage from "@/components/dashboard/interests/page"
import { useAuthAgent } from "@/hooks/agence/useAuthAgent"
import { useGetInterets } from "@/hooks/agence/useGetInterets"

const DEFAULT_STATS = { total: 0, confirmed: 0, pending: 0, rejected: 0 }

export default function InterestsPage() {
  const { user, loading: authLoading } = useAuthAgent()

  const { interets, stats, loading, refetch } = useGetInterets({
    agencyId: user?.agency?.id,
  })

  return (
    <ListingInterestsPage
      interets={interets ?? []}
      stats={stats ?? DEFAULT_STATS}
      loading={authLoading || loading}
      refetch={refetch}
    />
  )
}