"use client"

import NewVisitForm from "@/components/dashboard/visits/new/page"
import { useAuthAgent } from "@/hooks/agence/useAuthAgent"
import { useGetAgent } from "@/hooks/agence/useGetAgent"
import { useGetBiens } from "@/hooks/agence/useGetBiens"
import { useGetClient } from "@/hooks/agence/useGetClient"
import { useGetCreneaux } from "@/hooks/agence/useGetCreneaux"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

function NewVisitSkeleton() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-36 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="space-y-1 hidden sm:block">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-14" />
              </div>
            </div>
            {i < 3 && <Skeleton className="h-px w-8 mx-2" />}
          </div>
        ))}
      </div>

      {/* Card principale */}
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Sélection propriété */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <div className="relative">
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>

          {/* Grille de propriétés */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <Skeleton className="h-16 w-20 rounded-md shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Sélection client */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Grille clients */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            ))}
          </div>

        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-28 rounded-md" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

    </div>
  )
}

export default function NewVisitPage() {
  const { user, loading }                      = useAuthAgent()
  const { agent, loading: loadingAgent }       = useGetAgent({ agencyId: user?.agency?.id })
  const { biens, loading: loadingBiens }       = useGetBiens({ agencyId: user?.agency?.id })
  const { client, loading: loadingClient }     = useGetClient()
  const { creneaux, loading: loadingCreneaux } = useGetCreneaux({ agencyId: user?.agency?.id })

  const isLoading = loading || loadingAgent || loadingBiens || loadingClient || loadingCreneaux

  if (isLoading) return <NewVisitSkeleton />

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
    id:    String(c?.client.id),
    name:  `${c?.client.prenom} ${c?.client.nom}`,
    email: c?.user?.email ?? "",
    phone: c?.phone ?? "",
    avatar: "/images/property-1.jpg",
  }))

  const timeSlots = [
    "09:00","09:30","10:00","10:30","11:00","11:30",
    "13:00","13:30","14:00","14:30","15:00","15:30",
    "16:00","16:30","17:00","17:30",
  ]

  return (
    <NewVisitForm
      agents={mockAgents}
      properties={mockProperties}
      clients={mockClients}
      timeSlots={timeSlots}
      agencyId={user?.agency?.id}
      creneaux={creneaux ?? []}
    />
  )
}