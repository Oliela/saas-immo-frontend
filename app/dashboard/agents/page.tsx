"use client"

import ListingAgentsPage from "@/components/dashboard/agents/page"
import { useAuthAgent } from "@/hooks/agence/useAuthAgent"
import { useGetAgent } from "@/hooks/agence/useGetAgent"

export default function AgentsPage() {
  const { user, loading } = useAuthAgent()
  const { agent, stat, loading: agentLoading } = useGetAgent({ agencyId: user?.agency.id })

  return (
    <ListingAgentsPage agents={agent} stats={stat} loading={agentLoading} />
  )
}