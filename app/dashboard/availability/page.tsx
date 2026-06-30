"use client"
import AvailabilityPage from "@/components/dashboard/availability/page"
import { useAuthAgent } from "@/hooks/agence/useAuthAgent"
import { useGetAgent } from "@/hooks/agence/useGetAgent"
import { useGetBiens } from "@/hooks/agence/useGetBiens"
import { useGetCreneaux } from "@/hooks/agence/useGetCreneaux"




export default function AvailabilitySlotsPage() {
  const {user, loading} = useAuthAgent()
  // console.log("User:", user?.agency.id )

  const {creneaux, loading: loadingCreneaux} = useGetCreneaux({agencyId: user?.agency.id})
  // console.log("Creneaux:", creneaux)

  const {agent, loading: loadingAgent} = useGetAgent({agencyId: user?.agency.id})
  // console.log("Agent:", agent)

  const{biens, loading: loadingBiens} = useGetBiens({agencyId: user?.agency.id})
  // console.log("Biens:", biens)

  if (loading || loadingCreneaux || loadingAgent || loadingBiens) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-muted-foreground">Chargement...</p>
    </div>
  )

  // je dois recuper tous agent d'une agence et aussi tous les bien d'une agence pour les afficher dans la page de disponibilités


  return (
    <AvailabilityPage agents={agent} properties={biens} AvailabilitySlot={creneaux}  agencyId={user?.agency.id}   />
  )
}
