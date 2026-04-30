"use client"

import ListingDashboardPage from "@/components/dashboard/apercu/page"
import { useAuthAgent } from "@/hooks/agence/useAuthAgent"
import { useGetApercu } from "@/hooks/agence/useGetApercu"

export default function DashboardPage() {
  const { data, loading, error } = useGetApercu()
  const { user, loading: userLoading } = useAuthAgent()

  return (
    <ListingDashboardPage data={data} user={user} loading={loading || userLoading} />
  )
}