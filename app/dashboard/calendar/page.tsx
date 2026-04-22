"use client"

import CalendarHeader from "@/components/dashboard/calendrier/CalendarHeader"
import CalendarGrid from "@/components/dashboard/calendrier/CalendarGrid"
import CalendarDaySchedule from "@/components/dashboard/calendrier/CalendarDaySchedule"
import CalendarAgentAvailability from "@/components/dashboard/calendrier/CalendarAgentAvailability"
import { useAuthAgent } from "@/hooks/agence/useAuthAgent"
import { useGetCreneaux } from "@/hooks/agence/useGetCreneaux"
import { Creneau } from "@/types/creneau"

export default function CalendarPage() {
  const { user, loading } = useAuthAgent()

  const { creneaux, loading: loadingCreneaux } = useGetCreneaux({
    agencyId: user?.agency?.id,
  })

  if (loading || loadingCreneaux) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  const creneauxList: Creneau[] = creneaux ?? []
  const today = new Date().toLocaleDateString("en-CA")

  // ── CalendarGrid reçoit TOUT — il filtre lui-même ─────────────────────────
  // ── CalendarAgentAvailability reçoit TOUT — elle filtre par date ──────────
  // ── CalendarDaySchedule reçoit uniquement les créneaux avec réservations ──

  const visitesduJour = creneauxList.filter(
    (c) => c.visit_date === today && (c.reservations?.length ?? 0) > 0
  )

  return (
    <div className="space-y-6">
      <CalendarHeader />

      {/* Calendrier principal — reçoit tous les créneaux y compris unavailable */}
      <CalendarGrid creneaux={creneauxList} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Programme du jour — uniquement les créneaux avec réservation */}
        <CalendarDaySchedule creneaux={visitesduJour} />

        {/* Disponibilité du jour — tous les créneaux du jour (available + unavailable) */}
        <CalendarAgentAvailability creneaux={creneauxList} />
      </div>
    </div>
  )
}