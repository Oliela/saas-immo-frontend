"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Define the PropertyResponse type


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




export default function PropertyViewPage() {
  const { id } = useParams()
  const [propertiesData, setPropertiesData] = useState<PropertyResponse | null>(null)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axiosInstance.get(`/api/biens/${id}`)
        setPropertiesData(res.data)
      } catch (error) {
        console.error("Error fetching properties:", error)
      }
    }
    
    fetchProperties()
  }, [])

  if (!propertiesData) {
    return <div>Loading...</div>
  }

  console.log("Fetched properties data:", propertiesData)



  return (
    <div className="space-y-6">
      {/* Header */}
      <PropertyViewHeader property={propertiesData} />

      {/* Status Badges */}
      <PropertyViewBadget property={propertiesData} />


      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <PropertyViewGallery property={propertiesData} />

          {/* Tabs */}
          <PropertyViewTabs property={propertiesData} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}

          <PropertyViewPriceCard property={propertiesData} />

          {/* Stats Card */}
          <PropertyViewStat property={propertiesData} />

          {/* Owner Card */}

          <PropertyViewOwnerCard property={propertiesData} />

          {/* Dates Card */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Créé le</span>
                  <span className="text-foreground">{new Date(propertiesData?.created_at || "").toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Dernière mise à jour</span>
                  <span className="text-foreground">{new Date(propertiesData?.updated_at || "").toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
