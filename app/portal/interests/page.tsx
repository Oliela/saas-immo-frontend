"use client"

import ListingPortalInterestsPage from "@/components/portal/interests/page"
import { useAuth } from "@/hooks/useAuth"
import { useGetInterets } from "@/hooks/clients/useGetInterets"

const DEFAULT_STATS = { total: 0, confirmed: 0, pending: 0, rejected: 0 }

export default function PortalInterestsPage() {
  const { user, loading: authLoading } = useAuth()
  console.log("user", user)  // ← voir la structure exacte

  const { interets, stats, loading, refetch } = useGetInterets({
    clientId: user?.profile?.id,
  })
  console.log("clientId", user?.client?.id, "interets", interets, "loading", loading)

  return (
    <ListingPortalInterestsPage
      interets={interets ?? []}
      stats={stats ?? DEFAULT_STATS}
      loading={loading}
      refetch={refetch}
    />
  )
}