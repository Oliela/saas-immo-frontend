"use client"

import { useState } from "react"
import axiosInstance from "@/lib/axios"
import { InterestsStats } from "./InterestsStats"
import { InterestsFilters } from "./InterestsFilters"
import { InterestsList } from "./InterestsList"
import type { Interet, InteretStatus, InteretsStats as TStats } from "@/types/interets"
import { toast } from "sonner"

interface ListingInterestsPageProps {
  interets: Interet[]
  stats: TStats
  loading?: boolean
  refetch?: () => void
}

export default function ListingInterestsPage({
  interets,
  stats,
  loading,
  refetch,
}: ListingInterestsPageProps) {
  // ── filtres ───────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<InteretStatus | "all">("all")

  // ── dialog confirm / reject ───────────────────────────────────────────────
  const [selectedInteret, setSelectedInteret] = useState<Interet | null>(null)
  const [responseAction, setResponseAction] = useState<"confirm" | "reject" | null>(null)
  const [responseMessage, setResponseMessage] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  const handleSelectInteret = (interet: Interet, action: "confirm" | "reject") => {
    setSelectedInteret(interet)
    setResponseAction(action)
  }

  const handleCloseDialog = () => {
    setSelectedInteret(null)
    setResponseAction(null)
    setResponseMessage("")
  }

  const handleConfirm = async (id: number) => {
    setActionLoading(true)
    try {
      await axiosInstance.patch(`/api/interets/${id}/confirm`, {
        agent_response: responseMessage || undefined,
      })
      refetch?.()
      handleCloseDialog()
    } catch (error) {
      console.error("Erreur confirmation", error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (id: number) => {
    setActionLoading(true)
    try {
      await axiosInstance.patch(`/api/interets/${id}/reject`, {
        agent_response: responseMessage || undefined,
      })
      refetch?.()
      handleCloseDialog()
    } catch (error) {
      console.error("Erreur rejet", error)
    } finally {
      setActionLoading(false)
    }
  }

  // ── dialog retour agence ──────────────────────────────────────────────────
  const [retourInteret, setRetourInteret] = useState<Interet | null>(null)
  const [retourMessage, setRetourMessage] = useState("")
  const [retourLoading, setRetourLoading] = useState(false)

  const handleOpenRetour = (interet: Interet) => {
    setRetourInteret(interet)
    setRetourMessage(interet.agent_response ?? "")
  }

  const handleCloseRetour = () => {
    setRetourInteret(null)
    setRetourMessage("")
  }

  const handleSendRetour = async (id: number) => {
    if (!retourMessage.trim()) return

    setRetourLoading(true)
    // console.log("Envoi du retour au client pour l'intérêt ID", id, "avec le message :", retourMessage.trim())
    try {
      await axiosInstance.patch(`/api/interets/${id}/respond`, {
        agent_response: retourMessage,
      })
      toast.success("Retour envoyé au client")

      refetch?.()
      handleCloseRetour()
    } catch (error) {
      console.error("Erreur envoi retour", error ?? error)
    } finally {
      setRetourLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Intérêts des Clients</h1>
        <p className="text-muted-foreground">
          Gérez et répondez aux demandes d'intérêt pour les propriétés
        </p>
      </div>

      <InterestsStats stats={stats} loading={loading} />

      <InterestsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <InterestsList
        interets={interets}
        loading={loading}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        // confirm / reject
        selectedInteret={selectedInteret}
        responseMessage={responseMessage}
        responseAction={responseAction}
        actionLoading={actionLoading}
        onSelectInteret={handleSelectInteret}
        onCloseDialog={handleCloseDialog}
        onResponseMessageChange={setResponseMessage}
        onConfirm={handleConfirm}
        onReject={handleReject}
        // retour agence
        retourInteret={retourInteret}
        retourMessage={retourMessage}
        retourLoading={retourLoading}
        onOpenRetour={handleOpenRetour}
        onCloseRetour={handleCloseRetour}
        onRetourMessageChange={setRetourMessage}
        onSendRetour={handleSendRetour}
      />
    </div>
  )
}