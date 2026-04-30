"use client"

import Link from "next/link"
import { useState } from "react"
import { UserX } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import OwnersHeader from "@/components/owners/OwnersHeader"
import OwnersStats from "@/components/owners/OwnersStats"
import OwnersFilters from "@/components/owners/OwnersFilters"
import OwnersGrid from "@/components/owners/OwnersGrid"

interface OwnersListingProps {
  data: {
    owners: any[]
    statistics: {
      count: number
      countBiens: number
      totalValue: number
      countOwnersThisMonth: number
      countBiensThisMonth: number
    }
  } | null | undefined
  loading?: boolean
  error?: string | null
}

export default function OwnersListing({ data, loading, error }: OwnersListingProps) {
  const [statusFilter, setStatusFilter] = useState("all")
  const [search, setSearch] = useState("")

  const owners     = data?.owners ?? []
  const statistics = data?.statistics

  const stat = [
    { label: "Total de propriétaires",  value: String(statistics?.count ?? 0) },
    { label: "Total de propriétés",     value: String(statistics?.countBiens ?? 0) },
    { label: "Valeur du portefeuille",  value: `${Number(statistics?.totalValue ?? 0).toLocaleString()} CFA` },
    { label: "Nouveaux ce mois-ci",     value: String(statistics?.countOwnersThisMonth ?? 0) },
  ]

  const filteredOwners = owners.filter((owner: any) => {
    const matchesStatus = statusFilter === "all" || owner.status === statusFilter
    const fullName = `${owner.firstName ?? ""} ${owner.lastName ?? ""}`.toLowerCase()
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      owner.city?.toLowerCase().includes(search.toLowerCase()) ||
      owner.email?.toLowerCase().includes(search.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "outline"; label: string }> = {
      actif:    { variant: "default",   label: "Actif" },
      inactif:  { variant: "secondary", label: "Inactif" },
      pending:  { variant: "outline",   label: "En attente" },
    }
    const { variant, label } = config[status] || { variant: "outline", label: status }
    return <Badge variant={variant}>{label}</Badge>
  }

  return (
    <>
      {/* Header — toujours visible */}
      <OwnersHeader />

      {error ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">{error}</p>
        </div>
      ) : loading ? (

        <>
          {/* Skeleton Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-36" />
                      <Skeleton className="h-7 w-16" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Skeleton Filtres */}
          <div className="flex flex-col gap-3 sm:flex-row mt-6">
            <Skeleton className="h-10 flex-1 rounded-md" />
            <Skeleton className="h-10 w-full sm:w-[160px] rounded-md" />
          </div>

          {/* Skeleton Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-md shrink-0" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <Skeleton className="h-8 flex-1 rounded-md" />
                    <Skeleton className="h-8 flex-1 rounded-md" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>

      ) : (

        <>
          <OwnersStats stats={stat} />
          <OwnersFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            search={search}
            setSearch={setSearch}
          />
          {filteredOwners.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                <div className="rounded-full bg-muted p-4">
                  <UserX className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-semibold">Aucun propriétaire trouvé</p>
                  <p className="text-sm text-muted-foreground">
                    Ajoutez votre premier propriétaire pour commencer.
                  </p>
                </div>
                <Button asChild>
                  <Link href="/dashboard/owners/new">Créer un propriétaire</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <OwnersGrid owners={filteredOwners} getStatusBadge={getStatusBadge} />
          )}
        </>
      )}
    </>
  )
}