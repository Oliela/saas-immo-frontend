"use client"

import { useEffect, useState } from "react"
import PropertiesListing from "@/components/dashboard/properties/PropertiesListing"
import axiosInstance from "@/lib/axios"
import { useAuthAgent } from "@/hooks/agence/useAuthAgent"

interface PropertyResponse {
  stats: {
    total: number
    sale: number
    rent: number
  }
  biens: any[]
}

export default function PropertiesPage() {
  const { user, loading: authLoading } = useAuthAgent()
  const [propertiesData, setPropertiesData] = useState<PropertyResponse | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user?.agency?.id) return

    const fetchProperties = async () => {
      setLoading(true)
      try {
        const res = await axiosInstance.get(`/api/biens/agency/${user.agency.id}`)
        setPropertiesData(res.data)
      } catch (error) {
        console.error("Error fetching properties:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [user?.agency?.id])

  return (
    <div className="space-y-6">
      <PropertiesListing
        properties={propertiesData?.biens ?? []}
        stats={propertiesData?.stats}
        loading={authLoading || loading}
      />
    </div>
  )
}