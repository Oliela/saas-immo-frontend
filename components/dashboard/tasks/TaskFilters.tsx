// ============================================================
// COMPOSANT – TaskFilters
// Barre de recherche + filtre statut.
// Le filtre priorité est commenté – prochaine version.
// ============================================================

import { Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
  searchQuery: string
  statusFilter: string
  // priorityFilter: string   // prochaine version
  onSearch: (v: string) => void
  onStatusChange: (v: string) => void
  // onPriorityChange: (v: string) => void   // prochaine version
}

export function TaskFilters({
  searchQuery,
  statusFilter,
  onSearch,
  onStatusChange,
}: Props) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {/* Recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher des tâches..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filtre statut */}
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les Statuts</SelectItem>
              <SelectItem value="pending">En Attente</SelectItem>
              <SelectItem value="completed">Complétée</SelectItem>
            </SelectContent>
          </Select>

          {/* Filtre priorité – commenté, prochaine version */}
          {/*
          <Select value={priorityFilter} onValueChange={onPriorityChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les Priorités</SelectItem>
              <SelectItem value="high">Élevée</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="low">Basse</SelectItem>
            </SelectContent>
          </Select>
          */}
        </div>
      </CardContent>
    </Card>
  )
}
