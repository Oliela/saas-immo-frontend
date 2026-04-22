"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Calendar, Clock, CalendarCheck, LogIn, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import axiosInstance from "@/lib/axios"
import type { BienDetail } from "@/types/bienDetailsType"
import Link from "next/link"

// ─── Types ────────────────────────────────────────────────────────────────────

interface AgencyCreneau {
  id: number
  bien_id: number | null
  agent_id: number | null
  agency_id: number
  visit_date: string       // "YYYY-MM-DD"
  start_time: string       // "HH:MM:SS"
  end_time: string         // "HH:MM:SS"
  status: "available" | "reserved" | "unavailable"
}

interface ScheduleVisitDialogProps {
  propertyTitle: string
  bien: BienDetail
  user: any | null
  children: React.ReactNode
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
]

const generateDates = (): Date[] => {
  const dates: Date[] = []
  const today = new Date()
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push(date)
  }
  return dates
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toTimeString = (t: string) => (t.length === 5 ? `${t}:00` : t)

const addOneHour = (t: string) => {
  const [h, m] = t.split(":").map(Number)
  const end = new Date(0, 0, 0, h + 1, m)
  return `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}:00`
}

const formatDateISO = (date: Date) => date.toISOString().split("T")[0]

const formatDate = (date: Date) =>
  date.toLocaleDateString("fr-FR", { weekday: "short", month: "short", day: "numeric" })

// ─── Hook : charge les créneaux de l'agence ────────────────────────────────────

function useAgencyCreneaux(agencyId: number | undefined, open: boolean) {
  const [creneaux, setCreneaux] = useState<AgencyCreneau[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !agencyId) return
    setLoading(true)
    axiosInstance
      .get(`/api/visit-schedules/agency/${agencyId}`)
      .then((res) => {
        // L'API retourne { creneaux: [...], stats: {...} }
        const data = res.data?.creneaux ?? res.data ?? []
        setCreneaux(Array.isArray(data) ? data : [])
      })
      .catch(() => setCreneaux([]))
      .finally(() => setLoading(false))
  }, [open, agencyId])

  return { creneaux, loading }
}

// ─── Logique de grisage ────────────────────────────────────────────────────────

function useBlockedSlots(
  creneaux: AgencyCreneau[],
  bienId: number,
  selectedDate: Date | null
) {
  // Aucune date n'est jamais entièrement bloquée —
  // on laisse toujours le client choisir une date,
  // et on grise uniquement les heures concernées.
  const blockedDates = useMemo(() => new Set<string>(), [])

  // Heures bloquées pour la date sélectionnée :
  // si un créneau reserved/unavailable couvre 10h-12h,
  // on bloque exactement 10h et 11h (les slots dans la plage).
  const blockedTimes = useMemo(() => {
    if (!selectedDate) return new Set<string>()
    const dateStr = formatDateISO(selectedDate)
    const blocked = new Set<string>()

    creneaux
      .filter((c) => {
        const creneauDate = c.visit_date.split("T")[0]
        if (creneauDate !== dateStr) return false
        // Concerne ce bien OU toute l'agence (bien_id null)
        if (c.bien_id !== null && c.bien_id !== bienId) return false
        return c.status === "unavailable" || c.status === "reserved"
      })
      .forEach((c) => {
        const startH = parseInt(c.start_time.split(":")[0])
        const endH = parseInt(c.end_time.split(":")[0])
        ALL_TIME_SLOTS.forEach((slot) => {
          const slotH = parseInt(slot.split(":")[0])
          // Bloquer le slot si son heure est dans la plage [startH, endH[
          if (slotH >= startH && slotH < endH) blocked.add(slot)
        })
      })

    return blocked
  }, [creneaux, selectedDate, bienId])

  return { blockedDates, blockedTimes }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ScheduleVisitDialog({
  propertyTitle,
  bien,
  user,
  children,
}: ScheduleVisitDialogProps) {

  const [open, setOpen] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dates = useMemo(() => generateDates(), [])

  // ── Créneaux de l'agence ────────────────────────────────────────────────────
  const { creneaux, loading: loadingCreneaux } = useAgencyCreneaux(bien.agency_id, open)
  const { blockedDates, blockedTimes } = useBlockedSlots(creneaux, bien.id, selectedDate)
  console.log("creneaux", creneaux, "blockedTimes", blockedTimes)
  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleTriggerClick = () => {
    if (!user) setShowLoginPrompt(true)
    else setOpen(true)
  }

  const handleDateSelect = (date: Date) => {
    // Ne pas sélectionner une date bloquée
    if (blockedDates.has(formatDateISO(date))) return
    setSelectedDate(date)
    // Reset heure si elle devient bloquée
    if (selectedTime && blockedTimes.has(selectedTime)) setSelectedTime(null)
  }
  // console.log("bien", bien, "user", user)
  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) return
    setIsSubmitting(true)
    setError(null)
    // console.log("Submitting visit scheduling with data:", {
    //   agency_id: bien.agency_id,
    //   bien_id: bien.id,
    //   agent_id: bien.agence.agent_id ?? null,
    //   client_id: user.profile.id,
    //   visit_date: formatDateISO(selectedDate),
    //   start_time: toTimeString(selectedTime),
    //   end_time: addOneHour(selectedTime),
    //   message,
    //   status: "pending",
    // })
    try {
      await axiosInstance.post("/api/visit-reservations", {
        agency_id: bien.agency_id,
        bien_id: bien.id,
        // agent_id: creneaux?.agent_id ?? null,
        client_id: user.profile.id,
        visit_date: formatDateISO(selectedDate),
        start_time: toTimeString(selectedTime),
        end_time: addOneHour(selectedTime),
        message,
        status: "pending",
      })
      setIsSuccess(true)
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Une erreur est survenue. Veuillez réessayer."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setSelectedDate(null)
    setSelectedTime(null)
    setMessage("")
    setIsSuccess(false)
    setError(null)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) setTimeout(resetForm, 200)
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Trigger */}
      <span onClick={handleTriggerClick} style={{ display: "contents" }}>
        {children}
      </span>

      {/* Dialog — connexion requise */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent className="max-w-sm" aria-describedby={undefined}>
          <DialogHeader>
            <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <CalendarCheck className="h-7 w-7 text-primary" />
            </div>
            <DialogTitle className="text-center">Connexion requise</DialogTitle>
            <DialogDescription className="text-center">
              Vous devez être connecté pour planifier une visite.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-2">
            <Button asChild className="w-full">
              <Link href="/login" onClick={() => setShowLoginPrompt(false)}>
                <LogIn className="mr-2 h-4 w-4" />
                Se connecter
              </Link>
            </Button>
            <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowLoginPrompt(false)}>
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog — planification */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg">
          {isSuccess ? (

            /* ── Succès ── */
            <>
              <DialogHeader className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <CalendarCheck className="h-8 w-8 text-emerald-600" />
                </div>
                <DialogTitle className="text-xl">Visite planifiée !</DialogTitle>
                <DialogDescription className="text-center">
                  Votre visite est planifiée pour{" "}
                  <span className="font-semibold text-foreground">
                    {selectedDate && formatDate(selectedDate)} à {selectedTime}
                  </span>
                  . Vous recevrez une confirmation prochainement.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-center">
                <Button onClick={() => handleOpenChange(false)}>Terminé</Button>
              </DialogFooter>
            </>

          ) : (

            /* ── Formulaire ── */
            <>
              <DialogHeader>
                <DialogTitle>Planifier une visite</DialogTitle>
                <DialogDescription>
                  Réservez une visite pour{" "}
                  <span className="font-medium text-foreground">{propertyTitle}</span>
                </DialogDescription>
              </DialogHeader>

              {/* Infos client */}
              {user && (
                <div className="rounded-lg bg-muted px-4 py-3 text-sm space-y-0.5">
                  <p className="font-medium text-foreground">{user.nom} {user.prenom}</p>
                  <p className="text-muted-foreground">{user.email}</p>
                  {user.phone && <p className="text-muted-foreground">{user.phone}</p>}
                </div>
              )}

              {/* Loader créneaux */}
              {loadingCreneaux && (
                <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Chargement des disponibilités...
                </div>
              )}

              {/* Étapes */}
              <div className="flex items-center justify-center gap-2 py-2">
                {[1, 2].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                      step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      {s}
                    </div>
                    {s < 2 && (
                      <div className={cn(
                        "h-1 w-12 rounded-full transition-colors",
                        step > s ? "bg-primary" : "bg-muted"
                      )} />
                    )}
                  </div>
                ))}
              </div>

              {step === 1 ? (

                /* ── Étape 1 : date + heure ── */
                <div className="space-y-6">

                  {/* Sélection date */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Choisir une date
                    </Label>
                    <div className="grid grid-cols-4 gap-2 max-h-[160px] overflow-y-auto">
                      {dates.map((date) => {
                        const dateStr = formatDateISO(date)
                        const isBlocked = blockedDates.has(dateStr)
                        const isSelected = selectedDate?.toDateString() === date.toDateString()

                        return (
                          <button
                            key={date.toISOString()}
                            onClick={() => handleDateSelect(date)}
                            disabled={isBlocked}
                            title={isBlocked ? "Date non disponible" : undefined}
                            className={cn(
                              "p-2 rounded-lg text-center transition-colors border relative",
                              isSelected && !isBlocked
                                ? "bg-primary text-primary-foreground border-primary"
                                : isBlocked
                                  ? "bg-muted/50 border-border opacity-40 cursor-not-allowed line-through decoration-muted-foreground/60"
                                  : "bg-card border-border hover:bg-muted cursor-pointer"
                            )}
                          >
                            <div className="text-xs font-medium">
                              {date.toLocaleDateString("fr-FR", { weekday: "short" })}
                            </div>
                            <div className="text-lg font-bold">{date.getDate()}</div>
                            <div className="text-xs">
                              {date.toLocaleDateString("fr-FR", { month: "short" })}
                            </div>
                            {isBlocked && (
                              <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                                <div
                                  className="w-full h-full opacity-20"
                                  style={{
                                    backgroundImage: "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)",
                                    backgroundSize: "5px 5px",
                                  }}
                                />
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>

                    {/* Légende */}
                    {!loadingCreneaux && creneaux.length > 0 && (
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                        <div className="flex items-center gap-1.5">
                          <div className="h-3 w-3 rounded border border-border bg-card" />
                          Disponible
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="h-3 w-3 rounded border border-border bg-muted/50 opacity-40" />
                          Indisponible
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sélection heure */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Choisir une heure
                      {selectedDate && (
                        <span className="text-xs text-muted-foreground font-normal ml-1">
                          — {formatDate(selectedDate)}
                        </span>
                      )}
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {ALL_TIME_SLOTS.map((time) => {
                        const isBlocked = !!selectedDate && blockedTimes.has(time)
                        const isSelected = selectedTime === time

                        return (
                          <button
                            key={time}
                            onClick={() => !isBlocked && setSelectedTime(time)}
                            disabled={isBlocked || !selectedDate}
                            title={
                              !selectedDate ? "Sélectionnez d'abord une date"
                                : isBlocked ? "Créneau non disponible"
                                  : undefined
                            }
                            className={cn(
                              "p-2 rounded-lg text-sm font-medium transition-colors border relative",
                              isSelected && !isBlocked
                                ? "bg-primary text-primary-foreground border-primary"
                                : isBlocked
                                  ? "bg-muted/40 border-border text-muted-foreground/40 cursor-not-allowed line-through"
                                  : !selectedDate
                                    ? "bg-card border-border text-muted-foreground/50 cursor-not-allowed"
                                    : "bg-card border-border hover:bg-muted cursor-pointer"
                            )}
                          >
                            {time}
                            {isBlocked && (
                              <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-destructive/60" />
                            )}
                          </button>
                        )
                      })}
                    </div>

                    {/* Info si aucun créneau disponible sur la date */}
                    {selectedDate && !loadingCreneaux && blockedTimes.size === ALL_TIME_SLOTS.length && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        Aucun horaire disponible ce jour — veuillez choisir une autre date.
                      </p>
                    )}
                  </div>
                </div>

              ) : (

                /* ── Étape 2 : message + recap ── */
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="message">Message (optionnel)</Label>
                    <Textarea
                      id="message"
                      placeholder="Questions ou demandes particulières..."
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <div className="p-3 bg-muted rounded-lg space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Récapitulatif</p>
                    <p className="font-medium text-foreground">{propertyTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedDate && formatDate(selectedDate)} à {selectedTime}
                    </p>
                  </div>

                  {error && (
                    <p className="text-xs text-destructive">{error}</p>
                  )}
                </div>
              )}

              <DialogFooter className="gap-2 sm:gap-0">
                {step === 2 && (
                  <Button variant="outline" onClick={() => setStep(1)} className="bg-transparent">
                    Retour
                  </Button>
                )}
                {step === 1 ? (
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!selectedDate || !selectedTime}
                  >
                    Continuer
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting
                      ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Planification...</>
                      : "Confirmer la réservation"
                    }
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}