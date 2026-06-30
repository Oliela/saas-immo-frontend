import axiosInstance from "@/lib/axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export type DocumentStatus = 'pending' | 'approved' | 'rejected'

export type Document = {
  id: number
  client_id: number
  type: string
  file_path: string
  original_name: string
  status: DocumentStatus
  uploaded_at: string
  verified_at: string | null
}

export type Image = {
  id: number
  url: string
  alt: string | null
  bien_id: number
}

export type Bien = {
  id: number
  title: string
  propertyType: string
  listingType: string
  price: string
  status: string
  city: string
  neighborhood: string
  address: string
  surface: string
  rooms: number
  bathrooms: number
  floor: number
  furnished: number
  images?: Image[]
}

export type Facture = {
  id: number
  numero_facture: string
  montant_ttc: string
  statut: string
  date_emission: string
  type_facture: string
}

export type Contract = {
  id: number
  contract_number: string
  type: string
  status: string
  amount: string
  deposit: string
  duration: number
  start_date: string
  city: string
  payment_frequency: string
  sent_at: string | null
  signed_at: string | null
  bien: Bien | null
  factures: Facture[]
}

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
  area_min: number | null
  area_max: number | null
  statut: string
}

export type VisitSchedule = {
  visit_date: string
  start_time: string
  bien: Bien | null
  agent: { nom: string; prenom: string } | null
}

export type VisitReservation = {
  id: number
  status: string
  notes: string | null
  feedback: string | null
  visit_schedule: VisitSchedule | null
}

export type ClientDetail = {
  id: number
  nom: string
  prenom: string
  phone: string
  address: string | null
  city: string | null
  country: string | null
  occupation: string | null
  employer: string | null
  type_employment: string | null
  monthly_income: string | null
  property_type: string | null
  monthly_budget: string | null
  nb_pieces: number | null
  move_in_date: string | null
  note: string | null
  birth_date: string | null
  id_document: string | null
  income_proof: string | null
  professional_situation: string | null
  acquisition_type: string | null
  surface_area: number | null
  bank_statement: string | null
  recommendation_letter: string | null
  work_contract: string | null
  rental_history: string | null
  other: string | null
  user: {
    id: number
    email: string
    account_type: string
    created_at: string
  } | null
  wish_forms: WishForm[]
  contracts: Contract[]
  favorites: (Bien & { pivot: { client_id: number; bien_id: number }; images: Image[] })[]
  documents: Document[]
  visit_reservations?: VisitReservation[]
}

export type AgencyClientDetail = {
  id: number
  agency_id: number
  client_id: number | null
  lead_id: number | null
  source: string
  statut: string
  first_contact_at: string
  client: ClientDetail | null
  lead?: {
    id: number
    nom: string
    prenom: string
    email: string | null
    phone: string | null
    source: string
    wish_forms: WishForm[]
  } | null
}

export function useAgencyClientDetails(id: string | number) {
  const [data, setData] = useState<AgencyClientDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    axiosInstance.get(`/api/agency-clients/client/${id}`)
      .then(res => setData(res.data.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  const approveDocument = async (docId: number) => {
    try {
      const res = await axiosInstance.patch(`/api/profile/documents/approval/${docId}`)
      setData(prev => {
        if (!prev?.client) return prev
        return {
          ...prev,
          client: {
            ...prev.client,
            documents: prev.client.documents.map(d =>
              d.id === docId ? { ...d, status: 'approved' as DocumentStatus, verified_at: new Date().toISOString() } : d
            ),
          },
        }
      })
      toast.success("Document approuvé avec succès")
      // console.log("Document approval response:", res.data)
    } catch (err: any) {
      const message = err.response?.data?.message || err.response?.data?.error || "Erreur lors de l'approbation du document"
      toast.error(message)
    }
  }

  const rejectDocument = async (docId: number) => {
    try {
    const res = await axiosInstance.patch(`/api/profile/documents/rejection/${docId}`)
    setData(prev => {
      if (!prev?.client) return prev
      return {
        ...prev,
        client: {
          ...prev.client,
          documents: prev.client.documents.map(d =>
            d.id === docId ? { ...d, status: 'rejected' as DocumentStatus, verified_at: null } : d
          ),
        },
      }
    })
    toast.success("Document rejeté avec succès")
    } catch (err: any) {
      const message = err.response?.data?.message || err.response?.data?.error || "Erreur lors du rejet du document"
      toast.error(message)
    }
  }

  return { data, loading, error, approveDocument, rejectDocument }
}
