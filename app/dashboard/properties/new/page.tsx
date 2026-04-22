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
import PropertiesNew from "@/components/dashboard/properties/new/PropertiesNew"
import { useAuthAgent } from "@/hooks/agence/useAuthAgent"
import { useOwners } from "@/hooks/agence/useOwner"
import { useGetCommodite } from "@/hooks/agence/useGetCommodite"

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


export default function NewPropertyPage() {
  const { user, loading } = useAuthAgent()
   const { owner, loading: ownersLoading } = useOwners({ agencyId: parseInt(user?.agency.id, 10) })
  const { commodite, loading: commoditeLoading } = useGetCommodite()


  // console.log("User from useAuth:", user?.agency.id, "Loading:", loading)
  // console.log("Owners from useOwners:", owner, "Loading:", ownersLoading)
  console.log("Commodite from useGetCommodite:", commodite, "Loading:", commoditeLoading)

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>You must be logged in to create a property.</div>
  }
  return (
    <>
      <PropertiesNew propertyTypes={propertyTypes} owners={owner} agencyId={user?.agency.id} features={commodite} />
    </>
  )
}
