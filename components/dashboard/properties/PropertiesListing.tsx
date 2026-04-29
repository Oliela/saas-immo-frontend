"use client"

import { useState } from "react"
import { Building2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import PropertiesHeader from "@/components/dashboard/properties/PropertiesHeader"
import PropertiesFilter from "@/components/dashboard/properties/PropertiesFilter"
import PropertiesStats from "@/components/dashboard/properties/PropertiesStats"
import PropertiesGrid from "@/components/dashboard/properties/PropertiesGrid"

export default function PropertiesListing({
  properties,
  stats,
  loading,
}: {
  properties: any[]
  stats: any
  loading?: boolean
}) {
  const [view, setView]     = useState<"grid" | "list">("grid")
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")

  const formatPrice = (price: number, listingType: "sale" | "rent") => {
    const formatted = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(price)
    return listingType === "rent" ? `${formatted}/mois` : formatted
  }

  const filteredProperties = properties.filter((property) => {
    const searchTerm = search.toLowerCase()
    const matchesSearch =
      property.title?.toLowerCase().includes(searchTerm) ||
      property.city?.toLowerCase().includes(searchTerm) ||
      property.neighborhood?.toLowerCase().includes(searchTerm) ||
      property.propertyType?.toLowerCase().includes(searchTerm) ||
      property.description?.toLowerCase().includes(searchTerm) ||
      property.price?.toString().toLowerCase().includes(searchTerm) ||
      property.surface?.toString().toLowerCase().includes(searchTerm) ||
      property.rooms?.toString().toLowerCase().includes(searchTerm) ||
      property.bathrooms?.toString().toLowerCase().includes(searchTerm)
    const matchesFilter = filter === "all" || property.listingType === filter
    return matchesSearch && matchesFilter
  })

  return (
    <>
      {/* Header — toujours visible */}
      <PropertiesHeader />

      {/* Filters — toujours visible */}
      <PropertiesFilter
        view={view}
        setView={setView}
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
      />

      {loading ? (

        <>
          {/* Skeleton Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-10" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Skeleton Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full rounded-none" />
                <CardContent className="p-4 space-y-3">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-6 w-1/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
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
          <PropertiesStats stats={stats} />

          {filteredProperties.length === 0 ? (
            <Card className="w-full">
              <CardContent className="flex flex-col items-center justify-center py-20 px-6 text-center gap-5">
                <div className="rounded-full bg-muted p-6">
                  <Building2 className="h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Aucune propriété trouvée
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Essayez de modifier vos critères de recherche ou de filtre.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <PropertiesGrid
              properties={filteredProperties}
              view={view}
              formatPrice={formatPrice}
            />
          )}
        </>

      )}
    </>
  )
}