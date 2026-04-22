"use client"

import { useState } from "react"
import {
  Clock, Calendar, Building2, Check, Edit2, Trash2,
  User, Pencil, Save, X, Loader2, AlertTriangle, Ban,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { AvailabilitySlot, SlotFormData, AdaptedAgent } from "./types"

const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) =>
  `${String(i).padStart(2, "0")}:00`
)

const isSlotPast = (slot: AvailabilitySlot): boolean =>
  new Date(`${slot.visit_date}T${slot.end_time}`) < new Date()

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "short", month: "short", day: "numeric",
  })

interface Props {
  slots: AvailabilitySlot[]
  agents: AdaptedAgent[]
  onEdit: (id: number, data: SlotFormData) => Promise<void>
  onDelete: (id: number) => Promise<void>
  onConfirm: (slot: AvailabilitySlot) => Promise<void>
  onCancel: (slot: AvailabilitySlot) => Promise<void>
}

export function AvailabilityTable({ slots, agents, onEdit, onDelete, onConfirm, onCancel }: Props) {

  // ── State dialogs ──────────────────────────────────────────────────────────
  const [editSlot, setEditSlot]         = useState<AvailabilitySlot | null>(null)
  const [actionSlot, setActionSlot]     = useState<AvailabilitySlot | null>(null)
  const [deleteSlot, setDeleteSlot]     = useState<AvailabilitySlot | null>(null)
  const [editForm, setEditForm]         = useState<SlotFormData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError]               = useState<string | null>(null)

  // ── Ouvrir dialogs ─────────────────────────────────────────────────────────

  const openEdit = (slot: AvailabilitySlot) => {
    setEditForm({
      bien_id:    slot.bien_id ? String(slot.bien_id) : "",
      visit_date: slot.visit_date,
      start_time: slot.start_time,
      end_time:   slot.end_time,
      agent_id:   slot.agent_id ? String(slot.agent_id) : "",
      agency_id:  String(slot.agency_id),
      status:     slot.status === "reserved" ? "reserved" : slot.status,
    })
    setError(null)
    setEditSlot(slot)
  }

  const openAction = (slot: AvailabilitySlot) => {
    setError(null)
    setActionSlot(slot)
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!editForm || !editSlot) return
    if (editForm.start_time >= editForm.end_time) {
      setError("L'heure de début doit être avant l'heure de fin.")
      return
    }
    setIsSubmitting(true); setError(null)
    try {
      await onEdit(editSlot.id, editForm)
      setEditSlot(null)
      window.location.reload()
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message ?? "Une erreur est survenue.")
    } finally { setIsSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!deleteSlot) return
    setIsSubmitting(true)
    try {
      await onDelete(deleteSlot.id)
      setDeleteSlot(null)
      window.location.reload()
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message ?? "Erreur lors de la suppression.")
    } finally { setIsSubmitting(false) }
  }

  const handleConfirm = async () => {
    if (!actionSlot) return
    setIsSubmitting(true); setError(null)
    try {
      await onConfirm(actionSlot)
      setActionSlot(null)
      window.location.reload()
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message ?? "Erreur lors de la confirmation.")
    } finally { setIsSubmitting(false) }
  }

  const handleCancel = async () => {
    if (!actionSlot) return
    setIsSubmitting(true); setError(null)
    try {
      await onCancel(actionSlot)
      setActionSlot(null)
      window.location.reload()
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message ?? "Erreur lors de l'annulation.")
    } finally { setIsSubmitting(false) }
  }

  // ── Badge helper ───────────────────────────────────────────────────────────

  const StatusBadge = ({ slot }: { slot: AvailabilitySlot }) => {
    const past = isSlotPast(slot)
    if (past) {
      return (
        <Badge className="bg-muted text-muted-foreground">Passé</Badge>
      )
    }
    switch (slot.status) {
      case "available":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
            <Check className="mr-1 h-3 w-3" />Disponible
          </Badge>
        )
      case "unavailable":
        return (
          <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100">
            <Ban className="mr-1 h-3 w-3" />Indisponible
          </Badge>
        )
      case "reserved":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <Clock className="mr-1 h-3 w-3" />Réservé
          </Badge>
        )
      default:
        return null
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />Tous les créneaux
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Propriété</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Heure</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slots.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Aucun créneau trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  slots.map((slot) => {
                    const past  = isSlotPast(slot)
                    const agent = agents.find((a) => a.id === String(slot.agent_id))

                    return (
                      <TableRow
                        key={slot.id}
                        className={cn(
                          past && "opacity-60",
                          slot.status === "unavailable" && !past && "bg-slate-50/50 dark:bg-slate-900/20"
                        )}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{slot.propertyTitle}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(slot.visit_date)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {slot.start_time} – {slot.end_time}
                          </div>
                        </TableCell>
                        <TableCell>
                          {slot.agent_id ? (
                            <div className="flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                                {agent?.name
                                  ? agent.name.charAt(0).toUpperCase()
                                  : <User className="h-3 w-3" />
                                }
                              </div>
                              <span>{slot.agentName}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <StatusBadge slot={slot} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Disponible ou indisponible → Modifier + Supprimer */}
                            {!past && (slot.status === "available" || slot.status === "unavailable") && (
                              <>
                                <Button variant="ghost" size="icon" className="bg-transparent"
                                  onClick={() => openEdit(slot)}>
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon"
                                  className="text-destructive hover:text-destructive bg-transparent"
                                  onClick={() => setDeleteSlot(slot)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {/* Réservé → Gérer */}
                            {!past && slot.status === "reserved" && (
                              <Button variant="outline" size="sm" className="bg-transparent"
                                onClick={() => openAction(slot)}>
                                Gérer
                              </Button>
                            )}
                            {/* Passé → rien */}
                            {past && (
                              <span className="text-xs text-muted-foreground pr-2">—</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ── Dialog modification ── */}
      <Dialog open={!!editSlot} onOpenChange={(o) => { if (!o && !isSubmitting) { setEditSlot(null); setError(null) } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />Modifier le créneau
            </DialogTitle>
            <DialogDescription>{editSlot?.propertyTitle}</DialogDescription>
          </DialogHeader>
          {editForm && (
            <div className="space-y-4 py-2">

              {/* Statut */}
              <div className="space-y-2">
                <Label>Type de créneau</Label>
                <Select
                  value={editForm.status}
                  disabled={isSubmitting || editForm.status === "reserved"}
                  onValueChange={(v: "available" | "unavailable") =>
                    setEditForm({ ...editForm, status: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
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
                        Indisponible (date grisée)
                      </div>
                    </SelectItem>
                    {editForm.status === "reserved" && (
                      <SelectItem value="reserved" disabled>
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-amber-400 inline-block" />
                          Réservé
                        </div>
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label>Date de visite *</Label>
                <Input type="date" value={editForm.visit_date} disabled={isSubmitting}
                  onChange={(e) => { setEditForm({ ...editForm, visit_date: e.target.value }); setError(null) }} />
              </div>

              {/* Heures */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Heure de début *</Label>
                  <Select value={editForm.start_time} disabled={isSubmitting}
                    onValueChange={(v) => { setEditForm({ ...editForm, start_time: v }); setError(null) }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Heure de fin *</Label>
                  <Select value={editForm.end_time} disabled={isSubmitting}
                    onValueChange={(v) => { setEditForm({ ...editForm, end_time: v }); setError(null) }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-xs text-destructive">{error}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" className="bg-transparent" disabled={isSubmitting}
              onClick={() => { setEditSlot(null); setError(null) }}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</>
                : <><Save className="mr-2 h-4 w-4" />Enregistrer</>
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog gérer réservation ── */}
      <Dialog open={!!actionSlot} onOpenChange={(o) => { if (!o && !isSubmitting) { setActionSlot(null); setError(null) } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />Gérer la réservation
            </DialogTitle>
            <DialogDescription>{actionSlot?.propertyTitle}</DialogDescription>
          </DialogHeader>
          {actionSlot && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium mt-0.5">
                    {new Date(actionSlot.visit_date).toLocaleDateString("fr-FR", {
                      weekday: "long", day: "numeric", month: "long",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Heure</p>
                  <p className="font-medium mt-0.5">{actionSlot.start_time} – {actionSlot.end_time}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Agent</p>
                  <p className="font-medium mt-0.5">{actionSlot.agentName}</p>
                </div>
              </div>
              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-xs text-destructive">{error}</p>
                </div>
              )}
              <div className="flex gap-2 pt-2 border-t">
                <Button className="flex-1" disabled={isSubmitting} onClick={handleConfirm}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                  Confirmer
                </Button>
                <Button variant="destructive" className="flex-1" disabled={isSubmitting} onClick={handleCancel}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
                  Annuler réservation
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── AlertDialog suppression ── */}
      <AlertDialog open={!!deleteSlot} onOpenChange={(o) => { if (!isSubmitting) setDeleteSlot(o ? deleteSlot : null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce créneau ?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium">{deleteSlot?.propertyTitle}</span> —{" "}
              {deleteSlot && new Date(deleteSlot.visit_date).toLocaleDateString("fr-FR", {
                weekday: "long", day: "numeric", month: "long",
              })}{" "}
              ({deleteSlot?.start_time} – {deleteSlot?.end_time}). Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent" disabled={isSubmitting}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isSubmitting
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Suppression...</>
                : <><Trash2 className="mr-2 h-4 w-4" />Supprimer</>
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}