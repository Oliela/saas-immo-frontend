// hooks/clients/useGetContractDetail.ts

import { useState, useEffect } from "react"
import axiosInstance from "@/lib/axios"

export interface ContractClause {
  id: number
  contract_id: number
  clause_id: number | null
  title: string
  content: string
  order: number
  is_custom: number
  created_at: string
  updated_at: string
}

export interface ContractHistory {
  id: number
  contract_id: number
  action: "created" | "sent" | "signed" | "revision_requested" | "approved" | "cancelled"
  description: string
  created_at: string
  updated_at: string
}

export interface BienImage {
  id: number
  url: string
  alt: string | null
  bien_id: number
  created_at: string
  updated_at: string
}

export interface ContractDetail {
  id: number
  contract_number: string
  client_id: number
  bien_id: number
  agency_id: number
  type: "rental" | "sale"
  status: "draft" | "sent" | "approved" | "signed" | "revision" | "expired" | "cancelled"
  city: string
  start_date: string
  duration: number
  cautionMonths: number
  amount: string
  deposit: string
  commission: string
  payment_frequency: "monthly" | "quarterly" | "yearly"
  sent_at: string | null
  signed_at: string | null
  expired_at: string | null
  created_at: string
  updated_at: string
  client: {
    id: number
    user_id: number
    nom: string
    prenom: string
    phone: string
    address: string
    city: string | null
    country: string | null
  }
  bien: {
    id: number
    title: string
    propertyType: string
    listingType: string
    price: string
    city: string
    neighborhood: string
    address: string
    surface: string
    rooms: number
    bathrooms: number
    floor: number
    furnished: number
    images: BienImage[]
  }
  contract_clauses: ContractClause[]
  histories: ContractHistory[]
  agency: {
    id: number
    name: string
    email: string
    phone: string
    city: string
    address: string
    logo: string | null
  }
}

export function useGetContractDetail(contractId: number | null) {
  const [contract, setContract] = useState<ContractDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchContract = async () => {
    if (!contractId) return
    setLoading(true)
    setError(null)
    try {
      const res = await axiosInstance.get(`/api/contracts/${contractId}`)
      console.log("Détail du contrat reçu :", res.data)
      setContract(res.data?.data ?? null)
    } catch (err) {
      console.error("Erreur lors du chargement du contrat :", err)
      setError("Impossible de charger le contrat.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContract()
  }, [contractId])

  return { contract, loading, error, refetch: fetchContract }
}