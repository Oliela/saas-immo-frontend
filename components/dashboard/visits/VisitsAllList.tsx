"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Search, Clock, MapPin, User, Building2,
  MoreHorizontal, CheckCircle, XCircle, AlertCircle, Loader2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { type Reservation } from "@/hooks/agence/useGetVisits"
import { formatTime } from "@/types/creneau"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"

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
      {cfg.icon}{cfg.label}
    </Badge>
  )
}

interface VisitsAllListProps {
  visits?: Reservation[]
  loading?: boolean
}

export default function VisitsAllList({ visits = [], loading }: VisitsAllListProps) {

  const [statusFilter, setStatusFilter] = useState("all")
  const [search, setSearch]             = useState("")
  const [loadingId, setLoadingId]       = useState<number | null>(null)
  const [loadingAction, setLoadingAction] = useState<"reminder" | "done" | "cancel" | null>(null)

  const filtered = visits.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      const s = r.visit_schedule
      if (
        !s.bien.title.toLowerCase().includes(q) &&
        !s.agent.prenom.toLowerCase().includes(q) &&
        !s.agent.nom.toLowerCase().includes(q) &&
        !r.client.prenom.toLowerCase().includes(q) &&
        !r.client.nom.toLowerCase().includes(q) &&
        !new Date(s.visit_date).toLocaleDateString("fr-FR").toLowerCase().includes(q)
      ) return false
    }
    return true
  })

  const handleSendReminder = async (reservation: Reservation) => {
    setLoadingId(reservation.id); setLoadingAction("reminder")
    try {
      await axiosInstance.post(`/api/visit-reservations/${reservation.id}/reminder`, {
        message: "Bonjour, ceci est un rappel pour votre visite prévue le " +
          new Date(reservation.visit_schedule.visit_date).toLocaleDateString("fr-FR", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          }) + ". Merci de nous confirmer votre présence.",
      })
      toast.success("Rappel envoyé avec succès au client.")
      window.location.reload()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Erreur lors de l'envoi du rappel.")
    } finally { setLoadingId(null); setLoadingAction(null) }
  }

  const handleMarkAsDone = async (reservation: Reservation) => {
    setLoadingId(reservation.id); setLoadingAction("done")
    try {
      await axiosInstance.post(`/api/visit-reservations/${reservation.id}/done`)
      toast.success("Visite marquée comme terminée.")
      window.location.reload()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Erreur lors de la mise à jour.")
    } finally { setLoadingId(null); setLoadingAction(null) }
  }

  const handleCancelVisit = async (reservation: Reservation) => {
    setLoadingId(reservation.id); setLoadingAction("cancel")
    try {
      await axiosInstance.post(`/api/visit-reservations/${reservation.id}/cancel`)
      toast.success("Visite annulée.")
      window.location.reload()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Erreur lors de l'annulation.")
    } finally { setLoadingId(null); setLoadingAction(null) }
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Toutes les visites</CardTitle>
          <CardDescription>Gérer toutes les visites de propriétés prévues</CardDescription>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-9 w-[150px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="confirmed">Confirmée</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="completed">Complétée</SelectItem>
              <SelectItem value="cancelled">Annulée</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3" style={{ maxHeight: "600px", overflowY: "auto" }}>

          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-border">
                {/* Bloc date */}
                <div className="hidden sm:flex flex-col items-center min-w-[80px] p-2 rounded-lg bg-muted space-y-1">
                  <Skeleton className="h-3 w-8" />
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-3 w-8" />
                </div>
                {/* Infos */}
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between gap-2">
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-5 w-20 rounded-full shrink-0" />
                  </div>
                  <div className="flex gap-4">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-md shrink-0" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucune visite trouvée</p>
          ) : (
            filtered.map((reservation) => {
              const c = reservation.client
              const s = reservation.visit_schedule
              const visitDate   = new Date(s.visit_date)
              const isCompleted = reservation.status === "completed"
              const isCancelled = reservation.status === "cancelled"
              const isLoading   = loadingId === reservation.id

              return (
                <div
                  key={reservation.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="hidden sm:flex flex-col items-center text-center min-w-[80px] p-2 rounded-lg bg-muted">
                    <span className="text-xs text-muted-foreground capitalize">
                      {visitDate.toLocaleDateString("fr-FR", { weekday: "short" })}
                    </span>
                    <span className="text-lg font-bold text-foreground">{visitDate.getDate()}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {visitDate.toLocaleDateString("fr-FR", { month: "short" })}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-foreground">{s.bien.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate capitalize">{s.bien.propertyType} · {s.agency.name}</span>
                        </div>
                      </div>
                      {getStatusBadge(reservation.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1"><User className="h-3 w-3" />{c.nom} {c.prenom}</div>
                      <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatTime(s.start_time)} – {formatTime(s.end_time)}</div>
                      <div className="flex items-center gap-1"><Building2 className="h-3 w-3" />{s.agent ? `${s.agent.prenom} ${s.agent.nom}` : s?.agency?.name}</div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/visits/${reservation.id}`}>Voir les détails</Link>
                      </DropdownMenuItem>
                      {!(isCompleted || isCancelled) && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/visits/${reservation.id}/edit`}>Modifier la visite</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendReminder(reservation)}>
                            {isLoading && loadingAction === "reminder" && <Loader2 className="h-3 w-3 mr-2 animate-spin" />}
                            Envoyer un rappel
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleMarkAsDone(reservation)}>
                            {isLoading && loadingAction === "done" && <Loader2 className="h-3 w-3 mr-2 animate-spin" />}
                            Marquer comme complétée
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleCancelVisit(reservation)}>
                            {isLoading && loadingAction === "cancel" && <Loader2 className="h-3 w-3 mr-2 animate-spin" />}
                            Annuler la visite
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}