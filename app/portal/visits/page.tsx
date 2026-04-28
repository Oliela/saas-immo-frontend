"use client"

import ListingVisitsPage from "@/components/portal/visits/page"
import { useClient } from "@/hooks/clients/useClient"
import { useGetVisits } from "@/hooks/clients/useGetVisit"
import { useAuth } from "@/hooks/useAuth"

export default function VisitsPage() {
  const { user, loading } = useAuth()
  const { client, loading: clientLoading } = useClient()
  const { visits, loading: visitsLoading } = useGetVisits({ clientId: client?.profile?.id })

  const isLoading = loading || clientLoading || visitsLoading

  return (
    <ListingVisitsPage visits={visits ?? []} loading={isLoading} />
  )
}