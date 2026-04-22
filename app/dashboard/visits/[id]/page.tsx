"use client"

import Link from "next/link"
import {
  ArrowLeft, Pencil, Calendar, Clock, MapPin, User, Building2,
  Phone, Mail, CheckCircle, AlertCircle, MessageSquare, Navigation, Loader2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"

// ─── Types ──────────────────────────────────────────────────────────────────

interface VisitHistory {
  id: number
  visit_reservation_id: number
  action: string
  description: string
  created_at: string
  updated_at: string
}

interface VisitResponse {
  visit: {
    id: number
    visit_schedule_id: number
    client_id: number
    status: string
    notes: string | null
    feedback: string | null
    created_at: string
    updated_at: string
    client: {
      id: number
      nom: string
      prenom: string
      phone: string
      address: string
      user: { email: string }
    }
    visit_schedule: {
      id: number
      visit_date: string
      start_time: string
      end_time: string
      status: string
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
      }
      agent: {
        id: number
        nom: string
        prenom: string
        email: string
        phone: string
      }
      agency: {
        phone: string
        name: string
        email: string
      }
    }
    histories: VisitHistory[]
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatTime = (t: string) => t.slice(0, 5)

const getDuration = (start: string, end: string): string => {
  const [sh, sm] = start.split(":").map(Number)
  const [eh, em] = end.split(":").map(Number)
  const diff = (eh * 60 + em) - (sh * 60 + sm)
  return diff >= 60
    ? `${Math.floor(diff / 60)}h${diff % 60 > 0 ? diff % 60 + "min" : ""}`
    : `${diff}min`
}

const getChecklist = (status: string) => [
  { item: "Confirmer le rendez-vous avec le client", done: true },
  { item: "Préparer la documentation de la propriété", done: true },
  { item: "Vérifier les clés d'accès à la propriété", done: true },
  { item: "Imprimer l'analyse de marché comparable", done: status !== "pending" },
  { item: "Suivi après la visite", done: status === "completed" },
]

const WORKFLOW = [
  { action: "visit_planned", label: "Visite créée", description: "La visite a été planifiée dans le système" },
  { action: "visit_confirmed", label: "Visite confirmée", description: "La visite a été confirmée par le client" },
  { action: "visit_reminder_sent", label: "Rappel envoyé au client", description: "Un rappel a été envoyé avant la visite" },
  { action: "visit_completed", label: "Visite terminée", description: "La visite s'est déroulée avec succès" },
  { action: "feedback_added", label: "Retour après visite ajouté", description: "Le compte rendu de visite a été renseigné" },
]

// ─── Component ──────────────────────────────────────────────────────────────

export default function VisitViewPage() {
  const { id } = useParams()
  const [data, setData] = useState<VisitResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [sendingReminder, setSendingReminder] = useState(false)
  const [markingDone, setMarkingDone] = useState(false)

  useEffect(() => {
    axiosInstance.get(`/api/visit-reservations/${id}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Erreur fetch visite:", err))
      .finally(() => setLoading(false))
  }, [id])

  // ── Actions ──────────────────────────────────────────────────────────────

  const handleSendReminder = async () => {
    if (!data) return
    setSendingReminder(true)
    try {
      await axiosInstance.post(`/api/visit-reservations/${data.visit.id}/reminder`, {
        message:
          "Bonjour, ceci est un rappel pour votre visite prévue le " +
          new Date(data.visit.visit_schedule.visit_date).toLocaleDateString("fr-FR", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          }) +
          `. Merci de nous confirmer votre présence.`,
      })
      toast.success("Rappel envoyé avec succès au client.")
      window.location.reload()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Erreur lors de l'envoi du rappel.")
    } finally {
      setSendingReminder(false)
    }
  }

  const handleMarkAsDone = async () => {
    if (!data) return
    setMarkingDone(true)
    try {
      await axiosInstance.post(`/api/visit-reservations/${data.visit.id}/done`)
      toast.success("Visite marquée comme terminée.")
      window.location.reload()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Erreur lors de la mise à jour.")
      console.error("Erreur mark as done:", err?.response?.data?.message ?? err)
    } finally {
      setMarkingDone(false)
    }
  }

  // ── Loading / Error states ────────────────────────────────────────────────

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-muted-foreground">Chargement...</p>
    </div>
  )

  if (!data) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-destructive">Visite introuvable.</p>
    </div>
  )

  const { visit } = data
  const schedule = visit.visit_schedule
  const bien = schedule.bien
  const agent = schedule.agent
  const client = visit.client
  const checklist = getChecklist(visit.status)
  const isCompleted = visit.status === "completed"
  const isCancelled = visit.status === "cancelled"

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
      confirmed: { variant: "default", label: "Confirmée" },
      pending: { variant: "secondary", label: "En attente" },
      completed: { variant: "outline", label: "Terminée" },
      cancelled: { variant: "destructive", label: "Annulée" },
    }
    const { variant, label } = config[status] ?? { variant: "outline", label: status }
    return <Badge variant={variant}>{label}</Badge>
  }
  // console.log("VisitViewPage - data:", data) // Debug log to inspect the fetched data
  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/visits"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">Détails de la visite</h1>
              {getStatusBadge(visit.status)}
            </div>
            <p className="text-muted-foreground mt-1">{bien.title}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!(isCompleted || isCancelled) && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent"
                onClick={handleSendReminder}
                disabled={sendingReminder}
              >
                {sendingReminder
                  ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  : <MessageSquare className="mr-2 h-4 w-4" />
                }
                Envoyer un rappel
              </Button>
              <Button size="sm" asChild>
                <Link href={`/dashboard/visits/${visit.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />Modifier la visite
                </Link>
              </Button>
            </>
          )}


        </div>
      </div>

      {/* ── Date Banner ── */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-primary/10 flex flex-col items-center justify-center shrink-0">
                <span className="text-xs font-medium text-primary">
                  {new Date(schedule.visit_date).toLocaleDateString("fr-FR", { month: "short" })}
                </span>
                <span className="text-2xl font-bold text-primary">
                  {new Date(schedule.visit_date).getDate()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg capitalize">
                  {new Date(schedule.visit_date).toLocaleDateString("fr-FR", {
                    weekday: "long", year: "numeric", month: "long", day: "numeric",
                  })}
                </p>
                <div className="flex items-center gap-4 mt-1 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatTime(schedule.start_time)} – {formatTime(schedule.end_time)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {getDuration(schedule.start_time, schedule.end_time)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">

          {/* ── Propriété ── */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5" />Propriété
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Titre</span>
                <span className="font-medium text-foreground">{bien.title}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Adresse</span>
                <span className="font-medium text-foreground text-right">
                  {bien.address}, {bien.neighborhood}, {bien.city}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium text-foreground capitalize">{bien.propertyType}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chambres / Surface</span>
                <span className="font-medium text-foreground">{bien.rooms} chambres — {bien.surface} m²</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Prix</span>
                <div className="text-right">
                  <span className="font-bold text-foreground">
                    {Number(bien.price).toLocaleString("fr-FR")} FCFA
                    {bien.listingType === "rent" && " / mois"}
                  </span>
                  <Badge
                    variant={bien.listingType === "rent" ? "secondary" : "default"}
                    className="ml-2 text-xs"
                  >
                    {bien.listingType === "rent" ? "À louer" : "À vendre"}
                  </Badge>
                </div>
              </div>
              <div className="pt-2">
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Navigation className="mr-2 h-4 w-4" />Obtenir les directions
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ── Notes ── */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Notes avant la visite</CardTitle></CardHeader>
            <CardContent>
              {visit.notes ? (
                <p className="text-muted-foreground leading-relaxed">{visit.notes}</p>
              ) : (
                <p className="text-muted-foreground italic text-sm">Aucune note pour cette visite.</p>
              )}
            </CardContent>
          </Card>

          {/* ── Feedback ── */}
          {visit.feedback && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Retours après la visite</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{visit.feedback}</p>
              </CardContent>
            </Card>
          )}

          {/* ── Historique ── */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Historique d'activité</CardTitle></CardHeader>
            <CardContent>
              {(() => {
                const doneActions = new Set(visit.histories.map((h) => h.action))
                const lastDoneIndex = WORKFLOW.reduce((acc, step, i) =>
                  doneActions.has(step.action) ? i : acc, -1)

                return (
                  <div className="space-y-0">
                    {WORKFLOW.map((step, index) => {
                      const historyEntry = visit.histories.find((h) => h.action === step.action)
                      const isDone = doneActions.has(step.action)
                      const isCurrent = index === lastDoneIndex
                      const isPending = !isDone

                      return (
                        <div key={step.action} className="flex gap-4 pb-6 last:pb-0">
                          <div className="flex flex-col items-center">
                            <div className={`h-3 w-3 rounded-full shrink-0 mt-0.5 transition-colors ${isCurrent
                              ? "bg-primary ring-4 ring-primary/20"
                              : isDone ? "bg-primary/40" : "bg-border"}`}
                            />
                            {index < WORKFLOW.length - 1 && (
                              <div className={`w-px flex-1 mt-1 ${isDone ? "bg-primary/20" : "bg-border"}`} />
                            )}
                          </div>
                          <div className="flex-1 pb-2">
                            <p className={`text-sm font-medium ${isCurrent ? "text-primary" : isDone ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                              {step.label}
                            </p>
                            <p className={`text-xs mt-0.5 ${isDone ? "text-muted-foreground" : "text-muted-foreground/40"}`}>
                              {historyEntry?.description ?? step.description}
                            </p>
                            {historyEntry && (
                              <span className="text-xs text-muted-foreground">
                                {new Date(historyEntry.created_at).toLocaleDateString("fr-FR", {
                                  day: "numeric", month: "long", year: "numeric",
                                  hour: "2-digit", minute: "2-digit",
                                })}
                              </span>
                            )}
                            {isPending && (
                              <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground/60">
                                En attente
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">

          {/* Client */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />Client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{client.prenom[0]}{client.nom[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{client.prenom} {client.nom}</p>
                  <p className="text-xs text-muted-foreground capitalize">{client.address}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />{client.user.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />{client.phone}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Agent assigné</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{agent ? `${agent.prenom[0]}${agent.nom[0]}` : `${schedule.agency.name[0]}`}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{agent ? `${agent.prenom} ${agent.nom}` : schedule.agency.name}</p>
                  <p className="text-sm text-muted-foreground">{agent ? agent.email : schedule?.agency?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />{agent ? agent.phone : schedule?.agency?.phone}
              </div>
            </CardContent>
          </Card>

          {/* Checklist */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Liste de vérification</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {checklist.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  {item.done ? (
                    <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                  )}
                  <span className={`text-sm ${item.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    {item.item}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Actions rapides</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" size="sm" asChild>
                <Link href={`/dashboard/visits/${visit.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />Modifier la visite
                </Link>
              </Button>

              {!(isCompleted || isCancelled) && (
                <>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    size="sm"
                    onClick={handleSendReminder}
                    disabled={sendingReminder}
                  >
                    {sendingReminder
                      ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      : <MessageSquare className="mr-2 h-4 w-4" />
                    }
                    {sendingReminder ? "Envoi en cours..." : "Envoyer un rappel"}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    size="sm"
                    onClick={handleMarkAsDone}
                    disabled={markingDone}
                  >
                    {markingDone
                      ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      : <CheckCircle className="mr-2 h-4 w-4" />
                    }
                    {isCompleted
                      ? "Déjà terminée"
                      : markingDone
                        ? "Mise à jour..."
                        : "Marquer comme terminée"
                    }
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}