"use client"

import CalendarHeader from "@/components/dashboard/calendrier/CalendarHeader"
import CalendarGrid from "@/components/dashboard/calendrier/CalendarGrid"
import CalendarDaySchedule from "@/components/dashboard/calendrier/CalendarDaySchedule"
import CalendarAgentAvailability from "@/components/dashboard/calendrier/CalendarAgentAvailability"
import { useAuthAgent } from "@/hooks/agence/useAuthAgent"
import { useGetCreneaux } from "@/hooks/agence/useGetCreneaux"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Creneau } from "@/types/creneau"

function CalendarSkeleton() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-9 w-40 rounded-md" />
      </div>

      {/* Grille calendrier */}
      <Card>
        <CardContent className="p-4">

          {/* Navigation mois */}
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>

          {/* Jours de la semaine */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-4 rounded" />
            ))}
          </div>

          {/* Cases du calendrier */}
          <div className="grid grid-cols-7 gap-1.5">
            {[...Array(35)].map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg border border-border p-1.5 flex flex-col gap-1"
              >
                <Skeleton className="h-3.5 w-1/2 rounded" />
                {i % 5 === 0 && <Skeleton className="h-2 w-full rounded" />}
                {i % 7 === 2 && <Skeleton className="h-2 w-4/5 rounded" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Programme du jour + Disponibilités */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Programme du jour */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg border border-border">
                <div className="flex flex-col gap-1 min-w-[50px]">
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3 w-full" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-3 w-3/5" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Disponibilité agents */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-5 w-52" />
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-3 rounded-lg border border-border space-y-2">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-5 w-4/5 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CalendarPage() {
  const { user, loading } = useAuthAgent()

  const { creneaux, loading: loadingCreneaux } = useGetCreneaux({
    agencyId: user?.agency?.id,
  })

  if (loading || loadingCreneaux) return <CalendarSkeleton />

  const creneauxList: Creneau[] = creneaux ?? []
  const today = new Date().toLocaleDateString("en-CA")

  const visitesduJour = creneauxList.filter(
    (c) => c.visit_date === today && (c.reservations?.length ?? 0) > 0
  )

  return (
    <div className="space-y-6">
      <CalendarHeader />
      <CalendarGrid creneaux={creneauxList} />
      <div className="grid gap-6 lg:grid-cols-3">
        <CalendarDaySchedule creneaux={visitesduJour} />
        <CalendarAgentAvailability creneaux={creneauxList} />
      </div>
    </div>
  )
}