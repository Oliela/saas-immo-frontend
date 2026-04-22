"use client"

import { Building2, User, LayoutGrid, List, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { AdaptedAgent, AdaptedProperty } from "./types"

interface Props {
  filterProperty: string
  setFilterProperty: (v: string) => void
  filterAgent: string
  setFilterAgent: (v: string) => void
  filterStatus: string
  setFilterStatus: (v: string) => void
  viewMode: "table" | "calendar"
  setViewMode: (m: "table" | "calendar") => void
  agents: AdaptedAgent[]
  properties: AdaptedProperty[]
}

export function AvailabilityFilters({
  filterProperty, setFilterProperty,
  filterAgent, setFilterAgent,
  filterStatus, setFilterStatus,
  viewMode, setViewMode,
  agents, properties,
}: Props) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3 items-center">

            {/* Filtre propriété */}
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
              <Select value={filterProperty} onValueChange={setFilterProperty}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Toutes les propriétés" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les propriétés</SelectItem>
                  {properties.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtre agent */}
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <Select value={filterAgent} onValueChange={setFilterAgent}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tous les agents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les agents</SelectItem>
                  {agents.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtre statut */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[170px]">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="available">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                      Disponible
                    </div>
                  </SelectItem>
                  <SelectItem value="unavailable">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-slate-400 inline-block" />
                      Indisponible
                    </div>
                  </SelectItem>
                  <SelectItem value="reserved">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-400 inline-block" />
                      Réservé
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Toggle vue */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "calendar" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("calendar")}
              className={cn(viewMode !== "calendar" && "bg-transparent")}
            >
              <LayoutGrid className="mr-2 h-4 w-4" />Calendrier
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
              className={cn(viewMode !== "table" && "bg-transparent")}
            >
              <List className="mr-2 h-4 w-4" />Tableau
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}