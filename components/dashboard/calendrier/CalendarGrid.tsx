"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Filter, User, Clock, MapPin, Ban, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Creneau, agentFullName, formatTime } from "@/types/creneau"

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7)
const MONTH_NAMES = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
]

interface CalendarGridProps { creneaux?: Creneau[] }

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDateKey = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

const getDaysInMonth = (date: Date): (number | null)[] => {
  const year = date.getFullYear(), month = date.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days: (number | null)[] = Array(firstDay).fill(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)
  return days
}

const getWeekDays = (date: Date): Date[] => {
  const start = new Date(date)
  start.setDate(date.getDate() - date.getDay())
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start); d.setDate(start.getDate() + i); return d
  })
}

const isPast = (creneau: Creneau): boolean =>
  new Date(`${creneau.visit_date}T${creneau.end_time}`) < new Date()

const isDayPast = (dateKey: string): boolean => {
  const d = new Date(dateKey); d.setHours(0, 0, 0, 0)
  const t = new Date();       t.setHours(0, 0, 0, 0)
  return d < t
}

// ── Style flexible selon statut ───────────────────────────────────────────────

const getCreneauStyle = (creneau: Creneau) => {
  if (isPast(creneau))
    return "bg-muted text-muted-foreground opacity-40 cursor-default"
  switch (creneau.status) {
    case "unavailable":
      return "bg-slate-100 text-slate-500 border border-dashed border-slate-300 dark:bg-slate-800/40"
    case "reserved": {
      const confirmed = creneau.reservations?.[0]?.status === "confirmed"
      return confirmed
        ? "bg-primary/20 text-primary"
        : "bg-amber-500/20 text-amber-700"
    }
    case "available":
    default:
      return "bg-emerald-500/20 text-emerald-700 border border-dashed border-emerald-500"
  }
}

// ── Label court pour une cellule calendrier ───────────────────────────────────

const slotShortLabel = (c: Creneau) => {
  if (c.status === "unavailable") return c.bien?.title ?? "Indisponible"
  return c.bien?.title ?? (c.agency?.name ?? "Agence")
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CalendarGrid({ creneaux = [] }: CalendarGridProps) {

  const TODAY = new Date().toLocaleDateString("en-CA")
  const todayDate = new Date(TODAY)

  const [currentDate, setCurrentDate] = useState(
    new Date(todayDate.getFullYear(), todayDate.getMonth(), 1)
  )
  const [view, setView]               = useState<"month" | "week">("month")
  const [selectedCreneau, setSelectedCreneau] = useState<Creneau | null>(null)
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "reserved" | "unavailable">("all")
  const [agentFilter, setAgentFilter]   = useState("all")

  // ── Navigation ─────────────────────────────────────────────────────────────

  const navigatePrev = () => {
    if (view === "month")
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    else { const d = new Date(currentDate); d.setDate(d.getDate() - 7); setCurrentDate(d) }
  }

  const navigateNext = () => {
    if (view === "month")
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    else { const d = new Date(currentDate); d.setDate(d.getDate() + 7); setCurrentDate(d) }
  }

  const goToToday = () =>
    setCurrentDate(new Date(todayDate.getFullYear(), todayDate.getMonth(), 1))

  // ── Agents uniques (en incluant les créneaux sans agent) ───────────────────

  const uniqueAgents = Array.from(
    new Map(
      creneaux
        .filter((c) => c?.agent != null)
        .map((c) => [c.agent!.id, c.agent!])
    ).values()
  )

  // ── Filtrage flexible ──────────────────────────────────────────────────────

  const getCreneauxForDate = (dateKey: string): Creneau[] =>
    creneaux.filter((c) => {
      if (c.visit_date !== dateKey) return false
      if (statusFilter !== "all" && c.status !== statusFilter) return false
      if (agentFilter !== "all") {
        // créneau sans agent : inclure seulement si "all"
        if (!c.agent) return false
        if (String(c.agent.id) !== agentFilter) return false
      }
      return true
    })

  const isToday = (dateKey: string) => dateKey === TODAY
  const days = getDaysInMonth(currentDate)
  const weekDays = getWeekDays(currentDate)

  // ── Vérifier si un jour est entièrement indispo ────────────────────────────

  const isDayFullyUnavailable = (dateKey: string): boolean => {
    const daySlots = creneaux.filter((c) => c.visit_date === dateKey)
    if (daySlots.length === 0) return false
    return daySlots.every((c) => c.status === "unavailable")
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Navigation */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" onClick={navigatePrev} className="bg-transparent">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={navigateNext} className="bg-transparent">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                {view === "month"
                  ? `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                  : `Semaine du ${weekDays[0].toLocaleDateString("fr-FR", { month: "short", day: "numeric" })} – ${weekDays[6].toLocaleDateString("fr-FR", { month: "short", day: "numeric", year: "numeric" })}`
                }
              </h2>
              <Button variant="ghost" size="sm" onClick={goToToday}>Aujourd'hui</Button>
            </div>

            {/* Filtres + vue */}
            <div className="flex flex-wrap items-center gap-3">
              <Tabs value={view} onValueChange={(v) => setView(v as "month" | "week")}>
                <TabsList>
                  <TabsTrigger value="month">Mois</TabsTrigger>
                  <TabsTrigger value="week">Semaine</TabsTrigger>
                </TabsList>
              </Tabs>

              <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" /><SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les créneaux</SelectItem>
                  <SelectItem value="available">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                      Disponibles
                    </div>
                  </SelectItem>
                  <SelectItem value="reserved">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-400 inline-block" />
                      Réservés
                    </div>
                  </SelectItem>
                  <SelectItem value="unavailable">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-slate-400 inline-block" />
                      Indisponibles
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={agentFilter} onValueChange={setAgentFilter}>
                <SelectTrigger className="w-[170px]">
                  <User className="mr-2 h-4 w-4" /><SelectValue placeholder="Tous les agents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les agents</SelectItem>
                  {uniqueAgents.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)}>{agentFullName(a)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Légende */}
          <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-border">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-3 w-3 rounded bg-primary" />
              <span className="text-muted-foreground">Confirmée</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-3 w-3 rounded bg-amber-500" />
              <span className="text-muted-foreground">En attente</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-3 w-3 rounded-full border-2 border-emerald-500 bg-emerald-500/20" />
              <span className="text-muted-foreground">Disponible</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-3 w-3 rounded border border-dashed border-slate-400 bg-slate-100" />
              <span className="text-muted-foreground">Indisponible</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-3 w-3 rounded bg-muted" />
              <span className="text-muted-foreground">Passé</span>
            </div>
          </div>

          {/* ── Vue mois ── */}
          {view === "month" && (
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                <div className="grid grid-cols-7 gap-px bg-border rounded-t-lg overflow-hidden">
                  {DAYS.map((d) => (
                    <div key={d} className="bg-muted px-2 py-3 text-center text-sm font-medium text-muted-foreground">
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-px bg-border">
                  {days.map((day, index) => {
                    const dateKey    = day ? formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day) : ""
                    const dayCreneaux = day ? getCreneauxForDate(dateKey) : []
                    const todayCell  = day ? isToday(dateKey) : false
                    const pastDay    = day ? isDayPast(dateKey) : false
                    const fullyOff   = day ? isDayFullyUnavailable(dateKey) : false

                    return (
                      <div
                        key={index}
                        className={cn(
                          "min-h-[120px] bg-card p-2",
                          !day       && "bg-muted/50",
                          pastDay    && "bg-muted/30",
                          fullyOff   && !pastDay && "bg-slate-50 dark:bg-slate-900/20",
                        )}
                      >
                        {day && (
                          <>
                            <div className={cn(
                              "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium mb-1",
                              todayCell && "bg-primary text-primary-foreground",
                              pastDay   && !todayCell && "text-muted-foreground/40",
                              fullyOff  && !pastDay && !todayCell && "text-slate-400 line-through",
                            )}>
                              {day}
                            </div>
                            <div className="space-y-1">
                              {dayCreneaux.slice(0, 3).map((creneau) => (
                                <button
                                  key={creneau.id}
                                  onClick={() => !isPast(creneau) && setSelectedCreneau(creneau)}
                                  className={cn(
                                    "w-full text-left px-2 py-1 rounded text-xs font-medium truncate transition-colors",
                                    getCreneauStyle(creneau)
                                  )}
                                >
                                  {creneau.status === "unavailable"
                                    ? <span className="flex items-center gap-1"><Ban className="h-2.5 w-2.5" />{slotShortLabel(creneau)}</span>
                                    : `${formatTime(creneau.start_time)} – ${slotShortLabel(creneau)}`
                                  }
                                </button>
                              ))}
                              {dayCreneaux.length > 3 && (
                                <p className="text-xs text-muted-foreground pl-2">
                                  +{dayCreneaux.length - 3} de plus
                                </p>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── Vue semaine ── */}
          {view === "week" && (
            <div className="overflow-x-auto">
              <div className="min-w-[900px]">
                <div className="grid grid-cols-8 gap-px bg-border rounded-t-lg overflow-hidden">
                  <div className="bg-muted px-2 py-3 text-center text-sm font-medium text-muted-foreground">Heure</div>
                  {weekDays.map((day, i) => {
                    const dateKey = formatDateKey(day.getFullYear(), day.getMonth(), day.getDate())
                    const todayCol = isToday(dateKey)
                    const pastDay  = isDayPast(dateKey)
                    const fullyOff = isDayFullyUnavailable(dateKey)
                    return (
                      <div
                        key={i}
                        className={cn(
                          "bg-muted px-2 py-3 text-center",
                          todayCol && "bg-primary/10",
                          pastDay  && "bg-muted/60 opacity-60",
                          fullyOff && !pastDay && "bg-slate-100 dark:bg-slate-800/40",
                        )}
                      >
                        <div className={cn(
                          "text-sm font-medium text-muted-foreground",
                          pastDay && "opacity-40",
                        )}>
                          {DAYS[day.getDay()]}
                        </div>
                        <div className={cn(
                          "text-lg font-semibold",
                          todayCol  ? "text-primary"
                          : pastDay  ? "text-muted-foreground/30 line-through"
                          : fullyOff ? "text-slate-400 line-through"
                          : "text-foreground"
                        )}>
                          {day.getDate()}
                        </div>
                        {fullyOff && !pastDay && (
                          <div className="text-[9px] text-slate-400 uppercase tracking-wide">indispo</div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="grid grid-cols-8 gap-px bg-border">
                  {HOURS.map((hour) => (
                    <>
                      <div key={`time-${hour}`} className="bg-card px-2 py-4 text-right text-sm text-muted-foreground">
                        {hour > 12 ? `${hour - 12}h PM` : hour === 12 ? "12h" : `${hour}h`}
                      </div>
                      {weekDays.map((day, dayIndex) => {
                        const dateKey = formatDateKey(day.getFullYear(), day.getMonth(), day.getDate())
                        const pastDay = isDayPast(dateKey)
                        const hourCreneaux = getCreneauxForDate(dateKey).filter((c) => {
                          const sh = parseInt(c.start_time.split(":")[0])
                          const eh = parseInt(c.end_time.split(":")[0])
                          return hour >= sh && hour < eh
                        })
                        const todayCol = isToday(dateKey)

                        return (
                          <div
                            key={`${hour}-${dayIndex}`}
                            className={cn(
                              "bg-card min-h-[60px] p-1 relative",
                              todayCol && "bg-primary/5",
                              pastDay  && "bg-muted/20",
                            )}
                          >
                            {/* Hachures jours passés */}
                            {pastDay && hourCreneaux.length === 0 && (
                              <div
                                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                                style={{
                                  backgroundImage: "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)",
                                  backgroundSize: "6px 6px",
                                }}
                              />
                            )}
                            {hourCreneaux.map((creneau) => (
                              <button
                                key={creneau.id}
                                onClick={() => !isPast(creneau) && setSelectedCreneau(creneau)}
                                className={cn(
                                  "w-full text-left px-2 py-1 rounded text-xs font-medium truncate mb-1 transition-colors",
                                  getCreneauStyle(creneau)
                                )}
                              >
                                {creneau.status === "unavailable"
                                  ? <span className="flex items-center gap-1"><Ban className="h-2.5 w-2.5 shrink-0" />{slotShortLabel(creneau)}</span>
                                  : slotShortLabel(creneau)
                                }
                              </button>
                            ))}
                          </div>
                        )
                      })}
                    </>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Dialog détail créneau ── */}
      <Dialog open={!!selectedCreneau} onOpenChange={() => setSelectedCreneau(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedCreneau && (() => {
            const reservation  = selectedCreneau.reservations?.[0]
            const client       = reservation?.client
            const confirmed    = reservation?.status === "confirmed"
            const hasReservation = (selectedCreneau.reservations?.length ?? 0) > 0
            const isUnavailable = selectedCreneau.status === "unavailable"

            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {isUnavailable
                      ? <><Ban className="h-5 w-5" />Créneau indisponible</>
                      : hasReservation
                        ? <><Building2 className="h-5 w-5" />Visite de propriété</>
                        : <><Clock className="h-5 w-5" />Créneau disponible</>
                    }
                  </DialogTitle>
                  <DialogDescription>
                    {selectedCreneau.bien?.title ?? "Toute l'agence"}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">

                  {/* Bien — si défini */}
                  {selectedCreneau.bien && (
                    <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Bien</p>
                      <p className="font-medium">{selectedCreneau.bien.title}</p>
                      <p className="text-sm text-muted-foreground flex items-start gap-1">
                        <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                        <span className="capitalize">
                          {selectedCreneau.bien.address}, {selectedCreneau.bien.neighborhood}, {selectedCreneau.bien.city}
                        </span>
                      </p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="capitalize text-xs">
                          {selectedCreneau.bien.propertyType}
                        </Badge>
                        <Badge
                          variant={selectedCreneau.bien.listingType === "rent" ? "secondary" : "default"}
                          className="text-xs"
                        >
                          {selectedCreneau.bien.listingType === "rent" ? "À louer" : "À vendre"}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Grille infos */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Agent</p>
                      <p className="font-medium">
                        {selectedCreneau.agent ? agentFullName(selectedCreneau.agent) : "—"}
                      </p>
                      {selectedCreneau.agent?.phone && (
                        <p className="text-xs text-muted-foreground">{selectedCreneau.agent.phone}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium capitalize">
                        {new Date(selectedCreneau.visit_date).toLocaleDateString("fr-FR", {
                          weekday: "long", day: "numeric", month: "long", year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Heure de début</p>
                      <p className="font-medium">{formatTime(selectedCreneau.start_time)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Heure de fin</p>
                      <p className="font-medium">{formatTime(selectedCreneau.end_time)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Statut</p>
                      <div className="mt-1">
                        {isUnavailable && <Badge className="bg-slate-100 text-slate-600">Indisponible</Badge>}
                        {!isUnavailable && !hasReservation && <Badge className="bg-emerald-100 text-emerald-800">Disponible</Badge>}
                        {!isUnavailable && hasReservation && confirmed  && <Badge>Confirmée</Badge>}
                        {!isUnavailable && hasReservation && !confirmed && <Badge variant="secondary">En attente</Badge>}
                      </div>
                    </div>
                    {client && (
                      <div>
                        <p className="text-sm text-muted-foreground">Client</p>
                        <p className="font-medium">{client.prenom} {client.nom}</p>
                        {client.phone && <p className="text-xs text-muted-foreground">{client.phone}</p>}
                      </div>
                    )}
                  </div>

                  {isUnavailable && (
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/20 border border-dashed border-slate-300 text-sm text-muted-foreground text-center">
                      Ce créneau est marqué indisponible — aucune visite possible.
                    </div>
                  )}
                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </>
  )
}