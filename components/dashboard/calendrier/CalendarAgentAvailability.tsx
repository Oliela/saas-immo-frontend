"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Clock, Ban, Building2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { type Creneau, agentFullName, formatTime } from "@/types/creneau"

interface CalendarAgentAvailabilityProps {
  creneaux?: Creneau[]
  date?: string
}

const AGENT_COLORS = [
  "bg-blue-500", "bg-emerald-500", "bg-amber-500",
  "bg-rose-500",  "bg-purple-500", "bg-cyan-500",
]

const getAgentColor = (agentId: number) => AGENT_COLORS[agentId % AGENT_COLORS.length]

const getInitials = (prenom: string, nom: string) =>
  `${prenom?.[0] ?? ""}${nom?.[0] ?? ""}`.toUpperCase()

export default function CalendarAgentAvailability({
  creneaux = [],
  date = new Date().toLocaleDateString("en-CA"),
}: CalendarAgentAvailabilityProps) {

  const [selectedCreneau, setSelectedCreneau] = useState<Creneau | null>(null)

  // ── Tous les créneaux du jour — available ET unavailable ──────────────────
  const todaySlots = creneaux
    .filter((c) => c.visit_date === date)
    .sort((a, b) => a.start_time.localeCompare(b.start_time))

  const availableCount   = todaySlots.filter((c) => c.status === "available").length
  const unavailableCount = todaySlots.filter((c) => c.status === "unavailable").length

  // ── Label affiché pour un créneau sans bien ni agent ─────────────────────
  const slotLabel = (slot: Creneau) => {
    if (slot.agent) return agentFullName(slot.agent)
    if (slot.agency) return slot.agency.name
    return "Agence"
  }

  const slotSubLabel = (slot: Creneau) => {
    if (slot.bien) return slot.bien.title
    return "Toute l'agence"
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Disponibilité du jour</CardTitle>
          <CardDescription className="flex items-center gap-3">
            <span>
              {new Date(date).toLocaleDateString("fr-FR", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </span>
            {availableCount > 0 && (
              <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                {availableCount} dispo
              </Badge>
            )}
            {unavailableCount > 0 && (
              <Badge className="bg-slate-100 text-slate-600 text-xs">
                {unavailableCount} indispo
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {todaySlots.length === 0 ? (
              <p className="text-center text-muted-foreground py-4 text-sm">
                Aucun créneau défini pour aujourd'hui
              </p>
            ) : (
              todaySlots.map((slot) => {
                const isUnavailable = slot.status === "unavailable"

                return (
                  <div
                    key={slot.id}
                    onClick={() => setSelectedCreneau(slot)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer",
                      isUnavailable
                        ? "border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/20 dark:hover:bg-slate-900/40 opacity-70"
                        : "border-dashed border-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20"
                    )}
                  >
                    {/* Avatar / icône */}
                    {isUnavailable ? (
                      <div className="h-8 w-8 rounded-full flex items-center justify-center bg-slate-200 dark:bg-slate-700 shrink-0">
                        <Ban className="h-4 w-4 text-slate-500" />
                      </div>
                    ) : (
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium text-white shrink-0",
                        slot.agent ? getAgentColor(slot.agent.id) : "bg-emerald-500"
                      )}>
                        {slot.agent
                          ? getInitials(slot.agent.prenom, slot.agent.nom)
                          : <Building2 className="h-4 w-4" />
                        }
                      </div>
                    )}

                    {/* Label */}
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-medium text-sm",
                        isUnavailable && "text-muted-foreground line-through"
                      )}>
                        {slotLabel(slot)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                      </p>
                    </div>

                    {/* Bien ou statut */}
                    <div className="text-right shrink-0">
                      {isUnavailable ? (
                        <Badge className="bg-slate-100 text-slate-500 text-xs">Indisponible</Badge>
                      ) : (
                        <>
                          <p className="text-xs text-muted-foreground truncate max-w-[100px]">
                            {slotSubLabel(slot)}
                          </p>
                          {slot.bien?.city && (
                            <p className="text-xs text-muted-foreground capitalize">
                              {slot.bien.city}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Dialog détail ── */}
      <Dialog open={!!selectedCreneau} onOpenChange={() => setSelectedCreneau(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedCreneau?.status === "unavailable"
                ? <><Ban className="h-5 w-5" />Créneau indisponible</>
                : <><Clock className="h-5 w-5" />Créneau disponible</>
              }
            </DialogTitle>
            <DialogDescription>
              {selectedCreneau?.bien?.title ?? "Toute l'agence"}
            </DialogDescription>
          </DialogHeader>

          {selectedCreneau && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium mt-0.5 capitalize">
                    {new Date(selectedCreneau.visit_date).toLocaleDateString("fr-FR", {
                      weekday: "long", day: "numeric", month: "long",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Heure</p>
                  <p className="font-medium mt-0.5">
                    {formatTime(selectedCreneau.start_time)} – {formatTime(selectedCreneau.end_time)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Agent</p>
                  <p className="font-medium mt-0.5">
                    {selectedCreneau.agent
                      ? agentFullName(selectedCreneau.agent)
                      : "—"
                    }
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Bien</p>
                  <p className="font-medium mt-0.5">
                    {selectedCreneau.bien?.title ?? "Toute l'agence"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Statut</p>
                  <div className="mt-0.5">
                    {selectedCreneau.status === "available" && (
                      <Badge className="bg-emerald-100 text-emerald-800">Disponible</Badge>
                    )}
                    {selectedCreneau.status === "unavailable" && (
                      <Badge className="bg-slate-100 text-slate-600">Indisponible</Badge>
                    )}
                    {selectedCreneau.status === "reserved" && (
                      <Badge className="bg-amber-100 text-amber-800">Réservé</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}