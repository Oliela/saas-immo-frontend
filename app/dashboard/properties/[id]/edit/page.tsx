"use client"

import {
  Building2,
  Home,
  Landmark,
  Store,
  Warehouse,
  Hotel,
  Building,
  Tent,
  Factory,
  School,
} from "lucide-react"

import PropertyEditPage from "@/components/dashboard/properties/edit/PropertyEditPage"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axios"



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


// Pre-filled mock data for editing
const existingProperty = {
  title: "Modern Apartment with City View",
  propertyType: "apartment",
  listingType: "sale",
  price: "450000",
  status: "available",
  city: "new-york",
  neighborhood: "Manhattan",
  address: "123 Park Avenue, Apt 15B, New York, NY 10017",
  surface: "1200",
  rooms: "3",
  bathrooms: "2",
  floor: "15",
  furnished: true,
  description: "Beautiful modern apartment with stunning city views. This spacious 3-bedroom unit features high ceilings, hardwood floors throughout, and floor-to-ceiling windows that flood the space with natural light.",
  ownerId: "1",
}
interface Feature {
  id: number
  name: string
}
interface Image {
    id: string
    url: string

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
  marketplace: boolean
  features: Feature[]
  images: Image[]
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
  agency_id: string
  owners_id: string
}

export default function EditPropertyPage({}) {
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


  
  // console.log("Fetched properties edit:", propertiesData)

  return (
    <PropertyEditPage propertyTypes={propertyTypes} existingProperty={propertiesData} mockOwners={[]} />
  )
}
