"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import PropertyViewHeader from "@/components/dashboard/properties/view/PropertyViewHeader"
import PropertyViewBadget from "@/components/dashboard/properties/view/PropertyViewBadget"
import PropertyViewGallery from "@/components/dashboard/properties/view/PropertyViewGallery"
import PropertyViewPriceCard from "@/components/dashboard/properties/view/PropertyViewPriceCard"
import PropertyViewOwnerCard from "@/components/dashboard/properties/view/PropertyViewOwnerCard"
import PropertyViewStat from "@/components/dashboard/properties/view/PropertyViewStat"
import PropertyViewTabs from "@/components/dashboard/properties/view/PropertyViewTabs"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axios"

interface Feature {
  id: string
  name: string
}

interface PropertyResponse {
  id: string
  title: string
  propertyType: string
  listingType: string
  price: number
  status: string
  city: string
  neighborhood: string
  address: string
  surface: number
  rooms: number
  bathrooms: number
  floor: string
  furnished: boolean
  description: string
  features: Feature[]
  images: string[]
  video: string | null
  owner: {
    id: string
    name: string
    email: string
    phone: string
  }
  createdAt: string
  updatedAt: string
  views: number
  favorites: number
  inquiries: number
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function PropertyViewSkeleton() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">

          {/* Gallery */}
          <Card className="overflow-hidden">
            <Skeleton className="h-72 w-full rounded-none" />
            <div className="flex gap-2 p-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-16 rounded-md shrink-0" />
              ))}
            </div>
          </Card>

          {/* Tabs */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-9 w-32 rounded-md" />
              <Skeleton className="h-9 w-32 rounded-md" />
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <div className="grid grid-cols-2 gap-4 pt-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Price Card */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-24 rounded-full" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-5 w-24" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-5 w-8" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Owner Card */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-5 w-28" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-9 w-full rounded-md" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
            </CardContent>
          </Card>

          {/* Dates Card */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PropertyViewPage() {
  const { id } = useParams()
  const [propertiesData, setPropertiesData] = useState<PropertyResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      try {
        const res = await axiosInstance.get(`/api/biens/${id}`)
        setPropertiesData(res.data)
      } catch (error) {
        console.error("Error fetching properties:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [id])

  if (loading) return <PropertyViewSkeleton />

  if (!propertiesData) return <div>Propriété introuvable.</div>

  return (
    <div className="space-y-6">
      <PropertyViewHeader property={propertiesData} />
      <PropertyViewBadget property={propertiesData} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <PropertyViewGallery property={propertiesData} />
          <PropertyViewTabs property={propertiesData} />
        </div>

        <div className="space-y-6">
          <PropertyViewPriceCard property={propertiesData} />
          <PropertyViewStat property={propertiesData} />
          <PropertyViewOwnerCard property={propertiesData} />

          <Card>
            <CardContent className="p-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Créé le</span>
                  <span className="text-foreground">
                    {new Date(propertiesData?.created_at || "").toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Dernière mise à jour</span>
                  <span className="text-foreground">
                    {new Date(propertiesData?.updated_at || "").toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}