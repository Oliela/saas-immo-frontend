"use client"

import React from "react"
import { Calendar, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Reservation } from "@/hooks/agence/useGetVisits"
import { formatTime } from "@/types/creneau"

// ─── Statut badge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, {
  variant: "default" | "secondary" | "outline" | "destructive"
  label: string
  icon: React.ReactNode
}> = {
  confirmed: { variant: "default",     label: "Confirmée",  icon: <CheckCircle className="h-3 w-3 mr-1" /> },
  pending:   { variant: "secondary",   label: "En attente", icon: <AlertCircle className="h-3 w-3 mr-1" /> },
  cancelled: { variant: "destructive", label: "Annulée",    icon: <XCircle     className="h-3 w-3 mr-1" /> },
  completed: { variant: "outline",     label: "Complétée",  icon: <CheckCircle className="h-3 w-3 mr-1" /> },
}

const getStatusBadge = (status: string) => {
  const cfg = STATUS_CONFIG[status] ?? { variant: "outline" as const, label: status, icon: null }
  return (
    <Badge variant={cfg.variant} className="flex items-center w-fit">
      {cfg.icon}
      {cfg.label}
    </Badge>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface VisitsTodayScheduleProps {
  visits?: Reservation[]
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VisitsTodaySchedule({ visits = [] }: VisitsTodayScheduleProps) {

  const dateLabel = new Date().toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  })

  // Trier par heure de début
  const sorted = [...visits].sort((a, b) =>
    a.visit_schedule.start_time.localeCompare(b.visit_schedule.start_time)
  )

  //une fonction qui qui donne la duree de la visite en format 60 min à partir de start_time et du end_time
  const getVisitDuration = (startTime: string, endTime: string) => {
    const start = new Date(`1970-01-01T${startTime}Z`)
    const end = new Date(`1970-01-01T${endTime}Z`)
    const diff = (end.getTime() - start.getTime()) / (1000 * 60) // en minutes
    return `${diff} min`
  }

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Programme d'aujourd'hui
        </CardTitle>
        <CardDescription className="capitalize">{dateLabel}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sorted.length > 0 ? (
            sorted.map((reservation) => {
              const schedule = reservation.visit_schedule
              return (
                <div key={reservation.id} className="flex gap-3 p-3 rounded-lg border border-border">
                  {/* Heure */}
                  <div className="flex flex-col items-center text-center min-w-[60px]">
                    <span className="text-sm font-medium text-foreground">
                      {formatTime(schedule.start_time)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {getVisitDuration(schedule.start_time, schedule.end_time)}
                    </span>
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="font-medium text-foreground truncate">
                      {schedule.bien.title}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                     {schedule.agent ? `${schedule.agent.prenom} ${schedule.agent.nom}` : `${schedule.agency.name}`}
                    </p>
                    {getStatusBadge(reservation.status)}
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Aucune visite prévue pour aujourd'hui
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
