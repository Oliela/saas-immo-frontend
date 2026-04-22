"use client"

import Link from "next/link"
import { ArrowLeft, Plus, AlertTriangle, Loader2, ServerCrash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { SlotFormData, AdaptedAgent, AdaptedProperty } from "./types"

interface Props {
  isDialogOpen: boolean
  setIsDialogOpen: (open: boolean) => void
  formData: SlotFormData
  setFormData: (data: SlotFormData) => void
  formErrors: Record<string, string>
  setFormErrors: (errors: Record<string, string>) => void
  overlapWarning: string | null
  serverError: string | null
  isSubmitting: boolean
  onSubmit: () => void
  onReset: () => void
  agents: AdaptedAgent[]
  properties: AdaptedProperty[]
}

export function AvailabilityHeader({
  isDialogOpen, setIsDialogOpen,
  formData, setFormData, formErrors, setFormErrors,
  overlapWarning, serverError, isSubmitting,
  onSubmit, onReset,
  agents, properties,
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="bg-transparent">
          <Link href="/dashboard/calendar"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Créneaux de Disponibilité</h1>
          <p className="text-muted-foreground">Gérer la disponibilité des visites pour les propriétés</p>
        </div>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (isSubmitting) return
          setIsDialogOpen(open)
          if (!open) onReset()
        }}
      >
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />Ajouter un Créneau
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter un Créneau</DialogTitle>
            <DialogDescription>
              Créer un créneau de disponibilité ou bloquer une date.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">

            {/* Type de créneau */}
            <div className="space-y-2">
              <Label>Type de créneau *</Label>
              <Select
                value={formData.status}
                disabled={isSubmitting}
                onValueChange={(v: "available" | "unavailable") =>
                  setFormData({ ...formData, status: v })
                }
              >
                <SelectTrigger className={cn(formErrors.status && "border-destructive")}>
                  <SelectValue placeholder="Choisir le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                      Disponible pour visite
                    </div>
                  </SelectItem>
                  <SelectItem value="unavailable">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-slate-400 inline-block" />
                      Indisponible (griser la date)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {formErrors.status && <p className="text-xs text-destructive">{formErrors.status}</p>}
            </div>

            {/* Bien — optionnel */}
            <div className="space-y-2">
              <Label>
                Propriété
                <span className="ml-1 text-xs text-muted-foreground">
                  (optionnel — laisser vide pour toute l'agence)
                </span>
              </Label>
              <Select
                value={formData.bien_id || "none"}
                disabled={isSubmitting}
                onValueChange={(v) => {
                  setFormData({ ...formData, bien_id: v === "none" ? "" : v })
                  setFormErrors({ ...formErrors, bien_id: "" })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toute l'agence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Toute l'agence</SelectItem>
                  {properties.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label>Date *</Label>
              <Input
                type="date"
                value={formData.visit_date}
                min={new Date().toISOString().split("T")[0]}
                disabled={isSubmitting}
                onChange={(e) => {
                  setFormData({ ...formData, visit_date: e.target.value })
                  setFormErrors({ ...formErrors, visit_date: "" })
                }}
                className={cn(formErrors.visit_date && "border-destructive")}
              />
              {formErrors.visit_date && <p className="text-xs text-destructive">{formErrors.visit_date}</p>}
            </div>

            {/* Heures */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Heure de début *</Label>
                <Input
                  type="time"
                  value={formData.start_time}
                  disabled={isSubmitting}
                  onChange={(e) => {
                    setFormData({ ...formData, start_time: e.target.value })
                    setFormErrors({ ...formErrors, start_time: "" })
                  }}
                  className={cn(formErrors.start_time && "border-destructive")}
                />
                {formErrors.start_time && <p className="text-xs text-destructive">{formErrors.start_time}</p>}
              </div>
              <div className="space-y-2">
                <Label>Heure de fin *</Label>
                <Input
                  type="time"
                  value={formData.end_time}
                  disabled={isSubmitting}
                  onChange={(e) => {
                    setFormData({ ...formData, end_time: e.target.value })
                    setFormErrors({ ...formErrors, end_time: "" })
                  }}
                  className={cn(formErrors.end_time && "border-destructive")}
                />
                {formErrors.end_time && <p className="text-xs text-destructive">{formErrors.end_time}</p>}
              </div>
            </div>

            {/* Agent — optionnel */}
            <div className="space-y-2">
              <Label>
                Agent assigné
                <span className="ml-1 text-xs text-muted-foreground">(optionnel)</span>
              </Label>
              <Select
                value={formData.agent_id || "none"}
                disabled={isSubmitting}
                onValueChange={(v) => {
                  setFormData({ ...formData, agent_id: v === "none" ? "" : v })
                  setFormErrors({ ...formErrors, agent_id: "" })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Aucun agent spécifique" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Aucun agent spécifique</SelectItem>
                  {agents.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Chevauchement */}
            {overlapWarning && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Créneau chevauchant détecté</p>
                  <p className="text-xs text-amber-700">{overlapWarning}</p>
                </div>
              </div>
            )}

            {/* Erreur serveur */}
            {serverError && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <ServerCrash className="h-5 w-5 text-destructive shrink-0" />
                <div>
                  <p className="text-sm font-medium text-destructive">Erreur serveur</p>
                  <p className="text-xs text-destructive/80">{serverError}</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="bg-transparent"
              disabled={isSubmitting}
              onClick={() => { onReset(); setIsDialogOpen(false) }}
            >
              Annuler
            </Button>
            <Button
              onClick={onSubmit}
              disabled={!!overlapWarning || isSubmitting}
              className={cn(
                formData.status === "unavailable" && "bg-slate-600 hover:bg-slate-700"
              )}
            >
              {isSubmitting
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</>
                : formData.status === "unavailable"
                  ? "Bloquer ce créneau"
                  : "Créer le créneau"
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}