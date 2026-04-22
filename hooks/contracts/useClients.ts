// ─── hook/contracts/useClients ─────────────

"use client"

import { useState, useEffect } from "react"
import axiosInstance from "@/lib/axios"
import type { Client } from "@/types/contractNew"

// ─── Forme exacte de la réponse serveur ───────────────────────────────────────

interface ApiInterestClient {
  id: number
  user_id: number
  nom: string
  prenom: string
  phone: string
  address: string
  city: string | null
  country: string | null
  // … autres champs ignorés
}

interface ApiBien {
  id: number
  title: string
  listingType: "rent" | "sale"
  price: string
  city: string
  address: string
  neighborhood: string
  // … autres champs ignorés
}

interface ApiInterest {
  id: number
  client_id: number
  bien_id: number
  status: string
  client: ApiInterestClient
  bien: ApiBien
}

interface ApiResponse {
  success: boolean
  message: string
  data: ApiInterest[]
}

// ─── Hook clients ─────────────────────────────────────────────────────────────
// Récupère les intérêts confirmés et en extrait les clients uniques

export function useClients(agencyId: number) {
  const [clients,   setClients]   = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error,     setError]     = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    axiosInstance
      .get<ApiResponse>("/api/contracts/interests/confirmed", { params: { agency_id: agencyId } })
      .then((res) => {
        if (cancelled) return

        // Déduplique par client_id — un client peut avoir plusieurs intérêts
        const seen = new Set<number>()
        const normalized: Client[] = []

        res.data.data.forEach((interest) => {
          if (seen.has(interest.client.id)) return
          seen.add(interest.client.id)

          normalized.push({
            id:     String(interest.client.id),
            name:   `${interest.client.prenom} ${interest.client.nom}`,
            email:  "",          // pas dans la réponse — à ajouter si dispo via user
            phone:  interest.client.phone,
            status: "approved",  // intérêt confirmé = client approuvé
          })
        })

        setClients(normalized)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [agencyId])

  return { clients, isLoading, error }
}
