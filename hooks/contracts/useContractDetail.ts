"use client"

import { useState, useEffect } from "react"
import axiosInstance from "@/lib/axios"
import type { ContractClause, FormData, ContractType } from "@/types/contractNew"

// ─── Forme exacte de la réponse GET /api/contracts/{id} ──────────────────────

export interface ApiContractDetail {
  id: number
  contract_number: string
  client_id: number
  bien_id: number
  agency_id: number
  type: ContractType
  status: string
  city: string
  start_date: string
  duration: number
  cautionMonths: number
  amount: string
  deposit: string
  commission: string
  payment_frequency: string
  sent_at: string | null
  signed_at: string | null
  expired_at: string | null
  created_at: string
  updated_at: string
  client: {
    id: number
    nom: string
    prenom: string
    phone: string
    address: string
    city: string | null
  }
  bien: {
    id: number
    title: string
    listingType: "rent" | "sale"
    price: string
    city: string
    neighborhood: string
    address: string
    images: { id: number; url: string }[]
  }
  contract_clauses: {
    id: number
    contract_id: number
    clause_id: number | null
    title: string
    content: string
    order: number
    is_custom: number
  }[]
  agency: {
    id: number
    name: string
    email: string
    phone: string
  }
}

// ─── Données normalisées pour le formulaire d'édition ─────────────────────────

export interface ContractEditData {
  contractId:      number
  contractNumber:  string
  contractType:    ContractType
  status:          string
  agencyName:      string
  agencyId:        number
  formData:        FormData
  selectedClient: {
    id: string
    name: string
    email: string
    phone: string
    status: string
  }
  selectedProperty: {
    id: string
    title: string
    address: string
    price: number
    type: "rent" | "sale"
  }
  clauses: ContractClause[]
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useContractDetail(contractId: string | number) {
  const [data,      setData]      = useState<ContractEditData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error,     setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!contractId) return
    let cancelled = false
    setIsLoading(true)
    setError(null)

    axiosInstance
      .get<{ success: boolean; data: ApiContractDetail }>(`/api/contracts/${contractId}`)
      .then((res) => {
        if (cancelled) return
        const c = res.data.data
        setData(normalize(c))
      })
      .catch((err) => {
        if (!cancelled)
          setError(err.response?.data?.message ?? "Impossible de charger le contrat")
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [contractId])

  return { data, isLoading, error }
}

// ─── Normalisation : ApiContractDetail → ContractEditData ─────────────────────

function normalize(c: ApiContractDetail): ContractEditData {
  // FormData — chaînes comme dans le formulaire de création
  const formData: FormData = {
    city:             c.city,
    startDate:        c.start_date,           // "2026-05-06"
    duration:         String(c.duration),
    rentAmount:       String(parseFloat(c.amount)),
    deposit:          String(parseFloat(c.deposit)),
    cautionMonths:    String(c.cautionMonths),
    commission:       String(parseFloat(c.commission)),
    paymentFrequency: c.payment_frequency,
  }

  // Client normalisé
  const selectedClient = {
    id:     String(c.client.id),
    name:   `${c.client.prenom} ${c.client.nom}`,
    email:  "",
    phone:  c.client.phone,
    status: "approved",
  }

  // Bien normalisé
  const selectedProperty = {
    id:      String(c.bien.id),
    title:   c.bien.title,
    address: `${c.bien.address}, ${c.bien.neighborhood}, ${c.bien.city}`,
    price:   parseFloat(c.bien.price),
    type:    c.bien.listingType,
  }

  // Clauses — triées par order, converties en ContractClause
  const clauses: ContractClause[] = [...c.contract_clauses]
    .sort((a, b) => a.order - b.order)
    .map((cl) => ({
      id:              `server-${cl.id}`,
      clause_id:       cl.clause_id ?? undefined,
      title:           cl.title,
      content:         cl.content,
      type:            c.type,
      source:          cl.clause_id ? "agency" : "system",
      isModified:      false,
      originalContent: cl.content,
    }))

  return {
    contractId:       c.id,
    contractNumber:   c.contract_number,
    contractType:     c.type,
    status:           c.status,
    agencyName:       c.agency.name,
    agencyId:         c.agency.id,
    formData,
    selectedClient,
    selectedProperty,
    clauses,
  }
}
