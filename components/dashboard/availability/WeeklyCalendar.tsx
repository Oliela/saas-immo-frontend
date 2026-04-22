"use client"

import { useState } from "react"
import {
  Calendar, ChevronLeft, ChevronRight,
  Clock, Pencil, Trash2, Check, X, Loader2, AlertTriangle, Save, Ban,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import type { AvailabilitySlot, SlotFormData } from "./types"

const TIME_SLOTS = [
  "08:00","09:00","10:00","11:00","12:00",
  "13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00",
]
const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) =>
  `${String(i).padStart(2, "0")}:00`
)

// ── Date helpers ───────────────────────────────────────────────────────────

const todayStr = new Date().toISOString().split("T")[0]

const isDayPast = (day: Date): boolean => {
  const d = new Date(day); d.setHours(0, 0, 0, 0)
  const t = new Date();    t.setHours(0, 0, 0, 0)
  return d < t
}

const generateWeekDays = (baseDate: Date): Date[] => {
  const start = new Date(baseDate)
  start.setDate(baseDate.getDate() - baseDate.getDay())
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start); d.setDate(start.getDate() + i); return d
  })
}

const isSlotPast = (slot: AvailabilitySlot): boolean =>
  new Date(`${slot.visit_date}T${slot.end_time}`) < new Date()

// ── Couleurs par statut ────────────────────────────────────────────────────

const getSlotStyle = (slot: AvailabilitySlot) => {
  if (isSlotPast(slot))
    return "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
  switch (slot.status) {
    case "available":
      return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 cursor-pointer"
    case "unavailable":
      return "bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer border border-dashed border-slate-300"
    case "reserved":
      return "bg-amber-100 text-amber-800 hover:bg-amber-200 cursor-pointer"
    default:
      return ""
  }
}

// ── Vérifier si une journée entière est indisponible ──────────────────────

const isDayFullyUnavailable = (day: Date, slots: AvailabilitySlot[]): boolean => {
  const dateStr = day.toISOString().split("T")[0]
  const daySlots = slots.filter((s) => s.visit_date === dateStr)
  if (daySlots.length === 0) return false
  return daySlots.every((s) => s.status === "unavailable")
}

interface Props {
  slots: AvailabilitySlot[]
  currentWeek: Date
  setCurrentWeek: (d: Date) => void
  onEdit: (id: number, data: SlotFormData) => Promise<void>
  onDelete: (id: number) => Promise<void>
  onConfirm: (slot: AvailabilitySlot) => Promise<void>
  onCancel: (slot: AvailabilitySlot) => Promise<void>
}

export function WeeklyCalendar({
  slots, currentWeek, setCurrentWeek,
  onEdit, onDelete, onConfirm, onCancel,
}: Props) {
  const weekDays = generateWeekDays(currentWeek)

  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null)
  const [mode, setMode]                 = useState<"view" | "edit">("view")
  const [deleteOpen, setDeleteOpen]     = useState(false)
  const [editForm, setEditForm]         = useState<SlotFormData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError]               = useState<string | null>(null)

  const getSlotForCell = (day: Date, time: string): AvailabilitySlot[] => {
    const dateStr = day.toISOString().split("T")[0]
    return slots.filter((s) =>
      s.visit_date === dateStr && s.start_time <= time && s.end_time > time
    )
  }

  const navigateWeek = (dir: "prev" | "next") => {
    const d = new Date(currentWeek)
    d.setDate(d.getDate() + (dir === "next" ? 7 : -7))
    setCurrentWeek(d)
  }

  const openSlot = (slot: AvailabilitySlot) => {
    if (isSlotPast(slot)) return
    setSelectedSlot(slot); setMode("view"); setError(null)
  }

  const openEdit = () => {
    if (!selectedSlot) return
    setEditForm({
      bien_id:    selectedSlot.bien_id ? String(selectedSlot.bien_id) : "",
      visit_date: selectedSlot.visit_date,
      start_time: selectedSlot.start_time,
      end_time:   selectedSlot.end_time,
      agent_id:   selectedSlot.agent_id ? String(selectedSlot.agent_id) : "",
      agency_id:  String(selectedSlot.agency_id),
      status:     selectedSlot.status,
    })
    setError(null); setMode("edit")
  }

  const closeAll = () => {
    setSelectedSlot(null); setMode("view"); setEditForm(null); setError(null)
  }

  const handleSave = async () => {
    if (!editForm || !selectedSlot) return
    if (editForm.start_time >= editForm.end_time) {
      setError("L'heure de début doit être avant l'heure de fin."); return
    }
    setIsSubmitting(true); setError(null)
    try {
      await onEdit(selectedSlot.id, editForm)
      closeAll(); window.location.reload()
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message ?? "Une erreur est survenue.")
    } finally { setIsSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!selectedSlot) return
    setIsSubmitting(true); setError(null)
    try {
      await onDelete(selectedSlot.id)
      setDeleteOpen(false); closeAll(); window.location.reload()
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message ?? "Erreur lors de la suppression.")
    } finally { setIsSubmitting(false) }
  }

  const handleConfirm = async () => {
    if (!selectedSlot) return
    setIsSubmitting(true); setError(null)
    try {
      await onConfirm(selectedSlot); closeAll(); window.location.reload()
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message ?? "Erreur lors de la confirmation.")
    } finally { setIsSubmitting(false) }
  }

  const handleCancel = async () => {
    if (!selectedSlot) return
    setIsSubmitting(true); setError(null)
    try {
      await onCancel(selectedSlot); closeAll(); window.location.reload()
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message ?? "Erreur lors de l'annulation.")
    } finally { setIsSubmitting(false) }
  }

  const StatusBadge = ({ slot }: { slot: AvailabilitySlot }) => {
    switch (slot.status) {
      case "available":   return <Badge className="bg-emerald-100 text-emerald-800">Disponible</Badge>
      case "unavailable": return <Badge className="bg-slate-100 text-slate-600"><Ban className="mr-1 h-3 w-3" />Indisponible</Badge>
      case "reserved":    return <Badge className="bg-amber-100 text-amber-800">Réservé</Badge>
      default:            return null
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />Calendrier hebdomadaire
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigateWeek("prev")} className="bg-transparent">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[200px] text-center">
                {weekDays[0].toLocaleDateString("fr-FR", { month: "long", day: "numeric" })}
                {" – "}
                {weekDays[6].toLocaleDateString("fr-FR", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              <Button variant="outline" size="icon" onClick={() => navigateWeek("next")} className="bg-transparent">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">

              {/* Header jours */}
              <div className="grid grid-cols-8 border-b">
                <div className="p-3 text-sm font-medium text-muted-foreground">Heure</div>
                {weekDays.map((day, i) => {
                  const isToday     = day.toDateString() === new Date().toDateString()
                  const isPast      = isDayPast(day)
                  const fullyBlocked = isDayFullyUnavailable(day, slots)

                  return (
                    <div
                      key={i}
                      className={cn(
                        "p-3 text-center border-l select-none",
                        isToday        && "bg-primary/5",
                        isPast         && "bg-muted/50",
                        fullyBlocked   && !isPast && "bg-slate-100 dark:bg-slate-800/40",
                      )}
                    >
                      <div className={cn(
                        "text-xs",
                        isPast ? "text-muted-foreground/40" : "text-muted-foreground"
                      )}>
                        {day.toLocaleDateString("fr-FR", { weekday: "short" })}
                      </div>
                      <div className={cn(
                        "text-sm font-medium mt-0.5",
                        isToday      && "text-primary",
                        isPast       && "text-muted-foreground/30 line-through decoration-muted-foreground/30",
                        fullyBlocked && !isPast && "text-slate-400 line-through",
                      )}>
                        {day.getDate()}
                      </div>
                      {isPast && (
                        <div className="text-[9px] text-muted-foreground/30 mt-0.5 uppercase tracking-wide">passé</div>
                      )}
                      {fullyBlocked && !isPast && (
                        <div className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wide">indispo</div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Grille heures */}
              {TIME_SLOTS.map((time) => (
                <div key={time} className="grid grid-cols-8 border-b last:border-b-0">
                  <div className="p-3 text-sm text-muted-foreground border-r">{time}</div>
                  {weekDays.map((day, di) => {
                    const cellSlots  = getSlotForCell(day, time)
                    const isToday    = day.toDateString() === new Date().toDateString()
                    const isPast     = isDayPast(day)
                    const allUnavail = cellSlots.length > 0 && cellSlots.every((s) => s.status === "unavailable")

                    return (
                      <div
                        key={di}
                        className={cn(
                          "min-h-[60px] p-1 border-l relative",
                          isToday   && "bg-primary/5",
                          isPast    && "bg-muted/30",
                          allUnavail && !isPast && "bg-slate-50 dark:bg-slate-900/30",
                        )}
                      >
                        {/* Hachures pour les colonnes passées sans créneau */}
                        {isPast && cellSlots.length === 0 && (
                          <div
                            className="absolute inset-0 opacity-[0.06] pointer-events-none"
                            style={{
                              backgroundImage: "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)",
                              backgroundSize: "6px 6px",
                            }}
                          />
                        )}

                        {cellSlots.map((slot) => {
                          const past = isSlotPast(slot)
                          return (
                            <div
                              key={slot.id}
                              onClick={() => openSlot(slot)}
                              className={cn(
                                "text-xs p-1.5 rounded mb-1 transition-colors",
                                getSlotStyle(slot)
                              )}
                            >
                              <div className="font-medium truncate">
                                {slot.bien_id
                                  ? slot.propertyTitle.split(" ").slice(0, 2).join(" ")
                                  : "Agence"
                                }
                              </div>
                              <div className="text-[10px] opacity-75">
                                {slot.start_time} – {slot.end_time}
                              </div>
                              <div className={cn(
                                "text-[10px] font-medium mt-0.5",
                                past                            ? "text-muted-foreground"
                                  : slot.status === "available"   ? "text-emerald-600"
                                  : slot.status === "unavailable" ? "text-slate-500"
                                  : "text-amber-600"
                              )}>
                                {past                            ? "Passé"
                                  : slot.status === "available"   ? "Disponible"
                                  : slot.status === "unavailable" ? "Indisponible"
                                  : "Réservé"
                                }
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Légende */}
          <div className="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
              <span className="text-sm text-muted-foreground">Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />
              <span className="text-sm text-muted-foreground">Réservé</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-slate-100 border border-dashed border-slate-300" />
              <span className="text-sm text-muted-foreground">Indisponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-muted border" />
              <span className="text-sm text-muted-foreground">Passé</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Dialog détail / modification ── */}
      <Dialog open={!!selectedSlot} onOpenChange={(open) => { if (!open && !isSubmitting) closeAll() }}>
        <DialogContent className="sm:max-w-md">
          {selectedSlot && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {mode === "edit"                          ? <><Pencil className="h-5 w-5" />Modifier le créneau</>
                    : selectedSlot.status === "reserved"   ? <><Clock className="h-5 w-5" />Visite réservée</>
                    : selectedSlot.status === "unavailable" ? <><Ban className="h-5 w-5" />Créneau indisponible</>
                    : <><Clock className="h-5 w-5" />Créneau disponible</>
                  }
                </DialogTitle>
                <DialogDescription>{selectedSlot.propertyTitle}</DialogDescription>
              </DialogHeader>

              {/* Vue détail */}
              {mode === "view" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="font-medium mt-0.5">
                        {new Date(selectedSlot.visit_date).toLocaleDateString("fr-FR", {
                          weekday: "long", day: "numeric", month: "long",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Heure</p>
                      <p className="font-medium mt-0.5">{selectedSlot.start_time} – {selectedSlot.end_time}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Agent</p>
                      <p className="font-medium mt-0.5">{selectedSlot.agentName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Statut</p>
                      <div className="mt-0.5"><StatusBadge slot={selectedSlot} /></div>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                      <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <p className="text-xs text-destructive">{error}</p>
                    </div>
                  )}

                  {(selectedSlot.status === "available" || selectedSlot.status === "unavailable") && (
                    <div className="flex gap-2 pt-2 border-t">
                      <Button variant="outline" className="flex-1 bg-transparent" onClick={openEdit}>
                        <Pencil className="mr-2 h-4 w-4" />Modifier
                      </Button>
                      <Button variant="destructive" className="flex-1" onClick={() => setDeleteOpen(true)}>
                        <Trash2 className="mr-2 h-4 w-4" />Supprimer
                      </Button>
                    </div>
                  )}

                  {selectedSlot.status === "reserved" && (
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
                  )}
                </div>
              )}

              {/* Vue modification */}
              {mode === "edit" && editForm && (
                <>
                  <div className="space-y-4 py-2">

                    <div className="space-y-2">
                      <Label>Type de créneau</Label>
                      <Select
                        value={editForm.status}
                        disabled={isSubmitting || editForm.status === "reserved"}
                        onValueChange={(v: "available" | "unavailable") =>
                          setEditForm({ ...editForm, status: v })
                        }
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
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
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date — min = aujourd'hui pour bloquer les dates passées */}
                    <div className="space-y-2">
                      <Label>Date de visite *</Label>
                      <Input
                        type="date"
                        value={editForm.visit_date}
                        min={todayStr}
                        disabled={isSubmitting}
                        onChange={(e) => { setEditForm({ ...editForm, visit_date: e.target.value }); setError(null) }}
                      />
                    </div>

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

                  <DialogFooter className="gap-2">
                    <Button variant="outline" className="bg-transparent" disabled={isSubmitting}
                      onClick={() => { setMode("view"); setError(null) }}>
                      Retour
                    </Button>
                    <Button onClick={handleSave} disabled={isSubmitting}>
                      {isSubmitting
                        ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</>
                        : <><Save className="mr-2 h-4 w-4" />Enregistrer</>
                      }
                    </Button>
                  </DialogFooter>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── AlertDialog suppression ── */}
      <AlertDialog open={deleteOpen} onOpenChange={(o) => { if (!isSubmitting) setDeleteOpen(o) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce créneau ?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium">{selectedSlot?.propertyTitle}</span> —{" "}
              {selectedSlot && new Date(selectedSlot.visit_date).toLocaleDateString("fr-FR", {
                weekday: "long", day: "numeric", month: "long",
              })}{" "}
              ({selectedSlot?.start_time} – {selectedSlot?.end_time}). Cette action est irréversible.
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