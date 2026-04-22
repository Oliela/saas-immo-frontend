"use client"

import { useState } from "react"
import { Clock, User, Building2, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { type Creneau, agentFullName, formatTime } from "@/types/creneau"

interface CalendarDayScheduleProps {
  creneaux?: Creneau[]
}

export default function CalendarDaySchedule({
  creneaux = [],
}: CalendarDayScheduleProps) {

  const [selectedCreneau, setSelectedCreneau] = useState<Creneau | null>(null)

  const today = new Date().toLocaleDateString("en-CA")

  const todayVisits = creneaux
    .filter((c) => c.visit_date === today && c.reservations.length > 0)
    .sort((a, b) => a.start_time.localeCompare(b.start_time))

  const dateLabel = new Date(today).toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })

  return (
    <>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Programme du jour</CardTitle>
          <CardDescription className="capitalize">{dateLabel}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayVisits.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Aucune visite programmée pour aujourd'hui
              </p>
            ) : (
              todayVisits.map((creneau) => {
                const reservation = creneau.reservations[0]
                const client = reservation?.client
                const clientName = client ? `${client.prenom} ${client.nom}` : "Aucun client"
                const isConfirmed = reservation?.status === "confirmed"

                return (
                  <div
                    key={creneau.id}
                    onClick={() => setSelectedCreneau(creneau)}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    {/* Icône statut */}
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg shrink-0",
                      isConfirmed ? "bg-primary/20" : "bg-amber-500/20"
                    )}>
                      <Building2 className={cn(
                        "h-5 w-5",
                        isConfirmed ? "text-primary" : "text-amber-600"
                      )} />
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-foreground truncate">
                          {creneau.bien.title}
                        </h3>
                        <Badge variant={isConfirmed ? "default" : "secondary"}>
                          {isConfirmed ? "Confirmée" : "En attente"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatTime(creneau.start_time)} – {formatTime(creneau.end_time)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {clientName}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">
                        {creneau.bien.neighborhood}, {creneau.bien.city}
                      </p>
                    </div>

                    {/* Agent */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-foreground">
                        {creneau.agent ? `${creneau.agent.prenom} ${creneau.agent.nom}` : `${creneau.agency.name}`}
                      </p>
                      <p className="text-xs text-muted-foreground">{creneau.agent ? "Agent" : "Agence"}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Modal résumé de la visite ── */}
      <Dialog open={!!selectedCreneau} onOpenChange={() => setSelectedCreneau(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedCreneau && (() => {
            const reservation = selectedCreneau.reservations[0]
            const client = reservation?.client
            const isConfirmed = reservation?.status === "confirmed"

            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Résumé de la visite
                  </DialogTitle>
                  <DialogDescription>
                    {selectedCreneau.bien.title}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">

                  {/* Bien */}
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
                      <Badge variant={selectedCreneau.bien.listingType === "rent" ? "secondary" : "default"} className="text-xs">
                        {selectedCreneau.bien.listingType === "rent" ? "À louer" : "À vendre"}
                      </Badge>
                    </div>
                  </div>

                  {/* Grille infos */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Client</p>
                      <p className="font-medium">
                        {client ? `${client.prenom} ${client.nom}` : "—"}
                      </p>
                      {client?.phone && (
                        <p className="text-xs text-muted-foreground">{client.phone}</p>
                      )}
                    </div>
                    {selectedCreneau.agent && (
                      <div>
                        <p className="text-sm text-muted-foreground">Agent</p>
                        <p className="font-medium">{agentFullName(selectedCreneau.agent)}</p>
                        <p className="text-xs text-muted-foreground">{selectedCreneau.agent.phone}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium capitalize">
                        {new Date(selectedCreneau.visit_date).toLocaleDateString("fr-FR", {
                          weekday: "long", day: "numeric", month: "long", year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Horaire</p>
                      <p className="font-medium">
                        {formatTime(selectedCreneau.start_time)} – {formatTime(selectedCreneau.end_time)}
                      </p>
                    </div>
                  </div>

                  {/* Statut */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Statut</p>
                    <Badge variant={isConfirmed ? "default" : "secondary"}>
                      {isConfirmed ? "Confirmée" : "En attente"}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button className="flex-1">
                      Modifier la visite
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Annuler la visite
                    </Button>
                  </div>

                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </>
  )
}
