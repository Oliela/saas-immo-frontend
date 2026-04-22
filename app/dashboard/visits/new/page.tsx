"use client"
import NewVisitForm from "@/components/dashboard/visits/new/page"
import { useAuthAgent } from "@/hooks/agence/useAuthAgent"
import { useGetAgent } from "@/hooks/agence/useGetAgent"
import { useGetBiens } from "@/hooks/agence/useGetBiens"
import { useGetClient } from "@/hooks/agence/useGetClient"
import { useGetCreneaux } from "@/hooks/agence/useGetCreneaux"

export default function NewVisitPage() {
  const { user, loading }                      = useAuthAgent()
  const { agent, loading: loadingAgent }       = useGetAgent({ agencyId: user?.agency?.id })
  const { biens, loading: loadingBiens }       = useGetBiens({ agencyId: user?.agency?.id })
  const { client, loading: loadingClient }     = useGetClient()
  const { creneaux, loading: loadingCreneaux } = useGetCreneaux({ agencyId: user?.agency?.id })

  if (loading || loadingAgent || loadingBiens || loadingClient || loadingCreneaux) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-muted-foreground">Chargement...</p>
    </div>
  )

  const mockAgents = agent.map((a: any) => ({
    id:     String(a.id),
    name:   `${a.prenom} ${a.nom}`,
    role:   "Agent",
    avatar: "/images/agency-1.jpg",
  }))

  const mockProperties = biens.map((b: any) => ({
    id:      String(b.id),
    title:   b.title,
    address: `${b.address}, ${b.neighborhood}, ${b.city}`,
    image:   b.images?.[0]?.url ?? "",
  }))

  const mockClients = (Array.isArray(client) ? client : []).map((c: any) => ({
    id:     String(c?.client.id),
    name:   `${c?.client.prenom} ${c?.client.nom}`,
    email:  c?.user?.email ?? "",
    phone:  c?.phone ?? "",
    avatar: "/images/property-1.jpg",
  }))

  const timeSlots = [
    "09:00","09:30","10:00","10:30","11:00","11:30",
    "13:00","13:30","14:00","14:30","15:00","15:30",
    "16:00","16:30","17:00","17:30",
  ]
  console.log("Clients:", mockClients) // Debug : vérifier les créneaux récupérés

  return (
    <NewVisitForm
      agents={mockAgents}
      properties={mockProperties}
      clients={mockClients}
      timeSlots={timeSlots}
      agencyId={user?.agency?.id}
      creneaux={creneaux ?? []}   // ← nouveau
    />
  )
}