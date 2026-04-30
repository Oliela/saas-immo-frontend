"use client"

import {
  Building2, Home, Landmark, Store, Warehouse,
  Hotel, Building, Tent, Factory, School,
} from "lucide-react"
import PropertiesNew from "@/components/dashboard/properties/new/PropertiesNew"
import { useAuthAgent } from "@/hooks/agence/useAuthAgent"
import { useOwners } from "@/hooks/agence/useOwner"
import { useGetCommodite } from "@/hooks/agence/useGetCommodite"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const propertyTypes = [
  { value: "appartement", label: "Appartement", icon: Building2 },
  { value: "maison", label: "Maison", icon: Home },
  { value: "villa", label: "Villa", icon: Home },
  { value: "studio", label: "Studio", icon: Building },
  { value: "loft", label: "Loft", icon: Building },
  { value: "duplex", label: "Duplex", icon: Building },
  { value: "penthouse", label: "Penthouse", icon: Building },
  { value: "terrain", label: "Terrain", icon: Landmark },
  { value: "terrain_agricole", label: "Terrain agricole", icon: Landmark },
  { value: "local_commercial", label: "Local commercial", icon: Store },
  { value: "boutique", label: "Boutique", icon: Store },
  { value: "bureau", label: "Bureau", icon: Building2 },
  { value: "entrepot", label: "Entrepôt", icon: Warehouse },
  { value: "immeuble", label: "Immeuble", icon: Building },
  { value: "usine", label: "Usine", icon: Factory },
  { value: "hotel", label: "Hôtel", icon: Hotel },
  { value: "maison_hotes", label: "Maison d'hôtes", icon: Hotel },
  { value: "ecole", label: "École", icon: School },
  { value: "campement", label: "Campement", icon: Tent },
]

function NewPropertySkeleton() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-36 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="space-y-1 hidden sm:block">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            {i < 4 && <Skeleton className="h-px w-8 mx-2" />}
          </div>
        ))}
      </div>

      {/* Card formulaire */}
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-36" />
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Champ titre */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-3 w-64" />
          </div>

          {/* Grille types de propriété */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-40" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          </div>

          {/* Type annonce */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <div className="flex gap-3">
              <Skeleton className="h-12 flex-1 rounded-lg" />
              <Skeleton className="h-12 flex-1 rounded-lg" />
            </div>
          </div>

          {/* Prix + statut */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-28 rounded-md" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-44 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>

    </div>
  )
}

export default function NewPropertyPage() {
  const { user, loading } = useAuthAgent()
  const { owners: owner, loading: ownersLoading } = useOwners({
    agencyId: parseInt(user?.agency?.id, 10),
  })
  const { commodite, loading: commoditeLoading } = useGetCommodite()

  const isLoading = loading || ownersLoading || commoditeLoading

  if (isLoading) return <NewPropertySkeleton />

  if (!user) return <div>Vous devez être connecté pour créer une propriété.</div>

  return (
    <PropertiesNew
      propertyTypes={propertyTypes}
      owners={owner}
      agencyId={user?.agency?.id}
      features={commodite}
    />
  )
}