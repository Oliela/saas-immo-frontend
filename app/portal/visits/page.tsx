"use client"

import ListingVisitsPage from "@/components/portal/visits/page"
import { useClient } from "@/hooks/clients/useClient"
import { useGetVisits } from "@/hooks/clients/useGetVisit"
import { useAuth } from "@/hooks/useAuth"

export default function VisitsPage() {
  const {user, loading} = useAuth()
  // console.log("user", user, loading)
  const {client, loading: clientLoading} = useClient()
  // console.log("client", client, clientLoading)
  const { visits, loading: visitsLoading } = useGetVisits({ clientId: client?.profile?.id })
  console.log("visits", visits, visitsLoading)

  if (loading || clientLoading || visitsLoading) {
    return <div>Loading...</div>
  }

  


  return (
    <ListingVisitsPage visits={visits} />
  )
}
