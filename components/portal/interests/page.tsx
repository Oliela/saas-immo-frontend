"use client"

import { useState } from "react"
import axiosInstance from "@/lib/axios"
import { PortalInterestsStats } from "./PortalInterestsStats"
import { PortalInterestsTabs } from "./PortalInterestsTabs"
import type { Interet, InteretsStats } from "@/types/interetsClient"
import { toast } from "sonner"

interface ListingPortalInterestsPageProps {
  interets: Interet[]
  stats: InteretsStats
  loading?: boolean
  refetch?: () => void
}

export default function ListingPortalInterestsPage({
  interets,
  stats,
  loading,
  refetch,
}: ListingPortalInterestsPageProps) {
  // Surcharges locales optimistes : undefined = pas encore interagi
  const [localConfirmations, setLocalConfirmations] = useState<Record<number, boolean | null>>({})

  // ── Retirer un intérêt (pending) ─────────────────────────────────────────
  const handleWithdraw = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/interets/${id}`)
      toast.success("Intérêt retiré avec succès")
      refetch?.()
    } catch (error) {
      toast.error("Erreur lors du retrait de l'intérêt")
      console.error("Erreur retrait intérêt", error)
    }
  }

  // ── Client confirme sa présence ──────────────────────────────────────────
  const handleClientConfirm = async (id: number) => {
    setLocalConfirmations((prev) => ({ ...prev, [id]: true }))
    try {
      await axiosInstance.patch(`/api/interets/${id}/confirm`)
      refetch?.()
    } catch (error) {
      // Rollback optimiste en cas d'erreur
      setLocalConfirmations((prev) => ({ ...prev, [id]: null }))
      console.error("Erreur confirmation client", error)
    }
  }

  // ── Client décline ───────────────────────────────────────────────────────
  const handleClientDecline = async (id: number) => {
    setLocalConfirmations((prev) => ({ ...prev, [id]: false }))
    try {
      await axiosInstance.patch(`/api/interets/${id}/reject`)
      toast.success("Intérêt décliné")
      refetch?.()
    } catch (error) {
      // Rollback optimiste en cas d'erreur
      setLocalConfirmations((prev) => ({ ...prev, [id]: null }))
      toast.error("Erreur lors du déclin de l'intérêt")
      console.error("Erreur déclin client", error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mes Intérêts</h1>
        <p className="text-muted-foreground">
          Suivez le statut de vos demandes d'intérêt pour les propriétés
        </p>
      </div>

      <PortalInterestsStats stats={stats} loading={loading} />

      <PortalInterestsTabs
        interets={interets}
        loading={loading}
        localConfirmations={localConfirmations}
        onWithdraw={handleWithdraw}
        onClientConfirm={handleClientConfirm}
        onClientDecline={handleClientDecline}
      />
    </div>
  )
}