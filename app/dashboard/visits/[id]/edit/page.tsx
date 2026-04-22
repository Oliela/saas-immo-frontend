"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Trash2, Loader2, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useParams, useRouter } from "next/navigation"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"

// ─── Types ──────────────────────────────────────────────────────────────────

interface VisitData {
  visit: {
    id: number
    status: string
    notes: string | null
    feedback: string | null
    client: {
      id: number
      nom: string
      prenom: string
      phone: string
      user: { email: string }
    }
    visit_schedule: {
      id: number
      visit_date: string
      start_time: string
      end_time: string
      agent_id: number
      bien: {
        id: number
        title: string
        address: string
        neighborhood: string
        listingType: string
        propertyType: string
        price: number
        city: string
      }
      agent: {
        id: number
        nom: string
        prenom: string
        email: string
        phone: string
        account_type: string
      }
      agency:{
        phone: string
        name: string 
        email:string
      }
    }
  }
}

interface FormState {
  status: string
  visit_date: string
  start_time: string
  end_time: string
  notes: string
  feedback: string
}

// ─── Helper statut ───────────────────────────────────────────────────────────

const getStatusBadge = (status: string) => {
  const config: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
    confirmed: { variant: "default",     label: "Confirmée"  },
    pending:   { variant: "secondary",   label: "En attente" },
    completed: { variant: "outline",     label: "Terminée"   },
    cancelled: { variant: "destructive", label: "Annulée"    },
  }
  const { variant, label } = config[status] ?? { variant: "outline", label: status }
  return <Badge variant={variant}>{label}</Badge>
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function VisitEditPage() {
  const { id }   = useParams()
  const router   = useRouter()

  const [data, setData]                 = useState<VisitData | null>(null)
  const [form, setForm]                 = useState<FormState | null>(null)
  const [loading, setLoading]           = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting]     = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  // ── Fetch ────────────────────────────────────────────────────────────────
  useEffect(() => {
    axiosInstance.get(`/api/visit-reservations/${id}`)
      .then((res) => {
        const visit    = res.data.visit
        const schedule = visit.visit_schedule
        setData(res.data)
        setForm({
          status:     visit.status ?? "pending",
          visit_date: schedule.visit_date ?? "",
          start_time: schedule.start_time?.slice(0, 5) ?? "",
          end_time:   schedule.end_time?.slice(0, 5) ?? "",
          notes:      visit.notes ?? "",
          feedback:   visit.feedback ?? "",
        })
      })
      .catch((err) => console.error("Erreur fetch visite:", err))
      .finally(() => setLoading(false))
  }, [id])

  // ── Save ─────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form || !data) return
    setIsSubmitting(true)
    try {
      await axiosInstance.put(`/api/visit-reservations/${id}`, {
        status:    form.status,
        notes:      form.notes    || null,
        feedback:   form.feedback || null,
        visit_date: form.visit_date,
        start_time: form.start_time,
        end_time:   form.end_time,
      })
      toast.success("Visite mise à jour avec succès.")
      router.push(`/dashboard/visits/${id}`)
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Erreur lors de la mise à jour.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Confirmer ────────────────────────────────────────────────────────────
  const handleConfirm = async () => {
    if (!data) return
    setIsConfirming(true)
    try {
      await axiosInstance.patch(`/api/visit-reservations/${id}/confirm`)
      toast.success("Visite confirmée avec succès.")
      setForm((prev) => prev ? { ...prev, status: "confirmed" } : prev)
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Erreur lors de la confirmation.")
    } finally {
      setIsConfirming(false)
    }
  }

  // ── Annuler ───────────────────────────────────────────────────────────────
  const handleCancel = async () => {
    if (!data) return
    setIsDeleting(true)
    try {
      await axiosInstance.post(`/api/visit-reservations/${id}/cancel`)
      toast.success("Visite annulée.")
      setForm((prev) => prev ? { ...prev, status: "cancelled" } : prev)
      router.push("/dashboard/visits")
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Erreur lors de l'annulation.")
    } finally {
      setIsDeleting(false)
    }
  }

  // ── Guards ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-muted-foreground">Chargement...</p>
    </div>
  )

  if (!data || !form) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-destructive">Visite introuvable.</p>
    </div>
  )

  const { visit }       = data
  const { bien, agent, agency } = visit.visit_schedule
  const client          = visit.client
  const isBusy          = isSubmitting || isDeleting || isConfirming
  // Permettre la modification des visites annulées/terminées, mais garder le statut en lecture seule
  const isStatusReadOnly = true
  const isFieldsReadOnly = false

  const update = (key: keyof FormState, value: string) =>
    setForm((prev) => prev ? { ...prev, [key]: value } : prev)

  console.log("VisitEditPage - data:", data) // Debug log to inspect the fetched data

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/visits/${visit.id}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">Modifier la visite</h1>
              {getStatusBadge(form.status)}
            </div>
            <p className="text-muted-foreground">{bien.title}</p>
          </div>
        </div>

        {/* Boutons header */}
        <div className="flex gap-2">
          {/* Confirmer — uniquement si en attente */}
          {form.status === "pending" && (
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent border-emerald-500 text-emerald-600 hover:bg-emerald-50"
              disabled={isBusy}
              onClick={handleConfirm}
            >
              {isConfirming
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Confirmation...</>
                : <><CheckCircle className="mr-2 h-4 w-4" />Confirmer la visite</>
              }
            </Button>
          )}

          {/* Annuler — si pas déjà annulée */}
          {form.status !== "cancelled" && (
            <Button
              variant="destructive"
              size="sm"
              disabled={isBusy}
              onClick={handleCancel}
            >
              {isDeleting
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Annulation...</>
                : <><Trash2 className="mr-2 h-4 w-4" />Annuler la visite</>
              }
            </Button>
          )}

          {/* Enregistrer — toujours disponible */}
          <Button size="sm" disabled={isBusy} onClick={handleSave}>
            {isSubmitting
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</>
              : <><Save className="mr-2 h-4 w-4" />Enregistrer</>
            }
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* ── Planification ── */}
        <Card>
          <CardHeader>
            <CardTitle>Planification</CardTitle>
            <CardDescription>Date et horaire de la visite</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Statut en lecture seule */}
            <div className="space-y-2">
              <Label>Statut</Label>
              <Input
                value={
                  form.status === "pending"   ? "En attente"
                  : form.status === "confirmed" ? "Confirmée"
                  : form.status === "completed" ? "Terminée"
                  : "Annulée"
                }
                disabled
                className="opacity-70"
              />
            </div>

            <div className="space-y-2">
              <Label>Date de visite</Label>
              <Input
                type="date"
                value={form.visit_date}
                disabled={isFieldsReadOnly}
                onChange={(e) => update("visit_date", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Heure de début</Label>
                <Input
                  type="time"
                  value={form.start_time}
                  disabled={isFieldsReadOnly}
                  onChange={(e) => update("start_time", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Heure de fin</Label>
                <Input
                  type="time"
                  value={form.end_time}
                  disabled={isFieldsReadOnly}
                  onChange={(e) => {
                    if (e.target.value <= form.start_time) return
                    update("end_time", e.target.value)
                  }}
                />
              </div>
            </div>

            {!isFieldsReadOnly && (
              <p className="text-xs text-muted-foreground">
                Vous pouvez modifier cette visite même si elle est {form.status === "completed" ? "terminée" : "annulée"}.
              </p>
            )}
          </CardContent>
        </Card>

        {/* ── Propriété (lecture seule) ── */}
        <Card>
          <CardHeader>
            <CardTitle>Propriété</CardTitle>
            <CardDescription>Informations sur le bien à visiter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input value={bien.title} disabled className="opacity-70" />
            </div>
            <div className="space-y-2">
              <Label>Adresse</Label>
              <Input
                value={`${bien.address}, ${bien.neighborhood}, ${bien.city}`}
                disabled
                className="opacity-70"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type de bien</Label>
                <Input value={bien.propertyType} disabled className="opacity-70 capitalize" />
              </div>
              <div className="space-y-2">
                <Label>Transaction</Label>
                <Input
                  value={bien.listingType === "rent" ? "À louer" : "À vendre"}
                  disabled
                  className="opacity-70"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Prix</Label>
              <Input
                value={`${Number(bien.price).toLocaleString("fr-FR")} FCFA${bien.listingType === "rent" ? " / mois" : ""}`}
                disabled
                className="opacity-70 font-medium"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              La propriété ne peut pas être modifiée. Créez une nouvelle visite si nécessaire.
            </p>
          </CardContent>
        </Card>

        {/* ── Client (lecture seule) ── */}
        <Card>
          <CardHeader>
            <CardTitle>Client</CardTitle>
            <CardDescription>Informations sur le client</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nom complet</Label>
              <Input value={`${client.prenom} ${client.nom}`} disabled className="opacity-70" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={client.user.email} disabled className="opacity-70" />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input value={client.phone} disabled className="opacity-70" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Les informations client ne peuvent pas être modifiées ici.
            </p>
          </CardContent>
        </Card>

        {/* ── Agent (lecture seule) ── */}
        <Card>
          <CardHeader>
            <CardTitle>Agent assigné</CardTitle>
            <CardDescription>Agent responsable de la visite</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{agent ? "Nom de l'agent" : "Nom de l'agence"}</Label>
              { agent ? (<Input value={`${agent.prenom} ${agent.nom}`} disabled className="opacity-70" />) : (<Input value={agency?.name} disabled className="opacity-70" />)}
              {/* <Input value={`${agent.prenom} ${agent.nom}`} disabled className="opacity-70" /> */}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={agent ? agent.email : agency?.email} disabled className="opacity-70" />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input value={agent ? agent.phone : agency?.phone} disabled className="opacity-70" />
              </div>
            </div>
            {agent ? (
              <div className="space-y-2">
                <Label>Rôle</Label>
                <Input
                      value={
                        agent.account_type === "agency_user" ? "Agent immobilier"
                        : agent.account_type === "super_admin" ? "Administrateur"
                        : agent.account_type
                      }
                      disabled
                      className="opacity-70"
                    />
              </div>
            ) : null}
                    
            <p className="text-xs text-muted-foreground">
              Pour changer d'agent, modifiez le créneau depuis le calendrier.
            </p>
          </CardContent>
        </Card>

        {/* ── Notes & Feedback ── */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Notes et retours</CardTitle>
            <CardDescription>Notes internes et compte rendu de visite</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Notes avant la visite</Label>
              <Textarea
                placeholder="Instructions pour l'agent, informations sur le client..."
                value={form.notes}
                disabled={isFieldsReadOnly}
                onChange={(e) => update("notes", e.target.value)}
                rows={5}
                
              />
              <p className="text-xs text-muted-foreground">Usage interne — non partagé avec le client</p>
            </div>
            <div className="space-y-2">
              <Label>Retours après la visite</Label>
              <Textarea
                placeholder="Compte rendu de la visite, intérêts du client, suite à donner..."
                value={form.feedback}
                // disabled={isReadOnly}
                onChange={(e) => update("feedback", e.target.value)}
                rows={5}
              />
              <p className="text-xs text-muted-foreground">À remplir après la visite</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}