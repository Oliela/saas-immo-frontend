// hooks/agence/useAgencyClients.ts
import axiosInstance from "@/lib/axios"
import { useEffect, useState } from "react"

export type WishForm = {
  id: number
  property_type: string | null
  listing_type: string | null
  budget_min: string | null
  budget_max: string | null
  nb_pieces: number | null
  ville: string | null
  description: string | null
  features: string[] | null
  timeline: string | null
  statut: string
}

export type Visite = {
  id: number
  status: string
  visit_schedule: {
    visit_date: string
    start_time: string
    bien: { title: string; city: string } | null
    agent: { nom: string; prenom: string } | null
  }
}

export type Contrat = {
  id: number
  contract_number: string
  type: string
  status: string
  amount: number
  start_date: string
  bien: { title: string; city: string } | null
  factures: Facture[]
}

export type Facture = {
  id: number
  numero_facture: string
  montant_ttc: number
  statut: string
  date_emission: string
}

export type ClientItem = {
  id: number           // id agency_client
  statut: string       // lead | qualifié | en_negociation | conclu
  source: string
  first_contact_at: string
  client: {
    id: number
    nom: string
    prenom: string
    phone: string
    city: string | null
    user: { email: string } | null
    wish_forms: WishForm[]
    visit_reservations: Visite[]
    contracts: Contrat[]
    favorites: { id: number; title: string; price: number }[]
  }
}

export type LeadItem = {
  id: number           // id agency_client
  statut: string       // prospect
  source: string
  first_contact_at: string
  lead: {
    id: number
    nom: string
    prenom: string
    email: string | null
    phone: string | null
    source: string
    wish_forms: WishForm[]
  }
}

export type AgencyClientsData = {
  clients: ClientItem[]
  leads: LeadItem[]
  stats: {
    total: number
    prospects: number
    leads: number
    qualifies: number
    en_negociation: number
    conclus: number
  }
}

export function useAgencyClients() {
  const [data, setData] = useState<AgencyClientsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get<AgencyClientsData>("/api/agency-clients",{params: { agency_id: 1 }})
        setData(response.data)
        // console.log("Fetched agency clients data:", response.data)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}