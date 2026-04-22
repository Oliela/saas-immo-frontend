// ============================================================
// COMPOSANT – TaskStats
// Affiche les 3 compteurs en haut de la page (en attente,
// en retard, complétées).
// Les priorités sont commentées – prochaine version.
// ============================================================

import { Clock, AlertCircle, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { ServerTask } from "@/types/task.types"

type Props = {
  tasks: ServerTask[]
}

export function TaskStats({ tasks }: Props) {
  const pending   = tasks.filter((t) => t.status === "pending").length
  const completed = tasks.filter((t) => t.status === "done").length

  // Retard : tâche en attente dont la date de création + 24 h est dépassée
  const overdue = tasks.filter((t) => {
    if (t.status !== "pending") return false
    const due = new Date(t.created_at).getTime() + 24 * 60 * 60 * 1000
    return due < Date.now()
  }).length

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* En attente */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pending}</p>
              <p className="text-sm text-muted-foreground">Tâches en Attente</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Priorité élevée – commenté, prochaine version */}
      {/*
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {tasks.filter((t) => t.priority === "high" && t.status === "pending").length}
              </p>
              <p className="text-sm text-muted-foreground">Priorité Élevée</p>
            </div>
          </div>
        </CardContent>
      </Card>
      */}

      {/* En retard (> 24 h depuis création) */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overdue}</p>
              <p className="text-sm text-muted-foreground">En Retard</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complétées */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completed}</p>
              <p className="text-sm text-muted-foreground">Complétées</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
